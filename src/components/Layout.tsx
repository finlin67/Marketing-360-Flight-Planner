import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useUser, PLANE_LEVELS } from '../context/UserContext';
import { SCENARIOS } from '../data/staticData';
import { Plane, Map, Menu, X, ClipboardCheck, ChevronRight, BarChart3, Home, Database, Layers, Sliders, FileText, ChevronDown, Check, Zap, Sparkles, HelpCircle } from 'lucide-react';
import { HelpCenter } from './HelpCenter';

interface LayoutProps {
  children: React.ReactNode;
}

// Breadcrumb helper function
const getBreadcrumbs = (
  pathname: string, 
  params?: Record<string, string | undefined>
): Array<{ label: string; path: string }> => {
  const breadcrumbs: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' }
  ];

  // Remove hash if present (HashRouter)
  const cleanPath = pathname.replace('#', '');

  if (cleanPath === '/') {
    return breadcrumbs;
  }

  // Handle assessment paths
  if (cleanPath === '/assessments') {
    breadcrumbs.push({ label: 'Choose Assessment', path: '/assessments' });
    return breadcrumbs;
  } else if (cleanPath.startsWith('/assessment')) {
    breadcrumbs.push({ label: 'Take Assessment', path: '/assessment' });
    if (cleanPath === '/assessment/quick') {
      breadcrumbs.push({ label: 'Quick Scan', path: '/assessment/quick' });
    } else if (cleanPath === '/assessment/deep') {
      breadcrumbs.push({ label: 'Deep Dive', path: '/assessment/deep' });
    }
    return breadcrumbs;
  }

  // Handle scenario detail pages
  if (cleanPath.startsWith('/scenarios/') && params?.id) {
    breadcrumbs.push({ label: 'Scenarios', path: '/scenarios' });
    const scenario = SCENARIOS.find((s) => s.id === params.id);
    if (scenario) {
      breadcrumbs.push({ label: scenario.title, path: cleanPath });
    } else {
      breadcrumbs.push({ label: 'Scenario Details', path: cleanPath });
    }
    return breadcrumbs;
  }

  // Map other paths
  const pathMap: Record<string, string> = {
    '/assessments': 'Choose Assessment',
    '/assessment': 'Take Assessment',
    '/tech-stack': 'Tech Stack Audit',
    '/results': 'View Results',
    '/journey-map': 'Journey Map',
    '/simulator': 'What-If Simulator',
    '/scenarios': 'Scenarios',
    '/flight-log': 'Flight Log',
  };

  const label = pathMap[cleanPath];
  if (label) {
    breadcrumbs.push({ label, path: cleanPath });
  }

  return breadcrumbs;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const params = useParams();
  const { combinedScore, planeLevel, flightMiles, assessmentResponses, techStack, getAssessmentHistory } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEnhanceMenu, setShowEnhanceMenu] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const enhanceMenuRef = useRef<HTMLDivElement>(null);

  const hasCompletedAssessment = assessmentResponses.length > 0;
  const hasCompletedTechStack = techStack.length > 0;
  
  // Check if Deep Dive is completed
  const hasCompletedDeepDive = useMemo(() => {
    const history = getAssessmentHistory();
    return history.some(entry => entry.assessmentType === 'deep');
  }, [getAssessmentHistory]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    let completed = 0;
    if (hasCompletedAssessment) completed++;
    if (hasCompletedTechStack) completed++;
    if (hasCompletedDeepDive) completed++;
    return Math.round((completed / 3) * 100);
  }, [hasCompletedAssessment, hasCompletedTechStack, hasCompletedDeepDive]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showEnhanceMenu && enhanceMenuRef.current && !enhanceMenuRef.current.contains(e.target as Node)) {
        setShowEnhanceMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEnhanceMenu]);

  const currentPlaneLevel = PLANE_LEVELS.find(l => 
    combinedScore >= l.minScore && combinedScore <= l.maxScore
  ) || PLANE_LEVELS[0];

  const breadcrumbs = getBreadcrumbs(location.pathname, params);

  const navItems = [
    { 
      label: 'Home', 
      path: '/', 
      icon: <Home size={18} />,
      description: 'Start here'
    },
    { 
      label: 'Take Assessment', 
      path: '/assessment', 
      icon: <ClipboardCheck size={18} />,
      description: '5-minute scan'
    },
    { 
      label: 'Journey Map', 
      path: '/journey-map', 
      icon: <Map size={18} />,
      description: 'Visual journey'
    },
    { 
      label: 'Scenarios', 
      path: '/scenarios', 
      icon: <Layers size={18} />,
      description: 'Full scenario library'
    },
    { 
      label: 'Flight Log', 
      path: '/flight-log', 
      icon: <FileText size={18} />,
      description: 'Progress history'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                <Plane className="text-cyan-400 h-6 w-6 transform -rotate-45" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg tracking-tight">
                  Flight<span className="text-cyan-400">Planner</span>
                </span>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider -mt-1 leading-tight">
                  Marketing Altitude <span className="text-slate-500">•</span> Your Operational Cockpit
                </div>
              </div>
              {/* Mobile: Show abbreviated tagline */}
              <div className="sm:hidden">
                <span className="font-bold text-base tracking-tight">
                  Flight<span className="text-cyan-400">Planner</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-baseline space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/assessment' && location.pathname.startsWith('/assessment'));
                const isDisabled = item.disabled;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed pointer-events-none'
                        : isActive
                        ? 'bg-slate-800 text-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                    title={item.description}
                  >
                    {item.icon}
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}

              {/* Help Button */}
              <button
                onClick={() => setShowHelpCenter(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                aria-label="Open help center"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden md:inline">Help</span>
              </button>

              {/* Your Results Dropdown */}
              <div className="relative enhance-menu-container" ref={enhanceMenuRef}>
                <button
                  onClick={() => setShowEnhanceMenu(!showEnhanceMenu)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${location.pathname.includes('results') || 
                      location.pathname.includes('tech-stack') || 
                      location.pathname.includes('assessment/deep') || 
                      location.pathname.includes('simulator')
                      ? 'bg-cyan-500 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <BarChart3 size={18} />
                  <span className="hidden lg:inline">Your Results</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showEnhanceMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {showEnhanceMenu && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] bg-slate-900 rounded-lg shadow-2xl border border-slate-700 p-6 z-50">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-white font-bold text-lg mb-1">
                        Your Marketing Assessment
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Get deeper insights and more accurate recommendations
                      </p>
                    </div>

                    {/* Grid of Options */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Quick Results */}
                      <Link
                        to="/results"
                        onClick={() => setShowEnhanceMenu(false)}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-cyan-500 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20">
                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1 flex items-center gap-2">
                              Quick Results
                              {hasCompletedAssessment && (
                                <Check className="w-4 h-4 text-emerald-400" />
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              View your score, plane level, and REAO metrics
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Tech Stack Audit */}
                      <Link
                        to="/tech-stack"
                        onClick={() => setShowEnhanceMenu(false)}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-purple-500 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20">
                            <Database className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1 flex items-center gap-2">
                              Tech Stack Audit
                              {hasCompletedTechStack ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                  +30% score
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              Add your tools to boost your score by 30%
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Deep Dive Assessment */}
                      <Link
                        to="/assessment/deep"
                        onClick={() => setShowEnhanceMenu(false)}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-blue-500 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                            <Layers className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1 flex items-center gap-2">
                              Deep Dive Assessment
                              {hasCompletedDeepDive ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                  More accurate
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              25 detailed questions for comprehensive analysis
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* What-If Simulator */}
                      <Link
                        to="/simulator"
                        onClick={() => setShowEnhanceMenu(false)}
                        className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-green-500 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20">
                            <Zap className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-1">
                              What-If Simulator
                            </div>
                            <div className="text-xs text-slate-400">
                              Project future scores based on improvements
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Progress Summary */}
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">
                          Your Completion: {completionPercentage}%
                        </span>
                        <div className="flex gap-2">
                          {hasCompletedAssessment && (
                            <span className="text-emerald-400 text-xs">✓ Assessment</span>
                          )}
                          {hasCompletedTechStack && (
                            <span className="text-emerald-400 text-xs">✓ Tech Stack</span>
                          )}
                          {hasCompletedDeepDive && (
                            <span className="text-emerald-400 text-xs">✓ Deep Dive</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flight Status (Desktop) */}
            {hasCompletedAssessment && (
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Status</div>
                    <div className="text-sm font-bold flex items-center gap-1" style={{ color: currentPlaneLevel.color }}>
                      <span className="text-lg">{currentPlaneLevel.icon}</span>
                      <span>{planeLevel}</span>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-800"></div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Altitude</div>
                    <div className="text-sm font-mono font-bold text-white">{combinedScore}/100</div>
                  </div>
                  <div className="h-10 w-px bg-slate-800"></div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Miles</div>
                    <div className="text-sm font-mono font-bold text-cyan-400">{flightMiles.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/assessment' && location.pathname.startsWith('/assessment'));
                const isDisabled = item.disabled;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed pointer-events-none'
                        : isActive
                        ? 'bg-slate-800 text-cyan-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <div className="flex-1">
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-slate-500">{item.description}</div>
                    )}
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {hasCompletedAssessment && (
              <div className="px-5 py-4 border-t border-slate-800 space-y-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Flight Status</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status:</span>
                  <span className="font-bold text-sm flex items-center gap-1" style={{ color: currentPlaneLevel.color }}>
                    <span>{currentPlaneLevel.icon}</span>
                    <span>{planeLevel}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Altitude:</span>
                  <span className="font-mono font-bold text-sm text-white">{combinedScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Miles:</span>
                  <span className="font-mono font-bold text-sm text-cyan-400">{flightMiles.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Breadcrumb Navigation - Hidden on Journey Map for full-screen experience */}
      {breadcrumbs.length > 1 && location.pathname !== '/journey-map' && location.pathname !== '#/journey-map' && (
        <div className="bg-slate-900/50 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.path}>
                    {isLast ? (
                      <span className="text-cyan-400 font-medium">{crumb.label}</span>
                    ) : (
                      <>
                        <Link
                          to={crumb.path}
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          {crumb.label}
                        </Link>
                        <ChevronRight className="text-slate-600" size={14} />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={location.pathname === '/journey-map' || location.pathname === '#/journey-map' 
        ? '' 
        : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {children}
      </main>

      {/* Help Center Modal */}
      <HelpCenter 
        isOpen={showHelpCenter} 
        onClose={() => setShowHelpCenter(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-500 text-sm space-y-2">
            <p>© 2024 Marketing Flight Planner. All systems operational.</p>
            <p className="text-xs text-slate-600">
              Built with aviation-grade precision for marketing excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
