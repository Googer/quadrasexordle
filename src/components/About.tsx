import cn from "classnames";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { START_DATE } from "../consts";
import { hidePopups, useSelector } from "../store";

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
export default function About() {
  const dispatch = useDispatch();
  const [hoursRemaining, setHoursRemaining] = useState(getHoursRemaining);
  const shown = useSelector((s) => s.popups.about);

  useEffect(() => {
    // Update hoursRemaining every time popup is opened
    if (shown) {
      setHoursRemaining(getHoursRemaining);
    }
  }, [shown]);

  return (
    <div className={cn("popup-wrapper", !shown && "hidden")}>
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
        <a
          href="https://ko-fi.com/H2H0BTKB3"
          target="_blank"
          style={{
            marginTop: "6px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <img
            height="36"
            style={{
              border: "0px",
              height: "36px",
            }}
            src="https://cdn.ko-fi.com/cdn/kofi1.png?v=3"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
        <hr className="separator" />
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
        <button className="close" onClick={() => dispatch(hidePopups())}>
          close
        </button>
      </div>
    </div>
  );
}
