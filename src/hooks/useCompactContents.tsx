import { Cell, State } from "./types";
import { useState, useEffect } from "react";

export function useCompactContents(contents: Cell[], prevfocus: number | null, compactView: boolean): [Cell[], number | null] {
  const [compactContents, setCompactContents] = useState<Cell[]>([]);
  const [compactFocus, setCompactFocus] = useState<number | null>(null);

  useEffect(() => {
    if (compactView) {
      const [ new_contents, new_focus ] = mergeCells(contents, prevfocus);
      setCompactContents(new_contents);
      setCompactFocus(new_focus);
    } else {
      setCompactContents([]);
      setCompactFocus(null);
    }
  }, [compactView]);

  return [compactContents, compactFocus];
}

function mergeCells(contents: Cell[], prevfocus: number | null) {
    const new_contents: Cell[] = [];
    let new_focus = prevfocus;
    contents.forEach((cell, idx) => {
      cell = { ...cell };
      if ((prevfocus !== null) && (idx == prevfocus)) {
        new_focus = new_contents.length;
      }

      if (cell.ID === null) {
        new_contents.push(cell);
        return;
      } else if (idx === 0) {
        // We only collapse upwards, so first cell is safe
        new_contents.push(cell);
        return;
      } else if (
        cell.ID === null ||
        cell.ID !== new_contents[new_contents.length - 1].ID
      ) {
        // No ID match
        new_contents.push(cell);
        return;
      }
      if ((prevfocus !== null) && (idx == prevfocus)) {
        new_focus = new_contents.length - 1;
      }

      const old_text = new_contents[new_contents.length - 1].text;
      const last_paragraph = old_text.split("\n\n").slice(-1)[0];
      if ((last_paragraph + " " + cell.text).length > 300) {
        // Add newlines if the last paragraph is long
        new_contents[new_contents.length - 1].text += "\n\n" + cell.text;
      } else {
        new_contents[new_contents.length - 1].text += " " + cell.text;
      }
    });
    return [
      new_contents,
      new_focus,
    ];
  }