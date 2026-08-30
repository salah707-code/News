import React from 'react';
import { 
  X, 
  BarChart3, 
  BookOpen, 
  Clock, 
  Flame, 
  TrendingUp, 
  Award, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  Calendar,
  Globe2
} from 'lucide-react';
import { AppSettings, ReadingStats } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion } from 'motion/react';

interface StatsModalProps {
  stats: ReadingStats;
  onClearStats: () => void;
  onClose: () => void;
  settings: AppSettings;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  stats,
  onClearStats,
  onClose,
  settings,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const totalMinutes = stats.totalReadingMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const timeFormatted = hours > 0 
    ? `${hours} ${getTranslation(settings.language, 'hours')} و ${remainingMins} ${getTranslation(settings.language, 'minutes')}`
    : `${totalMinutes} ${getTranslation(settings.language, 'minutes')}`;

  // Calculate top sources reading breakdown (المواقع الإخبارية الأكثر قراءة)
  const sourcesMap = stats.sourceCounts || stats.categoryCounts || {};
  const sortedSources: [string, number][] = Object.entries(sourcesMap)
    .map(([k, v]): [string, number] => [k, Number(v) || 0])
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const maxSourceCount = sortedSources.length > 0 ? sortedSources[0][1] : 1;
  const totalHits = sortedSources.reduce((acc, curr) => acc + curr[1], 0) || 1;

  // Reading Level Badge
  const getReadingBadge = (count: number) => {
    if (count >= 50) return { titleAr: 'قارئ ماسي خبير', titleEn: 'Diamond Reader', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    if (count >= 20) return { titleAr: 'قارئ ذهبي متميز', titleEn: 'Gold Reader', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (count >= 5) return { titleAr: 'قارئ فضي مواظب', titleEn: 'Silver Reader', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    return { titleAr: 'قارئ برونزي جديد', titleEn: 'Bronze Explorer', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  };

  const badge = getReadingBadge(stats.totalArticlesRead);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in" id="stats-modal-backdrop">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 ${bgClasses.surface}`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${bgClasses.header}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl text-white shadow-md ${theme.primary}`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>{getTranslation(settings.language, 'myReadingStats')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badge.color}`}>
                  {settings.language === 'en' ? badge.titleEn : badge.titleAr}
                </span>
              </h2>
              <p className={`text-xs ${bgClasses.muted}`}>
                إحصائيات القراءة ومتابعة المواقع الإخبارية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-2xl flex flex-col justify-between ${bgClasses.card} shadow-xs border border-slate-100 dark:border-slate-800`}>
              <div className="flex items-center justify-between text-blue-500 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60">المجموع</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {stats.totalArticlesRead}
                </span>
                <p className={`text-xs font-bold ${bgClasses.muted} mt-0.5`}>
                  {getTranslation(settings.language, 'totalArticlesRead')}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl flex flex-col justify-between ${bgClasses.card} shadow-xs border border-slate-100 dark:border-slate-800`}>
              <div className="flex items-center justify-between text-amber-500 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60">وقت</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {stats.totalReadingMinutes}
                </span>
                <p className={`text-xs font-bold ${bgClasses.muted} mt-0.5`}>
                  {getTranslation(settings.language, 'minutes')} قراءة
                </p>
              </div>
            </div>

            <div className={`col-span-2 sm:col-span-1 p-4 rounded-2xl flex flex-col justify-between ${bgClasses.card} shadow-xs border border-slate-100 dark:border-slate-800`}>
              <div className="flex items-center justify-between text-emerald-500 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">المعدل</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {stats.totalArticlesRead > 0 ? (stats.totalReadingMinutes / stats.totalArticlesRead).toFixed(1) : '0'}
                </span>
                <p className={`text-xs font-bold ${bgClasses.muted} mt-0.5`}>
                  دقيقة / مقال
                </p>
              </div>
            </div>
          </div>

          {/* Most Read News Sources Breakdown */}
          <div className={`p-5 rounded-3xl ${bgClasses.card} shadow-xs border border-slate-100 dark:border-slate-800 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-500" />
                <span>المواقع الإخبارية الأكثر متابعة</span>
              </h3>
              <span className={`text-[11px] font-bold ${bgClasses.muted}`}>
                نسبة المتابعة
              </span>
            </div>

            {sortedSources.length === 0 ? (
              <p className={`text-xs text-center py-4 ${bgClasses.muted}`}>
                لم تقم بقراءة مقالات كافية بعد لإظهار المواقع الأكثر متابعة. ابدأ بتصفح الأخبار!
              </p>
            ) : (
              <div className="space-y-3">
                {sortedSources.map(([sourceName, count]) => {
                  const percentage = Math.round((count / totalHits) * 100);
                  const barWidth = Math.max(8, Math.round((count / maxSourceCount) * 100));

                  return (
                    <div key={sourceName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 dark:text-slate-200">
                          {sourceName}
                        </span>
                        <span className={`${bgClasses.muted} text-[11px]`}>
                          {count} مقال ({percentage}%)
                        </span>
                      </div>
                      {/* Bar graph track */}
                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 bg-blue-500`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reading Habit Tip */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-blue-600 dark:text-blue-400">
                متابعة متوازنة للمصادر الإخبارية
              </p>
              <p className={`text-[11px] ${bgClasses.muted} leading-relaxed`}>
                قراءة الأخبار من عدة مواقع إخبارية مثل الجزيرة، العربية، بي بي سي، وهسبريس يمنحك رؤية شاملة وتحليلاً دقيقاً لمجريات الأحداث.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${bgClasses.header}`}>
          <button
            onClick={onClearStats}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{settings.language === 'en' ? 'Clear History' : 'مسح السجل'}</span>
          </button>

          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 ${theme.primary}`}
          >
            {settings.language === 'en' ? 'Close' : 'إغلاق'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
