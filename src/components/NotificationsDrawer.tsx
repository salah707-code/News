import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Zap, 
  Clock 
} from 'lucide-react';
import { NotificationItem, AppSettings } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsDrawerProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification?: (id: string) => void;
  onSelectNotification: (notif: NotificationItem) => void;
  settings: AppSettings;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onSelectNotification,
  settings,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const isRtl = settings.language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in" id="notifications-drawer-backdrop">
      <motion.div
        initial={{ x: isRtl ? -360 : 360, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: isRtl ? -360 : 360, opacity: 0 }}
        className={`w-full max-w-sm h-full shadow-2xl flex flex-col ${bgClasses.surface}`}
      >
        {/* Header */}
        <div className={`px-4 py-3.5 border-b flex items-center justify-between gap-2 ${bgClasses.header}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-2xl ${theme.primary} text-white shadow-md`}>
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {getTranslation(settings.language, 'notifications')}
              </h3>
              <p className={`text-[10px] ${bgClasses.muted}`}>
                اسحب التنبيه للحذف ➔
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-notifications-btn"
            onClick={onClose}
            className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        {notifications.length > 0 && (
          <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${bgClasses.elevated}`}>
            <button
              type="button"
              id="mark-all-read-btn"
              onClick={onMarkAllAsRead}
              className={`flex items-center gap-1 font-bold ${theme.primaryText} hover:underline`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{getTranslation(settings.language, 'markAllRead')}</span>
            </button>
            <button
              type="button"
              id="clear-all-notifs-btn"
              onClick={onClearAll}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{getTranslation(settings.language, 'clearAll')}</span>
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30" />
              <p>{getTranslation(settings.language, 'noNotifications')}</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notif) => (
                <div key={notif.id} className="relative overflow-hidden rounded-2xl">
                  {/* Background Reveal Action on Swipe */}
                  <div className="absolute inset-0 bg-red-600 rounded-2xl flex items-center justify-start px-4 text-white text-xs font-bold gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>حذف التنبيه</span>
                  </div>

                  {/* Draggable Notification Item Card */}
                  <motion.div
                    layout
                    drag="x"
                    dragConstraints={{ left: 0, right: 180 }}
                    dragElastic={{ left: 0, right: 0.8 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 90 || info.velocity.x > 400) {
                        if (onDeleteNotification) {
                          onDeleteNotification(notif.id);
                        }
                      }
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 200, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    id={`notif-item-${notif.id}`}
                    onClick={() => onSelectNotification(notif)}
                    className={`relative p-3.5 rounded-2xl cursor-pointer select-none transition-shadow shadow-xs ${
                      !notif.read ? `${theme.primaryLight}` : `${bgClasses.card} ${bgClasses.hover}`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        {notif.isBreaking && (
                          <span className="px-1.5 py-0.5 rounded-lg bg-rose-600 text-white text-[9px] font-bold flex items-center gap-0.5 shadow-xs">
                            <Zap className="w-2.5 h-2.5 fill-current" />
                            {getTranslation(settings.language, 'breakingNews')}
                          </span>
                        )}
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {notif.title}
                        </h4>
                      </div>
                      {!notif.read && (
                        <span className={`w-2 h-2 rounded-full ${theme.primary} shrink-0`} />
                      )}
                    </div>

                    <p className={`text-xs ${bgClasses.muted} line-clamp-2 leading-relaxed mb-2`}>
                      {notif.body}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};
