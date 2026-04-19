import { useState, useEffect, useCallback } from "react";
import { fetchStockData, analyzeGivingStrategy } from "./api.js";
import SummaryCards   from "./components/SummaryCards.jsx";
import HoldingsTable  from "./components/HoldingsTable.jsx";
import AddHoldingForm from "./components/AddHoldingForm.jsx";
import GivingGoalPanel from "./components/GivingGoalPanel.jsx";
import StrategyPanel  from "./components/StrategyPanel.jsx";

const STORAGE_KEY = "daf_holdings_v1";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

export default function App() {
  const [holdings,         setHoldings]         = useState(load);
  const [givingGoal,       setGivingGoal]        = useState(10000);
  const [strategy,         setStrategy]          = useState(null);
  const [strategyLoading,  setStrategyLoading]   = useState(false);
  const [refreshing,       setRefreshing]        = useState(false);
  const [lastRefreshed,    setLastRefreshed]      = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings)); }
    catch {}
  }, [holdings]);

  const portfolioTotal  = holdings.reduce((s, h) => s + (h.currentPrice || 0) * h.shares, 0);
  const totalCostBasis  = holdings.reduce((s, h) => s + (h.costBasis     || 0) * h.shares, 0);

  const handleAdd = (holding) => {
    setHoldings(prev => [...prev, holding]);
    setStrategy(null);
  };

  const handleRemove = (id) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
    setStrategy(null);
  };

  const handleRefresh = useCallback(async () => {
    if (!holdings.length || refreshing) return;
    setRefreshing(true);
    const updated = await Promise.all(
      holdings.map(async h => {
        const data = await fetchStockData(h.ticker);
        if (!data.valid) return h;
        return {
          ...h,
          currentPrice:       data.currentPrice,
          previousClose:      data.previousClose,
          weekHigh52:         data.weekHigh52,
          weekLow52:          data.weekLow52,
          avgAnnualReturn5yr: data.avgAnnualReturn5yr,
          name:               data.name,
        };
      })
    );
    setHoldings(updated);
    setLastRefreshed(new Date());
    setRefreshing(false);
    setStrategy(null);
  }, [holdings, refreshing]);

  const handleAnalyze = async () => {
    if (!holdings.length) return;
    setStrategyLoading(true);
    const result = await analyzeGivingStrategy(holdings, givingGoal, portfolioTotal);
    setStrategy(result);
    setStrategyLoading(false);
  };

  const handleGoalChange = (val) => {
    setGivingGoal(val);
    setStrategy(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Header ── */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "26px 44px 20px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, #0e160e 0%, var(--bg) 100%)",
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 6, color: "var(--text-dim)", marginBottom: 6,
            textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
            Donor Advised Fund
          </div>
          <h1 style={{ fontSize: 26, fontWeight: "normal", color: "var(--text)", letterSpacing: 0.5,
            fontFamily: "var(--font-serif)" }}>
            Giving Engine
          </h1>
        </div>

        <div style={{ textAlign: "right" }}>
          {lastRefreshed && (
            <div style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
              Updated {lastRefreshed.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing || !holdings.length}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: holdings.length ? "var(--text-mid)" : "var(--text-faint)",
              padding: "6px 18px",
              borderRadius: 3,
              cursor: holdings.length && !refreshing ? "pointer" : "not-allowed",
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { if (holdings.length) { e.currentTarget.style.borderColor = "var(--border-hi)"; e.currentTarget.style.color = "var(--green)"; }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = holdings.length ? "var(--text-mid)" : "var(--text-faint)"; }}
          >
            {refreshing ? "Updating…" : "↻  Refresh Prices"}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main style={{ padding: "32px 44px", maxWidth: 1180, margin: "0 auto" }}>

        <SummaryCards
          portfolioTotal={portfolioTotal}
          totalCostBasis={totalCostBasis}
          givingGoal={givingGoal}
          count={holdings.length}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>

          {/* Left: holdings */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--text-dim)", textTransform: "uppercase",
              marginBottom: 14, fontFamily: "var(--font-mono)" }}>
              Holdings
            </div>
            <HoldingsTable holdings={holdings} onRemove={handleRemove} />
            <AddHoldingForm onAdd={handleAdd} />
          </div>

          {/* Right: giving strategy */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "var(--text-dim)", textTransform: "uppercase",
              marginBottom: 14, fontFamily: "var(--font-mono)" }}>
              Giving Strategy
            </div>
            <GivingGoalPanel
              givingGoal={givingGoal}
              portfolioTotal={portfolioTotal}
              onChange={handleGoalChange}
              onAnalyze={handleAnalyze}
              loading={strategyLoading}
              hasHoldings={holdings.length > 0}
            />
            <StrategyPanel strategy={strategy} loading={strategyLoading} />

            <div style={{ marginTop: 16, fontSize: 10, color: "var(--text-faint)", lineHeight: 1.7,
              fontFamily: "var(--font-mono)" }}>
              Prices estimated via AI — not real-time market data.<br />
              Not financial advice. Consult a licensed advisor.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
