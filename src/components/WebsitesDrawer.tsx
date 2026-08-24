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
import { NewsSource, AppSettings, NewsCategory } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface WebsitesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: NewsSource[];
  categories: NewsCategory[];
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
  categories,
  sourceCounts,
  selectedSourceId,
  onSelectSource,
  onToggleSource,
  onOpenSourceManager,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  // Total count of all available articles across all sources
  const totalArticles = useMemo(() => {
    return Object.values(sourceCounts).reduce<number>((acc, count) => acc + (typeof count === 'number' ? count : 0), 0);
  }, [sourceCounts]);

  // Filter sources based on search and category
  const filteredSources = useMemo(() => {
    return sources.filter((src) => {
      if (filterCategory !== 'all' && src.category !== filterCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = src.name.toLowerCase().includes(q);
        const matchesUrl = src.url.toLowerCase().includes(q);
        const matchesCountry = (src.country || '').toLowerCase().includes(q);
        return matchesName || matchesUrl || matchesCountry;
      }
      return true;
    });
  }, [sources, searchQuery, filterCategory]);

  const getSourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio': return <Radio className="w-5 h-5 text-amber-300" />;
      case 'Tv': return <Tv className="w-5 h-5 text-sky-300" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-300" />;
      case 'Newspaper': return <Newspaper className="w-5 h-5 text-emerald-300" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-yellow-300" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-teal-300" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-300" />;
      default: return <Globe2 className="w-5 h-5 text-blue-200" />;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Right Sliding Panel */}
          <motion.aside
            initial={{ x: isRtl ? '100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`relative w-full max-w-md h-full shadow-2xl z-10 flex flex-col overflow-hidden ${bgClasses.surface}`}
          >
            {/* Drawer Header */}
            <div className={`p-4 flex items-center justify-between gap-3 ${bgClasses.header}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-tr ${theme.gradient}`}>
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                    <span>{getTranslation(settings.language, 'websitesDrawerTitle')}</span>
                  </h2>
                  <p className={`text-[11px] ${bgClasses.muted}`}>
                    {sources.length} موقع إخباري • {totalArticles} خبر متاح
                  </p>
                </div>
              </div>

              <button
                id="close-websites-drawer-btn"
                onClick={onClose}
                className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
              >
                <X className="w-5 h-5 text-slate-500 hover:text-slate-900 dark:text-blue-200" />
              </button>
            </div>

            {/* Quick Search & Reset Filter */}
            <div className={`p-3.5 space-y-2.5 ${bgClasses.surface}`}>
              {/* Search input */}
              <div className="relative">
                <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-sky-400`} />
                <input
                  type="text"
                  id="websites-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن موقع أو قناة إخبارية..."
                  className={`w-full py-2.5 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 transition-all ${
                    settings.darkMode === 'oled'
                      ? 'bg-[#060b18] text-white placeholder:text-neutral-500'
                      : settings.darkMode === 'dark'
                      ? 'bg-[#0a1128] text-white placeholder:text-blue-300/40'
                      : 'bg-slate-100 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              {/* Reset to All Sources Filter button */}
              <button
                id="select-all-sources-drawer-btn"
                onClick={() => {
                  onSelectSource(null);
                  onClose();
                }}
                className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                  selectedSourceId === null
                    ? `${theme.primary} text-white shadow-md`
                    : `${bgClasses.elevated} ${bgClasses.hover}`
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>{getTranslation(settings.language, 'allWebsites')}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold ${
                  selectedSourceId === null ? 'bg-white/20 text-white' : `${theme.badge}`
                }`}>
                  {totalArticles} خبر
                </span>
              </button>
            </div>

            {/* List of Websites & Sources with Live Counts */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 scroll-smooth">
              {filteredSources.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Globe2 className="w-8 h-8 mx-auto text-sky-400 opacity-40" />
                  <p className={`text-xs ${bgClasses.muted}`}>لم يتم العثور على موقع بهذا الاسم</p>
                </div>
              ) : (
                filteredSources.map((source) => {
                  const articleCount = sourceCounts[source.name] || sourceCounts[source.id] || 0;
                  const isSelected = selectedSourceId === source.id || selectedSourceId === source.name;

                  return (
                    <div
                      key={source.id}
                      id={`source-item-drawer-${source.id}`}
                      className={`group rounded-2xl p-3 transition-all flex flex-col gap-2 shadow-xs ${
                        isSelected 
                          ? `${theme.primaryLight} ring-2 ${theme.ring}` 
                          : `${bgClasses.card} ${bgClasses.hover}`
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        {/* Source Branding & Name (Click to filter) */}
                        <div 
                          onClick={() => {
                            onSelectSource(source.id);
                            onClose();
                          }}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <div 
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-md transition-transform group-hover:scale-105"
                            style={{ backgroundColor: source.color || '#2563eb' }}
                          >
                            {getSourceIcon(source.iconName)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-xs sm:text-sm truncate">
                                {source.name}
                              </h3>
                              {isSelected && (
                                <CheckCircle2 className={`w-4 h-4 ${theme.primaryText} shrink-0`} />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-blue-200/60 truncate">
                              <span>{source.country || 'موقع إخباري'}</span>
                              <span>•</span>
                              <span className="truncate">{source.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Article Count Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span 
                            onClick={() => {
                              onSelectSource(source.id);
                              onClose();
                            }}
                            className={`cursor-pointer px-3 py-1 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1 ${
                              articleCount > 0 
                                ? `${theme.badge} group-hover:${theme.primary} group-hover:text-white`
                                : 'bg-slate-100 dark:bg-blue-950/40 text-slate-400'
                            }`}
                            title={`يحتوي على ${articleCount} مقال`}
                          >
                            <span>{articleCount}</span>
                            <span className="text-[10px] font-normal">خبر</span>
                          </span>

                          {/* Open Website External Link */}
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={getTranslation(settings.language, 'openWebsite')}
                            className={`p-2 rounded-xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-sky-500 hover:text-sky-600" />
                          </a>
                        </div>
                      </div>

                      {/* Quick Toggle Source active/inactive */}
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-blue-900/30">
                        <span className={`text-[10px] font-semibold flex items-center gap-1.5 ${source.enabled ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`}>
                          <span className={`w-2 h-2 rounded-full ${source.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{source.enabled ? 'متصل ومفعل' : 'متوقف مؤقتاً'}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleSource(source.id)}
                            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold transition-colors ${
                              source.enabled 
                                ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-blue-950/50 text-slate-400'
                            }`}
                          >
                            {source.enabled ? 'تعطيل' : 'تفعيل'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectSource(source.id);
                              onClose();
                            }}
                            className={`px-2.5 py-0.5 rounded-xl text-[10px] font-bold ${theme.primaryText} hover:underline`}
                          >
                            عرض الأخبار ←
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Drawer Action */}
            <div className={`p-3.5 flex items-center justify-between gap-2 ${bgClasses.header}`}>
              <button
                id="drawer-manage-sources-btn"
                onClick={() => {
                  onClose();
                  onOpenSourceManager();
                }}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${theme.primary} text-white hover:opacity-95`}
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>إدارة المصادر وإضافة موقع جديد</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
