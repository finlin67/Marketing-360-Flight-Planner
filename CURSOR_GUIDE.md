# 🚀 CURSOR IMPLEMENTATION GUIDE
## How to Build Phase 2 Features Step-by-Step

---

## 🎯 **FEATURE 1: SCENARIOS PAGE (30 minutes)**

### What to Ask Cursor:

**Prompt 1: Create Scenarios List Page**
```
Create src/pages/Scenarios.tsx that displays the 3 pre-built scenarios from staticData.ts in a grid layout. Each card should show the scenario title, description, target audience, and estimated duration. Use the same dark theme (slate-950 bg, cyan-500 accents) as the rest of the app. Add a "View Details" button that navigates to /scenarios/:id. Make it mobile responsive.
```

**Prompt 2: Test It**
```
I've created the Scenarios page. Please verify:
1. It imports PRE_BUILT_SCENARIOS correctly from staticData.ts
2. The routing works when I click "View Details"
3. The styling matches the rest of the app
```

### Expected Result:
- Grid of 3 scenario cards
- Click card → Navigate to detail page
- Matches your dark theme

---

## 🎯 **FEATURE 2: SCENARIO DETAIL PAGE (45 minutes)**

### What to Ask Cursor:

**Prompt 1: Create Detail Page**
```
Create src/pages/ScenarioDetail.tsx that:
1. Reads the scenario ID from URL params (useParams)
2. Fetches the matching scenario from PRE_BUILT_SCENARIOS in staticData.ts
3. Displays a 3-phase timeline (Foundation → Growth → Scale) with visual progress indicators
4. Shows task checklists for each phase with checkboxes (visual only, don't need to save state)
5. Lists deliverables for each phase
6. Shows total estimated duration
7. Has a "Start This Journey" CTA button (can just navigate back to home for now)
8. Use Tailwind dark theme and cyan accents
9. Make it mobile responsive
```

**Prompt 2: Add Navigation**
```
Add a breadcrumb navigation at the top: Home > Scenarios > [Scenario Name]
And add a "Back to Scenarios" link at the bottom.
```

**Prompt 3: Polish**
```
Can you add some nice visual touches:
- Phase cards should have a subtle gradient
- Use lucide-react icons for each phase (Rocket, TrendingUp, Award)
- Add hover effects on interactive elements
```

### Expected Result:
- Full scenario breakdown with phases
- Task checklists visible
- Professional timeline visualization

---

## 🎯 **FEATURE 3: TECH STACK AUDIT PAGE (1 hour)**

### What to Ask Cursor:

**Prompt 1: Create Form Structure**
```
Create src/pages/TechStackAudit.tsx with a form that:
1. Has 6 tool categories: CRM, Marketing Automation Platform, Analytics, Content Management, Social Media Tools, Sales Enablement
2. Each category can have multiple tools added
3. Each tool has:
   - Text input for tool name
   - Slider (1-10) for utilization rating
   - Delete button
4. "Add Tool" button for each category
5. Shows real-time average utilization score at the top
6. "Submit Tech Stack" button at the bottom
7. Use dark theme with cyan accents
```

**Prompt 2: Connect to UserContext**
```
Now connect this form to UserContext:
1. Import useUser hook
2. On submit, format the data as TechStackItem[] and call setTechStack()
3. After submission, navigate to /results
4. The user should see their score increase on the Results page because tech stack adds 30% weight to combined score
```

**Prompt 3: Add Validation**
```
Add form validation:
- At least 3 tools must be added before submission
- Tool names can't be empty
- Show error messages in red if validation fails
- Disable submit button until valid
```

**Prompt 4: Polish**
```
Add some UX improvements:
- Collapsible sections for each category
- Tooltip explaining what "utilization" means (1 = barely using, 10 = fully optimized)
- Show category average scores
- Add smooth animations when adding/removing tools
```

### Expected Result:
- Full tech stack inventory form
- Integrates with UserContext
- Boosts user's combined score
- Redirects to Results with updated score

---

## 🎯 **FEATURE 4: OPERATIONS CENTER (45 minutes)**

### What to Ask Cursor:

**Prompt 1: Create Dashboard Layout**
```
Create src/pages/OperationsCenter.tsx with a 4-section dashboard:

Section 1: Current Status Widget (top-left)
- Show plane level with icon and color
- Display current score as a gauge
- Show flight miles earned
- Read all data from UserContext

Section 2: Quick Stats (top-right)
- Total routes unlocked
- Assessment completion date
- Days since last update
- Tech stack maturity score

Section 3: Unlocked Routes (bottom-left)
- List of all unlocked routes
- Show from → to cities
- Green checkmarks for each

Section 4: Quick Actions (bottom-right)
- Button: "Retake Assessment" → /assessment/quick
- Button: "View Journey Map" → /journey-map
- Button: "Optimize Tech Stack" → /tech-stack
- Button: "Explore Scenarios" → /scenarios

Use grid layout, dark theme, cyan accents, mobile responsive.
```

**Prompt 2: Add Conditional Rendering**
```
Add logic to handle users who haven't completed assessment yet:
- If no assessment data, show a "Get Started" prompt instead
- Center it on the page
- Show "Take Your First Assessment" CTA button
```

**Prompt 3: Add Visualizations**
```
Replace the plain score display with a mini version of the Altimeter from Results.tsx
Import the RadialBarChart from recharts and show the score visually.
```

### Expected Result:
- Comprehensive dashboard overview
- Shows all key metrics at a glance
- Quick access to all features
- Works even if user hasn't taken assessment

---

## 🎯 **FEATURE 5: WHAT-IF SIMULATOR (1.5 hours)**

### What to Ask Cursor:

**Prompt 1: Create Simulator Structure**
```
Create src/pages/Simulator.tsx with:
1. Three sliders:
   - Budget: $10K to $1M (log scale)
   - Team Size: 1 to 50 people
   - Tool Count: 0 to 20 tools
2. Real-time score projection that updates as sliders move
3. Use this formula for projection:
   projectedScore = baseScore + (budget/50000 * 5) + (teamSize * 2) + (toolCount * 3)
   cap at 100
4. Read user's current score from UserContext
5. Show side-by-side comparison: Current vs Projected
6. Dark theme, cyan accents
```

**Prompt 2: Add Route Unlocking Preview**
```
Add a "Routes You'd Unlock" section below the sliders:
1. Check which routes would unlock at the projected score
2. Import ROUTES and route requirements from UserContext
3. Show locked routes that WOULD unlock in yellow
4. Show routes that remain locked in gray
5. Add checkmarks for routes already unlocked
```

**Prompt 3: Add Insights Panel**
```
Add an "Insights" panel that shows:
- How many more points needed to unlock next route
- Which investment (budget/team/tools) has highest ROI
- Suggested next steps based on projections
- Use if/else logic to generate personalized recommendations
```

**Prompt 4: Add Interactivity**
```
Add these features:
1. "Reset to Current" button to reset sliders to user's actual state
2. "See Full Impact" button that saves the projection and navigates to /results
3. Smooth animations when score changes
4. Visual indicator when a new route unlocks
```

### Expected Result:
- Interactive "what-if" calculator
- Real-time route unlocking preview
- Personalized insights
- Helps user understand growth path

---

## 🎯 **FEATURE 6: JOURNEY MAP (2-3 hours - MOST COMPLEX)**

### What to Ask Cursor:

**Prompt 1: Choose Map Library**
```
I need to create an interactive world map for my Journey Map page. Should I use:
1. Mapbox GL JS (requires API key, very powerful)
2. React Simple Maps (free, simpler)
3. Custom SVG approach

Consider that I need to:
- Plot 13 cities with lat/lng coordinates
- Draw arcing lines between cities for routes
- Color routes based on user's unlock status
- Make it interactive (click, hover)
- Dark theme

Which library would you recommend and why?
```

**Prompt 2: Set Up Map (assuming React Simple Maps)**
```
Create src/pages/JourneyMap.tsx using react-simple-maps:
1. Install it: npm install react-simple-maps
2. Create a dark-themed world map
3. Plot the 13 cities from CITIES in staticData.ts as glowing cyan dots
4. Show city name on hover
5. Make the map fill the viewport
6. Add zoom controls
```

**Prompt 3: Add Routes**
```
Now add the routes between cities:
1. Import ROUTES from staticData.ts
2. For each route, draw a curved line from origin city to destination city
3. Use UserContext's getRouteStatus(routeId) to determine color:
   - Green (#10b981) if unlocked
   - Yellow (#eab308) if partial
   - Gray (#475569) if locked
4. Add a glow effect to unlocked routes
5. Make routes clickable
```

**Prompt 4: Add Route Modal**
```
Create a modal that appears when clicking a route:
1. Show route name and description
2. Display waypoints as a checklist
3. Show requirements (score + miles needed)
4. If locked, show "Improve your score to unlock"
5. If unlocked, show "Start Journey" button
6. Close button and click-outside-to-close
```

**Prompt 5: Add Legend**
```
Add a legend in the bottom-left corner showing:
- Green circle = "Unlocked Routes"
- Yellow circle = "Partially Available"  
- Gray circle = "Locked Routes"
- Cyan dot = "Marketing Function"
Make it semi-transparent with dark background
```

**Prompt 6: Optimize Performance**
```
The map feels slow with all 13 cities and 7 routes. Can you:
1. Memoize the city and route components
2. Add loading state while map initializes
3. Lazy load the map component
4. Reduce re-renders when user data changes
```

### Expected Result:
- Interactive world map
- All 13 cities plotted
- 7 routes drawn with correct colors
- Click route → Modal with details
- Smooth performance
- Responsive design

---

## 🔍 **DEBUGGING WITH CURSOR**

### Common Issues & How to Ask Cursor for Help:

**Issue: "Component won't render"**
```
My [ComponentName] isn't rendering. Here's the error: [paste error]. 
Can you check:
1. Are imports correct?
2. Is the component exported properly?
3. Is it added to the router in App.tsx?
```

**Issue: "UserContext data not showing"**
```
I'm using useUser() hook but the data isn't showing up. Here's my code:
[paste component code]
Can you verify I'm accessing the context correctly?
```

**Issue: "Styling looks wrong"**
```
The styling doesn't match the rest of my app. Can you update [ComponentName] to use:
- Background: slate-950
- Primary color: cyan-500
- Text: white/slate-300
And make it match Home.tsx style?
```

**Issue: "Data not persisting"**
```
After I refresh the page, my data disappears. I thought UserContext handles localStorage automatically. Can you check if I need to add anything?
```

---

## 📊 **TRACKING YOUR PROGRESS**

### Create a checklist file:

Ask Cursor:
```
Create a PROGRESS.md file with checkboxes for all Phase 2 features:
- [ ] Scenarios page
- [ ] Scenario detail page
- [ ] Tech Stack Audit
- [ ] Operations Center
- [ ] What-If Simulator
- [ ] Journey Map

Update it as I complete each feature.
```

---

## 🎨 **DESIGN CONSISTENCY TIPS**

### Always remind Cursor:

```
Make sure this component:
1. Uses dark theme (slate-950 background)
2. Uses cyan-500 for primary actions
3. Has hover states on interactive elements
4. Is mobile responsive (works on 375px width)
5. Uses lucide-react icons consistently
6. Has smooth transitions (transition-all duration-300)
7. Matches the visual style of Home.tsx and Results.tsx
```

---

## 🚨 **WHEN YOU GET STUCK**

### Ask Cursor to explain:

```
Can you explain how [feature] works in this codebase?
Walk me through the data flow from user interaction to state update to UI render.
```

### Ask Cursor to debug:

```
I'm getting this error: [paste error]
Here's the component: [paste code]
Can you identify the issue and fix it?
```

### Ask Cursor to refactor:

```
This component is getting too large (300+ lines). Can you:
1. Extract reusable parts into separate components
2. Keep the logic in the main component
3. Make sure everything still works
```

---

## ✅ **FINAL TESTING CHECKLIST**

Before considering Phase 2 complete, test:

### User Flow Testing
```
Ask Cursor:
"Create a testing script that walks through:
1. New user takes assessment
2. Sees their results  
3. Views journey map
4. Explores a scenario
5. Adds tech stack
6. Checks operations center
7. Uses simulator
Verify data persists after each step."
```

### Mobile Testing
```
Ask Cursor:
"Check all Phase 2 pages for mobile responsiveness.
Test on:
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)
Fix any layout issues."
```

### Performance Testing
```
Ask Cursor:
"Profile the app and identify any performance bottlenecks.
Check for:
- Unnecessary re-renders
- Large bundle sizes
- Slow map rendering
- Memory leaks
Suggest optimizations."
```

---

## 🎓 **ADVANCED CURSOR TIPS**

### 1. Use Cursor's Composer for Multi-File Changes
When you need to update multiple files at once:
```
"I need to add a new route unlocking animation that affects:
- UserContext.tsx (add animation state)
- Results.tsx (show animation)
- JourneyMap.tsx (trigger on map)
Can you make these changes across all files?"
```

### 2. Use Cursor's Chat to Learn
```
"Explain how the scoring system works in UserContext.tsx.
Then show me how to add a new calculation for 'Marketing Velocity'."
```

### 3. Use Cursor to Generate Tests
```
"Create unit tests for:
1. calculateCombinedScore function
2. getRouteStatus function  
3. calculateFlightMiles function
Use Jest and React Testing Library."
```

### 4. Use Cursor for Documentation
```
"Generate JSDoc comments for all functions in UserContext.tsx"
```

---

## 🎉 **YOU'RE READY!**

Your project is fully set up. Just:
1. Download the complete project
2. Open in Cursor
3. Install dependencies
4. Start with Feature 1 (Scenarios page)
5. Work through the features in order
6. Use the prompts above as templates

**Cursor will understand your entire codebase because of the .cursorrules file!**

Good luck! 🚀
