import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Tutorial() {
  // Component logic here
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="Tutorial">
      <div className="buttonAction" onClick={() => setIsExpanded(!isExpanded)}>
        <FontAwesomeIcon className="symbol" icon={faCircleQuestion} /> Help
      </div>
      {isExpanded && (
        <ul>
          <li>Click to the left of a text cell to select a speaker cell</li>
          <li>Move between speaker cells with ArrowUp/ArrowDown or W/S</li>
          <li>Assign speakers with number keys</li>
          <li>Unassign speakers with |(to the left of 1) or Backspace</li>

          <li>Edit text like with any editor (Crtl+Z/Y works!)</li>
          <li>Swap between selecting text and speaker cells with Tab</li>
          <li>Exit the text cell with Esc</li>
          <li>Assign speakers to selected text with number keys</li>

          <li>Add cell above with A</li>
          <li>Add cell below with B</li>
          <li>Cut cell with X</li>
          <li>Paste cell with V</li>
          <li>
            Swap two speakers by clicking <span>here</span>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Tutorial;
