import React from 'react';
import { 
  Globe2, 
  Radio, 
  Tv, 
  Flame, 
  Newspaper, 
  Trophy, 
  TrendingUp, 
  Cpu, 
  Layers,
  Sparkles,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { NewsSource, AppSettings, NewsCategory } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion } from 'motion/react';

interface CategoryNavProps {
  sources: NewsSource[];
  selectedSourceId: string | null;
  onSelectSource: (sourceId: string | null) => void;
  sourceCounts: Record<string, number>;
  totalArticlesCount: number;
  settings: AppSettings;
  onOpenWebsitesDrawer?: () => void;
  // Optional secondary category filter
  categories?: NewsCategory[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  sources,
  selectedSourceId,
  onSelectSource,
  sourceCounts,
  totalArticlesCount,
  settings,
  onOpenWebsitesDrawer,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const getSourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio': return <Radio className="w-3.5 h-3.5 text-amber-500" />;
      case 'Tv': return <Tv className="w-3.5 h-3.5 text-sky-500" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'Newspaper': return <Newspaper className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Trophy': return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case 'TrendingUp': return <TrendingUp className="w-3.5 h-3.5 text-teal-500" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-purple-500" />;
      default: return <Globe2 className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const isAllSelected = selectedSourceId === null;

  return (
    <div className={`w-full overflow-hidden transition-colors duration-200 shadow-xs ${bgClasses.surface} border-b border-slate-100 dark:border-blue-950/40`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
        {/* Label & Websites Drawer Shortcut */}
        <div className="shrink-0 flex items-center gap-1.5 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-blue-900/40">
          <button
            type="button"
            onClick={onOpenWebsitesDrawer}
            title={getTranslation(settings.language, 'manageSources')}
            className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${bgClasses.elevated} ${bgClasses.hover} text-sky-600 dark:text-sky-400`}
          >
            <Globe2 className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-bold">
              {getTranslation(settings.language, 'sources')}
            </span>
          </button>
        </div>

        {/* Scrollable Horizontal List of Sources / Websites */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          {/* Option: All Websites (جميع المواقع) */}
          <button
            id="source-tab-all"
            onClick={() => onSelectSource(null)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 relative select-none shadow-xs ${
              isAllSelected
                ? `${theme.primary} text-white shadow-md shadow-blue-600/25 scale-[1.02]`
                : `${bgClasses.elevated} ${bgClasses.hover} text-slate-700 dark:text-blue-100`
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${isAllSelected ? 'text-white' : 'text-indigo-500'}`} />
            <span>{getTranslation(settings.language, 'allSources')}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-all ${
                isAllSelected
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200/90 dark:bg-blue-950 text-slate-700 dark:text-blue-200'
              }`}
            >
              {totalArticlesCount}
            </span>
          </button>

          {/* Individual Websites Pills (التصنيف حسب الموقع) */}
          {sources
            .filter((s) => s.enabled)
            .map((src) => {
              const isSelected = selectedSourceId === src.id;
              const count = sourceCounts[src.id] || 0;

              return (
                <button
                  key={src.id}
                  id={`source-tab-${src.id}`}
                  onClick={() => onSelectSource(src.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 relative select-none shadow-xs ${
                    isSelected
                      ? `${theme.primary} text-white shadow-md shadow-blue-600/25 scale-[1.02]`
                      : `${bgClasses.elevated} ${bgClasses.hover} text-slate-700 dark:text-blue-100`
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="activeSourcePill"
                      className="absolute inset-0 rounded-2xl bg-white/10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  {getSourceIcon(src.iconName)}
                  <span>{settings.language === 'en' && src.nameEn ? src.nameEn : src.name}</span>
                  
                  {src.isForeign && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold">
                      EN
                    </span>
                  )}

                  {/* Article count for this website */}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold transition-all ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200/90 dark:bg-blue-950 text-slate-700 dark:text-blue-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
