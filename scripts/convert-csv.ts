import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";
import { deriveEducation, deriveStress } from "../src/lib/derive.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const OUT_FILE = path.resolve(__dirname, "../src/data/jobs.json");
const YEARS = ["2021", "2022", "2023", "2024", "2025"];

interface CsvRow {
  "#": string;
  "Job Title": string;
  "Industry / Category": string;
  [key: string]: string;
}

function parseCSV(year: string): CsvRow[] {
  const filePath = path.join(DATA_DIR, `college_graduate_jobs_${year}.csv`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");
  // Skip the first line (title row), keep header + data
  const csvContent = lines.slice(1).join("\n");
  const result = Papa.parse<CsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });
  return result.data;
}

function main() {
  // Parse all years
  const dataByYear: Record<string, CsvRow[]> = {};
  for (const year of YEARS) {
    dataByYear[year] = parseCSV(year);
  }

  // Use 2025 as the base for job list
  const baseRows = dataByYear["2025"];
  const titleIndex: Record<string, Record<string, CsvRow>> = {};

  for (const year of YEARS) {
    titleIndex[year] = {};
    for (const row of dataByYear[year]) {
      titleIndex[year][row["Job Title"]] = row;
    }
  }

  const jobs = baseRows.map((row, i) => {
    const title = row["Job Title"];
    const category = row["Industry / Category"];

    const years: Record<string, { salary: number; hired: number; fired: number }> = {};
    for (const year of YEARS) {
      const r = titleIndex[year][title];
      if (r) {
        const salaryCol = Object.keys(r).find((k) => k.includes("Salary"))!;
        const hiredCol = Object.keys(r).find((k) => k.includes("Hired"))!;
        const firedCol = Object.keys(r).find((k) => k.includes("Fired") || k.includes("Laid"))!;
        years[year] = {
          salary: Math.round(parseFloat(r[salaryCol]) || 0),
          hired: Math.round(parseFloat(r[hiredCol]) || 0),
          fired: Math.round(parseFloat(r[firedCol]) || 0),
        };
      }
    }

    const latestSalary = years["2025"]?.salary || 0;
    const latestHired = years["2025"]?.hired || 0;
    const latestFired = years["2025"]?.fired || 0;
    const layoffRate = latestHired > 0 ? latestFired / latestHired : 0;

    return {
      id: i,
      title,
      category,
      salary: latestSalary,
      education: deriveEducation(title, category, latestSalary),
      stress: deriveStress(title, category, latestSalary, layoffRate),
      years,
    };
  });

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(jobs, null, 0));
  console.log(`Generated ${jobs.length} jobs -> ${OUT_FILE}`);
}

main();
