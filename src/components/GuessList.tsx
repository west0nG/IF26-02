import { useEffect, useRef } from "react";
import type { GuessEntry } from "../lib/types";

interface Props {
  guesses: GuessEntry[];
}

function GuessRow({ guess }: { guess: GuessEntry }) {
  const barRef = useRef<HTMLDivElement>(null);
  const cls = guess.isCorrect ? "correct" : guess.similarity >= 55 ? "close" : "wrong";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${guess.similarity}%`;
      }
    }, 40);
    return () => clearTimeout(timer);
  }, [guess.similarity]);

  return (
    <div className={`guess-row ${cls}`}>
      <div className="guess-name">{guess.title}</div>
      <div className="bar-wrap">
        <div ref={barRef} className="bar-fill" style={{ width: "0%" }} />
      </div>
      <div className="guess-pct">
        {guess.isCorrect ? "✓ CORRECT" : `${guess.similarity}% match`}
      </div>
    </div>
  );
}

export default function GuessList({ guesses }: Props) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      {[...guesses].reverse().map((g) => (
        <GuessRow key={g.jobId} guess={g} />
      ))}
    </div>
  );
}
