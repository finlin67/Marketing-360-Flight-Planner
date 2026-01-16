import React from 'react';
import { createPortal } from 'react-dom';
import { X, Plane, MapPin, ClipboardCheck, Database, Map, Target, TrendingUp, Zap, Rocket, ArrowRight } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartJourney?: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onStartJourney }) => {
  if (!isOpen) return null;

  const handleStartJourney = () => {
    onClose();
    if (onStartJourney) {
      onStartJourney();
    }
  };

  const guideContent = [
    {
      icon: <Plane className="text-cyan-400" size={24} />,
      title: 'Choose Your Journey',
      description: 'Select where you are (FROM) and where you want to go (TO)',
    },
    {
      icon: <ClipboardCheck className="text-cyan-400" size={24} />,
      title: 'Take Assessment',
      description: 'Answer 10-25 questions to determine your current altitude',
    },
    {
      icon: <Database className="text-cyan-400" size={24} />,
      title: 'Audit Tech Stack',
      description: 'Inventory your tools to boost your score by 30%',
    },
    {
      icon: <Map className="text-cyan-400" size={24} />,
      title: 'View Journey Map',
      description: 'See your personalized route on an interactive world map',
    },
    {
      icon: <Target className="text-cyan-400" size={24} />,
      title: 'Get Recommendations',
      description: 'Receive scenario-based action plans',
    },
    {
      icon: <TrendingUp className="text-cyan-400" size={24} />,
      title: 'Track Progress',
      description: 'Monitor your plane level, flight miles, and REAO metrics',
    },
  ];

  const concepts = [
    {
      term: 'Plane Level',
      definition: 'Your marketing maturity (Grounded → Puddle Jumper → Regional Jet → Commercial Jet → Airbus 380)',
    },
    {
      term: 'Flight Miles',
      definition: 'Gamification points earned from assessments and improvements',
    },
    {
      term: 'Routes',
      definition: 'Growth paths between marketing capabilities (cities)',
    },
    {
      term: 'Altitude Score',
      definition: 'Combined score from assessment (70%) + tech stack (30%)',
    },
  ];

  const gettingStartedPaths = [
    {
      icon: <Zap className="text-emerald-400" size={20} />,
      title: 'Quick Path',
      description: 'Take 10-minute Quick Scan → View Results',
    },
    {
      icon: <Rocket className="text-purple-400" size={20} />,
      title: 'Comprehensive Path',
      description: 'Deep Dive Assessment → Tech Stack Audit → Journey Map',
    },
    {
      icon: <MapPin className="text-cyan-400" size={20} />,
      title: 'Explore First',
      description: 'Check out the Journey Map to see all possibilities',
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Plane className="text-cyan-400 transform -rotate-45" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome to Your Marketing Flight Planner ✈️
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Your guide to navigating marketing maturity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* What Is This? */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-cyan-400">1.</span> What Is This?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              An interactive tool that maps your marketing journey as a flight path. Each marketing function is a city, 
              and your growth is measured in altitude and flight miles.
            </p>
          </section>

          {/* How It Works */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">2.</span> How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guideContent.map((step, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                      <p className="text-sm text-slate-400">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Concepts */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">3.</span> Key Concepts
            </h3>
            <div className="space-y-3">
              {concepts.map((concept, index) => (
                <div
                  key={index}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 border-l-4 border-l-cyan-500"
                >
                  <h4 className="font-semibold text-cyan-400 mb-1">{concept.term}</h4>
                  <p className="text-sm text-slate-300">{concept.definition}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">4.</span> Getting Started
            </h3>
            <p className="text-slate-300 mb-4">
              Start with one of these paths:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gettingStartedPaths.map((path, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {path.icon}
                    <h4 className="font-semibold text-white">{path.title}</h4>
                  </div>
                  <p className="text-sm text-slate-400">{path.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why This Matters */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-cyan-400">5.</span> Why This Matters
            </h3>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-slate-300 leading-relaxed">
                This tool helps you visualize complex marketing operations as an intuitive journey, making it easier to 
                prioritize initiatives, justify budgets, and communicate strategy.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleStartJourney}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Start Journey
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

