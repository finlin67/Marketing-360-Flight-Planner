/**
 * Route requirements for unlocking routes
 * Single source of truth for route unlock logic
 */

export interface RouteRequirement {
  id: string;
  minScore: number;
  minMiles: number;
}

export const ROUTE_REQUIREMENTS: Record<string, RouteRequirement> = {
  'content-demandgen': { id: 'content-demandgen', minScore: 40, minMiles: 1800 },
  'content-seo': { id: 'content-seo', minScore: 40, minMiles: 2100 },
  'content-abm': { id: 'content-abm', minScore: 60, minMiles: 1200 },
  'social-video': { id: 'social-video', minScore: 25, minMiles: 1500 },
  'demandgen-ops': { id: 'demandgen-ops', minScore: 50, minMiles: 900 },
  'ai-sales': { id: 'ai-sales', minScore: 70, minMiles: 2200 },
  'seo-growth': { id: 'seo-growth', minScore: 55, minMiles: 1600 },
} as const;

/**
 * Get route requirement by ID
 */
export const getRouteRequirement = (routeId: string): RouteRequirement | undefined => {
  return ROUTE_REQUIREMENTS[routeId];
};

/**
 * Get all route requirements as array
 */
export const getAllRouteRequirements = (): RouteRequirement[] => {
  return Object.values(ROUTE_REQUIREMENTS);
};

