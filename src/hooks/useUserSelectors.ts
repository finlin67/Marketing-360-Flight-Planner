/**
 * Selector hooks for UserContext to prevent unnecessary re-renders
 * Only components using changed values will re-render
 */

import { useMemo } from 'react';
import { useUser } from '../context/UserContext';

/**
 * Hook to get only the combined score
 * Component will only re-render when combinedScore changes
 */
export const useCombinedScore = () => {
  const context = useUser();
  return useMemo(() => context.combinedScore, [context.combinedScore]);
};

/**
 * Hook to get only the plane level
 * Component will only re-render when planeLevel changes
 */
export const usePlaneLevel = () => {
  const context = useUser();
  return useMemo(() => context.planeLevel, [context.planeLevel]);
};

/**
 * Hook to get only flight miles
 * Component will only re-render when flightMiles changes
 */
export const useFlightMiles = () => {
  const context = useUser();
  return useMemo(() => context.flightMiles, [context.flightMiles]);
};

/**
 * Hook to get only REAO scores
 * Component will only re-render when any REAO score changes
 */
export const useREAOScores = () => {
  const context = useUser();
  return useMemo(() => ({
    readiness: context.readinessScore,
    efficiency: context.efficiencyScore,
    alignment: context.alignmentScore,
    opportunity: context.opportunityScore,
  }), [
    context.readinessScore,
    context.efficiencyScore,
    context.alignmentScore,
    context.opportunityScore,
  ]);
};

/**
 * Hook to get only unlocked routes
 * Component will only re-render when unlockedRoutes array changes
 */
export const useUnlockedRoutes = () => {
  const context = useUser();
  return useMemo(() => context.unlockedRoutes, [context.unlockedRoutes]);
};

/**
 * Hook to get only assessment responses
 * Component will only re-render when assessmentResponses array changes
 */
export const useAssessmentResponses = () => {
  const context = useUser();
  return useMemo(() => context.assessmentResponses, [context.assessmentResponses]);
};

/**
 * Hook to get only tech stack
 * Component will only re-render when techStack array changes
 */
export const useTechStack = () => {
  const context = useUser();
  return useMemo(() => context.techStack, [context.techStack]);
};

/**
 * Hook to get only profile
 * Component will only re-render when profile changes
 */
export const useProfile = () => {
  const context = useUser();
  return useMemo(() => context.profile, [context.profile]);
};

