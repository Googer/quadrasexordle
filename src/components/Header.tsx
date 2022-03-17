import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getTodaysId,
  isSerialized,
  loadState,
  NUM_BOARDS,
  NUM_GUESSES,
  startGame,
  useSelector,
} from "../store";
import { MersenneTwister } from "../util";
import helpSvg from "../assets/help.svg";
import fullscreenSvg from "../assets/fullscreen.svg";
import fullscreenExitSvg from "../assets/fullscreen-exit.svg";

// Declare typescript definitions for safari fullscreen stuff
declare global {
  interface Document {
    webkitFullscreenElement: Element | null;
    webkitExitFullscreen: () => void;
  }
  interface HTMLElement {
    webkitRequestFullscreen: () => void;
  }
}

function isFullscreen() {
  const element =
    document.fullscreenElement || document.webkitFullscreenElement;
  return Boolean(element);
}

type HeaderProps = {
  onShowHelp: () => void;
};
export default function Header(props: HeaderProps) {
  const dispatch = useDispatch();
  const id = useSelector((s) => s.id);
  const targets = useSelector((s) => s.targets);
  const guesses = useSelector((s) => s.guesses);
  const boardsCompleted = useMemo(
    () =>
      targets
        .map((target) => guesses.indexOf(target) !== -1)
        .reduce((a, v) => a + (v ? 1 : 0), 0),
    [targets, guesses]
  );
  const numGuesses = guesses.length;
  const practice = useSelector((s) => s.practice);
  const title = practice
    ? `Practice Quadrasexordle`
    : `Daily Quadrasexordle #${id}`;

  // Refs so that the buttons are blurred on press
  // so that pressing enter again does not cause the
  // button to be activated again
  const practiceRef = useRef<HTMLButtonElement>(null);
  const newRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const handlePracticeClick = () => {
    practiceRef.current?.blur();
    const id = MersenneTwister().u32();
    dispatch(startGame({ id, practice: true }));
  };
  const handleNewClick = () => {
    newRef.current?.blur();
    const res = window.confirm(
      "Are you sure you want to start a new practice quadrasexordle?\n" +
        "(Your current progress will be lost)"
    );
    if (!res) return;
    const id = MersenneTwister().u32();
    dispatch(startGame({ id, practice: true }));
  };
  const handleBackClick = () => {
    backRef.current?.blur();
    const res = window.confirm(
      "Are you sure you want to exit practice mode?\n" +
        "(Your current progress will be lost)"
    );
    if (!res) return;
    const text = localStorage.getItem("quadrasexordle-state");
    const serialized = text && JSON.parse(text);
    if (isSerialized(serialized)) {
      dispatch(loadState({ serialized }));
    } else {
      dispatch(startGame({ id: getTodaysId(), practice: false }));
    }
  };

  const [fullscreen, setFullscreen] = useState(isFullscreen);
  useEffect(() => {
    const handler = () => {
      setFullscreen(isFullscreen);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);
  const handleFullscreenClick = () => {
    if (isFullscreen()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    }
  };

  return (
    <div className="header">
      <div className="row-1">
        {practice ? (
          <>
            <button ref={backRef} onClick={handleBackClick}>
              Back
            </button>
            <button ref={newRef} onClick={handleNewClick}>
              New
            </button>
          </>
        ) : (
          <>
            <button ref={practiceRef} onClick={handlePracticeClick}>
              Practice
            </button>
            <div></div>
          </>
        )}
        <p className="title">{title}</p>
        <img
          className="help"
          src={helpSvg}
          alt="Help"
          onClick={props.onShowHelp}
        />
        <img
          className="fullscreen"
          src={fullscreen ? fullscreenExitSvg : fullscreenSvg}
          alt="Go Fullscreen"
          onClick={handleFullscreenClick}
        />
      </div>
      <div className="row-2">
        <p className="status">
          Boards Complete: {boardsCompleted}/{NUM_BOARDS}
        </p>
        <p>
          Guesses Used: {numGuesses}/{NUM_GUESSES}
        </p>
      </div>
    </div>
  );
}
