import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useUser, PLANE_LEVELS } from '../context/UserContext';
import { getRecommendedScenarios } from '../data/staticData';
import { trackPageView, trackEvent } from '../utils/analytics';
import { calculateScoreBreakdown } from '../utils/scoreCalculations';
import { SCORE_WEIGHTS } from '../constants/scoring';
import { logger } from '../utils/logger';
import { 
  Clock, Loader2, Linkedin, Twitter, Download, Share2, ArrowRight, Layers, Gauge, AlertCircle, Database, TrendingUp, CheckCircle2, Sparkles, Zap, X
} from 'lucide-react';
import { ScoreChart } from '../components/ScoreChart';
import { REAOPieChart } from '../components/REAOPieChart';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { 
    combinedScore, 
    planeLevel, 
    flightMiles,
    readinessScore,
    efficiencyScore,
    alignmentScore,
    opportunityScore,
    assessmentResponses,
    techStack,
    profile,
    unlockedRoutes,
    getAssessmentHistory
  } = useUser();

  const [isRevealing, setIsRevealing] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Check completion status
  const hasCompletedTechStack = techStack.length > 0;
  const hasCompletedDeepDive = useMemo(() => {
    const history = getAssessmentHistory();
    return history.some(entry => entry.assessmentType === 'deep');
  }, [getAssessmentHistory]);

  // Track page view
  useEffect(() => {
    trackPageView('/results');
  }, []);

  // Check for assessment data on mount
  useEffect(() => {
    try {
      if (assessmentResponses.length === 0) {
        // Check localStorage as fallback
        const assessmentData = localStorage.getItem('assessmentResults');
        if (!assessmentData) {
          navigate('/assessment');
          return;
        }
        
        try {
          const results = JSON.parse(assessmentData);
          if (!results || !results.responses || results.responses.length === 0) {
            navigate('/assessment');
            return;
          }
        } catch (e) {
          logger.error('Failed to parse assessment results:', e);
          navigate('/assessment');
          return;
        }
      }
      setIsLoading(false);
    } catch (err) {
      logger.error('Error loading results:', err);
      setError('Failed to load your results. Please try taking the assessment again.');
      setIsLoading(false);
    }
  }, [assessmentResponses, navigate]);

  // Dramatic reveal animation (must be before early returns to follow Rules of Hooks)
  useEffect(() => {
    if (!isLoading && assessmentResponses.length > 0 && !error) {
      const timer1 = setTimeout(() => {
        setIsRevealing(false);
      }, 2000);
      
      const timer2 = setTimeout(() => {
        setShowContent(true);
      }, 2200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLoading, assessmentResponses.length, error]);

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  // Check if this is a Deep Dive assessment (25 questions)
  const isDeepDive = assessmentResponses.length >= 15;
  
  // Get recommended scenarios
  const recommendedScenarios = useMemo(() => {
    const scenarios = getRecommendedScenarios(
      profile?.industry,
      profile?.companySize,
      combinedScore,
      flightMiles
    );
    return scenarios.slice(0, 3);
  }, [profile, combinedScore, flightMiles]);

  // Calculate score breakdown
  const scoreBreakdown = useMemo(() => {
    if (assessmentResponses.length === 0) return null;
    return calculateScoreBreakdown(assessmentResponses, techStack);
  }, [assessmentResponses, techStack]);
  
  // Calculate category breakdowns for Deep Dive
  const categoryBreakdowns = useMemo(() => {
    if (!isDeepDive || assessmentResponses.length === 0) return null;
    
    const grouped: Record<string, { total: number; count: number; avg: number }> = {};
    assessmentResponses.forEach(response => {
      if (!grouped[response.category]) {
        grouped[response.category] = { total: 0, count: 0, avg: 0 };
      }
      grouped[response.category].total += response.score;
      grouped[response.category].count += 1;
    });
    
    // Calculate averages
    Object.keys(grouped).forEach(category => {
      grouped[category].avg = Math.round(grouped[category].total / grouped[category].count);
    });
    
    // Sort by average score (descending)
    return Object.entries(grouped)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.avg - a.avg);
  }, [isDeepDive, assessmentResponses]);

  // Show loading state while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Results...</h2>
          <p className="text-slate-400">Please wait while we prepare your results.</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-lg border border-red-500/50" role="alert">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-bold text-white mb-2 text-center">Error Loading Results</h2>
          <p className="text-slate-400 text-center mb-4">{error}</p>
          <p className="text-sm text-slate-500 text-center mb-6">
            Your assessment data may have been cleared. You can retake the assessment to generate new results.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/assessment')}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px]"
              aria-label="Retake the assessment to generate new results"
            >
              Retake Assessment
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px]"
              aria-label="Return to home page"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if no assessment completed
  if (assessmentResponses.length === 0) {
    return <Navigate to="/assessment" replace />;
  }

  const currentPlaneLevel = PLANE_LEVELS.find(l => 
    combinedScore >= l.minScore && combinedScore <= l.maxScore
  ) || PLANE_LEVELS[0];

  // REAO Metrics with circular progress
  const reaoMetrics = [
    {
      name: 'Readiness',
      score: readinessScore,
      color: readinessScore >= 75 ? '#10b981' : readinessScore >= 50 ? '#f59e0b' : '#ef4444',
      description: 'Strategic planning and team capabilities',
    },
    {
      name: 'Efficiency',
      score: efficiencyScore,
      color: efficiencyScore >= 75 ? '#10b981' : efficiencyScore >= 50 ? '#f59e0b' : '#ef4444',
      description: 'Operations, tech stack, and process optimization',
    },
    {
      name: 'Alignment',
      score: alignmentScore,
      color: alignmentScore >= 75 ? '#10b981' : alignmentScore >= 50 ? '#f59e0b' : '#ef4444',
      description: 'Cross-functional coordination and sales alignment',
    },
    {
      name: 'Opportunity',
      score: opportunityScore,
      color: '#22d3ee',
      description: 'Growth potential and market opportunities',
    },
  ];

  // Social share functions
  const handleShare = async () => {
    const shareText = `I'm a ${planeLevel}! My marketing altitude is ${combinedScore}/100. What's yours?`;
    const shareUrl = window.location.href;

    trackEvent('share_clicked', { method: 'native' });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Marketing Flight Planner Results',
          text: shareText,
          url: shareUrl,
        });
        trackEvent('share_completed', { method: 'native' });
      } catch (err) {
        logger.error('Error sharing', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        trackEvent('share_completed', { method: 'clipboard' });
        // Show success feedback
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        logger.error('Clipboard copy failed:', err);
      }
    }
  };

  const handleLinkedInShare = () => {
    trackEvent('share_clicked', { method: 'linkedin' });
    const shareText = encodeURIComponent(`I'm a ${planeLevel}! My marketing altitude is ${combinedScore}/100. What's your marketing altitude?`);
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&summary=${shareText}`, '_blank');
  };

  const handleTwitterShare = () => {
    trackEvent('share_clicked', { method: 'twitter' });
    const shareText = encodeURIComponent(`I'm a ${planeLevel}! My marketing altitude is ${combinedScore}/100. What's yours?`);
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
  };

  const handleDownloadPDF = () => {
    // For demo, just show an alert
    alert('PDF download feature coming soon! For now, you can take a screenshot of your results.');
  };

  // Loading screen
  if (isRevealing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Calculating Your Marketing Altitude...
          </h2>
          <p className="text-slate-400 text-lg">
            Analyzing your responses and preparing your personalized roadmap
          </p>
          <div className="mt-8 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-2000 animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 pb-12 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Result Card */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 sm:p-8 md:p-12 rounded-2xl text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="sr-only">Your Marketing Altitude Results</h1>
        <div className="text-white/80 text-xs sm:text-sm uppercase tracking-wider mb-2" aria-hidden="true">
          Your Marketing Altitude
          </div>
        <div 
          className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4 animate-in zoom-in duration-1000 delay-300"
          aria-label={`Your marketing altitude score is ${combinedScore} out of 100`}
          role="text"
        >
          {combinedScore}/100
        </div>
        <div className="text-xl sm:text-2xl text-white font-bold mb-2 flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl">{currentPlaneLevel.icon}</span>
          {planeLevel}
              </div>
        <div className="text-white/90 text-base sm:text-lg">
          You're ready to fly! {unlockedRoutes.length} route{unlockedRoutes.length !== 1 ? 's' : ''} unlocked.
        </div>
      </div>

      {/* REAO Metrics - Circular Progress */}
      <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">REAO Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reaoMetrics.map((metric, idx) => {
            const data = [
              { name: 'Score', value: metric.score, fill: metric.color },
              { name: 'Remaining', value: 100 - metric.score, fill: '#1e293b' }
            ];
            
            return (
              <div key={metric.name} className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">
                  {metric.name}
              </h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        aria-label={`${metric.name} score: ${metric.score} out of 100`}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold text-white">{metric.score}</div>
                      <div className="text-xs text-slate-500">/100</div>
            </div>
          </div>
        </div>
                <p className="text-xs text-slate-400">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Dive CTA for Quick Scan users */}
      {!isDeepDive && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Layers className="text-purple-300" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Add more data with Deep Dive</h3>
                <p className="text-slate-300 text-sm sm:text-base">
                  Get 15 additional questions with category-by-category analysis for a more accurate score and recommendations.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'results', action: 'deep_dive' });
                  navigate('/assessment/deep');
                }}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all active:scale-95 shadow-lg shadow-purple-500/25 min-h-[44px]"
              >
                Start Deep Dive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown for Deep Dive */}
      {isDeepDive && categoryBreakdowns && categoryBreakdowns.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Layers className="text-cyan-400" size={24} />
              </div>
              <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Category Breakdown</h2>
              <p className="text-slate-400 text-sm mt-1">Detailed analysis by marketing function</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBreakdowns.map(({ category, avg, count }) => {
              const getScoreColor = (score: number) => {
                if (score >= 75) return 'text-emerald-400';
                if (score >= 50) return 'text-yellow-400';
                return 'text-red-400';
              };
              
              const getBarColor = (score: number) => {
                if (score >= 75) return 'bg-emerald-500';
                if (score >= 50) return 'bg-yellow-500';
                return 'bg-red-500';
              };
              
              return (
                <div
                  key={category}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white pr-2">{category}</h3>
                    <span className={`text-lg font-bold ${getScoreColor(avg)} flex-shrink-0`}>
                      {avg}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-500 ${getBarColor(avg)}`}
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    {count} question{count !== 1 ? 's' : ''} answered
              </div>
            </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-cyan-400">Deep Dive Assessment:</span>{' '}
              You completed a comprehensive 25-question assessment covering {categoryBreakdowns.length} marketing categories. 
              This detailed breakdown helps identify specific areas for improvement.
            </p>
          </div>
        </div>
      )}

      {/* Tech Stack Contribution Section */}
      {scoreBreakdown && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-700 delay-600">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Database className="text-cyan-400" size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Score Breakdown</h2>
          </div>

          {!scoreBreakdown.hasTechStack ? (
            // CTA to complete tech stack
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="text-cyan-400" size={20} />
                    Boost Your Score with Tech Stack Audit
                  </h3>
                  <p className="text-slate-300 mb-3">
                    Your current score is based only on your assessment ({scoreBreakdown.assessmentScore}/100). 
                    Complete the Tech Stack Audit to add up to {Math.round(SCORE_WEIGHTS.TECH_STACK * 100)}% more points to your combined score!
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-slate-400">Current: {scoreBreakdown.assessmentContribution} points (100% assessment)</span>
                    </div>
                <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-slate-400">Potential: +{Math.round(SCORE_WEIGHTS.TECH_STACK * 100)}% from tech stack</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    trackEvent('cta_clicked', { location: 'results', action: 'complete_tech_stack' });
                    navigate('/tech-stack');
                  }}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap min-h-[44px]"
                >
                  <Database className="w-5 h-5" />
                  Complete Tech Stack
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // Show breakdown with tech stack
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-2">Assessment Score</div>
                  <div className="text-3xl font-bold text-white mb-1">{scoreBreakdown.assessmentScore}/100</div>
                  <div className="text-xs text-slate-500">{Math.round(SCORE_WEIGHTS.ASSESSMENT * 100)}% weight</div>
                  <div className="mt-3 w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full transition-all duration-500"
                      style={{ width: `${scoreBreakdown.assessmentScore}%` }}
                    />
      </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-2">Tech Stack Score</div>
                  <div className="text-3xl font-bold text-white mb-1">{scoreBreakdown.techStackScore}/100</div>
                  <div className="text-xs text-slate-500">{Math.round(SCORE_WEIGHTS.TECH_STACK * 100)}% weight</div>
                  <div className="mt-3 w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${scoreBreakdown.techStackScore || 0}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-xl p-4">
                  <div className="text-sm text-cyan-300 mb-2">Combined Score</div>
                  <div className="text-3xl font-bold text-white mb-1">{combinedScore}/100</div>
                  <div className="text-xs text-cyan-200">Final altitude</div>
                  <div className="mt-3 w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                      style={{ width: `${combinedScore}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Assessment Contribution:</span>
                  <span className="text-cyan-400 font-semibold">{scoreBreakdown.assessmentContribution} points</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-slate-400">Tech Stack Contribution:</span>
                  <span className="text-blue-400 font-semibold">+{scoreBreakdown.techContribution} points</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-slate-700">
                  <span className="text-white font-semibold">Total Combined Score:</span>
                  <span className="text-white font-bold text-lg">{combinedScore}/100</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Database className="w-4 h-4" />
                <span>You've completed the Tech Stack Audit with {techStack.length} tool{techStack.length !== 1 ? 's' : ''}</span>
                <button
                  onClick={() => navigate('/tech-stack')}
                  className="text-cyan-400 hover:text-cyan-300 underline ml-auto focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
                  aria-label="Update your tech stack selection"
                >
                  Update Tech Stack
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Personalized Scenarios */}
      {recommendedScenarios.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom duration-700 delay-700">
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Recommended Next Steps
          </h2>
          <p className="text-slate-400 mb-8">
            Based on your score, here are 3 scenarios tailored to your current maturity level:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {recommendedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => navigate(`/scenarios/${scenario.id}`)}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer group"
              >
                <h3 className="text-xl font-bold text-cyan-400 mb-3 group-hover:text-cyan-300">
                  {scenario.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {scenario.problem || scenario.challenge || scenario.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{scenario.estimatedDuration || scenario.duration}</span>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-900">
        <button 
          onClick={() => {
            trackEvent('cta_clicked', { location: 'results', action: 'view_journey_map' });
            navigate('/journey-map');
          }}
          className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="View your journey map with unlocked routes"
        >
          View Journey Map
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
        <button 
          onClick={() => {
            trackEvent('cta_clicked', { location: 'results', action: 'what_if_simulator' });
            navigate('/simulator');
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Explore what-if scenarios to project your score"
        >
          See What-If Scenarios
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Download your results as PDF report"
        >
          <Download className="w-5 h-5" aria-hidden="true" />
          Download Report
        </button>
        <button 
          onClick={handleShare}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Share your results on social media"
        >
          <Share2 className="w-5 h-5" aria-hidden="true" />
          Share Results
        </button>
      </div>

      {/* Social Share Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-1000">
        <button
          onClick={handleLinkedInShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Share your results on LinkedIn"
        >
          <Linkedin className="w-5 h-5" aria-hidden="true" />
          Share on LinkedIn
        </button>
        <button
          onClick={handleTwitterShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Share your results on Twitter"
        >
          <Twitter className="w-5 h-5" aria-hidden="true" />
          Share on Twitter
        </button>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-12">
        <h3 className="text-xl font-bold text-white mb-4">Coming Soon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Layers className="text-purple-400" size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold">Deep Dive Assessment</h4>
                <p className="text-xs text-slate-400">Comprehensive 25-question analysis</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
              Coming Soon
            </span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Gauge className="text-blue-400" size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold">What-If Simulator</h4>
                <p className="text-xs text-slate-400">Project your score with different inputs</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          aria-label="Show quick actions to enhance your results"
        >
          {showQuickActions ? (
            <X className="w-6 h-6" />
          ) : (
            <Sparkles className="w-6 h-6 animate-pulse" />
          )}
        </button>

        {/* Quick Actions Menu */}
        {showQuickActions && (
          <div className="absolute bottom-20 right-0 bg-slate-900 rounded-lg shadow-2xl border border-slate-700 p-4 w-80 z-40 animate-in fade-in slide-in-from-bottom">
            <h4 className="font-bold text-white mb-3 text-lg">Get Better Results</h4>
            <div className="space-y-2">
              {!hasCompletedTechStack && (
                <Link
                  to="/tech-stack"
                  onClick={() => setShowQuickActions(false)}
                  className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-purple-500 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4 text-purple-400" />
                    <div className="font-semibold text-purple-400">+ Tech Stack Audit</div>
                  </div>
                  <div className="text-xs text-slate-400">Boost score by 30%</div>
                </Link>
              )}
              {!hasCompletedDeepDive && (
                <Link
                  to="/assessment/deep"
                  onClick={() => setShowQuickActions(false)}
                  className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <div className="font-semibold text-blue-400">+ Deep Dive</div>
                  </div>
                  <div className="text-xs text-slate-400">Get comprehensive analysis</div>
                </Link>
              )}
              <Link
                to="/simulator"
                onClick={() => setShowQuickActions(false)}
                className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-green-500 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-green-400" />
                  <div className="font-semibold text-green-400">+ What-If Simulator</div>
                </div>
                <div className="text-xs text-slate-400">Project improvements</div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
