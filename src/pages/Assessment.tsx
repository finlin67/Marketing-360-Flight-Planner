import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, AssessmentResponse, PLANE_LEVELS } from '../context/UserContext';
import { QUICK_ASSESSMENT_QUESTIONS, DEEP_DIVE_QUESTIONS } from '../data/staticData';
import { trackPageView, trackEvent } from '../utils/analytics';
import { logger } from '../utils/logger';
import { storageCache } from '../utils/storageCache';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle, ChevronDown, ChevronUp, TrendingUp, Check } from 'lucide-react';

interface AssessmentProps {
  type: 'quick' | 'deep';
}

// Section mapping for Deep Dive Assessment
const DEEP_DIVE_SECTIONS = [
  {
    name: 'Foundation',
    categories: [
      'Strategy & Planning',
      'Content & Communication',
      'Demand Generation',
      'Sales & Marketing Alignment',
      'Marketing Operations',
    ],
  },
  {
    name: 'Execution',
    categories: [
      'Marketing Technology',
      'Data & Analytics',
      'Brand Strategy',
      'Customer Journey',
      'Team & Capabilities', // Team execution capability
    ],
  },
  {
    name: 'Optimization',
    categories: [
      'Team & Capabilities',
      'Team Structure',
      'Budget & ROI',
      'Technology Integration',
      'Data Flow & Architecture',
    ],
  },
  {
    name: 'Advanced',
    categories: [
      'Attribution Modeling',
      'Content Production',
      'Lead Scoring',
      'Sales-Marketing SLAs',
      'Customer Journey Mapping',
    ],
  },
  {
    name: 'Excellence',
    categories: [
      'Marketing Governance',
      'Marketing Automation',
      'Performance Measurement',
      'Innovation & Experimentation',
      'Campaign Orchestration', // Advanced orchestration is an excellence metric
    ],
  },
] as const;

export const Assessment: React.FC<AssessmentProps> = ({ type }) => {
  const navigate = useNavigate();
  const { submitQuickAssessment, submitDeepAssessment } = useUser();
  
  const questions = type === 'deep' ? DEEP_DIVE_QUESTIONS : QUICK_ASSESSMENT_QUESTIONS;
  
  // Get unique categories for Deep Dive navigation
  const categories = useMemo(() => {
    if (type === 'quick') return [];
    const uniqueCategories = Array.from(new Set(questions.map(q => q.category)));
    return uniqueCategories;
  }, [type, questions]);
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedProgressData, setSavedProgressData] = useState<{ responses: Record<number, number>; currentQuestion: number } | null>(null);
  
  // Deep Dive tabbed interface state
  const [activeSection, setActiveSection] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Track page view
  useEffect(() => {
    trackPageView(type === 'deep' ? '/assessment/deep' : '/assessment');
  }, [type]);
  
  // Get questions by category for Deep Dive
  const questionsByCategory = useMemo(() => {
    if (type === 'quick') return {};
    const grouped: Record<string, typeof questions> = {};
    questions.forEach(q => {
      if (!grouped[q.category]) grouped[q.category] = [];
      grouped[q.category].push(q);
    });
    return grouped;
  }, [type, questions]);

  // Get current section categories for Deep Dive
  const getCurrentSectionCategories = useMemo(() => {
    if (type !== 'deep') return [];
    const section = DEEP_DIVE_SECTIONS[activeSection];
    return section.categories.map(cat => {
      const categoryQuestions = questionsByCategory[cat] || [];
      return {
        id: cat,
        name: cat,
        description: categoryQuestions[0]?.description || '',
        questions: categoryQuestions,
      };
    });
  }, [type, activeSection, questionsByCategory]);

  // Check if category is fully answered
  const isCategoryAnswered = (categoryName: string): boolean => {
    const categoryQuestions = questionsByCategory[categoryName] || [];
    return categoryQuestions.length > 0 && categoryQuestions.every(q => responses[q.id] !== undefined);
  };

  // Get completion count for a section
  const getSectionCompletionCount = (sectionIndex: number): number => {
    const section = DEEP_DIVE_SECTIONS[sectionIndex];
    return section.categories.filter(cat => isCategoryAnswered(cat)).length;
  };

  // Get total progress
  const totalProgress = useMemo(() => {
    if (type !== 'deep') return Object.keys(responses).length;
    return DEEP_DIVE_SECTIONS.reduce((total, section) => {
      return total + section.categories.filter(cat => isCategoryAnswered(cat)).length;
    }, 0);
  }, [type, responses, questionsByCategory]);

  // Get current section progress
  const currentSectionProgress = useMemo(() => {
    if (type !== 'deep') return 0;
    return getSectionCompletionCount(activeSection);
  }, [type, activeSection, responses, questionsByCategory]);

  // Restore progress on page load (with caching)
  useEffect(() => {
    const savedProgress = storageCache.getItem<{ responses: Record<number, number>; currentQuestion: number; timestamp: number }>('assessmentProgress', 24 * 60 * 60 * 1000); // 24 hour TTL
    if (savedProgress) {
      try {
        const { responses: savedResponses, currentQuestion: savedQuestion, timestamp } = savedProgress;
        
        // Only restore if less than 24 hours old
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < TWENTY_FOUR_HOURS) {
          setSavedProgressData({ responses: savedResponses, currentQuestion: savedQuestion });
          setShowResumeModal(true);
        } else {
          // Clear old progress
          storageCache.removeItem('assessmentProgress');
        }
      } catch (e) {
        logger.error('Failed to restore progress:', e);
        storageCache.removeItem('assessmentProgress');
      }
    }
  }, []);

  // Auto-save progress after each answer (debounced)
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      const progressData = {
        responses,
        currentQuestion,
        timestamp: Date.now(),
      };
      storageCache.setItem('assessmentProgress', progressData);
    }
  }, [responses, currentQuestion]);

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id;
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Last question answered, submit
        handleSubmit();
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(responses).length;

    // Validate that at least one question is answered
    if (answeredCount === 0) {
      setError("Please answer at least one question before submitting.");
      return;
    }

    // Warn if less than minimum questions answered
    const minQuestions = type === 'deep' ? 10 : 5;
    if (answeredCount < minQuestions) {
      const confirmed = window.confirm(
        `You've only answered ${answeredCount} out of ${questions.length} questions. Results may be less accurate. Continue anyway?`
      );
      if (!confirmed) {
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);
    setIsCalculating(true);

    try {
      // Convert responses to AssessmentResponse format
      const assessmentResponsesData: AssessmentResponse[] = questions
        .filter(q => responses[q.id] !== undefined)
        .map(q => ({
          questionId: q.id,
          category: q.category,
          score: responses[q.id],
        }));

      // Calculate score and plane level for tracking
      const avgScore = assessmentResponsesData.reduce((sum, r) => sum + r.score, 0) / assessmentResponsesData.length;
      const planeLevel = PLANE_LEVELS.find(l => 
        avgScore >= l.minScore && avgScore <= l.maxScore
      )?.name || 'Unknown';

      // Simulate processing delay (2-3 seconds for effect)
      setTimeout(() => {
        if (type === 'deep') {
          submitDeepAssessment(assessmentResponsesData);
        } else {
          submitQuickAssessment(assessmentResponsesData);
        }
        
        // Track assessment completion
        trackEvent('assessment_completed', {
          assessmentType: type,
          questionsAnswered: answeredCount,
          totalQuestions: questions.length,
          score: Math.round(avgScore),
          planeLevel: planeLevel,
        });
        
        // Clear saved progress
        storageCache.removeItem('assessmentProgress');
        storageCache.removeItem('assessment_responses');
        
        // Navigate to results
        navigate('/results');
      }, 2500);
    } catch (err) {
      logger.error('Error submitting assessment:', err);
      setError('An error occurred while submitting your assessment. Please try again.');
      setIsSubmitting(false);
      setIsCalculating(false);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(responses).length;
  
  // Toggle category expansion for Deep Dive
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };
  
  // Jump to question in Deep Dive
  const jumpToQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  // Deep Dive specific handlers
  const toggleCategoryCard = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
      // Set current question to first unanswered question in this category, or first question
      const categoryQuestions = questionsByCategory[categoryName] || [];
      if (categoryQuestions.length > 0) {
        const firstUnanswered = categoryQuestions.find(q => responses[q.id] === undefined);
        if (firstUnanswered) {
          const questionIndex = questions.findIndex(q => q.id === firstUnanswered.id);
          if (questionIndex !== -1) {
            setCurrentQuestion(questionIndex);
          }
        } else {
          // All answered, go to first question
          const questionIndex = questions.findIndex(q => q.id === categoryQuestions[0].id);
          if (questionIndex !== -1) {
            setCurrentQuestion(questionIndex);
          }
        }
      }
    }
  };

  const goToPreviousSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      setExpandedCategory(null);
    }
  };

  const goToNextSection = () => {
    if (activeSection < DEEP_DIVE_SECTIONS.length - 1) {
      setActiveSection(activeSection + 1);
      setExpandedCategory(null);
    }
  };

  // Show calculating screen when submitting
  if (isCalculating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="mb-8">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Calculating Your Results...
          </h2>
          <p className="text-slate-400 text-lg">
            Analyzing your marketing maturity and preparing your personalized roadmap
          </p>
          <div className="mt-8 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000 animate-pulse"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show completion screen for Quick Scan with Deep Dive CTA
  if (type === 'quick' && currentQuestion >= questions.length && answeredCount >= questions.length) {
    return (
      <div className="min-h-screen bg-slate-950 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-700 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Quick Scan Complete!
              </h2>
              <p className="text-slate-400 text-lg mb-6">
                You've completed the 10-question Quick Scan. Want more accuracy?
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Try Deep Dive Assessment</h3>
              <p className="text-slate-300 mb-4">
                Get a comprehensive 25-question assessment with detailed category breakdowns and more precise recommendations.
              </p>
              <ul className="text-left text-slate-400 space-y-2 mb-6 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span>15 additional questions across 15 categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span>Category-by-category analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span>More detailed recommendations</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/results')}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  View Quick Scan Results
                </button>
                <button
                  onClick={() => navigate('/assessment/deep')}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
                >
                  <TrendingUp size={18} />
                  Start Deep Dive
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-6 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Tabbed Interface for Deep Dive */}
        {type === 'deep' && (
          <>
            {/* Section Tabs */}
            <div className="mb-6 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex border-b border-slate-700">
                {DEEP_DIVE_SECTIONS.map((section, idx) => {
                  const completionCount = getSectionCompletionCount(idx);
                  const isActive = activeSection === idx;
                  return (
                    <button
                      key={section.name}
                      onClick={() => {
                        setActiveSection(idx);
                        setExpandedCategory(null);
                      }}
                      className={`
                        flex-1 px-4 py-4 font-semibold text-center
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-cyan-500 text-white border-b-4 border-cyan-400' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }
                      `}
                    >
                      <div className="text-base sm:text-lg">{section.name}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {completionCount}/5 complete
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Section Progress: {currentSectionProgress}/5</span>
                <span>Overall: {totalProgress}/25 ({Math.round((totalProgress / 25) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${(totalProgress / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {getCurrentSectionCategories.map(category => {
                const isExpanded = expandedCategory === category.id;
                const isAnswered = isCategoryAnswered(category.id);
                const categoryQuestions = category.questions;
                const answeredCount = categoryQuestions.filter(q => responses[q.id] !== undefined).length;
                const totalCount = categoryQuestions.length;

                return (
                  <div
                    key={category.id}
                    className={`
                      p-6 rounded-lg border-2 cursor-pointer
                      transition-all hover:scale-[1.02]
                      ${isExpanded 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                      }
                    `}
                    onClick={() => toggleCategoryCard(category.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg">{category.name}</h3>
                      {isAnswered && (
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="text-xs text-slate-500">
                      {answeredCount}/{totalCount} questions answered
                    </div>
                    {isExpanded && categoryQuestions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="space-y-3">
                          {categoryQuestions.map((q) => {
                            const questionIndex = questions.findIndex(qq => qq.id === q.id);
                            const isQuestionAnswered = responses[q.id] !== undefined;
                            const isCurrent = questionIndex === currentQuestion;
                            return (
                              <div
                                key={q.id}
                                className={`
                                  p-3 rounded-lg border transition-all
                                  ${isCurrent 
                                    ? 'border-cyan-500 bg-cyan-500/10' 
                                    : isQuestionAnswered
                                    ? 'border-slate-600 bg-slate-700/30'
                                    : 'border-slate-700 bg-slate-800/50'
                                  }
                                `}
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className={`text-sm font-medium ${isCurrent ? 'text-cyan-400' : 'text-slate-300'}`}>
                                    Q{q.id}
                                  </span>
                                  {isQuestionAnswered && (
                                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                                  {q.question}
                                </p>
                                {isCurrent && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentQuestion(questionIndex);
                                    }}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                                  >
                                    Answer this question →
                                  </button>
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

            {/* Section Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={goToPreviousSection}
                disabled={activeSection === 0}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-all
                  flex items-center gap-2
                  ${activeSection === 0
                    ? 'text-slate-600 cursor-not-allowed opacity-50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <ArrowLeft size={18} />
                Previous Section
              </button>

              {activeSection < DEEP_DIVE_SECTIONS.length - 1 ? (
                <button
                  onClick={goToNextSection}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  Next Section
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || totalProgress < 5}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all
                    flex items-center gap-2
                    ${totalProgress >= 5 && !isSubmitting
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Deep Dive
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
        
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div 
            className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Assessment progress: ${progress}% complete`}
          >
            <div 
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold mb-1">Action Required</p>
                <p className="text-sm">{error}</p>
                {error.includes('answer') && (
                  <p className="text-xs text-red-300 mt-2">
                    You can answer questions in any order. Use the Back button to review previous questions.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-slate-900 p-4 sm:p-6 md:p-8 rounded-xl border border-slate-700">
          
          {/* Category badge */}
          <span className="inline-block text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full mb-4">
            {currentQuestionData.category}
          </span>

          {/* Question */}
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-3" id={`question-${currentQuestionData.id}`}>
            {currentQuestionData.question}
          </h1>

          {/* Description */}
          {currentQuestionData.description && (
            <p className="text-sm sm:text-base text-slate-400 mb-6" id={`question-description-${currentQuestionData.id}`}>
              {currentQuestionData.description}
            </p>
          )}

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestionData.options.map((option, idx) => {
              const isSelected = responses[currentQuestionData.id] === option.value;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-lg transition-all min-h-[44px] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-500'
                      : 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-cyan-500/50'
                  }`}
                  aria-label={`Select ${option.label} for ${currentQuestionData.question}`}
                  aria-pressed={isSelected}
                  aria-describedby={`question-description-${currentQuestionData.id}`}
                >
                  <div className={`font-medium text-sm sm:text-base ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                    {option.label}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <button 
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors min-h-[44px] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
              currentQuestion === 0
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="Go to previous question"
            aria-disabled={currentQuestion === 0}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back
          </button>
          
          <div className="text-xs sm:text-sm text-slate-500 order-first sm:order-none">
            {answeredCount} of {questions.length} answered
          </div>

          {currentQuestion < questions.length - 1 ? (
            <button 
              onClick={handleSkip}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              aria-label="Skip this question"
            >
              Skip
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < questions.length}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all min-h-[44px] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                answeredCount >= questions.length && !isSubmitting
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg hover:shadow-xl'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              aria-label={answeredCount < questions.length 
                ? `Complete assessment. ${questions.length - answeredCount} questions remaining.`
                : 'Submit assessment and view results'}
              aria-disabled={isSubmitting || answeredCount < questions.length}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Complete Assessment</span>
                  <span className="sm:hidden">Complete</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
