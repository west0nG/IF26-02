import { useEffect, useRef } from 'react';
import { years } from '../utils/data';

interface Props {
  year: number;
  onYearChange: (y: number) => void;
  playing: boolean;
  onPlayToggle: () => void;
}

export default function Timeline({ year, onYearChange, playing, onPlayToggle }: Props) {
  const yearRef = useRef(year);
  yearRef.current = year;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const idx = years.indexOf(yearRef.current);
      onYearChange(years[(idx + 1) % years.length]);
    }, 2000);
    return () => clearInterval(id);
  }, [playing, onYearChange]);

  return (
    <div className="shrink-0 flex items-center justify-center gap-4 bg-white/5 px-6 py-3">
      <button
        onClick={onPlayToggle}
        className="w-8 h-8 flex items-center justify-center text-white hover:text-blue-400 transition-colors cursor-pointer"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="1" width="4" height="14" />
            <rect x="10" y="1" width="4" height="14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <polygon points="2,1 14,8 2,15" />
          </svg>
        )}
      </button>
      <div className="flex items-center gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => onYearChange(y)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              y === year
                ? 'bg-blue-500 text-white scale-110'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
