export function fmt$(val) {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

export function fmtPct(val) {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return (val >= 0 ? "+" : "") + val.toFixed(2) + "%";
}

export function fmtPrice(val) {
  if (val === null || val === undefined || isNaN(val)) return "—";
  return "$" + val.toFixed(2);
}

export function sustainLevel(givingGoal, portfolioTotal) {
  if (!portfolioTotal) return null;
  const pct = givingGoal / portfolioTotal;
  if (pct <= 0.04) return { label: "Sustainable ≤4%",  color: "var(--green)",     icon: "✓" };
  if (pct <= 0.07) return { label: "Moderate 4–7%",    color: "var(--gold)",      icon: "⚠" };
  return              { label: "High 7%+ — may erode principal", color: "var(--red)", icon: "⚠" };
}
