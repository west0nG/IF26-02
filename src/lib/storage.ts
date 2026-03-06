import type { GameState, PlayerStats } from "./types";

const GAME_KEY = "careerdle-game";
const STATS_KEY = "careerdle-stats";

export function loadGameState(dateKey: string): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const state: GameState = JSON.parse(raw);
    if (state.dateKey !== dateKey) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(GAME_KEY, JSON.stringify(state));
}

const DEFAULT_STATS: PlayerStats = {
  played: 0,
  won: 0,
  streak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
};

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: PlayerStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStatsAfterGame(won: boolean, numGuesses: number): PlayerStats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.won++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    stats.distribution[numGuesses - 1]++;
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
  return stats;
}
