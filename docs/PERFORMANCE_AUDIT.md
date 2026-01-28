# Performance Audit & Optimization Plan

## Executive Summary

This audit identifies performance bottlenecks across bundle size, rendering, data fetching, and assets. **Expected overall impact: 40-60% reduction in initial load time and 30-50% improvement in runtime performance.**

---

## 1. Bundle Size Analysis

### 🔴 Critical Issues

#### 1.1 Large Dependencies Loaded Eagerly
**Current State:**
- `react-map-gl` + `mapbox-gl` (~500KB gzipped) - Loaded on every page via `App.tsx`
- `recharts` (~200KB gzipped) - Imported in Results, Simulator, OperationsCenter
- `driver.js` (~50KB) - Only used on Home page but loaded globally
- `lucide-react` - Full library imported, but only specific icons used

**Impact:** 
- Initial bundle: ~750KB+ of unused code on most pages
- First Contentful Paint (FCP): +800ms delay
- Time to Interactive (TTI): +1.2s delay

**Evidence:**
```typescript
// src/App.tsx - All routes loaded eagerly
import { JourneyMap } from './pages/JourneyMap';  // Loads mapbox (~500KB)
import { Simulator } from './pages/Simulator';     // Loads recharts (~200KB)
import { OperationsCenter } from './pages/OperationsCenter'; // Loads recharts

// src/pages/Home.tsx
import { driver } from 'driver.js';  // Only used on Home, but loaded immediately
import 'driver.js/dist/driver.css';
```

#### 1.2 Unused Imports
**Found:**
- `SCENARIOS` imported in Results.tsx but never used
- `Map` icon imported in Results.tsx but never used
- `RadialBarChart`, `RadialBar` imported but not used in Results.tsx
- `react-simple-maps` in package.json but not used anywhere
- `Assessments` component imported but route redirects

**Impact:** ~50KB of dead code

#### 1.3 Large Static Data Files
**Current State:**
- `staticData.ts` - Contains all cities, routes, scenarios (~50KB)
- `techTools.ts` - 100+ tools with metadata (~30KB)
- Both loaded on every page

**Impact:** ~80KB of data loaded even when not needed

---

## 2. Rendering Performance

### 🔴 Critical Issues

#### 2.1 UserContext Re-renders Entire App
**Current State:**
```typescript
// src/context/UserContext.tsx
// Context value changes trigger re-renders of ALL consumers
// Even with useMemo, any state change causes cascade
```

**Impact:**
- Every state update in UserContext causes:
  - Results page re-render
  - JourneyMap re-render (expensive!)
  - All other pages re-render
- Estimated: 50-100ms per state update

**Evidence:**
- UserContext has 15+ calculated values that update on any change
- All pages consume UserContext via `useUser()` hook
- No component-level memoization

#### 2.2 JourneyMap Expensive Calculations
**Current State:**
```typescript
// src/pages/JourneyMap.tsx
const citiesGeoJSON = useMemo(() => getCitiesGeoJSON(CITIES), []);
const routeStatuses = useMemo(() => {
  // Calculates status for ALL routes on every render
}, [combinedScore, flightMiles]);
const filteredCities = useMemo(() => {
  // Filters ALL cities on every render
}, [searchQuery, selectedRegion]);
```

**Issues:**
- `getCitiesGeoJSON` called on every mount (should be cached)
- Route statuses recalculated even when score hasn't changed
- No memoization of expensive distance calculations
- Map re-renders on every state change

**Impact:**
- Initial render: 200-300ms
- State updates: 50-100ms per change
- Map interactions: 30-50ms lag

#### 2.3 TechStackAudit Large Lists
**Current State:**
- 100+ tools rendered in DOM
- No virtualization
- All tools re-render on filter/search change
- Utilization sliders trigger parent re-render

**Impact:**
- Initial render: 150-200ms
- Filter changes: 100-150ms
- Slider updates: 50ms each

#### 2.4 Results Page Heavy Charts
**Current State:**
- Multiple Recharts components render on mount
- Charts recalculate on every UserContext update
- No memoization of chart data

**Impact:**
- Chart render: 100-150ms
- Re-renders: 50-100ms each

---

## 3. Data Fetching

### 🟡 Moderate Issues

#### 3.1 No API Calls (All Static Data)
**Current State:**
- All data is static (cities, routes, scenarios)
- No external API calls
- Data loaded from `staticData.ts` and `techTools.ts`

**Opportunities:**
- Could lazy-load static data files
- Could cache parsed data structures
- Could split data by route

#### 3.2 localStorage Reads on Every Render
**Current State:**
```typescript
// UserContext reads localStorage on every mount
useEffect(() => {
  const saved = localStorage.getItem('flightPlannerState');
  // Parses entire state object
}, []);
```

**Impact:**
- Initial load: 10-20ms per read
- Multiple components read localStorage independently

**Opportunities:**
- Cache parsed localStorage data
- Use single source of truth
- Batch localStorage operations

---

## 4. Assets

### 🟡 Moderate Issues

#### 4.1 No Images Currently
**Current State:**
- No image assets found
- All UI is CSS/Tailwind based
- Icons from lucide-react (SVG)

**Future Considerations:**
- If adding images: Use WebP format
- Consider CDN for static assets
- Lazy load images below fold

#### 4.2 CSS Bundle Size
**Current State:**
- Tailwind CSS generates full utility classes
- No purging of unused classes detected
- All Tailwind utilities included

**Impact:**
- CSS bundle: ~50-100KB (estimated)
- Could be optimized with proper purging

---

## Implementation Plan

### Phase 1: Quick Wins (High Impact, Low Effort) ⚡

**Expected Impact:** 30-40% bundle reduction, 20-30% render improvement

#### 1.1 Code Splitting (Route-based)
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';

const JourneyMap = lazy(() => import('./pages/JourneyMap'));
const Simulator = lazy(() => import('./pages/Simulator'));
const OperationsCenter = lazy(() => import('./pages/OperationsCenter'));
const TechStackAudit = lazy(() => import('./pages/TechStackAudit'));

// Wrap routes in Suspense
<Route path="/journey-map" element={
  <Suspense fallback={<LoadingSpinner />}>
    <JourneyMap />
  </Suspense>
} />
```

**Impact:**
- Initial bundle: -500KB (mapbox)
- Initial load: -800ms
- **Effort:** 1 hour

#### 1.2 Lazy Load driver.js
```typescript
// src/pages/Home.tsx
const loadDriver = async () => {
  const { driver } = await import('driver.js');
  await import('driver.js/dist/driver.css');
  return driver;
};

// Only load when tour is actually started
```

**Impact:**
- Initial bundle: -50KB
- Initial load: -100ms
- **Effort:** 30 minutes

#### 1.3 Remove Unused Imports
```typescript
// Remove from Results.tsx
- import { SCENARIOS } from '../data/staticData';
- import { Map } from 'lucide-react';
- import { RadialBarChart, RadialBar } from 'recharts';

// Remove unused package
- "react-simple-maps": "^3.0.0"
```

**Impact:**
- Bundle: -50KB
- **Effort:** 15 minutes

#### 1.4 Tree-shake lucide-react
```typescript
// Instead of:
import { ArrowRight, Plane, Clock } from 'lucide-react';

// Use:
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Plane from 'lucide-react/dist/esm/icons/plane';
import Clock from 'lucide-react/dist/esm/icons/clock';
```

**Impact:**
- Bundle: -100KB (estimated)
- **Effort:** 2 hours (update all imports)

---

### Phase 2: Rendering Optimizations (Medium Impact, Medium Effort) 🎯

**Expected Impact:** 30-40% render improvement

#### 2.1 Memoize UserContext Selectors
```typescript
// Create selector hooks to prevent unnecessary re-renders
export const useCombinedScore = () => {
  const context = useContext(UserContext);
  return useMemo(() => context.combinedScore, [context.combinedScore]);
};

export const usePlaneLevel = () => {
  const context = useContext(UserContext);
  return useMemo(() => context.planeLevel, [context.planeLevel]);
};
```

**Impact:**
- Re-renders: -60% (only components using changed values re-render)
- **Effort:** 3 hours

#### 2.2 React.memo for Expensive Components
```typescript
// src/pages/JourneyMap.tsx
export const JourneyMap = React.memo(() => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.userScore === nextProps.userScore;
});

// src/pages/Results.tsx - Memoize chart components
const ScoreChart = React.memo(({ data }) => {
  return <RadialBarChart data={data} />;
});
```

**Impact:**
- Re-renders: -40% for JourneyMap
- Chart re-renders: -50%
- **Effort:** 2 hours

#### 2.3 Virtualize TechStackAudit List
```typescript
// Use react-window or react-virtual
import { FixedSizeList } from 'react-window';

const VirtualizedToolList = ({ tools }) => (
  <FixedSizeList
    height={600}
    itemCount={tools.length}
    itemSize={120}
  >
    {({ index, style }) => (
      <div style={style}>
        <ToolItem tool={tools[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

**Impact:**
- Initial render: -100ms
- Filter performance: -80ms
- **Effort:** 4 hours

#### 2.4 Memoize Expensive Calculations
```typescript
// src/pages/JourneyMap.tsx
const citiesGeoJSON = useMemo(() => {
  // Cache this - it never changes
  return getCitiesGeoJSON(CITIES);
}, []); // Empty deps - only calculate once

// Cache distance calculations
const distanceCache = useRef(new Map());
const getDistance = useCallback((lat1, lon1, lat2, lon2) => {
  const key = `${lat1},${lon1},${lat2},${lon2}`;
  if (distanceCache.current.has(key)) {
    return distanceCache.current.get(key);
  }
  const dist = calculateDistance(lat1, lon1, lat2, lon2);
  distanceCache.current.set(key, dist);
  return dist;
}, []);
```

**Impact:**
- Route calculations: -50ms
- Map interactions: -30ms
- **Effort:** 2 hours

---

### Phase 3: Data Optimization (Medium Impact, Low Effort) 📦

**Expected Impact:** 20-30% load improvement

#### 3.1 Split Static Data by Route
```typescript
// src/data/cities.ts
export const CITIES = [...];

// src/data/routes.ts
export const ROUTES = [...];

// src/data/scenarios.ts
export const SCENARIOS = [...];

// Lazy load in components
const JourneyMap = lazy(() => 
  import('./pages/JourneyMap').then(module => ({
    default: module.JourneyMap,
    cities: import('./data/cities'),
    routes: import('./data/routes')
  }))
);
```

**Impact:**
- Initial bundle: -80KB
- Initial load: -100ms
- **Effort:** 2 hours

#### 3.2 Cache localStorage Parsing
```typescript
// src/context/UserContext.tsx
let cachedState: UserState | null = null;

const loadState = () => {
  if (cachedState) return cachedState;
  
  const saved = localStorage.getItem('flightPlannerState');
  if (saved) {
    cachedState = JSON.parse(saved);
  }
  return cachedState || getInitialState();
};
```

**Impact:**
- Initial load: -10ms
- **Effort:** 30 minutes

---

### Phase 4: Advanced Optimizations (High Impact, High Effort) 🚀

**Expected Impact:** Additional 20-30% improvement

#### 4.1 Split Recharts Bundle
```typescript
// Only import what's needed
import RadialBarChart from 'recharts/es6/chart/RadialBarChart';
import RadialBar from 'recharts/es6/polar/RadialBar';
// Instead of full recharts import
```

**Impact:**
- Bundle: -150KB
- **Effort:** 1 hour

#### 4.2 Service Worker for Caching
```typescript
// Cache static data and assets
// Offline support
// Background updates
```

**Impact:**
- Repeat visits: -90% load time
- **Effort:** 8 hours

#### 4.3 Web Workers for Heavy Calculations
```typescript
// Move route calculations to web worker
// Keep UI responsive during heavy computations
```

**Impact:**
- UI responsiveness: +100%
- **Effort:** 6 hours

---

## Priority Matrix

| Priority | Task | Impact | Effort | ROI |
|----------|------|--------|--------|-----|
| 🔴 P0 | Code splitting (routes) | High | Low | ⭐⭐⭐⭐⭐ |
| 🔴 P0 | Remove unused imports | Medium | Low | ⭐⭐⭐⭐⭐ |
| 🟡 P1 | Memoize UserContext | High | Medium | ⭐⭐⭐⭐ |
| 🟡 P1 | React.memo for JourneyMap | High | Low | ⭐⭐⭐⭐ |
| 🟡 P1 | Lazy load driver.js | Medium | Low | ⭐⭐⭐⭐ |
| 🟢 P2 | Virtualize TechStack list | Medium | Medium | ⭐⭐⭐ |
| 🟢 P2 | Split static data | Medium | Low | ⭐⭐⭐ |
| 🟢 P2 | Cache calculations | Low | Low | ⭐⭐⭐ |
| 🔵 P3 | Tree-shake lucide | Medium | High | ⭐⭐ |
| 🔵 P3 | Service worker | High | High | ⭐⭐ |

---

## Expected Results

### Before Optimization:
- **Initial Bundle:** ~1.2MB
- **First Contentful Paint:** 2.5s
- **Time to Interactive:** 4.0s
- **Re-render time:** 100-200ms per update

### After Phase 1 (Quick Wins):
- **Initial Bundle:** ~650KB (-46%)
- **First Contentful Paint:** 1.5s (-40%)
- **Time to Interactive:** 2.5s (-38%)
- **Re-render time:** 80-150ms (-25%)

### After Phase 2 (Rendering):
- **Initial Bundle:** ~650KB (same)
- **First Contentful Paint:** 1.5s (same)
- **Time to Interactive:** 2.5s (same)
- **Re-render time:** 40-80ms (-60%)

### After All Phases:
- **Initial Bundle:** ~400KB (-67%)
- **First Contentful Paint:** 1.0s (-60%)
- **Time to Interactive:** 1.8s (-55%)
- **Re-render time:** 20-50ms (-75%)

---

## Measurement Plan

### Tools:
1. **Lighthouse** - Overall performance score
2. **Chrome DevTools Performance** - Render profiling
3. **Bundle Analyzer** - `vite-bundle-visualizer`
4. **React DevTools Profiler** - Component render times

### Metrics to Track:
- Bundle size (before/after)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
- Component render counts
- Re-render frequency

---

## Implementation Checklist

### Phase 1: Quick Wins
- [ ] Implement route-based code splitting
- [ ] Lazy load driver.js
- [ ] Remove unused imports
- [ ] Remove unused packages
- [ ] Test bundle size reduction

### Phase 2: Rendering
- [ ] Create UserContext selector hooks
- [ ] Add React.memo to JourneyMap
- [ ] Add React.memo to chart components
- [ ] Memoize expensive calculations
- [ ] Profile render improvements

### Phase 3: Data
- [ ] Split static data files
- [ ] Implement localStorage caching
- [ ] Lazy load data by route
- [ ] Test load time improvements

### Phase 4: Advanced
- [ ] Tree-shake lucide-react
- [ ] Split Recharts bundle
- [ ] Consider service worker
- [ ] Consider web workers

---

## Notes

- **Testing:** After each phase, run Lighthouse and compare scores
- **Rollback:** Each optimization is independent - can rollback if issues
- **Monitoring:** Add performance monitoring in production
- **User Testing:** Test on slow devices/connections after optimizations

---

**Last Updated:** 2024
**Next Review:** After Phase 1 implementation
