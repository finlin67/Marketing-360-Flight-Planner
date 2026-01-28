import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserProfile } from '../context/UserContext';
import { getUniqueIndustries, getUniqueCompanySizes } from '../data/staticData';
import { BackButton } from '../components/BackButton';
import { PreFlightProgress } from '../components/PreFlightProgress';
import { PreFlightOptionButton } from '../components/PreFlightOptionButton';
import {
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  Users,
  Plane,
  AlertCircle,
} from 'lucide-react';

const ROLES = [
  { value: 'CMO', label: 'CMO', sublabel: 'Chief Marketing Officer' },
  { value: 'VP Marketing', label: 'VP Marketing', sublabel: 'Vice President' },
  { value: 'Director', label: 'Director', sublabel: 'Marketing Director' },
  { value: 'Manager', label: 'Manager', sublabel: 'Marketing Manager' },
  { value: 'Specialist', label: 'Specialist', sublabel: 'Marketing Specialist' },
  { value: 'Other', label: 'Other', sublabel: 'Other role' },
];

const TOTAL_STEPS = 3;

export const PreFlightCheck: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, profile } = useUser();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState(profile?.role ?? '');
  const [industry, setIndustry] = useState(profile?.industry ?? '');
  const [companySize, setCompanySize] = useState(profile?.companySize ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const industries = getUniqueIndustries();
  const companySizes = getUniqueCompanySizes().filter((s) => s !== 'All');
  if (companySizes.length === 0) {
    companySizes.push('SMB', 'Mid-Market', 'Enterprise');
  }

  const completedSteps = [role, industry, companySize].filter(Boolean).length;
  const formValues = [role, industry, companySize];

  const validate = useCallback((): boolean => {
    const current = formValues[step];
    if (!current || !String(current).trim()) {
      const labels = ['Role', 'Industry', 'Company size'];
      setValidationError(`Please select your ${labels[step].toLowerCase()} to continue.`);
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return false;
    }
    setValidationError(null);
    return true;
  }, [step, role, industry, companySize]);

  const handleNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleComplete = () => {
    const p: UserProfile = {
      role: role || 'Other',
      industry: industry || 'Cross-Industry',
      companySize: companySize || 'Mid-Market',
      companyType: 'B2B',
      revenue: '',
      goals: [],
    };
    setProfile(p);
    navigate('/assessment/quick');
  };

  const handleSkip = () => {
    setProfile({
      role: 'Other',
      industry: 'Cross-Industry',
      companySize: 'Mid-Market',
      companyType: 'B2B',
      revenue: '',
      goals: [],
    });
    navigate('/assessment/quick');
  };

  return (
    <div className="min-h-screen bg-gradient-flight py-6 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton to="/" />
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Skip pre-flight
          </button>
        </div>

        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/20 mb-4">
            <Plane className="w-7 h-7 text-cyan-400 -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Pre-Flight Check
          </h1>
          <p className="text-slate-400 mt-2">
            Quick setup so we can tailor your results
          </p>
        </div>

        <PreFlightProgress
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          completedSteps={completedSteps}
        />

        <motion.div
          className={`glass-card rounded-2xl border overflow-hidden min-h-[280px] ${shake ? 'animate-validation-shake' : ''}`}
          layout
          transition={{ layout: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Your role
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Helps us customize recommendations for your level.
                </p>
                <div className="space-y-3">
                  {ROLES.map((r, i) => (
                    <PreFlightOptionButton
                      key={r.value}
                      label={r.label}
                      sublabel={r.sublabel}
                      icon={User}
                      isSelected={role === r.value}
                      onSelect={() => {
                        setRole(r.value);
                        setValidationError(null);
                      }}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  Industry
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  We'll surface scenarios relevant to your space.
                </p>
                <div className="space-y-3">
                  {industries.map((ind, i) => (
                    <PreFlightOptionButton
                      key={ind}
                      label={ind}
                      icon={Building2}
                      isSelected={industry === ind}
                      onSelect={() => {
                        setIndustry(ind);
                        setValidationError(null);
                      }}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8"
              >
                <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Company size
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  Used for benchmarks and scenario filtering.
                </p>
                <div className="space-y-3">
                  {companySizes.map((s, i) => (
                    <PreFlightOptionButton
                      key={s}
                      label={s}
                      sublabel={
                        s === 'SMB' ? '1–200 employees' :
                        s === 'Mid-Market' ? '201–2,000' :
                        s === 'Enterprise' ? '2,000+ employees' : undefined
                      }
                      icon={Users}
                      isSelected={companySize === s}
                      onSelect={() => {
                        setCompanySize(s);
                        setValidationError(null);
                      }}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">{validationError}</p>
          </motion.div>
        )}

        <div className="mt-8 flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all
              ${step === 0
                ? 'text-slate-600 cursor-not-allowed opacity-50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <motion.button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-semibold shadow-glow-cyan animate-cta-glow-pulse"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {step < TOTAL_STEPS - 1 ? 'Next' : 'Continue to Assessment'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
