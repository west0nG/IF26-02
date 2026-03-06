import { useState, useCallback } from 'react';
import Header from './Header';
import Timeline from './Timeline';
import DetailPanel from './DetailPanel';
import BarChart from './BarChart';
import { years } from '../utils/data';
import type { Job } from '../utils/data';

export default function App() {
  const [year, setYear] = useState(years[0]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [playing, setPlaying] = useState(false);

  const handleBack = useCallback(() => {
    if (selectedJob) {
      setSelectedJob(null);
    } else {
      setSelectedIndustry(null);
      setSelectedJob(null);
    }
  }, [selectedJob]);

  return (
    <div className="w-full h-full flex flex-col">
      <Header />
      <div className="flex-1 relative overflow-hidden">
        <BarChart
          year={year}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={setSelectedIndustry}
          onSelectJob={setSelectedJob}
          selectedJob={selectedJob}
        />
        {selectedIndustry && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
          >
            {selectedJob ? 'Back to Industry' : 'Back to Overview'}
          </button>
        )}
        {selectedJob && <DetailPanel job={selectedJob} year={year} onClose={() => setSelectedJob(null)} />}
      </div>
      <Timeline
        year={year}
        onYearChange={setYear}
        playing={playing}
        onPlayToggle={() => setPlaying(!playing)}
      />
    </div>
  );
}
