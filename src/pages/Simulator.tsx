import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, PLANE_LEVELS } from '../context/UserContext';
import { ROUTES, CITIES } from '../data/staticData';
import { SCORE_WEIGHTS } from '../constants/scoring';
import { ROUTE_REQUIREMENTS } from '../constants/routeRequirements';
import {
  Sliders, TrendingUp, DollarSign, Users, Wrench,
  ArrowRight, RefreshCw, CheckCircle2, AlertCircle,
  Lightbulb, Target, Zap, Map, Save, Download, Clock,
  Gauge, BarChart3, Sparkles
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface SimulatorInputs {
  // Assessment scores by category
  strategy: number;
  content: number;
  demand: number;
  sales: number;
  ops: number;
  tech: number;
  data: number;
  brand: number;
  journey: number;
  team: number;
  // Tech stack variables
  toolsCount: number;
  avgUtilization: number;
  // Resource variables
  teamSize: number;
  budget: number;
  maturity: number;
}

interface ProjectedResults {
  combinedScore: number;
  planeLevel: string;
  flightMiles: number;
  unlockedRoutes: string[];
  readinessScore: number;
  efficiencyScore: number;
  alignmentScore: number;
  opportunityScore: number;
}

const ASSESSMENT_CATEGORIES = [
  { id: 'strategy', label: 'Strategy & Planning', icon: Target },
  { id: 'content', label: 'Content & Communication', icon: BarChart3 },
  { id: 'demand', label: 'Demand Generation', icon: TrendingUp },
  { id: 'sales', label: 'Sales Alignment', icon: Users },
  { id: 'ops', label: 'Marketing Ops', icon: Gauge },
  { id: 'tech', label: 'Tech Stack', icon: Wrench },
  { id: 'data', label: 'Data & Analytics', icon: BarChart3 },
  { id: 'brand', label: 'Brand Strategy', icon: Sparkles },
  { id: 'journey', label: 'Customer Journey', icon: Map },
  { id: 'team', label: 'Team Capabilities', icon: Users },
];

export const Simulator: React.FC = () => {
  const navigate = useNavigate();
  const {
    combinedScore,
    planeLevel,
    flightMiles,
    unlockedRoutes,
    assessmentResponses,
    techStack,
    readinessScore,
    efficiencyScore,
    alignmentScore,
    opportunityScore,
  } = useUser();

  // Initialize inputs from current state
  const getInitialInputs = (): SimulatorInputs => {
    // Get current assessment scores by category
    const categoryScores: Record<string, number> = {};
    assessmentResponses.forEach(r => {
      if (!categoryScores[r.category]) {
        categoryScores[r.category] = r.score;
      }
    });

    // Map categories to inputs
    const getScore = (category: string) => {
      if (category.includes('Strategy') || category.includes('Planning')) return categoryScores['Strategy & Planning'] || 50;
      if (category.includes('Content') || category.includes('Communication')) return categoryScores['Content & Communication'] || 50;
      if (category.includes('Demand')) return categoryScores['Demand Generation'] || 50;
      if (category.includes('Sales') || category.includes('Alignment')) return categoryScores['Sales & Marketing Alignment'] || 50;
      if (category.includes('Operations') || category.includes('Ops')) return categoryScores['Marketing Operations'] || 50;
      if (category.includes('Technology') || category.includes('Tech')) return categoryScores['Marketing Technology'] || 50;
      if (category.includes('Data') || category.includes('Analytics')) return categoryScores['Data & Analytics'] || 50;
      if (category.includes('Brand')) return categoryScores['Brand Strategy'] || 50;
      if (category.includes('Journey')) return categoryScores['Customer Journey'] || 50;
      if (category.includes('Team') || category.includes('Capabilities')) return categoryScores['Team & Capabilities'] || 50;
      return 50;
    };

    const avgUtilization = techStack.length > 0
      ? techStack.reduce((sum, t) => sum + t.utilizationScore, 0) / techStack.length
      : 5;

    return {
      strategy: getScore('Strategy'),
      content: getScore('Content'),
      demand: getScore('Demand'),
      sales: getScore('Sales'),
      ops: getScore('Operations'),
      tech: getScore('Technology'),
      data: getScore('Data'),
      brand: getScore('Brand'),
      journey: getScore('Journey'),
      team: getScore('Team'),
      toolsCount: techStack.length,
      avgUtilization: Math.round(avgUtilization),
      teamSize: 5, // Default
      budget: 100000, // Default $100K
      maturity: 3, // Default middle
    };
  };

  const [inputs, setInputs] = useState<SimulatorInputs>(getInitialInputs);
  const [savedScenarios, setSavedScenarios] = useState<Array<{ name: string; inputs: SimulatorInputs; results: ProjectedResults }>>([]);

  // Convert linear slider value to logarithmic budget
  const budgetFromSlider = (value: number): number => {
    const min = 10000;
    const max = 5000000;
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const logValue = logMin + (value / 100) * (logMax - logMin);
    return Math.round(Math.pow(10, logValue));
  };

  const budgetToSlider = (value: number): number => {
    const min = 10000;
    const max = 5000000;
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const logValue = Math.log10(value);
    return ((logValue - logMin) / (logMax - logMin)) * 100;
  };

  // Calculate projected results
  const calculateProjectedResults = (input: SimulatorInputs): ProjectedResults => {
    // Assessment average (70% weight)
    const assessmentAvg = (
      input.strategy + input.content + input.demand +
      input.sales + input.ops + input.tech + input.data +
      input.brand + input.journey + input.team
    ) / 10;

    // Tech stack average (30% weight)
    // Convert toolsCount and avgUtilization to a 0-100 score
    const techScore = Math.min(100, (input.toolsCount / 20) * 50 + (input.avgUtilization / 10) * 50);
    const techAvg = techScore;

    // Combined score (70% assessment, 30% tech)
    const combinedScore = Math.round((assessmentAvg * SCORE_WEIGHTS.ASSESSMENT) + (techAvg * SCORE_WEIGHTS.TECH_STACK));

    // Plane level
    const level = PLANE_LEVELS.find(l => combinedScore >= l.minScore && combinedScore <= l.maxScore);
    const planeLevel = level?.name || 'Grounded';

    // Flight miles
    let miles = combinedScore * 100;
    if (assessmentResponses.length > 0) miles += 500;
    if (input.toolsCount > 0) miles += 300;

    // Routes unlocked (matching UserContext logic)
    // Use route.requiredScore and route.requiredMiles from staticData if available
    const getRouteRequirement = (routeId: string) => {
      const route = ROUTES.find(r => r.id === routeId);
      if (route && route.requiredScore && route.requiredMiles) {
        return { id: routeId, minScore: route.requiredScore, minMiles: route.requiredMiles };
      }
      const requirement = ROUTE_REQUIREMENTS[routeId];
      return requirement || { id: routeId, minScore: 0, minMiles: 0 };
    };

    const unlockedRoutes = ROUTES
      .map(route => {
        const requirement = getRouteRequirement(route.id);
        return {
          routeId: route.id,
          requirement,
        };
      })
      .filter(r => combinedScore >= r.requirement.minScore && miles >= r.requirement.minMiles)
      .map(r => r.routeId);

    // REAO metrics (simplified calculation)
    const readinessScore = Math.round(combinedScore * 0.9);
    const efficiencyScore = Math.round(Math.min(100, combinedScore * 1.1));
    const alignmentScore = Math.round(combinedScore * 0.8);
    const opportunityScore = 100; // Always 100

    return {
      combinedScore,
      planeLevel,
      flightMiles: Math.round(miles),
      unlockedRoutes,
      readinessScore,
      efficiencyScore,
      alignmentScore,
      opportunityScore,
    };
  };

  const projectedResults = useMemo(() => calculateProjectedResults(inputs), [inputs, assessmentResponses.length]);

  // Get current plane level
  const currentPlaneLevel = PLANE_LEVELS.find(l =>
    combinedScore >= l.minScore && combinedScore <= l.maxScore
  ) || PLANE_LEVELS[0];

  const projectedPlaneLevel = PLANE_LEVELS.find(l =>
    projectedResults.combinedScore >= l.minScore && projectedResults.combinedScore <= l.maxScore
  ) || PLANE_LEVELS[0];

  // Calculate routes that would unlock
  const routesThatWouldUnlock = useMemo(() => {
    return ROUTES.filter(route => {
      const currentlyUnlocked = unlockedRoutes.includes(route.id);
      const wouldUnlock = projectedResults.unlockedRoutes.includes(route.id);
      return !currentlyUnlocked && wouldUnlock;
    }).map(route => {
      const fromCity = CITIES.find(c => c.id === route.from);
      const toCity = CITIES.find(c => c.id === route.to);
      return {
        ...route,
        fromCity: fromCity?.name || route.from,
        toCity: toCity?.name || route.to,
      };
    });
  }, [projectedResults.unlockedRoutes, unlockedRoutes]);

  // Generate smart recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    const scoreDiff = projectedResults.combinedScore - combinedScore;

    // Category-specific recommendations
    if (inputs.strategy > 70 && inputs.strategy > (assessmentResponses.find(r => r.category.includes('Strategy'))?.score || 0) + 10) {
      recs.push(`Improving Strategy & Planning to ${inputs.strategy} unlocks strategic routes`);
    }
    if (inputs.tech > 70 && inputs.tech > (assessmentResponses.find(r => r.category.includes('Technology'))?.score || 0) + 10) {
      recs.push(`Boosting Tech Stack score to ${inputs.tech} improves efficiency by +${Math.round((inputs.tech - 50) * 0.3)} points`);
    }
    if (inputs.toolsCount > techStack.length) {
      const toolDiff = inputs.toolsCount - techStack.length;
      recs.push(`Adding ${toolDiff} more tool${toolDiff > 1 ? 's' : ''} in Marketing Automation = +${Math.round(toolDiff * 1.5)} score`);
    }
    if (inputs.avgUtilization > (techStack.length > 0 ? techStack.reduce((sum, t) => sum + t.utilizationScore, 0) / techStack.length : 5)) {
      const utilDiff = inputs.avgUtilization - (techStack.length > 0 ? techStack.reduce((sum, t) => sum + t.utilizationScore, 0) / techStack.length : 5);
      recs.push(`Improving Tech Stack utilization by ${utilDiff.toFixed(1)} points = +${Math.round(utilDiff * 3)} score`);
    }
    if (scoreDiff > 10) {
      recs.push(`With these improvements, you'd unlock ${routesThatWouldUnlock.length} new route${routesThatWouldUnlock.length !== 1 ? 's' : ''}`);
    }

    return recs;
  }, [inputs, projectedResults, combinedScore, techStack, assessmentResponses, routesThatWouldUnlock.length]);

  // Preset scenarios
  const applyPreset = (preset: 'quick-wins' | '6-month' | 'ideal') => {
    const baseInputs = getInitialInputs();
    
    if (preset === 'quick-wins') {
      // Small improvements, big impact
      setInputs({
        ...baseInputs,
        tech: Math.min(100, baseInputs.tech + 15),
        avgUtilization: Math.min(10, baseInputs.avgUtilization + 2),
        toolsCount: Math.min(20, baseInputs.toolsCount + 3),
      });
    } else if (preset === '6-month') {
      // Realistic growth
      setInputs({
        ...baseInputs,
        strategy: Math.min(100, baseInputs.strategy + 10),
        content: Math.min(100, baseInputs.content + 10),
        demand: Math.min(100, baseInputs.demand + 10),
        tech: Math.min(100, baseInputs.tech + 15),
        avgUtilization: Math.min(10, baseInputs.avgUtilization + 2),
        toolsCount: Math.min(20, baseInputs.toolsCount + 5),
      });
    } else if (preset === 'ideal') {
      // Best-in-class
      setInputs({
        ...baseInputs,
        strategy: 85,
        content: 85,
        demand: 85,
        sales: 85,
        ops: 90,
        tech: 90,
        data: 90,
        brand: 85,
        journey: 85,
        team: 85,
        toolsCount: 18,
        avgUtilization: 9,
        maturity: 5,
      });
    }
  };

  const handleReset = () => {
    setInputs(getInitialInputs());
  };

  const handleSaveScenario = () => {
    const name = prompt('Name this scenario:');
    if (name) {
      setSavedScenarios(prev => [...prev, { name, inputs, results: projectedResults }]);
    }
  };

  const updateInput = (key: keyof SimulatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // REAO metrics for comparison
  const currentREAO = {
    readiness: readinessScore,
    efficiency: efficiencyScore,
    alignment: alignmentScore,
    opportunity: opportunityScore,
  };

  const projectedREAO = {
    readiness: projectedResults.readinessScore,
    efficiency: projectedResults.efficiencyScore,
    alignment: projectedResults.alignmentScore,
    opportunity: projectedResults.opportunityScore,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Sliders className="text-cyan-400 h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">What-If Scenario Calculator</h1>
                <p className="text-xs text-slate-400">Project your marketing maturity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/results')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset to Current
          </button>
          <button
            onClick={handleSaveScenario}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save Scenario
          </button>
          <button
            onClick={() => {
              // Navigate to assessment or show message
              alert('To apply these goals, retake your assessment with these target scores in mind, or update your tech stack.');
            }}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Target size={16} />
            Apply These Goals
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400">Presets:</span>
            <button
              onClick={() => applyPreset('quick-wins')}
              className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
            >
              Quick Wins
            </button>
            <button
              onClick={() => applyPreset('6-month')}
              className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
            >
              6-Month Target
            </button>
            <button
              onClick={() => applyPreset('ideal')}
              className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
            >
              Ideal State
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Inputs (40%) + Results (60%) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT SIDE: INPUT SLIDERS (40% / 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Scores */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-cyan-400" size={20} />
                Assessment Scores
              </h2>
              <div className="space-y-4">
                {ASSESSMENT_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const value = inputs[category.id as keyof SimulatorInputs] as number;
                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="text-cyan-400" size={16} />
                          <label className="text-sm font-semibold text-slate-300">
                            {category.label}
                          </label>
                        </div>
                        <span className="text-sm font-mono font-bold text-cyan-400">{value}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateInput(category.id as keyof SimulatorInputs, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        style={{
                          background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${value}%, #334155 ${value}%, #334155 100%)`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack Variables */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="text-cyan-400" size={20} />
                Tech Stack
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Number of Tools</label>
                    <span className="text-sm font-mono font-bold text-cyan-400">{inputs.toolsCount}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={inputs.toolsCount}
                    onChange={(e) => updateInput('toolsCount', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(inputs.toolsCount / 20) * 100}%, #334155 ${(inputs.toolsCount / 20) * 100}%, #334155 100%)`,
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Average Utilization</label>
                    <span className="text-sm font-mono font-bold text-cyan-400">{inputs.avgUtilization}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={inputs.avgUtilization}
                    onChange={(e) => updateInput('avgUtilization', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((inputs.avgUtilization - 1) / 9) * 100}%, #334155 ${((inputs.avgUtilization - 1) / 9) * 100}%, #334155 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Resource Variables */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="text-cyan-400" size={20} />
                Resources
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Team Size</label>
                    <span className="text-sm font-mono font-bold text-cyan-400">{inputs.teamSize}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={inputs.teamSize}
                    onChange={(e) => updateInput('teamSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((inputs.teamSize - 1) / 49) * 100}%, #334155 ${((inputs.teamSize - 1) / 49) * 100}%, #334155 100%)`,
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Annual Budget</label>
                    <span className="text-sm font-mono font-bold text-cyan-400">
                      ${(inputs.budget / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={budgetToSlider(inputs.budget)}
                    onChange={(e) => updateInput('budget', budgetFromSlider(parseInt(e.target.value)))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${budgetToSlider(inputs.budget)}%, #334155 ${budgetToSlider(inputs.budget)}%, #334155 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$10K</span>
                    <span>$5M</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-300">Marketing Maturity</label>
                    <span className="text-sm font-mono font-bold text-cyan-400">{inputs.maturity}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={inputs.maturity}
                    onChange={(e) => updateInput('maturity', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((inputs.maturity - 1) / 4) * 100}%, #334155 ${((inputs.maturity - 1) / 4) * 100}%, #334155 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE RESULTS (60% / 3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current vs Projected Comparison Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-cyan-400" size={20} />
                Current vs Projected
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Metric</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Current</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Projected</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-800/50">
                      <td className="py-3 px-4 text-slate-300 font-medium">Combined Score</td>
                      <td className="py-3 px-4 text-center text-white font-bold">{combinedScore}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-cyan-400 font-bold">{projectedResults.combinedScore}</span>
                          {projectedResults.combinedScore > combinedScore && (
                            <span className="text-emerald-400 text-xs">(+{projectedResults.combinedScore - combinedScore}) ⬆</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800/50">
                      <td className="py-3 px-4 text-slate-300 font-medium">Plane Level</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold" style={{ color: currentPlaneLevel.color }}>
                          {planeLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold" style={{ color: projectedPlaneLevel.color }}>
                            {projectedResults.planeLevel}
                          </span>
                          {projectedResults.planeLevel !== planeLevel && (
                            <span className="text-emerald-400 text-xs">⬆</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-800/50">
                      <td className="py-3 px-4 text-slate-300 font-medium">Flight Miles</td>
                      <td className="py-3 px-4 text-center text-white font-bold">{flightMiles.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-cyan-400 font-bold">{projectedResults.flightMiles.toLocaleString()}</span>
                          {projectedResults.flightMiles > flightMiles && (
                            <span className="text-emerald-400 text-xs">(+{(projectedResults.flightMiles - flightMiles).toLocaleString()}) ⬆</span>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-300 font-medium">Routes Unlocked</td>
                      <td className="py-3 px-4 text-center text-white font-bold">{unlockedRoutes.length}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-cyan-400 font-bold">{projectedResults.unlockedRoutes.length}</span>
                          {projectedResults.unlockedRoutes.length > unlockedRoutes.length && (
                            <span className="text-emerald-400 text-xs">(+{projectedResults.unlockedRoutes.length - unlockedRoutes.length}) ⬆</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* REAO Metrics Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Gauge className="text-cyan-400" size={20} />
                REAO Metrics
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'readiness', label: 'Readiness', current: currentREAO.readiness, projected: projectedREAO.readiness },
                  { key: 'efficiency', label: 'Efficiency', current: currentREAO.efficiency, projected: projectedREAO.efficiency },
                  { key: 'alignment', label: 'Alignment', current: currentREAO.alignment, projected: projectedREAO.alignment },
                  { key: 'opportunity', label: 'Opportunity', current: currentREAO.opportunity, projected: projectedREAO.opportunity },
                ].map((metric) => {
                  const change = metric.projected - metric.current;
                  const changePercent = metric.current > 0 ? ((change / metric.current) * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={metric.key} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase mb-3">{metric.label}</div>
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            innerRadius="60%"
                            outerRadius="100%"
                            barSize={8}
                            data={[
                              { score: 100, fill: '#1e293b' },
                              { score: metric.projected, fill: '#06b6d4' }
                            ]}
                            startAngle={180}
                            endAngle={0}
                          >
                            <RadialBar dataKey="score" cornerRadius={4} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                          <span className="text-lg font-bold text-cyan-400">{metric.projected}</span>
                          <span className="text-xs text-slate-500">/ 100</span>
                        </div>
                        {/* Current score indicator (smaller ring) */}
                        <div className="absolute inset-0 pointer-events-none">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              innerRadius="50%"
                              outerRadius="55%"
                              barSize={4}
                              data={[
                                { score: 100, fill: 'transparent' },
                                { score: metric.current, fill: '#64748b' }
                              ]}
                              startAngle={180}
                              endAngle={0}
                            >
                              <RadialBar dataKey="score" cornerRadius={2} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Current: {metric.current}</div>
                        {change !== 0 && (
                          <div className={`text-xs font-semibold ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {change > 0 ? '+' : ''}{change} ({changePercent}%)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Routes You'd Unlock */}
            {routesThatWouldUnlock.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Map className="text-cyan-400" size={20} />
                  Routes You'd Unlock
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  With these improvements, you'd unlock:
                </p>
                <div className="space-y-2">
                  {routesThatWouldUnlock.map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                    >
                      <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={18} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{route.name}</div>
                        <div className="text-xs text-slate-400">
                          {route.fromCity} → {route.toCity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Investments */}
            {recommendations.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="text-cyan-400" size={20} />
                  Recommended Investments
                </h2>
                <div className="space-y-2">
                  {recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg"
                    >
                      <Zap className="text-cyan-400 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-sm text-slate-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
