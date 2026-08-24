import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Search, 
  Bell, 
  SlidersHorizontal, 
  RefreshCw, 
  Radio, 
  Smartphone, 
  Monitor, 
  X, 
  Volume2, 
  VolumeX, 
  LayoutGrid, 
  Grid2X2, 
  List, 
  Rows, 
  Flame, 
  Sun, 
  Moon, 
  Globe2 
} from 'lucide-react';
import { AppSettings, DarkMode } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface AndroidHeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenWebsitesDrawer: () => void;
  unreadNotificationsCount: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  autoRefreshCountdown: number;
  totalArticlesCount: number;
  totalSourcesCount: number;
  onTestChime?: () => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenNotifications,
  onOpenWebsitesDrawer,
  unreadNotificationsCount,
  onManualRefresh,
  isRefreshing,
  searchQuery,
  onSearchChange,
  autoRefreshCountdown,
  totalArticlesCount,
  totalSourcesCount,
  onTestChime,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(settings.language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.language]);

  return (
    <header className={`w-full sticky top-0 z-30 transition-colors duration-200 ${bgClasses.header}`}>
      {/* Android System Status Bar */}
      <div className={`px-4 py-1.5 flex items-center justify-between text-xs font-mono select-none opacity-85 border-b border-slate-100/40 dark:border-blue-900/30 ${settings.darkMode === 'light' ? 'text-slate-600' : 'text-blue-200'}`}>
        <div className="flex items-center gap-2 font-semibold">
          <span>{currentTime || '12:00'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-blue-950/70 text-slate-800 dark:text-blue-300 font-sans tracking-wide">
            5G
          </span>
        </div>
        <div className="flex items-center gap-3">
          {settings.autoRefreshInterval > 0 && (
            <div className="flex items-center gap-1.5 text-[10px]" title="عداد التحديث التلقائي">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{autoRefreshCountdown}s</span>
            </div>
          )}
          <Wifi className="w-3.5 h-3.5 text-sky-400" />
          <div className="flex items-center gap-1">
            <span className="text-[10px]">98%</span>
            <Battery className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-2.5">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-tr ${theme.gradient} text-white shrink-0`}>
            <Radio className="w-5 h-5 animate-pulse text-amber-300" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-xl tracking-tight flex items-center gap-1.5">
                <span>{getTranslation(settings.language, 'appName')}</span>
              </h1>
              <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.primary} text-white shadow-xs`}>
                Live
              </span>
            </div>
            <p className={`text-[11px] truncate ${bgClasses.muted}`}>
              {getTranslation(settings.language, 'appSubtitle')} • {totalArticlesCount} {getTranslation(settings.language, 'newsCount', { n: '' })}
            </p>
          </div>
        </div>

        {/* Action Buttons with Rich Graphic Colors & Borderless Design */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Websites & Sources Right Drawer Toggle */}
          <button
            id="open-websites-drawer-header-btn"
            onClick={onOpenWebsitesDrawer}
            title={getTranslation(settings.language, 'websitesDrawerTitle')}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl transition-all relative flex items-center gap-1.5 shadow-xs ${theme.primaryLight} ${bgClasses.hover}`}
          >
            <Globe2 className={`w-4 h-4 ${theme.primaryText}`} />
            <span className="hidden md:inline text-xs font-bold">المواقع</span>
            <span className={`min-w-[18px] h-[18px] px-1 ${theme.primary} text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs`}>
              {totalSourcesCount}
            </span>
          </button>

          {/* Search Toggle */}
          <div className="relative">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center"
                >
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="news-search-input"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={getTranslation(settings.language, 'searchPlaceholder')}
                      autoFocus
                      className={`w-full py-2 px-3 pr-8 text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
                        settings.darkMode === 'oled'
                          ? 'bg-[#060b18] text-white'
                          : settings.darkMode === 'dark'
                          ? 'bg-[#0a1128] text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    />
                    <button
                      id="close-search-btn"
                      onClick={() => {
                        setIsSearchOpen(false);
                        onSearchChange('');
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  id="open-search-btn"
                  onClick={() => setIsSearchOpen(true)}
                  title={getTranslation(settings.language, 'searchPlaceholder')}
                  className={`p-2 rounded-2xl transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
                >
                  <Search className="w-4 h-4 text-sky-500" />
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Manual Refresh Button */}
          <button
            id="manual-refresh-btn"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            title={getTranslation(settings.language, 'refreshNow')}
            className={`p-2 rounded-2xl transition-all relative shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : 'text-emerald-500'}`} />
          </button>

          {/* Notifications Center */}
          <button
            id="notifications-toggle-btn"
            onClick={onOpenNotifications}
            title={getTranslation(settings.language, 'notifications')}
            className={`p-2 rounded-2xl transition-all relative shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            {unreadNotificationsCount > 0 && (
              <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse`}>
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Device Shell View Toggle */}
          <button
            id="toggle-view-mode-btn"
            onClick={() => onUpdateSettings({
              viewMode: settings.viewMode === 'mobile-frame' ? 'responsive-fluid' : 'mobile-frame'
            })}
            title={settings.viewMode === 'mobile-frame' ? getTranslation(settings.language, 'fluidView') : getTranslation(settings.language, 'mobileView')}
            className={`hidden sm:flex p-2 rounded-2xl transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            {settings.viewMode === 'mobile-frame' ? (
              <Monitor className="w-4 h-4 text-indigo-400" />
            ) : (
              <Smartphone className={`w-4 h-4 ${theme.primaryText}`} />
            )}
          </button>

          {/* Quick Audio Alert Chime Toggle */}
          <button
            id="quick-audio-chime-btn"
            onClick={() => {
              if (!settings.audioChimeEnabled) {
                onUpdateSettings({ audioChimeEnabled: true });
              }
              onTestChime?.();
            }}
            title={settings.audioChimeEnabled ? getTranslation(settings.language, 'audioChimeActive') : getTranslation(settings.language, 'audioChimeMuted')}
            className={`p-2 rounded-2xl transition-all shadow-xs ${
              settings.audioChimeEnabled 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                : `${bgClasses.elevated} text-slate-400 opacity-60`
            }`}
          >
            {settings.audioChimeEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Quick Light / Dark Blue Theme Switcher */}
          <button
            id="quick-theme-toggle-btn"
            onClick={() => {
              const nextMode: DarkMode = settings.darkMode === 'light' ? 'dark' : 'light';
              onUpdateSettings({ darkMode: nextMode });
            }}
            title={getTranslation(settings.language, 'toggleLightDark')}
            className={`p-2 rounded-2xl transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            {settings.darkMode === 'light' ? (
              <Moon className="w-4 h-4 text-blue-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Quick Settings */}
          <button
            id="open-settings-header-btn"
            onClick={onOpenSettings}
            title={getTranslation(settings.language, 'settings')}
            className={`p-2 rounded-2xl transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
