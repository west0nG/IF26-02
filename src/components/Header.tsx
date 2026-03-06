interface Props {
  onToggleHelp: () => void;
  onStats: () => void;
}

export default function Header({ onToggleHelp, onStats }: Props) {
  return (
    <header>
      <div>
        <div className="logo">
          CAREER<em>DLE</em>
        </div>
        <div className="logo-sub">Identify the 2025 job from real hiring data</div>
      </div>
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <button className="pill-btn" onClick={onToggleHelp}>
          ? HOW TO PLAY
        </button>
        <button className="pill-btn" onClick={onStats}>
          STATS
        </button>
      </div>
    </header>
  );
}
