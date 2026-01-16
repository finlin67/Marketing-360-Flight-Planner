import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SCENARIOS, 
  getScenariosByIndustryGrouped, 
  getUniqueIndustries, 
  getUniqueCompanySizes,
  searchScenarios
} from '../data/staticData';
import { useUser } from '../context/UserContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MapPin, Clock, Users, ArrowRight, Plane, Database, CheckCircle2, AlertCircle, Search, Filter, ChevronDown, ChevronUp, Eye } from 'lucide-react';

// Map scenarios to required tech categories
const SCENARIO_TECH_REQUIREMENTS: Record<string, string[]> = {
  'launch-abm': ['CRM', 'ABM Platforms', 'Marketing Automation'],
  'scale-pipeline': ['CRM', 'Marketing Automation', 'Analytics & BI'],
  'optimize-martech': ['CRM', 'Marketing Automation', 'Data & CDP'],
};

const ScenariosComponent: React.FC = () => {
  const navigate = useNavigate();
  const { techStack } = useUser();
  
  // Filter state (persisted)
  const [selectedIndustry, setSelectedIndustry] = useLocalStorage<string>('scenariosIndustryFilter', 'All');
  const [selectedCompanySize, setSelectedCompanySize] = useLocalStorage<string>('scenariosSizeFilter', 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useLocalStorage<string>('scenariosDifficultyFilter', 'All');
  const [searchQuery, setSearchQuery] = useLocalStorage('scenariosSearch', '');
  const [expandedIndustries, setExpandedIndustries] = useState<Set<string>>(new Set(['Cross-Industry']));
  const [scenarioStatuses, setScenarioStatuses] = useLocalStorage<Record<string, { status?: 'in_progress' | 'completed'; viewedAt?: number }>>('scenarioStatuses', {});
  
  // Persist expanded industries
  useEffect(() => {
    const saved = localStorage.getItem('scenariosExpandedIndustries');
    if (saved) {
      try {
        setExpandedIndustries(new Set(JSON.parse(saved)));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('scenariosExpandedIndustries', JSON.stringify(Array.from(expandedIndustries)));
  }, [expandedIndustries]);

  // Get filtered scenarios
  const filteredScenarios = useMemo(() => {
    let scenarios = searchScenarios(searchQuery);
    
    if (selectedIndustry !== 'All') {
      scenarios = scenarios.filter(s => s.industry === selectedIndustry || s.industry === 'Cross-Industry');
    }
    
    if (selectedCompanySize !== 'All') {
      scenarios = scenarios.filter(s => s.companySize === selectedCompanySize || s.companySize === 'All');
    }
    
    if (selectedDifficulty !== 'All') {
      scenarios = scenarios.filter(s => (s.difficulty || 'Intermediate') === selectedDifficulty);
    }
    
    return scenarios;
  }, [selectedIndustry, selectedCompanySize, selectedDifficulty, searchQuery]);

  // Group scenarios by industry
  const groupedScenarios = useMemo(() => {
    return getScenariosByIndustryGrouped();
  }, []);

  const industries = getUniqueIndustries();
  const companySizes = getUniqueCompanySizes();
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const toggleIndustry = (industry: string) => {
    setExpandedIndustries(prev => {
      const next = new Set(prev);
      if (next.has(industry)) {
        next.delete(industry);
      } else {
        next.add(industry);
      }
      return next;
    });
  };

  // Get user's tech stack categories
  const userTechCategories = new Set(techStack.map(t => t.category));

  const handleSetStatus = (id: string, status: 'in_progress' | 'completed') => {
    setScenarioStatuses(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), status, viewedAt: prev[id]?.viewedAt || Date.now() },
    }));
  };

  const handleViewDetails = (scenarioId: string) => {
    setScenarioStatuses(prev => ({
      ...prev,
      [scenarioId]: { ...(prev[scenarioId] || {}), viewedAt: Date.now() },
    }));
    navigate(`/scenarios/${scenarioId}`);
  };

  // Check if user has required tools for a scenario
  const getTechStatus = (scenarioId: string) => {
    const required = SCENARIO_TECH_REQUIREMENTS[scenarioId] || [];
    if (required.length === 0) return null;
    
    const hasAll = required.every(cat => userTechCategories.has(cat));
    const hasSome = required.some(cat => userTechCategories.has(cat));
    const missing = required.filter(cat => !userTechCategories.has(cat));
    
    return {
      hasAll,
      hasSome,
      missing,
      required,
    };
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="text-center pt-4 pb-6">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <Plane className="text-cyan-400 h-12 w-12 transform -rotate-45" />
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white mb-3">
          Pre-Built Scenarios
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Choose a strategic journey tailored to your industry and challenges
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Showing {filteredScenarios.length} of {SCENARIOS.length} scenarios
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Industry Filter */}
          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase mb-2 block flex items-center gap-2">
              <Filter size={14} />
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="All">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Company Size Filter */}
          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase mb-2 block flex items-center gap-2">
              <Filter size={14} />
              Company Size
            </label>
            <select
              value={selectedCompanySize}
              onChange={(e) => setSelectedCompanySize(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="All">All Sizes</option>
              {companySizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase mb-2 block flex items-center gap-2">
              <Filter size={14} />
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="All">All Difficulty</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scenarios Display - Grouped by Industry */}
      <div className="space-y-6">
        {Object.entries(groupedScenarios).map(([industry, scenarios]) => {
          // Filter scenarios for this industry group
          const industryScenarios = scenarios.filter(s => 
            filteredScenarios.some(fs => fs.id === s.id)
          );
          
          if (industryScenarios.length === 0) return null;
          
          return (
            <div key={industry} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {/* Industry Header */}
              <button
                onClick={() => toggleIndustry(industry)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{industry}</h2>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded">
                    {industryScenarios.length} scenarios
                  </span>
                </div>
                {expandedIndustries.has(industry) ? (
                  <ChevronUp className="text-cyan-400" size={20} />
                ) : (
                  <ChevronDown className="text-cyan-400" size={20} />
                )}
              </button>

              {/* Scenarios Grid - Collapsible */}
              {expandedIndustries.has(industry) && (
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industryScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/50 transition-all group flex flex-col"
                      >
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded border border-blue-500/30">
                            {scenario.industry}
                          </span>
                          {scenario.companySize && (
                            <span className="px-2 py-1 bg-slate-700/20 text-slate-300 text-xs font-semibold rounded border border-slate-700/30">
                              {scenario.companySize}
                            </span>
                          )}
                          {scenario.difficulty && (
                            <span className="px-2 py-1 bg-purple-500/15 text-purple-300 text-xs font-semibold rounded border border-purple-500/30">
                              {scenario.difficulty}
                            </span>
                          )}
                          {scenarioStatuses[scenario.id]?.status && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded border ${
                              scenarioStatuses[scenario.id]?.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                                : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40'
                            }`}>
                              {scenarioStatuses[scenario.id]?.status === 'completed' ? 'Completed' : 'In Progress'}
                            </span>
                          )}
                          {scenarioStatuses[scenario.id]?.viewedAt && (
                            <span className="px-2 py-1 bg-slate-700/20 text-slate-300 text-xs font-semibold rounded border border-slate-700/30 flex items-center gap-1">
                              <Eye size={12} />
                              Viewed
                            </span>
                          )}
                        </div>

                        {/* Card Header */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {scenario.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-3">
                            {scenario.description}
                          </p>
                          {(scenario.problem || scenario.challenge) && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                              {scenario.problem || scenario.challenge}
                            </p>
                          )}
                        </div>

                        {/* Card Details */}
                        <div className="space-y-3 mb-6 flex-grow">
                          {/* Industry/Target Audience */}
                          <div className="flex items-start gap-2">
                            <Users className="text-cyan-400 mt-0.5" size={16} />
                            <div>
                              <div className="text-xs font-semibold text-slate-400 uppercase">
                                Industry
                              </div>
                              <div className="text-sm text-slate-300">{scenario.industry}</div>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-start gap-2">
                            <Clock className="text-cyan-400 mt-0.5" size={16} />
                            <div>
                              <div className="text-xs font-semibold text-slate-400 uppercase">
                                Duration
                              </div>
                              <div className="text-sm text-slate-300">
                                {scenario.estimatedDuration || scenario.duration}
                              </div>
                            </div>
                          </div>

                          {/* Challenge/Problem */}
                          {(scenario.challenge || scenario.problem) && (
                            <div className="flex items-start gap-2">
                              <MapPin className="text-cyan-400 mt-0.5" size={16} />
                              <div>
                                <div className="text-xs font-semibold text-slate-400 uppercase">
                                  Challenge
                                </div>
                                <div className="text-sm text-slate-300 line-clamp-2">
                                  {scenario.problem || scenario.challenge}
                                </div>
                              </div>
                            </div>
                          )}

              {/* Tech Requirements */}
              {(() => {
                const techStatus = getTechStatus(scenario.id);
                if (!techStatus) return null;

                return (
                  <div className="flex items-start gap-2">
                    <Database className="text-cyan-400 mt-0.5" size={16} />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 uppercase mb-1">
                        Tech Requirements
                      </div>
                      <div className="space-y-1">
                        {techStatus.required.map((category, idx) => {
                          const hasCategory = userTechCategories.has(category);
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              {hasCategory ? (
                                <CheckCircle2 className="text-emerald-400" size={14} />
                              ) : (
                                <AlertCircle className="text-yellow-400" size={14} />
                              )}
                              <span className={hasCategory ? 'text-slate-300' : 'text-slate-500'}>
                                {category}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {techStatus.missing.length > 0 && (
                        <div className="mt-2 text-xs text-yellow-400">
                          Missing: {techStatus.missing.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(scenario.id)}
                          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm group-hover:shadow-lg group-hover:shadow-cyan-500/20"
                        >
                          View Details
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleSetStatus(scenario.id, 'in_progress')}
                            className="flex-1 py-2 text-xs bg-yellow-500/15 text-yellow-200 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/25 transition-colors"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => handleSetStatus(scenario.id, 'completed')}
                            className="flex-1 py-2 text-xs bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition-colors"
                          >
                            Mark Completed
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredScenarios.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 mb-2">No scenarios found</p>
          <p className="text-sm text-slate-500">
            {searchQuery ? 'Try adjusting your search or filters' : 'No scenarios match your criteria'}
          </p>
        </div>
      )}
    </div>
  );
};

// Memoize Scenarios to prevent re-renders when parent updates
export const Scenarios = React.memo(ScenariosComponent);

