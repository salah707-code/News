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
  Calendar
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

const CATEGORY_NAMES: Record<string, { ar: string; en: string; color: string }> = {
  politics: { ar: 'سياسة', en: 'Politics', color: 'bg-rose-500' },
  economy: { ar: 'اقتصاد', en: 'Economy', color: 'bg-emerald-500' },
  tech: { ar: 'تكنولوجيا', en: 'Technology', color: 'bg-blue-500' },
  sports: { ar: 'رياضة', en: 'Sports', color: 'bg-amber-500' },
  health: { ar: 'صحة وعلوم', en: 'Health & Science', color: 'bg-teal-500' },
  culture: { ar: 'ثقافة وفنون', en: 'Culture & Arts', color: 'bg-purple-500' },
  world: { ar: 'أخبار العالم', en: 'World News', color: 'bg-indigo-500' },
  all: { ar: 'عام', en: 'General', color: 'bg-slate-500' },
};

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

  // Calculate top categories percentages
  const sortedCategories: [string, number][] = Object.entries(stats.categoryCounts || {})
    .map(([k, v]): [string, number] => [k, Number(v) || 0])
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const maxCatCount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;
  const totalCatHits = sortedCategories.reduce((acc, curr) => acc + curr[1], 0) || 1;

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
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden ${bgClasses.surface}`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${bgClasses.header}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl text-white ${theme.primary} shadow-md`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {getTranslation(settings.language, 'myStats')}
              </h2>
              <p className={`text-xs ${bgClasses.muted}`}>
                متابعة عادات القراءة واهتماماتك الإخبارية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="close-stats-modal-btn"
              onClick={onClose}
              className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Level / Badge Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${badge.color}`}>
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">مستوى القراءة الحالي</p>
                <h3 className="text-base font-black">
                  {settings.language === 'en' ? badge.titleEn : badge.titleAr}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 dark:bg-black/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نشط</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-2xl flex flex-col justify-between ${bgClasses.card} shadow-sm border border-slate-100 dark:border-blue-900/30`}>
              <div className="flex items-center justify-between text-indigo-500 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60">إجمالي</span>
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

            <div className={`p-4 rounded-2xl flex flex-col justify-between ${bgClasses.card} shadow-sm border border-slate-100 dark:border-blue-900/30`}>
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

            <div className={`col-span-2 sm:col-span-1 p-4 rounded-2xl flex flex-col justify-between ${bgClasses.card} shadow-sm border border-slate-100 dark:border-blue-900/30`}>
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

          {/* Most Read Categories Chart Breakdown */}
          <div className={`p-5 rounded-3xl ${bgClasses.card} shadow-sm border border-slate-100 dark:border-blue-900/30 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>{getTranslation(settings.language, 'topCategories')}</span>
              </h3>
              <span className={`text-[11px] font-bold ${bgClasses.muted}`}>
                نسبة الاهتمام
              </span>
            </div>

            {sortedCategories.length === 0 ? (
              <p className={`text-xs text-center py-4 ${bgClasses.muted}`}>
                لم تقم بقراءة مقالات كافية بعد لإظهار التصنيفات المفضلة. ابدأ بقراءة بعض الأخبار!
              </p>
            ) : (
              <div className="space-y-3">
                {sortedCategories.map(([catKey, count]) => {
                  const catInfo = CATEGORY_NAMES[catKey] || { ar: catKey, en: catKey, color: 'bg-blue-500' };
                  const percentage = Math.round((count / totalCatHits) * 100);
                  const barWidth = Math.max(8, Math.round((count / maxCatCount) * 100));

                  return (
                    <div key={catKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 dark:text-slate-200">
                          {settings.language === 'en' ? catInfo.en : catInfo.ar}
                        </span>
                        <span className={`${bgClasses.muted} text-[11px]`}>
                          {count} مقال ({percentage}%)
                        </span>
                      </div>
                      {/* Bar graph track */}
                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#0c1630] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${catInfo.color}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Reading History */}
          {stats.history && stats.history.length > 0 && (
            <div className={`p-5 rounded-3xl ${bgClasses.card} shadow-sm border border-slate-100 dark:border-blue-900/30 space-y-3`}>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>سجل القراءات الأخيرة</span>
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.history.slice(0, 10).map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl flex items-center justify-between gap-2 text-xs ${bgClasses.elevated}`}>
                    <div className="truncate flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                      <span className={`text-[10px] ${bgClasses.muted}`}>{item.source}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      +{item.readMinutes || 3} د
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clear Statistics Button */}
          {stats.totalArticlesRead > 0 && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClearStats}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تصفير الإحصائيات</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
