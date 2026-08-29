import React, { useState, useMemo } from 'react';
import { 
  X, 
  Globe2, 
  ExternalLink, 
  Check, 
  Search, 
  Layers, 
  PlusCircle,
  Radio,
  Newspaper,
  Tv,
  Trophy,
  Cpu,
  TrendingUp,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { NewsSource, AppSettings } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface WebsitesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: NewsSource[];
  sourceCounts: Record<string, number>;
  selectedSourceId: string | null;
  onSelectSource: (sourceId: string | null) => void;
  onToggleSource: (sourceId: string) => void;
  onOpenSourceManager: () => void;
  settings: AppSettings;
}

export const WebsitesDrawer: React.FC<WebsitesDrawerProps> = ({
  isOpen,
  onClose,
  sources,
  sourceCounts,
  selectedSourceId,
  onSelectSource,
  onToggleSource,
  onOpenSourceManager,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  // Total count of all available articles across all sources
  const totalArticles = useMemo(() => {
    return Object.values(sourceCounts).reduce<number>((acc, count) => acc + (typeof count === 'number' ? count : 0), 0);
  }, [sourceCounts]);

  // Filter sources based on search
  const filteredSources = useMemo(() => {
    return sources.filter((src) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = src.name.toLowerCase().includes(q) || (src.nameEn || '').toLowerCase().includes(q);
        const matchesUrl = src.url.toLowerCase().includes(q);
        const matchesCountry = (src.country || '').toLowerCase().includes(q);
        return matchesName || matchesUrl || matchesCountry;
      }
      return true;
    });
  }, [sources, searchQuery]);

  const getSourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio': return <Radio className="w-5 h-5 text-amber-500" />;
      case 'Tv': return <Tv className="w-5 h-5 text-sky-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Newspaper': return <Newspaper className="w-5 h-5 text-emerald-500" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-teal-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-500" />;
      default: return <Globe2 className="w-5 h-5 text-blue-500" />;
    }
  };

  const isRtl = settings.language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="websites-drawer-container">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Sidebar Panel */}
          <motion.div
            initial={{ x: isRtl ? -400 : 400 }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? -400 : 400 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className={`relative w-full max-w-md h-full shadow-2xl flex flex-col z-10 ${bgClasses.surface}`}
          >
            {/* Header */}
            <div className={`p-5 border-b flex items-center justify-between gap-3 ${bgClasses.header}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${theme.primary}`}>
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base text-slate-900 dark:text-white">
                    {getTranslation(settings.language, 'websitesDrawerTitle')}
                  </h2>
                  <p className={`text-xs ${bgClasses.muted}`}>
                    {getTranslation(settings.language, 'websitesCount', { n: sources.length })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="close-websites-drawer-btn"
                onClick={onClose}
                className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="p-4 border-b border-slate-100 dark:border-blue-900/30">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute right-3.5 rtl:right-3.5 ltr:left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن موقع إخباري..."
                  className={`w-full py-2 px-10 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 ${theme.ring} bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/50 dark:border-slate-700/50`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 rtl:left-3 ltr:right-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick "All Websites" Selector */}
            <div className="px-4 pt-3 pb-1">
              <button
                type="button"
                id="select-all-websites-btn"
                onClick={() => {
                  onSelectSource(null);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all font-bold text-xs shadow-sm ${
                  selectedSourceId === null
                    ? `${theme.primary} text-white shadow-md`
                    : `${bgClasses.card} ${bgClasses.hover}`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${selectedSourceId === null ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-950/60'}`}>
                    <Layers className={`w-4 h-4 ${selectedSourceId === null ? 'text-white' : 'text-blue-500'}`} />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm">{getTranslation(settings.language, 'allSources')}</p>
                    <p className={`text-[11px] ${selectedSourceId === null ? 'text-white/80' : bgClasses.muted}`}>
                      عرض جميع الأخبار الواردة من كافة المواقع المفعلة
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  selectedSourceId === null ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-blue-950 text-slate-800 dark:text-blue-100'
                }`}>
                  {totalArticles}
                </span>
              </button>
            </div>

            {/* List of Websites */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <p className={`text-[11px] font-bold ${bgClasses.muted} px-1`}>
                {getTranslation(settings.language, 'filterByWebsite')}
              </p>

              {filteredSources.map((source) => {
                const isSelected = selectedSourceId === source.id;
                const count = sourceCounts[source.id] || 0;

                return (
                  <div
                    key={source.id}
                    className={`p-3 rounded-2xl transition-all flex items-center justify-between gap-3 shadow-xs ${
                      isSelected
                        ? `ring-2 ring-blue-500 ${bgClasses.card}`
                        : `${bgClasses.card} ${bgClasses.hover}`
                    }`}
                  >
                    {/* Clickable Area to Select and Filter */}
                    <div
                      onClick={() => {
                        onSelectSource(source.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#152347] flex items-center justify-center shrink-0">
                        {getSourceIcon(source.iconName)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`font-black text-xs sm:text-sm truncate ${isSelected ? theme.primaryText : 'text-slate-900 dark:text-white'}`}>
                            {settings.language === 'en' && source.nameEn ? source.nameEn : source.name}
                          </h4>
                          {source.isForeign && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold">
                              EN
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] ${bgClasses.muted} truncate flex items-center gap-1`}>
                          <span>{source.country || 'موقع إخباري'}</span>
                          <span>•</span>
                          <span className="font-bold text-sky-600 dark:text-sky-400">{count} خبر</span>
                        </p>
                      </div>
                    </div>

                    {/* External Link & Toggle Switch */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-xl ${bgClasses.elevated} text-slate-400 hover:text-blue-500 transition-colors`}
                        title="زيارة الموقع الأصلي"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSource(source.id);
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                          source.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={source.enabled ? 'الموقع مفعل' : 'الموقع معطل'}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white shadow-xs"
                          animate={{ x: source.enabled ? (isRtl ? -16 : 16) : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer: Manage Sources Link */}
            <div className={`p-4 border-t ${bgClasses.header}`}>
              <button
                type="button"
                id="drawer-manage-sources-btn"
                onClick={() => {
                  onClose();
                  onOpenSourceManager();
                }}
                className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs ${bgClasses.elevated} ${bgClasses.hover} text-blue-600 dark:text-blue-400`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{getTranslation(settings.language, 'manageSources')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
