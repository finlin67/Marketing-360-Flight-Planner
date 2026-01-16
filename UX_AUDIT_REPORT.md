# UX Audit Report - Flight Planner Application

## Executive Summary

This audit identifies friction points across user journeys, form flows, navigation patterns, and state management. Issues are categorized by severity and impact on user experience, with concrete implementation recommendations tied to existing components.

---

## 🔴 CRITICAL FRICTION POINTS

### 1. **Assessment Flow - Unclear Progress & Completion States**

**Problem:**
- Users can't see which questions they've answered vs. skipped
- No visual distinction between "answered" and "not answered" in Deep Dive category cards
- Auto-advance after answer (300ms delay) is disorienting
- No "Save & Continue Later" option for Deep Dive (25 questions)
- Resume modal logic is complex and may not trigger reliably

**Impact:** Users abandon long assessments, lose progress, feel lost

**Current Implementation:**
```typescript
// Assessment.tsx - Auto-advance is jarring
setTimeout(() => {
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(prev => prev + 1);
  }
}, 300);
```

**Recommendations:**
1. **Add Question Status Indicators**
   - Show checkmark (✓) for answered, circle (○) for skipped, dash (-) for not started
   - Add progress dots below question card: `●●●○○○○○○○` (answered = filled, skipped = outline)
   - In Deep Dive: Show completion badge on category cards: "3/5 answered"

2. **Remove Auto-Advance, Add Explicit Navigation**
   ```typescript
   // Replace auto-advance with manual "Next" button
   <button onClick={() => handleAnswer(value)}>Select Answer</button>
   <button onClick={handleNext} disabled={!responses[currentQuestionData.id]}>
     Next Question →
   </button>
   ```

3. **Add Save Progress Banner**
   ```typescript
   {Object.keys(responses).length > 0 && (
     <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-lg z-40">
       <div className="flex items-center gap-2 text-sm">
         <CheckCircle2 className="w-4 h-4 text-cyan-400" />
         <span className="text-cyan-300">Progress saved automatically</span>
         <span className="text-cyan-400/60">({Object.keys(responses).length}/{questions.length})</span>
       </div>
     </div>
   )}
   ```

4. **Improve Resume Modal UX**
   - Show preview of saved answers
   - Add "Start Fresh" option
   - Show timestamp: "Resume from 2 hours ago"

---

### 2. **Results Page - Missing Context & Next Steps**

**Problem:**
- No clear "What do I do next?" guidance
- Floating Action Button (FAB) is discoverable but not obvious
- "Coming Soon" section at bottom is confusing (features already exist)
- No indication that Tech Stack audit will boost score
- REAO metrics lack explanation tooltips

**Impact:** Users see results but don't know how to improve or what actions to take

**Current Implementation:**
```typescript
// Results.tsx - FAB is hidden until user scrolls
<div className="fixed bottom-8 right-8 z-40">
  <button onClick={() => setShowQuickActions(!showQuickActions)}>
    <Sparkles className="w-6 h-6 animate-pulse" />
  </button>
</div>
```

**Recommendations:**
1. **Add "Next Steps" Section After Score Reveal**
   ```typescript
   {showContent && (
     <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-8">
       <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <ArrowRight className="w-5 h-5 text-cyan-400" />
         Your Next Steps
       </h3>
       <div className="grid md:grid-cols-3 gap-4">
         {!hasCompletedTechStack && (
           <div className="bg-slate-800 p-4 rounded-lg border border-purple-500/30">
             <div className="flex items-center gap-2 mb-2">
               <Database className="w-5 h-5 text-purple-400" />
               <span className="font-semibold text-white">Add Tech Stack</span>
               <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">+30%</span>
             </div>
             <p className="text-sm text-slate-400 mb-3">Boost your score by adding your tools</p>
             <button onClick={() => navigate('/tech-stack')} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded text-sm font-semibold">
               Get Started →
             </button>
           </div>
         )}
         {/* Similar cards for Deep Dive and Simulator */}
       </div>
     </div>
   )}
   ```

2. **Remove "Coming Soon" Section** (features exist)
   - Replace with "Explore More Features" linking to actual pages

3. **Add REAO Tooltips**
   ```typescript
   <Tooltip content="Readiness measures your strategic planning and team capabilities">
     <div className="flex items-center gap-2">
       <span>Readiness</span>
       <Info className="w-4 h-4 text-slate-400" />
     </div>
   </Tooltip>
   ```

---

### 3. **Navigation - Inconsistent Entry Points & Hidden Features**

**Problem:**
- "Your Results" dropdown is discoverable but not obvious
- Tech Stack, Deep Dive, Simulator are buried in dropdown
- No breadcrumb context on some pages
- Mobile navigation hides important features
- Journey Map has no clear entry point from Results

**Impact:** Users miss key features, get lost, can't find what they need

**Current Implementation:**
```typescript
// Layout.tsx - Dropdown is one of many nav items
<div className="relative enhance-menu-container" ref={enhanceMenuRef}>
  <button onClick={() => setShowEnhanceMenu(!showEnhanceMenu)}>
    Your Results ▼
  </button>
</div>
```

**Recommendations:**
1. **Add Prominent "Enhance Results" Section on Results Page**
   - Place above recommended scenarios
   - Use card grid with icons and benefit statements
   - Make it the first thing users see after score

2. **Improve Mobile Navigation**
   - Add "Quick Actions" section in mobile menu
   - Show completion badges in mobile menu
   - Add sticky bottom bar on mobile with primary actions

3. **Add Contextual Navigation Hints**
   ```typescript
   // On Results page, add floating hint
   {!hasCompletedTechStack && (
     <div className="fixed bottom-24 right-8 bg-yellow-500/90 text-yellow-950 px-4 py-2 rounded-lg shadow-xl z-30 animate-bounce">
       <div className="flex items-center gap-2 text-sm font-semibold">
         <Sparkles className="w-4 h-4" />
         Boost your score by 30%!
       </div>
     </div>
   )}
   ```

---

## 🟡 MODERATE FRICTION POINTS

### 4. **Deep Dive Assessment - Category Navigation Confusion**

**Problem:**
- Users don't understand they can click category cards to answer questions
- No visual feedback when category is expanded
- Section tabs don't show which questions are in each section
- "Answer this question →" link in expanded card is not obvious

**Impact:** Users struggle to navigate 25 questions, get overwhelmed

**Recommendations:**
1. **Add Visual Affordances**
   ```typescript
   // Make category cards more obviously clickable
   <div
     className={`
       p-6 rounded-lg border-2 cursor-pointer
       transition-all hover:scale-[1.02] hover:shadow-lg
       ${isExpanded ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/50' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}
     `}
     onClick={() => toggleCategoryCard(category.id)}
   >
     <div className="flex items-center justify-between">
       <h3>{category.name}</h3>
       <div className="flex items-center gap-2">
         {isAnswered && <Check className="w-5 h-5 text-emerald-400" />}
         <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
       </div>
     </div>
   </div>
   ```

2. **Add Section Overview**
   - Show question count per section in tab: "Foundation (5 questions)"
   - Add mini progress bar in each tab

3. **Improve Question Navigation in Expanded Cards**
   - Make question items more button-like
   - Add "Answer Now" button instead of just link text
   - Show current question with pulsing animation

---

### 5. **Tech Stack Audit - Unclear Value Proposition**

**Problem:**
- Users don't understand why they should add tools
- No preview of score impact before adding tools
- Tool selection feels optional/overwhelming
- No guidance on what "utilization" means

**Impact:** Low completion rate, users skip valuable feature

**Recommendations:**
1. **Add Score Preview**
   ```typescript
   // Show projected score as user adds tools
   const projectedScore = useMemo(() => {
     if (selectedTools.length === 0) return combinedScore;
     const techAvg = selectedTools.reduce((sum, t) => sum + t.utilization, 0) / selectedTools.length;
     return Math.round((combinedScore * 0.7) + (techAvg * 0.3));
   }, [selectedTools, combinedScore]);

   <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg mb-6">
     <div className="flex items-center justify-between">
       <span className="text-slate-300">Current Score:</span>
       <span className="text-2xl font-bold text-white">{combinedScore}</span>
     </div>
     <div className="flex items-center justify-between mt-2">
       <span className="text-purple-300">Projected Score:</span>
       <span className="text-2xl font-bold text-purple-400">{projectedScore}</span>
     </div>
     <div className="text-xs text-slate-400 mt-2">
       +{projectedScore - combinedScore} points from tech stack
     </div>
   </div>
   ```

2. **Add Utilization Help Text**
   ```typescript
   <div className="flex items-center gap-2 mb-2">
     <label>Utilization (1-10)</label>
     <Info className="w-4 h-4 text-slate-400" />
     <Tooltip>
       How well are you using this tool? 1 = Just installed, 10 = Fully optimized
     </Tooltip>
   </div>
   ```

3. **Add Quick Add Presets**
   - "Common Stack" button that adds Salesforce, HubSpot, Google Analytics
   - "Startup Stack" vs "Enterprise Stack" presets

---

### 6. **Journey Map - Missing Onboarding & Affordances**

**Problem:**
- No explanation of what cities/routes mean on first visit
- Hover interactions aren't discoverable
- Route status colors aren't explained
- Control panel at bottom is hidden on mobile
- No legend or help overlay by default

**Impact:** Users don't understand the map, miss interactions, get frustrated

**Recommendations:**
1. **Add First-Visit Overlay**
   ```typescript
   const [showMapIntro, setShowMapIntro] = useState(() => {
     return !localStorage.getItem('hasSeenMapIntro');
   });

   {showMapIntro && (
     <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
       <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl border border-cyan-500/30">
         <h2 className="text-2xl font-bold text-white mb-4">Welcome to Your Journey Map</h2>
         <div className="space-y-4 text-slate-300 mb-6">
           <p>• <strong className="text-cyan-400">Cities</strong> = Marketing capabilities</p>
           <p>• <strong className="text-purple-400">Routes</strong> = Growth paths between capabilities</p>
           <p>• <strong className="text-green-400">Green routes</strong> = Unlocked and available</p>
           <p>• <strong className="text-yellow-400">Yellow routes</strong> = Partially available</p>
           <p>• <strong className="text-slate-500">Gray routes</strong> = Locked (need higher score)</p>
         </div>
         <button
           onClick={() => {
             setShowMapIntro(false);
             localStorage.setItem('hasSeenMapIntro', 'true');
           }}
           className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-lg font-semibold"
         >
           Got It - Explore Map
         </button>
       </div>
     </div>
   )}
   ```

2. **Add Persistent Legend**
   - Small legend in bottom-left corner (always visible)
   - Toggleable on mobile

3. **Improve Hover Feedback**
   - Add subtle animation to cities on page load
   - Show "Hover for details" hint on first city

---

### 7. **Scenarios Page - Filter Overload & Empty States**

**Problem:**
- Too many filters at once (Industry, Size, Difficulty, Search)
- No "Clear Filters" button
- Empty state message is generic
- No indication of how many scenarios match
- Filter state persists but users forget what's filtered

**Impact:** Users can't find scenarios, get frustrated with filters

**Recommendations:**
1. **Add Active Filter Pills**
   ```typescript
   <div className="flex flex-wrap gap-2 mb-4">
     {selectedIndustry !== 'All' && (
       <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
         Industry: {selectedIndustry}
         <button onClick={() => setSelectedIndustry('All')}>
           <X className="w-3 h-3" />
         </button>
       </div>
     )}
     {/* Similar for other filters */}
     {(selectedIndustry !== 'All' || selectedCompanySize !== 'All' || selectedDifficulty !== 'All') && (
       <button
         onClick={() => {
           setSelectedIndustry('All');
           setSelectedCompanySize('All');
           setSelectedDifficulty('All');
         }}
         className="px-3 py-1 text-slate-400 hover:text-white text-sm"
       >
         Clear All
       </button>
     )}
   </div>
   ```

2. **Improve Empty State**
   ```typescript
   {filteredScenarios.length === 0 && (
     <div className="text-center py-16">
       <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
       <h3 className="text-xl font-bold text-white mb-2">No scenarios match your filters</h3>
       <p className="text-slate-400 mb-4">
         Try adjusting your search or filters. {SCENARIOS.length} total scenarios available.
       </p>
       <button
         onClick={() => {
           setSelectedIndustry('All');
           setSelectedCompanySize('All');
           setSelectedDifficulty('All');
           setSearchQuery('');
         }}
         className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg"
       >
         Show All Scenarios
       </button>
     </div>
   )}
   ```

3. **Add Filter Summary**
   - Show "Showing X of Y scenarios" with active filter count
   - Add "Reset to defaults" link

---

## 🟢 MINOR FRICTION POINTS

### 8. **Loading States - Inconsistent & Generic**

**Problem:**
- All loading states use same spinner
- No skeleton screens for content
- Loading messages are generic ("Loading...")
- No progress indication for long operations

**Recommendations:**
1. **Add Skeleton Screens**
   ```typescript
   // For Results page
   {isLoading && (
     <div className="space-y-6">
       <div className="h-32 bg-slate-800 rounded-lg animate-pulse" />
       <div className="grid grid-cols-3 gap-4">
         {[1,2,3].map(i => (
           <div key={i} className="h-24 bg-slate-800 rounded-lg animate-pulse" />
         ))}
       </div>
     </div>
   )}
   ```

2. **Contextual Loading Messages**
   - "Calculating your marketing maturity..." (Results)
   - "Loading your journey map..." (Journey Map)
   - "Saving your progress..." (Assessment)

---

### 9. **Error States - Missing Recovery Actions**

**Problem:**
- Errors show but no "Try Again" button
- Error messages are technical
- No fallback when localStorage fails
- Network errors not handled

**Recommendations:**
1. **Add Error Recovery UI**
   ```typescript
   {error && (
     <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-6">
       <div className="flex items-start gap-3">
         <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
         <div className="flex-1">
           <h3 className="font-bold text-red-400 mb-2">Something went wrong</h3>
           <p className="text-slate-300 mb-4">{error}</p>
           <div className="flex gap-3">
             <button
               onClick={() => window.location.reload()}
               className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
             >
               Reload Page
             </button>
             <button
               onClick={() => navigate('/')}
               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
             >
               Go Home
             </button>
           </div>
         </div>
       </div>
     </div>
   )}
   ```

---

### 10. **Copy & Messaging - Inconsistent Tone**

**Problem:**
- Mix of formal and casual language
- Technical jargon ("REAO", "utilization score")
- CTAs vary: "Start Assessment" vs "Take Quick Scan" vs "Begin"
- No clear value propositions

**Recommendations:**
1. **Standardize CTA Language**
   - Primary: "Start Quick Scan" (consistent)
   - Secondary: "Learn More" or "View Guide"
   - Action: "Save & Continue" or "Complete Assessment"

2. **Add Tooltips for Jargon**
   - REAO → "Readiness, Efficiency, Alignment, Opportunity"
   - Utilization → "How well you're using this tool (1-10 scale)"

3. **Improve Value Props**
   - "Get your marketing maturity score in 5 minutes" (not "Assess your capabilities")
   - "See which growth paths are unlocked" (not "View available routes")

---

## 📊 USER JOURNEY FRAGMENTATION

### Journey 1: First-Time User → Assessment → Results

**Current Flow:**
1. Home → Clicks "Start Quick Scan"
2. Assessment (10 questions)
3. Results page
4. ❓ What next?

**Issues:**
- No profile collection before assessment (context missing)
- Results page doesn't guide next steps clearly
- No clear path to Tech Stack or Deep Dive

**Recommendations:**
1. **Add Optional Profile Step Before Assessment**
   ```typescript
   // Show modal before assessment starts
   {showProfilePrompt && (
     <Modal>
       <h2>Quick Profile (Optional)</h2>
       <p>Help us personalize your results</p>
       <Form>
         <input name="industry" />
         <input name="companySize" />
       </Form>
       <button onClick={() => setShowProfilePrompt(false)}>
         Skip for Now
       </button>
       <button onClick={handleSaveProfile}>
         Save & Continue
       </button>
     </Modal>
   )}
   ```

2. **Add Results Page Onboarding**
   - Show "What's Next?" section immediately after score reveal
   - Highlight top 2-3 actions based on score

---

### Journey 2: Returning User → Enhance Results

**Current Flow:**
1. User has completed assessment
2. Wants to add Tech Stack
3. ❓ Where is it? (Buried in dropdown)

**Issues:**
- No clear path from Results to enhancement features
- No indication of what's been completed
- No progress tracking across features

**Recommendations:**
1. **Add Progress Tracker Component**
   ```typescript
   // Show on Results page
   <div className="bg-slate-800 rounded-lg p-4 mb-6">
     <h3 className="text-sm font-semibold text-slate-400 mb-3">Your Progress</h3>
     <div className="space-y-2">
       <ProgressItem
         label="Quick Scan"
         completed={hasCompletedAssessment}
         icon={<CheckCircle2 />}
       />
       <ProgressItem
         label="Tech Stack Audit"
         completed={hasCompletedTechStack}
         icon={<Database />}
         action={() => navigate('/tech-stack')}
       />
       <ProgressItem
         label="Deep Dive Assessment"
         completed={hasCompletedDeepDive}
         icon={<Layers />}
         action={() => navigate('/assessment/deep')}
       />
     </div>
   </div>
   ```

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1 (High Impact, Quick Wins)
1. ✅ Add question status indicators in Assessment
2. ✅ Add "Next Steps" section on Results page
3. ✅ Remove auto-advance, add explicit navigation
4. ✅ Add "Clear Filters" to Scenarios page
5. ✅ Improve empty states with actionable CTAs

### Phase 2 (Medium Impact, Moderate Effort)
1. ✅ Add score preview in Tech Stack Audit
2. ✅ Add first-visit overlay for Journey Map
3. ✅ Add progress tracker component
4. ✅ Standardize CTA language
5. ✅ Add tooltips for jargon terms

### Phase 3 (Polish & Refinement)
1. ✅ Add skeleton loading screens
2. ✅ Improve error recovery UI
3. ✅ Add contextual help throughout
4. ✅ Mobile navigation improvements
5. ✅ Add onboarding tours

---

## 🔧 COMPONENT IMPROVEMENTS

### Create Reusable Components

1. **EmptyState Component**
   ```typescript
   // src/components/EmptyState.tsx
   interface EmptyStateProps {
     icon: ReactNode;
     title: string;
     description: string;
     action?: { label: string; onClick: () => void };
   }
   ```

2. **ProgressTracker Component**
   ```typescript
   // src/components/ProgressTracker.tsx
   interface ProgressItem {
     id: string;
     label: string;
     completed: boolean;
     action?: () => void;
   }
   ```

3. **StatusBadge Component**
   ```typescript
   // src/components/StatusBadge.tsx
   // Standardized badges for: answered, skipped, locked, unlocked, etc.
   ```

4. **LoadingSkeleton Component**
   ```typescript
   // src/components/LoadingSkeleton.tsx
   // Reusable skeleton screens for cards, lists, etc.
   ```

---

## 📝 COPY IMPROVEMENTS

### Standardize Language

**Before → After:**
- "Take Assessment" → "Start Quick Scan" (consistent)
- "View Results" → "See Your Results"
- "Tech Stack Audit" → "Add Your Tools (+30% score)"
- "Deep Dive Assessment" → "Complete Deep Dive (More Accurate)"
- "What-If Simulator" → "Project Your Score"

### Add Contextual Help Text

- REAO metrics: "These four dimensions measure different aspects of your marketing maturity"
- Flight Miles: "Earned by completing assessments and adding tools. Unlock routes by reaching milestones."
- Plane Level: "Your overall marketing maturity. Higher levels unlock more advanced capabilities."

---

## 🎨 VISUAL AFFORDANCE IMPROVEMENTS

### 1. Make Interactive Elements Obvious
- Add hover states to all clickable elements
- Use consistent button styles (primary, secondary, ghost)
- Add focus rings for keyboard navigation
- Use icons consistently (ArrowRight for forward, ArrowLeft for back)

### 2. Improve Visual Hierarchy
- Use consistent heading sizes (h1: 3xl, h2: 2xl, h3: xl)
- Standardize spacing (p-4 for cards, p-6 for sections, p-8 for pages)
- Use consistent border radius (rounded-lg for cards, rounded-xl for modals)

### 3. Add Micro-Interactions
- Button press animations (scale-95 on active)
- Card hover effects (scale-105, shadow-lg)
- Progress bar animations (smooth transitions)
- Success state animations (checkmark bounce)

---

## 📱 MOBILE-SPECIFIC ISSUES

### Problems:
1. Navigation menu hides important features
2. Journey Map controls are hard to access
3. Deep Dive tabs overflow on small screens
4. Forms are cramped
5. Touch targets too small in some places

### Recommendations:
1. **Sticky Bottom Navigation Bar**
   ```typescript
   <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 md:hidden">
     <div className="flex justify-around py-2">
       <NavButton icon={<Home />} label="Home" path="/" />
       <NavButton icon={<ClipboardCheck />} label="Assess" path="/assessment" />
       <NavButton icon={<BarChart3 />} label="Results" path="/results" />
       <NavButton icon={<Map />} label="Map" path="/journey-map" />
     </div>
   </div>
   ```

2. **Improve Mobile Forms**
   - Larger input fields (min-height: 48px)
   - Full-width buttons
   - Stack filters vertically
   - Add "Done" button to close mobile keyboard

---

## 🔄 STATE MANAGEMENT ISSUES

### Problems:
1. Loading states not coordinated across components
2. Error states don't persist across navigation
3. Form validation happens too late
4. No optimistic UI updates

### Recommendations:
1. **Add Global Loading State**
   ```typescript
   // In UserContext
   const [isLoading, setIsLoading] = useState(false);
   const [globalError, setGlobalError] = useState<string | null>(null);
   ```

2. **Add Form Validation on Blur**
   ```typescript
   const [errors, setErrors] = useState<Record<string, string>>({});
   
   const validateField = (name: string, value: string) => {
     // Validate and set error
   };
   
   <input
     onBlur={(e) => validateField('industry', e.target.value)}
     className={errors.industry ? 'border-red-500' : ''}
   />
   ```

---

## 🎯 METRICS TO TRACK

To measure improvement impact:

1. **Assessment Completion Rate**
   - Current: Track abandonment at each question
   - Goal: Increase completion by 20%

2. **Feature Discovery**
   - Track clicks on "Your Results" dropdown
   - Track Tech Stack audit starts from Results page
   - Goal: 40% of users discover enhancement features

3. **Time to Value**
   - Measure: Home → Assessment → Results → Action
   - Goal: Reduce by 30%

4. **Error Recovery**
   - Track error occurrences
   - Track "Try Again" clicks
   - Goal: 80% recovery rate

---

## 🚀 QUICK WINS (Can Implement Today)

1. **Add Question Status Dots** (30 min)
   - Simple visual indicator below question card
   - Shows answered/skipped/not started

2. **Remove Auto-Advance** (15 min)
   - Replace with explicit "Next" button
   - Better user control

3. **Add "Clear Filters" Button** (10 min)
   - One-line addition to Scenarios page

4. **Improve Empty States** (20 min)
   - Add icons and actionable CTAs
   - More helpful messaging

5. **Standardize CTA Text** (15 min)
   - Find/replace across all pages
   - Consistent language

---

## 📋 IMPLEMENTATION CHECKLIST

### Assessment Flow
- [ ] Add question status indicators
- [ ] Remove auto-advance
- [ ] Add progress save banner
- [ ] Improve resume modal
- [ ] Add section overview in Deep Dive

### Results Page
- [ ] Add "Next Steps" section
- [ ] Remove "Coming Soon" section
- [ ] Add REAO tooltips
- [ ] Improve FAB discoverability
- [ ] Add progress tracker

### Navigation
- [ ] Add "Enhance Results" section on Results
- [ ] Improve mobile navigation
- [ ] Add contextual hints
- [ ] Standardize breadcrumbs

### Forms & Inputs
- [ ] Add validation on blur
- [ ] Improve error messages
- [ ] Add help text for inputs
- [ ] Add loading states

### Empty/Loading/Error States
- [ ] Create EmptyState component
- [ ] Create LoadingSkeleton component
- [ ] Add error recovery UI
- [ ] Contextual loading messages

### Copy & Messaging
- [ ] Standardize CTA language
- [ ] Add tooltips for jargon
- [ ] Improve value propositions
- [ ] Add contextual help text

---

This audit provides a roadmap for improving user experience across all major flows. Prioritize Phase 1 items for immediate impact, then iterate based on user feedback.

