// Simple client-side analytics tracking
// All data stored in localStorage - no external services

import { logger } from './logger';
import { storageCache } from './storageCache';

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  page?: string;
  score?: number;
  planeLevel?: string;
  location?: string;
  action?: string;
  method?: string;
  [key: string]: string | number | boolean | undefined; // Allow additional properties with proper types
}

const MAX_EVENTS = 1000; // Limit storage to prevent localStorage bloat
const STORAGE_KEY = 'flight_planner_analytics';

/**
 * Get all analytics events from localStorage
 */
export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  try {
    const stored = storageCache.getItem<AnalyticsEvent[]>(STORAGE_KEY);
    if (!stored) return [];
    return stored;
  } catch (e) {
    logger.error('Failed to read analytics:', e);
    return [];
  }
};

/**
 * Save analytics events to localStorage
 */
const saveAnalyticsEvents = (events: AnalyticsEvent[]): void => {
  try {
    // Limit to last MAX_EVENTS to prevent localStorage bloat
    const limitedEvents = events.slice(-MAX_EVENTS);
    storageCache.setItem(STORAGE_KEY, limitedEvents, true); // Immediate write for analytics
  } catch (e) {
    logger.error('Failed to save analytics:', e);
    // If storage is full, try to clear old events
    if (e instanceof DOMException && e.code === 22) {
      try {
        const recentEvents = events.slice(-500);
        storageCache.setItem(STORAGE_KEY, recentEvents, true); // Immediate write for analytics
      } catch (e2) {
        logger.error('Failed to save even after cleanup:', e2);
      }
    }
  }
};

/**
 * Track a page view
 */
export const trackPageView = (page: string): void => {
  const events = getAnalyticsEvents();
  events.push({
    type: 'pageview',
    page,
    timestamp: Date.now(),
  });
  saveAnalyticsEvents(events);
};

/**
 * Track a custom event
 */
export const trackEvent = (eventType: string, data: Record<string, string | number | boolean> = {}): void => {
  const events = getAnalyticsEvents();
  events.push({
    type: eventType,
    timestamp: Date.now(),
    ...data,
  });
  saveAnalyticsEvents(events);
};

/**
 * Clear all analytics data
 */
export const clearAnalytics = (): void => {
  storageCache.removeItem(STORAGE_KEY);
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = () => {
  const events = getAnalyticsEvents();
  
  const pageviews = events.filter(e => e.type === 'pageview');
  const assessments = events.filter(e => e.type === 'assessment_completed');
  const ctaClicks = events.filter(e => e.type === 'cta_clicked');
  
  // Calculate conversion rate (assessments / pageviews to home)
  const homePageviews = pageviews.filter(e => e.page === '/' || e.page === '/#/').length;
  const conversionRate = homePageviews > 0 
    ? ((assessments.length / homePageviews) * 100).toFixed(1)
    : '0.0';
  
  // Get most popular pages
  const pageCounts: Record<string, number> = {};
  pageviews.forEach(e => {
    const page = e.page || 'unknown';
    pageCounts[page] = (pageCounts[page] || 0) + 1;
  });
  const popularPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));
  
  // Get CTA click locations
  const ctaLocations: Record<string, number> = {};
  ctaClicks.forEach(e => {
    const location = e.location || 'unknown';
    ctaLocations[location] = (ctaLocations[location] || 0) + 1;
  });
  
  // Average assessment score
  const avgScore = assessments.length > 0
    ? (assessments.reduce((sum, e) => sum + (e.score || 0), 0) / assessments.length).toFixed(1)
    : '0';
  
  // Average plane levels
  const planeLevelCounts: Record<string, number> = {};
  assessments.forEach(e => {
    const level = e.planeLevel || 'unknown';
    planeLevelCounts[level] = (planeLevelCounts[level] || 0) + 1;
  });
  
  return {
    totalPageviews: pageviews.length,
    totalAssessments: assessments.length,
    totalCtaClicks: ctaClicks.length,
    conversionRate,
    popularPages,
    ctaLocations,
    avgScore,
    planeLevelCounts,
    totalEvents: events.length,
    firstEvent: events.length > 0 ? new Date(events[0].timestamp) : null,
    lastEvent: events.length > 0 ? new Date(events[events.length - 1].timestamp) : null,
  };
};

