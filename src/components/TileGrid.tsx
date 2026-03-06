import type { Job } from "../lib/types";
import {
  salaryColor,
  hiringColor,
  educationColor,
  categoryColor,
} from "../lib/feedback";

interface Props {
  job: Job;
  guessesLeft: number;
}

const EDUCATION_LABELS: Record<string, string> = {
  "High School": "HS Diploma",
  "Associate's": "Associate's",
  "Bachelor's": "Bachelor's",
  "Master's": "Master's Degree",
  Doctorate: "Doctorate",
};

const EDUCATION_SUBS: Record<string, string> = {
  "High School": "High school/GED",
  "Associate's": "2-year degree",
  "Bachelor's": "4-year university",
  "Master's": "Graduate school",
  Doctorate: "Professional doctorate",
};

const STRESS_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
};

const STRESS_SUBS: Record<number, string> = {
  1: "Minimal pressure",
  2: "Low stress",
  3: "Moderate",
  4: "High stress",
  5: "Extreme pressure",
};

function stressDisplayColor(stress: number): "green" | "yellow" | "red" {
  return stress <= 2 ? "green" : stress <= 3 ? "yellow" : "red";
}

interface TileData {
  span?: boolean;
  icon: string;
  name: string;
  val: string;
  sub: string;
  color: "green" | "yellow" | "red";
}

export default function TileGrid({ job, guessesLeft }: Props) {
  const hired = job.years["2025"]?.hired ?? 0;
  const fired = job.years["2025"]?.fired ?? 0;
  const net = hired - fired;
  const layoffPct = hired > 0 ? ((fired / hired) * 100).toFixed(1) : "0.0";
  const layoffRate = hired > 0 ? fired / hired : 0;

  const tiles: TileData[] = [
    {
      span: true,
      icon: "💰",
      name: "Annual Salary",
      val: `$${Math.round(job.salary / 1000)}K median`,
      sub: `${job.category} · 2025`,
      color: salaryColor(job.salary),
    },
    {
      icon: "📈",
      name: "2025 Net Hiring",
      val: `${net > 0 ? "+" : ""}${net.toLocaleString()}`,
      sub: `${layoffPct}% layoff rate`,
      color: hiringColor(hired, fired),
    },
    {
      icon: "🎓",
      name: "Education Req.",
      val: EDUCATION_LABELS[job.education] || job.education,
      sub: EDUCATION_SUBS[job.education] || "",
      color: educationColor(job.education),
    },
    {
      icon: "🏢",
      name: "Industry",
      val: job.category,
      sub: `${categoryColor(job.category) === "green" ? "High growth sector" : categoryColor(job.category) === "yellow" ? "Stable sector" : "Traditional sector"}`,
      color: categoryColor(job.category),
    },
    {
      icon: "🧠",
      name: "Stress Level",
      val: STRESS_LABELS[job.stress] || "Medium",
      sub: STRESS_SUBS[job.stress] || "",
      color: stressDisplayColor(job.stress),
    },
    {
      icon: "📉",
      name: "Layoff Rate",
      val: `${layoffPct}%`,
      sub: `${fired.toLocaleString()} laid off in 2025`,
      color: layoffRate < 0.1 ? "green" : layoffRate < 0.2 ? "yellow" : "red",
    },
  ];

  return (
    <div className="card">
      <div className="card-top">
        <div className="card-label">📋 2025 Career Profile — Identify this job</div>
        <div className="counter">
          {guessesLeft > 0
            ? `${guessesLeft} GUESS${guessesLeft !== 1 ? "ES" : ""} LEFT`
            : "NO GUESSES LEFT"}
        </div>
      </div>
      <div className="tile-grid">
        {tiles.map((t) => (
          <div
            key={t.name}
            className={`tile ${t.color}${t.span ? " span2" : ""}`}
          >
            <div className="tile-icon">{t.icon}</div>
            <div className="tile-name">{t.name}</div>
            <div className="tile-val">{t.val}</div>
            <div className="tile-sub">{t.sub}</div>
          </div>
        ))}
      </div>
      <div className="card-bottom">
        <div className="mini-pill">
          Hired 2025: <span>{hired.toLocaleString()}</span>
        </div>
        <div className="mini-pill">
          Laid Off 2025: <span>{fired.toLocaleString()}</span>
        </div>
        <div className="mini-pill">
          Stress: <span>{job.stress}/5</span>
        </div>
      </div>
    </div>
  );
}
