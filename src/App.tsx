import { useState } from "react";
import Header from "./components/Header";
import HowToPlay from "./components/HowToPlay";
import StatsModal from "./components/StatsModal";
import Game from "./components/Game";

export default function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <Header
        onToggleHelp={() => setShowHelp((v) => !v)}
        onStats={() => setShowStats(true)}
      />
      <main>
        {showHelp && <HowToPlay />}
        <Game onShowStats={() => setShowStats(true)} />
      </main>
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </>
  );
}
