# Codebase Audit Report
## Prioritized Improvements for Flight Planner

---

## 🔴 **CRITICAL PRIORITY** (High Impact, Easy Wins)

### 1. **Duplicate Route Requirements Logic** ⚠️
**Location:** `src/context/UserContext.tsx` (lines 217-225, 295-303) and `src/pages/Simulator.tsx` (lines 181-186)

**Problem:** Route requirements are hardcoded in 3 places:
- `calculateUnlockedRoutes()` function
- `getRouteStatus()` function  
- `Simulator.tsx` `getRouteRequirement()` function

**Impact:** High - Any route requirement change requires updates in 3 places, prone to bugs

**Fix:**
```typescript
// Create src/constants/routeRequirements.ts
export const ROUTE_REQUIREMENTS = {
  'content-demandgen': { minScore: 40, minMiles: 1800 },
  'content-seo': { minScore: 40, minMiles: 2100 },
  'content-abm': { minScore: 60, minMiles: 1200 },
  'social-video': { minScore: 25, minMiles: 1500 },
  'demandgen-ops': { minScore: 50, minMiles: 900 },
  'ai-sales': { minScore: 70, minMiles: 2200 },
  'seo-growth': { minScore: 55, minMiles: 1600 },
} as const;
```

**Files to Update:**
- `src/context/UserContext.tsx` - Import and use constant
- `src/pages/Simulator.tsx` - Import and use constant

---

### 2. **UserContext Re-renders on Every State Change** ⚠️
**Location:** `src/context/UserContext.tsx` (line 337-346)

**Problem:** The context value object is recreated on every render, causing all consumers to re-render even when their specific data hasn't changed.

**Impact:** High - Performance degradation, especially on JourneyMap with many components

**Fix:**
```typescript
// Memoize the context value
const value: UserContextType = useMemo(() => ({
  ...state,
  setProfile,
  submitQuickAssessment,
  submitDeepAssessment,
  setTechStack,
  setCurrentJourney,
  getRouteStatus,
  resetData,
}), [state, setProfile, submitQuickAssessment, submitDeepAssessment, setTechStack, setCurrentJourney, getRouteStatus, resetData]);

// Also memoize action handlers with useCallback
const setProfile = useCallback((profile: UserProfile) => {
  setState(prev => ({ ...prev, profile }));
}, []);
// ... repeat for all handlers
```

---

### 3. **Missing Dependency Arrays in useEffect** ⚠️
**Location:** Multiple files

**Problems Found:**
- `src/pages/Results.tsx:38` - Missing `navigate` in dependency array (actually has it, but could be optimized)
- `src/pages/Assessment.tsx:57` - Auto-save effect runs on every render
- `src/context/UserContext.tsx:134` - localStorage save runs on every state change (could be debounced)

**Impact:** Medium-High - Unnecessary re-renders and localStorage writes

**Fix:**
```typescript
// Debounce localStorage writes
useEffect(() => {
  const timeoutId = setTimeout(() => {
    localStorage.setItem('flightPlannerState', JSON.stringify(state));
  }, 500);
  return () => clearTimeout(timeoutId);
}, [state]);
```

---

### 4. **TypeScript: 'any' Types** ⚠️
**Location:** 
- `src/utils/analytics.ts:8` - `[key: string]: any`
- `src/components/Layout.tsx:12` - `params?: any`

**Impact:** Medium - Loses type safety

**Fix:**
```typescript
// analytics.ts
export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  page?: string;
  [key: string]: string | number | boolean | undefined; // More specific
}

// Layout.tsx
const getBreadcrumbs = (pathname: string, params?: Record<string, string>): Array<{ label: string; path: string }> => {
```

---

## 🟡 **HIGH PRIORITY** (Significant Impact)

### 5. **JourneyMap Component Too Large** (1785 lines!)
**Location:** `src/pages/JourneyMap.tsx`

**Problem:** Single file with 1785 lines containing:
- Multiple sub-components (CityMarker, FlipNumber, etc.)
- Complex state management (15+ useState hooks)
- Heavy calculations
- Map rendering logic

**Impact:** High - Hard to maintain, test, and optimize

**Fix:** Split into:
```
src/pages/JourneyMap/
  ├── JourneyMap.tsx (main component, ~200 lines)
  ├── components/
  │   ├── CityMarker.tsx
  │   ├── RouteLayer.tsx
  │   ├── AirTrafficControlPanel.tsx
  │   ├── RoutePlanner.tsx
  │   └── MapControls.tsx
  ├── hooks/
  │   ├── useMapInteractions.ts
  │   ├── useRouteCalculations.ts
  │   └── useCityStatus.ts
  └── utils/
      ├── mapCalculations.ts
      └── routeHelpers.ts
```

---

### 6. **Heavy Calculations Not Memoized**
**Location:** `src/pages/JourneyMap.tsx`

**Problems:**
- `calculateDistance` - Called repeatedly, should be memoized
- `findWaypointCities` - Complex calculation, not cached
- `getRecommendedScenariosForMap` - Recalculates on every render

**Impact:** Medium-High - Performance issues on map interactions

**Fix:**
```typescript
// Already using useCallback, but verify dependencies
const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // ... calculation
}, []); // No dependencies needed - pure function

// Memoize expensive filtered lists
const filteredCities = useMemo(() => {
  return CITIES.filter(/* ... */);
}, [showAllCities, showOnlyUnlocked, cityStatus]);
```

---

### 7. **Code Splitting for Heavy Libraries**
**Location:** 
- `src/pages/JourneyMap.tsx` - `react-map-gl` and `mapbox-gl` (~500KB)
- `src/pages/Home.tsx` - `driver.js` (~50KB, only used for tour)

**Impact:** Medium - Large initial bundle size

**Fix:**
```typescript
// JourneyMap.tsx - Lazy load
const JourneyMap = lazy(() => import('./pages/JourneyMap'));

// Home.tsx - Dynamic import for tour
const startTour = async () => {
  const { driver } = await import('driver.js');
  // ... tour logic
};
```

---

### 8. **Duplicate REAO Calculation Logic**
**Location:**
- `src/context/UserContext.tsx:164` - `calculateREAO()`
- `src/pages/Simulator.tsx:201-204` - Inline REAO calculation

**Impact:** Medium - Inconsistency risk

**Fix:** Export `calculateREAO` from UserContext and reuse in Simulator

---

### 9. **Hardcoded Magic Numbers**
**Location:** Multiple files

**Examples:**
- `src/context/UserContext.tsx:157` - `0.7` and `0.3` (assessment/tech weights)
- `src/context/UserContext.tsx:178-184` - REAO multipliers (`0.9`, `1.1`, `0.8`)
- `src/pages/Assessment.tsx:36` - `TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000`
- `src/pages/Results.tsx:115-121` - Animation timers (`2000`, `2200`)

**Impact:** Low-Medium - Hard to maintain

**Fix:** Create `src/constants/scoring.ts`:
```typescript
export const SCORING_WEIGHTS = {
  ASSESSMENT: 0.7,
  TECH_STACK: 0.3,
} as const;

export const REAO_MULTIPLIERS = {
  READINESS: 0.9,
  EFFICIENCY: 1.1,
  ALIGNMENT: 0.8,
  OPPORTUNITY: 1.0, // Always 100
} as const;

export const ANIMATION_DELAYS = {
  REVEAL_START: 2000,
  CONTENT_SHOW: 2200,
} as const;
```

---

## 🟢 **MEDIUM PRIORITY** (Good Practices)

### 10. **Console Statements in Production**
**Location:** Multiple files (11 instances)

**Files:**
- `src/utils/analytics.ts` - 3 console.error
- `src/pages/Assessment.tsx` - 2 console.error
- `src/pages/Results.tsx` - 2 console.error, 1 console.log
- `src/pages/JourneyMap.tsx` - 1 console.log (debug)
- `src/context/UserContext.tsx` - 1 console.error
- `src/components/ErrorBoundary.tsx` - 1 console.error

**Impact:** Low - Should use proper logging service

**Fix:** Create `src/utils/logger.ts`:
```typescript
const isDev = import.meta.env.DEV;

export const logger = {
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
    // In production: send to error tracking service
  },
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
};
```

---

### 11. **Inconsistent Naming Conventions**
**Location:** Multiple files

**Examples:**
- `getRouteStatus` vs `getRouteRequirement` (Simulator)
- `combinedScore` vs `score` (inconsistent usage)
- `assessmentResponses` vs `responses` (Assessment component)

**Impact:** Low - Code clarity

**Fix:** Standardize naming across codebase

---

### 12. **Missing React.memo for Expensive Components**
**Location:** Multiple components

**Candidates:**
- `CityMarker` in JourneyMap (renders many times)
- `REAOGauge` in Results (if extracted)
- `ScenarioCard` components

**Impact:** Medium - Unnecessary re-renders

**Fix:**
```typescript
export const CityMarker = React.memo<CityMarkerProps>(({
  isHovered,
  isUnlocked,
  // ...
}) => {
  // ... component
}, (prev, next) => {
  // Custom comparison if needed
  return prev.isHovered === next.isHovered && 
         prev.isUnlocked === next.isUnlocked;
});
```

---

### 13. **Derived State Instead of Stored State**
**Location:** `src/context/UserContext.tsx`

**Problem:** Some values are calculated and stored, but could be derived:
- `planeLevel` - Can be derived from `combinedScore`
- `unlockedRoutes` - Can be derived from `combinedScore` + `flightMiles`

**Impact:** Low-Medium - State sync issues possible

**Note:** Current approach is fine for performance (cached calculations), but consider if recalculation is needed elsewhere

---

### 14. **Missing Error Boundaries for Heavy Components**
**Location:** 
- `src/pages/JourneyMap.tsx` - Map rendering could fail
- `src/pages/Results.tsx` - Chart rendering could fail

**Impact:** Medium - App crashes if map/charts fail

**Fix:** Wrap heavy components in ErrorBoundary

---

### 15. **Large Imports from staticData**
**Location:** Multiple files importing entire `staticData.ts`

**Problem:** Files import entire file even if only using one export:
```typescript
import { CITIES, ROUTES, SCENARIOS, getRecommendedScenarios } from '../data/staticData';
```

**Impact:** Low - Tree-shaking should handle this, but verify

**Fix:** Verify bundle size, consider splitting `staticData.ts` if needed

---

## 🔵 **LOW PRIORITY** (Polish & Best Practices)

### 16. **Type Definitions Could Be More Specific**
**Location:** Multiple files

**Examples:**
- `RouteStatus.status` - Could use union type literal
- `UserProfile.goals` - Could be typed array of specific strings
- Plane level strings - Could use const assertion

**Impact:** Low - Type safety improvement

---

### 17. **Extract Reusable Hooks**
**Location:** Multiple components

**Candidates:**
- `useLocalStorage` - Used in multiple places
- `useDebounce` - For search inputs
- `useAnalytics` - Wrap analytics calls

**Impact:** Low - Code reusability

---

### 18. **Accessibility Improvements**
**Location:** Multiple components

**Issues:**
- Missing `aria-label` on some buttons
- Color contrast ratios (verify)
- Keyboard navigation on modals

**Impact:** Low-Medium - Accessibility compliance

---

### 19. **Inconsistent File Organization**
**Location:** Component structure

**Current:**
- Some components in `components/`
- Some in `pages/`
- UI components in `components/ui/`

**Suggestion:** Consider feature-based organization for larger components

---

### 20. **Missing JSDoc Comments**
**Location:** Complex functions

**Impact:** Low - Developer experience

**Fix:** Add JSDoc to:
- Calculation functions in UserContext
- Complex utility functions
- Custom hooks

---

## 📊 **Summary Statistics**

- **Total Issues Found:** 20
- **Critical:** 4
- **High Priority:** 5
- **Medium Priority:** 6
- **Low Priority:** 5

**Estimated Impact:**
- **Performance:** 3-5x improvement possible with memoization and code splitting
- **Maintainability:** Significant improvement with component splitting
- **Type Safety:** Moderate improvement with better typing
- **Bundle Size:** 30-40% reduction possible with code splitting

---

## 🎯 **Recommended Implementation Order**

1. **Week 1:** Fix Critical Issues (#1-4)
   - Extract route requirements constant
   - Memoize UserContext
   - Fix useEffect dependencies
   - Fix TypeScript 'any' types

2. **Week 2:** High Priority Performance (#5-7)
   - Split JourneyMap component
   - Add code splitting
   - Optimize calculations

3. **Week 3:** Code Quality (#8-12)
   - Extract duplicate logic
   - Create constants file
   - Add proper logging
   - Standardize naming

4. **Week 4:** Polish (#13-20)
   - Add error boundaries
   - Extract reusable hooks
   - Improve accessibility
   - Add documentation

---

## 🔍 **Additional Observations**

### Positive Patterns Found:
✅ Good use of `useMemo` in several places
✅ Proper TypeScript usage overall
✅ Clean component structure
✅ Good separation of concerns (Context, Data, Pages)

### Areas of Excellence:
- UserContext design is solid
- State management approach is clean
- Component composition is good

### Quick Wins (Can Do Immediately):
1. Extract route requirements constant (30 min)
2. Add memoization to UserContext value (15 min)
3. Create constants file for magic numbers (20 min)
4. Replace console statements with logger (30 min)

**Total Quick Win Time:** ~2 hours for significant improvements

