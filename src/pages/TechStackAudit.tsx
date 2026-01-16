import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { logger } from '../utils/logger';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BackButton } from '../components/BackButton';
import {
  MARKETING_TECH_TOOLS,
  TECH_TOOL_CATEGORIES,
  TECH_STACK_PRESETS,
  getToolsByCategory,
  getToolsByCompanySize,
  TechTool as TechToolData
} from '../data/techTools';
import {
  Database,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Info,
  BarChart3,
  Filter,
  Loader2
} from 'lucide-react';

interface SelectedTool {
  toolId: string;
  utilization: number;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Data & Analytics': <BarChart3 size={20} />,
  'Content & Creative': <Sparkles size={20} />,
  'Acquisition & Marketing Automation': <TrendingUp size={20} />,
  'CRO & Experience': <Database size={20} />,
  'Retention & Customer Success': <CheckCircle2 size={20} />,
};

const TechStackAuditComponent: React.FC = () => {
  const navigate = useNavigate();
  const { setTechStack, profile, techStack: existingTechStack } = useUser();

  // State management
  const [selectedTools, setSelectedTools] = useState<SelectedTool[]>(() => {
    // Load from existing tech stack if available
    if (existingTechStack.length > 0) {
      return existingTechStack.map(tool => {
        const toolData = MARKETING_TECH_TOOLS.find(t => t.name === tool.name);
        return {
          toolId: toolData?.id || '',
          utilization: tool.utilizationScore,
        };
      }).filter(st => st.toolId);
    }
    return [];
  });

  const [expandedCategories, setExpandedCategories] = useLocalStorage<string[]>(
    'techStackExpandedCategories',
    [TECH_TOOL_CATEGORIES[0]] // First category expanded by default
  );
  const [searchQuery, setSearchQuery] = useLocalStorage(
    'techStackSearch',
    ''
  );
  const [sizeFilter, setSizeFilter] = useLocalStorage<'All' | 'SMB' | 'Mid-Market' | 'Enterprise'>(
    'techStackSizeFilter',
    'All'
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate metrics
  const avgUtilization = useMemo(() => {
    if (selectedTools.length === 0) return 0;
    return selectedTools.reduce((sum, t) => sum + t.utilization, 0) / selectedTools.length;
  }, [selectedTools]);

  const maturityScore = useMemo(() => {
    // Tool count score (max 50 points) - normalized to 0-10 scale
    const toolCountScore = Math.min(selectedTools.length / 20 * 5, 5);
    // Utilization score (max 50 points) - normalized to 0-10 scale
    const utilizationScore = (avgUtilization / 10) * 5;
    return Math.round((toolCountScore + utilizationScore) * 10) / 10;
  }, [selectedTools, avgUtilization]);

  // Calculate completion progress (recommended: 10-15 tools)
  const recommendedToolCount = 12;
  const completionProgress = Math.min((selectedTools.length / recommendedToolCount) * 100, 100);

  // Filter tools based on search and size filter
  const filteredTools = useMemo(() => {
    let tools = MARKETING_TECH_TOOLS;

    // Apply size filter
    if (sizeFilter !== 'All') {
      tools = getToolsByCompanySize(sizeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query)
      );
    }

    return tools;
  }, [searchQuery, sizeFilter]);

  // Group filtered tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, TechToolData[]> = {};
    TECH_TOOL_CATEGORIES.forEach(category => {
      grouped[category] = filteredTools.filter(tool => tool.category === category);
    });
    return grouped;
  }, [filteredTools]);

  // Calculate category averages
  const getCategoryAverage = (category: string): number | null => {
    const categoryTools = selectedTools.filter(st => {
      const tool = MARKETING_TECH_TOOLS.find(t => t.id === st.toolId);
      return tool?.category === category;
    });
    if (categoryTools.length === 0) return null;
    const avg = categoryTools.reduce((sum, t) => sum + t.utilization, 0) / categoryTools.length;
    return Math.round(avg * 10) / 10;
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle tool selection
  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => {
      const exists = prev.find(st => st.toolId === toolId);
      if (exists) {
        return prev.filter(st => st.toolId !== toolId);
      } else {
        return [...prev, { toolId, utilization: 5 }]; // Default to 5/10
      }
    });
  };

  // Update utilization score
  const updateUtilization = (toolId: string, value: number) => {
    setSelectedTools(prev =>
      prev.map(st =>
        st.toolId === toolId ? { ...st, utilization: value } : st
      )
    );
  };

  // Apply preset
  const applyPreset = (presetName: string) => {
    const presetToolIds = TECH_STACK_PRESETS[presetName as keyof typeof TECH_STACK_PRESETS];
    if (!presetToolIds) return;

    const newSelectedTools: SelectedTool[] = presetToolIds.map(id => ({
      toolId: id,
      utilization: 5, // Default to 5/10
    }));

    setSelectedTools(newSelectedTools);

    // Expand all categories that have selected tools
    const categoriesWithTools = new Set(
      presetToolIds.map(id => {
        const tool = MARKETING_TECH_TOOLS.find(t => t.id === id);
        return tool?.category;
      }).filter(Boolean) as string[]
    );
    setExpandedCategories(Array.from(categoriesWithTools));
  };

  // Save tech stack
  const handleSave = async () => {
    if (selectedTools.length === 0) return;
    
    setIsSaving(true);
    try {
      const techStackData = selectedTools.map(st => {
        const tool = MARKETING_TECH_TOOLS.find(t => t.id === st.toolId);
        return {
          name: tool?.name || '',
          category: tool?.category || '',
          utilizationScore: st.utilization,
        };
      });

      setTechStack(techStackData);
      setShowSuccess(true);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
      
      // Navigate to results after a brief delay to show success
      setTimeout(() => {
        navigate('/results');
      }, 2000);
    } catch (error) {
      logger.error('Failed to save tech stack:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get user's company size from profile for smart suggestions
  const userCompanySize = profile?.companySize;
  const getRecommendedSize = (): 'SMB' | 'Mid-Market' | 'Enterprise' | null => {
    if (!userCompanySize) return null;
    if (userCompanySize.includes('1-50') || userCompanySize.includes('51-200')) return 'SMB';
    if (userCompanySize.includes('201-500') || userCompanySize.includes('501-1000')) return 'Mid-Market';
    if (userCompanySize.includes('1001') || userCompanySize.includes('5000')) return 'Enterprise';
    return null;
  };

  const recommendedSize = getRecommendedSize();

  // Count reviewed categories
  const reviewedCategories = TECH_TOOL_CATEGORIES.filter(category => {
    const categoryTools = toolsByCategory[category] || [];
    return categoryTools.some(tool => selectedTools.some(st => st.toolId === tool.id));
  }).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <BackButton to="/results" label="Back to Results" />
      
      {/* Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <Database className="text-cyan-400 h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Tech Stack Audit
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Select your marketing tools and rate how well you're utilizing each one.
        </p>
        
        {/* Completion Progress */}
        {selectedTools.length > 0 && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Tech Stack Completion</span>
              <span className="text-cyan-400 font-semibold">
                {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${completionProgress}%` }}
                role="progressbar"
                aria-valuenow={completionProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${Math.round(completionProgress)}% complete`}
              />
            </div>
            {completionProgress >= 100 && (
              <p className="text-xs text-emerald-400 mt-2 text-center animate-in fade-in">
                ✓ Great! You've selected a comprehensive tech stack
              </p>
            )}
          </div>
        )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-emerald-500/20 border-2 border-emerald-500/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400" size={24} />
            <div>
              <div className="font-semibold text-white">Tech stack saved!</div>
              <div className="text-sm text-emerald-200">Your combined score has been updated.</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/results')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            View Updated Results
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Score Summary Card */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">
              {maturityScore.toFixed(1)}
              <span className="text-2xl text-slate-400">/10</span>
            </div>
            <div className="text-sm text-slate-300 font-semibold mb-1">Tech Stack Maturity</div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${(maturityScore / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">
              {selectedTools.length}
              <span className="text-2xl text-slate-400">/100+</span>
            </div>
            <div className="text-sm text-slate-300 font-semibold">Tools Selected</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-cyan-400 font-semibold mb-2">Score Contribution</div>
            <div className="text-2xl font-bold text-white mb-1">30%</div>
            <div className="text-xs text-slate-400">of combined score</div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Categories Reviewed</span>
            <span className="text-cyan-400 font-semibold">
              {reviewedCategories} of {TECH_TOOL_CATEGORIES.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-500"
              style={{ width: `${(reviewedCategories / TECH_TOOL_CATEGORIES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Select Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-cyan-400" size={20} />
          <h2 className="text-xl font-bold text-white">Quick Select Presets</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.keys(TECH_STACK_PRESETS).map(presetName => {
            const toolIds = TECH_STACK_PRESETS[presetName as keyof typeof TECH_STACK_PRESETS];
            return (
              <button
                key={presetName}
                onClick={() => applyPreset(presetName)}
                className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-all text-left group"
              >
                <div className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  {presetName}
                </div>
                <div className="text-xs text-slate-400">
                  {toolIds.length} tools
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart Suggestion */}
      {recommendedSize && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
          <Info className="text-blue-400 mt-0.5" size={20} />
          <div className="flex-1">
            <div className="font-semibold text-white mb-1">Smart Recommendation</div>
            <div className="text-sm text-slate-300">
              Based on your company size ({userCompanySize}), we recommend filtering for <strong className="text-blue-400">{recommendedSize}</strong> tools.
            </div>
            <button
              onClick={() => setSizeFilter(recommendedSize)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Apply {recommendedSize} filter →
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search 100+ marketing tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors min-h-[44px]"
              aria-label="Search marketing tools"
            />
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-3">
            <Filter className="text-slate-400" size={20} />
            <div className="flex gap-2 bg-slate-800 rounded-lg p-1">
              {(['All', 'SMB', 'Mid-Market', 'Enterprise'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setSizeFilter(size)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    sizeFilter === size
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label={`Filter tools for ${size} companies`}
                  aria-pressed={sizeFilter === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tool Categories (Accordion) */}
      <div className="space-y-4">
        {TECH_TOOL_CATEGORIES.map(category => {
          const categoryTools = toolsByCategory[category] || [];
          const isExpanded = expandedCategories.includes(category);
          const categoryAvg = getCategoryAverage(category);
          const categoryIcon = CATEGORY_ICONS[category] || <Database size={20} />;

          if (categoryTools.length === 0 && searchQuery) {
            return null; // Don't show empty categories when searching
          }

          // Show empty state if no tools match search
          if (categoryTools.length === 0 && !searchQuery && isExpanded) {
            return (
              <div key={category} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCategory(category);
                    }
                  }}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-expanded={isExpanded}
                  aria-controls={`category-${category}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-cyan-400">{categoryIcon}</div>
                    <div className="text-left">
                      <div className="font-bold text-white text-lg">{category}</div>
                      <div className="text-sm text-slate-400">0 tools</div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="text-slate-400" size={24} aria-hidden="true" />
                  ) : (
                    <ChevronDown className="text-slate-400" size={24} aria-hidden="true" />
                  )}
                </button>
                {isExpanded && (
                  <div id={`category-${category}`} className="p-6 pt-0 border-t border-slate-800">
                    <div className="text-center py-8 text-slate-400">
                      <p>No tools in this category match your filters.</p>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={category}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCategory(category);
                  }
                }}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-expanded={isExpanded}
                aria-controls={`category-${category}`}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category} category`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-cyan-400">{categoryIcon}</div>
                  <div className="text-left">
                    <div className="font-bold text-white text-lg">{category}</div>
                    <div className="text-sm text-slate-400">
                      {categoryTools.length} tools
                      {categoryAvg !== null && (
                        <span className="ml-2 text-cyan-400">
                          • Avg: {categoryAvg}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-slate-400" size={24} />
                ) : (
                  <ChevronDown className="text-slate-400" size={24} />
                )}
              </button>

              {/* Tool Grid (when expanded) */}
              {isExpanded && (
                <div 
                  id={`category-${category}`} 
                  className="p-6 pt-0 border-t border-slate-800 animate-in fade-in slide-in-from-top duration-200"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryTools.map(tool => {
                      const isSelected = selectedTools.some(st => st.toolId === tool.id);
                      const selectedTool = selectedTools.find(st => st.toolId === tool.id);
                      const utilization = selectedTool?.utilization || 5;

                      return (
                        <div
                          key={tool.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/20'
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {/* Tool Name and Badge */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div
                                className={`font-semibold mb-1 ${
                                  isSelected ? 'text-cyan-400' : 'text-white'
                                }`}
                              >
                                {tool.name}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {tool.recommendedFor.map(size => (
                                  <span
                                    key={size}
                                    className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded"
                                  >
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => toggleTool(tool.id)}
                              className={`p-3 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                                isSelected
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                              }`}
                              aria-label={isSelected ? `Deselect ${tool.name}` : `Select ${tool.name}`}
                              aria-pressed={isSelected}
                            >
                              {isSelected ? (
                                <CheckCircle2 size={20} aria-hidden="true" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-slate-500 rounded" aria-hidden="true" />
                              )}
                            </button>
                          </div>

                          {/* Utilization Slider (if selected) */}
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-slate-400">Utilization</label>
                                <span className="text-sm font-bold text-cyan-400">
                                  {utilization}/10
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={utilization}
                                onChange={(e) => updateUtilization(tool.id, parseInt(e.target.value))}
                                className="w-full h-2 sm:h-2 md:h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                                style={{
                                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(utilization / 10) * 100}%, #1e293b ${(utilization / 10) * 100}%, #1e293b 100%)`,
                                  minHeight: '44px',
                                  touchAction: 'manipulation'
                                }}
                                aria-label={`Utilization score for ${tool.name}`}
                                aria-valuemin={1}
                                aria-valuemax={10}
                                aria-valuenow={utilization}
                                aria-valuetext={`${utilization} out of 10`}
                              />
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Barely using</span>
                                <span>Fully optimized</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 bg-slate-950/95 backdrop-blur rounded-xl p-4 border border-slate-800 flex justify-center">
        <button
          onClick={handleSave}
          disabled={selectedTools.length === 0 || isSaving}
          className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 min-h-[44px] ${
            selectedTools.length > 0 && !isSaving
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25 transform hover:-translate-y-0.5'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          aria-label={selectedTools.length > 0 
            ? `Save tech stack with ${selectedTools.length} tool${selectedTools.length !== 1 ? 's' : ''}`
            : 'Select at least one tool to save'}
          aria-disabled={selectedTools.length === 0 || isSaving}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Saving...
            </span>
          ) : selectedTools.length > 0 ? (
            <span className="flex items-center gap-2">
              Save Tech Stack ({selectedTools.length} tools)
            </span>
          ) : (
            'Select at least one tool to save'
          )}
        </button>
      </div>
    </div>
  );
};

// Memoize TechStackAudit to prevent re-renders when parent updates
export const TechStackAudit = React.memo(TechStackAuditComponent);
