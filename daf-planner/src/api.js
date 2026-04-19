const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL   = "claude-sonnet-4-20250514";

async function callClaude(prompt, maxTokens = 800) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "{}";
  const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m =>
    m.replace(/```json\n?|```\n?/g, "")
  ).trim();
  return JSON.parse(clean);
}

export async function fetchStockData(ticker) {
  const t = ticker.trim().toUpperCase();
  const prompt = `You are a financial data API. For the stock ticker "${t}", return ONLY valid JSON (no markdown, no text outside the JSON) with this exact shape:
{
  "ticker": "${t}",
  "name": "Full Company Name",
  "currentPrice": 123.45,
  "previousClose": 120.00,
  "weekHigh52": 180.00,
  "weekLow52": 95.00,
  "avgAnnualReturn5yr": 12.5,
  "sector": "Technology",
  "valid": true
}
If the ticker is invalid or unknown, return ONLY: {"valid":false,"ticker":"${t}"}
Use best-estimate figures from your training knowledge. avgAnnualReturn5yr = approximate 5-year annualized total return %.`;
  try {
    return await callClaude(prompt, 400);
  } catch {
    return { valid: false, ticker: t };
  }
}

export async function analyzeGivingStrategy(holdings, givingGoal, portfolioTotal) {
  const lines = holdings.map(h => {
    const gain = ((h.currentPrice - h.costBasis) * h.shares).toFixed(0);
    return `${h.ticker} (${h.name}): ${h.shares} shares, price $${h.currentPrice?.toFixed(2)}, basis $${h.costBasis?.toFixed(2)}/sh, unrealized gain $${gain}, 5yr avg ${h.avgAnnualReturn5yr ?? "?"}%`;
  }).join("\n");

  const prompt = `You are a financial advisor. A client has a $${portfolioTotal.toFixed(0)} brokerage portfolio linked to a Donor Advised Fund (DAF). They want to give $${givingGoal.toFixed(0)} per year charitably.

Holdings:
${lines}

Return ONLY valid JSON (no markdown) with this shape:
{
  "recommendation": "2-3 sentence plain-English strategy summary",
  "sellOrder": [
    {
      "ticker": "TICKER",
      "sharesToSell": 10,
      "estimatedValue": 1850,
      "reason": "Why sell this position",
      "timing": "e.g. Q1, after 1yr holding, immediately"
    }
  ],
  "totalFromSales": 12500,
  "sustainabilityNote": "One sentence on long-term sustainability",
  "taxNote": "Key tax consideration for donating appreciated stock to DAF"
}

Rules: (1) Prioritize most-appreciated positions first — donating appreciated stock to a DAF avoids capital gains tax entirely. (2) Only recommend selling enough to meet the goal. (3) Flag lower-growth or over-weighted positions.`;

  try {
    return await callClaude(prompt, 1000);
  } catch {
    return null;
  }
}
