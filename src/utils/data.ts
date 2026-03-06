import jobsData from '../data/jobs.json';

export interface Job {
  title: string;
  industry: string;
  salary: number;
  hired: number;
  fired: number;
  quality: number;
}

export type YearData = Record<string, Job[]>;

export const data = jobsData as unknown as YearData;
export const years = Object.keys(data).map(Number).sort();

export interface IndustryAggregate {
  industry: string;
  avgQuality: number;
  jobs: Job[];
  totalHired: number;
  totalFired: number;
  avgSalary: number;
}

export function getIndustries(year: number): IndustryAggregate[] {
  const jobs = data[year] || [];
  const map = new Map<string, Job[]>();
  for (const job of jobs) {
    if (!map.has(job.industry)) map.set(job.industry, []);
    map.get(job.industry)!.push(job);
  }

  return Array.from(map.entries()).map(([industry, jobs]) => ({
    industry,
    jobs,
    avgQuality: jobs.reduce((s, j) => s + j.quality, 0) / jobs.length,
    totalHired: jobs.reduce((s, j) => s + j.hired, 0),
    totalFired: jobs.reduce((s, j) => s + j.fired, 0),
    avgSalary: jobs.reduce((s, j) => s + j.salary, 0) / jobs.length,
  })).sort((a, b) => a.industry.localeCompare(b.industry));
}

export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}
