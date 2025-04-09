import React from "react";
import TextBox from "./TextBox";
import { Cell, Speaker, Action, View } from "../hooks/types";
//import { v4 as uuidv4 } from 'uuid';

type TextDisplayProps = {
  speakers: Speaker[];
  contents: Cell[];
  dispatch: React.Dispatch<Action>;
  newfocus: number | null;
  view: View;
  embeddingView: boolean;
};

function TextDisplay({
  speakers,
  contents,
  dispatch,
  newfocus,
  view,
  embeddingView
}: TextDisplayProps) {
  console.log("TextDisplay");
  if (contents) {
    return contents.map((cell, idx) => (
      <>
      <TextBox
        key={idx + cell.text}
        idx={idx}
        cell={cell}
        speakers={speakers}
        dispatch={dispatch}
        newfocus={newfocus === idx ? newfocus : null}
        view={view}
        embeddingView={embeddingView}
      ></TextBox>
      </>
    ));
  } else {
    return null;
  }
}

export default TextDisplay;
