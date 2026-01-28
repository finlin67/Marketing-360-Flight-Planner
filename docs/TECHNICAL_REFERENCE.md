# Marketing Flight Planner - Technical Reference Document

**Version:** 2.1.0  
**Last Updated:** 2024  
**Purpose:** Complete technical reference for recreating or maintaining the Marketing Flight Planner application

**Recent Updates:**
- Tech Stack Audit redesigned with pre-populated tool library (100+ tools)
- New `techTools.ts` data file with categories, presets, and helper functions
- Enhanced search, filtering, and preset selection features

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [Data Models](#data-models)
6. [State Management](#state-management)
7. [Routing Structure](#routing-structure)
8. [Key Components](#key-components)
9. [Scoring System](#scoring-system)
10. [Styling & Theming](#styling--theming)
11. [Build & Deployment](#build--deployment)
12. [Key Algorithms](#key-algorithms)
13. [Implementation Details](#implementation-details)
14. [Dependencies](#dependencies)

---

## Project Overview

**Marketing Flight Planner** is a B2B marketing maturity assessment tool that uses aviation metaphors to gamify the assessment experience. Users take a marketing assessment and receive:

- A "Plane Level" (Grounded → Puddle Jumper → Regional Jet → Commercial Jet → Airbus 380)
- Flight Miles (gamification points)
- Unlocked routes to different marketing capabilities (visualized as cities on a world map)
- Actionable recommendations based on their maturity

### Core Concept

Marketing functions are represented as **cities** on a world map, and growth paths are **routes** between cities. Users unlock routes as they improve their marketing maturity score.

---

## Technology Stack

### Core Framework
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **Vite 5.0.8** - Build tool and dev server

### Routing
- **react-router-dom 6.20.1** - Client-side routing (HashRouter)

### UI Libraries
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Lucide React 0.294.0** - Icon library
- **Recharts 2.10.3** - Data visualization (gauges, charts)
- **react-simple-maps 3.0.0** - Interactive world map

### Development Tools
- **@vitejs/plugin-react** - Vite React plugin
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

---

## Project Structure

```
flight-planner-fixed/
├── index.html                 # Entry HTML file
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
│
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component with routing
│   ├── index.css             # Global styles + Tailwind imports
│   │
│   ├── context/
│   │   └── UserContext.tsx   # Global state management (THE BRAIN)
│   │
│   ├── data/
│   │   ├── staticData.ts     # Cities, routes, questions, scenarios
│   │   └── techTools.ts      # Marketing tech tools library (100+ tools)
│   │
│   ├── pages/
│   │   ├── Home.tsx          # Landing page with booking form
│   │   ├── Assessment.tsx    # 10-question assessment form
│   │   ├── Results.tsx       # Score visualization & recommendations
│   │   ├── Scenarios.tsx     # Pre-built scenario cards
│   │   ├── ScenarioDetail.tsx # Detailed scenario view
│   │   ├── TechStackAudit.tsx # Tech stack selection & scoring
│   │   ├── JourneyMap.tsx    # Interactive world map
│   │   ├── Simulator.tsx     # What-if projections
│   │   ├── OperationsCenter.tsx # Dashboard
│   │   └── PlaceholderPages.tsx # Stub pages (if any)
│   │
│   └── components/
│       └── Layout.tsx         # Nav bar + footer wrapper
│
└── dist/                      # Build output (generated)
```

---

## Architecture & Design Patterns

### Single Source of Truth
- **UserContext.tsx** is the central state management system
- All calculations happen automatically when state changes
- Data persists via localStorage
- No prop drilling - components use `useUser()` hook

### Component Architecture
- **Functional components only** (no class components)
- **Custom hooks** for reusable logic
- **Context API** for global state
- **React Router** for navigation

### Data Flow
```
User Action → Context Update → Automatic Calculations → UI Update → localStorage Persist
```

### Key Patterns
1. **Context Provider Pattern** - UserProvider wraps entire app
2. **Controlled Components** - All forms use controlled inputs
3. **Derived State** - Scores calculated from raw data, not stored separately
4. **Optimistic Updates** - UI updates immediately, then persists

---

## Data Models

### UserProfile
```typescript
interface UserProfile {
  role: string;              // CMO, VP Marketing, etc.
  industry: string;           // SaaS, Technology, etc.
  companySize: string;        // 1-50, 51-200, etc.
  companyType: string;        // B2B, B2C, etc.
  revenue: string;           // <$1M, $1M-$10M, etc.
  goals: string[];           // Array of selected goals
}
```

### AssessmentResponse
```typescript
interface AssessmentResponse {
  questionId: number;        // Question identifier
  category: string;          // Category (Strategy, Operations, etc.)
  score: number;             // 0-100 points
}
```

### TechTool (UserContext Interface)
```typescript
interface TechTool {
  name: string;              // Tool name (e.g., "Salesforce")
  category: string;          // Category (e.g., "CRM")
  utilizationScore: number; // 1-10 utilization rating
}
```

**Note:** This is the format stored in UserContext. The source data comes from `techTools.ts` (see below).

### TechTool (Source Data - techTools.ts)
```typescript
interface TechTool {
  id: string;                // Unique identifier (e.g., "salesforce")
  name: string;              // Tool name (e.g., "Salesforce")
  category: string;          // Category (e.g., "Data & Analytics")
  description?: string;      // Optional description
  recommendedFor: ('SMB' | 'Mid-Market' | 'Enterprise')[]; // Company size recommendations
  isTopTool: boolean;       // Whether it's a top/popular tool
}
```

**Location:** `src/data/techTools.ts`

**Contains:**
- `MARKETING_TECH_TOOLS`: Array of 100+ marketing tools
- `TECH_TOOL_CATEGORIES`: 5 categories (Data & Analytics, Content & Creative, etc.)
- `TECH_STACK_PRESETS`: 5 pre-built tool stacks
- Helper functions: `getToolsByCategory()`, `getToolsByCompanySize()`, `getTopTools()`

### City (Marketing Function)
```typescript
interface City {
  id: string;               // Unique identifier (e.g., "nyc")
  name: string;             // Display name (e.g., "New York City")
  function: string;          // Marketing function (e.g., "Content Marketing")
  coords: [number, number]; // [latitude, longitude]
  region: 'NA' | 'EU' | 'APAC' | 'MENA';
  description: string;      // Brief description
}
```

### Route (Growth Path)
```typescript
interface Route {
  id: string;               // Unique identifier
  from: string;             // Origin city ID
  to: string;               // Destination city ID
  name: string;             // Display name
  description: string;      // Route description
  waypoints: string[];     // Intermediate city IDs
  estimatedDuration: string; // e.g., "3-6 months"
}
```

### Scenario
```typescript
interface Scenario {
  id: string;
  title: string;
  description: string;
  industry: string;        // Target audience
  duration: string;
  challenge: string;
  from: string;            // Origin city ID
  to: string;              // Destination city ID
  waypointCities: string[]; // Cities along the route
  purpose: string;         // Purpose category
  techRequirements?: string[]; // Required tech categories
}
```

### UserState (Complete State)
```typescript
interface UserState {
  // Input data
  profile: UserProfile | null;
  assessmentResponses: AssessmentResponse[];
  techStack: TechTool[];
  
  // Calculated values
  combinedScore: number;        // 0-100
  planeLevel: string;          // Plane level name
  flightMiles: number;          // Gamification points
  
  // REAO breakdown
  readinessScore: number;      // 0-100
  efficiencyScore: number;      // 0-100
  alignmentScore: number;      // 0-100
  opportunityScore: number;     // Always 100
  
  // Journey state
  unlockedRoutes: string[];    // Array of route IDs
  currentJourney: {
    from: string;
    to: string;
    purpose: string;
  } | null;
  
  // Timestamps
  assessmentTimestamp: number | null;
  lastUpdateTimestamp: number | null;
}
```

---

## State Management

### UserContext.tsx - The Brain

**Location:** `src/context/UserContext.tsx`

**Purpose:** Single source of truth for all user data and calculations.

**Key Functions:**

#### 1. Profile Management
```typescript
setProfile(profile: UserProfile): void
```
- Updates user profile
- Triggers recalculation if needed

#### 2. Assessment Submission
```typescript
submitQuickAssessment(responses: AssessmentResponse[]): void
submitDeepAssessment(responses: AssessmentResponse[]): void
```
- Saves assessment responses
- Automatically calculates:
  - Combined score
  - Plane level
  - Flight miles
  - REAO metrics
  - Unlocked routes
- Updates timestamp

#### 3. Tech Stack Management
```typescript
setTechStack(tools: TechTool[]): void
```
- Saves tech stack
- Recalculates combined score (tech stack = 30% weight)
- Updates all derived metrics

#### 4. Route Status
```typescript
getRouteStatus(routeId: string): RouteStatus
```
- Returns: `'unlocked' | 'partial' | 'locked'`
- Calculates progress percentage
- Used for map visualization

#### 5. Data Persistence
- **Automatic localStorage sync** on every state change
- **Loads on mount** from localStorage
- Key: `'flightPlannerState'`

### Usage in Components
```typescript
import { useUser } from '../context/UserContext';

const MyComponent = () => {
  const { 
    combinedScore, 
    planeLevel, 
    setProfile,
    submitQuickAssessment 
  } = useUser();
  
  // Use state values
  // Call functions to update
};
```

---

## Routing Structure

### Router Configuration
**Location:** `src/App.tsx`

**Router Type:** `HashRouter` (for static hosting compatibility)

### Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Landing page with booking form |
| `/assessment/quick` | `Assessment` (type="quick") | Quick 10-question assessment |
| `/assessment/deep` | `Assessment` (type="deep") | Deep dive assessment (future) |
| `/tech-stack` | `TechStackAudit` | Tech stack selection & scoring |
| `/results` | `Results` | Score visualization & recommendations |
| `/journey-map` | `JourneyMap` | Interactive world map with routes |
| `/scenarios` | `Scenarios` | Pre-built scenario cards |
| `/scenarios/:id` | `ScenarioDetail` | Detailed scenario view |
| `/simulator` | `Simulator` | What-if projections |
| `/operations` | `OperationsCenter` | Dashboard |
| `*` | `Navigate to="/"` | Fallback redirect |

### Navigation
- All navigation uses `react-router-dom` `Link` or `useNavigate()`
- HashRouter means URLs look like: `/#/results`, `/#/journey-map`
- No server-side routing needed

---

## Key Components

### 1. Layout.tsx
**Purpose:** Wrapper component with navigation and footer

**Features:**
- Sticky top navigation bar
- Flight status display (plane level, score, miles)
- Mobile-responsive menu
- Notification badge on Tech Stack nav (if incomplete)
- Footer

**Key Props:** `children` (page content)

### 2. Home.tsx
**Purpose:** Landing page with booking form and scenario cards

**Features:**
- FROM/TO/PURPOSE booking form
- Dynamic scenario filtering based on selections
- Interactive world map with city highlighting
- Scenario cards with hover effects
- Map route animation

**State:**
- `fromCity`, `toCity`, `purpose` - Form selections
- `hoveredScenario` - For map highlighting
- `filteredScenarios` - Computed from selections

### 3. Assessment.tsx
**Purpose:** Assessment form with profile section

**Features:**
- Collapsible Traveler Profile section (role, industry, etc.)
- 10-question assessment form
- Progress bar
- Auto-collapse profile when questions start
- Tech stack modal after submission (if incomplete)

**Props:** `type: 'quick' | 'deep'`

### 4. Results.tsx
**Purpose:** Score visualization and recommendations

**Features:**
- Altimeter gauge (RadialBarChart)
- REAO metrics (4 gauges)
- Plane level display
- Recommendations list
- Tech stack prompt (if incomplete)
- Tech stack maturity display (if completed)

**Redirects to:** Home if no assessment completed

### 5. TechStackAudit.tsx
**Purpose:** Tech stack selection interface with pre-populated tool library

**Data Source:** `src/data/techTools.ts` (100+ marketing tools)

**Features:**

**Top Section - Score Summary:**
- Tech Stack Maturity score (X/10) with progress bar
- Tools Selected count (X/100+)
- 30% contribution indicator
- Categories reviewed progress indicator

**Quick Select Presets:**
- 5 preset buttons:
  - Enterprise Stack (12 tools)
  - Mid-Market Stack (11 tools)
  - SMB Growth Stack (11 tools)
  - ABM-Focused Stack (8 tools)
  - Product-Led Growth Stack (8 tools)
- Clicking a preset pre-selects all tools in that preset (default utilization: 5/10)
- Auto-expands relevant categories

**Search & Filter:**
- Real-time search across tool names, categories, and descriptions
- Company size filter: All | SMB | Mid-Market | Enterprise
- Filters update tool list instantly

**Tool Categories (Accordion):**
- 5 categories with icons:
  - Data & Analytics (BarChart3 icon)
  - Content & Creative (Sparkles icon)
  - Acquisition & Marketing Automation (TrendingUp icon)
  - CRO & Experience (Database icon)
  - Retention & Customer Success (CheckCircle2 icon)
- First category expanded by default
- Shows tool count and category average utilization
- Smooth expand/collapse animations

**Tool Cards:**
- Each tool displays:
  - Tool name (cyan if selected)
  - Company size badges (SMB | Mid-Market | Enterprise)
  - Checkbox to select/deselect
  - Utilization slider (1-10) when selected
  - Slider shows value and "Barely using" → "Fully optimized" labels
- Hover effects and selected state styling

**Smart Features:**
- Smart suggestion based on user's company size from profile
- Progress indicator showing categories reviewed
- Real-time score updates as tools are selected/modified
- Success message with "View Updated Results" button after save

**State Management:**
```typescript
const [selectedTools, setSelectedTools] = useState<{
  toolId: string;
  utilization: number;
}[]>([]);
const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [sizeFilter, setSizeFilter] = useState<'All' | 'SMB' | 'Mid-Market' | 'Enterprise'>('All');
```

**On Submit:**
- Formats selected tools to UserContext format (name, category, utilizationScore)
- Calls `setTechStack()` from UserContext
- Shows success message
- Option to navigate to `/results`

### 6. JourneyMap.tsx
**Purpose:** Interactive world map visualization

**Features:**
- World map using react-simple-maps
- 13 cities plotted as cyan dots
- 7 routes drawn as curved lines
- Color coding: green (unlocked), yellow (partial), gray (locked)
- Route click → Modal with details
- City hover tooltips

**Data Source:** `CITIES` and `ROUTES` from `staticData.ts`

### 7. Scenarios.tsx
**Purpose:** Pre-built scenario cards

**Features:**
- Grid of scenario cards
- Tech requirements display
- Checkmarks for owned tools
- Highlights for missing tools
- Click → Navigate to detail page

### 8. ScenarioDetail.tsx
**Purpose:** Detailed scenario view

**Features:**
- 3-phase timeline (Foundation → Growth → Scale)
- Task checklists per phase
- Deliverables list
- Duration display
- "Start Journey" CTA
- Breadcrumb navigation

### 9. Simulator.tsx
**Purpose:** What-if projections

**Features:**
- 3 sliders: Budget, Team Size, Tool Count
- Real-time score projection
- Side-by-side comparison (Current vs Projected)
- Routes that would unlock
- ROI insights

### 10. OperationsCenter.tsx
**Purpose:** Dashboard

**Features:**
- 4-section grid:
  1. Current Status (plane level, score, miles)
  2. Quick Stats (routes unlocked, dates)
  3. Unlocked Routes list
  4. Quick Actions (buttons to other pages)

---

## Scoring System

### Combined Score Calculation

**Formula:**
```typescript
if (techStack.length > 0) {
  combinedScore = (assessmentAvg * 0.7) + (techAvg * 0.3)
} else {
  combinedScore = assessmentAvg
}
```

**Where:**
- `assessmentAvg` = Average of all assessment question scores (0-100 each)
- `techAvg` = Average of tech tool utilization scores × 10 (1-10 → 0-100)

**Result:** 0-100 integer

### Plane Level Assignment

**Levels:**
```typescript
PLANE_LEVELS = [
  { minScore: 0,  maxScore: 20, name: 'Grounded',      icon: '🛬', color: '#ef4444' },
  { minScore: 21, maxScore: 40, name: 'Puddle Jumper', icon: '🛩️', color: '#f59e0b' },
  { minScore: 41, maxScore: 60, name: 'Regional Jet',   icon: '✈️', color: '#eab308' },
  { minScore: 61, maxScore: 80, name: 'Commercial Jet',  icon: '🛫', color: '#22c55e' },
  { minScore: 81, maxScore: 100, name: 'Airbus 380',    icon: '🚀', color: '#06b6d4' },
]
```

**Logic:** Find level where `score >= minScore && score <= maxScore`

### Flight Miles Calculation

**Formula:**
```typescript
let miles = combinedScore * 100;  // Base miles
if (assessmentResponses.length > 0) miles += 500;  // Completion bonus
if (techStack.length > 0) miles += 300;  // Tech stack bonus
```

### REAO Metrics

**Readiness Score:**
```typescript
readinessScore = Math.round(combinedScore * 0.9)
```
- Strategy, Planning, Team capabilities

**Efficiency Score:**
```typescript
efficiencyScore = Math.round(combinedScore * 1.1 > 100 ? 100 : combinedScore * 1.1)
```
- Operations, Tech Stack, Process

**Alignment Score:**
```typescript
alignmentScore = Math.round(combinedScore * 0.8)
```
- Cross-functional, Sales/Marketing alignment

**Opportunity Score:**
```typescript
opportunityScore = 100  // Always 100 (represents potential)
```

### Route Unlocking

**Requirements:**
Each route has:
- `minScore`: Minimum combined score needed
- `minMiles`: Minimum flight miles needed

**Unlock Logic:**
```typescript
if (combinedScore >= route.minScore && flightMiles >= route.minMiles) {
  route.unlocked = true
}
```

**Route Status:**
- `'unlocked'`: Meets both requirements
- `'partial'`: 70-99% progress toward requirements
- `'locked'`: <70% progress

**Route Requirements (from UserContext):**
```typescript
{
  'content-demandgen': { minScore: 40, minMiles: 1800 },
  'content-seo': { minScore: 40, minMiles: 2100 },
  'content-abm': { minScore: 60, minMiles: 1200 },
  'social-video': { minScore: 25, minMiles: 1500 },
  'demandgen-ops': { minScore: 50, minMiles: 900 },
  'ai-sales': { minScore: 70, minMiles: 2200 },
  'seo-growth': { minScore: 55, minMiles: 1600 },
}
```

---

## Styling & Theming

### Tailwind CSS Configuration

**Location:** `tailwind.config.js`

**Theme:**
- Background: `slate-950` (#020617) - Very dark blue-gray
- Primary: `cyan-500` (#06b6d4) - Cyan accent
- Secondary: `slate-800` (#1e293b) - Dark cards
- Text: `white` / `slate-300` - Light text
- Success: `emerald-500` - Green
- Warning: `yellow-500` - Yellow
- Danger: `red-500` - Red

### Color Palette Usage

| Element | Color | Usage |
|---------|-------|-------|
| Background | `bg-slate-950` | Main page background |
| Cards | `bg-slate-900` / `bg-slate-800` | Card backgrounds |
| Primary Accent | `text-cyan-400` / `bg-cyan-500` | Buttons, links, highlights |
| Borders | `border-slate-800` / `border-slate-700` | Card borders |
| Text Primary | `text-white` | Headings, important text |
| Text Secondary | `text-slate-400` | Descriptions, labels |
| Unlocked Routes | `#10b981` (emerald-500) | Green on map |
| Partial Routes | `#eab308` (yellow-500) | Yellow on map |
| Locked Routes | `#475569` (slate-600) | Gray on map |

### Global Styles

**Location:** `src/index.css`

**Includes:**
- Tailwind directives (`@tailwind base/components/utilities`)
- Custom animations (if any)
- Font imports (if any)

### Responsive Design

**Breakpoints:**
- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+)
- Desktop: `md:` (768px+)
- Large: `lg:` (1024px+)

**Common Patterns:**
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grids
- `hidden md:flex` - Hide on mobile, show on desktop
- `text-sm md:text-base` - Responsive text sizes

---

## Build & Deployment

### Development

```bash
npm run dev
```
- Starts Vite dev server
- Port: 5173
- Hot Module Replacement (HMR) enabled

### Production Build

**Full Build (with type checking):**
```bash
npm run build
```
- Runs TypeScript compiler
- Then runs Vite build
- Output: `dist/` folder

**Quick Build (skip type checking):**
```bash
npm run build:skip-check
```
- Skips TypeScript checks
- Faster for testing
- Output: `dist/` folder

### Build Output

```
dist/
├── index.html              # Entry point
└── assets/
    ├── index-*.css         # All styles (minified)
    └── index-*.js          # All JavaScript (minified)
```

**File Sizes:**
- Total: ~780 KB
- Gzipped: ~222 KB
- CSS: ~32 KB (gzipped: ~6 KB)
- JS: ~780 KB (gzipped: ~222 KB)

### Preview Build Locally

```bash
npm run preview
```
- Serves `dist/` folder
- Port: 4173
- Tests production build

### Deployment

**Static Hosting:**
1. Copy entire `dist/` folder to web server
2. Ensure `index.html` is in root
3. No server configuration needed (HashRouter)

**Platforms:**
- **Vercel**: Connect repo, auto-deploys
- **Netlify**: Connect repo, auto-deploys
- **GitHub Pages**: Upload `dist/` contents
- **Any static host**: Upload `dist/` contents

**Server Configuration (if not using HashRouter):**

Apache (`.htaccess`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Key Algorithms

### 1. Scenario Filtering (Home.tsx)

**Purpose:** Filter scenarios based on FROM/TO/PURPOSE selections

**Algorithm:**
```typescript
function filterScenarios(fromCity, toCity, purpose) {
  // Score each scenario based on matches
  scenarios.forEach(scenario => {
    let score = 0;
    
    if (fromCity && scenario.from === fromCity) score += 3;
    if (toCity && scenario.to === toCity) score += 3;
    if (purpose && scenario.purpose === purpose) score += 2;
    
    // Bonus for partial matches
    if (scenario.waypointCities.includes(fromCity)) score += 1;
    if (scenario.waypointCities.includes(toCity)) score += 1;
  });
  
  // Sort by score, return top 3-5
  return scenarios.sort((a, b) => b.score - a.score).slice(0, 5);
}
```

### 2. Curved Route Path (JourneyMap.tsx, Home.tsx)

**Purpose:** Draw curved lines between cities on map

**Algorithm:**
```typescript
function createCurvedPath(start, end, projection) {
  const startPoint = projection(start);
  const endPoint = projection(end);
  
  // Calculate midpoint
  const midX = (startPoint[0] + endPoint[0]) / 2;
  const midY = (startPoint[1] + endPoint[1]) / 2;
  
  // Calculate perpendicular offset
  const dx = endPoint[0] - startPoint[0];
  const dy = endPoint[1] - startPoint[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offset = Math.min(distance * 0.3, 80);
  
  // Perpendicular vector (rotated 90 degrees)
  const perpX = -dy / distance;
  const perpY = dx / distance;
  
  // Control point for quadratic curve
  const controlX = midX + perpX * offset;
  const controlY = midY + perpY * offset;
  
  // SVG quadratic bezier path
  return `M ${startPoint[0]} ${startPoint[1]} Q ${controlX} ${controlY} ${endPoint[0]} ${endPoint[1]}`;
}
```

### 3. Score Projection (Simulator.tsx)

**Purpose:** Calculate projected score from sliders

**Formula:**
```typescript
projectedScore = currentScore 
  + (budget / 50000 * 5)      // Budget contribution
  + (teamSize * 2)            // Team contribution
  + (toolCount * 3)           // Tool contribution

// Cap at 100
projectedScore = Math.min(projectedScore, 100);
```

### 4. Tech Stack Maturity (TechStackAudit.tsx & Results.tsx)

**Purpose:** Calculate tech stack maturity score

**Formula:**
```typescript
// Tool count score (max 50 points) - normalized to 0-10 scale
const toolCountScore = Math.min(selectedTools.length / 20 * 5, 5);
// Utilization score (max 50 points) - normalized to 0-10 scale
const avgUtilization = selectedTools.reduce((sum, t) => sum + t.utilization, 0) / selectedTools.length;
const utilizationScore = (avgUtilization / 10) * 5;
// Total maturity (0-10 scale)
const maturityScore = Math.round((toolCountScore + utilizationScore) * 10) / 10;
```

**Display:**
- Shown as X/10 in TechStackAudit page score summary
- Used in Results page for tech stack maturity gauge
- Updates in real-time as tools are selected or utilization scores change

---

## Implementation Details

### localStorage Persistence

**Key:** `'flightPlannerState'`

**Structure:** Complete `UserState` object as JSON

**Lifecycle:**
1. On mount: Load from localStorage
2. On state change: Save to localStorage
3. On reset: Remove from localStorage

**Error Handling:**
- Try/catch on parse
- Falls back to initial state if parse fails

### Modal Implementation

**Pattern:** Fixed overlay with backdrop

**Example (Assessment.tsx):**
```typescript
{showModal && (
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
    onClick={handleClose}
  >
    <div 
      className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal content */}
    </div>
  </div>
)}
```

### Form Handling

**Pattern:** Controlled components with local state

**Example:**
```typescript
const [value, setValue] = useState('');

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Submission:**
- Collect all form values
- Format as required type
- Call context function (e.g., `setProfile()`, `submitQuickAssessment()`)
- Navigate to next page

### Map Visualization

**Library:** `react-simple-maps`

**Data Source:** World map topology from CDN
```typescript
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
```

**Cities:** Plotted as `Marker` components with coordinates from `CITIES`

**Routes:** Drawn as SVG paths using `createCurvedPath()` function

**Interactivity:**
- Hover: Show tooltip
- Click: Show modal with route details
- Color: Based on `getRouteStatus()` result

### Chart Visualization

**Library:** `recharts`

**Usage:**
- **RadialBarChart:** Altimeter gauge, REAO metrics
- **ResponsiveContainer:** Wraps charts for responsiveness

**Example:**
```typescript
<ResponsiveContainer width="100%" height={200}>
  <RadialBarChart data={data}>
    <RadialBar dataKey="value" fill="#06b6d4" />
  </RadialBarChart>
</ResponsiveContainer>
```

### Animation Patterns

**CSS Animations:**
- `animate-pulse` - Pulsing effect (notification badges)
- `transition-all` - Smooth transitions
- `hover:` - Hover effects

**React Animations:**
- State-based conditional rendering
- Smooth scroll on navigation
- Fade-in on mount

### Error Boundaries

**Current:** None implemented (could add for production)

**Recommendation:** Add React Error Boundary component

### Performance Optimizations

**Current:**
- `useMemo` for expensive calculations (Results.tsx)
- Conditional rendering to avoid unnecessary work
- localStorage caching

**Potential Improvements:**
- Code splitting with `React.lazy()`
- Memoization of expensive components
- Virtual scrolling for long lists

---

## Dependencies

### Production Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "lucide-react": "^0.294.0",
  "recharts": "^2.10.3",
  "react-simple-maps": "^3.0.0"
}
```

### Development Dependencies

```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.2.2",
  "vite": "^5.0.8",
  "tailwindcss": "^3.3.6",
  "postcss": "^8.4.32",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.55.0"
}
```

### Installation

```bash
npm install
```

---

## Critical Implementation Notes

### 1. HashRouter Requirement
- **Must use HashRouter** (not BrowserRouter) for static hosting
- URLs will have `#` (e.g., `/#/results`)
- No server configuration needed

### 2. State Calculation Order
Calculations happen in this order:
1. Combined score (from assessment + tech stack)
2. Plane level (from combined score)
3. Flight miles (from combined score + bonuses)
4. REAO metrics (from combined score)
5. Unlocked routes (from combined score + flight miles)

**All calculations are automatic** - don't call them manually.

### 3. Route Requirements
Route requirements are defined in **two places**:
- `UserContext.tsx` - `routeRequirements` object (for unlocking logic)
- `staticData.ts` - `ROUTES` array (for display)

**Keep these in sync!**

### 4. City Coordinates
City coordinates in `staticData.ts` are `[lat, lon]` format.
Map libraries may expect `[lon, lat]` - check your library's requirements.

### 5. Tech Stack Categories
Tech stack categories are defined in `src/data/techTools.ts`:
- `TECH_TOOL_CATEGORIES` array contains the 5 main categories
- Categories must match between:
  - `techTools.ts` - Source data and category definitions
  - `TechStackAudit.tsx` - UI display
  - `Scenarios.tsx` - Tech requirements
  - `staticData.ts` - Scenario tech requirements

**Keep category names consistent across all files!**

**Category List:**
1. Data & Analytics
2. Content & Creative
3. Acquisition & Marketing Automation
4. CRO & Experience
5. Retention & Customer Success

### 6. Assessment Questions
Assessment questions are in `staticData.ts` as `QUICK_ASSESSMENT_QUESTIONS`.
Each question has:
- `id`: Number identifier
- `category`: String category
- `question`: Display text
- `description`: Help text
- `options`: Array of { value: number, label: string }

### 7. localStorage Key
**Key:** `'flightPlannerState'`
**Format:** JSON string of complete `UserState` object

If you change the state structure, consider:
- Versioning the key
- Migration logic
- Backward compatibility

---

## Testing Checklist

Before deploying, verify:

- [ ] All routes navigate correctly
- [ ] Assessment submission calculates scores
- [ ] Tech stack updates combined score
- [ ] Routes unlock based on score/miles
- [ ] Data persists after page refresh
- [ ] Map displays cities and routes
- [ ] Mobile responsive on all pages
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Static files work on test server

---

## Common Issues & Solutions

### Issue: Blank Screen
**Causes:**
- JavaScript error in component
- Missing import
- TypeScript error (if using strict build)

**Solution:**
- Check browser console
- Verify all imports
- Use `build:skip-check` for testing

### Issue: State Not Persisting
**Causes:**
- localStorage disabled
- JSON parse error
- State structure changed

**Solution:**
- Check localStorage in DevTools
- Verify JSON structure
- Add error handling

### Issue: Routes Not Unlocking
**Causes:**
- Route requirements mismatch
- Score calculation error
- Route ID mismatch

**Solution:**
- Verify route IDs match between files
- Check score calculation logic
- Debug `getRouteStatus()` function

### Issue: Map Not Displaying
**Causes:**
- CDN blocked
- Coordinate format wrong
- Missing react-simple-maps

**Solution:**
- Check network tab for CDN request
- Verify coordinate format
- Reinstall react-simple-maps

---

## Future Enhancements

### Potential Additions:
1. **Backend API** - Store data server-side
2. **User Authentication** - Multi-user support
3. **Export Reports** - PDF generation
4. **Email Integration** - Send results via email
5. **Analytics** - Track user behavior
6. **A/B Testing** - Test different question sets
7. **Custom Scenarios** - User-created scenarios
8. **Team Collaboration** - Share results with team
9. **Historical Tracking** - Track score over time
10. **Recommendation Engine** - AI-powered suggestions

---

## Contact & Support

For questions or issues:
1. Check this document first
2. Review code comments
3. Check browser console for errors
4. Verify all dependencies installed

---

**Document Version:** 2.1.0  
**Last Updated:** 2024  
**Maintained By:** Development Team

**Changelog:**
- v2.1.0: Updated Tech Stack Audit section with new tool library approach (100+ tools, presets, search/filter)
- v2.0.0: Initial comprehensive technical reference

---

*This document is a living reference. Update it as the codebase evolves.*

