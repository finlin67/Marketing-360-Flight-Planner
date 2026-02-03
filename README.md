# FlightPlanner

**Marketing Altitude • Your Operational Cockpit.**

Aviation-themed B2B marketing maturity assessment. Map your marketing journey in ~5 minutes, get your current "altitude," and receive a personalized 90-day roadmap — free and self-service.

![FlightPlanner Homepage](docs/homepage-screenshot.png)

---

## What It Does

- **Assess** — Answer 10 questions about strategy, content, demand gen, and more.
- **Score** — Get an **Altitude Score**, **Plane Level** (Grounded → Puddle Jumper → Regional Jet → Commercial Jet → Airbus 380), and **Flight Miles**.
- **Visualize** — See REAO metrics, unlocked routes, and a visual journey map.
- **Plan** — Get tailored recommendations and a path to the next level.

**Plane levels** = maturity progression. **Cities** = marketing capabilities (Content, ABM, Demand Gen, etc.). **Routes** = growth paths that unlock as you improve.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No signup required.

| Script            | Command              | Description        |
|-------------------|----------------------|--------------------|
| Dev server        | `npm run dev`        | Vite dev at :5173  |
| Production build  | `npm run build`      | TypeScript + Vite  |
| Preview build     | `npm run preview`    | Local preview      |
| Lint              | `npm run lint`       | ESLint (ts/tsx)    |

---

## Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for score/REAO charts
- **Mapbox / react-map-gl** for Journey Map
- **Framer Motion** for animations
- **driver.js** for guided tours

---

## Project Structure

```
src/
├── App.tsx                 # Routes and app shell
├── context/
│   └── UserContext.tsx     # Profile, assessment, scoring, persistence
├── data/
│   └── staticData.ts       # Cities, routes, questions, scenarios
├── pages/
│   ├── Home.tsx            # Landing, CTAs, “How it works”
│   ├── Assessment.tsx      # 10-question assessment
│   ├── Results.tsx         # Altitude, plane level, REAO, recommendations
│   ├── JourneyMap.tsx      # Visual journey map
│   ├── Scenarios.tsx       # Scenario explorer
│   ├── FlightLog.tsx       # History / log
│   └── ...
├── components/              # Layout, Hero, gauges, charts, UI
├── constants/              # Scoring, route requirements, styles
├── hooks/                  # useLocalStorage, useUserSelectors
└── utils/                  # Analytics, score calculations, logging
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Quick Start](docs/QUICK_START.md) | Get running in 5 minutes |
| [Setup](docs/SETUP_INSTRUCTIONS.md) | Environment and setup |
| [Deployment](docs/DEPLOYMENT_GUIDE.md) | Deploy (static/Vercel/Netlify) |
| [Start Here](docs/START_HERE.md) | Overview and first steps |
| [Full README](docs/README.md) | Architecture and implementation details |

---

## License & Credits

© 2024 Marketing Flight Planner. All systems operational.

Built with aviation-grade precision for marketing excellence — by a marketing leader who wished this existed years ago.
