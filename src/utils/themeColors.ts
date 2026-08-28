import { ThemeColor, DarkMode, FontSize } from '../types';

export interface ThemeClasses {
  primary: string;
  primaryHover: string;
  primaryText: string;
  primaryLight: string;
  badge: string;
  border: string;
  ring: string;
  gradient: string;
  shadow: string;
  hex: string;
}

export const THEME_CONFIG: Record<ThemeColor, ThemeClasses> = {
  blue: {
    primary: 'bg-blue-600 dark:bg-blue-600',
    primaryHover: 'hover:bg-blue-700 dark:hover:bg-blue-500',
    primaryText: 'text-blue-600 dark:text-blue-400',
    primaryLight: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300',
    border: 'border-blue-500',
    ring: 'focus:ring-blue-500',
    gradient: 'from-blue-600 via-sky-500 to-indigo-600',
    shadow: 'shadow-lg shadow-blue-500/20',
    hex: '#2563eb',
  },
  indigo: {
    primary: 'bg-indigo-600 dark:bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700 dark:hover:bg-indigo-500',
    primaryText: 'text-indigo-600 dark:text-indigo-400',
    primaryLight: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300',
    border: 'border-indigo-500',
    ring: 'focus:ring-indigo-500',
    gradient: 'from-indigo-600 via-indigo-500 to-violet-600',
    shadow: 'shadow-lg shadow-indigo-500/20',
    hex: '#4f46e5',
  },
  emerald: {
    primary: 'bg-emerald-600 dark:bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700 dark:hover:bg-emerald-500',
    primaryText: 'text-emerald-600 dark:text-emerald-400',
    primaryLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-500',
    ring: 'focus:ring-emerald-500',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    shadow: 'shadow-lg shadow-emerald-500/20',
    hex: '#059669',
  },
  amber: {
    primary: 'bg-amber-600 dark:bg-amber-600',
    primaryHover: 'hover:bg-amber-700 dark:hover:bg-amber-500',
    primaryText: 'text-amber-600 dark:text-amber-400',
    primaryLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300',
    border: 'border-amber-500',
    ring: 'focus:ring-amber-500',
    gradient: 'from-amber-600 via-orange-600 to-yellow-600',
    shadow: 'shadow-lg shadow-amber-500/20',
    hex: '#d97706',
  },
  crimson: {
    primary: 'bg-rose-600 dark:bg-rose-600',
    primaryHover: 'hover:bg-rose-700 dark:hover:bg-rose-500',
    primaryText: 'text-rose-600 dark:text-rose-400',
    primaryLight: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
    badge: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300',
    border: 'border-rose-500',
    ring: 'focus:ring-rose-500',
    gradient: 'from-rose-600 via-red-600 to-pink-700',
    shadow: 'shadow-lg shadow-rose-500/20',
    hex: '#e11d48',
  },
  violet: {
    primary: 'bg-purple-600 dark:bg-purple-600',
    primaryHover: 'hover:bg-purple-700 dark:hover:bg-purple-500',
    primaryText: 'text-purple-600 dark:text-purple-400',
    primaryLight: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300',
    border: 'border-purple-500',
    ring: 'focus:ring-purple-500',
    gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    shadow: 'shadow-lg shadow-purple-500/20',
    hex: '#9333ea',
  },
  teal: {
    primary: 'bg-teal-600 dark:bg-teal-600',
    primaryHover: 'hover:bg-teal-700 dark:hover:bg-teal-500',
    primaryText: 'text-teal-600 dark:text-teal-400',
    primaryLight: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300',
    border: 'border-teal-500',
    ring: 'focus:ring-teal-500',
    gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    shadow: 'shadow-lg shadow-teal-500/20',
    hex: '#0d9488',
  },
  orange: {
    primary: 'bg-orange-600 dark:bg-orange-600',
    primaryHover: 'hover:bg-orange-700 dark:hover:bg-orange-500',
    primaryText: 'text-orange-600 dark:text-orange-400',
    primaryLight: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300',
    badge: 'bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300',
    border: 'border-orange-500',
    ring: 'focus:ring-orange-500',
    gradient: 'from-orange-600 via-amber-500 to-red-500',
    shadow: 'shadow-lg shadow-orange-500/20',
    hex: '#ea580c',
  },
  cyan: {
    primary: 'bg-cyan-600 dark:bg-cyan-600',
    primaryHover: 'hover:bg-cyan-700 dark:hover:bg-cyan-500',
    primaryText: 'text-cyan-600 dark:text-cyan-400',
    primaryLight: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300',
    badge: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300',
    border: 'border-cyan-500',
    ring: 'focus:ring-cyan-500',
    gradient: 'from-cyan-600 via-teal-500 to-blue-600',
    shadow: 'shadow-lg shadow-cyan-500/20',
    hex: '#0891b2',
  },
  rose: {
    primary: 'bg-pink-600 dark:bg-pink-600',
    primaryHover: 'hover:bg-pink-700 dark:hover:bg-pink-500',
    primaryText: 'text-pink-600 dark:text-pink-400',
    primaryLight: 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300',
    badge: 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300',
    border: 'border-pink-500',
    ring: 'focus:ring-pink-500',
    gradient: 'from-pink-600 via-rose-600 to-red-600',
    shadow: 'shadow-lg shadow-pink-500/20',
    hex: '#db2777',
  }
};

export const FONT_SIZES: Record<FontSize, { title: string; body: string; labelAr: string; labelEn: string }> = {
  sm: {
    title: 'text-base font-semibold',
    body: 'text-xs leading-relaxed',
    labelAr: 'صغير (14px)',
    labelEn: 'Small (14px)',
  },
  base: {
    title: 'text-lg font-bold',
    body: 'text-sm leading-relaxed',
    labelAr: 'افتراضي (16px)',
    labelEn: 'Default (16px)',
  },
  lg: {
    title: 'text-xl font-bold',
    body: 'text-base leading-relaxed',
    labelAr: 'متوسط (18px)',
    labelEn: 'Medium (18px)',
  },
  xl: {
    title: 'text-2xl font-bold',
    body: 'text-lg leading-relaxed',
    labelAr: 'كبير (20px)',
    labelEn: 'Large (20px)',
  },
  '2xl': {
    title: 'text-3xl font-extrabold',
    body: 'text-xl leading-relaxed',
    labelAr: 'كبير جداً (24px)',
    labelEn: 'Extra Large (24px)',
  }
};

export function getBackgroundClasses(darkMode: DarkMode) {
  if (darkMode === 'oled') {
    return {
      bg: 'bg-[#060b18] text-blue-50',
      surface: 'bg-[#0a1226] text-blue-50',
      card: 'bg-[#0f1b38] hover:bg-[#142347] shadow-xl shadow-[#03060f]/70 text-blue-50',
      header: 'bg-[#060b18]/90 text-blue-50',
      elevated: 'bg-[#15244a] text-blue-50',
      muted: 'text-blue-200/60',
      hover: 'hover:bg-[#162752] transition-all',
      divider: 'border-blue-900/30',
    };
  }
  if (darkMode === 'dark') {
    return {
      bg: 'bg-[#0a1128] text-slate-100',
      surface: 'bg-[#0f1a3a] text-slate-100',
      card: 'bg-[#13224b] hover:bg-[#182b5e] shadow-lg shadow-[#050a17]/50 text-slate-100',
      header: 'bg-[#0a1128]/90 text-slate-100',
      elevated: 'bg-[#192b5c] text-slate-100',
      muted: 'text-blue-200/65',
      hover: 'hover:bg-[#1a2c5e] transition-all',
      divider: 'border-blue-900/30',
    };
  }
  // Standard Global Light Mode: high-contrast, clean neutrals, soft elevation
  return {
    bg: 'bg-[#f4f6fa] text-slate-900',
    surface: 'bg-white text-slate-900 shadow-sm',
    card: 'bg-white hover:bg-slate-50/90 shadow-[0_4px_18px_-4px_rgba(0,0,0,0.06)] hover:shadow-lg text-slate-900',
    header: 'bg-white/90 text-slate-900 shadow-xs',
    elevated: 'bg-slate-100 text-slate-900',
    muted: 'text-slate-500',
    hover: 'hover:bg-slate-100 transition-all',
    divider: 'border-slate-200/70',
  };
}
