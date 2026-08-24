import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Search, 
  Home
} from 'lucide-react';
import { NewsArticle, AppSettings } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { ArticleCard } from './ArticleCard';
import { AnimatePresence } from 'motion/react';

interface FavoritesViewProps {
  bookmarkedArticles: NewsArticle[];
  onRemoveBookmark: (article: NewsArticle) => void;
  onClearAllBookmarks: () => void;
  onOpenArticle: (article: NewsArticle) => void;
  onDeleteArticle?: (article: NewsArticle) => void;
  onBackToHome: () => void;
  settings: AppSettings;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  bookmarkedArticles,
  onRemoveBookmark,
  onClearAllBookmarks,
  onOpenArticle,
  onDeleteArticle,
  onBackToHome,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const filteredArticles = bookmarkedArticles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Home Navigation Button */}
          <button
            id="back-from-favorites-btn"
            onClick={onBackToHome}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition-all shadow-md ${bgClasses.card} ${bgClasses.hover} group`}
            title="العودة للرئيسية"
          >
            <Home className="w-4 h-4 text-indigo-500 transition-transform group-hover:scale-110" />
            <span className="text-xs font-extrabold tracking-tight">الرئيسية</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span>{getTranslation(settings.language, 'savedArticles')}</span>
            </h1>
            <p className={`text-xs ${bgClasses.muted}`}>
              {bookmarkedArticles.length} {getTranslation(settings.language, 'newsCount', { n: '' })} • اسحب أي خبر للحذف ➔
            </p>
          </div>
        </div>

        {bookmarkedArticles.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-500/10 p-1.5 rounded-2xl">
                <span className="text-xs text-red-500 font-bold px-2">مسح الكل؟</span>
                <button
                  id="confirm-clear-favorites-btn"
                  onClick={() => {
                    onClearAllBookmarks();
                    setShowClearConfirm(false);
                  }}
                  className="px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700"
                >
                  نعم، احذف
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs ${bgClasses.card}`}
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                id="clear-all-favorites-btn"
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>{getTranslation(settings.language, 'clearAll')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {bookmarkedArticles.length > 0 && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(settings.language, 'searchPlaceholder')}
            className={`w-full py-3 px-4 pl-10 text-xs sm:text-sm rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
              settings.darkMode === 'oled'
                ? 'bg-[#060b18] text-white'
                : settings.darkMode === 'dark'
                ? 'bg-[#0a1128] text-white'
                : 'bg-white text-slate-900'
            }`}
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
        </div>
      )}

      {/* Articles Grid / List */}
      {bookmarkedArticles.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl ${bgClasses.card} space-y-4 shadow-lg`}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-amber-500/15">
            <Bookmark className="w-8 h-8 text-amber-500 fill-amber-500" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-bold text-base sm:text-lg">
              {getTranslation(settings.language, 'noFavorites')}
            </h3>
            <p className={`text-xs ${bgClasses.muted} leading-relaxed`}>
              {getTranslation(settings.language, 'noFavoritesSub')}
            </p>
          </div>
          <button
            onClick={onBackToHome}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-lg mx-auto transition-all hover:opacity-95 ${theme.primary}`}
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية وتصفح الأخبار</span>
          </button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <p>{getTranslation(settings.language, 'searchNoResults')}</p>
        </div>
      ) : (
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
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isBookmarked={true}
                onToggleBookmark={() => onRemoveBookmark(article)}
                onOpenArticle={onOpenArticle}
                onDeleteArticle={onDeleteArticle || onRemoveBookmark}
                settings={settings}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
