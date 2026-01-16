/**
 * Standardized style constants for consistent UI
 */

export const BUTTON_STYLES = {
  primary: 'bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950',
  ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950',
  outline: 'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2',
} as const;

export const TEXT_COLORS = {
  primary: 'text-white',
  secondary: 'text-slate-300',
  tertiary: 'text-slate-400',
  muted: 'text-slate-500',
} as const;

export const SECTION_SPACING = {
  hero: 'py-20 md:py-24',
  section: 'py-16 md:py-20',
  subsection: 'py-12 md:py-16',
  minimal: 'py-8',
} as const;

export const CARD_STYLES = {
  base: 'bg-slate-900 border border-slate-800 rounded-xl',
  hover: 'hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
} as const;

export const ANIMATION_CLASSES = {
  fadeIn: 'animate-in fade-in duration-300',
  slideUp: 'animate-in fade-in slide-in-from-bottom duration-300',
  slideDown: 'animate-in fade-in slide-in-from-top duration-300',
  zoomIn: 'animate-in zoom-in duration-300',
} as const;

