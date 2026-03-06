export default function HowToPlay() {
  return (
    <div className="howto">
      <h3>HOW TO PLAY</h3>
      <div className="howto-grid">
        <div className="howto-item">
          <span>📊</span>
          <span>
            Study the 6 career stat tiles — salary, hiring growth, education
            required, industry, stress, and layoff rate. All data is from real
            2021-2025 US hiring records.
          </span>
        </div>
        <div className="howto-item">
          <span>🔍</span>
          <span>
            Type a job title and press GUESS. After each guess, see a %
            similarity score. You have 6 attempts total.
          </span>
        </div>
        <div className="howto-item">
          <span>🎯</span>
          <span>
            Higher % = your guess shares similar traits with the answer. Use
            clues to narrow it down!
          </span>
        </div>
        <div className="howto-item">
          <span>🏆</span>
          <span>
            Identify the secret career before you run out of guesses. A new
            puzzle releases each day!
          </span>
        </div>
      </div>
      <div className="color-legend">
        <div className="legend-item">
          <div className="ldot" style={{ background: "#4ade80" }} />
          Green = Good / attractive for job seekers
        </div>
        <div className="legend-item">
          <div className="ldot" style={{ background: "#fbbf24" }} />
          Yellow = Middle ground / moderate
        </div>
        <div className="legend-item">
          <div className="ldot" style={{ background: "#f87171" }} />
          Red = Challenging / demanding / hard to enter
        </div>
      </div>
    </div>
  );
}
