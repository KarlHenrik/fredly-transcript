import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Cell, Action, Speaker } from "../hooks/types";

type EmbedderProps = {
  contents: Cell[];
  dispatch: React.Dispatch<Action>;
  speakers: Speaker[];
  newfocus: number | null;
  embeddingView: boolean;
  setEmbeddingView: React.Dispatch<React.SetStateAction<boolean>>;
};

function Embedder({ speakers, contents, newfocus, dispatch, embeddingView, setEmbeddingView }: EmbedderProps) {
  //@ts-expect-error haven't fixed null stuff, code should work
  const worker: MutableRefObject<Worker> = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [embedded, setEmbedded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Start the worker process on mount
    if (!worker.current) {
      worker.current = new Worker(new URL("./worker.tsx", import.meta.url), {
        type: "module",
      });
    }
    // Handler of incoming messages from worker process
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "query_complete":
          dispatch({
            type: "setSimilarities",
            payload: {
              similarities: JSON.parse(e.data.result),
            },
          });
          break;
        case "embedding_complete":
          setEmbedded(true);
          break;
        case "progress":
          setProgress(e.data.progress);
          break;
        case "ready":
          setReady(true);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  function embed_cells() {
    worker.current.postMessage({
      text: contents.map((c) => c.text),
      action: "embed",
    });
  }

  function submit(e) {
    e.preventDefault()
    embed_query()
  }

  function embed_query() {
    worker.current.postMessage({
      text: query,
      action: "query",
    });
  }

  function pasteWithoutFormatting(e) {
    e.preventDefault();
    
    // Get text from the clipboard
    const text = e.clipboardData.getData('text/plain');

    // Insert text into HTML document
    document.execCommand('insertText', false, text);
  }

  return (
    <div className="pl-2 w-full">
      <button className="" onClick={() => setEmbeddingView(!embeddingView)}>Query View</button>
      <div className="w-5/6 border-[0.15rem] border-transparent p-[5px] hover:border-gray-500 hover:bg-gray-300 hover:cursor-pointer" onClick={embed_cells}>Embed Interview</div>
      <div className="border-[0.15rem] border-transparent p-[5px]">Model: {ready ? "Ready" : progress == 0 ? "-" : "Loading: " + progress}</div>
      <div className="border-[0.15rem] border-transparent p-[5px]">Embedding: {!ready ? "-" : embedded? "Ready" : "Loading..."}</div>
      <div className="flex gap-2" style={{ visibility: embedded ? 'visible' : 'hidden' }}>
        <span
          value={query}
          onKeyDown={(e) => (e.key == "Enter" && !e.shiftKey) ? submit(e) : ""}
          onInput={(e) => setQuery(e.currentTarget.textContent || "")}
          onPaste={(e) => pasteWithoutFormatting(e)}
          className="QueryInput p-1 w-[70%] rounded-sm field-sizing-content resize-none bg-white"
          contentEditable={true}
        ></span>
        <button className="border-[0.15rem] border-transparent p-[5px] hover:border-gray-500 hover:bg-gray-300 hover:cursor-pointer" onClick={embed_query}>Query</button>
      </div>
    </div>
  );
}

export default Embedder;
