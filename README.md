# DAF Giving Engine

A personal portfolio tracker and charitable giving planner for Donor Advised Fund (DAF) holders. Add your brokerage holdings, set an annual giving goal, and get an AI-powered recommendation on which stocks to sell — and when — to maximize your tax benefit.

## Features

- **Portfolio tracker** — add holdings by ticker, shares, and cost basis
- **Live price refresh** — AI-estimated current prices, day change, 52-week range, and 5yr avg return
- **Giving goal analyzer** — set an annual charitable target and get a ranked sell strategy
- **Tax-optimized** — prioritizes most-appreciated positions (donating appreciated stock to a DAF avoids capital gains tax)
- **Sustainability indicator** — flags if your giving rate may erode principal (>4% = caution, >7% = warning)
- **Persistent storage** — holdings save in your browser's localStorage

---

## Setup

### Prerequisites
- Node.js 18+
- npm

### Install & run locally

```bash
git clone https://github.com/YOUR_USERNAME/daf-planner.git
cd daf-planner
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to GitHub Pages

### 1. Create the repo
Create a new GitHub repository named `daf-planner` (or any name you like).

### 2. Update the base path
In `vite.config.js`, change `BASE` to match your repo name:

```js
const BASE = "/your-repo-name";
```

If you're using a custom domain or a GitHub user/org page (`username.github.io`), set:
```js
const BASE = "/";
```

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/daf-planner.git
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The `deploy.yml` workflow will automatically build and deploy on every push to `main`

Your app will be live at:
```
https://YOUR_USERNAME.github.io/daf-planner/
```

---

## How it works

The app uses the **Anthropic Claude API** directly from the browser to:
- Look up estimated stock prices and return data by ticker symbol
- Analyze your portfolio and generate a personalized sell strategy

> ⚠️ **Note:** Prices are AI-estimated, not real-time market data. This app is for personal planning purposes and is not financial advice. Consult a licensed financial advisor before making investment decisions.

---

## License

MIT

