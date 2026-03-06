import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const outFile = path.join(__dirname, '..', 'src', 'data', 'jobs.json');

const years = [2021, 2022, 2023, 2024, 2025];
const result = {};

for (const year of years) {
  const csvPath = path.join(dataDir, `college_graduate_jobs_${year}.csv`);
  const raw = fs.readFileSync(csvPath, 'utf-8');
  // Skip the first header/description line
  const lines = raw.split('\n');
  const csvContent = lines.slice(1).join('\n');

  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

  const jobs = parsed.data.map((row) => ({
    title: (row['Job Title'] || '').trim(),
    industry: (row['Industry / Category'] || '').trim(),
    salary: Math.round(parseFloat(row[`Avg. Salary (2025 USD)`]) || 0),
    hired: Math.round(parseFloat(row[`# Hired in ${year}`]) || 0),
    fired: Math.round(parseFloat(row[`# Fired / Laid Off in ${year}`]) || 0),
  })).filter(j => j.title && j.industry);

  // Compute normalized quality index
  const salaries = jobs.map(j => j.salary);
  const hireds = jobs.map(j => j.hired);
  const fireds = jobs.map(j => j.fired);

  const minMax = (arr) => ({ min: Math.min(...arr), max: Math.max(...arr) });
  const norm = (val, mm) => mm.max === mm.min ? 0.5 : (val - mm.min) / (mm.max - mm.min);

  const salaryMM = minMax(salaries);
  const hiredMM = minMax(hireds);
  const firedMM = minMax(fireds);

  for (const job of jobs) {
    const salaryN = norm(job.salary, salaryMM);
    const hiredN = norm(job.hired, hiredMM);
    const firedN = 1 - norm(job.fired, firedMM); // inverted
    job.quality = parseFloat((0.4 * salaryN + 0.35 * hiredN + 0.25 * firedN).toFixed(4));
  }

  result[year] = jobs;
}

fs.writeFileSync(outFile, JSON.stringify(result));
console.log(`Wrote ${outFile} (${(fs.statSync(outFile).size / 1024).toFixed(1)} KB)`);
