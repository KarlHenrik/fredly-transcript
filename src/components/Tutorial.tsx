import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { createPortal } from 'react-dom';

function Tutorial() {
  // Component logic here
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="Tutorial">
      <div className="buttonAction" onClick={() => setIsExpanded(!isExpanded)}>
        <FontAwesomeIcon className="symbol" icon={faCircleQuestion} /> Help
      </div>
      {isExpanded && createPortal(
        <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 bg-white border-4 rounded-l p-3 fixed">
          <div className="flex justify-between pb-2">
            <div className="text-xl">Tutorial</div>
            <button onClick={() => setIsExpanded(!isExpanded)}>Close</button>
          </div>
          
          <ul>
            <b>Embedding and Queries</b>
            <li>Click the "Embed Interview" button to embed the loaded text</li>
            <li>Embedding might take a minute for longer texts, or just break for really long texts</li>
            <li>Write a query that you want to compute similarities with</li>
            <li>Press Enter or the Query button to submit</li>
            <li>The view on the right will contain the cells sorted by similarity to the query </li>
            <li>Click a cell on the right to scroll to that cell in the left interview view</li>

            <b>Text editing</b>
            <li>Click to the left of a text cell to select a speaker cell</li>
            <li>Move between speaker cells with ArrowUp/ArrowDown or W/S</li>
            <li>Assign speakers with number keys</li>
            <li>Unassign speakers with the key to the left of 1, or Backspace</li>

            <li>Edit text like with any editor (Crtl+Z/Y works!)</li>
            <li>Swap between selecting text and speaker cells with Tab</li>
            <li>Exit the text cell with Esc</li>
            <li>Assign speakers to selected text with number keys</li>

            <li>Add cell above with A</li>
            <li>Add cell below with B</li>
            <li>Cut cell with X</li>
            <li>Paste cell with V</li>
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Tutorial;
