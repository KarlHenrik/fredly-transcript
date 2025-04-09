import React, { useState } from "react";
import "./SpeakerSettings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Speaker, Action } from "../hooks/types";

type SpeakerSettignsProps = {
  dispatch: React.Dispatch<Action>;
  speakers: Speaker[];
  setSelectedSpeakers: React.Dispatch<React.SetStateAction<boolean[]>>;
  selectedSpeakers: boolean[];
  contentEditable: boolean;
  embeddingView: boolean;
};

function SpeakerSettings({
  speakers,
  dispatch,
  selectedSpeakers,
  setSelectedSpeakers,
  contentEditable,
  embeddingView,
}: SpeakerSettignsProps) {
  const [inputs, setInputs] = useState(() => speakers.map((r) => r));
  const [editing, setEditing] = useState(false);

  function newName(new_value: string, idx: number) {
    const new_names = inputs.with(idx, {
      name: new_value,
      color: inputs[idx].color,
    });
    setInputs(new_names);
  }
  function newColor(new_value: string, idx: number) {
    const new_color = inputs.with(idx, {
      name: inputs[idx].name,
      color: new_value,
    });
    setInputs(new_color);
  }

  function sumbitSpeakers() {
    const new_speakers = speakers.map((_, idx) => {
      return {
        color: inputs[idx].color,
        name: inputs[idx].name,
      };
    });
    dispatch({
      type: "updateSpeakers",
      payload: {
        new_speakers: new_speakers,
      },
    });
    setEditing(false);
  }

  return (
    <div>
      <div className="flex">
        {embeddingView && (
          <input
            type="checkbox"
            checked={selectedSpeakers.every((s) => s)}
            onChange={(e) =>
              setSelectedSpeakers(selectedSpeakers.map((s) => e.target.checked))
            }
          />  
        )}
        Speakers:
        {contentEditable && (
          <span
            onClick={() => {
              setEditing(!editing);
            }}
            className="Edit"
          >
          <FontAwesomeIcon icon={faPen} />
        </span>
        )}
      </div>
      {speakers.map((speaker, idx) => (
        <div key={idx}>
          {embeddingView && (
          <input
            type="checkbox"
            checked={selectedSpeakers[idx]}
            onChange={(e) =>
              setSelectedSpeakers(
                selectedSpeakers.with(idx, !selectedSpeakers[idx])
              )
            }
          />
          )}
          <>{contentEditable ? (idx + 1 + ":") : ""}</>
          {!editing && (
            <>
              <b style={{ color: speaker.color }}>{speaker.name}</b>
            </>
          )}
          {editing && (
            <div className="flex">
              {" "}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sumbitSpeakers();
                }}
              >
                <input
                  value={inputs[idx].name}
                  onChange={(e) => newName(e.target.value, idx)}
                ></input>
              </form>
              <input
                className="h-6 w-6"
                type="color"
                id="favcolor"
                value={inputs[idx].color}
                onChange={(e) => newColor(e.target.value, idx)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SpeakerSettings;
