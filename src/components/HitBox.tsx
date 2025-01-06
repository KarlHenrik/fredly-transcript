import React, { useEffect, useRef, useState } from "react";
import { Cell, Speaker, Action } from "../hooks/types";
import { KeyboardEvent } from "react";

type HitBoxProps = {
  cell: Cell;
  idx: number;
  dispatch: React.Dispatch<Action>;
  speakers: Speaker[];
  newfocus: number | null;
  old_idx: number;
};

function HitBox({
  cell,
  idx,
  old_idx,
  dispatch,
  speakers,
  newfocus,
}: HitBoxProps) {
  function selectCell() {
    dispatch({
      type: "selectCell",
      payload: {
        idx: old_idx,
      },
    });
  }

  return (
    <div
      className="pr-1 grid grid-rows-[auto_auto] grid-cols-[8rem_auto] gap-x-4"
      onClick={selectCell}
    >
      <div
        className="col-start-1 row-span-2 w-15 text-right bg-[var(--default-color)] pr-3 focus-within:outline outline-[#46a9ff]"
        style={{
          '--default-color': `rgba(114,114,114,${cell.similarity**1.5})`,
        }}
        tabIndex={0}
      >
        <div
          className="pl-1 text-left"
          style={{ opacity: 0.1 + cell.similarity || "0.5" }}
        >
          <b>{Math.round(cell.similarity * 100) || <br />}</b>
        </div>
        <b style={{ color: cell.speaker?.color || "black" }}>
          {cell.speaker && cell.speaker.name}
          {cell.ID !== null && ": "}
          {cell.ID === null && "-"}
        </b>
      </div>

      <div className="h-auto col-start-2">{cell.time || "-"}</div>

      <div
        className="text-left col-start-2 whitespace-pre-line pb-4 display:inline-block"
        tabIndex={0}
      >
        {cell.text}
      </div>
    </div>
  );
}

export default HitBox;
