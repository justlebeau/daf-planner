import { fmt$, fmtPct } from "../utils.js";

export default function SummaryCards({ portfolioTotal, totalCostBasis, givingGoal, count }) {
  const totalGain    = portfolioTotal - totalCostBasis;
  const totalGainPct = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;

  const cards = [
    { label: "Portfolio Value",  value: fmt$(portfolioTotal),  sub: `${count} position${count !== 1 ? "s" : ""}` },
    { label: "Total Cost Basis", value: fmt$(totalCostBasis),  sub: "Amount invested" },
    {
      label: "Unrealized Gain",
      value: fmt$(totalGain),
      sub: fmtPct(totalGainPct),
      valueColor: totalGain >= 0 ? "var(--green)" : "var(--red)",
    },
    {
      label: "Annual Giving Goal",
      value: fmt$(givingGoal),
      sub: portfolioTotal > 0 ? `${((givingGoal / portfolioTotal) * 100).toFixed(1)}% of portfolio` : "—",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14,
      marginBottom: 32,
    }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "18px 20px",
          animation: "fadeUp 0.4s ease forwards",
          animationDelay: `${i * 60}ms`,
          opacity: 0,
        }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 8 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 22, color: c.valueColor || "var(--text)", marginBottom: 4, fontFamily: "var(--font-serif)" }}>
            {c.value}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            {c.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
