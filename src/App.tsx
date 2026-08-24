import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  NewsArticle, 
  NewsSource, 
  AppSettings, 
  NotificationItem, 
  ThemeColor, 
  DarkMode, 
  FontSize, 
  ReadingSpeed, 
  Language 
} from './types';
import { 
  DEFAULT_CATEGORIES, 
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
import { AudioNewsPlayer } from './components/AudioNewsPlayer';
import { THEME_CONFIG, getBackgroundClasses } from './utils/themeColors';
import { getTranslation } from './utils/translations';
import { 
  Sparkles, 
  Flame, 
  RefreshCw, 
  Filter, 
  Layers, 
  TrendingUp, 
  AlertCircle,
  Globe2,
  Smartphone,
  Monitor,
  LayoutGrid,
  Grid2X2,
  List,
  Rows,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  SETTINGS: 'nabdh_news_settings_v2',
  ARTICLES: 'nabdh_news_articles_v2',
  SOURCES: 'nabdh_news_sources_v2',
  BOOKMARKS: 'nabdh_news_bookmarks_v2',
  NOTIFICATIONS: 'nabdh_news_notifs_v2',
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSourceManagerOpen, setIsSourceManagerOpen] = useState(false);
  const [isWebsitesDrawerOpen, setIsWebsitesDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(settings.autoRefreshInterval || 60);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<{ title: string; text: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Sync to local storage & update body colors (Rich Blue Dark Mode)
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
      document.body.className = 'bg-slate-100/70 text-slate-900 selection:bg-blue-600 selection:text-white';
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

  // Audio Alert Chime
  const playNotificationChime = useCallback((forcePlay = false) => {
    if (!settings.audioChimeEnabled && !forcePlay) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const playBellTone = (freq: number, start: number, duration: number, vol = 0.14) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      // Multi-tone crystal alert chime
      playBellTone(523.25, now, 0.35, 0.12);        // C5
      playBellTone(659.25, now + 0.08, 0.35, 0.12); // E5
      playBellTone(783.99, now + 0.16, 0.45, 0.14); // G5
      playBellTone(1046.5, now + 0.24, 0.6, 0.16);  // C6

      triggerToast('🔔 تم إطلاق التنبيه الصوتي بنجاح');
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }, [settings.audioChimeEnabled, triggerToast]);

  // Fetch Live RSS Feeds
  const fetchLiveFeeds = useCallback(async () => {
    setIsRefreshing(true);
    const activeRssSources = sources.filter(s => s.enabled && s.rssUrl);
    
    if (activeRssSources.length === 0) {
      setTimeout(() => {
        setIsRefreshing(false);
        setAutoRefreshCountdown(settings.autoRefreshInterval || 60);
      }, 700);
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
            viewsCount: Math.floor(Math.random() * 800) + 100
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
          if (uniqueNew.length > 0 && settings.notificationsEnabled) {
            const breakingStory = uniqueNew.find(a => a.isBreaking) || uniqueNew[0];
            const newNotif: NotificationItem = {
              id: `notif-${Date.now()}`,
              title: `خبر عاجل: ${breakingStory.source}`,
              body: breakingStory.title,
              time: 'الآن',
              read: false,
              articleId: breakingStory.id,
              isBreaking: true
            };
            setNotifications(n => [newNotif, ...n]);
            playNotificationChime();
          }
          return [...uniqueNew.slice(0, 10), ...prev].slice(0, 60);
        });
      }
    } catch (err) {
      console.error('Error fetching live feeds:', err);
    } finally {
      setIsRefreshing(false);
      setAutoRefreshCountdown(settings.autoRefreshInterval || 60);
    }
  }, [sources, settings.autoRefreshInterval, settings.notificationsEnabled, playNotificationChime]);

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
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 }
          });
        } catch (e) {}
        return [...prev, article.id];
      }
    });
  };

  // Delete Article Handler (Direct click & Swipe to Delete)
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

  // Category counts computation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    DEFAULT_CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = articles.filter(a => a.category === cat.id).length;
      }
    });
    return counts;
  }, [articles]);

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

  // Filtered Articles for Home / Breaking view (with website source filter support)
  const displayArticles = useMemo(() => {
    return articles.filter((art) => {
      // Source filter if user picked a specific website from right drawer
      if (selectedSourceId) {
        const matchedSource = sources.find(s => s.id === selectedSourceId);
        const matches = art.sourceId === selectedSourceId || (matchedSource && art.source.toLowerCase() === matchedSource.name.toLowerCase());
        if (!matches) return false;
      }

      // Category filter
      if (activeTab === 'breaking') {
        if (!art.isBreaking) return false;
      } else if (selectedCategory !== 'all' && art.category !== selectedCategory) {
        return false;
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
  }, [articles, selectedCategory, selectedSourceId, searchQuery, activeTab, sources]);

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
      {/* Device Shell Wrap if mobile-frame mode enabled */}
      <div className={`w-full flex-1 flex flex-col items-center justify-start ${settings.viewMode === 'mobile-frame' ? 'py-4 sm:py-8 px-2 sm:px-4' : ''}`}>
        
        <div className={`w-full flex flex-col flex-1 ${
          settings.viewMode === 'mobile-frame' 
            ? `max-w-[430px] rounded-[48px] ${settings.darkMode === 'light' ? 'bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]' : 'bg-[#0a1128] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'} overflow-hidden relative min-h-[850px]` 
            : 'max-w-full'
        }`}>

          {/* Android Notch / Punch hole if in mobile frame mode */}
          {settings.viewMode === 'mobile-frame' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-950" />
            </div>
          )}

          {/* Top Android App Header */}
          <AndroidHeader
            settings={settings}
            onUpdateSettings={(newS) => setSettings(s => ({ ...s, ...newS }))}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenWebsitesDrawer={() => setIsWebsitesDrawerOpen(true)}
            unreadNotificationsCount={unreadNotificationsCount}
            onManualRefresh={fetchLiveFeeds}
            isRefreshing={isRefreshing}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            autoRefreshCountdown={autoRefreshCountdown}
            totalArticlesCount={articles.length}
            totalSourcesCount={sources.length}
            onTestChime={() => playNotificationChime(true)}
          />

          {/* Main Body Content based on Active Tab */}
          <main className="flex-1 flex flex-col pb-24">
            {activeTab === 'favorites' ? (
              <FavoritesView
                bookmarkedArticles={bookmarkedArticles}
                onRemoveBookmark={handleToggleBookmark}
                onClearAllBookmarks={() => setBookmarkedIds([])}
                onOpenArticle={setSelectedArticle}
                onDeleteArticle={handleDeleteArticle}
                onBackToHome={() => setActiveTab('home')}
                settings={settings}
              />
            ) : (
              <>
                {/* Category Pills Bar with News Counters */}
                <CategoryNav
                  categories={DEFAULT_CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categoryCounts={categoryCounts}
                  settings={settings}
                />

                {/* Articles Feed */}
                <div className="max-w-7xl w-full mx-auto px-4 py-5 flex-1 space-y-5">
                  
                  {/* Category Header, Active Website Filter Chip, & Layout Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                    <div className="flex items-center justify-between sm:justify-start gap-2.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                          {activeTab === 'breaking' 
                            ? getTranslation(settings.language, 'breakingNews')
                            : selectedCategory === 'all'
                            ? getTranslation(settings.language, 'allCategories')
                            : DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.nameAr || selectedCategory}
                        </h2>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-xs ${theme.badge}`}>
                          {displayArticles.length} {getTranslation(settings.language, 'newsCount', { n: '' })}
                        </span>
                      </div>

                      {/* Active Website Filter Tag with Clear Button */}
                      {selectedSourceId && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md animate-fade-in">
                          <Globe2 className="w-3.5 h-3.5" />
                          <span>الموقع: {selectedSourceName}</span>
                          <button
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

                      {/* Interactive Display Format Switcher (بطاقات، مربعات، أشرطة، قائمة، مجلة) */}
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
                        id="open-source-manager-btn"
                        onClick={() => setIsWebsitesDrawerOpen(true)}
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
                        جرب تغيير التصنيف، مسح كلمات البحث، أو إلغاء فلترة الموقع لتصفح الأخبار.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedSourceId(null);
                          setSearchQuery('');
                        }}
                        className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-lg ${theme.primary}`}
                      >
                        عرض جميع الأخبار
                      </button>
                    </div>
                  ) : (
                    /* Dynamic Layout with Swipeable Cards */
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
                            onOpenArticle={setSelectedArticle}
                            onPlayAudio={(text, title) => setCurrentAudioTrack({ title, text })}
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
                setIsWebsitesDrawerOpen(true);
              } else if (tab === 'settings') {
                setIsSettingsOpen(true);
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

      {/* Floating Audio News Player */}
      <AudioNewsPlayer
        currentTrack={currentAudioTrack}
        onClose={() => setCurrentAudioTrack(null)}
        settings={settings}
      />

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
            onUpdateSettings={(newS) => setSettings(s => ({ ...s, ...newS }))}
          />
        )}
      </AnimatePresence>

      {/* Websites Right Sliding Drawer (شريط سحب من اليمين فيه قائمة بالمواقع و عدد الأخبار فيها) */}
      <WebsitesDrawer
        isOpen={isWebsitesDrawerOpen}
        onClose={() => setIsWebsitesDrawerOpen(false)}
        sources={sources}
        categories={DEFAULT_CATEGORIES}
        sourceCounts={sourceCounts}
        selectedSourceId={selectedSourceId}
        onSelectSource={(sourceId) => {
          setSelectedSourceId(sourceId);
          setActiveTab('home');
        }}
        onToggleSource={handleToggleSource}
        onOpenSourceManager={() => {
          setIsWebsitesDrawerOpen(false);
          setIsSourceManagerOpen(true);
        }}
        settings={settings}
      />

      {/* News Sources Manager Modal */}
      <AnimatePresence>
        {isSourceManagerOpen && (
          <SourceManagerModal
            sources={sources}
            categories={DEFAULT_CATEGORIES}
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
            onTestChime={() => playNotificationChime(true)}
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
