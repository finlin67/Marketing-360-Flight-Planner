import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import MapGL, { Marker, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl';
import type { ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUser } from '../context/UserContext';
import { CITIES, ROUTES, getCitiesGeoJSON, SCENARIOS } from '../data/staticData';
import { trackPageView } from '../utils/analytics';
import { logger } from '../utils/logger';
import type { City, Route, Scenario } from '../data/staticData';
import { 
  X, CheckCircle2, Circle, ArrowRight, Rocket, Home, Target, Plane,
  Layers, Sliders, Sparkles, ChevronUp, ChevronDown, Lock, Check,
  Package, MapPin, Clock, AlertCircle, HelpCircle
} from 'lucide-react';
import { HelpCenter } from '../components/HelpCenter';

// Mapbox styles
const MAP_STYLES = [
  { id: 'dark', name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'light', name: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
  { id: 'satellite', name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  { id: 'navigation', name: 'Navigation', url: 'mapbox://styles/mapbox/navigation-night-v1' },
];

// City Marker Component with Enhanced Animations
interface CityMarkerProps {
  city: typeof CITIES[0];
  isHovered: boolean;
  isUnlocked: boolean;
  isPartial: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CityMarker: React.FC<CityMarkerProps> = ({
  isHovered,
  isUnlocked,
  isPartial,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const markerColor = isUnlocked ? '#06b6d4' : isPartial ? '#eab308' : '#64748b';
  
  return (
    <div
      className="relative cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Multiple pulsing rings for unlocked cities */}
      {isUnlocked && (
        <>
          <div className="absolute inset-0 animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }}>
            <div 
              className="w-10 h-10 rounded-full opacity-40"
              style={{ backgroundColor: markerColor, margin: '-8px' }}
            />
          </div>
          <div className="absolute inset-0 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '2s' }}>
            <div 
              className="w-8 h-8 rounded-full opacity-50"
              style={{ backgroundColor: markerColor, margin: '-5px' }}
            />
          </div>
        </>
      )}
      
      {/* Breathing animation for partially available */}
      {isPartial && !isUnlocked && (
        <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '3s' }}>
          <div
            className="w-9 h-9 rounded-full border-2 border-yellow-500 opacity-50"
            style={{ margin: '-6px' }}
          />
        </div>
      )}
      
      {/* Main marker dot with enhanced glow */}
      <div
        className={`w-6 h-6 rounded-full border-2 border-white transition-all duration-300 ${
          isUnlocked 
            ? 'shadow-lg shadow-cyan-500/50 animate-pulse' 
            : isPartial 
            ? 'shadow-md shadow-yellow-500/30' 
            : 'shadow-sm'
        } ${
          isHovered ? 'scale-150 shadow-xl shadow-cyan-500/70' : 'scale-100'
        }`}
        style={{ backgroundColor: markerColor }}
      />
      
      {/* Glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 animate-ping" style={{ animationDuration: '1s' }}>
          <div 
            className="w-12 h-12 rounded-full opacity-30"
            style={{ backgroundColor: '#06b6d4', margin: '-12px' }}
          />
        </div>
      )}
    </div>
  );
};

// Route Layer Component with Animated Travel Effect
interface RouteLayerProps {
  route: typeof ROUTES[0];
  status: 'locked' | 'partial' | 'unlocked';
  isHovered: boolean;
}

const RouteLayer: React.FC<RouteLayerProps> = ({ route, status, isHovered }) => {
  const fromCity = CITIES.find(c => c.id === route.from);
  const toCity = CITIES.find(c => c.id === route.to);

  if (!fromCity || !toCity) return null;

  // Create line coordinates [longitude, latitude]
  const lineCoordinates: [number, number][] = [
    [fromCity.coords[0], fromCity.coords[1]],
    [toCity.coords[0], toCity.coords[1]],
  ];

  const lineColor = {
    unlocked: '#06b6d4',
    partial: '#eab308',
    locked: '#475569',
  }[status];

  const geojson = {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: lineCoordinates,
    },
    properties: {
      routeId: route.id,
      status,
    },
  };

  // Enhanced line width based on hover and status
  const baseWidth = status === 'unlocked' ? 3 : status === 'partial' ? 2.5 : 2;
  const lineWidth = isHovered ? baseWidth + 2 : baseWidth;
  const lineOpacity = status === 'locked' ? 0.3 : isHovered ? 1 : status === 'unlocked' ? 0.9 : 0.7;

  return (
    <Source id={`route-${route.id}`} type="geojson" data={geojson}>
      {/* Enhanced glow effect for unlocked routes */}
      {status === 'unlocked' && (
        <Layer
          id={`route-glow-${route.id}`}
          type="line"
          paint={{
            'line-color': lineColor,
            'line-width': lineWidth + 6,
            'line-opacity': isHovered ? 0.3 : 0.15,
            'line-blur': 6,
          }}
          layout={{
            'line-cap': 'round',
            'line-join': 'round',
          }}
        />
      )}
      
      {/* Main route line */}
      <Layer
        id={`route-line-${route.id}`}
        type="line"
        paint={{
          'line-color': isHovered ? '#06b6d4' : lineColor,
          'line-width': lineWidth,
          'line-opacity': lineOpacity,
          'line-dasharray': status === 'locked' ? [2, 2] : status === 'partial' ? [4, 2] : [1, 0],
        }}
        layout={{
          'line-cap': 'round',
          'line-join': 'round',
        }}
      />
      
      {/* Animated travel effect - moving dots along route */}
      {(status === 'unlocked' || status === 'partial') && (
        <Layer
          id={`route-animation-${route.id}`}
          type="line"
          paint={{
            'line-color': lineColor,
            'line-width': 3,
            'line-opacity': 0.8,
            'line-dasharray': [0.1, 4],
          }}
          layout={{
            'line-cap': 'round',
            'line-join': 'round',
          }}
        />
      )}
      
      {/* Fast animated flow for unlocked routes */}
      {status === 'unlocked' && (
        <Layer
          id={`route-flow-${route.id}`}
          type="line"
          paint={{
            'line-color': lineColor,
            'line-width': 2,
            'line-opacity': 0.7,
            'line-dasharray': [0, 3, 2],
          }}
          layout={{
            'line-cap': 'round',
            'line-join': 'round',
          }}
        />
      )}
    </Source>
  );
};

// Flip Board Number Component
interface FlipNumberProps {
  value: string | number;
  className?: string;
}

const FlipNumber: React.FC<FlipNumberProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [nextValue, setNextValue] = useState(value);

  useEffect(() => {
    if (String(displayValue) !== String(value)) {
      setNextValue(value);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={`flip-number ${isFlipping ? 'flipping' : ''}`}>
        <span className="flip-front">{displayValue}</span>
        {isFlipping && <span className="flip-back">{nextValue}</span>}
      </span>
    </span>
  );
};

const JourneyMapComponent: React.FC = () => {
  const navigate = useNavigate();
  const { combinedScore, flightMiles, getRouteStatus, unlockedRoutes, planeLevel, profile } = useUser();
  
  const [viewState, setViewState] = useState<ViewState>({
    longitude: -20, // Center on Atlantic
    latitude: 30,
    zoom: 2.2, // Higher zoom to see cities better
    pitch: 0, // Flat view
    bearing: 0, // North facing up
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [hoveredLabelId, setHoveredLabelId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0].url);
  const [showAllCities, setShowAllCities] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [hoveredConnections, setHoveredConnections] = useState<string[]>([]);
  
  // Air Traffic Control Panel state
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'planner' | 'scenarios' | 'routes'>('planner');
  const [plannerFrom, setPlannerFrom] = useState<string>('');
  const [plannerTo, setPlannerTo] = useState<string>('');
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState<{
    from: City;
    to: City;
    distance: number;
    waypoints: City[];
    status: 'locked' | 'partial' | 'unlocked';
    directRoute: Route | null;
    requiredScore: number;
    requiredMiles: number;
  } | null>(null);
  const [highlightedRouteId, setHighlightedRouteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    setMounted(true);
    trackPageView('/journey-map');
    return () => setMounted(false);
  }, []);

  // Helper: Calculate distance between two points (Haversine formula)
  // Cache for distance calculations
  const distanceCache = useRef(new Map<string, number>());
  
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Check cache first
    const cacheKey = `${lat1.toFixed(4)},${lon1.toFixed(4)},${lat2.toFixed(4)},${lon2.toFixed(4)}`;
    if (distanceCache.current.has(cacheKey)) {
      return distanceCache.current.get(cacheKey)!;
    }
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Helper: Find waypoint cities (cities along the path)
  const findWaypointCities = useCallback((originId: string, destId: string): City[] => {
    // Simple logic: find cities that are connected to both
    return CITIES.filter(city => {
      if (city.id === originId || city.id === destId) return false;
      
      const connectedToOrigin = ROUTES.some(r => 
        (r.from === originId && r.to === city.id) || 
        (r.to === originId && r.from === city.id)
      );
      
      const connectedToDest = ROUTES.some(r => 
        (r.from === destId && r.to === city.id) || 
        (r.to === destId && r.from === city.id)
      );
      
      return connectedToOrigin && connectedToDest;
    }).slice(0, 3); // Max 3 waypoints
  }, []);

  // Helper: Find route between cities
  const findRouteBetweenCities = useCallback((fromId: string, toId: string): Route | null => {
    return ROUTES.find(r => 
      (r.from === fromId && r.to === toId) ||
      (r.from === toId && r.to === fromId)
    ) || null;
  }, []);

  // Helper: Fly to route (animate map to show both cities)
  const flyToRoute = useCallback((fromCity: City, toCity: City) => {
    // Calculate midpoint between cities
    const midLat = (fromCity.coords[1] + toCity.coords[1]) / 2;
    const midLng = (fromCity.coords[0] + toCity.coords[0]) / 2;
    
    // Calculate appropriate zoom level based on distance
    const distance = calculateDistance(
      fromCity.coords[1], fromCity.coords[0],
      toCity.coords[1], toCity.coords[0]
    );
    
    const zoom = distance > 5000 ? 2 : distance > 2000 ? 3 : 4;
    
    // Animate to view both cities
    setViewState(prev => ({
      ...prev,
      longitude: midLng,
      latitude: midLat,
      zoom: zoom,
    }));
  }, [calculateDistance]);

  // Handle calculate route
  const handleCalculateRoute = useCallback(() => {
    if (!plannerFrom || !plannerTo) {
      setToast({ message: 'Please select both origin and destination cities', type: 'error' });
      setTimeout(() => setToast(null), 5000);
      return;
    }

    // Find the cities
    const originCity = CITIES.find(c => c.id === plannerFrom);
    const destinationCity = CITIES.find(c => c.id === plannerTo);

    if (!originCity || !destinationCity) {
      setToast({ message: 'Invalid city selection. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 5000);
      return;
    }

    // Check if there's a direct route
    const directRoute = findRouteBetweenCities(plannerFrom, plannerTo);

    // Calculate distance (approximate)
    const distance = calculateDistance(
      originCity.coords[1], originCity.coords[0],
      destinationCity.coords[1], destinationCity.coords[0]
    );

    // Find waypoint cities (simple: cities between them)
    const waypointCities = findWaypointCities(plannerFrom, plannerTo);

    // Get route status
    const routeStatus = directRoute ? getRouteStatus(directRoute.id) : { status: 'locked' as const, currentProgress: 0 };

    setCalculatedRoute({
      from: originCity,
      to: destinationCity,
      distance: Math.round(distance),
      waypoints: waypointCities,
      status: routeStatus.status,
      directRoute: directRoute,
      requiredScore: directRoute?.requiredScore || 70,
      requiredMiles: directRoute?.requiredMiles || 2000
    });

    // Highlight the route on map
    if (directRoute) {
      setHighlightedRouteId(directRoute.id);
    }

    // Animate map to show route
    flyToRoute(originCity, destinationCity);
  }, [plannerFrom, plannerTo, calculateDistance, findWaypointCities, findRouteBetweenCities, getRouteStatus, flyToRoute]);

  // Get recommended scenarios for map
  const getRecommendedScenariosForMap = useCallback((): Scenario[] => {
    let scenarios = SCENARIOS;
    
    // Filter by industry
    if (profile?.industry) {
      scenarios = scenarios.filter(s =>
        s.industry === profile.industry || 
        s.industry === 'Cross-Industry'
      );
    }
    
    // Filter by score (show scenarios they can actually do)
    if (combinedScore) {
      scenarios = scenarios.filter(s =>
        !s.requiredScore || combinedScore >= (s.requiredScore - 10)
      );
    }
    
    // If route is calculated, filter by relevant cities
    if (calculatedRoute) {
      scenarios = scenarios.filter(s =>
        s.from === calculatedRoute.from.id ||
        s.to === calculatedRoute.to.id ||
        s.from === calculatedRoute.to.id ||
        s.to === calculatedRoute.from.id
      );
    }
    
    return scenarios.slice(0, 6); // Top 6
  }, [profile, combinedScore, calculatedRoute]);

  // Handle scenario click
  const handleScenarioClick = useCallback((scenarioId: string) => {
    navigate(`/scenarios/${scenarioId}`);
  }, [navigate]);

  // Generate scenario title
  const generateScenarioTitle = useCallback((scenario: Scenario): string => {
    if (scenario.title) return scenario.title;
    
    // Extract key phrases from problem or outcome
    const problem = scenario.problem || '';
    const outcome = scenario.desiredOutcome || '';
    
    // Simple title generation logic
    if (problem.includes('SEO')) return 'Scale Organic Search';
    if (problem.includes('pipeline')) return 'Build Predictable Pipeline';
    if (problem.includes('ABM')) return 'Launch ABM Program';
    if (problem.includes('tech stack')) return 'Optimize Marketing Tech';
    if (problem.includes('attribution')) return 'Fix Marketing Attribution';
    if (outcome.includes('demand')) return 'Build Demand Generation Engine';
    
    // Fallback
    return `${scenario.industry} Growth Strategy`;
  }, []);

  // Get connected routes for a city
  const getConnectedRoutes = useCallback((cityId: string) => {
    return ROUTES.filter(r => r.from === cityId || r.to === cityId).map(r => r.id);
  }, []);

  // Handle city hover to highlight connections
  const handleCityHover = useCallback((cityId: string | null) => {
    if (cityId) {
      const connected = getConnectedRoutes(cityId);
      setHoveredConnections(connected);
      setHoveredCity(cityId);
    } else {
      setHoveredConnections([]);
      setHoveredCity(null);
    }
  }, [getConnectedRoutes]);

  // Get Mapbox token
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  
  // Debug: Log token status in development
  useEffect(() => {
    logger.log('🔍 Mapbox Token Debug:', {
      tokenExists: !!mapboxToken,
      tokenLength: mapboxToken?.length || 0,
      tokenPreview: mapboxToken ? `${mapboxToken.substring(0, 10)}...` : 'NOT FOUND',
      allEnvVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')),
    });
  }, []);
  
  if (!mapboxToken) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 p-8 rounded-lg border border-red-500/50 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 text-center">
            Map Unavailable
          </h2>
          <p className="text-slate-400 text-center mb-6">
            The journey map requires a Mapbox token to display. 
            Please contact the site administrator or check your configuration.
          </p>
          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <p className="text-xs text-slate-500 mb-2">For developers:</p>
            <p className="text-xs text-slate-400 mb-2">
              Create a <code className="bg-slate-900 px-2 py-1 rounded text-cyan-400">.env.local</code> file with:
            </p>
            <code className="bg-slate-950 p-3 rounded-lg block text-left text-xs text-cyan-400">
              VITE_MAPBOX_TOKEN=your_token_here
            </code>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Determine city unlock status
  const cityStatus = useMemo(() => {
    const status: Record<string, { unlocked: boolean; partial: boolean }> = {};
    CITIES.forEach(city => {
      const connectedRoutes = ROUTES.filter(r => r.from === city.id || r.to === city.id);
      let hasUnlocked = false;
      let hasPartial = false;
      
      connectedRoutes.forEach(route => {
        const routeStatus = getRouteStatus(route.id);
        if (routeStatus.status === 'unlocked') hasUnlocked = true;
        if (routeStatus.status === 'partial') hasPartial = true;
      });
      
      status[city.id] = {
        unlocked: hasUnlocked,
        partial: hasPartial && !hasUnlocked,
      };
    });
    return status;
  }, [getRouteStatus]);

  // Create GeoJSON with status included
  const citiesGeoJSON = useMemo(() => {
    const baseGeoJSON = getCitiesGeoJSON();
    return {
      ...baseGeoJSON,
      features: baseGeoJSON.features.map(feature => ({
        ...feature,
        properties: {
          ...feature.properties,
          status: cityStatus[feature.properties.id]?.unlocked ? 'unlocked' : 
                  cityStatus[feature.properties.id]?.partial ? 'partial' : 'locked',
        },
      })),
    };
  }, [cityStatus]);

  // Get route statuses
  const routeStatuses = useMemo(() => {
    return ROUTES.map(route => ({
      route,
      status: getRouteStatus(route.id),
    }));
  }, [getRouteStatus]);

  // Filter cities
  const filteredCities = useMemo(() => {
    if (showOnlyUnlocked) {
      return CITIES.filter(c => cityStatus[c.id]?.unlocked);
    }
    return CITIES;
  }, [showOnlyUnlocked, cityStatus]);

  // Fly to city
  const flyToCity = useCallback((city: typeof CITIES[0]) => {
    setViewState(prev => ({
      ...prev,
      longitude: city.coords[0],
      latitude: city.coords[1],
      zoom: 5,
    }));
  }, []);

  // Create region overlays GeoJSON
  const regionsGeoJSON = useMemo(() => {
    // Simple bounding boxes for regions (can be enhanced with actual polygons)
    const regionBounds: Record<string, { bbox: [number, number, number, number] }> = {
      'NA': { bbox: [-130, 25, -60, 50] }, // North America
      'EU': { bbox: [-10, 35, 40, 70] },   // Europe
      'APAC': { bbox: [100, -10, 150, 50] }, // Asia Pacific
      'MENA': { bbox: [30, 10, 60, 40] },  // Middle East & North Africa
    };

    return {
      type: 'FeatureCollection' as const,
      features: Object.entries(regionBounds).map(([region, { bbox }]) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [bbox[0], bbox[1]],
            [bbox[2], bbox[1]],
            [bbox[2], bbox[3]],
            [bbox[0], bbox[3]],
            [bbox[0], bbox[1]],
          ]],
        },
        properties: { region },
      })),
    };
  }, []);

  // Calculate visited cities (cities with unlocked routes)
  const visitedCities = useMemo(() => {
    const citiesWithUnlockedRoutes = new Set<string>();
    unlockedRoutes.forEach(routeId => {
      const route = ROUTES.find(r => r.id === routeId);
      if (route) {
        citiesWithUnlockedRoutes.add(route.from);
        citiesWithUnlockedRoutes.add(route.to);
      }
    });
    return citiesWithUnlockedRoutes.size;
  }, [unlockedRoutes]);

  const totalRoutes = ROUTES.length;

  const selectedRouteData = selectedRoute
    ? routeStatuses.find(r => r.route.id === selectedRoute)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Plane className="text-cyan-400 h-6 w-6 transform -rotate-45" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Journey Map</h1>
                <p className="text-xs text-slate-400">Interactive marketing journey visualization</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Airport Departure Board Stats Bar */}
      <div className="sticky top-[73px] left-0 right-0 z-30 bg-black/90 backdrop-blur-sm border-b border-cyan-500 shadow-lg">
        <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 md:gap-6 text-center">
            {/* Current Altitude */}
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Altitude</div>
              <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-cyan-400">
                <FlipNumber value={combinedScore} />
                <span className="text-sm sm:text-base md:text-lg text-slate-500">/100</span>
              </div>
            </div>

            {/* Plane Level */}
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Aircraft</div>
              <div className="text-base sm:text-lg md:text-xl font-mono font-bold text-yellow-400">
                <FlipNumber value={planeLevel} />
              </div>
            </div>

            {/* Flight Miles */}
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Flight Miles</div>
              <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-purple-400">
                <FlipNumber value={flightMiles.toLocaleString()} />
              </div>
            </div>

            {/* Routes Unlocked */}
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Routes</div>
              <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-green-400">
                <FlipNumber value={unlockedRoutes.length} />
                <span className="text-sm sm:text-base md:text-lg text-slate-500">/{totalRoutes}</span>
              </div>
            </div>

            {/* Cities Visited */}
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Cities</div>
              <div className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-cyan-400">
                <FlipNumber value={visitedCities} />
                <span className="text-sm sm:text-base md:text-lg text-slate-500">/13</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container - Full Width (adjust height when panel is open) */}
      <div className="relative w-full transition-all duration-300" style={{ 
        height: panelOpen ? 'calc(100vh - 146px - 40vh)' : 'calc(100vh - 146px)', 
        minHeight: '300px'
      }}>
        <MapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapboxToken}
          mapStyle={mapStyle}
          projection={{ name: 'mercator' }}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          dragPan={false}
          dragRotate={false}
          touchZoomRotate={false}
          interactiveLayerIds={['city-names-minimal', 'city-names-full', 'city-functions', 'airport-codes']}
          onMouseEnter={(e) => {
            if (e.features && e.features[0] && e.features[0].properties) {
              const cityId = e.features[0].properties.id;
              if (cityId) {
                setHoveredLabelId(cityId);
                handleCityHover(cityId);
              }
            }
          }}
          onMouseLeave={() => {
            setHoveredLabelId(null);
            handleCityHover(null);
          }}
          onClick={(e) => {
            if (e.features && e.features[0] && e.features[0].properties) {
              const cityId = e.features[0].properties.id;
              if (cityId) {
                const city = CITIES.find(c => c.id === cityId);
                if (city) {
                  setSelectedCity(city);
                  flyToCity(city);
                }
              }
            }
          }}
        >
          {/* Navigation Controls */}
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />

          {/* Region Overlays */}
          {viewState.zoom >= 2 && viewState.zoom <= 4 && (
            <Source id="regions" type="geojson" data={regionsGeoJSON}>
              <Layer
                id="region-fills"
                type="fill"
                paint={{
                  'fill-color': [
                    'match',
                    ['get', 'region'],
                    'NA', 'rgba(59, 130, 246, 0.08)',
                    'EU', 'rgba(168, 85, 247, 0.08)',
                    'APAC', 'rgba(34, 197, 94, 0.08)',
                    'MENA', 'rgba(251, 146, 60, 0.08)',
                    'rgba(0,0,0,0)',
                  ],
                  'fill-opacity': 0.2,
                }}
              />
            </Source>
          )}

          {/* Route Layers */}
          {showConnections && routeStatuses.map(({ route, status }) => {
            const isHighlighted = hoveredConnections.includes(route.id) || highlightedRouteId === route.id;
            return (
              <RouteLayer
                key={route.id}
                route={route}
                status={status.status}
                isHovered={isHighlighted}
              />
            );
          })}

          {/* City Labels Source */}
          <Source id="cities-labels" type="geojson" data={citiesGeoJSON}>
            {/* Airport Codes (small, above city) - only when zoomed in */}
            <Layer
              id="airport-codes"
              type="symbol"
              minzoom={4}
              layout={{
                'text-field': ['get', 'code'],
                'text-font': ['Open Sans Medium', 'Arial Unicode MS Regular'],
                'text-size': 10,
                'text-offset': [0, -3.5],
                'text-anchor': 'bottom',
                'text-letter-spacing': 0.1,
                'text-allow-overlap': false,
              }}
              paint={{
                'text-color': '#64748b',
                'text-halo-color': '#020617',
                'text-halo-width': 1,
                'text-halo-blur': 0.5,
              }}
            />

            {/* City Names - Minimal (zoomed out) */}
            <Layer
              id="city-names-minimal"
              type="symbol"
              maxzoom={3}
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'text-offset': [0, -2],
                'text-anchor': 'top',
                'text-allow-overlap': false,
              }}
              paint={{
                'text-color': [
                  'case',
                  ['==', ['get', 'id'], hoveredLabelId || ''], '#22d3ee',
                  ['==', ['get', 'status'], 'unlocked'], '#06b6d4',
                  ['==', ['get', 'status'], 'partial'], '#eab308',
                  '#64748b',
                ],
                'text-halo-color': '#020617',
                'text-halo-width': 2,
                'text-halo-blur': 1,
              }}
            />

            {/* City Names - Full (zoomed in) */}
            <Layer
              id="city-names-full"
              type="symbol"
              minzoom={3}
              layout={{
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3, 12,
                  5, 14,
                  7, 16,
                ],
                'text-offset': [0, -2],
                'text-anchor': 'top',
                'text-allow-overlap': false,
              }}
              paint={{
                'text-color': [
                  'case',
                  ['==', ['get', 'id'], hoveredLabelId || ''], '#22d3ee',
                  ['==', ['get', 'status'], 'unlocked'], '#06b6d4',
                  ['==', ['get', 'status'], 'partial'], '#eab308',
                  '#64748b',
                ],
                'text-halo-color': '#020617',
                'text-halo-width': [
                  'case',
                  ['==', ['get', 'id'], hoveredLabelId || ''], 3,
                  2,
                ],
                'text-halo-blur': 1,
              }}
            />

            {/* Marketing Function Labels (below city name) - only when zoomed in */}
            <Layer
              id="city-functions"
              type="symbol"
              minzoom={4}
              layout={{
                'text-field': ['get', 'function'],
                'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                'text-size': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  4, 10,
                  6, 11,
                  8, 12,
                ],
                'text-offset': [0, 0.5],
                'text-anchor': 'top',
                'text-allow-overlap': false,
              }}
              paint={{
                'text-color': [
                  'case',
                  ['==', ['get', 'id'], hoveredLabelId || ''], '#94a3b8',
                  '#94a3b8',
                ],
                'text-halo-color': '#020617',
                'text-halo-width': 1.5,
                'text-halo-blur': 0.5,
              }}
            />
          </Source>

          {/* City Markers */}
          {filteredCities.map((city) => {
            const status = cityStatus[city.id] || { unlocked: false, partial: false };
            const isHovered = hoveredCity === city.id;
            
            return (
              <Marker
                key={city.id}
                longitude={city.coords[0]}
                latitude={city.coords[1]}
                anchor="center"
              >
                <CityMarker
                  city={city}
                  isHovered={isHovered}
                  isUnlocked={status.unlocked}
                  isPartial={status.partial}
                  onClick={() => {
                    setSelectedCity(city);
                    flyToCity(city);
                  }}
                  onMouseEnter={() => handleCityHover(city.id)}
                  onMouseLeave={() => handleCityHover(null)}
                />
              </Marker>
            );
          })}
        </MapGL>

        {/* Collapsible Controls Overlay - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          {/* Toggle Button */}
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            className="bg-slate-900/95 backdrop-blur-sm hover:bg-slate-800 border border-slate-800 rounded-lg p-3 text-cyan-400 transition-colors shadow-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            title={controlsOpen ? "Hide Controls" : "Show Controls"}
          >
            <Sliders className="w-6 h-6" />
          </button>
          
          {/* Controls Panel */}
          {controlsOpen && (
            <div className="mt-2 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-xl p-4 shadow-xl max-w-xs">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Layers className="text-cyan-400" size={18} />
                Map Controls
              </h3>
              
              {/* Map Style Selector */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Map Style</label>
                <select
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                >
                  {MAP_STYLES.map(style => (
                    <option key={style.id} value={style.url}>{style.name}</option>
                  ))}
                </select>
              </div>

              {/* Legend */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-white">Unlocked Routes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-white">Partially Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                    <span className="text-white">Locked Routes</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAllCities}
                      onChange={(e) => setShowAllCities(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-white">Show all cities</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showConnections}
                      onChange={(e) => setShowConnections(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-white">Show route lines</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyUnlocked}
                      onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-sm text-white">Show only unlocked</span>
                  </label>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Score:</span>
                    <span className="text-cyan-400 font-bold">{combinedScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unlocked Routes:</span>
                    <span className="text-emerald-400 font-bold">{unlockedRoutes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Tooltip for Hovered City */}
        {hoveredCity && (() => {
          const city = CITIES.find(c => c.id === hoveredCity);
          if (!city) return null;
          const connectedRoutes = ROUTES.filter(r => r.from === city.id || r.to === city.id);
          const minScore = Math.min(...connectedRoutes.map(r => r.requiredScore));
          const minMiles = Math.min(...connectedRoutes.map(r => r.requiredMiles));
          const status = cityStatus[city.id] || { unlocked: false, partial: false };
          
          return (
            <div className="absolute top-20 left-4 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/50 rounded-xl p-4 shadow-2xl z-50 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  status.unlocked ? 'bg-emerald-500/20' : status.partial ? 'bg-yellow-500/20' : 'bg-slate-800'
                }`}>
                  <Sparkles className={`w-5 h-5 ${
                    status.unlocked ? 'text-emerald-400' : status.partial ? 'text-yellow-400' : 'text-slate-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-cyan-400 mb-1">{city.name}</h3>
                  <p className="text-sm text-slate-300 mb-2">{city.function}</p>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold ${
                    status.unlocked 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : status.partial 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {status.unlocked ? '✓ Unlocked' : status.partial ? '⚠ Partial' : '🔒 Locked'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Min Score Required:</span>
                  <span className="text-cyan-400 font-bold">{minScore}+</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Min Flight Miles:</span>
                  <span className="text-yellow-400 font-bold">{minMiles.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Connected Routes:</span>
                  <span className="text-purple-400 font-bold">{connectedRoutes.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Region:</span>
                  <span className="text-slate-300 font-semibold">{city.region}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Particle Background Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Reset View Button */}
        <button
          onClick={() => {
            setViewState({
              longitude: -20,
              latitude: 30,
              zoom: 2.2,
              pitch: 0,
              bearing: 0,
              padding: { top: 0, bottom: 0, left: 0, right: 0 },
            });
          }}
          className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-sm hover:bg-slate-800 border border-slate-700 rounded-lg p-3 text-cyan-400 transition-colors shadow-xl z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Reset View"
        >
          <Home size={20} />
        </button>
      </div>

      {/* City Detail Modal */}
      {selectedCity && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCity(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSelectedCity(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="city-modal-title"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="city-modal-title" className="text-2xl font-bold text-white mb-2">{selectedCity.name}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="text-cyan-400 font-semibold">{selectedCity.function}</span>
                  <span>•</span>
                  <span>{selectedCity.region}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-300">{selectedCity.description}</p>
            </div>

            {/* Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                cityStatus[selectedCity.id]?.unlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : cityStatus[selectedCity.id]?.partial
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {cityStatus[selectedCity.id]?.unlocked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                {cityStatus[selectedCity.id]?.unlocked ? 'Unlocked' : cityStatus[selectedCity.id]?.partial ? 'Partially Available' : 'Locked'}
              </div>
            </div>

            {/* Connected Routes */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3">Connected Routes</h4>
              <div className="space-y-2">
                {ROUTES.filter(r => r.from === selectedCity.id || r.to === selectedCity.id).map(route => {
                  const status = getRouteStatus(route.id);
                  const otherCity = CITIES.find(c => c.id === (route.from === selectedCity.id ? route.to : route.from));
                  return (
                    <div
                      key={route.id}
                      onClick={() => {
                        setSelectedCity(null);
                        setSelectedRoute(route.id);
                      }}
                      className="p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{route.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          status.status === 'unlocked' ? 'bg-emerald-500/20 text-emerald-400' :
                          status.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {status.status}
                        </span>
                      </div>
                      {otherCity && (
                        <div className="text-xs text-slate-400 mt-1">
                          → {otherCity.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  flyToCity(selectedCity);
                  setSelectedCity(null);
                }}
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Target size={18} />
                Focus on City
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Route Detail Modal */}
      {selectedRouteData && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedRoute(null);
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300 delay-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 id="route-modal-title" className="text-2xl font-bold text-white mb-2">{selectedRouteData.route.name}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span>{CITIES.find(c => c.id === selectedRouteData.route.from)?.name} → {CITIES.find(c => c.id === selectedRouteData.route.to)?.name}</span>
                  <span>•</span>
                  <span>{selectedRouteData.route.difficulty}</span>
                  <span>•</span>
                  <span>{selectedRouteData.route.estimatedDuration}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close route details modal"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 text-sm">
                Journey from {CITIES.find(c => c.id === selectedRouteData.route.from)?.name} to {CITIES.find(c => c.id === selectedRouteData.route.to)?.name}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                selectedRouteData.status.status === 'unlocked'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : selectedRouteData.status.status === 'partial'
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {selectedRouteData.status.status === 'unlocked' && <CheckCircle2 size={16} />}
                {selectedRouteData.status.status === 'unlocked'
                  ? 'Unlocked'
                  : selectedRouteData.status.status === 'partial'
                  ? 'Partially Available'
                  : 'Locked'}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-6 bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-3">Requirements</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Score Required:</span>
                  <span className="text-sm font-bold text-white">{selectedRouteData.route.requiredScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Miles Required:</span>
                  <span className="text-sm font-bold text-white">{selectedRouteData.route.requiredMiles.toLocaleString()}</span>
                </div>
                
                {selectedRouteData.status.status !== 'unlocked' && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Your Current Status:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Your Score:</span>
                        <span className={combinedScore >= selectedRouteData.route.requiredScore ? 'text-emerald-400' : 'text-red-400'}>
                          {combinedScore} / {selectedRouteData.route.requiredScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Your Miles:</span>
                        <span className={flightMiles >= selectedRouteData.route.requiredMiles ? 'text-emerald-400' : 'text-red-400'}>
                          {flightMiles.toLocaleString()} / {selectedRouteData.route.requiredMiles.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Waypoints */}
            {selectedRouteData.route.waypoints && selectedRouteData.route.waypoints.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-3">Journey Waypoints</div>
                <div className="space-y-3">
                  {selectedRouteData.route.waypoints.map((waypoint, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-start gap-3 mb-2">
                        <Circle className="text-cyan-400 mt-0.5" size={20} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-white text-sm">{waypoint.title}</h4>
                            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">{waypoint.duration}</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-3">{waypoint.description}</p>
                          {waypoint.deliverables.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Deliverables:</div>
                              {waypoint.deliverables.map((deliverable, dIdx) => (
                                <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                                  <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                                  <span>{deliverable}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            {selectedRouteData.status.status === 'unlocked' && (
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedRoute(null);
                    navigate('/scenarios');
                  }}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Rocket size={18} />
                  Start Journey
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Air Traffic Control Panel */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-20
        bg-slate-900/95 backdrop-blur-lg
        border-t-2 border-cyan-500
        transition-transform duration-300 ease-in-out
        ${panelOpen ? 'translate-y-0' : 'translate-y-full'}
        shadow-2xl
      `}>
        {/* Toggle Button */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute -top-10 right-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors shadow-lg min-h-[44px]"
        >
          {panelOpen ? (
            <>
              <ChevronDown className="w-5 h-5" />
              Hide Control Panel
            </>
          ) : (
            <>
              <ChevronUp className="w-5 h-5" />
              Show Control Panel
            </>
          )}
        </button>

        <div className="container mx-auto p-4 sm:p-6" style={{ height: '40vh', maxHeight: '500px', overflowY: 'auto' }}>
          {/* Tabs */}
          <div className="flex gap-4 mb-4 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('planner')}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'planner'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flight Planner
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'scenarios'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recommended Scenarios
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'routes'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Routes
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {/* TAB 1: Flight Planner */}
            {activeTab === 'planner' && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* FROM */}
                  <div>
                    <label className="text-cyan-400 text-sm font-semibold mb-2 block">Departure</label>
                    <select
                      value={plannerFrom}
                      onChange={(e) => setPlannerFrom(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none min-h-[44px]"
                    >
                      <option value="">Select Origin City...</option>
                      {CITIES.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name} - {city.function}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TO */}
                  <div>
                    <label className="text-cyan-400 text-sm font-semibold mb-2 block">Destination</label>
                    <select
                      value={plannerTo}
                      onChange={(e) => setPlannerTo(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none min-h-[44px]"
                    >
                      <option value="">Select Destination City...</option>
                      {CITIES.filter(c => c.id !== plannerFrom).map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name} - {city.function}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CALCULATE */}
                  <div className="flex items-end">
                    <button
                      onClick={handleCalculateRoute}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold min-h-[44px]"
                    >
                      <Plane className="w-5 h-5" />
                      <span className="hidden sm:inline">Calculate Route</span>
                      <span className="sm:hidden">Calculate</span>
                    </button>
                  </div>
                </div>

                {/* Results */}
                {calculatedRoute && (
                  <div className="mt-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      
                      {/* Distance */}
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">Distance</div>
                        <div className="text-cyan-400 font-bold text-lg">
                          {calculatedRoute.distance.toLocaleString()} mi
                        </div>
                      </div>

                      {/* Waypoints */}
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">Waypoints</div>
                        <div className="text-yellow-400 font-bold text-lg">
                          {calculatedRoute.waypoints.length} cities
                        </div>
                      </div>

                      {/* Required Score */}
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">Score Needed</div>
                        <div className={`font-bold text-lg ${
                          combinedScore >= calculatedRoute.requiredScore ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {calculatedRoute.requiredScore}+
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">Status</div>
                        <div className={`font-bold text-lg ${
                          calculatedRoute.status === 'unlocked' ? 'text-green-400' :
                          calculatedRoute.status === 'partial' ? 'text-yellow-400' :
                          'text-slate-500'
                        }`}>
                          {calculatedRoute.status === 'unlocked' ? '✓ Ready' :
                           calculatedRoute.status === 'partial' ? '⚠ 75% Ready' :
                           '🔒 Locked'}
                        </div>
                      </div>

                    </div>

                    {/* Route Path */}
                    <div className="mb-4">
                      <div className="text-sm text-slate-400 mb-2">Route Path:</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-cyan-400 font-semibold">
                          {calculatedRoute.from.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        
                        {calculatedRoute.waypoints.map((city) => (
                          <React.Fragment key={city.id}>
                            <span className="text-yellow-400">{city.name}</span>
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                          </React.Fragment>
                        ))}
                        
                        <span className="text-cyan-400 font-semibold">
                          {calculatedRoute.to.name}
                        </span>
                      </div>
                    </div>

                    {/* Requirements Message */}
                    {calculatedRoute.status === 'locked' && (
                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Lock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <div className="text-red-400 font-semibold mb-1">
                              This route is currently locked
                            </div>
                            <div className="text-slate-400">
                              You need a score of {calculatedRoute.requiredScore}+ and 
                              {calculatedRoute.requiredMiles.toLocaleString()} flight miles to unlock this journey. 
                              Complete the assessment and recommended scenarios to qualify.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {calculatedRoute.status === 'unlocked' && (
                      <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold">
                            You're ready for this journey!
                          </span>
                        </div>
                      </div>
                    )}

                    {/* View Scenarios Button */}
                    <button
                      onClick={() => setActiveTab('scenarios')}
                      className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      View Recommended Scenarios for This Route
                    </button>

                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Recommended Scenarios */}
            {activeTab === 'scenarios' && (
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">
                    {calculatedRoute 
                      ? `Scenarios for ${calculatedRoute.from.name} → ${calculatedRoute.to.name}`
                      : 'Recommended Scenarios'
                    }
                  </h3>
                  <span className="text-slate-400 text-sm">
                    {getRecommendedScenariosForMap().length} scenarios
                  </span>
                </div>

                {/* No scenarios message */}
                {getRecommendedScenariosForMap().length === 0 && (
                  <div className="bg-slate-800 p-8 rounded-lg text-center">
                    <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 mb-4">
                      {calculatedRoute 
                        ? "No specific scenarios for this route yet."
                        : "Calculate a route to see relevant scenarios."
                      }
                    </p>
                    {!calculatedRoute && (
                      <button
                        onClick={() => setActiveTab('planner')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Go to Flight Planner →
                      </button>
                    )}
                  </div>
                )}

                {/* Scenario Cards */}
                {getRecommendedScenariosForMap().map(scenario => (
                  <div 
                    key={scenario.id}
                    className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-all border border-slate-700 hover:border-cyan-500"
                    onClick={() => handleScenarioClick(scenario.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-cyan-400 font-semibold mb-1">
                          {generateScenarioTitle(scenario)}
                        </h4>
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {scenario.problem || scenario.challenge || scenario.description}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                          {scenario.industry}
                        </span>
                        {scenario.companySize && (
                          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded">
                            {scenario.companySize}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scenario.estimatedDuration || scenario.duration || '90-120 days'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {scenario.difficulty || `Complexity: ${scenario.complexity}/5`}
                      </span>
                      {scenario.from && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {CITIES.find(c => c.id === scenario.from)?.name || 'Multiple cities'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* View All Scenarios Link */}
                {getRecommendedScenariosForMap().length > 0 && (
                  <button
                    onClick={() => navigate('/scenarios')}
                    className="w-full text-cyan-400 hover:text-cyan-300 py-3 text-sm font-semibold transition-colors"
                  >
                    View All {SCENARIOS.length} Scenarios →
                  </button>
                )}

              </div>
            )}

            {/* TAB 3: Active Routes */}
            {activeTab === 'routes' && (
              <div>
                <h3 className="text-white font-bold text-lg mb-4">All Routes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ROUTES.map(route => {
                    const status = getRouteStatus(route.id);
                    const fromCity = CITIES.find(c => c.id === route.from);
                    const toCity = CITIES.find(c => c.id === route.to);

                    return (
                      <div
                        key={route.id}
                        onClick={() => {
                          setHighlightedRouteId(route.id);
                          setPlannerFrom(route.from);
                          setPlannerTo(route.to);
                          setActiveTab('planner');
                        }}
                        className={`
                          p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${status.status === 'unlocked' ? 'border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20' : ''}
                          ${status.status === 'partial' ? 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' : ''}
                          ${status.status === 'locked' ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800' : ''}
                          ${highlightedRouteId === route.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white font-semibold">{fromCity?.name}</span>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-white font-semibold">{toCity?.name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            {status.status === 'unlocked' && (
                              <span className="text-xs text-cyan-400 font-semibold">✓ Available</span>
                            )}
                            {status.status === 'partial' && (
                              <span className="text-xs text-yellow-400 font-semibold">⚠ {status.currentProgress}% Ready</span>
                            )}
                            {status.status === 'locked' && (
                              <span className="text-xs text-slate-500">🔒 Locked</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            {route.requiredScore}+ / {route.requiredMiles.toLocaleString()} mi
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Help Button */}
      <button
        onClick={() => setShowQuickHelp(!showQuickHelp)}
        className="fixed bottom-24 right-8 z-30 bg-cyan-500 hover:bg-cyan-400 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
        aria-label="Show quick help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Quick Help Overlay */}
      {showQuickHelp && (
        <div className="fixed bottom-40 right-8 bg-slate-900 rounded-lg shadow-2xl border border-cyan-500 p-6 w-80 sm:w-96 z-30 animate-in fade-in slide-in-from-bottom">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-white">Quick Guide</h4>
            <button 
              onClick={() => setShowQuickHelp(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-cyan-400 font-semibold mb-2">City Colors:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div> Unlocked
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Partial
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-slate-500"></div> Locked
                </div>
              </div>
            </div>

            <div>
              <div className="text-purple-400 font-semibold mb-2">Interactions:</div>
              <div className="text-slate-300 space-y-1">
                <div>• Hover over cities for details</div>
                <div>• Click cities for full information</div>
                <div>• Two lit cities = unlocked route</div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQuickHelp(false);
                setShowHelpCenter(true);
              }}
              className="w-full text-cyan-400 hover:text-cyan-300 text-center py-2 font-semibold transition-colors"
            >
              View Full Guide →
            </button>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      <HelpCenter 
        isOpen={showHelpCenter} 
        onClose={() => setShowHelpCenter(false)}
        initialTab="Journey Map"
      />
    </div>
  );
};

// Memoize JourneyMap to prevent re-renders when parent updates
export const JourneyMap = React.memo(JourneyMapComponent);
