import { data, years } from '../utils/data';
import type { Job } from '../utils/data';

interface Props {
  job: Job;
  year: number;
  onClose: () => void;
}

export default function DetailPanel({ job, year, onClose }: Props) {
  const yearlyData = years.map((y) => {
    const found = data[y]?.find((j: Job) => j.title === job.title && j.industry === job.industry);
    return { year: y, quality: found?.quality ?? 0, salary: found?.salary ?? 0, hired: found?.hired ?? 0, fired: found?.fired ?? 0 };
  });

  const maxQ = Math.max(...yearlyData.map((d) => d.quality), 0.01);

  return (
    <div className="absolute top-4 right-4 w-80 bg-black/60 backdrop-blur-xl rounded-2xl p-5 z-20 text-white">
      <button onClick={onClose} className="absolute top-3 right-3 text-white/50 hover:text-white cursor-pointer">
        X
      </button>
      <h2 className="text-lg font-bold mb-1 pr-6">{job.title}</h2>
      <p className="text-sm text-blue-300 mb-4">{job.industry}</p>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <div className="text-white/50">Avg Salary</div>
          <div className="font-semibold">${job.salary.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-white/50">Quality Index</div>
          <div className="font-semibold">{(job.quality * 100).toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-white/50">Hired</div>
          <div className="font-semibold text-green-400">{job.hired.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-white/50">Fired / Laid Off</div>
          <div className="font-semibold text-red-400">{job.fired.toLocaleString()}</div>
        </div>
      </div>

      <div className="text-xs text-white/50 mb-2">Quality Index Trend</div>
      <div className="flex items-end gap-1 h-16">
        {yearlyData.map((d) => (
          <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-sm transition-all ${d.year === year ? 'bg-blue-400' : 'bg-white/30'}`}
              style={{ height: `${(d.quality / maxQ) * 48}px` }}
            />
            <span className={`text-[10px] ${d.year === year ? 'text-blue-400' : 'text-white/40'}`}>{d.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
