import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from 'react';
import { SCORE_WEIGHTS } from '../constants/scoring';
import { ROUTE_REQUIREMENTS } from '../constants/routeRequirements';
import { logger } from '../utils/logger';
import { storageCache } from '../utils/storageCache';

// ============= TYPES =============
export interface UserProfile {
  role: string;
  industry: string;
  companySize: string;
  companyType: string;
  revenue: string;
  goals: string[];
  // Deep dive fields (optional)
  teamSize?: number;
  marketingBudget?: string;
  productCount?: number;
  salesCycle?: string;
  dealSize?: string;
  targetSegments?: string[];
}

export interface AssessmentResponse {
  questionId: number;
  category: string;
  score: number; // 0-100
}

export interface TechTool {
  name: string;
  category: string;
  utilizationScore: number; // 1-10
}

export interface RouteStatus {
  routeId: string;
  status: 'locked' | 'partial' | 'unlocked';
  requiredScore: number;
  currentProgress: number;
}

export interface AssessmentHistoryEntry {
  timestamp: number;
  combinedScore: number;
  planeLevel: string;
  flightMiles: number;
  unlockedRoutes: string[];
  readinessScore: number;
  efficiencyScore: number;
  alignmentScore: number;
  opportunityScore: number;
  assessmentType: 'quick' | 'deep';
  questionCount: number;
}

export interface UserState {
  profile: UserProfile | null;
  assessmentResponses: AssessmentResponse[];
  techStack: TechTool[];
  
  // Calculated values
  combinedScore: number;
  planeLevel: string;
  flightMiles: number;
  
  // REAO breakdown
  readinessScore: number;
  efficiencyScore: number;
  alignmentScore: number;
  opportunityScore: number;
  
  // Journey state
  unlockedRoutes: string[];
  currentJourney: {
    from: string;
    to: string;
    purpose: string;
  } | null;
  
  // Timestamps
  assessmentTimestamp: number | null;
  lastUpdateTimestamp: number | null;
  
  // Historical tracking
  assessmentHistory: AssessmentHistoryEntry[];
}

// ============= CONSTANTS =============
export const PLANE_LEVELS = [
  { minScore: 0, maxScore: 20, name: 'Grounded', icon: '🛬', color: '#ef4444' },
  { minScore: 21, maxScore: 40, name: 'Puddle Jumper', icon: '🛩️', color: '#f59e0b' },
  { minScore: 41, maxScore: 60, name: 'Regional Jet', icon: '✈️', color: '#eab308' },
  { minScore: 61, maxScore: 80, name: 'Commercial Jet', icon: '🛫', color: '#22c55e' },
  { minScore: 81, maxScore: 100, name: 'Airbus 380', icon: '🚀', color: '#06b6d4' },
];

// ============= CONTEXT =============
interface UserContextType extends UserState {
  // Profile actions
  setProfile: (profile: UserProfile) => void;
  
  // Assessment actions
  submitQuickAssessment: (responses: AssessmentResponse[]) => void;
  submitDeepAssessment: (responses: AssessmentResponse[]) => void;
  
  // Tech Stack actions
  setTechStack: (tools: TechTool[]) => void;
  
  // Journey actions
  setCurrentJourney: (from: string, to: string, purpose: string) => void;
  
  // Utility
  resetData: () => void;
  getRouteStatus: (routeId: string) => RouteStatus;
  
  // History
  getAssessmentHistory: () => AssessmentHistoryEntry[];
  clearHistory: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============= INITIAL STATE =============
const INITIAL_STATE: UserState = {
  profile: null,
  assessmentResponses: [],
  techStack: [],
  combinedScore: 0,
  planeLevel: 'Grounded',
  flightMiles: 0,
  readinessScore: 0,
  efficiencyScore: 0,
  alignmentScore: 0,
  opportunityScore: 100, // Always 100 - represents potential
  unlockedRoutes: [],
  currentJourney: null,
  assessmentTimestamp: null,
  lastUpdateTimestamp: null,
  assessmentHistory: [],
};

// ============= PROVIDER =============
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserState>(INITIAL_STATE);
  const isInitialMount = useRef(true);

  // Load from localStorage on mount (with caching)
  useEffect(() => {
    const stored = storageCache.getItem<UserState>('flightPlannerState');
    if (stored) {
      try {
        setState(stored);
      } catch (e) {
        logger.error('Failed to parse stored state:', e);
      }
    }
    isInitialMount.current = false;
  }, []);

  // Save to localStorage whenever state changes (debounced and batched)
  useEffect(() => {
    // Skip save on initial mount
    if (isInitialMount.current) return;
    
    // Use storageCache for batched, debounced writes
    storageCache.setItem('flightPlannerState', state);
  }, [state]);

  // ============= CALCULATION FUNCTIONS =============
  
  const calculateCombinedScore = (
    assessmentResponses: AssessmentResponse[],
    techStack: TechTool[]
  ): number => {
    if (assessmentResponses.length === 0) return 0;

    // Assessment score (average of all responses)
    const assessmentAvg = 
      assessmentResponses.reduce((sum, r) => sum + r.score, 0) / assessmentResponses.length;

    // Tech stack score (if present)
    let techAvg = 0;
    if (techStack.length > 0) {
      techAvg = techStack.reduce((sum, t) => sum + (t.utilizationScore * 10), 0) / techStack.length;
    }

    // Weighted combination: 70% assessment, 30% tech stack (if present)
    const combined = techStack.length > 0
      ? (assessmentAvg * SCORE_WEIGHTS.ASSESSMENT) + (techAvg * SCORE_WEIGHTS.TECH_STACK)
      : assessmentAvg;

    return Math.round(combined);
  };

  const calculateREAO = (
    combinedScore: number,
    assessmentResponses: AssessmentResponse[]
  ) => {
    // Extract specific category scores for more accurate REAO
    const categoryScores: Record<string, number> = {};
    
    assessmentResponses.forEach(response => {
      if (!categoryScores[response.category]) {
        categoryScores[response.category] = response.score;
      }
    });

    // Readiness: Strategy, Planning, Team capabilities
    const readiness = Math.round(combinedScore * 0.9);

    // Efficiency: Operations, Tech Stack, Process
    const efficiency = Math.round(combinedScore * 1.1 > 100 ? 100 : combinedScore * 1.1);

    // Alignment: Cross-functional, Sales/Marketing alignment
    const alignment = Math.round(combinedScore * 0.8);

    return {
      readinessScore: readiness,
      efficiencyScore: efficiency,
      alignmentScore: alignment,
      opportunityScore: 100,
    };
  };

  const calculatePlaneLevel = (score: number): string => {
    const level = PLANE_LEVELS.find(l => score >= l.minScore && score <= l.maxScore);
    return level?.name || 'Grounded';
  };

  const calculateFlightMiles = (
    combinedScore: number,
    assessmentResponses: AssessmentResponse[],
    techStack: TechTool[]
  ): number => {
    let miles = combinedScore * 100; // Base miles from score
    
    if (assessmentResponses.length > 0) miles += 500; // Bonus for completing assessment
    if (techStack.length > 0) miles += 300; // Bonus for tech stack audit
    
    return miles;
  };

  const calculateUnlockedRoutes = (combinedScore: number, flightMiles: number): string[] => {
    // Route unlock logic based on score and miles
    const unlocked: string[] = [];
    
    // Define route requirements (these match the routes in staticData)
    Object.values(ROUTE_REQUIREMENTS).forEach(route => {
      if (combinedScore >= route.minScore && flightMiles >= route.minMiles) {
        unlocked.push(route.id);
      }
    });

    return unlocked;
  };

  // ============= ACTION HANDLERS =============
  const setProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  }, []);

  const submitQuickAssessment = useCallback((responses: AssessmentResponse[]) => {
    setState(prev => {
      const combinedScore = calculateCombinedScore(responses, prev.techStack);
    const reao = calculateREAO(combinedScore, responses);
    const planeLevel = calculatePlaneLevel(combinedScore);
      const flightMiles = calculateFlightMiles(combinedScore, responses, prev.techStack);
    const unlockedRoutes = calculateUnlockedRoutes(combinedScore, flightMiles);
    const now = Date.now();

      // Create history entry
      const historyEntry: AssessmentHistoryEntry = {
        timestamp: now,
        combinedScore,
        planeLevel,
        flightMiles,
        unlockedRoutes: [...unlockedRoutes],
        readinessScore: reao.readinessScore,
        efficiencyScore: reao.efficiencyScore,
        alignmentScore: reao.alignmentScore,
        opportunityScore: reao.opportunityScore,
        assessmentType: 'quick',
        questionCount: responses.length,
      };

      return {
      ...prev,
      assessmentResponses: responses,
      combinedScore,
      planeLevel,
      flightMiles,
      unlockedRoutes,
      assessmentTimestamp: prev.assessmentTimestamp || now,
      lastUpdateTimestamp: now,
        assessmentHistory: [...prev.assessmentHistory, historyEntry],
      ...reao,
      };
    });
  }, []);

  const submitDeepAssessment = useCallback((responses: AssessmentResponse[]) => {
    setState(prev => {
      const combinedScore = calculateCombinedScore(responses, prev.techStack);
      const reao = calculateREAO(combinedScore, responses);
      const planeLevel = calculatePlaneLevel(combinedScore);
      const flightMiles = calculateFlightMiles(combinedScore, responses, prev.techStack);
      const unlockedRoutes = calculateUnlockedRoutes(combinedScore, flightMiles);
      const now = Date.now();

      // Create history entry
      const historyEntry: AssessmentHistoryEntry = {
        timestamp: now,
        combinedScore,
        planeLevel,
        flightMiles,
        unlockedRoutes: [...unlockedRoutes],
        readinessScore: reao.readinessScore,
        efficiencyScore: reao.efficiencyScore,
        alignmentScore: reao.alignmentScore,
        opportunityScore: reao.opportunityScore,
        assessmentType: 'deep',
        questionCount: responses.length,
      };

      return {
        ...prev,
        assessmentResponses: responses,
        combinedScore,
        planeLevel,
        flightMiles,
        unlockedRoutes,
        assessmentTimestamp: prev.assessmentTimestamp || now,
        lastUpdateTimestamp: now,
        assessmentHistory: [...prev.assessmentHistory, historyEntry],
        ...reao,
      };
    });
  }, []);

  const setTechStack = useCallback((tools: TechTool[]) => {
    setState(prev => {
      const combinedScore = calculateCombinedScore(prev.assessmentResponses, tools);
      const reao = calculateREAO(combinedScore, prev.assessmentResponses);
    const planeLevel = calculatePlaneLevel(combinedScore);
      const flightMiles = calculateFlightMiles(combinedScore, prev.assessmentResponses, tools);
    const unlockedRoutes = calculateUnlockedRoutes(combinedScore, flightMiles);

      return {
      ...prev,
      techStack: tools,
      combinedScore,
      planeLevel,
      flightMiles,
      unlockedRoutes,
      lastUpdateTimestamp: Date.now(),
      ...reao,
  };
    });
  }, []);

  const setCurrentJourney = useCallback((from: string, to: string, purpose: string) => {
    setState(prev => ({
      ...prev,
      currentJourney: { from, to, purpose },
    }));
  }, []);

  const getRouteStatus = useCallback((routeId: string): RouteStatus => {
    const requirements = ROUTE_REQUIREMENTS[routeId];
    if (!requirements) {
      return {
        routeId,
        status: 'locked',
        requiredScore: 0,
        currentProgress: 0,
      };
    }

    // Use state directly here since this is a getter function
    const scoreProgress = (state.combinedScore / requirements.minScore) * 100;
    const milesProgress = (state.flightMiles / requirements.minMiles) * 100;
    const currentProgress = Math.min(scoreProgress, milesProgress);

    let status: 'locked' | 'partial' | 'unlocked' = 'locked';
    if (currentProgress >= 100) status = 'unlocked';
    else if (currentProgress >= 70) status = 'partial';

    return {
      routeId,
      status,
      requiredScore: requirements.minScore,
      currentProgress: Math.round(currentProgress),
    };
  }, [state.combinedScore, state.flightMiles]);

  const resetData = useCallback(() => {
    setState(INITIAL_STATE);
    storageCache.removeItem('flightPlannerState');
  }, []);

  const getAssessmentHistory = useCallback((): AssessmentHistoryEntry[] => {
    return state.assessmentHistory;
  }, [state.assessmentHistory]);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, assessmentHistory: [] }));
  }, []);

  // ============= CONTEXT VALUE =============
  const value = useMemo<UserContextType>(() => ({
    ...state,
    setProfile,
    submitQuickAssessment,
    submitDeepAssessment,
    setTechStack,
    setCurrentJourney,
    getRouteStatus,
    resetData,
    getAssessmentHistory,
    clearHistory,
  }), [
    state,
    setProfile,
    submitQuickAssessment,
    submitDeepAssessment,
    setTechStack,
    setCurrentJourney,
    getRouteStatus,
    resetData,
    getAssessmentHistory,
    clearHistory,
  ]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ============= HOOK =============
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
