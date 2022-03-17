import cn from "classnames";
import { useMemo } from "react";
import twemoji from "twemoji";
import { allWordsGuessed, NUM_GUESSES, useSelector } from "../store";

type ResultProps = {
  hidden: boolean;
};
export default function Result(props: ResultProps) {
  const id = useSelector((s) => s.id);

  const targets = useSelector((s) => s.targets);
  const guesses = useSelector((s) => s.guesses);

  const shareableText = useMemo(() => {
    const targetGuessCounts: (number | null)[] = [];
    for (const target of targets) {
      const idx = guesses.indexOf(target);
      targetGuessCounts.push(idx === -1 ? null : idx + 1);
    }
    const guessCount = allWordsGuessed(guesses, targets)
      ? guesses.length
      : null;
    return getShareableText(id, guessCount, targetGuessCounts);
  }, [id, targets, guesses]);
  const parsed = twemoji.parse(shareableText) + "\n";
  const handleCopyToClipboardClick = () => {
    navigator.clipboard
      .writeText(shareableText)
      .then(() => alert("Copied results to clipboard!"))
      .catch(() => alert("There was an error copying text to the clipboard"));
  };

  return (
    <div className={cn("result", props.hidden && "hidden")}>
      <div className="share">
        <pre className="text" dangerouslySetInnerHTML={{ __html: parsed }} />
        <button onClick={handleCopyToClipboardClick}>copy to clipboard</button>
      </div>
      <div className="words">
        {targets.map((target, i) => (
          <p key={i}>{target}</p>
        ))}
      </div>
    </div>
  );
}

const EMOJI_MAP = [
  ["0", "0️⃣"],
  ["1", "1️⃣"],
  ["2", "2️⃣"],
  ["3", "3️⃣"],
  ["4", "4️⃣"],
  ["5", "5️⃣"],
  ["6", "6️⃣"],
  ["7", "7️⃣"],
  ["8", "8️⃣"],
  ["9", "9️⃣"],
];

function getShareableText(
  id: number,
  guessCount: number | null,
  targetGuessCounts: (number | null)[]
) {
  const text = [];
  text.push(`Daily Quadrasexordle #${id}\n`);
  text.push(`Guesses: ${guessCount ?? "X"}/${NUM_GUESSES}\n`);
  for (let i = 0; i < 16; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      const guessCount = targetGuessCounts[i * 4 + j];
      if (guessCount === null) {
        row.push("🟥🟥");
      } else {
        let text = guessCount.toString().padStart(2, "0");
        for (const [num, emoji] of EMOJI_MAP) {
          text = text.replaceAll(num, emoji);
        }
        row.push(text);
      }
    }

    text.push(row.join(" ") + "\n");
  }
  text.push("https://quadrasexordle.com/");
  return text.join("");
}
