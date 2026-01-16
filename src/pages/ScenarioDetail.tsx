import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SCENARIOS, CITIES } from '../data/staticData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  Rocket, TrendingUp, Award, Clock, CheckCircle2, 
  FileText, ArrowLeft, ArrowRight, Home, ChevronRight 
} from 'lucide-react';

export const ScenarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scenarioStatuses, setScenarioStatuses] = useLocalStorage<Record<string, { status?: 'in_progress' | 'completed'; viewedAt?: number }>>('scenarioStatuses', {});

  const scenario = SCENARIOS.find(s => s.id === id);

  useEffect(() => {
    if (scenario) {
      setScenarioStatuses(prev => ({
        ...prev,
        [scenario.id]: { ...(prev[scenario.id] || {}), viewedAt: Date.now() },
      }));
    }
  }, [scenario, setScenarioStatuses]);

  const handleSetStatus = (status: 'in_progress' | 'completed') => {
    if (!scenario) return;
    setScenarioStatuses(prev => ({
      ...prev,
      [scenario.id]: { ...(prev[scenario.id] || {}), status, viewedAt: prev[scenario.id]?.viewedAt || Date.now() },
    }));
  };

  if (!scenario) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Scenario Not Found</h1>
          <p className="text-slate-400">The scenario you're looking for doesn't exist.</p>
          <Link 
            to="/scenarios" 
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors mt-4"
          >
            Back to Scenarios
          </Link>
        </div>
      </div>
    );
  }

  // Map phase icons based on order
  const phaseIcons = [Rocket, TrendingUp, Award];
  const phaseIconNames = ['Foundation', 'Growth', 'Scale'];

  const fromCity = CITIES.find(c => c.id === scenario.from);
  const toCity = CITIES.find(c => c.id === scenario.to);

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
          <Home size={14} />
          <span>Home</span>
        </Link>
        <ChevronRight size={14} />
        <Link to="/scenarios" className="hover:text-cyan-400 transition-colors">
          Scenarios
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-300">{scenario.title}</span>
      </nav>

      {/* Header Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
              {scenario.title}
            </h1>
            <p className="text-lg text-slate-300 mb-4">
              {scenario.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
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
                <span className="px-2 py-1 bg-slate-700/20 text-slate-300 text-xs font-semibold rounded border border-slate-700/30">
                  Viewed
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/scenarios')}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* Scenario Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Industry</div>
            <div className="text-sm text-slate-300">{scenario.industry}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Duration</div>
            <div className="text-sm text-slate-300 flex items-center gap-1">
              <Clock size={14} />
              {scenario.duration}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Investment</div>
            <div className="text-sm text-slate-300">{scenario.investment}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Complexity</div>
            <div className="text-sm text-slate-300">
              {'★'.repeat(scenario.complexity)}{'☆'.repeat(5 - scenario.complexity)}
            </div>
          </div>
        </div>

        {/* Challenge */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Challenge</div>
          <p className="text-slate-300">{scenario.challenge}</p>
        </div>

        {/* Journey Path */}
        {fromCity && toCity && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-3">Journey Path</div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1 bg-slate-800 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-1">From</div>
                <div className="text-white font-medium">{fromCity.function}</div>
                <div className="text-slate-500 text-xs">{fromCity.name}</div>
              </div>
              <ArrowRight className="text-cyan-400 flex-shrink-0" size={20} />
              <div className="flex-1 bg-slate-800 rounded-lg p-3">
                <div className="text-slate-400 text-xs mb-1">To</div>
                <div className="text-white font-medium">{toCity.function}</div>
                <div className="text-slate-500 text-xs">{toCity.name}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => handleSetStatus('in_progress')}
          className="px-4 py-2 bg-yellow-500/15 text-yellow-200 border border-yellow-500/30 rounded-lg text-sm font-semibold hover:bg-yellow-500/25 transition-colors"
        >
          Mark In Progress
        </button>
        <button
          onClick={() => handleSetStatus('completed')}
          className="px-4 py-2 bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 rounded-lg text-sm font-semibold hover:bg-emerald-500/25 transition-colors"
        >
          Mark Completed
        </button>
      </div>

      {/* Expected Outcomes */}
      {scenario.expectedOutcomes && scenario.expectedOutcomes.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4">Expected Outcomes</h2>
          <ul className="space-y-2">
            {scenario.expectedOutcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-cyan-400 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-slate-300">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phases Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Implementation Phases</h2>
          <div className="text-sm text-slate-400">
            Total Duration: <span className="text-cyan-400 font-semibold">{scenario.duration}</span>
          </div>
        </div>

        <div className="space-y-8">
          {scenario.phases.map((phase, index) => {
            const PhaseIcon = phaseIcons[index] || Rocket;
            const phaseLabel = phaseIconNames[index] || `Phase ${index + 1}`;

            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8"
              >
                {/* Phase Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <PhaseIcon className="text-cyan-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                      <span className="px-2 py-1 bg-slate-800 text-xs font-semibold text-cyan-400 rounded">
                        {phaseLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock size={14} />
                      <span>{phase.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Tasks
                  </h4>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Deliverables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.deliverables.map((deliverable, delIndex) => (
                      <div
                        key={delIndex}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300"
                      >
                        {deliverable}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Start This Journey?</h2>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Begin your marketing transformation with this strategic roadmap. Track your progress and unlock new capabilities as you advance.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/20"
        >
          Start Journey
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

