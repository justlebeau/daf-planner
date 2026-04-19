import { useState } from "react";
import { fetchStockData } from "../api.js";

const inputStyle = {
  background: "var(--bg-input)",
  border: "1px solid var(--border-mid)",
  color: "var(--text)",
  padding: "9px 12px",
  borderRadius: 4,
  width: "100%",
  fontSize: 13,
  outline: "none",
  fontFamily: "var(--font-mono)",
  transition: "border-color 0.15s",
};

export default function AddHoldingForm({ onAdd }) {
  const [form, setForm]       = useState({ ticker: "", shares: "", costBasis: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAdd = async () => {
    if (!form.ticker || !form.shares || !form.costBasis) {
      setError("All three fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    const data = await fetchStockData(form.ticker);
    setLoading(false);

    if (!data.valid) {
      setError(`Could not find "${form.ticker.toUpperCase()}". Check the ticker symbol.`);
      return;
    }

    onAdd({
      id:                Date.now(),
      ticker:            data.ticker,
      name:              data.name,
      shares:            parseFloat(form.shares),
      costBasis:         parseFloat(form.costBasis),
      currentPrice:      data.currentPrice,
      previousClose:     data.previousClose,
      weekHigh52:        data.weekHigh52,
      weekLow52:         data.weekLow52,
      avgAnnualReturn5yr: data.avgAnnualReturn5yr,
      sector:            data.sector,
    });

    setForm({ ticker: "", shares: "", costBasis: "" });
  };

  const fields = [
    { key: "ticker",    label: "Ticker",         placeholder: "AAPL" },
    { key: "shares",    label: "Shares Owned",   placeholder: "50",     type: "number" },
    { key: "costBasis", label: "Basis / Share $", placeholder: "145.00", type: "number" },
  ];

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      padding: "20px 22px",
      marginTop: 18,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 16 }}>
        Add Holding
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: 3, textTransform: "uppercase",
              marginBottom: 6, fontFamily: "var(--font-mono)" }}>
              {f.label}
            </div>
            <input
              type={f.type || "text"}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--border-hi)")}
              onBlur={e  => (e.currentTarget.style.borderColor = "var(--border-mid)")}
            />
          </div>
        ))}

        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            background: "var(--bg-deep)",
            border: "1px solid var(--border-hi)",
            color: "var(--accent)",
            padding: "10px 20px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#1a2e1a")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-deep)")}
        >
          {loading ? "…" : "+ Add"}
        </button>
      </div>

      {error && (
        <div style={{ color: "var(--red)", fontSize: 12, marginTop: 10, fontFamily: "var(--font-mono)" }}>
          {error}
        </div>
      )}
    </div>
  );
}
