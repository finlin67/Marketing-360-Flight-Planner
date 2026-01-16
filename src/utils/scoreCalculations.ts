/**
 * Score calculation utilities
 * Shared logic for calculating score breakdowns
 */

import { SCORE_WEIGHTS } from '../constants/scoring';
import type { AssessmentResponse, TechTool } from '../context/UserContext';

export interface ScoreBreakdown {
  assessmentScore: number;
  techStackScore: number | null;
  assessmentContribution: number;
  techContribution: number;
  hasTechStack: boolean;
}

/**
 * Calculate score breakdown from assessment responses and tech stack
 */
export const calculateScoreBreakdown = (
  assessmentResponses: AssessmentResponse[],
  techStack: TechTool[]
): ScoreBreakdown => {
  if (assessmentResponses.length === 0) {
    return {
      assessmentScore: 0,
      techStackScore: null,
      assessmentContribution: 0,
      techContribution: 0,
      hasTechStack: false,
    };
  }
  
  const assessmentAvg = assessmentResponses.reduce((sum, r) => sum + r.score, 0) / assessmentResponses.length;
  
  let techAvg = 0;
  if (techStack.length > 0) {
    techAvg = techStack.reduce((sum, t) => sum + (t.utilizationScore * 10), 0) / techStack.length;
  }
  
  const assessmentContribution = techStack.length > 0 
    ? Math.round(assessmentAvg * SCORE_WEIGHTS.ASSESSMENT)
    : Math.round(assessmentAvg);
  
  const techContribution = techStack.length > 0
    ? Math.round(techAvg * SCORE_WEIGHTS.TECH_STACK)
    : 0;
  
  return {
    assessmentScore: Math.round(assessmentAvg),
    techStackScore: techStack.length > 0 ? Math.round(techAvg) : null,
    assessmentContribution,
    techContribution,
    hasTechStack: techStack.length > 0,
  };
};

