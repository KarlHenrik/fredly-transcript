import "./App.css";
import DownloadWordButton from "./DownloadWordButton";
import DownloadVTTButton from "./DownloadVTTButton";
import FileSelector from "./FileSelector";
import SpeakerSettings from "./SpeakerSettings";
import TextDisplay from "./TextDisplay";
import Tutorial from "./Tutorial";
import AudioPlayer from "./AudioPlayer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContents } from "../hooks/useContents";
import Embedder from "./Embedder";
import HitsDisplay from "./HitsDisplay";
import { useCompactContents } from "../hooks/useCompactContents";
import { View } from "../hooks/types";

function App() {
  const [fileName, setFileName] = useLocalStorage<string | null>(
    "fileName",
    null
  );
  const { speakers, contents, newfocus, dispatch } = useContents();
  const [selectedSpeakers, setSelectedSpeakers] = useState<boolean[]>(() =>
    speakers.map((s) => true)
  );
  const [view, setView] = useState<View>(View.Standard);
  const [compactContents, compactFocus] = useCompactContents(contents, newfocus, view);
  const [embeddingView, setEmbeddingView] = useState(false);

  function clearAll() {
    dispatch({ type: "clearAll" });
    setFileName(null);
  }
  return <div className="flex flex-row min-h-0 w-full h-screen">
    {/*Sidebar*/}
    <div className="flex flex-col items-center gap-10 bg-[#fdf5e6] pt-20 w-2/12">
      <div className="flex flex-col gap-1">
        <button style={{ border: view === View.Standard ? "2px solid rgba(70, 169, 255, 0.4)" : "2px solid transparent", padding: "2px" }} onClick={() => setView(View.Standard)}>Standard View</button>
        <button style={{ border: view === View.Compact ? "2px solid rgba(70, 169, 255, 0.4)" : "2px solid transparent", padding: "2px" }} onClick={() => setView(View.Compact)}>Compact View</button>
        <button style={{ border: view === View.Editing ? "2px solid rgba(70, 169, 255, 0.4)" : "2px solid transparent", padding: "2px" }} onClick={() => setView(View.Editing)}>Editing View</button>
      </div>
      <AudioPlayer></AudioPlayer>
      <SpeakerSettings
        speakers={speakers}
        dispatch={dispatch}
        selectedSpeakers={selectedSpeakers}
        setSelectedSpeakers={setSelectedSpeakers}
        view={view}
        embeddingView={embeddingView}
      />
      <Embedder
        speakers={speakers}
        newfocus={newfocus}
        dispatch={dispatch}
        contents={contents}
        embeddingView={embeddingView}
        setEmbeddingView={setEmbeddingView}
      ></Embedder>
      <div>
        <DownloadWordButton
          contents={(view === View.Compact ? compactContents : contents)}
          speakers={speakers}
          fileName={fileName}
        />
        <DownloadVTTButton contents={contents} fileName={fileName} />
        <Tutorial></Tutorial>
      </div>
    </div>
    {/*Content Area*/}
    {(contents?.length === 0) ? ( /*There are no contents to render*/
      <div className="w-10/12 pt-20">
        <FileSelector
          setFileName={setFileName}
          speakers={speakers}
          dispatch={dispatch}
        />
      </div>
    ) : ( /*There are contents to render*/
      <div className="flex flex-row w-10/12">
        {/*Main Content*/}
        <div className="flex flex-col">
          {/*Header*/}
          <div className="text-2xl flex justify-center">
            {fileName && (
              <>
                {fileName}
                <FontAwesomeIcon
                  className="buttonAction"
                  onClick={clearAll}
                  icon={faTrash}
                  size="xs"
                />
              </>
            )}
            {!fileName && <>Choose a transcript below</>}
          </div>
          {/*Cells*/}
          <div className="overflow-y-scroll ">
            {(view === View.Compact) ? ( 
              <TextDisplay
                contents={compactContents}
                newfocus={compactFocus}
                dispatch={dispatch}
                speakers={speakers}
                view={view}
                embeddingView={embeddingView}
              />
            ) : ( 
              <TextDisplay
                contents={contents}
                newfocus={newfocus}
                dispatch={dispatch}
                speakers={speakers}
                view={view}
                embeddingView={embeddingView}
              />
            )}
          </div>
        </div>
        {/*Embedding Content*/}
        {(embeddingView) ? ( /*We include the embedding view*/
          <div className="flex flex-col">
            {/*Header*/}
            {embeddingView && (
              <div className="text-2xl text-center">Query Results</div>
            )}
            {/*Cells*/}
            <div className="overflow-y-scroll">
              <HitsDisplay
                contents={contents}
                newfocus={newfocus}
                dispatch={dispatch}
                speakers={speakers}
                selectedSpeakers={selectedSpeakers}
              />
            </div>
          </div>
        ) : (null)}
      </div>
    )}
  </div>;
}

export default App;
