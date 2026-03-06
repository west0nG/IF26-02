export interface YearData {
  salary: number;
  hired: number;
  fired: number;
}

export interface Job {
  id: number;
  title: string;
  category: string;
  salary: number;
  education: Education;
  stress: number;
  years: Record<string, YearData>;
}

export type Education =
  | "High School"
  | "Associate's"
  | "Bachelor's"
  | "Master's"
  | "Doctorate";

export interface GuessEntry {
  jobId: number;
  title: string;
  similarity: number;
  isCorrect: boolean;
}

export interface GameState {
  dateKey: string;
  guesses: GuessEntry[];
  answerId: number;
  status: "playing" | "won" | "lost";
}

export interface PlayerStats {
  played: number;
  won: number;
  streak: number;
  maxStreak: number;
  distribution: number[];
}
