import { useState } from "react";
import type { Job, GuessEntry } from "../lib/types";

interface Props {
  won: boolean;
  guesses: GuessEntry[];
  answer: Job;
  onClose: () => void;
}

export default function ResultModal({ won, guesses, answer, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const hired = answer.years["2025"]?.hired ?? 0;
  const fired = answer.years["2025"]?.fired ?? 0;

  const emojis = won
    ? ["🎉", "🏆", "🧠", "⭐"][guesses.length % 4]
    : "😞";

  function share() {
    const icons = guesses
      .map((g) => (g.isCorrect ? "🟢" : g.similarity >= 55 ? "🟡" : "🔴"))
      .join("");
    const score = won ? `${guesses.length}/6` : "X/6";
    const txt = `CAREERDLE — ${score}\n${icons}`;
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="m-emoji">{emojis}</div>
        <div className="m-title">{won ? "NAILED IT!" : "GAME OVER"}</div>
        <div className="m-sub">
          {won
            ? `Solved in ${guesses.length} guess${guesses.length !== 1 ? "es" : ""}!`
            : "The answer was..."}
        </div>
        <div className="m-answer">
          <div className="m-job">{answer.title}</div>
          <div className="m-stats">
            <div className="m-stat">
              Salary: <span>${answer.salary.toLocaleString()}</span>
            </div>
            <div className="m-stat">
              Industry: <span>{answer.category}</span>
            </div>
            <div className="m-stat">
              Education: <span>{answer.education}</span>
            </div>
            <div className="m-stat">
              Stress: <span>{answer.stress}/5</span>
            </div>
            <div className="m-stat">
              Hired '25: <span>{hired.toLocaleString()}</span>
            </div>
            <div className="m-stat">
              Laid off: <span>{fired.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="m-fact">
          💡 This job is in the {answer.category} industry with a $
          {Math.round(answer.salary / 1000)}K median salary.{" "}
          {hired > 5000
            ? `With ${hired.toLocaleString()} new hires in 2025, it's a high-demand career.`
            : `With ${hired.toLocaleString()} hires in 2025, it's a specialized role.`}
        </div>
        <div className="m-btns">
          <button className="mbtn pri" onClick={share}>
            {copied ? "✓ COPIED" : "📤 SHARE"}
          </button>
          <button className="mbtn sec" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
