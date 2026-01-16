import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, PLANE_LEVELS } from '../context/UserContext';
import { ROUTES, CITIES } from '../data/staticData';
import { 
  Plane, CheckCircle2, Calendar, Clock, TrendingUp, 
  ArrowRight, Map, Sliders, BookOpen, Zap 
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export const OperationsCenter: React.FC = () => {
  const navigate = useNavigate();
  const {
    combinedScore,
    planeLevel,
    flightMiles,
    unlockedRoutes,
    assessmentResponses,
    techStack,
    assessmentTimestamp,
    lastUpdateTimestamp,
  } = useUser();

  const hasCompletedAssessment = assessmentResponses.length > 0;

  const currentPlaneLevel = PLANE_LEVELS.find(
    l => combinedScore >= l.minScore && combinedScore <= l.maxScore
  ) || PLANE_LEVELS[0];

  // Get unlocked route details
  const unlockedRouteDetails = useMemo(() => {
    return ROUTES.filter(route => unlockedRoutes.includes(route.id)).map(route => {
      const fromCity = CITIES.find(c => c.id === route.from);
      const toCity = CITIES.find(c => c.id === route.to);
      return {
        ...route,
        fromCity: fromCity?.name || route.from,
        toCity: toCity?.name || route.to,
        fromFunction: fromCity?.function || '',
        toFunction: toCity?.function || '',
      };
    });
  }, [unlockedRoutes]);

  // Calculate tech stack maturity
  const techStackMaturity = useMemo(() => {
    if (techStack.length === 0) return null;
    const avg = techStack.reduce((sum, tool) => sum + tool.utilizationScore, 0) / techStack.length;
    return Math.round(avg * 10) / 10;
  }, [techStack]);

  // Get assessment completion date
  const assessmentDate = assessmentTimestamp ? new Date(assessmentTimestamp) : null;
  
  // Calculate days since last update
  const daysSinceUpdate = lastUpdateTimestamp
    ? Math.floor((Date.now() - lastUpdateTimestamp) / (1000 * 60 * 60 * 24))
    : null;

  // If no assessment completed, show get started prompt
  if (!hasCompletedAssessment) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-full mb-4">
            <Plane className="text-cyan-400 h-16 w-16 transform -rotate-45" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Operations Center
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Complete your marketing assessment to unlock your operations dashboard
          </p>
          <button
            onClick={() => navigate('/assessment/quick')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <Zap size={20} />
            Take Your First Assessment
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="text-center pt-4 pb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
          Operations Center
        </h1>
        <p className="text-lg text-slate-400">
          Your marketing command dashboard
        </p>
      </div>

      {/* 4-Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Current Status (top-left) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Plane className="text-cyan-400" size={20} />
            Current Status
          </h2>
          
          <div className="space-y-6">
            {/* Plane Level */}
            <div className="flex items-center gap-4">
              <div className="text-4xl">{currentPlaneLevel.icon}</div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Plane Level
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: currentPlaneLevel.color }}
                >
                  {planeLevel}
                </div>
              </div>
            </div>

            {/* Mini Altimeter */}
            <div className="relative w-32 h-32 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={8}
                  data={[
                    { score: 100, fill: '#1e293b' },
                    { score: combinedScore, fill: currentPlaneLevel.color }
                  ]}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="score" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                <span className="text-3xl font-bold text-white">{combinedScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>

            {/* Flight Miles */}
            <div className="text-center pt-4 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
                Flight Miles
              </div>
              <div className="text-2xl font-mono font-bold text-cyan-400">
                {flightMiles.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Quick Stats (top-right) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-cyan-400" size={20} />
            Quick Stats
          </h2>
          
          <div className="space-y-4">
            {/* Total Routes Unlocked */}
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={18} />
                <span className="text-sm text-slate-300">Routes Unlocked</span>
              </div>
              <span className="text-xl font-bold text-white">{unlockedRoutes.length}</span>
            </div>

            {/* Assessment Completion Date */}
            {assessmentDate && (
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="text-cyan-400" size={18} />
                  <span className="text-sm text-slate-300">Assessment Date</span>
                </div>
                <span className="text-sm font-medium text-slate-300">
                  {assessmentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Days Since Last Update */}
            {daysSinceUpdate !== null && (
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="text-yellow-400" size={18} />
                  <span className="text-sm text-slate-300">Days Since Update</span>
                </div>
                <span className="text-sm font-medium text-slate-300">
                  {daysSinceUpdate} {daysSinceUpdate === 1 ? 'day' : 'days'}
                </span>
              </div>
            )}

            {/* Tech Stack Maturity */}
            {techStackMaturity !== null ? (
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sliders className="text-cyan-400" size={18} />
                  <span className="text-sm text-slate-300">Tech Stack Maturity</span>
                </div>
                <span className="text-xl font-bold text-cyan-400">
                  {techStackMaturity}/10
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg opacity-50">
                <div className="flex items-center gap-2">
                  <Sliders className="text-slate-500" size={18} />
                  <span className="text-sm text-slate-500">Tech Stack Maturity</span>
                </div>
                <span className="text-sm text-slate-500">Not assessed</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Unlocked Routes (bottom-left) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Map className="text-cyan-400" size={20} />
            Unlocked Routes
          </h2>
          
          {unlockedRouteDetails.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {unlockedRouteDetails.map((route) => (
                <div
                  key={route.id}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white mb-1">
                        {route.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {route.fromFunction} → {route.toFunction}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {route.fromCity} → {route.toCity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Map className="mx-auto mb-2 text-slate-600" size={32} />
              <p className="text-sm">No routes unlocked yet</p>
              <p className="text-xs mt-1">Complete your assessment to unlock routes</p>
            </div>
          )}
        </div>

        {/* Section 4: Quick Actions (bottom-right) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-cyan-400" size={20} />
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/assessment/quick')}
              className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition-all hover:border-cyan-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Zap className="text-cyan-400" size={18} />
                  </div>
                  <span className="font-medium text-white">Retake Assessment</span>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" size={18} />
              </div>
            </button>

            <button
              onClick={() => navigate('/journey-map')}
              className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition-all hover:border-cyan-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Map className="text-cyan-400" size={18} />
                  </div>
                  <span className="font-medium text-white">View Journey Map</span>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" size={18} />
              </div>
            </button>

            <button
              onClick={() => navigate('/tech-stack')}
              className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition-all hover:border-cyan-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Sliders className="text-cyan-400" size={18} />
                  </div>
                  <span className="font-medium text-white">Optimize Tech Stack</span>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" size={18} />
              </div>
            </button>

            <button
              onClick={() => navigate('/scenarios')}
              className="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition-all hover:border-cyan-500/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <BookOpen className="text-cyan-400" size={18} />
                  </div>
                  <span className="font-medium text-white">Explore Scenarios</span>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

