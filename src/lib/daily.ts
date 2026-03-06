import type { Job } from "./types";

// Mulberry32 PRNG - deterministic from seed
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getDailyJob(jobs: Job[], date: Date = new Date()): Job {
  const key = getDateKey(date);
  // Convert date string to a numeric seed
  const seed = key.split("").reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
  const rng = mulberry32(seed);
  const index = Math.floor(rng() * jobs.length);
  return jobs[index];
}

export function getTimeUntilNextPuzzle(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}
