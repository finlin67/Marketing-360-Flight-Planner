# Mapbox Setup Instructions

## Step 1: Create Environment File

Create a `.env.local` file in the project root with your Mapbox access token:

```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiZmluZGxpbmc2NyIsImEiOiJjbWljYmc3NXMxZzRsMmtvZ2U0cjJ1amNyIn0.ENalU0KOO77YBntf4FyMKQ
```

## Step 2: Dependencies Installed

The following packages have been installed:
- `mapbox-gl` - Mapbox GL JS library
- `react-map-gl` - React wrapper for Mapbox GL JS
- `@types/mapbox-gl` - TypeScript definitions

## Step 3: Features Implemented

✅ Interactive Mapbox GL JS map with dark theme
✅ Animated city markers with pulsing effects
✅ Color-coded route lines (cyan/yellow/gray)
✅ Hover tooltips showing city info
✅ Click cities to see detailed modal
✅ Fly-to animations
✅ Multiple map styles (dark, light, satellite, navigation)
✅ Legend and filters overlay
✅ Navigation controls (zoom, fullscreen)
✅ Reset view button
✅ Route detail modals with waypoints

## Usage

The Journey Map page is now fully interactive with Mapbox. Simply navigate to `/journey-map` to see the enhanced map experience.

## Troubleshooting

If you see "Mapbox token not configured":
1. Ensure `.env.local` exists in the project root
2. Restart the dev server after creating the file
3. Verify the token format: `VITE_MAPBOX_TOKEN=pk.ey...`

