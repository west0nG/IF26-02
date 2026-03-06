import type { Education } from "./types";

const DOCTORATE_KEYWORDS = [
  "physician",
  "surgeon",
  "dentist",
  "psychiatrist",
  "pharmacist",
  "veterinarian",
  "professor",
  "researcher",
  "scientist",
  "pathologist",
  "anesthesiologist",
  "radiologist",
  "neurologist",
  "cardiologist",
  "oncologist",
  "dermatologist",
  "optometrist",
  "chiropractor",
];

const MASTERS_KEYWORDS = [
  "therapist",
  "psychologist",
  "counselor",
  "librarian",
  "architect",
  "economist",
  "statistician",
  "data scientist",
  "epidemiologist",
  "social worker",
  "speech",
  "audiologist",
  "nurse practitioner",
  "physician assistant",
];

const ASSOCIATE_KEYWORDS = [
  "technician",
  "assistant",
  "aide",
  "clerk",
  "receptionist",
  "dispatcher",
  "installer",
  "mechanic",
  "drafter",
];

const HIGH_SCHOOL_KEYWORDS = [
  "driver",
  "janitor",
  "custodian",
  "groundskeeper",
  "laborer",
  "housekeeper",
  "cashier",
  "food service",
  "barista",
];

const MASTERS_CATEGORIES = ["Science"];
const DOCTORATE_CATEGORIES: string[] = [];

export function deriveEducation(
  title: string,
  category: string,
  salary: number
): Education {
  const t = title.toLowerCase();

  if (DOCTORATE_KEYWORDS.some((k) => t.includes(k))) return "Doctorate";
  if (DOCTORATE_CATEGORIES.includes(category) && salary > 150000)
    return "Doctorate";

  if (MASTERS_KEYWORDS.some((k) => t.includes(k))) return "Master's";
  if (MASTERS_CATEGORIES.includes(category) && salary > 120000)
    return "Master's";

  if (HIGH_SCHOOL_KEYWORDS.some((k) => t.includes(k))) return "High School";
  if (ASSOCIATE_KEYWORDS.some((k) => t.includes(k))) return "Associate's";

  if (salary > 140000) return "Master's";
  if (salary < 45000) return "Associate's";

  return "Bachelor's";
}

const HIGH_STRESS_KEYWORDS = [
  "surgeon",
  "emergency",
  "firefighter",
  "police",
  "paramedic",
  "air traffic",
  "military",
  "corrections",
  "detective",
  "judge",
];

const LOW_STRESS_KEYWORDS = [
  "librarian",
  "archivist",
  "curator",
  "florist",
  "dietitian",
  "actuary",
  "statistician",
  "technical writer",
];

const HIGH_STRESS_CATEGORIES = ["Government", "Legal", "Healthcare"];
const LOW_STRESS_CATEGORIES = ["Education", "Nonprofit", "Environment"];

export function deriveStress(
  title: string,
  category: string,
  salary: number,
  layoffRate: number
): number {
  const t = title.toLowerCase();
  let score = 3;

  if (HIGH_STRESS_KEYWORDS.some((k) => t.includes(k))) score += 2;
  else if (LOW_STRESS_KEYWORDS.some((k) => t.includes(k))) score -= 2;

  if (HIGH_STRESS_CATEGORIES.includes(category)) score += 0.5;
  else if (LOW_STRESS_CATEGORIES.includes(category)) score -= 0.5;

  if (layoffRate > 0.15) score += 1;
  else if (layoffRate < 0.05) score -= 0.5;

  if (salary > 150000) score += 0.5;
  else if (salary < 50000) score += 0.3;

  return Math.max(1, Math.min(5, Math.round(score)));
}
