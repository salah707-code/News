import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  NewsArticle, 
  NewsSource, 
  AppSettings, 
  NotificationItem, 
  ReadingSpeed 
} from './types';
import { 
  DEFAULT_SOURCES, 
  INITIAL_ARTICLES 
} from './data/defaultNews';
import { AndroidHeader } from './components/AndroidHeader';
import { CategoryNav } from './components/CategoryNav';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { FavoritesView } from './components/FavoritesView';
import { WebsitesDrawer } from './components/WebsitesDrawer';
import { SourceManagerModal } from './components/SourceManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { BottomNavBar, MainTab } from './components/BottomNavBar';
import { THEME_CONFIG, getBackgroundClasses } from './utils/themeColors';
import { getTranslation } from './utils/translations';
import { 
  Flame, 
  AlertCircle,
  Globe2,
  LayoutGrid,
  Grid2X2,
  List,
  Rows,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  SETTINGS: 'nabdh_news_settings_v3',
  ARTICLES: 'nabdh_news_articles_v3',
  SOURCES: 'nabdh_news_sources_v3',
  BOOKMARKS: 'nabdh_news_bookmarks_v3',
  NOTIFICATIONS: 'nabdh_news_notifs_v3',
};

const DEFAULT_SETTINGS: AppSettings = {
  themeColor: 'blue',
  darkMode: 'dark',
  fontSize: 'base',
  readingSpeed: 'normal',
  language: 'ar',
  autoRefreshInterval: 60,
  notificationsEnabled: true,
  audioChimeEnabled: true,
  viewMode: 'responsive-fluid',
  appViewMode: 'browsing',
  breakingNewsOnly: false,
};

export function App() {
  // App Settings state with local storage fallback
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // Sources State
  const [sources, setSources] = useState<NewsSource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOURCES);
      return saved ? JSON.parse(saved) : DEFAULT_SOURCES;
    } catch (e) {
      return DEFAULT_SOURCES;
    }
  });

  // Articles State
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch (e) {
      return INITIAL_ARTICLES;
    }
  });

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : ['news-1', 'news-3'];
    } catch (e) {
      return ['news-1', 'news-3'];
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'notif-1',
          title: 'عاجل: الجزيرة نت',
          body: 'قمة دولية كبرى تناقش تطورات الطاقة المتجددة.',
          time: 'منذ 10 دقائق',
          read: false,
          articleId: 'news-1',
          isBreaking: true
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // UI Navigation & Dialog States
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSourceManagerOpen, setIsSourceManagerOpen] = useState(false);
  const [isWebsitesDrawerOpen, setIsWebsitesDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(settings.autoRefreshInterval || 60);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isNavigatingBackRef = useRef(false);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Sync to local storage & update body colors (Midnight Navy & Light Mode)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    if (settings.darkMode === 'oled') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#060b18] text-blue-50 selection:bg-blue-600 selection:text-white';
    } else if (settings.darkMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#0a1128] text-slate-100 selection:bg-blue-600 selection:text-white';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-100/80 text-slate-900 selection:bg-blue-600 selection:text-white';
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Back Navigation Handler (عند العودة للخلف يعود للتطبيق و ليس لمغادرته)
  useEffect(() => {
    // Push an initial state if history is empty
    window.history.replaceState({ page: 'root' }, '');

    const handlePopState = (event: PopStateEvent) => {
      isNavigatingBackRef.current = true;

      // Hierarchy of back navigation:
      if (selectedArticle) {
        setSelectedArticle(null);
        return;
      }
      if (isWebsitesDrawerOpen) {
        setIsWebsitesDrawerOpen(false);
        return;
      }
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }
      if (isNotificationsOpen) {
        setIsNotificationsOpen(false);
        return;
      }
      if (isSourceManagerOpen) {
        setIsSourceManagerOpen(false);
        return;
      }
      if (searchQuery) {
        setSearchQuery('');
        return;
      }
      if (selectedSourceId !== null) {
        setSelectedSourceId(null);
        return;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return;
      }

      // If at root and user clicks back, re-push so they don't exit accidentally
      window.history.pushState({ page: 'root' }, '');
      triggerToast('اضغط مرة أخرى للخروج أو تصفح المزيد');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    selectedArticle,
    isWebsitesDrawerOpen,
    isSettingsOpen,
    isNotificationsOpen,
    isSourceManagerOpen,
    searchQuery,
    selectedSourceId,
    activeTab,
    triggerToast
  ]);

  // Push state when opening modals or drilling down
  const openModalWithHistory = useCallback((openFn: () => void) => {
    window.history.pushState({ page: 'modal' }, '');
    openFn();
  }, []);

  // Fetch Live RSS Feeds
  const fetchLiveFeeds = useCallback(async () => {
    setIsRefreshing(true);
    const activeRssSources = sources.filter(s => s.enabled && s.rssUrl);
    
    if (activeRssSources.length === 0) {
      setTimeout(() => {
        setIsRefreshing(false);
        setAutoRefreshCountdown(settings.autoRefreshInterval || 60);
      }, 600);
      return;
    }

    try {
      const fetchPromises = activeRssSources.slice(0, 4).map(async (src) => {
        try {
          const res = await fetch('/api/rss', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: src.rssUrl })
          });
          if (!res.ok) return [];
          const data = await res.json();
          return (data.items || []).map((item: any) => ({
            id: item.id || `rss-${Math.random()}`,
            title: item.title,
            summary: item.summary,
            fullContent: item.fullContent,
            author: item.author || src.name,
            source: src.name,
            sourceId: src.id,
            category: src.category === 'all' ? 'world' : src.category,
            pubDate: item.pubDate,
            imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
            link: item.link,
            isBreaking: Math.random() > 0.7,
            readTimeMinutes: Math.floor(Math.random() * 3) + 2,
            viewsCount: Math.floor(Math.random() * 800) + 100,
            isForeign: src.isForeign
          } as NewsArticle));
        } catch (e) {
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      const newArticles = results.flat();

      if (newArticles.length > 0) {
        setArticles((prev) => {
          const existingIds = new Set(prev.map(a => a.id));
          const uniqueNew = newArticles.filter(a => !existingIds.has(a.id));
          return [...uniqueNew.slice(0, 10), ...prev].slice(0, 60);
        });
      }
    } catch (err) {
      console.error('Error fetching live feeds:', err);
    } finally {
      setIsRefreshing(false);
      setAutoRefreshCountdown(settings.autoRefreshInterval || 60);
    }
  }, [sources, settings.autoRefreshInterval]);

  // Auto-refresh timer
  useEffect(() => {
    if (settings.autoRefreshInterval <= 0) return;
    setAutoRefreshCountdown(settings.autoRefreshInterval);

    const countdownInterval = setInterval(() => {
      setAutoRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveFeeds();
          return settings.autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [settings.autoRefreshInterval, fetchLiveFeeds]);

  // Bookmark toggling
  const handleToggleBookmark = (article: NewsArticle) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(article.id);
      if (exists) {
        return prev.filter(id => id !== article.id);
      } else {
        try {
          confetti({
            particleCount: 25,
            spread: 45,
            origin: { y: 0.8 }
          });
        } catch (e) {}
        return [...prev, article.id];
      }
    });
  };

  // Delete Article Handler (Swipe to Delete or Click)
  const handleDeleteArticle = useCallback((articleToDelete: NewsArticle) => {
    setArticles((prev) => prev.filter(a => a.id !== articleToDelete.id));
    setBookmarkedIds((prev) => prev.filter(id => id !== articleToDelete.id));
    triggerToast(getTranslation(settings.language, 'articleDeletedSuccess'));
  }, [settings.language, triggerToast]);

  // Source Managers
  const handleAddSource = (newSourceData: Omit<NewsSource, 'id'>, newSourceArticles?: any[]) => {
    const newId = `source-${Date.now()}`;
    const fullSource: NewsSource = {
      ...newSourceData,
      id: newId
    };
    setSources((prev) => [fullSource, ...prev]);

    if (newSourceArticles && newSourceArticles.length > 0) {
      const formatted = newSourceArticles.map((item, idx) => ({
        id: item.id || `custom-${newId}-${idx}`,
        title: item.title,
        summary: item.summary,
        fullContent: item.fullContent,
        author: item.author || fullSource.name,
        source: fullSource.name,
        sourceId: newId,
        category: fullSource.category === 'all' ? 'world' : fullSource.category,
        pubDate: item.pubDate || new Date().toISOString(),
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
        link: item.link || fullSource.url,
        isBreaking: idx === 0,
        readTimeMinutes: 3,
      } as NewsArticle));
      setArticles((prev) => [...formatted, ...prev]);
    }
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources((prev) => prev.filter(s => s.id !== sourceId));
    setArticles((prev) => prev.filter(a => a.sourceId !== sourceId));
  };

  const handleToggleSource = (sourceId: string) => {
    setSources((prev) => prev.map(s => s.id === sourceId ? { ...s, enabled: !s.enabled } : s));
  };

  const handleRestoreDefaults = () => {
    setSources(DEFAULT_SOURCES);
    setArticles(INITIAL_ARTICLES);
  };

  // Source counts computation (Live count of articles per website)
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sources.forEach(src => {
      const matchCount = articles.filter(a => 
        a.sourceId === src.id || 
        a.source.toLowerCase() === src.name.toLowerCase()
      ).length;
      counts[src.id] = matchCount;
      counts[src.name] = matchCount;
    });
    return counts;
  }, [articles, sources]);

  // Filtered Articles based on Website Source Selection
  const displayArticles = useMemo(() => {
    return articles.filter((art) => {
      // Source filter
      if (selectedSourceId) {
        const matchedSource = sources.find(s => s.id === selectedSourceId);
        const matches = art.sourceId === selectedSourceId || (matchedSource && art.source.toLowerCase() === matchedSource.name.toLowerCase());
        if (!matches) return false;
      }

      // Tab filter
      if (activeTab === 'breaking') {
        if (!art.isBreaking) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.source.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [articles, selectedSourceId, searchQuery, activeTab, sources]);

  // Breaking Articles list
  const breakingArticles = useMemo(() => {
    return articles.filter(a => a.isBreaking);
  }, [articles]);

  // Bookmarked Articles objects
  const bookmarkedArticles = useMemo(() => {
    return articles.filter(a => bookmarkedIds.includes(a.id));
  }, [articles, bookmarkedIds]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const selectedSourceName = useMemo(() => {
    if (!selectedSourceId) return null;
    return sources.find(s => s.id === selectedSourceId)?.name || selectedSourceId;
  }, [selectedSourceId, sources]);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${bgClasses.bg}`}>
      <div className="w-full flex-1 flex flex-col items-center justify-start">
        
        <div className="w-full flex flex-col flex-1 max-w-full">
          {/* Top Android Sticky Glassmorphic Header */}
          <AndroidHeader
            settings={settings}
            onUpdateSettings={(newS) => setSettings(s => ({ ...s, ...newS }))}
            onOpenSettings={() => openModalWithHistory(() => setIsSettingsOpen(true))}
            onOpenNotifications={() => openModalWithHistory(() => setIsNotificationsOpen(true))}
            onOpenWebsitesDrawer={() => openModalWithHistory(() => setIsWebsitesDrawerOpen(true))}
            unreadNotificationsCount={unreadNotificationsCount}
            onManualRefresh={fetchLiveFeeds}
            isRefreshing={isRefreshing}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            autoRefreshCountdown={autoRefreshCountdown}
            totalArticlesCount={articles.length}
            totalSourcesCount={sources.length}
          />

          {/* Main Body Content based on Active Tab */}
          <main className="flex-1 flex flex-col pb-24">
            {activeTab === 'favorites' ? (
              <FavoritesView
                bookmarkedArticles={bookmarkedArticles}
                onRemoveBookmark={handleToggleBookmark}
                onClearAllBookmarks={() => setBookmarkedIds([])}
                onOpenArticle={(art) => openModalWithHistory(() => setSelectedArticle(art))}
                onDeleteArticle={handleDeleteArticle}
                onBackToHome={() => setActiveTab('home')}
                settings={settings}
              />
            ) : (
              <>
                {/* Source-based Classification Navigation (التصنيف حسب الموقع) */}
                <CategoryNav
                  sources={sources}
                  selectedSourceId={selectedSourceId}
                  onSelectSource={setSelectedSourceId}
                  sourceCounts={sourceCounts}
                  settings={settings}
                />

                {/* Articles Feed */}
                <div className="max-w-7xl w-full mx-auto px-4 py-4 flex-1 space-y-4">
                  
                  {/* Category Header, Active Website Filter Chip, & Layout Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                    <div className="flex items-center justify-between sm:justify-start gap-2.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                          {activeTab === 'breaking' 
                            ? getTranslation(settings.language, 'breakingNews')
                            : selectedSourceId
                            ? selectedSourceName
                            : getTranslation(settings.language, 'allSources')}
                        </h2>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-xs ${theme.badge}`}>
                          {displayArticles.length} {getTranslation(settings.language, 'newsCount', { n: '' })}
                        </span>
                      </div>

                      {/* Active Website Filter Tag with Clear Button */}
                      {selectedSourceId && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md animate-fade-in">
                          <Globe2 className="w-3.5 h-3.5" />
                          <span>{selectedSourceName}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedSourceId(null)}
                            className="p-0.5 rounded-full hover:bg-white/20 ml-1 transition-colors"
                            title="إلغاء الفلترة"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
                      {searchQuery && (
                        <span className="text-xs text-sky-400 font-medium">
                          نتائج البحث عن "{searchQuery}"
                        </span>
                      )}

                      {/* Interactive Display Format Switcher */}
                      <div className={`flex items-center p-1 rounded-2xl ${bgClasses.card} shadow-md gap-0.5`} role="group" aria-label="تنسيق العرض">
                        {[
                          { id: 'normal', label: getTranslation(settings.language, 'readingSpeedNormal'), shortLabel: 'بطاقات', icon: LayoutGrid, color: 'text-indigo-500' },
                          { id: 'grid', label: getTranslation(settings.language, 'readingSpeedGrid'), shortLabel: 'مربعات', icon: Grid2X2, color: 'text-sky-500' },
                          { id: 'fast', label: getTranslation(settings.language, 'readingSpeedFast'), shortLabel: 'أشرطة', icon: Rows, color: 'text-emerald-500' },
                          { id: 'compact', label: getTranslation(settings.language, 'readingSpeedCompact'), shortLabel: 'قائمة', icon: List, color: 'text-amber-500' },
                          { id: 'magazine', label: getTranslation(settings.language, 'readingSpeedMagazine'), shortLabel: 'مجلة', icon: Flame, color: 'text-rose-500' },
                        ].map((layout) => {
                          const isActive = settings.readingSpeed === layout.id;
                          const LayoutIcon = layout.icon;
                          return (
                            <button
                              key={layout.id}
                              id={`layout-switcher-${layout.id}`}
                              onClick={() => setSettings(prev => ({ ...prev, readingSpeed: layout.id as ReadingSpeed }))}
                              title={layout.label}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                                isActive 
                                  ? `${theme.primary} text-white shadow-md` 
                                  : `${bgClasses.hover} ${layout.color}`
                              }`}
                            >
                              <LayoutIcon className="w-3.5 h-3.5" />
                              <span className="hidden md:inline text-[11px]">{layout.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Open Right Websites Drawer Button */}
                      <button
                        type="button"
                        id="open-source-manager-btn"
                        onClick={() => openModalWithHistory(() => setIsWebsitesDrawerOpen(true))}
                        className={`text-xs font-bold px-3.5 py-2 rounded-2xl flex items-center gap-2 transition-all shadow-md ${bgClasses.card} ${bgClasses.hover}`}
                      >
                        <Globe2 className="w-4 h-4 text-sky-400" />
                        <span>قائمة المواقع</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${theme.badge}`}>
                          {sources.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Empty state */}
                  {displayArticles.length === 0 ? (
                    <div className={`p-12 text-center rounded-3xl ${bgClasses.card} space-y-4 shadow-xl`}>
                      <AlertCircle className="w-12 h-12 mx-auto text-amber-400 opacity-80" />
                      <h3 className="font-bold text-base sm:text-lg">
                        {getTranslation(settings.language, 'searchNoResults')}
                      </h3>
                      <p className={`text-xs ${bgClasses.muted} max-w-sm mx-auto`}>
                        جرب مسح كلمات البحث، أو إلغاء فلترة الموقع لتصفح كافة الأخبار.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSourceId(null);
                          setSearchQuery('');
                        }}
                        className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-lg ${theme.primary}`}
                      >
                        عرض جميع الأخبار
                      </button>
                    </div>
                  ) : (
                    /* Dynamic Layout with Swipeable Borderless Cards */
                    <div className={
                      settings.readingSpeed === 'compact'
                        ? 'space-y-2.5'
                        : settings.readingSpeed === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
                        : settings.readingSpeed === 'fast'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5'
                        : settings.readingSpeed === 'magazine'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                    }>
                      <AnimatePresence mode="popLayout">
                        {displayArticles.map((article) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            isBookmarked={bookmarkedIds.includes(article.id)}
                            onToggleBookmark={handleToggleBookmark}
                            onOpenArticle={(art) => openModalWithHistory(() => setSelectedArticle(art))}
                            onDeleteArticle={handleDeleteArticle}
                            settings={settings}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Status Footer */}
            <footer className={`mt-8 pt-4 pb-6 flex flex-wrap items-center justify-between text-[11px] gap-4 px-4 select-none ${settings.darkMode === 'light' ? 'text-slate-500' : 'text-blue-300/60'}`}>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-500">تحديث حي ومستمر</span>
                </span>
                <span>•</span>
                <span>المظهر: {settings.darkMode === 'light' ? 'الوضع الفاتح' : settings.darkMode === 'oled' ? 'الوضع الأزرق الليلي العميق' : 'الوضع الأزرق الداكن'}</span>
                <span>•</span>
                <span>{displayArticles.length} خبر محدث</span>
              </div>
              <div className="flex items-center gap-3">
                <span>The Reporter News © 2025</span>
              </div>
            </footer>
          </main>

          {/* Android Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'sources') {
                openModalWithHistory(() => setIsWebsitesDrawerOpen(true));
              } else if (tab === 'settings') {
                openModalWithHistory(() => setIsSettingsOpen(true));
              } else {
                setActiveTab(tab);
              }
            }}
            favoritesCount={bookmarkedIds.length}
            breakingCount={breakingArticles.length}
            settings={settings}
          />
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onDeleteArticle={handleDeleteArticle}
            settings={settings}
          />
        )}
      </AnimatePresence>

      {/* Websites Right Sliding Drawer */}
      <WebsitesDrawer
        isOpen={isWebsitesDrawerOpen}
        onClose={() => setIsWebsitesDrawerOpen(false)}
        sources={sources}
        sourceCounts={sourceCounts}
        selectedSourceId={selectedSourceId}
        onSelectSource={(sourceId) => {
          setSelectedSourceId(sourceId);
          setActiveTab('home');
        }}
        onToggleSource={handleToggleSource}
        onOpenSourceManager={() => {
          setIsWebsitesDrawerOpen(false);
          openModalWithHistory(() => setIsSourceManagerOpen(true));
        }}
        settings={settings}
      />

      {/* News Sources Manager Modal */}
      <AnimatePresence>
        {isSourceManagerOpen && (
          <SourceManagerModal
            sources={sources}
            categories={[]}
            onAddSource={handleAddSource}
            onDeleteSource={handleDeleteSource}
            onToggleSource={handleToggleSource}
            onRestoreDefaults={handleRestoreDefaults}
            onClose={() => setIsSourceManagerOpen(false)}
            settings={settings}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={(newS) => setSettings(s => ({ ...s, ...newS }))}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Alert Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#0a1128]/95 text-white text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Drawer */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationsDrawer
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            onClearAll={() => {
              setNotifications([]);
              triggerToast('تم مسح جميع التنبيهات');
            }}
            onDeleteNotification={(id) => {
              setNotifications(prev => prev.filter(n => n.id !== id));
              triggerToast('تم حذف التنبيه بنجاح');
            }}
            onSelectNotification={(notif) => {
              if (notif.articleId) {
                const found = articles.find(a => a.id === notif.articleId);
                if (found) {
                  setSelectedArticle(found);
                  setIsNotificationsOpen(false);
                }
              }
            }}
            settings={settings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
