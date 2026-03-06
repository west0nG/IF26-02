import { loadStats } from "../lib/storage";

interface Props {
  onClose: () => void;
}

export default function StatsModal({ onClose }: Props) {
  const stats = loadStats();
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.distribution, 1);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="m-title">STATISTICS</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(
            [
              [stats.played, "Played"],
              [winPct, "Win %"],
              [stats.streak, "Streak"],
              [stats.maxStreak, "Max"],
            ] as const
          ).map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem" }}>{val}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", color: "var(--muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
          GUESS DISTRIBUTION
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          {stats.distribution.map((count, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", width: "12px", textAlign: "right" }}>
                {i + 1}
              </span>
              <div
                style={{
                  height: "18px",
                  borderRadius: "3px",
                  background: "var(--surface2)",
                  width: `${Math.max((count / maxDist) * 100, 8)}%`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "0 6px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.65rem",
                  transition: "width 0.5s",
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        <div className="m-btns">
          <button className="mbtn sec" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
