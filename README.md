# CAREERDLE

A daily Wordle-style guessing game for the job market. Each day, a mystery job is selected from real 2025 US hiring data. You get 6 guesses to identify it using clues like salary, industry, education level, stress rating, and hiring/layoff numbers.

**Live:** https://careerdle.vercel.app

## How It Works

- A new mystery job is picked each day (deterministic based on date)
- You're shown partial stats about the target job (salary, hired/fired counts, stress level, etc.)
- Type a job title to guess — each guess shows a similarity percentage
- Green = correct, Yellow = close (55%+), Red = wrong
- 6 attempts max. Share your result when done.

## Dataset

1,127 college graduate career jobs across 20 industries (2021–2025), sourced from US hiring and layoff data. Salaries are CPI-adjusted to 2025 USD.

CSV files in `data/` are converted to JSON at build time via `scripts/convert-csv.ts`.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts (sparklines)
- Deployed on Vercel (static)

## Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build    # runs data generation + tsc + vite build
npm run preview  # preview production build locally
```

## Project Structure

```
src/
  components/    # React UI components (Game, Header, GuessInput, etc.)
  lib/           # Game logic (daily job selection, similarity, storage)
  data/          # Generated jobs.json (from CSV at build time)
scripts/
  convert-csv.ts # CSV → JSON build script
data/
  *.csv          # Source datasets (2021–2025)
```
