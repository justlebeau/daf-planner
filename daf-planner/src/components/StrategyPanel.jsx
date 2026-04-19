import { fmt$ } from "../utils.js";

export default function StrategyPanel({ strategy, loading }) {
  if (loading) return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      padding: "40px 22px",
      textAlign: "center",
      color: "var(--text-dim)",
      fontSize: 13,
      fontStyle: "italic",
    }}>
      <div style={{ animation: "pulse 1.5s ease infinite" }}>Analyzing your portfolio…</div>
    </div>
  );

  if (!strategy) return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px dashed var(--border)",
      borderRadius: 6,
      padding: "40px 22px",
      textAlign: "center",
      color: "var(--text-faint)",
      fontSize: 13,
      fontStyle: "italic",
    }}>
      Set your giving goal and click<br />Analyze to get a sell strategy
    </div>
  );

  return (
    <div style={{
      background: "#0a140a",
      border: "1px solid var(--border-mid)",
      borderRadius: 6,
      padding: "22px",
      animation: "fadeUp 0.4s ease forwards",
    }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--green-dim)", textTransform: "uppercase",
        marginBottom: 14, fontFamily: "var(--font-mono)" }}>
        AI Recommendation
      </div>

      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
        {strategy.recommendation}
      </p>

      {strategy.sellOrder?.length > 0 && (
        <>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--green-dim)", textTransform: "uppercase",
            marginBottom: 10, fontFamily: "var(--font-mono)" }}>
            Recommended Sell Order
          </div>
          {strategy.sellOrder.map((s, i) => (
            <div key={i} style={{
              background: "#0d1a0d",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: "12px 14px",
              marginBottom: 8,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "var(--accent)", fontWeight: 500, fontFamily: "var(--font-mono)" }}>
                  {s.ticker}
                </span>
                <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                  {fmt$(s.estimatedValue)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-mid)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>
                {s.sharesToSell} shares — {s.timing}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                {s.reason}
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ borderTop: "1px solid var(--border)", marginTop: 14, paddingTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Total from sales
          </span>
          <span style={{ color: "var(--green)", fontSize: 16 }}>
            {fmt$(strategy.totalFromSales)}
          </span>
        </div>

        {strategy.taxNote && (
          <div style={{ fontSize: 12, color: "var(--text-mid)", background: "var(--bg-deep)", borderRadius: 4,
            padding: "10px 12px", marginBottom: 8, lineHeight: 1.6 }}>
            📋 {strategy.taxNote}
          </div>
        )}
        {strategy.sustainabilityNote && (
          <div style={{ fontSize: 12, color: "var(--text-mid)", background: "var(--bg-deep)", borderRadius: 4,
            padding: "10px 12px", lineHeight: 1.6 }}>
            📈 {strategy.sustainabilityNote}
          </div>
        )}
      </div>
    </div>
  );
}
