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
  Plus
} from 'lucide-react';
import { NewsSource, AppSettings } from '../types';
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
  onOpenSourceManager?: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  sources,
  selectedSourceId,
  onSelectSource,
  sourceCounts,
  totalArticlesCount,
  settings,
  onOpenWebsitesDrawer,
  onOpenSourceManager,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const getSourceIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-500'}`;
    switch (iconName) {
      case 'Radio': return <Radio className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-500'}`} />;
      case 'Tv': return <Tv className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-sky-500'}`} />;
      case 'Flame': return <Flame className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-rose-500'}`} />;
      case 'Newspaper': return <Newspaper className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />;
      case 'Trophy': return <Trophy className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-400'}`} />;
      case 'TrendingUp': return <TrendingUp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-teal-500'}`} />;
      case 'Cpu': return <Cpu className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-purple-500'}`} />;
      default: return <Globe2 className={iconClass} />;
    }
  };

  const enabledSources = sources.filter((s) => s.enabled);

  return (
    <div className={`w-full overflow-hidden transition-colors duration-200 shadow-xs ${bgClasses.surface} border-b border-slate-200/60 dark:border-slate-800`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
        {/* Label and Quick Manage button */}
        <div className="shrink-0 flex items-center gap-1.5 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onOpenWebsitesDrawer}
            title={getTranslation(settings.language, 'websitesDrawerTitle')}
            className={`p-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 ${bgClasses.elevated} ${bgClasses.hover} text-slate-800 dark:text-slate-100 shadow-xs`}
          >
            <Globe2 className="w-4 h-4 text-sky-500" />
            <span className="hidden sm:inline">{getTranslation(settings.language, 'sources')}</span>
          </button>
        </div>

        {/* Scrollable News Sources / Channels Tabs */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          {/* All Sources Pill */}
          <button
            id="source-filter-all"
            onClick={() => onSelectSource(null)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 relative select-none shadow-xs ${
              selectedSourceId === null
                ? `${theme.primary} text-white shadow-md scale-[1.02]`
                : `${bgClasses.elevated} ${bgClasses.hover} text-slate-700 dark:text-slate-200`
            }`}
          >
            {selectedSourceId === null && (
              <motion.span
                layoutId="activeSourcePill"
                className="absolute inset-0 rounded-2xl bg-white/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Layers className={`w-4 h-4 ${selectedSourceId === null ? 'text-white' : 'text-slate-500'}`} />
            <span>{getTranslation(settings.language, 'allSources')}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold transition-all ${
                selectedSourceId === null
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {totalArticlesCount}
            </span>
          </button>

          {/* Individual News Sources (الجزيرة، العربية، بي بي سي، هسبريس، المصري اليوم...) */}
          {enabledSources.map((src) => {
            const isSelected = selectedSourceId === src.id;
            const count = sourceCounts[src.id] || 0;

            return (
              <button
                key={src.id}
                id={`source-pill-${src.id}`}
                onClick={() => onSelectSource(isSelected ? null : src.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 relative select-none shadow-xs ${
                  isSelected
                    ? `${theme.primary} text-white shadow-md scale-[1.02]`
                    : `${bgClasses.elevated} ${bgClasses.hover} text-slate-700 dark:text-slate-200`
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeSourcePill"
                    className="absolute inset-0 rounded-2xl bg-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                {getSourceIcon(src.iconName, isSelected)}
                <span>{settings.language === 'en' && src.nameEn ? src.nameEn : src.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold transition-all ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Add custom source shortcut */}
          {onOpenSourceManager && (
            <button
              type="button"
              onClick={onOpenSourceManager}
              title={getTranslation(settings.language, 'addSource')}
              className={`p-1.5 px-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-blue-500 hover:border-blue-400`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation(settings.language, 'addSource')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
