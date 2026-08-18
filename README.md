# Finance Advisor — UI Scaffold

UI-only build of the 3 sketched pages: **Landing**, **Dashboard**, and
**Finance Advisor** (plus simple About/Login placeholders). Theme is carried
over from the reference portfolio: periwinkle background, navy ink text,
Playfair Display headline serif, quiet editorial cards, left icon-rail nav.

Nothing in here talks to a real backend yet — every chart uses mock data,
and every action button is a stub. That's intentional; this is meant to be
a clean shell for the rest of the team to wire real logic into.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

```bash
npm run build      # production build → /dist
npm run preview    # preview the production build locally
npm run lint       # run eslint
```

## Project structure

```
src/
  components/
    Icons.jsx           inline SVG icon set (no binary assets needed)
    IconPanel.jsx        left nav rail (desktop) + bottom tab bar (mobile)
    MoneyBoat.jsx          paper boat folded from a money note, fixed corner
    SummaryCard.jsx       the "Card 1 / Card 2" metric cards
    UploadPanel.jsx       drag/drop + browse UI for balance sheet upload
    charts/
      ExpenseTrendChart.jsx    "Time vs Expense" line chart
      CategoryPieChart.jsx     "Distribution" pie chart
      DepartmentBarChart.jsx   "Visualization — 01" bar chart
  data/
    mockData.js          placeholder numbers powering every chart/card
  pages/
    LandingPage.jsx       hero, service cards, how-it-works, CTA → /upload
    AboutPage.jsx          placeholder
    LoginPage.jsx          placeholder, non-functional form
    UploadFlowPage.jsx     upload → analyzing → "dashboard ready" → /dashboard
    DashboardPage.jsx     cards + charts + upload + download bar
    AdvisorPage.jsx        assets/liabilities, reinvest box, free-text advisor
  styles/
    global.css            all design tokens + layout + component styles
  App.jsx                 routes
  main.jsx                entry point
```

## The flow (as of this pass)

`Landing` → **Get started** now goes to **`/upload`** first (not straight to
the dashboard). `UploadFlowPage` shows the upload panel, then a brief
"analyzing" state, then a "your dashboard is ready" card with a button into
`/dashboard`. Right now the "analyzing" step is a 1.6s `setTimeout` — swap
that for your real pipeline and only flip to the "ready" state once the
backend confirms.

## Sidebar changes

- Main nav is now just **Home / Dashboard / Chatbot**.
- **Login** moved to the bottom of the sidebar as a full-width pill button.
- **About Us** is now a small circular **i** info button next to Login
  (still routes to `/about`) — kept it lightweight since it's a supporting
  page, not a primary destination.
- A copyright line sits under those two.
- On mobile, the sidebar is replaced entirely by a fixed bottom tab bar
  (Home / Dashboard / Chatbot / Info / Login) — same pattern the reference
  portfolio uses for its mobile nav, rather than squeezing the full sidebar
  into a narrow column.

## The money boat

Replaces the old animated-squiggle corner accent: a small paper boat folded
from a dollar note (`MoneyBoat.jsx`), sitting on two quiet water lines,
gently bobbing. Respects `prefers-reduced-motion`. Repositions and shrinks
on mobile so it doesn't collide with the bottom tab bar.

## Where the team plugs in real logic

Every stub is marked with a `TODO(team)` comment. The main ones:

- **`UploadPanel.jsx`** → `handleFiles()` — currently just stores the file
  name in state. Replace with your real upload/parsing/preview pipeline
  (matches Functions 1–3 in the functional spec: upload, mapping, preview).
- **`UploadFlowPage.jsx`** → `handleFileSelected()` — the "analyzing" step
  is a fake `setTimeout`. Replace with your real upload → parse →
  categorize → analyze call, and only reveal "dashboard ready" once it
  actually resolves.
- **`DashboardPage.jsx` / `AdvisorPage.jsx`** → the "Download report /
  dashboard" buttons are unwired. Hook up to your PDF/PPTX export.
- **`AdvisorPage.jsx`** → `handleGetInsights()` — currently just logs to
  console. Replace with a real call to your chatbot/LLM endpoint, passing
  the free-text `operationText` plus whatever computed financial facts you
  want it grounded in.
- **`data/mockData.js`** → replace every export with real API responses
  once the backend is live. Every chart/card component already expects
  this exact shape, so swapping the data source shouldn't require touching
  the components themselves.
- **Auth** → `LoginPage.jsx` is a static, disabled form. Wire it to
  whatever auth provider you choose.

## Notes on the theme

- Colors, type, and the icon-panel nav pattern are adapted from the
  reference portfolio (`--bg-main: #9eccfa`, `--text-main: #212842`,
  Playfair Display for headlines). All tokens live at the top of
  `src/styles/global.css` — change them there and they cascade everywhere.
- No external image assets are required; all icons are inline SVG
  (`src/components/Icons.jsx`), so the whole thing runs cleanly with just
  `npm install`.

## Backend setup (chatbot + intelligence API)

The frontend currently runs on mock data (`src/data/mockData.js`). To connect it to the real thing, the backend needs to be running separately.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Environment variables** — copy the example file and fill in your own key:
```bash
cp .env.example .env
```
Then edit `.env`:
```
GROQ_API_KEY=your_key_here
```

Everyone on the team needs **their own** Groq API key — don't share one key in a committed file:
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up/log in (free, no card required)
3. **API Keys** in the sidebar → **Create API Key**
4. Copy it into your own local `.env` (never commit this file — it's already in `.gitignore`)

**Run the backend:**
```bash
uvicorn main:app --reload --port 8000
```

**Test it's working:**
- `http://localhost:8000/health` → should return `{"status": "ok"}`
- `http://localhost:8000/docs` → interactive API docs, use this to try `/chat` and `/api/intel/*` endpoints by hand
- Or from the terminal:
```bash
  curl -X POST http://localhost:8000/chat \
    -H "Content-Type: application/json" \
    -d '{"question": "What was our biggest expense category?"}'
```

**Run the chatbot's evaluation suite** (test questions with known answers, used to report accuracy):
```bash
python3 run_eval.py
```
Full output also saves to `eval_results.txt`.

**Run both halves together:** backend on `localhost:8000`, frontend on `localhost:5173` (Vite's default, confirmed in `vite.config.js`) — CORS is already configured for that port in `main.py`.
