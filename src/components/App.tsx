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
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { useContents } from "../hooks/useContents";
import Embedder from "./Embedder";
import HitsDisplay from "./HitsDisplay";

function App() {
  const [fileName, setFileName] = useLocalStorage<string | null>(
    "fileName",
    null
  );
  const { speakers, contents, newfocus, dispatch } = useContents();
  const [selectedSpeakers, setSelectedSpeakers] = useState<boolean[]>(() =>
    speakers.map((s) => true)
  );

  function clearAll() {
    dispatch({ type: "clearAll" });
    setFileName(null);
  }

  return (
    <div className="flex flex-col h-screen overflow-y-hidden">
      {/*Header*/}
      <div className="flex flex-row">
        <div className="w-2/12 bg-[#fdf5e6]"></div>
        <div className="w-5/12 text-3xl pb-4 flex justify-center">
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
        <div className="w-5/12 text-3xl text-center pb-4">Query Results</div>
      </div>
      {/*Main Area*/}
      <div className="flex flex-row min-h-0 h-full">
        <div className="flex flex-row w-full h-full">
          {/*Sidebar*/}
          <div className="flex flex-col items-center gap-10 bg-[#fdf5e6] pt-2 w-2/12">
            <AudioPlayer></AudioPlayer>
            <SpeakerSettings
              speakers={speakers}
              dispatch={dispatch}
              selectedSpeakers={selectedSpeakers}
              setSelectedSpeakers={setSelectedSpeakers}
            />

            <Embedder
              speakers={speakers}
              newfocus={newfocus}
              dispatch={dispatch}
              contents={contents}
            ></Embedder>
            <div>
              <DownloadWordButton
                contents={contents}
                speakers={speakers}
                fileName={fileName}
              />
              <DownloadVTTButton contents={contents} fileName={fileName} />
              <Tutorial></Tutorial>
            </div>
          </div>
          {contents?.length === 0 && (
            <div className="w-10/12">
              <FileSelector
                setFileName={setFileName}
                speakers={speakers}
                dispatch={dispatch}
              />
            </div>
          )}
          {contents?.length !== 0 && (
            <div className="flex flex-col overflow-y-scroll w-5/12 pr-5">
              <TextDisplay
                contents={contents}
                newfocus={newfocus}
                dispatch={dispatch}
                speakers={speakers}
              />
            </div>
          )}
          {contents?.length !== 0 && (
            <div className="flex flex-col overflow-y-scroll w-5/12 pr-5">
              <HitsDisplay
                contents={contents}
                newfocus={newfocus}
                dispatch={dispatch}
                speakers={speakers}
                selectedSpeakers={selectedSpeakers}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
