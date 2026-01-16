import React, { useState } from 'react';
import { 
  X, Plane, MapPin, GitBranch, TrendingUp, Award, ClipboardCheck, Database, Layers,
  MousePointer2, Zap, Plus, Minus, Compass, Maximize, HelpCircle, Navigation2, Target, BarChart3
} from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  iconComponent?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'Overview',
    label: 'Overview',
    icon: '🎯',
    description: 'What is this tool and how to use?',
    iconComponent: <Target className="w-5 h-5" />
  },
  {
    id: 'Planes',
    label: 'Planes',
    icon: '🛬',
    description: 'Why planes? What does each plane represent in the tool.',
    iconComponent: <Plane className="w-5 h-5" />
  },
  {
    id: 'Cities & Routes',
    label: 'Cities',
    icon: '🏙️',
    description: 'How Cities are mapped to Marketing Functions',
    iconComponent: <MapPin className="w-5 h-5" />
  },
  {
    id: 'Scoring',
    label: 'Scoring',
    icon: '📊',
    description: 'How scoring works and what affects your results',
    iconComponent: <BarChart3 className="w-5 h-5" />
  },
  {
    id: 'Journey Map',
    label: 'Journey Map',
    icon: '🗺',
    description: 'Check the Control Center to see how to navigate',
    iconComponent: <Navigation2 className="w-5 h-5" />
  }
];

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose, initialTab = 'Overview' }) => {
  const [helpTab, setHelpTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="bg-slate-900 rounded-2xl max-w-6xl w-full border border-slate-700 relative my-8 flex flex-col h-[90vh] max-h-[900px]">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10"
            aria-label="Close help center"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <Plane className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Flight Planner Guide
                </h2>
                <p className="text-slate-400 text-sm sm:text-base">
                  Understanding your marketing journey
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area - Sidebar + Content */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Sidebar Navigation */}
            <div className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-800/30 flex-shrink-0 overflow-x-auto md:overflow-y-auto">
              <div className="flex md:flex-col p-2 md:p-4 gap-2 md:space-y-2 min-w-max md:min-w-0">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHelpTab(item.id)}
                    className={`
                      text-left p-3 md:p-4 rounded-lg transition-all duration-200 flex-shrink-0
                      w-48 md:w-full
                      ${helpTab === item.id
                        ? 'bg-cyan-500/20 border-l-4 md:border-l-4 border-t-4 md:border-t-0 border-cyan-400 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        text-xl md:text-2xl flex-shrink-0
                        ${helpTab === item.id ? 'scale-110' : ''}
                        transition-transform duration-200
                      `}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-bold text-xs md:text-sm mb-1
                          ${helpTab === item.id ? 'text-cyan-400' : 'text-slate-300'}
                        `}>
                          {item.label}
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed hidden md:block">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 sm:p-8">
            
            {/* OVERVIEW TAB */}
            {helpTab === 'Overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Why Aviation?
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Marketing maturity is a <strong className="text-cyan-400">journey</strong>. 
                    Just like aviation, you start on the ground, build capabilities, take off, 
                    reach cruising altitude, and eventually unlock long-haul international routes.
                  </p>
                  <p className="text-slate-300">
                    This tool maps where you are today, shows where you can go next, and gives 
                    you a clear flight plan to get there.
                  </p>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-white mb-4">The Metaphor Explained:</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/10 rounded flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-cyan-400">Cities</div>
                        <div className="text-sm text-slate-400">
                          Each city represents a marketing capability (Content, Demand Gen, ABM, etc.)
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 rounded flex items-center justify-center">
                        <GitBranch className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-400">Routes</div>
                        <div className="text-sm text-slate-400">
                          Connections between cities showing growth paths and capability dependencies
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/10 rounded flex items-center justify-center">
                        <Plane className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-400">Plane Level</div>
                        <div className="text-sm text-slate-400">
                          Your overall marketing maturity (Grounded → Regional Jet → Commercial Jet → Airbus 380)
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-400">Altitude Score</div>
                        <div className="text-sm text-slate-400">
                          Your score from 0-100 measuring overall marketing capabilities
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                        <Award className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-400">Flight Miles</div>
                        <div className="text-sm text-slate-400">
                          Points earned based on your capabilities - unlock routes by earning miles
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-lg">
                  <p className="text-sm text-cyan-300">
                    💡 <strong>Pro Tip:</strong> Your plane level determines which routes you can fly. 
                    A Puddle Jumper can only handle short domestic routes, but a Commercial Jet can 
                    fly internationally. Build your capabilities to upgrade your plane!
                  </p>
                </div>
              </div>
            )}

            {/* PLANES TAB */}
            {helpTab === 'Planes' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Understanding Plane Levels
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Your plane level represents your marketing organization's overall maturity. 
                    Higher levels unlock more advanced capabilities and longer routes.
                  </p>
                </div>

                {/* Plane Level Cards */}
                <div className="space-y-4">
                  {/* Grounded */}
                  <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🛬</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-xl font-bold text-white">Grounded</h4>
                          <span className="text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded">
                            Score: 0-20
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">
                          Early stage or reactive marketing. Limited processes, tools, and data.
                        </p>
                        <div className="text-sm text-slate-400">
                          <strong className="text-white">What you can do:</strong> Basic email campaigns, 
                          social media posts, simple content creation. Focus on building foundation.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Puddle Jumper */}
                  <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🛩️</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-xl font-bold text-white">Puddle Jumper</h4>
                          <span className="text-sm bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                            Score: 21-40
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">
                          Basic marketing operations in place. Some tools, emerging processes, 
                          starting to track metrics.
                        </p>
                        <div className="text-sm text-slate-400">
                          <strong className="text-white">What you can do:</strong> Lead gen campaigns, 
                          basic marketing automation, content calendar, simple reporting. Can handle 
                          short domestic routes (NYC ↔ Chicago).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Regional Jet */}
                  <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">✈️</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-xl font-bold text-white">Regional Jet</h4>
                          <span className="text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            Score: 41-60
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">
                          Solid marketing foundation. Defined processes, integrated tech stack, 
                          data-driven decisions.
                        </p>
                        <div className="text-sm text-slate-400">
                          <strong className="text-white">What you can do:</strong> Multi-channel campaigns, 
                          ABM programs, attribution modeling, pipeline forecasting. Can fly coast-to-coast 
                          and some international routes.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Commercial Jet */}
                  <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-cyan-500">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🛫</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-xl font-bold text-white">Commercial Jet</h4>
                          <span className="text-sm bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                            Score: 61-80
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">
                          Advanced marketing operations. Sophisticated tech, deep analytics, 
                          cross-functional alignment.
                        </p>
                        <div className="text-sm text-slate-400">
                          <strong className="text-white">What you can do:</strong> Enterprise ABM, 
                          predictive analytics, revenue operations, global campaigns. Can handle 
                          long-haul international routes (NYC ↔ London ↔ Tokyo).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Airbus 380 */}
                  <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">🚀</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-xl font-bold text-white">Airbus 380</h4>
                          <span className="text-sm bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                            Score: 81-100
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">
                          World-class marketing organization. Innovation leader, fully integrated 
                          revenue engine, industry benchmark.
                        </p>
                        <div className="text-sm text-slate-400">
                          <strong className="text-white">What you can do:</strong> AI-powered personalization, 
                          advanced RevOps, global orchestration, market innovation. All routes unlocked - 
                          you can go anywhere.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CITIES & ROUTES TAB */}
            {helpTab === 'Cities & Routes' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Cities & Routes Explained
                  </h3>
                </div>

                {/* Cities Section */}
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    What are Cities?
                  </h4>
                  <p className="text-slate-300 mb-4">
                    Each city on the journey map represents a specific marketing capability 
                    or function. Cities are grouped by regions (North America, Europe, Asia, etc.).
                  </p>

                  <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🗽 New York City</div>
                        <div className="text-slate-400">Content Marketing & Brand Storytelling</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🏙️ Chicago</div>
                        <div className="text-slate-400">Sales & Marketing Alignment</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🌉 San Francisco</div>
                        <div className="text-slate-400">Marketing Technology & Innovation</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇬🇧 London</div>
                        <div className="text-slate-400">Demand Generation & Pipeline</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇨🇦 Toronto</div>
                        <div className="text-slate-400">Account-Based Marketing (ABM)</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇫🇷 Paris</div>
                        <div className="text-slate-400">Brand Strategy & Positioning</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇩🇪 Berlin</div>
                        <div className="text-slate-400">Marketing Operations & Process</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇸🇪 Stockholm</div>
                        <div className="text-slate-400">Data & Analytics</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇯🇵 Tokyo</div>
                        <div className="text-slate-400">Customer Lifecycle Marketing</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇸🇬 Singapore</div>
                        <div className="text-slate-400">Revenue Operations (RevOps)</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🇦🇪 Dubai</div>
                        <div className="text-slate-400">Global Expansion & Localization</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🏝️ Sydney</div>
                        <div className="text-slate-400">Customer Experience & Advocacy</div>
                      </div>
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">🌆 Los Angeles</div>
                        <div className="text-slate-400">Social Media & Influencer Marketing</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Routes Section */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    What are Routes?
                  </h4>
                  <p className="text-slate-300 mb-4">
                    Routes connect cities and represent natural growth paths in your marketing journey. 
                    Some capabilities build on others, and routes show these dependencies.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="font-semibold text-green-400">Unlocked Route (Solid Cyan Line)</div>
                      </div>
                      <p className="text-sm text-slate-300">
                        You meet all requirements (score + flight miles). You can "fly" this route 
                        and access scenarios for this capability pairing.
                      </p>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="font-semibold text-yellow-400">Partially Available (Dashed Yellow Line)</div>
                      </div>
                      <p className="text-sm text-slate-300">
                        You're close! You meet some requirements but need to improve your score 
                        or earn more flight miles to unlock fully.
                      </p>
                    </div>

                    <div className="bg-slate-700/30 border border-slate-700 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                        <div className="font-semibold text-slate-400">Locked Route (Dotted Gray Line)</div>
                      </div>
                      <p className="text-sm text-slate-300">
                        This route requires higher maturity. Complete the assessment, improve 
                        your capabilities, and upgrade your plane to unlock.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Example */}
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-lg">
                  <p className="text-sm text-cyan-300 mb-2">
                    💡 <strong>Example:</strong>
                  </p>
                  <p className="text-sm text-slate-300">
                    The route from <strong className="text-cyan-400">NYC (Content)</strong> → 
                    <strong className="text-cyan-400"> London (Demand Gen)</strong> shows that 
                    strong content capabilities enable better demand generation. If both cities 
                    light up when you hover, it means you've unlocked this growth path!
                  </p>
                </div>
              </div>
            )}

            {/* SCORING TAB */}
            {helpTab === 'Scoring' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    How Scoring Works
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Your overall score is calculated from multiple inputs to give you an 
                    accurate picture of your marketing maturity.
                  </p>
                </div>

                {/* Score Components */}
                <div className="space-y-4">
                  <div className="bg-slate-800 p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Quick Scan Assessment</div>
                        <div className="text-sm text-slate-400">Weight: 70% of total score</div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      10 questions across key marketing capabilities. Each answer is scored 0-100 
                      based on maturity level. Your responses are averaged to create your base score.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Tech Stack Audit</div>
                        <div className="text-sm text-slate-400">Weight: 30% of total score (optional)</div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">
                      Select the marketing tools you use and rate how well you're using them (1-10). 
                      This adds up to 30 additional points to your score.
                    </p>
                    <p className="text-cyan-400 text-sm font-semibold">
                      💡 Complete this to boost your score significantly!
                    </p>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Layers className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white">Deep Dive Assessment</div>
                        <div className="text-sm text-slate-400">Replaces Quick Scan (optional)</div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      25 detailed questions provide more nuanced scoring across all marketing 
                      categories. More accurate but takes longer (15-20 minutes vs. 5 minutes).
                    </p>
                  </div>
                </div>

                {/* REAO Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    REAO Metrics Breakdown
                  </h4>
                  <p className="text-slate-300 mb-4">
                    Your overall score is divided into four key dimensions:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 p-4 rounded-lg border border-red-500/20">
                      <h5 className="font-bold text-red-400 mb-2">Readiness</h5>
                      <p className="text-sm text-slate-300">
                        Strategic planning, team capabilities, and foundation elements
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20">
                      <h5 className="font-bold text-yellow-400 mb-2">Efficiency</h5>
                      <p className="text-sm text-slate-300">
                        Operations, tech stack, automation, and process optimization
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                      <h5 className="font-bold text-purple-400 mb-2">Alignment</h5>
                      <p className="text-sm text-slate-300">
                        Cross-functional coordination, sales-marketing integration, data consistency
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 rounded-lg border border-cyan-500/20">
                      <h5 className="font-bold text-cyan-400 mb-2">Opportunity</h5>
                      <p className="text-sm text-slate-300">
                        Growth potential, market opportunities, innovation readiness
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flight Miles */}
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-400" />
                    Flight Miles
                  </h4>
                  <p className="text-slate-300 mb-3">
                    Flight Miles are earned based on your capabilities and unlock specific routes. 
                    Formula:
                  </p>
                  <div className="bg-slate-900 p-4 rounded font-mono text-sm text-green-400">
                    Flight Miles = (Score × 100) + (Unlocked Cities × 250)
                  </div>
                  <p className="text-slate-400 text-sm mt-3">
                    Example: Score of 65 + 8 unlocked cities = 6,500 + 2,000 = 8,500 miles
                  </p>
                </div>
              </div>
            )}

            {/* JOURNEY MAP TAB */}
            {helpTab === 'Journey Map' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    Using the Journey Map
                  </h3>
                  <p className="text-slate-300 mb-6">
                    The Journey Map is your interactive visualization of marketing capabilities 
                    and growth paths. Here's how to use it:
                  </p>
                </div>

                {/* Interactive Elements */}
                <div className="space-y-4">
                  <div className="bg-slate-800 p-5 rounded-lg">
                    <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                      <MousePointer2 className="w-5 h-5" />
                      Hover Over Cities
                    </h4>
                    <p className="text-slate-300 text-sm mb-2">
                      When you hover over a city marker:
                    </p>
                    <ul className="text-sm text-slate-400 space-y-1 ml-4">
                      <li>• City enlarges and glows</li>
                      <li>• Tooltip shows city name, function, and status</li>
                      <li>• Connected routes highlight</li>
                      <li>• Requirements display if locked</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <MousePointer2 className="w-5 h-5" />
                      Click on Cities
                    </h4>
                    <p className="text-slate-300 text-sm mb-2">
                      Clicking a city opens a detailed modal showing:
                    </p>
                    <ul className="text-sm text-slate-400 space-y-1 ml-4">
                      <li>• Full capability description</li>
                      <li>• Your current maturity in this area</li>
                      <li>• Scenarios available for this capability</li>
                      <li>• Connected routes and dependencies</li>
                      <li>• Resources and next steps</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-lg">
                    <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      When Two Cities Light Up
                    </h4>
                    <p className="text-slate-300 text-sm mb-2">
                      If you see two cities connected and highlighted together:
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                      <p className="text-sm text-yellow-300">
                        ✨ <strong>This means you've unlocked that growth path!</strong> The route 
                        between these capabilities is available, and you can view scenarios that 
                        leverage both capabilities together.
                      </p>
                    </div>
                    <p className="text-slate-400 text-sm mt-3">
                      Example: NYC (Content) + London (Demand Gen) lighting up means you can 
                      run demand generation campaigns powered by strong content.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-lg">
                    <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                      <Navigation2 className="w-5 h-5" />
                      Control Panel at Bottom
                    </h4>
                    <p className="text-slate-300 text-sm mb-3">
                      Use the control panel to:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-3">
                        <div className="text-cyan-400 font-semibold w-32">Flight Planner:</div>
                        <div className="text-slate-400">Calculate routes between any two cities</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-purple-400 font-semibold w-32">Scenarios:</div>
                        <div className="text-slate-400">View recommended scenarios for selected route</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-yellow-400 font-semibold w-32">Active Routes:</div>
                        <div className="text-slate-400">See all your unlocked routes at a glance</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 p-5 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-3">
                      Map Controls (Top Right)
                    </h4>
                    <ul className="text-sm text-slate-400 space-y-2">
                      <li className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-slate-500" /> 
                        Zoom in to see city details
                      </li>
                      <li className="flex items-center gap-2">
                        <Minus className="w-4 h-4 text-slate-500" /> 
                        Zoom out for full world view
                      </li>
                      <li className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-slate-500" /> 
                        Reset orientation
                      </li>
                      <li className="flex items-center gap-2">
                        <Maximize className="w-4 h-4 text-slate-500" /> 
                        Toggle fullscreen
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-lg">
                  <h4 className="font-bold text-cyan-400 mb-3">💡 Pro Tips</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• <strong>Mobile:</strong> Pinch to zoom, tap cities to select</li>
                    <li>• <strong>Desktop:</strong> Hold Shift + Drag to rotate map</li>
                    <li>• <strong>Routes:</strong> Click a route line to see requirements</li>
                    <li>• <strong>Filters:</strong> Use left panel to show only unlocked or recommended routes</li>
                  </ul>
                </div>
              </div>
            )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

