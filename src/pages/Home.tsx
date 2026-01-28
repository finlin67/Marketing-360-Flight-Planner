import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackPageView, trackEvent } from '../utils/analytics';
import { logger } from '../utils/logger';
import { 
  ArrowRight, Plane, Clock, Check, Shield,
  ClipboardCheck, BarChart3, Map, Info, X, Compass, HelpCircle, BookOpen, Sparkles
} from 'lucide-react';
import { HelpCenter } from '../components/HelpCenter';
import { HeroParallaxBackground } from '../components/HeroParallaxBackground';
import { HeroPlaneIllustration } from '../components/HeroPlaneIllustration';
import { HeroFlightGauges } from '../components/HeroFlightGauges';
import { StaggeredHeadline } from '../components/StaggeredHeadline';
import { ScrollSection } from '../components/ScrollSection';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
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
    <div className="min-h-screen bg-gradient-flight">
      {/* Hero Section - Parallax, plane SVG, radar, gauges, staggered headline */}
      <section
        ref={heroRef}
        className="relative bg-gradient-flight flex items-center justify-center px-6 pt-16 pb-20 md:pt-20 md:pb-24 min-h-[520px] md:min-h-[560px]"
      >
        <HeroParallaxBackground heroRef={heroRef} />
        <HeroPlaneIllustration />
        <HeroFlightGauges />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="inline-block p-3 glass-card rounded-full glow-cyan animate-glow-pulse"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Plane className="w-14 h-14 md:w-16 md:h-16 text-cyan-400" />
            </motion.div>
          </motion.div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 flex-wrap">
            <StaggeredHeadline
              text="Map Your Marketing Journey"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white"
              delay={0.12}
              stagger={0.028}
            />
            <motion.button
              onClick={() => setShowExplainer(true)}
              className="text-slate-400 hover:text-cyan-400 transition-colors min-w-[44px] min-h-[44px] flex-shrink-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded"
              aria-label="Why aviation metaphor?"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </motion.button>
          </div>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            Assess your marketing maturity in 5 minutes
          </motion.p>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl text-slate-400 mb-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            Get your current &quot;altitude,&quot; see where you can go next, and receive 
            a personalized 90-day roadmap — all free, all self-service.
          </motion.p>

          <motion.button
            id="start-assessment-btn"
            onClick={() => {
              trackEvent('cta_clicked', { location: 'hero' });
              navigate('/assessment/preflight');
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 sm:px-10 md:px-12 py-4 rounded-lg text-base sm:text-lg md:text-xl font-bold shadow-glow-cyan animate-cta-glow-pulse inline-flex items-center gap-3 mb-4 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="Start your marketing maturity assessment"
            whileHover={{ scale: 1.05, boxShadow: '0 0 36px rgba(6, 182, 212, 0.6), 0 0 72px rgba(6, 182, 212, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Start Quick Scan
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </motion.button>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* Getting Started Guide - Glassmorphism, scroll animation */}
      <ScrollSection>
        <div className="bg-gradient-flight-section border-y border-cyan-500/20 py-8 md:py-10 -mt-4">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-card rounded-2xl p-6 md:p-8 shadow-2xl transition-all duration-300 hover:shadow-glow-cyan">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <motion.div
                    className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl glass"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
                  </motion.div>
                </div>

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
                    <motion.button
                      onClick={() => {
                        setShowHelpCenter(true);
                        trackEvent('help_opened', { location: 'home', source: 'getting_started' });
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 shadow-lg glow-cyan-hover animate-cta-glow-pulse"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <HelpCircle className="w-5 h-5" />
                      Open Complete Guide
                    </motion.button>
                    <motion.button
                      onClick={() => setShowExplainer(true)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-2"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Info className="w-4 h-4" />
                      Quick Overview
                    </motion.button>
                  </div>
                </div>

                <div className="hidden md:flex flex-col gap-2 text-2xl">
                  <div className="opacity-60">🛬</div>
                  <div className="opacity-80">✈️</div>
                  <div className="opacity-100">🚀</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                <motion.div className="flex items-start gap-3" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
                    <Plane className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">Plane Levels</div>
                    <div className="text-xs text-slate-400">
                      Grounded → Puddle Jumper → Regional Jet → Commercial Jet → Airbus 380
                    </div>
                  </div>
                </motion.div>
                <motion.div className="flex items-start gap-3" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                    <Map className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">Cities = Capabilities</div>
                    <div className="text-xs text-slate-400">
                      Each city represents a marketing function (Content, ABM, Demand Gen, etc.)
                    </div>
                  </div>
                </motion.div>
                <motion.div className="flex items-start gap-3" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <div className="p-2 bg-yellow-500/10 rounded-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">Routes Unlock</div>
                    <div className="text-xs text-slate-400">
                      As you improve, new growth paths become available between capabilities
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* How It Works Section - Scroll animations, glass cards, hover glow */}
      <section id="how-it-works" className="bg-gradient-flight-section py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-10">
              How It Works
            </h2>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ScrollSection delay={0.1}>
              <motion.div
                className="glass-card p-8 rounded-xl text-center transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(6, 182, 212, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
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
              </motion.div>
            </ScrollSection>

            <ScrollSection delay={0.2}>
              <motion.div
                className="glass-card p-8 rounded-xl text-center transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(139, 92, 246, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <div className="inline-block p-4 bg-purple-500/10 rounded-full mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  2. See Your Results
                </h3>
                <p className="text-slate-400">
                  Get your marketing &quot;altitude&quot; score, plane level (Grounded to Airbus 380), 
                  and REAO metrics breakdown.
                </p>
              </motion.div>
            </ScrollSection>

            <ScrollSection delay={0.3}>
              <motion.div
                className="glass-card p-8 rounded-xl text-center transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(234, 179, 8, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
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
              </motion.div>
            </ScrollSection>
          </div>

          <ScrollSection delay={0.2}>
            <div className="text-center mt-8 md:mt-10">
              <motion.button
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'how-it-works' });
                  navigate('/assessment/preflight');
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-3 rounded-lg text-base sm:text-lg font-bold inline-flex items-center gap-2 min-h-[44px] shadow-glow-cyan animate-cta-glow-pulse"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Start Quick Scan
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* What You'll Get Section - Glass card, scroll animation */}
      <section id="example-results" className="bg-gradient-flight py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What You&apos;ll Get
            </h2>
          </ScrollSection>
          <ScrollSection delay={0.08}>
            <p className="text-lg text-slate-400 mb-8">
              See your marketing maturity visualized in a way that makes sense
            </p>
          </ScrollSection>

          <ScrollSection delay={0.12}>
            <motion.div
              className="glass-card p-6 sm:p-8 md:p-12 rounded-2xl transition-all duration-300"
              whileHover={{ boxShadow: '0 0 32px rgba(6, 182, 212, 0.15), 0 0 48px rgba(139, 92, 246, 0.1)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
                <div>
                  <div className="text-5xl font-bold text-cyan-400 mb-2">72</div>
                  <div className="text-slate-400">Your Altitude Score</div>
                </div>
                <div>
                  <div className="text-4xl mb-2">✈️</div>
                  <div className="text-xl font-bold text-white mb-1">Regional Jet</div>
                  <div className="text-slate-400 text-sm">Your Current Level</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-purple-400 mb-2">2,400</div>
                  <div className="text-slate-400">Flight Miles Earned</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Plus: detailed REAO metrics, unlocked routes, personalized recommendations, 
                and a visual journey map showing your path forward.
              </p>
            </motion.div>
          </ScrollSection>
        </div>
      </section>

      {/* Final CTA Section - Gradient, scroll animation, glow CTA */}
      <section className="bg-gradient-flight-section py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Discover Your Marketing Altitude?
            </h2>
          </ScrollSection>
          <ScrollSection delay={0.08}>
            <p className="text-lg text-slate-400 mb-8">
              Join marketing teams who&apos;ve mapped their journey and unlocked their growth potential.
            </p>
          </ScrollSection>
          <ScrollSection delay={0.12}>
            <motion.button
              onClick={() => {
                trackEvent('cta_clicked', { location: 'final-cta' });
                navigate('/assessment/preflight');
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 sm:px-10 md:px-12 py-4 rounded-lg text-lg sm:text-xl font-bold inline-flex items-center gap-3 min-h-[44px] shadow-glow-cyan animate-cta-glow-pulse"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Start Your Assessment
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </ScrollSection>
        </div>
      </section>

      <footer className="bg-gradient-flight py-8 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p className="mb-2">© 2024 Marketing Flight Planner. All systems operational.</p>
            <p>
              Built by a marketing leader who wished this existed 5 years ago.
            </p>
              </div>
        </div>
      </footer>

      {/* Explainer Modal - Glassmorphism, micro-interactions */}
      {showExplainer && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6"
          onClick={() => handleExplainerClose()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleExplainerClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="explainer-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="glass-card rounded-2xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <motion.button
              onClick={handleExplainerClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close explainer modal"
              autoFocus
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </motion.button>

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

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => {
                  trackEvent('cta_clicked', { location: 'explainer-modal' });
                  handleExplainerClose();
                  navigate('/assessment/preflight');
                }}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px] shadow-glow-cyan"
                aria-label="Start assessment after reading explanation"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Got It - Start Assessment
              </motion.button>
              <motion.button
                onClick={() => {
                  handleExplainerClose();
                  setShowHelpCenter(true);
                  trackEvent('help_opened', { location: 'home', source: 'explainer_modal' });
                }}
                className="px-6 py-3 glass hover:border-cyan-500/30 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 min-h-[44px] inline-flex items-center justify-center gap-2"
                aria-label="View complete guide"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <BookOpen className="w-4 h-4" />
                View Full Guide
              </motion.button>
              <motion.button
                onClick={handleExplainerClose}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded min-h-[44px]"
                aria-label="Close explainer modal"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      )}

      {/* Tour Offer - Glassmorphism, micro-interactions */}
      {showTourOffer && (
        <motion.div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="glass-card p-4 rounded-xl shadow-2xl border-purple-500/30 flex items-start gap-3">
            <Compass className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white mb-1 text-sm sm:text-base">
                Want a quick tour?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-3">
                See what you&apos;ll get in just 30 seconds
              </p>
              <div className="flex gap-2">
                <motion.button
                  onClick={startTour}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white px-3 py-2 rounded-lg text-sm font-semibold min-h-[44px]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  Show Me
                </motion.button>
                <motion.button
                  onClick={dismissTourOffer}
                  className="px-3 py-2 text-slate-400 hover:text-white text-sm transition-colors min-h-[44px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip
                </motion.button>
              </div>
            </div>
            <motion.button
              onClick={dismissTourOffer}
              className="text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Help Center Modal */}
      <HelpCenter 
        isOpen={showHelpCenter} 
        onClose={() => setShowHelpCenter(false)}
      />
    </div>
  );
};
