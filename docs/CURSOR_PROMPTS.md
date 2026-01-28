# 🎯 CURSOR QUICK REFERENCE CARD
## Copy-Paste These Exact Prompts

---

## 🚀 **GETTING STARTED**

### First Thing to Say to Cursor:
```
I have a React + TypeScript + Vite project for a marketing assessment tool. 
I've already built the core assessment flow (Home, Assessment, Results pages) 
and now I need to build 6 additional features. 

Please read the .cursorrules file in the project root to understand the 
full context, architecture, and what's already working.

Let me know when you're ready and I'll tell you which feature to build first.
```

---

## 📋 **SCENARIO PAGES (Start Here)**

### Build Scenarios List:
```
Create src/pages/Scenarios.tsx that displays the 3 pre-built scenarios from 
PRE_BUILT_SCENARIOS in staticData.ts as a grid of cards. Each card should show 
title, description, target audience, and duration. Add a "View Details" button 
that navigates to /scenarios/:id. Use the same dark theme (slate-950 bg, 
cyan-500 accents) as Home.tsx. Make it mobile responsive.
```

### Build Scenario Detail:
```
Create src/pages/ScenarioDetail.tsx that:
1. Gets scenario ID from URL params using useParams
2. Finds matching scenario in PRE_BUILT_SCENARIOS from staticData.ts
3. Displays 3-phase timeline with visual progress indicators
4. Shows task checklists for each phase (visual only, no state needed)
5. Lists deliverables per phase
6. Shows total duration
7. Has "Start Journey" CTA button (navigates back to home)
8. Add breadcrumb: Home > Scenarios > [Name]
9. Use dark theme + cyan accents
10. Mobile responsive

Use lucide-react icons: Rocket (Foundation), TrendingUp (Growth), Award (Scale)
```

---

## 🔧 **TECH STACK AUDIT**

### Build Tech Stack Form:
```
Create src/pages/TechStackAudit.tsx with a form containing 6 tool categories:
CRM, Marketing Automation Platform, Analytics, Content Management, 
Social Media Tools, Sales Enablement

For each category:
- "Add Tool" button
- Each tool has: name input + utilization slider (1-10) + delete button
- Show category average

At top: Show real-time overall average score
At bottom: "Submit Tech Stack" button

On submit:
1. Import useUser from context/UserContext
2. Format data as TechStackItem[]
3. Call setTechStack()
4. Navigate to /results

Validation:
- Need at least 3 tools total
- No empty tool names
- Show red error messages
- Disable submit until valid

Add tooltip: "Utilization: 1 = barely using, 10 = fully optimized"

Use collapsible sections, dark theme, cyan accents, smooth animations.
```

---

## 📊 **OPERATIONS CENTER**

### Build Dashboard:
```
Create src/pages/OperationsCenter.tsx with a 4-section grid dashboard:

Section 1 - Current Status (top-left):
- Plane level with icon and color from UserContext
- Score as mini altimeter gauge (reuse from Results.tsx)
- Flight miles earned
- All data from useUser() hook

Section 2 - Quick Stats (top-right):
- Total routes unlocked (count from UserContext)
- Assessment completion date
- Days since last update
- Tech stack maturity (if available)

Section 3 - Unlocked Routes (bottom-left):
- List all unlocked routes from UserContext
- Show from city → to city
- Green checkmarks

Section 4 - Quick Actions (bottom-right):
Buttons to:
- "Retake Assessment" → /assessment/quick
- "View Journey Map" → /journey-map
- "Optimize Tech Stack" → /tech-stack
- "Explore Scenarios" → /scenarios

If user hasn't taken assessment:
- Show centered "Get Started" prompt
- "Take Your First Assessment" CTA

Dark theme, cyan accents, mobile responsive, grid layout.
```

---

## 🎮 **WHAT-IF SIMULATOR**

### Build Simulator:
```
Create src/pages/Simulator.tsx with interactive projections:

3 Sliders:
- Budget: $10K to $1M (logarithmic scale)
- Team Size: 1 to 50 people  
- Tool Count: 0 to 20 tools

Projection Formula:
projectedScore = currentScore + (budget/50000 * 5) + (teamSize * 2) + (toolCount * 3)
(cap at 100)

Get currentScore from UserContext using useUser()

Display side-by-side:
- Current State (score, plane level, unlocked routes)
- Projected State (if sliders applied)

Below sliders, show "Routes You'd Unlock":
- Import ROUTES from staticData.ts
- Check projected score against route requirements in UserContext
- Show locked routes that WOULD unlock in yellow
- Show routes that remain locked in gray
- Show already unlocked in green with checkmarks

Add insights panel showing:
- Points needed for next route unlock
- Which investment (budget/team/tools) has best ROI
- Personalized recommendations based on projections

Buttons:
- "Reset to Current" (reset all sliders)
- "See Full Impact" (save projection, go to /results)

Dark theme, cyan accents, smooth animations on score changes.
```

---

## 🗺️ **JOURNEY MAP** (Most Complex)

### Step 1 - Choose Map Library:
```
I need an interactive world map for my Journey Map page. I need to:
- Plot 13 cities (from CITIES in staticData.ts) with lat/lng
- Draw arcing lines between cities for routes
- Color routes based on unlock status (green/yellow/gray)
- Make it interactive (click, hover)
- Dark theme

Should I use Mapbox GL JS, React Simple Maps, or custom SVG?
Which would work best and why?
```

### Step 2 - Build Map (if using React Simple Maps):
```
Create src/pages/JourneyMap.tsx using react-simple-maps:

1. Install: npm install react-simple-maps
2. Create dark-themed world map filling viewport
3. Plot 13 cities from CITIES in staticData.ts as glowing cyan dots
4. Show city name + function on hover
5. Add zoom controls

Import useUser from context/UserContext to access getRouteStatus()
```

### Step 3 - Add Routes:
```
Add routes to the JourneyMap:

For each route in ROUTES from staticData.ts:
1. Draw curved line from origin city to destination city
2. Get color from UserContext.getRouteStatus(routeId):
   - 'unlocked' → green (#10b981)
   - 'partial' → yellow (#eab308)  
   - 'locked' → gray (#475569)
3. Add glow effect to unlocked routes
4. Make routes clickable

Add animation when hovering over routes.
```

### Step 4 - Add Route Modal:
```
Create a modal that opens when clicking a route on the map:

Modal content:
- Route name and description
- Waypoints as checklist
- Requirements (score + miles needed)
- If locked: Show "You need X more points to unlock"
- If unlocked: Show "Start Journey" button
- Close button (X) in top-right
- Click outside modal to close
- Smooth fade-in animation

Use portal for modal (render outside map container).
```

### Step 5 - Add Legend:
```
Add a legend in bottom-left corner of the map:

Show:
- Green circle → "Unlocked Routes"
- Yellow circle → "Partially Available"
- Gray circle → "Locked Routes"  
- Cyan dot → "Marketing Function"

Style:
- Semi-transparent dark background
- White text
- Small, unobtrusive
- Fixed position
```

---

## 🐛 **DEBUGGING PROMPTS**

### Component Not Rendering:
```
My [ComponentName] isn't rendering. Error: [paste error]

Check:
1. Are imports correct?
2. Is export statement there?
3. Is it added to router in App.tsx?
4. Any TypeScript errors?

Here's my code: [paste]
```

### UserContext Data Missing:
```
I'm using useUser() but data isn't showing. Here's my component:

[paste code]

Can you verify:
1. I'm using the hook correctly
2. The data exists in UserContext
3. I'm accessing the right properties
```

### Styling Broken:
```
My [ComponentName] styling doesn't match the app. Can you update it to use:
- Background: slate-950
- Primary: cyan-500
- Text: white/slate-300
- Match Home.tsx and Results.tsx style
- Mobile responsive

Here's current code: [paste]
```

### Data Not Persisting:
```
Data disappears after refresh. I thought UserContext handles localStorage?

Here's what I'm doing: [explain]

Can you check if I need to add anything?
```

---

## 🎨 **POLISH PROMPTS**

### Add Loading States:
```
Add loading states to [ComponentName]:
- Show spinner while data loads
- Skeleton screens for cards
- Smooth fade-in when ready
Use lucide-react Loader2 icon with spin animation
```

### Add Error Handling:
```
Add error handling to [ComponentName]:
- Try/catch blocks
- Error boundaries
- Friendly error messages
- "Try Again" button
Show errors in red with AlertCircle icon
```

### Add Animations:
```
Add smooth animations to [ComponentName]:
- Fade in on mount
- Slide up for cards
- Scale on hover
- Smooth transitions (300ms duration)
Use Tailwind transition classes
```

### Improve Mobile:
```
Improve mobile responsiveness for [ComponentName]:
- Test at 375px (iPhone SE)
- Stack grid on mobile
- Larger touch targets (min 44px)
- Reduce padding on small screens
- Hide non-essential elements
```

---

## ✅ **TESTING PROMPTS**

### Create Test File:
```
Create unit tests for [ComponentName] using Jest and React Testing Library:
- Test rendering
- Test user interactions
- Test data flow from UserContext
- Mock UserContext provider
- Test edge cases (no data, error states)
```

### Test User Flow:
```
Create a test that walks through this user flow:
1. User fills profile
2. Takes assessment
3. Views results
4. Explores journey map
5. Adds tech stack
6. Checks operations center

Verify data persists at each step.
Use testing-library/user-event for interactions.
```

### Performance Test:
```
Profile the app and identify bottlenecks:
- Check for unnecessary re-renders
- Measure bundle size
- Check map rendering performance
- Look for memory leaks
Suggest optimizations with code examples.
```

---

## 🎓 **LEARNING PROMPTS**

### Understand Codebase:
```
Explain how [feature] works in this codebase.
Walk me through the data flow from:
1. User interaction
2. State update in UserContext
3. Component re-render
4. UI update

Use the actual code as reference.
```

### Best Practices:
```
Review my [ComponentName] and suggest improvements for:
- Code organization
- Performance
- Accessibility
- Error handling
- TypeScript types
- Component structure

Show me before/after examples.
```

---

## 🚨 **EMERGENCY PROMPTS**

### Broke Something:
```
I made changes and now [feature] is broken. Can you:
1. Review my recent changes
2. Identify what broke
3. Fix it
4. Explain what went wrong

The error is: [paste error]
```

### Start Over on Feature:
```
I want to rebuild [ComponentName] from scratch. Can you:
1. Keep the same functionality
2. Improve the code structure
3. Add better error handling
4. Make it more maintainable

Here's what it should do: [describe]
```

---

## 📚 **REMEMBER**

1. **Always mention the .cursorrules file** when starting a new conversation
2. **Reference existing components** (Home.tsx, Results.tsx) for style consistency
3. **Test after each feature** before moving to the next
4. **Ask Cursor to explain** if you don't understand something
5. **Use Cursor Composer** for changes across multiple files

---

**You're all set! Start with Scenarios page and work your way through. Good luck! 🚀**
