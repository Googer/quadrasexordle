import cn from "classnames";
import { useEffect, useState } from "react";
import { START_DATE } from "../store";

function getHoursRemaining() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  const hoursRemaining = 24 - ((diff / 1000 / 60 / 60) % 24);
  if (hoursRemaining > 0.95) {
    return hoursRemaining.toFixed(0);
  } else {
    return hoursRemaining.toFixed(1);
  }
}

type PopupProps = {
  hidden: boolean;
  onClose: () => void;
};
export default function Popup(props: PopupProps) {
  const [hoursRemaining, setHoursRemaining] = useState(getHoursRemaining);

  useEffect(() => {
    // Update hoursRemaining every time popup is opened
    if (!props.hidden) {
      setHoursRemaining(getHoursRemaining);
    }
  }, [props.hidden]);

  return (
    <div className={cn("popup-wrapper", props.hidden && "hidden")}>
      <div className="popup">
        <p>Guess all 64 Quadrasexordle words in 69 tries!</p>
        <p>
          A new Daily Quadrasexordle will be available in {hoursRemaining} hour
          {hoursRemaining === "1" ? "" : "s"}.
        </p>
        <hr className="separator" />
        <p>Quadrasexordle by Matt Legowski</p>
        <p>
          Source code on{" "}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/Googer/quadrasexordle"
          >
            GitHub
          </a>
        </p>
        <p>Based on</p>
        <ul>
          <li>
            <a
                rel="noreferrer"
                target="_blank"
                href="https://duotrigordle.com/"
            >
              Duotrigordle
            </a>{" "}
            by Bryan Chen
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://hexadecordle.co.uk/"
            >
              Hexadecordle
            </a>{" "}
            by Alfie Rayner
          </li>
          <li>
            <a rel="noreferrer" target="_blank" href="https://octordle.com/">
              Octordle
            </a>{" "}
            by Kenneth Crawford
          </li>
          <li>
            <a rel="noreferrer" target="_blank" href="https://quordle.com/">
              Quordle
            </a>{" "}
            by @fireph
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://zaratustra.itch.io/dordle"
            >
              Dordle
            </a>{" "}
            by Guilherme S. Töws
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.nytimes.com/games/wordle/index.html"
            >
              Wordle
            </a>{" "}
            by Josh Wardle
          </li>
        </ul>
        <button className="close" onClick={props.onClose}>
          close
        </button>
      </div>
    </div>
  );
}
