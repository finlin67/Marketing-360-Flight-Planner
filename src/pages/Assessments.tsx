import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Zap, Layers, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const Assessments: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentResponses } = useUser();
  
  const hasCompletedAssessment = assessmentResponses.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-2xl mb-4">
          <Sparkles className="text-cyan-400" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white">
          Choose Your Assessment
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Start your marketing maturity journey. Select the assessment that fits your needs and timeline.
        </p>
        {hasCompletedAssessment && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm">
            <CheckCircle2 size={16} />
            <span>You've completed an assessment. Retake anytime to track your progress!</span>
          </div>
        )}
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* Quick Scan Card */}
        <div className="relative bg-slate-900 border-2 border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
          <div className="space-y-6">
            {/* Icon & Badge */}
            <div className="flex items-start justify-between">
              <div className="p-4 bg-cyan-500/20 rounded-xl">
                <Zap className="text-cyan-400" size={32} />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Quick Scan Assessment
              </h2>
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Clock size={16} />
                <span className="text-sm">10 questions • 10 minutes</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Get your marketing altitude and plane level with a quick 10-question assessment. Perfect for a fast check-in on your marketing maturity.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="text-cyan-400 flex-shrink-0" size={16} />
                <span>10 strategic questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="text-cyan-400 flex-shrink-0" size={16} />
                <span>Plane level & flight miles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="text-cyan-400 flex-shrink-0" size={16} />
                <span>Basic recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="text-cyan-400 flex-shrink-0" size={16} />
                <span>Unlocked routes preview</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/assessment/quick')}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02]"
            >
              Start Quick Scan
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </div>
        </div>

        {/* Deep Dive Card */}
        <div className="relative bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-pink-900/30 border-2 border-purple-500/50 rounded-2xl p-8 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
          {/* Recommended Badge */}
          <div className="absolute -top-3 -right-3 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <Sparkles size={12} />
            Recommended
          </div>

          <div className="space-y-6">
            {/* Icon */}
            <div className="flex items-start justify-between">
              <div className="p-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl">
                <Layers className="text-purple-300" size={32} />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Deep Dive Assessment
              </h2>
              <div className="flex items-center gap-2 text-purple-200 mb-4">
                <Clock size={16} />
                <span className="text-sm">25 questions + tech stack • 45 minutes</span>
              </div>
              <p className="text-purple-100 leading-relaxed">
                Get comprehensive analysis and a 90-day personalized roadmap. Includes tech stack audit, detailed REAO metrics, and scenario recommendations tailored to your stack.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={16} />
                <span>25 comprehensive questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={16} />
                <span>Tech stack inventory & optimization</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={16} />
                <span>REAO metrics with detailed insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={16} />
                <span>90-day personalized roadmap</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={16} />
                <span>Scenario recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <CheckCircle2 className="text-yellow-400 flex-shrink-0" size={16} />
                <span>Downloadable results report</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/assessment/deep')}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02]"
            >
              Start Deep Dive
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </div>

          {/* Decorative glow */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-tl-full blur-3xl"></div>
        </div>
      </div>

      {/* Comparison Note */}
      <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Sparkles className="text-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Not sure which to choose?
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Start with <span className="text-cyan-400 font-semibold">Quick Scan</span> for a fast overview, or go straight to <span className="text-purple-400 font-semibold">Deep Dive</span> for the most comprehensive analysis. You can always retake either assessment as your marketing maturity evolves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

