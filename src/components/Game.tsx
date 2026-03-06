import { useState, useMemo, useCallback } from "react";
import type { Job, GuessEntry, GameState } from "../lib/types";
import { getDailyJob, getDateKey } from "../lib/daily";
import { computeSimilarity } from "../lib/feedback";
import { loadGameState, saveGameState, updateStatsAfterGame } from "../lib/storage";
import jobsData from "../data/jobs.json";
import TileGrid from "./TileGrid";
import DotRow from "./DotRow";
import GuessList from "./GuessList";
import GuessInput from "./GuessInput";
import ResultModal from "./ResultModal";

const MAX_GUESSES = 6;

interface Props {
  onShowStats: () => void;
}

function pickRandomJob(jobs: Job[], excludeId?: number): Job {
  const pool = excludeId != null ? jobs.filter((j) => j.id !== excludeId) : jobs;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Game({ onShowStats: _onShowStats }: Props) {
  const jobs = jobsData as Job[];
  const [roundKey, setRoundKey] = useState(0);
  const [answer, setAnswer] = useState<Job>(() => getDailyJob(jobs));

  const dateKey = getDateKey();

  const [state, setState] = useState<GameState>(() => {
    const saved = loadGameState(dateKey);
    if (saved) return saved;
    return { dateKey, guesses: [], answerId: answer.id, status: "playing" };
  });

  const [showResult, setShowResult] = useState(state.status !== "playing");

  function persist(next: GameState) {
    setState(next);
    saveGameState(next);
  }

  function handleGuess(job: Job) {
    if (state.status !== "playing") return;

    const similarity = computeSimilarity(job, answer);
    const isCorrect = job.id === answer.id;

    const entry: GuessEntry = {
      jobId: job.id,
      title: job.title,
      similarity: isCorrect ? 100 : similarity,
      isCorrect,
    };

    const newGuesses = [...state.guesses, entry];
    let newStatus: GameState["status"] = "playing";

    if (isCorrect) {
      newStatus = "won";
      updateStatsAfterGame(true, newGuesses.length);
    } else if (newGuesses.length >= MAX_GUESSES) {
      newStatus = "lost";
      updateStatsAfterGame(false, newGuesses.length);
    }

    const next = { ...state, guesses: newGuesses, status: newStatus };
    persist(next);

    if (newStatus !== "playing") {
      setTimeout(() => setShowResult(true), 500);
    }
  }

  const handleNext = useCallback(() => {
    const newJob = pickRandomJob(jobs, answer.id);
    setAnswer(newJob);
    const newState: GameState = {
      dateKey: `random-${Date.now()}`,
      guesses: [],
      answerId: newJob.id,
      status: "playing",
    };
    setState(newState);
    setShowResult(false);
    setRoundKey((k) => k + 1);
  }, [jobs, answer.id]);

  const usedIds = useMemo(
    () => new Set(state.guesses.map((g) => g.jobId)),
    [state.guesses]
  );

  const guessesLeft = MAX_GUESSES - state.guesses.length;

  return (
    <>
      <TileGrid key={`tiles-${roundKey}`} job={answer} guessesLeft={guessesLeft} />

      <DotRow guesses={state.guesses} maxGuesses={MAX_GUESSES} />

      <GuessList guesses={state.guesses} />

      <GuessInput
        jobs={jobs}
        usedIds={usedIds}
        disabled={state.status !== "playing"}
        onSubmit={handleGuess}
      />

      {showResult && (
        <ResultModal
          won={state.status === "won"}
          guesses={state.guesses}
          answer={answer}
          onClose={() => setShowResult(false)}
          onNext={handleNext}
        />
      )}
    </>
  );
}
