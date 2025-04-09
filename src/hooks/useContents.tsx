import { useEffect, useReducer } from "react";
import { Cell, Speaker, State, Action } from "../hooks/types";
import { deleteSpeaker } from "../hooks/deleteSpeaker";

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "deleteSpeaker": {
      const ID: number = action.payload.ID;

      const { new_contents, new_speakers } = deleteSpeaker(
        state.contents,
        state.speakers,
        ID,
        null
      );
      return {
        ...state,
        contents: new_contents,
        speakers: new_speakers,
      };
    }
    case "updateSpeakers": {
      const new_contents = state.contents.map((cell) => {
        return {
          ...cell,
          speaker:
            cell.ID !== null ? action.payload.new_speakers[cell.ID] : null,
        };
      });
      return {
        ...state,
        contents: new_contents,
        speakers: action.payload.new_speakers,
      };
    }
    case "addCell": {
      const idx = action.payload.idx;
      const newCell = {
        text: "",
        time: "",
        speaker: null,
        ID: null,
      };
      const new_contents = [...state.contents];
      new_contents.splice(idx, 0, newCell);
      return {
        ...state,
        contents: new_contents,
      };
    }
    case "replaceCell": {
      const { idx, newCells }: { idx: number; newCells: Cell[] } =
        action.payload;

      const new_contents = [...state.contents];
      new_contents.splice(idx, 1, ...newCells);

      return {
        ...state,
        contents: new_contents,
      };
    }
    case "cutCell": {
      const { idx }: { idx: number } = action.payload;

      const new_contents = [...state.contents];
      const cut_cell = new_contents[idx];
      new_contents.splice(idx, 1);
      return {
        ...state,
        contents: new_contents,
        copiedCell: cut_cell,
      };
    }
    case "copyCell": {
      const { idx }: { idx: number } = action.payload;

      const copied_cell = state.contents[idx];
      return {
        ...state,
        copiedCell: copied_cell,
      };
    }
    case "pasteCell": {
      const { idx }: { idx: number } = action.payload;
      if (state.copiedCell === null) return state;

      const new_contents = [...state.contents];
      new_contents.splice(idx, 0, state.copiedCell);
      return {
        ...state,
        contents: new_contents,
      };
    }
    case "assignSpeaker": {
      const { ID, idx }: { ID: number | null; idx: number } = action.payload;

      const oldCell = state.contents[idx];
      const new_contents = state.contents.with(idx, {
        ...oldCell,
        ID: ID,
        speaker: ID !== null ? state.speakers[ID] : null,
      });
      return {
        ...state,
        contents: new_contents,
      };
    }
    case "updateCellText": {
      // IMPORTANT: This dispatch mutates in-place. This might lead to bugs later.
      const { text, idx }: { text: string; idx: number } = action.payload;

      const oldCell = state.contents[idx];
      const new_contents = state.contents.with(idx, {
        ...oldCell,
        text: text,
      });
      state.contents = new_contents;
      localStorage.setItem("state", JSON.stringify(state));
      return state;
    }
    case "setState": {
      const { new_contents, new_speakers } = makeStateConsistent(
        action.payload.contents,
        action.payload.speakers
      );
      return {
        ...state,
        contents: new_contents,
        speakers: new_speakers,
      };
    }
    case "setContents": {
      const { new_contents, new_speakers } = makeStateConsistent(
        action.payload.contents,
        state.speakers
      );

      return {
        ...state,
        contents: new_contents,
        speakers: new_speakers,
        prevfocus: 0,
        newfocus: 0,
      };
    }
    case "collapseSpeakers": {
      let new_speakers: Speaker[] = [...state.speakers];
      let new_contents: Cell[] = [...state.contents];
      // Looping through speakers in reverse, so that when speaker i is removed, all cells with higher IDs can be updated with no unintented effects
      state.speakers.toReversed().forEach((speaker: Speaker, index: number) => {
        const ID = state.speakers.length - index - 1;
        const lowest_ID_with_name = state.speakers.findIndex(
          (s) => s.name === speaker.name
        );
        if (lowest_ID_with_name === ID) {
          return;
        } else {
          ({ new_contents, new_speakers } = deleteSpeaker(
            new_contents,
            new_speakers,
            ID,
            lowest_ID_with_name
          ));
        }
      });
      return {
        ...state,
        contents: new_contents,
        speakers: new_speakers,
      };
    }
    case "clearAll": {
      return {
        ...state,
        contents: [],
        speakers: [
          { name: "Researcher", color: "#A83548" },
          { name: "Interviewee", color: "#369ACC" },
        ],
        copiedCell: null,
      };
    }
    case "selectCell": {
      return {
        ...state,
        newfocus: action.payload.idx,
      };
    }
    case "setSimilarities": {
      const { similarities } = action.payload;

      const new_contents = state.contents.map((cell, index) => {
        return {
          ...cell,
          similarity: similarities[index],
        };
      });
      return {
        ...state,
        contents: new_contents,
      };
    }
  }
  throw Error("Unknown action.");
}

function makeStateConsistent(
  contents: Cell[],
  speakers: Speaker[],
  pad_speakers = true
) {
  // Makes sure all assigned speakers exist and have their names stored in contents,
  // either by removing too big ones, or padding on more
  let max_speaker_ID = speakers.length - 1;
  let new_max_speaker_ID = max_speaker_ID;

  const new_speakers = [...speakers];
  const new_contents = contents.map((cell) => {
    if (cell.ID === null) {
      return cell;
    } else if (cell.ID <= max_speaker_ID) {
      return {
        ...cell,
        speaker: speakers[cell.ID],
      };
    } else {
      if (pad_speakers) {
        new_max_speaker_ID = Math.max(new_max_speaker_ID, cell.ID);
        return {
          ...cell,
          speaker: {
            name: "Speaker " + cell.ID + 1,
            color: "black",
          },
        };
      } else {
        return {
          ...cell,
          ID: null,
          speaker: null,
        };
      }
    }
  });
  while (new_max_speaker_ID > max_speaker_ID) {
    new_speakers.push({
      name: "Speaker " + new_speakers.length,
      color: "black",
    });
    max_speaker_ID = new_speakers.length - 1;
  }

  return { new_contents, new_speakers };
}

function getStorageValue(): State {
  // getting stored value
  const saved = localStorage.getItem("state");
  if (saved) {
    return JSON.parse(saved);
  } else {
    return {
      speakers: [
        { name: "Researcher", color: "#A83548" },
        { name: "Interviewee", color: "#369ACC" },
      ],
      contents: [],
      copiedCell: null,
      prevfocus: null,
      newfocus: null,
    };
  }
}

export function useContents() {
  const [state, dispatch] = useReducer(reducer, getStorageValue());

  useEffect(() => {
    // storing input name
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  const { speakers, contents, newfocus } = state;

  return {
    speakers,
    contents,
    newfocus,
    dispatch,
  };
}
