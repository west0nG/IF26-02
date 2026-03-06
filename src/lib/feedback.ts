import type { Job } from "./types";

const CATEGORY_GROUPS: Record<string, string> = {
  Technology: "STEM", Engineering: "STEM", Science: "STEM",
  Finance: "Business", Business: "Business", Consulting: "Business", "Real Estate": "Business",
  Healthcare: "People", Education: "People", Nonprofit: "People",
  Media: "Creative", Marketing: "Creative", Architecture: "Creative",
  Government: "Service", Legal: "Service", Hospitality: "Service",
  Sports: "Service", Trades: "Service", Environment: "Service", Other: "Service",
};

const EDUCATION_ORDER = ["High School", "Associate's", "Bachelor's", "Master's", "Doctorate"];

export function computeSimilarity(guess: Job, answer: Job): number {
  if (guess.id === answer.id) return 100;

  let score = 0;

  // Category: exact match 30, same group 15
  if (guess.category === answer.category) {
    score += 30;
  } else if (CATEGORY_GROUPS[guess.category] === CATEGORY_GROUPS[answer.category]) {
    score += 15;
  }

  // Salary: up to 25 points based on closeness
  const salaryDiff = Math.abs(guess.salary - answer.salary);
  score += Math.max(0, 25 - Math.round(salaryDiff / 8000));

  // Education: exact 15, one off 8
  const eduDiff = Math.abs(
    EDUCATION_ORDER.indexOf(guess.education) - EDUCATION_ORDER.indexOf(answer.education)
  );
  if (eduDiff === 0) score += 15;
  else if (eduDiff === 1) score += 8;

  // Stress: exact 10, one off 5
  const stressDiff = Math.abs(guess.stress - answer.stress);
  if (stressDiff === 0) score += 10;
  else if (stressDiff === 1) score += 5;

  // Hiring volume: up to 10 points
  const gHired = guess.years["2025"]?.hired ?? 0;
  const aHired = answer.years["2025"]?.hired ?? 0;
  const hireDiff = Math.abs(gHired - aHired);
  score += Math.max(0, 10 - Math.round(hireDiff / 1500));

  // Layoff rate similarity: up to 10 points
  const gRate = gHired > 0 ? (guess.years["2025"]?.fired ?? 0) / gHired : 0;
  const aRate = aHired > 0 ? (answer.years["2025"]?.fired ?? 0) / aHired : 0;
  const rateDiff = Math.abs(gRate - aRate);
  score += Math.max(0, Math.round(10 - rateDiff * 50));

  return Math.min(99, Math.max(0, score));
}

// Color logic for clue tiles
export function salaryColor(s: number): "green" | "yellow" | "red" {
  return s >= 130000 ? "green" : s >= 75000 ? "yellow" : "red";
}

export function hiringColor(hired: number, fired: number): "green" | "yellow" | "red" {
  const r = fired / (hired || 1);
  if (r < 0.1 && hired > 5000) return "green";
  if (r < 0.2 && hired > 2000) return "yellow";
  return "red";
}

export function educationColor(edu: string): "green" | "yellow" | "red" {
  const easy = ["High School", "Associate's"];
  const mid = ["Bachelor's"];
  return easy.includes(edu) ? "green" : mid.includes(edu) ? "yellow" : "red";
}

export function stressColor(stress: number): "green" | "yellow" | "red" {
  return stress <= 2 ? "green" : stress <= 3 ? "yellow" : "red";
}

export function categoryColor(category: string): "green" | "yellow" | "red" {
  const group = CATEGORY_GROUPS[category] || "Service";
  if (group === "STEM" || group === "Business") return "green";
  if (group === "People" || group === "Creative") return "yellow";
  return "red";
}
