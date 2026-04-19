import { fmt$, sustainLevel } from "../utils.js";

export default function GivingGoalPanel({ givingGoal, portfolioTotal, onChange, onAnalyze, loading, hasHoldings }) {
  const sustain = sustainLevel(givingGoal, portfolioTotal);

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      padding: "20px 22px",
      marginBottom: 16,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--text-dim)", textTransform: "uppercase",
        marginBottom: 10, fontFamily: "var(--font-mono)" }}>
        Annual Giving Goal
      </div>

      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          color: "var(--text-dim)", fontSize: 16, fontFamily: "var(--font-serif)", pointerEvents: "none",
        }}>$</span>
        <input
          type="number"
          value={givingGoal}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-mid)",
            color: "var(--text)",
            padding: "10px 14px 10px 26px",
            borderRadius: 4,
            width: "100%",
            fontSize: 20,
            outline: "none",
            fontFamily: "var(--font-serif)",
          }}
          onFocus={e  => (e.currentTarget.style.borderColor = "var(--border-hi)")}
          onBlur={e   => (e.currentTarget.style.borderColor = "var(--border-mid)")}
        />
      </div>

      {sustain && (
        <div style={{ fontSize: 11, color: sustain.color, marginBottom: 16, fontFamily: "var(--font-mono)" }}>
          {sustain.icon} {sustain.label}
          {portfolioTotal > 0 && (
            <span style={{ color: "var(--text-dim)", marginLeft: 8 }}>
              ({((givingGoal / portfolioTotal) * 100).toFixed(1)}% of portfolio)
            </span>
          )}
        </div>
      )}

      <button
        onClick={onAnalyze}
        disabled={loading || !hasHoldings}
        style={{
          background: hasHoldings ? "var(--bg-deep)" : "transparent",
          border: `1px solid ${hasHoldings ? "var(--border-hi)" : "var(--border)"}`,
          color: hasHoldings ? "var(--accent)" : "var(--text-faint)",
          padding: "11px 20px",
          borderRadius: 4,
          cursor: hasHoldings && !loading ? "pointer" : "not-allowed",
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          width: "100%",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => hasHoldings && (e.currentTarget.style.background = "#1a2e1a")}
        onMouseLeave={e => hasHoldings && (e.currentTarget.style.background = "var(--bg-deep)")}
      >
        {loading ? "Analyzing…" : "Analyze Giving Strategy"}
      </button>
    </div>
  );
}
