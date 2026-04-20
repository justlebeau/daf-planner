// Uses Yahoo Finance v8 quote endpoint — no API key required.
// A free CORS proxy (allorigins) is used since Yahoo blocks direct browser requests.

const PROXY = "https://api.allorigins.win/get?url=";

function yahooUrl(ticker) {
  return encodeURIComponent(
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5y`
  );
}

function quoteUrl(ticker) {
  return encodeURIComponent(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`
  );
}

async function fetchJson(url) {
  const res = await fetch(PROXY + url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const wrapper = await res.json();
  return JSON.parse(wrapper.contents);
}

function calc5yrAnnualReturn(closes) {
  if (!closes || closes.length < 2) return null;
  const start = closes[0];
  const end   = closes[closes.length - 1];
  if (!start || !end) return null;
  const years = closes.length / 252;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

export async function fetchStockData(ticker) {
  const t = ticker.trim().toUpperCase();
  try {
    const [chartData, quoteData] = await Promise.all([
      fetchJson(yahooUrl(t)),
      fetchJson(quoteUrl(t)),
    ]);

    const result = quoteData?.quoteResponse?.result?.[0];
    if (!result) return { valid: false, ticker: t };

    const currentPrice       = result.regularMarketPrice;
    const previousClose      = result.regularMarketPreviousClose;
    const weekHigh52         = result.fiftyTwoWeekHigh;
    const weekLow52          = result.fiftyTwoWeekLow;
    const name               = result.longName || result.shortName || t;
    const sector             = result.sector || result.quoteType || "—";

    const closes = chartData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
    const avgAnnualReturn5yr = closes
      ? parseFloat(calc5yrAnnualReturn(closes.filter(Boolean)).toFixed(1))
      : null;

    return { ticker: t, name, currentPrice, previousClose, weekHigh52, weekLow52, avgAnnualReturn5yr, sector, valid: true };
  } catch (err) {
    console.error(`fetchStockData(${t}):`, err);
    return { valid: false, ticker: t };
  }
}

export function analyzeGivingStrategy(holdings, givingGoal) {
  const scored = holdings
    .map(h => {
      const gainPerShare = (h.currentPrice || 0) - (h.costBasis || 0);
      const totalGain    = gainPerShare * h.shares;
      const marketValue  = (h.currentPrice || 0) * h.shares;
      const gainPct      = h.costBasis > 0 ? (gainPerShare / h.costBasis) * 100 : 0;
      return { ...h, gainPerShare, totalGain, marketValue, gainPct };
    })
    .filter(h => h.gainPerShare > 0)
    .sort((a, b) => b.gainPct - a.gainPct);

  if (!scored.length) {
    return {
      recommendation: "None of your holdings currently have unrealized gains. Consider waiting for positions to appreciate before donating to your DAF, or contribute cash directly.",
      sellOrder: [],
      totalFromSales: 0,
      sustainabilityNote: "Add appreciated positions to unlock tax-efficient giving.",
      taxNote: "Donating appreciated stock held >1 year avoids capital gains tax entirely.",
    };
  }

  let remaining = givingGoal;
  const sellOrder = [];

  for (const h of scored) {
    if (remaining <= 0) break;
    const sharesToSell   = Math.min(Math.ceil(remaining / h.currentPrice), h.shares);
    const estimatedValue = parseFloat((sharesToSell * h.currentPrice).toFixed(0));
    sellOrder.push({
      ticker: h.ticker,
      sharesToSell,
      estimatedValue,
      reason: `${h.gainPct.toFixed(0)}% unrealized gain — highest tax benefit per dollar donated`,
      timing: "Ensure held >1 year for long-term capital gains treatment",
    });
    remaining -= estimatedValue;
  }

  const totalFromSales = sellOrder.reduce((s, o) => s + o.estimatedValue, 0);
  const portfolioTotal = holdings.reduce((s, h) => s + (h.currentPrice || 0) * h.shares, 0);
  const givingRate     = portfolioTotal > 0 ? (givingGoal / portfolioTotal) * 100 : 0;

  const sustainabilityNote = givingRate <= 4
    ? `At ${givingRate.toFixed(1)}% of portfolio, this giving rate is sustainable — your portfolio should continue growing.`
    : givingRate <= 7
    ? `At ${givingRate.toFixed(1)}% of portfolio, this is a moderate rate. Monitor returns to avoid eroding principal.`
    : `At ${givingRate.toFixed(1)}% of portfolio, this rate may erode principal. Consider reducing the goal or growing the portfolio first.`;

  return {
    recommendation: `Donate your most appreciated stock directly to your DAF to avoid capital gains tax on $${scored[0].totalGain.toFixed(0)} in unrealized gains. Start with ${scored[0].ticker} (${scored[0].gainPct.toFixed(0)}% gain) for maximum tax efficiency.`,
    sellOrder,
    totalFromSales: parseFloat(totalFromSales.toFixed(0)),
    sustainabilityNote,
    taxNote: "Donating appreciated stock held >1 year to a DAF avoids all capital gains tax and qualifies for a full fair-market-value deduction.",
  };
}
