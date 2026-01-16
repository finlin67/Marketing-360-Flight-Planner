# Quick Start Guide - Get Running in 5 Minutes

## 🚀 Setup Instructions

### Step 1: Copy Files to Your Project

Copy these files into your existing React project:

```
Your Project/
├── src/
│   ├── App.tsx                    ← Replace
│   ├── context/
│   │   └── UserContext.tsx        ← New
│   ├── data/
│   │   └── staticData.ts          ← New
│   ├── pages/
│   │   ├── Home.tsx               ← Replace
│   │   ├── Assessment.tsx         ← New
│   │   ├── Results.tsx            ← New
│   │   └── PlaceholderPages.tsx   ← New
│   └── components/
│       └── Layout.tsx             ← Replace
└── package.json                   ← Merge dependencies
```

### Step 2: Install Dependencies

```bash
npm install react-router-dom lucide-react recharts
```

Or if using yarn:
```bash
yarn add react-router-dom lucide-react recharts
```

### Step 3: Run Dev Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`

---

## 🧪 Test the Flow

### Test 1: Quick Scan Path
1. Go to home page
2. Fill in profile (any values)
3. Click "Start Quick Scan"
4. Answer all 10 questions
5. Click "Calculate My Results"
6. ✅ Should see Results page with score

### Test 2: State Persistence
1. Complete an assessment
2. Refresh the page (F5)
3. ✅ Score should still show in navigation
4. ✅ Navigate to Results, data still there

### Test 3: Manual Booking
1. Go to home page
2. Select "From: Content Marketing"
3. Select "To: ABM"
4. Click "View Flight Path"
5. ✅ Should navigate (to placeholder for now)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'react-router-dom'"
**Fix:** Run `npm install react-router-dom`

### Issue: "useUser must be used within UserProvider"
**Fix:** Make sure App.tsx has `<UserProvider>` wrapper (it should already)

### Issue: Nothing shows up
**Fix:** Check console for errors, make sure all imports are correct

### Issue: Styles look wrong
**Fix:** Make sure Tailwind CSS is configured in your project

### Issue: Assessment doesn't save
**Fix:** Check browser console → Application tab → Local Storage
Should see `flightPlannerState` key

---

## 📊 Verify It's Working

Open browser DevTools and check:

1. **Console Tab**
   - ✅ No errors
   - ✅ No warnings

2. **Application Tab → Local Storage**
   - ✅ Should see `flightPlannerState` key
   - ✅ Click to view JSON data

3. **Network Tab**
   - ✅ All assets loading
   - ✅ No 404s

---

## 🎯 Quick Customization

### Change Brand Name
```typescript
// In Layout.tsx, line ~30
<span className="font-bold text-lg">
  YourBrand<span className="text-cyan-400">Planner</span>
</span>
```

### Change Color Scheme
Replace `cyan` with your brand color throughout:
- `bg-cyan-500` → `bg-blue-500`
- `text-cyan-400` → `text-blue-400`
- `border-cyan-500` → `border-blue-500`

### Add Your Logo
```typescript
// In Layout.tsx, replace Plane icon
<img src="/your-logo.png" alt="Logo" className="h-6 w-6" />
```

---

## 📞 Need Help?

**Check these files for reference:**
- `README.md` - Full architecture overview
- `IMPLEMENTATION_SUMMARY.md` - Detailed explanations
- `src/context/UserContext.tsx` - Core logic (heavily commented)

**Common Questions:**

Q: How do I add more questions?
A: Edit `src/data/staticData.ts` → QUICK_ASSESSMENT_QUESTIONS

Q: How do I change scoring?
A: Edit `src/context/UserContext.tsx` → calculateCombinedScore()

Q: How do I add new routes?
A: Edit `src/data/staticData.ts` → ROUTES array

---

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Home page loads
- [ ] Can complete assessment
- [ ] Results page shows score
- [ ] Data persists on refresh
- [ ] No console errors

**If all checked, you're ready to build Phase 2! 🎉**

---

## 🚀 Next Steps

1. **Test thoroughly** - Go through all flows
2. **Customize branding** - Colors, logos, copy
3. **Deploy to staging** - Vercel/Netlify
4. **Build Journey Map** - The visual centerpiece
5. **Add remaining pages** - Scenarios, Tech Stack, etc.

---

**You're all set! Happy building! 🛫**
