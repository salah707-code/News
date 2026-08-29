import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Moon, 
  Sun, 
  Type, 
  Zap, 
  RefreshCw, 
  Globe2, 
  Bell, 
  Smartphone, 
  Check, 
  LayoutGrid, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  BarChart3,
  Clock,
  HardDrive,
  Trash2,
  Database
} from 'lucide-react';
import { AppSettings, ThemeColor, DarkMode, FontSize, ReadingSpeed, Language } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { getImageCacheMetrics, clearAllImageCache } from '../utils/imageCache';
import { motion } from 'motion/react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenStats?: () => void;
  onOpenReminders?: () => void;
  onClearAppData?: () => void;
  onClose: () => void;
}

const THEME_OPTIONS: { id: ThemeColor; nameAr: string; nameEn: string; colorHex: string }[] = [
  { id: 'blue', nameAr: 'أزرق عالمي', nameEn: 'Global Blue', colorHex: '#2563eb' },
  { id: 'indigo', nameAr: 'نيلي ملكي', nameEn: 'Royal Indigo', colorHex: '#4f46e5' },
  { id: 'emerald', nameAr: 'زمردي راقٍ', nameEn: 'Emerald Green', colorHex: '#059669' },
  { id: 'amber', nameAr: 'كهرماني دافئ', nameEn: 'Sunset Amber', colorHex: '#d97706' },
  { id: 'crimson', nameAr: 'أحمر قرمزي', nameEn: 'Crimson Red', colorHex: '#e11d48' },
  { id: 'violet', nameAr: 'بنفسجي فاخر', nameEn: 'Deep Violet', colorHex: '#9333ea' },
  { id: 'teal', nameAr: 'تركوازي مائي', nameEn: 'Ocean Teal', colorHex: '#0d9488' },
  { id: 'orange', nameAr: 'برتقالي مشرق', nameEn: 'Vibrant Orange', colorHex: '#ea580c' },
  { id: 'cyan', nameAr: 'سماوي بارد', nameEn: 'Sky Cyan', colorHex: '#0891b2' },
  { id: 'rose', nameAr: 'وردي عصري', nameEn: 'Modern Rose', colorHex: '#db2777' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onOpenStats,
  onOpenReminders,
  onClearAppData,
  onClose,
}) => {
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [cacheMetrics, setCacheMetrics] = useState({ count: 0, sizeMb: '0.0' });
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheClearFeedback, setCacheClearFeedback] = useState(false);
  const [appDataClearFeedback, setAppDataClearFeedback] = useState(false);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  // Load cache metrics on mount
  useEffect(() => {
    const updateMetrics = async () => {
      const metrics = await getImageCacheMetrics();
      setCacheMetrics(metrics);
    };
    updateMetrics();
  }, []);

  const handleSettingChange = (partial: Partial<AppSettings>) => {
    onUpdateSettings(partial);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleClearImageCache = async () => {
    setIsClearingCache(true);
    await clearAllImageCache();
    const updated = await getImageCacheMetrics();
    setCacheMetrics(updated);
    setIsClearingCache(false);
    setCacheClearFeedback(true);
    setTimeout(() => setCacheClearFeedback(false), 3000);
  };

  const handleClearAllAppData = async () => {
    if (window.confirm(getTranslation(settings.language, 'clearAllAppDataConfirm'))) {
      setIsClearingCache(true);
      await clearAllImageCache();
      if (onClearAppData) {
        onClearAppData();
      }
      const updated = await getImageCacheMetrics();
      setCacheMetrics(updated);
      setIsClearingCache(false);
      setAppDataClearFeedback(true);
      setTimeout(() => setAppDataClearFeedback(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in" id="settings-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden ${bgClasses.surface}`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${bgClasses.header}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl text-white ${theme.primary} shadow-md`}>
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {getTranslation(settings.language, 'settings')}
              </h2>
              <p className={`text-xs ${bgClasses.muted}`}>
                {getTranslation(settings.language, 'saveSettingsSuccess')} تلقائياً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedFeedback && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>محفوظ</span>
              </span>
            )}

            <button
              id="close-settings-modal-btn"
              onClick={onClose}
              className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Settings Options */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Tools: Stats & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {onOpenStats && (
              <button
                type="button"
                id="settings-open-stats-btn"
                onClick={() => {
                  onClose();
                  onOpenStats();
                }}
                className={`p-4 rounded-3xl flex items-center justify-between transition-all ${bgClasses.elevated} ${bgClasses.hover} border border-indigo-500/20`}
              >
                <div className="flex items-center gap-3 text-right">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {getTranslation(settings.language, 'myReadingStats')}
                    </h3>
                    <p className={`text-[11px] ${bgClasses.muted}`}>
                      {getTranslation(settings.language, 'myReadingStatsDesc')}
                    </p>
                  </div>
                </div>
              </button>
            )}

            {onOpenReminders && (
              <button
                type="button"
                id="settings-open-reminders-btn"
                onClick={() => {
                  onClose();
                  onOpenReminders();
                }}
                className={`p-4 rounded-3xl flex items-center justify-between transition-all ${bgClasses.elevated} ${bgClasses.hover} border border-amber-500/20`}
              >
                <div className="flex items-center gap-3 text-right">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {getTranslation(settings.language, 'myReminders')}
                    </h3>
                    <p className={`text-[11px] ${bgClasses.muted}`}>
                      {getTranslation(settings.language, 'remindersDesc')}
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* 1. Theme Color (الألوان حسب النظام العالمي) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-500" />
                <span>{getTranslation(settings.language, 'themeColor')}</span>
              </label>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                {THEME_OPTIONS.find(t => t.id === settings.themeColor)?.nameAr || settings.themeColor}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = settings.themeColor === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`theme-color-${opt.id}`}
                    onClick={() => handleSettingChange({ themeColor: opt.id })}
                    className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all group ${
                      isSelected
                        ? `ring-2 ring-blue-500 ring-offset-2 shadow-sm ${bgClasses.card}`
                        : `${bgClasses.elevated} ${bgClasses.hover}`
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white transition-transform group-hover:scale-110"
                      style={{ backgroundColor: opt.colorHex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span className="truncate">{settings.language === 'en' ? opt.nameEn : opt.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Visual Mode (إضافة الوضع الفاتح، والوضع الليلي) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{getTranslation(settings.language, 'displayMode')}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'light' as DarkMode, label: getTranslation(settings.language, 'lightMode'), desc: 'أبيض ناصع وواضح', icon: Sun, iconColor: 'text-amber-500' },
                { id: 'dark' as DarkMode, label: getTranslation(settings.language, 'darkMode'), desc: 'أزرق كحلي ملكي مريح', icon: Moon, iconColor: 'text-indigo-400' },
                { id: 'oled' as DarkMode, label: getTranslation(settings.language, 'oledMode'), desc: 'أسود لافت موفر للطاقة', icon: Moon, iconColor: 'text-blue-500' },
              ].map((mode) => {
                const isSelected = settings.darkMode === mode.id;
                const ModeIcon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    id={`display-mode-${mode.id}`}
                    onClick={() => handleSettingChange({ darkMode: mode.id })}
                    className={`p-3.5 rounded-2xl flex flex-col items-start gap-1 transition-all text-right ${
                      isSelected
                        ? `ring-2 ring-blue-500 shadow-md ${bgClasses.card}`
                        : `${bgClasses.elevated} ${bgClasses.hover}`
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <ModeIcon className={`w-4 h-4 ${mode.iconColor}`} />
                        <span>{mode.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-500 stroke-[2.5]" />}
                    </div>
                    <p className={`text-[11px] ${bgClasses.muted} mt-1`}>{mode.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Reading / Card Style Format */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-teal-500" />
              <span>{getTranslation(settings.language, 'readingSpeed')}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {[
                { id: 'normal' as ReadingSpeed, label: getTranslation(settings.language, 'readingSpeedNormal'), desc: 'بطاقات إخبارية واضحة' },
                { id: 'grid' as ReadingSpeed, label: getTranslation(settings.language, 'readingSpeedGrid'), desc: 'شبكة مربعات ذكية' },
              ].map((speed) => {
                const isSelected = settings.readingSpeed === speed.id;
                return (
                  <button
                    key={speed.id}
                    id={`reading-format-${speed.id}`}
                    onClick={() => handleSettingChange({ readingSpeed: speed.id })}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                      isSelected
                        ? `ring-2 ring-blue-500 shadow-md ${bgClasses.card}`
                        : `${bgClasses.elevated} ${bgClasses.hover}`
                    }`}
                  >
                    <div className="text-right">
                      <div className="font-bold text-xs">{speed.label}</div>
                      <div className={`text-[10px] ${bgClasses.muted}`}>{speed.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Font Size for Reading */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-purple-500" />
                <span>{getTranslation(settings.language, 'fontSize')}</span>
              </label>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                {FONT_SIZES[settings.fontSize][settings.language === 'en' ? 'labelEn' : 'labelAr']}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['sm', 'base', 'lg', 'xl', '2xl'] as FontSize[]).map((sz) => {
                const isSelected = settings.fontSize === sz;
                return (
                  <button
                    key={sz}
                    id={`font-size-${sz}`}
                    onClick={() => handleSettingChange({ fontSize: sz })}
                    className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold text-center transition-all ${
                      isSelected
                        ? `${theme.primary} text-white shadow-md`
                        : `${bgClasses.elevated} ${bgClasses.hover}`
                    }`}
                  >
                    {FONT_SIZES[sz][settings.language === 'en' ? 'labelEn' : 'labelAr']}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Language (Strictly Arabic and English - Removed French as requested) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-sky-500" />
              <span>اللغة / Language</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'ar' as Language, label: 'العربية (Arabic)', sub: 'واجهة عربية أصيلة' },
                { id: 'en' as Language, label: 'English', sub: 'English Interface' },
              ].map((lang) => {
                const isSelected = settings.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    id={`lang-btn-${lang.id}`}
                    onClick={() => handleSettingChange({ language: lang.id })}
                    className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                      isSelected
                        ? `ring-2 ring-blue-500 shadow-md ${bgClasses.card}`
                        : `${bgClasses.elevated} ${bgClasses.hover}`
                    }`}
                  >
                    <div className="text-right rtl:text-right ltr:text-left">
                      <span className="font-bold text-xs block">{lang.label}</span>
                      <span className={`text-[10px] ${bgClasses.muted}`}>{lang.sub}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Auto Refresh Intervals */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <span>{getTranslation(settings.language, 'autoRefresh')}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { sec: 0, label: getTranslation(settings.language, 'autoRefreshOff') },
                { sec: 60, label: getTranslation(settings.language, 'autoRefresh1m') },
                { sec: 180, label: getTranslation(settings.language, 'autoRefresh3m') },
                { sec: 300, label: getTranslation(settings.language, 'autoRefresh5m') },
              ].map((item) => {
                const isSelected = settings.autoRefreshInterval === item.sec;
                return (
                  <button
                    key={item.sec}
                    id={`auto-refresh-${item.sec}`}
                    onClick={() => handleSettingChange({ autoRefreshInterval: item.sec })}
                    className={`p-2.5 rounded-2xl text-xs font-bold text-center transition-all ${
                      isSelected
                        ? `${theme.primary} text-white shadow-md`
                        : `${bgClasses.elevated} ${bgClasses.hover}`
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Image Cache & App Data Management */}
          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-500" />
                <span>{getTranslation(settings.language, 'imageCache')}</span>
              </label>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                {getTranslation(settings.language, 'cachedImagesCount', { n: cacheMetrics.count, mb: cacheMetrics.sizeMb })}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-400">
              {getTranslation(settings.language, 'imageCacheDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Clear Image Cache Button */}
              <button
                type="button"
                id="clear-image-cache-btn"
                onClick={handleClearImageCache}
                disabled={isClearingCache}
                className={`p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all border ${
                  cacheClearFeedback
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : `${bgClasses.elevated} hover:bg-sky-50 dark:hover:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/40`
                }`}
              >
                {cacheClearFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{getTranslation(settings.language, 'clearImageCacheSuccess')}</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4" />
                    <span>{getTranslation(settings.language, 'clearImageCache')}</span>
                  </>
                )}
              </button>

              {/* Clear All App Data & Cache Button */}
              <button
                type="button"
                id="clear-all-app-data-btn"
                onClick={handleClearAllAppData}
                disabled={isClearingCache}
                className={`p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all border ${
                  appDataClearFeedback
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : `${bgClasses.elevated} hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40`
                }`}
              >
                {appDataClearFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{getTranslation(settings.language, 'clearAllAppDataSuccess')}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{getTranslation(settings.language, 'clearAllAppData')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
