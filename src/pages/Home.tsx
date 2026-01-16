import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackPageView, trackEvent } from '../utils/analytics';
import { logger } from '../utils/logger';
import { 
  ArrowRight, Plane, Clock, Check, Shield,
  ClipboardCheck, BarChart3, Map, Info, X, Compass, HelpCircle, BookOpen, Sparkles
} from 'lucide-react';
import { HelpCenter } from '../components/HelpCenter';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showExplainer, setShowExplainer] = useState(false);
  const [showTourOffer, setShowTourOffer] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  // Lazy load driver.js only when tour is needed
  const loadDriver = async () => {
    const driverModule = await import('driver.js');
    await import('driver.js/dist/driver.css');
    return driverModule.driver;
  };

  // Track page view
  useEffect(() => {
    trackPageView('/');
  }, []);

  // Check if user has seen explainer and should see tour offer
  useEffect(() => {
    const hasSeenExplainer = localStorage.getItem('hasSeenExplainer');
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    const hasCompletedAssessment = localStorage.getItem('assessmentResults');

    if (hasSeenExplainer && !hasSeenTour && !hasCompletedAssessment) {
      // Wait 1 second after explainer closes
      const timer = setTimeout(() => {
        setShowTourOffer(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Track when explainer is closed
  const handleExplainerClose = () => {
    setShowExplainer(false);
    localStorage.setItem('hasSeenExplainer', 'true');
    
    // Check if we should show tour offer
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    const hasCompletedAssessment = localStorage.getItem('assessmentResults');
    
    if (!hasSeenTour && !hasCompletedAssessment) {
      setTimeout(() => {
        setShowTourOffer(true);
      }, 1000);
    }
  };

  // Start tour - lazy load driver.js when tour is actually started
  const startTour = async () => {
    setShowTourOffer(false);
    localStorage.setItem('hasSeenTour', 'true');
    trackEvent('tour_started', { location: 'home' });
    
    try {
      const driver = await loadDriver();
      
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: '#start-assessment-btn',
            popover: {
              title: 'Step 1: Take the Assessment',
              description: 'Click here to start your 5-minute marketing maturity assessment. Answer 10 questions about your capabilities.',
              side: 'bottom',
              align: 'center'
            }
          },
          {
            element: '#how-it-works',
            popover: {
              title: "Here's What Happens",
              description: "You'll answer questions, get scored, and see your results on a visual journey map.",
              side: 'top',
              align: 'center'
            }
          },
          {
            element: '#example-results',
            popover: {
              title: 'Your Results',
              description: 'Get your altitude score (0-100), plane level (Grounded to Airbus 380), and personalized scenarios for growth.',
              side: 'top',
              align: 'center'
            }
          },
          {
            popover: {
              title: 'Ready to Start?',
              description: 'Click "Start Your Assessment" to begin your marketing journey!',
              side: 'left',
              align: 'center'
            }
          }
        ],
        onDestroyStarted: () => {
          driverObj.destroy();
        }
      });

      driverObj.drive();
    } catch (error) {
      logger.error('Failed to load tour:', error);
    }
  };

  // Dismiss tour offer
  const dismissTourOffer = () => {
    setShowTourOffer(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Tighter Spacing */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Logo/Icon - reduced margin */}
          <div className="mb-4">
            <div className="inline-block p-3 bg-cyan-500/10 rounded-full">
              <Plane className="w-14 h-14 md:w-16 md:h-16 text-cyan-400" />
            </div>
          </div>

          {/* Headline - tighter spacing */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              Map Your Marketing Journey
            </h1>
            <button
              onClick={() => setShowExplainer(true)}
              className="text-slate-400 hover:text-cyan-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded"
              aria-label="Why aviation metaphor?"
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Subheadline - tighter spacing */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-2">
            Assess your marketing maturity in 5 minutes
          </p>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-6 max-w-3xl mx-auto">
            Get your current "altitude," see where you can go next, and receive 
            a personalized 90-day roadmap — all free, all self-service.
          </p>

          {/* CTA Button */}
          <button
            id="start-assessment-btn"
            onClick={() => {
              trackEvent('cta_clicked', { location: 'hero' });
              navigate('/assessment');
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 sm:px-10 md:px-12 py-4 rounded-lg text-base sm:text-lg md:text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 mb-4 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="Start your marketing maturity assessment"
          >
            Start Quick Scan
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>

          {/* Trust indicators - tighter spacing */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              5 minutes
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              No signup required
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Free forever
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide - Tighter Spacing */}
      <div className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 border-y border-cyan-500/20 py-8 md:py-10 -mt-4">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl">
                  <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    New to Flight Planner?
                  </h2>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">
                    Start Here
                  </span>
                </div>
                <p className="text-slate-300 mb-3 text-sm md:text-base">
                  Understand the aviation metaphor before you begin. Learn what plane levels mean, 
                  how cities represent capabilities, and why routes unlock as you grow.
                </p>
                <div className="flex flex-wrap items-center gap-3">
          <button
                    onClick={() => {
                      setShowHelpCenter(true);
                      trackEvent('help_opened', { location: 'home', source: 'getting_started' });
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg"
                  >
                    <HelpCircle className="w-5 h-5" />
                    Open Complete Guide
                  </button>
                  <button
                    onClick={() => setShowExplainer(true)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Quick Overview
          </button>
        </div>
      </div>

              {/* Visual Elements */}
              <div className="hidden md:flex flex-col gap-2 text-2xl">
                <div className="opacity-60">🛬</div>
                <div className="opacity-80">✈️</div>
                <div className="opacity-100">🚀</div>
              </div>
            </div>

            {/* Quick Tips Grid */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
                  <Plane className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                  <div className="font-semibold text-white text-sm mb-1">Plane Levels</div>
                  <div className="text-xs text-slate-400">
                    Grounded → Puddle Jumper → Regional Jet → Commercial Jet → Airbus 380
              </div>
            </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                  <Map className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                  <div className="font-semibold text-white text-sm mb-1">Cities = Capabilities</div>
                  <div className="text-xs text-slate-400">
                    Each city represents a marketing function (Content, ABM, Demand Gen, etc.)
              </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
              <div>
                  <div className="font-semibold text-white text-sm mb-1">Routes Unlock</div>
                  <div className="text-xs text-slate-400">
                    As you improve, new growth paths become available between capabilities
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
              </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-slate-900 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-10">
            How It Works
            </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
              <div className="inline-block p-4 bg-cyan-500/10 rounded-full mb-4">
                <ClipboardCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                1. Take the Assessment
              </h3>
              <p className="text-slate-400">
                Answer 10 questions about your marketing capabilities across 
                strategy, content, demand gen, and more.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
              <div className="inline-block p-4 bg-purple-500/10 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                    </div>
              <h3 className="text-xl font-bold text-white mb-3">
                2. See Your Results
              </h3>
              <p className="text-slate-400">
                Get your marketing "altitude" score, plane level (Grounded to Airbus 380), 
                and REAO metrics breakdown.
              </p>
                      </div>

            {/* Step 3 */}
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
              <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-4">
                <Map className="w-8 h-8 text-yellow-400" />
                    </div>
              <h3 className="text-xl font-bold text-white mb-3">
                3. Get Your Roadmap
              </h3>
              <p className="text-slate-400">
                See personalized scenarios and a visual journey map showing 
                your next destinations and growth path.
              </p>
                      </div>

                      </div>

          {/* CTA Repeat - tighter spacing */}
          <div className="text-center mt-8 md:mt-10">
                    <button
              onClick={() => {
                trackEvent('cta_clicked', { location: 'how-it-works' });
                navigate('/assessment');
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3 rounded-lg text-base sm:text-lg font-bold inline-flex items-center gap-2 min-h-[44px] active:scale-95 transition-all"
            >
              Start Quick Scan
              <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                </div>
                </div>

      {/* What You'll Get Section - Tighter Spacing */}
      <div id="example-results" className="bg-slate-950 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What You'll Get
          </h2>
          
          <p className="text-lg text-slate-400 mb-8">
            See your marketing maturity visualized in a way that makes sense
          </p>

          <div className="bg-slate-900 p-6 sm:p-8 md:p-12 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
              
              {/* Score */}
              <div>
                <div className="text-5xl font-bold text-cyan-400 mb-2">72</div>
                <div className="text-slate-400">Your Altitude Score</div>
              </div>

              {/* Plane Level */}
              <div>
                <div className="text-4xl mb-2">✈️</div>
                <div className="text-xl font-bold text-white mb-1">Regional Jet</div>
                <div className="text-slate-400 text-sm">Your Current Level</div>
              </div>

              {/* Miles */}
              <div>
                <div className="text-5xl font-bold text-purple-400 mb-2">2,400</div>
                <div className="text-slate-400">Flight Miles Earned</div>
              </div>

            </div>

            <p className="text-slate-300 text-sm">
              Plus: detailed REAO metrics, unlocked routes, personalized recommendations, 
              and a visual journey map showing your path forward.
            </p>
          </div>

        </div>
      </div>

      {/* Final CTA Section - Tighter Spacing */}
      <div className="bg-slate-900 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Discover Your Marketing Altitude?
          </h2>
          
          <p className="text-lg text-slate-400 mb-8">
            Join marketing teams who've mapped their journey and unlocked their growth potential.
          </p>

          <button 
            onClick={() => {
              trackEvent('cta_clicked', { location: 'final-cta' });
              navigate('/assessment');
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 sm:px-10 md:px-12 py-4 rounded-lg text-lg sm:text-xl font-bold inline-flex items-center gap-3 min-h-[44px] active:scale-95 transition-all"
          >
            Start Your Assessment
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

                </div>
                </div>

      {/* Footer - Minimal Spacing */}
      <footer className="bg-slate-950 py-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p className="mb-2">© 2024 Marketing Flight Planner. All systems operational.</p>
            <p>
              Built by a marketing leader who wished this existed 5 years ago.
            </p>
              </div>
        </div>
      </footer>

      {/* Explainer Modal */}
      {showExplainer && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300"
          onClick={() => handleExplainerClose()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleExplainerClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="explainer-title"
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-8 relative animate-in fade-in slide-in-from-bottom duration-300 delay-100"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close button */}
              <button
              onClick={handleExplainerClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close explainer modal"
              autoFocus
            >
              <X className="w-6 h-6" aria-hidden="true" />
              </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-lg" aria-hidden="true">
                <Plane className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 id="explainer-title" className="text-3xl font-bold text-white">
                Why Aviation?
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-4 text-slate-300">
              
              <p className="text-lg">
                Marketing maturity is a <span className="text-cyan-400 font-semibold">journey</span> - 
                and every journey needs a map.
              </p>

              <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                <p className="font-semibold text-white mb-2">
                  🛫 The Metaphor:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• <strong className="text-cyan-400">Cities</strong> = Marketing capabilities (Content, Demand Gen, ABM, etc.)</li>
                  <li>• <strong className="text-purple-400">Routes</strong> = Growth paths between capabilities</li>
                  <li>• <strong className="text-yellow-400">Plane Level</strong> = Your marketing maturity (Grounded → Airbus 380)</li>
                  <li>• <strong className="text-green-400">Flight Miles</strong> = Progress you've made on your journey</li>
                  <li>• <strong className="text-blue-400">Altitude</strong> = Your overall score (0-100)</li>
                </ul>
            </div>

              <p>
                Just like a flight journey, marketing growth happens in stages. 
                You start on the ground, build your foundation, take off, reach cruising 
                altitude, and eventually unlock long-haul international routes.
              </p>

              <p>
                This tool maps <span className="text-cyan-400">where you are today</span>, 
                shows <span className="text-purple-400">where you can go next</span>, 
                and gives you <span className="text-yellow-400">a clear flight plan</span> to get there.
              </p>

              <div className="bg-slate-800/50 p-4 rounded-lg mt-6">
                <p className="text-sm text-slate-400 italic">
                  💡 Pro tip: Your "plane level" unlocks new routes. A Puddle Jumper 
                  can't fly to Tokyo, but a Regional Jet can. Build your capabilities, 
                  level up your plane, unlock more destinations.
                </p>
                </div>

              </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'explainer-modal' });
                  handleExplainerClose();
                  navigate('/assessment');
                }}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px]"
                aria-label="Start assessment after reading explanation"
              >
                Got It - Start Assessment
              </button>
              <button
                onClick={() => {
                  handleExplainerClose();
                  setShowHelpCenter(true);
                  trackEvent('help_opened', { location: 'home', source: 'explainer_modal' });
                }}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px] inline-flex items-center justify-center gap-2"
                aria-label="View complete guide"
              >
                <BookOpen className="w-4 h-4" />
                View Full Guide
              </button>
              <button
                onClick={handleExplainerClose}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded min-h-[44px]"
                aria-label="Close explainer modal"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tour Offer */}
      {showTourOffer && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto animate-fade-in">
          <div className="bg-purple-600 p-4 rounded-lg shadow-2xl border border-purple-400">
            <div className="flex items-start gap-3">
              <Compass className="w-6 h-6 text-white flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1 text-sm sm:text-base">
                  Want a quick tour?
                </h4>
                <p className="text-xs sm:text-sm text-purple-100 mb-3">
                  See what you'll get in just 30 seconds
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={startTour}
                    className="flex-1 bg-white text-purple-600 px-3 py-2 rounded text-sm font-semibold hover:bg-purple-50 transition-colors min-h-[44px]"
                  >
                    Show Me
                  </button>
                  <button
                    onClick={dismissTourOffer}
                    className="px-3 py-2 text-purple-100 hover:text-white text-sm transition-colors min-h-[44px]"
                  >
                    Skip
                  </button>
        </div>
        </div>
              <button
                onClick={dismissTourOffer}
                className="text-purple-200 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
        </div>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      <HelpCenter 
        isOpen={showHelpCenter} 
        onClose={() => setShowHelpCenter(false)}
      />
    </div>
  );
};
