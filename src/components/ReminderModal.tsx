import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Bell, 
  Calendar, 
  Check, 
  Trash2, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AppSettings, NewsArticle, ReadingReminder } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface ReminderModalProps {
  article: NewsArticle | null;
  reminders: ReadingReminder[];
  onAddReminder: (reminder: Omit<ReadingReminder, 'id' | 'createdAt'>) => void;
  onDeleteReminder: (reminderId: string) => void;
  onOpenArticle: (articleId: string) => void;
  onClose: () => void;
  settings: AppSettings;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  article,
  reminders,
  onAddReminder,
  onDeleteReminder,
  onOpenArticle,
  onClose,
  settings,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | 'tonight' | 'tomorrow' | 'custom'>(15);
  const [customTime, setCustomTime] = useState<string>('');
  const [successToast, setSuccessToast] = useState(false);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const handleCreateReminder = () => {
    if (!article) return;

    let reminderDate = new Date();

    if (typeof selectedPreset === 'number') {
      reminderDate = new Date(Date.now() + selectedPreset * 60 * 1000);
    } else if (selectedPreset === 'tonight') {
      reminderDate.setHours(20, 0, 0, 0);
      if (reminderDate.getTime() <= Date.now()) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }
    } else if (selectedPreset === 'tomorrow') {
      reminderDate.setDate(reminderDate.getDate() + 1);
      reminderDate.setHours(9, 0, 0, 0);
    } else if (selectedPreset === 'custom' && customTime) {
      reminderDate = new Date(customTime);
    }

    onAddReminder({
      articleId: article.id,
      articleTitle: article.title,
      articleSource: article.source,
      articleImage: article.imageUrl,
      reminderTime: reminderDate.toISOString(),
      notified: false
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const formatRemainingTime = (isoString: string) => {
    const diffMs = new Date(isoString).getTime() - Date.now();
    if (diffMs <= 0) return 'حان وقت القراءة الآن!';
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `متبقي ${diffMins} دقيقة`;
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `متبقي ${diffHours} ساعة و ${remainingMins} د`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in" id="reminder-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-lg max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden ${bgClasses.surface}`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${bgClasses.header}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl text-white bg-amber-500 shadow-md`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {getTranslation(settings.language, 'readingReminder')}
              </h2>
              <p className={`text-xs ${bgClasses.muted}`}>
                جدولة تنبيه للقراءة في الوقت المناسب
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-reminder-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Article Info Box if an article is targeted */}
          {article && (
            <div className={`p-4 rounded-2xl border border-slate-200/80 dark:border-blue-900/40 ${bgClasses.card} space-y-2`}>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                {article.source}
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {article.title}
              </h3>
            </div>
          )}

          {/* Setting Time Options */}
          {article && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>اختر موعد التذكير</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 15, label: 'بعد 15 دقيقة', sub: 'استراحة قصيرة' },
                  { id: 30, label: 'بعد 30 دقيقة', sub: 'نصف ساعة' },
                  { id: 60, label: 'بعد ساعة واحدة', sub: 'لاحقاً اليوم' },
                  { id: 'tonight' as const, label: 'هذا المساء (8:00 م)', sub: 'قراءة ليلية' },
                  { id: 'tomorrow' as const, label: 'غداً صباحاً (9:00 ص)', sub: 'مع قهوة الصباح' },
                  { id: 'custom' as const, label: 'تحديد وقت مخصص', sub: 'تاريخ وساعة محددة' },
                ].map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={String(preset.id)}
                      type="button"
                      onClick={() => setSelectedPreset(preset.id as any)}
                      className={`p-3 rounded-2xl text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? `ring-2 ring-amber-500 shadow-md ${bgClasses.card}`
                          : `${bgClasses.elevated} ${bgClasses.hover}`
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{preset.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <span className={`text-[10px] ${bgClasses.muted} mt-1`}>{preset.sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Date Input */}
              {selectedPreset === 'custom' && (
                <div className="pt-2 animate-fade-in">
                  <input
                    type="datetime-local"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className={`w-full p-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 ${bgClasses.elevated}`}
                  />
                </div>
              )}

              {/* Confirm Set Reminder Button */}
              <button
                type="button"
                id="confirm-set-reminder-btn"
                onClick={handleCreateReminder}
                className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                {successToast ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                    <span>تم ضبط التذكير بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>{getTranslation(settings.language, 'setReminder')}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* List of Scheduled Reminders */}
          <div className="pt-3 border-t border-slate-100 dark:border-blue-900/30 space-y-3">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between">
              <span>{getTranslation(settings.language, 'remindersList')}</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${bgClasses.elevated}`}>
                {reminders.length}
              </span>
            </h4>

            {reminders.length === 0 ? (
              <div className={`p-5 rounded-2xl text-center text-xs ${bgClasses.muted}`}>
                {getTranslation(settings.language, 'noReminders')}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-3 rounded-2xl flex items-center justify-between gap-2 ${bgClasses.card} shadow-sm border border-slate-100 dark:border-blue-900/30`}
                  >
                    <div 
                      className="flex-1 cursor-pointer truncate"
                      onClick={() => {
                        onOpenArticle(rem.articleId);
                        onClose();
                      }}
                    >
                      <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                        {rem.articleTitle}
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatRemainingTime(rem.reminderTime)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteReminder(rem.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title={getTranslation(settings.language, 'cancelReminder')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
