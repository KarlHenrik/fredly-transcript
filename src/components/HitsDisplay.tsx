import React from "react";
import { Cell, Speaker, Action } from "../hooks/types";
import HitBox from "./HitBox";
//import { v4 as uuidv4 } from 'uuid';

type HitsDisplayProps = {
  speakers: Speaker[];
  contents: Cell[];
  dispatch: React.Dispatch<Action>;
  newfocus: number | null;
  selectedSpeakers: boolean[];
};

function HitsDisplay({
  speakers,
  contents,
  dispatch,
  newfocus,
  selectedSpeakers,
}: HitsDisplayProps) {
  if (contents) {
    if (contents[0].similarity === null) {
      return null;
    }
    const inds = contents.keys().toArray();
    inds.sort(
      (a: number, b: number) => contents[b].similarity - contents[a].similarity
    );
    const sorted = contents.toSorted(
      (a: Cell, b: Cell) => b.similarity - a.similarity
    );
    const filtered = sorted.filter((cell) => selectedSpeakers[cell.ID]);
    return filtered.map((cell: Cell, idx: number) => (
      <HitBox
        key={idx + cell.text + "s"}
        idx={idx}
        old_idx={inds[idx]}
        cell={cell}
        speakers={speakers}
        dispatch={dispatch}
        newfocus={newfocus === idx ? newfocus : null}
      ></HitBox>
    ));
  } else {
    return null;
  }
}

export default HitsDisplay;
