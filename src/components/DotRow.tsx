import type { GuessEntry } from "../lib/types";

interface Props {
  guesses: GuessEntry[];
  maxGuesses: number;
}

export default function DotRow({ guesses, maxGuesses }: Props) {
  return (
    <div className="dot-row">
      {Array.from({ length: maxGuesses }, (_, i) => {
        const g = guesses[i];
        let cls = "dot";
        if (g) {
          cls += g.isCorrect ? " win" : " lose";
        }
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}
