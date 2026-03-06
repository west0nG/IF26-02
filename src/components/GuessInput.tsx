import { useState, useRef, useEffect } from "react";
import type { Job } from "../lib/types";

interface Props {
  jobs: Job[];
  usedIds: Set<number>;
  disabled: boolean;
  onSubmit: (job: Job) => void;
}

export default function GuessInput({ jobs, usedIds, disabled, onSubmit }: Props) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filtered =
    query.length >= 1
      ? jobs
          .filter(
            (j) =>
              !usedIds.has(j.id) &&
              j.title.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 10)
      : [];

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  function pick(job: Job) {
    setQuery(job.title);
    setSelectedJob(job);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function handleGuess() {
    if (disabled) return;
    // If a job was picked from autocomplete, use it
    if (selectedJob) {
      onSubmit(selectedJob);
      setQuery("");
      setSelectedJob(null);
      return;
    }
    // Otherwise try to match what's typed
    const match = jobs.find(
      (j) => j.title.toLowerCase() === query.toLowerCase() && !usedIds.has(j.id)
    );
    if (match) {
      onSubmit(match);
      setQuery("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filtered[selectedIndex]) {
        pick(filtered[selectedIndex]);
      } else {
        handleGuess();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".input-row") && !target.closest(".ac-list")) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div className="input-row">
        <input
          ref={inputRef}
          type="text"
          className="job-input"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedJob(null);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Game over" : "Type a job title..."}
          autoComplete="off"
        />
        <button
          className="guess-btn"
          disabled={disabled || !query.trim()}
          onClick={handleGuess}
        >
          GUESS
        </button>
      </div>
      {showDropdown && filtered.length > 0 && (
        <div className="ac-list" style={{ display: "block" }}>
          {filtered.map((job, i) => (
            <div
              key={job.id}
              className={`ac-item${i === selectedIndex ? " active" : ""}`}
              onMouseDown={() => pick(job)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              {job.title}
              <span className="ac-item-cat">{job.category}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
