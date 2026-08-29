import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Settings, 
  Bell, 
  RefreshCw, 
  Sun, 
  Moon, 
  BookOpen, 
  LayoutGrid, 
  Search, 
  X,
  Radio,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { AppSettings, AppViewMode, NewsSource } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface AndroidHeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRefresh?: () => void;
  onManualRefresh?: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenWebsitesDrawer: () => void;
  unreadNotificationsCount: number;
  activeSourcesCount?: number;
  totalSourcesCount?: number;
  totalArticlesCount?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isScrolled?: boolean;
  autoRefreshCountdown?: number;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  settings,
  onUpdateSettings,
  onRefresh,
  onManualRefresh,
  isRefreshing,
  onOpenSettings,
  onOpenNotifications,
  onOpenWebsitesDrawer,
  unreadNotificationsCount,
  activeSourcesCount = 0,
  totalSourcesCount = 0,
  searchQuery,
  onSearchChange,
  isScrolled: externalIsScrolled,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [internalScrolled, setInternalScrolled] = useState(false);

  const isScrolled = externalIsScrolled !== undefined ? externalIsScrolled : internalScrolled;
  const handleRefresh = onRefresh || onManualRefresh || (() => {});

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  // Scroll listener for dynamic glassmorphism
  useEffect(() => {
    const onScroll = () => {
      setInternalScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Time simulation for Android status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = settings.darkMode === 'light' ? 'dark' : 'light';
    onUpdateSettings({ darkMode: nextMode });
  };

  const isReading = settings.appViewMode === 'reading';

  return (
    <header
      id="android-header-sticky"
      className={`AndroidHeader sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-slate-950/40 border-b border-slate-200/60 dark:border-slate-800 py-1.5'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-2.5 border-b border-slate-200/40 dark:border-slate-800'
      }`}
    >
      {/* Top Simulated Android Status Bar (Minimalist) */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 select-none pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 font-mono">
          <span>{currentTime || '12:00'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Websites Badge */}
          <button
            type="button"
            onClick={onOpenWebsitesDrawer}
            title={getTranslation(settings.language, 'websitesDrawerTitle')}
            className="flex items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full hover:bg-sky-100 transition-colors"
          >
            <Globe2 className="w-3 h-3" />
            <span>{activeSourcesCount}/{totalSourcesCount} {getTranslation(settings.language, 'sources')}</span>
          </button>

          {/* Quick Light/Dark Toggle */}
          <button
            type="button"
            id="quick-theme-toggle-btn"
            onClick={toggleDarkMode}
            title={getTranslation(settings.language, 'toggleLightDark')}
            className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.darkMode === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Header Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2.5 pt-1.5">
        {/* Brand & App Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-600/20 ${theme.primary}`}>
            <span className="font-extrabold text-base tracking-tighter">TR</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base sm:text-lg tracking-tight leading-none text-slate-900 dark:text-white">
                {getTranslation(settings.language, 'appName')}
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400 leading-tight hidden sm:block">
              {getTranslation(settings.language, 'appSubtitle')}
            </p>
          </div>
        </div>

        {/* Center: Quick Reading / Browsing Toggle Pill */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-inner select-none border border-slate-200/60 dark:border-slate-700/60">
            {/* Browsing Button */}
            <button
              type="button"
              id="mode-browsing-toggle-btn"
              onClick={() => onUpdateSettings({ appViewMode: 'browsing' })}
              title={getTranslation(settings.language, 'browsingModeDesc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                !isReading
                  ? `${theme.primary} text-white shadow-md shadow-blue-600/30 scale-100`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{getTranslation(settings.language, 'browsingMode')}</span>
            </button>

            {/* Reading Button */}
            <button
              type="button"
              id="mode-reading-toggle-btn"
              onClick={() => onUpdateSettings({ appViewMode: 'reading' })}
              title={getTranslation(settings.language, 'readingModeDesc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                isReading
                  ? `${theme.primary} text-white shadow-md shadow-blue-600/30 scale-100`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{getTranslation(settings.language, 'readingMode')}</span>
            </button>
          </div>
        </div>

        {/* Right Action Icons: Search, Dedicated Websites Drawer Icon, Refresh, Notifications, Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            id="header-search-toggle-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-2xl transition-all ${
              isSearchOpen 
                ? 'bg-blue-600 text-white' 
                : `${bgClasses.card} ${bgClasses.hover} text-slate-700 dark:text-slate-200`
            }`}
            title="بحث"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          {/* DEDICATED WEBSITES ICON */}
          <button
            type="button"
            id="header-websites-drawer-btn"
            onClick={onOpenWebsitesDrawer}
            title={getTranslation(settings.language, 'manageSources')}
            className={`p-2 rounded-2xl transition-all relative ${bgClasses.card} ${bgClasses.hover} text-sky-600 dark:text-sky-400 group`}
          >
            <Globe2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-[15px] bg-sky-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
              {activeSourcesCount}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            id="header-refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title={getTranslation(settings.language, 'refreshNow')}
            className={`p-2 rounded-2xl transition-all ${bgClasses.card} ${bgClasses.hover} text-slate-700 dark:text-slate-200 disabled:opacity-50`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            id="header-notifications-btn"
            onClick={onOpenNotifications}
            title={getTranslation(settings.language, 'notifications')}
            className={`p-2 rounded-2xl transition-all relative ${bgClasses.card} ${bgClasses.hover} text-slate-700 dark:text-slate-200`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-[15px] bg-rose-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-xs animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            id="header-settings-btn"
            onClick={onOpenSettings}
            title={getTranslation(settings.language, 'settings')}
            className={`p-2 rounded-2xl transition-all ${bgClasses.card} ${bgClasses.hover} text-slate-700 dark:text-slate-200`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Fast Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden max-w-7xl mx-auto px-4 pt-2.5 pb-1"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute right-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                id="header-search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={getTranslation(settings.language, 'searchPlaceholder')}
                autoFocus
                className={`w-full pr-10 pl-10 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 ${theme.ring} shadow-inner bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/50 dark:border-slate-700/50`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
