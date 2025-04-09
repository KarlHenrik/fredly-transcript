import { Cell, Speaker } from "../hooks/types";

export function deleteSpeaker(
  contents: Cell[],
  speakers: Speaker[],
  ID: number,
  replacementID: number | null = null
) {
  const new_speakers = [...speakers];
  new_speakers.splice(ID, 1);
  const new_contents = contents.map((cell) => {
    if (cell.ID === null) return cell;
    if (cell.ID === ID) {
      return {
        ...cell,
        ID: replacementID,
        speaker: replacementID !== null ? speakers[replacementID] : null,
      };
    } else if (cell.ID > ID) {
      // If the ID is greater, decrement it.
      return { ...cell, ID: cell.ID - 1 };
    }
    // Otherwise, keep the cell unchanged.
    return cell;
  });
  return { new_contents, new_speakers };
}