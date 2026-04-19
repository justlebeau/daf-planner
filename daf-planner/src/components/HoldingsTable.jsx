import { fmt$, fmtPct, fmtPrice } from "../utils.js";

const COL = {
  label: { textAlign: "left" },
  num:   { textAlign: "right" },
};

export default function HoldingsTable({ holdings, onRemove }) {
  if (!holdings.length) return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px dashed var(--border-mid)",
      borderRadius: 6,
      padding: "52px 24px",
      textAlign: "center",
      color: "var(--text-faint)",
      fontSize: 14,
      fontStyle: "italic",
    }}>
      Add your first holding below to begin
    </div>
  );

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-deep)", borderBottom: "1px solid var(--border)" }}>
            {[
              ["Ticker",   COL.label],
              ["Shares",   COL.num],
              ["Basis/sh", COL.num],
              ["Price",    COL.num],
              ["Day Δ",    COL.num],
              ["Mkt Val",  COL.num],
              ["Gain/Loss",COL.num],
              ["5yr Avg",  COL.num],
              ["",         COL.label],
            ].map(([h, style], i) => (
              <th key={i} style={{
                padding: "9px 14px",
                fontSize: 8, letterSpacing: 3,
                color: "var(--text-dim)",
                textTransform: "uppercase",
                fontWeight: "normal",
                fontFamily: "var(--font-mono)",
                ...style,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, idx) => {
            const mktVal  = (h.currentPrice || 0) * h.shares;
            const gainAmt = (h.currentPrice - h.costBasis) * h.shares;
            const gainPct = h.costBasis > 0 ? ((h.currentPrice - h.costBasis) / h.costBasis) * 100 : 0;
            const dayChg  = h.previousClose ? ((h.currentPrice - h.previousClose) / h.previousClose) * 100 : null;
            const isLast  = idx === holdings.length - 1;

            return (
              <tr key={h.id} style={{
                borderBottom: isLast ? "none" : "1px solid var(--border)",
                background: idx % 2 === 0 ? "var(--bg-card)" : "var(--bg-deep)",
                transition: "background 0.15s",
              }}>
                <td style={{ padding: "13px 14px" }}>
                  <div style={{ fontWeight: 500, color: "var(--accent)", fontSize: 14, fontFamily: "var(--font-mono)" }}>
                    {h.ticker}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>{h.sector}</div>
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: "var(--text-mid)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {h.shares.toLocaleString()}
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: "var(--text-mid)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {fmtPrice(h.costBasis)}
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {fmtPrice(h.currentPrice)}
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11,
                  color: dayChg === null ? "var(--text-dim)" : dayChg >= 0 ? "var(--green)" : "var(--red)" }}>
                  {dayChg !== null ? fmtPct(dayChg) : "—"}
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {fmt$(mktVal)}
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right" }}>
                  <div style={{ color: gainAmt >= 0 ? "var(--green)" : "var(--red)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {fmt$(gainAmt)}
                  </div>
                  <div style={{ fontSize: 10, color: gainAmt >= 0 ? "var(--green-dim)" : "var(--red)", fontFamily: "var(--font-mono)" }}>
                    {fmtPct(gainPct)}
                  </div>
                </td>
                <td style={{ padding: "13px 14px", textAlign: "right", color: "var(--text-mid)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {h.avgAnnualReturn5yr != null ? `${h.avgAnnualReturn5yr.toFixed(1)}%` : "—"}
                </td>
                <td style={{ padding: "13px 14px" }}>
                  <button onClick={() => onRemove(h.id)} title="Remove holding" style={{
                    background: "transparent", border: "none",
                    color: "var(--text-faint)", cursor: "pointer",
                    fontSize: 18, lineHeight: 1, padding: "0 4px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
                  >×</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
