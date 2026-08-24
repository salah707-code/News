import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Volume2, 
  Clock, 
  Eye, 
  Zap,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { NewsArticle, AppSettings } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion } from 'motion/react';

interface ArticleCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenArticle: (article: NewsArticle) => void;
  onPlayAudio?: (text: string, title: string) => void;
  onDeleteArticle?: (article: NewsArticle) => void;
  settings: AppSettings;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  onToggleBookmark,
  onOpenArticle,
  onPlayAudio,
  onDeleteArticle,
  settings,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);
  const fontStyle = FONT_SIZES[settings.fontSize];

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 2) return getTranslation(settings.language, 'updatedJustNow');
    if (diffMins < 60) return getTranslation(settings.language, 'minutesAgo', { n: diffMins });
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return getTranslation(settings.language, 'hoursAgo', { n: diffHours });
    return new Date(isoString).toLocaleDateString(settings.language === 'ar' ? 'ar-EG' : 'en-US');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.link || window.location.href,
        });
      } catch (err) {
        // Fallback
      }
    } else {
      navigator.clipboard.writeText(`${article.title} - ${article.link}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDeleteArticle) {
      onDeleteArticle(article);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
  const displayImage = imageError || !article.imageUrl ? fallbackImage : article.imageUrl;

  // Render Inner Card based on readingSpeed
  const renderCardContent = () => {
    // 1. SQUARES / GRID MODE (readingSpeed === 'grid')
    if (settings.readingSpeed === 'grid') {
      return (
        <div
          id={`article-card-grid-${article.id}`}
          onClick={() => {
            if (!isDragging) onOpenArticle(article);
          }}
          className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${bgClasses.card}`}
        >
          {/* Square Ratio Image Top */}
          <div className="w-full aspect-[4/3] sm:aspect-square overflow-hidden relative bg-slate-200 dark:bg-[#0d1733]">
            <img
              src={displayImage}
              alt={article.title}
              loading="lazy"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay Badges */}
            <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between gap-1 z-10">
              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold shadow-md backdrop-blur-md ${theme.primary} text-white`}>
                {article.source}
              </span>
              {article.isBreaking && (
                <span className="px-2 py-0.5 rounded-xl text-[9px] font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  {getTranslation(settings.language, 'breakingNews')}
                </span>
              )}
            </div>
            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[9px] font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{getTranslation(settings.language, 'readTime', { n: article.readTimeMinutes || 3 })}</span>
            </div>
          </div>

          {/* Content Box */}
          <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
            <div>
              <span className={`text-[10px] ${bgClasses.muted} block mb-1 font-medium`}>
                {getRelativeTime(article.pubDate)}
              </span>
              <h3 className={`font-bold line-clamp-2 text-xs sm:text-sm leading-snug group-hover:${theme.primaryText} transition-colors`}>
                {article.title}
              </h3>
            </div>

            {/* Quick Footer Action Bar with Graphic Colorful Icons */}
            <div className="pt-2 border-t border-slate-100 dark:border-blue-900/30 flex items-center justify-between gap-1">
              {onPlayAudio ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onPlayAudio(article.summary, article.title);
                  }}
                  className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition-colors"
                  title={getTranslation(settings.language, 'listenNews')}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              ) : <div />}

              <div className="flex items-center gap-1.5 mr-auto rtl:mr-auto rtl:ml-0">
                {onDeleteArticle && (
                  <button
                    type="button"
                    id={`delete-btn-grid-${article.id}`}
                    onClick={handleDelete}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all active:scale-95"
                    title={getTranslation(settings.language, 'deleteArticle')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 transition-colors"
                  title={getTranslation(settings.language, 'share')}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleBookmark(article);
                  }}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isBookmarked 
                      ? 'bg-amber-500 text-white shadow-xs' 
                      : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}
                  title={getTranslation(settings.language, 'bookmark')}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. COMPACT LIST MODE (readingSpeed === 'compact')
    if (settings.readingSpeed === 'compact') {
      return (
        <div
          id={`article-card-${article.id}`}
          onClick={() => {
            if (!isDragging) onOpenArticle(article);
          }}
          className={`group p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${bgClasses.card}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-lg font-bold shadow-xs ${theme.badge}`}>
                {article.source}
              </span>
              {article.isBreaking && (
                <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold flex items-center gap-1 shadow-xs">
                  <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                  {getTranslation(settings.language, 'breakingNews')}
                </span>
              )}
              <span className={`flex items-center gap-1 ${bgClasses.muted}`}>
                <Clock className="w-3 h-3 text-amber-500" />
                {getRelativeTime(article.pubDate)}
              </span>
            </div>
            <h3 className={`font-bold line-clamp-2 ${fontStyle.title} leading-snug group-hover:${theme.primaryText}`}>
              {article.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onDeleteArticle && (
              <button
                type="button"
                id={`delete-btn-compact-${article.id}`}
                onClick={handleDelete}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all active:scale-95"
                title={getTranslation(settings.language, 'deleteArticle')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleBookmark(article);
              }}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      );
    }

    // 3. FAST HEADLINES MODE (readingSpeed === 'fast')
    if (settings.readingSpeed === 'fast') {
      return (
        <div
          id={`article-card-${article.id}`}
          onClick={() => {
            if (!isDragging) onOpenArticle(article);
          }}
          className={`group p-3.5 rounded-3xl transition-all cursor-pointer flex gap-3.5 ${bgClasses.card}`}
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative bg-slate-200 dark:bg-[#0d1733]">
            <img
              src={displayImage}
              alt={article.title}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {article.isBreaking && (
              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-[9px] font-bold shadow-md">
                {getTranslation(settings.language, 'breakingNews')}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 text-[10px] mb-1">
                <span className={`font-bold ${theme.primaryText}`}>{article.source}</span>
                <span className={bgClasses.muted}>• {getRelativeTime(article.pubDate)}</span>
              </div>
              <h3 className={`font-bold line-clamp-2 leading-snug ${fontStyle.title} group-hover:${theme.primaryText}`}>
                {article.title}
              </h3>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-blue-900/30 text-xs">
              <span className={`text-[11px] ${bgClasses.muted} flex items-center gap-1`}>
                <Clock className="w-3 h-3 text-amber-500" />
                {getTranslation(settings.language, 'readTime', { n: article.readTimeMinutes || 3 })}
              </span>
              <div className="flex items-center gap-1.5">
                {onDeleteArticle && (
                  <button
                    type="button"
                    id={`delete-btn-fast-${article.id}`}
                    onClick={handleDelete}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all active:scale-95"
                    title={getTranslation(settings.language, 'deleteArticle')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleBookmark(article);
                  }}
                  className={`p-1.5 rounded-xl transition-colors ${
                    isBookmarked 
                      ? 'bg-amber-500 text-white shadow-xs' 
                      : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. MAGAZINE MODE (readingSpeed === 'magazine')
    if (settings.readingSpeed === 'magazine') {
      return (
        <div
          id={`article-card-${article.id}`}
          onClick={() => {
            if (!isDragging) onOpenArticle(article);
          }}
          className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl min-h-[320px] flex flex-col justify-end p-5 transition-all"
        >
          <img
            src={displayImage}
            alt={article.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-75 group-hover:brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b18]/95 via-[#060b18]/60 to-transparent" />
          
          <div className="relative z-10 text-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-xl text-[11px] font-extrabold ${theme.primary} text-white shadow-md`}>
                  {article.source}
                </span>
                {article.isBreaking && (
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                    {getTranslation(settings.language, 'breakingNews')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-blue-100 opacity-90">{getRelativeTime(article.pubDate)}</span>
            </div>

            <h3 className={`font-extrabold line-clamp-3 ${fontStyle.title} leading-tight text-white`}>
              {article.title}
            </h3>

            <p className="text-xs text-blue-100 line-clamp-2 opacity-90 leading-relaxed">
              {article.summary}
            </p>

            <div className="flex items-center justify-between pt-2.5 border-t border-white/20">
              <div className="flex items-center gap-2">
                {onPlayAudio && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onPlayAudio(article.summary, article.title);
                    }}
                    className="p-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white transition-colors backdrop-blur-md shadow-xs"
                    title={getTranslation(settings.language, 'listenNews')}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onDeleteArticle && (
                  <button
                    type="button"
                    id={`delete-btn-magazine-${article.id}`}
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-all active:scale-95 backdrop-blur-md shadow-xs"
                    title={getTranslation(settings.language, 'deleteArticle')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-sky-600/80 hover:bg-sky-600 text-white transition-colors backdrop-blur-md shadow-xs"
                  title={getTranslation(settings.language, 'share')}
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4 text-white" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleBookmark(article);
                  }}
                  className={`p-2 rounded-xl transition-colors backdrop-blur-md shadow-xs ${
                    isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/25 hover:bg-white/35 text-white'
                  }`}
                  title={getTranslation(settings.language, 'bookmark')}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. STANDARD NORMAL CARD MODE (Default)
    return (
      <article
        id={`article-card-${article.id}`}
        onClick={() => {
          if (!isDragging) onOpenArticle(article);
        }}
        className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${bgClasses.card}`}
      >
        {/* Article Image Container */}
        <div className="w-full h-48 sm:h-52 overflow-hidden relative bg-slate-200 dark:bg-[#0d1733]">
          <img
            src={displayImage}
            alt={article.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Source & Breaking Badges */}
          <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 z-10">
            <span className={`px-3 py-1 rounded-xl text-xs font-extrabold shadow-lg backdrop-blur-md ${theme.primary} text-white`}>
              {article.source}
            </span>
            {article.isBreaking && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                {getTranslation(settings.language, 'breakingNews')}
              </span>
            )}
          </div>

          {/* Read Time Pill */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTranslation(settings.language, 'readTime', { n: article.readTimeMinutes || 3 })}</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${bgClasses.muted}`}>{getRelativeTime(article.pubDate)}</span>
              {article.viewsCount && (
                <span className={`flex items-center gap-1 text-[11px] ${bgClasses.muted}`}>
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  {article.viewsCount}
                </span>
              )}
            </div>

            <h3 className={`font-bold line-clamp-2 leading-tight ${fontStyle.title} group-hover:${theme.primaryText} transition-colors`}>
              {article.title}
            </h3>

            <p className={`line-clamp-3 text-slate-600 dark:text-blue-100/70 ${fontStyle.body}`}>
              {article.summary}
            </p>
          </div>

          {/* Action Footer with Colorful Graphic Icons */}
          <div className="pt-3 border-t border-slate-100 dark:border-blue-900/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {onPlayAudio && (
                <button
                  type="button"
                  id={`audio-play-btn-${article.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onPlayAudio(article.summary, article.title);
                  }}
                  title={getTranslation(settings.language, 'listenNews')}
                  className="p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition-all flex items-center gap-1 shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Direct Delete Article Button */}
              {onDeleteArticle && (
                <button
                  type="button"
                  id={`delete-article-btn-${article.id}`}
                  onClick={handleDelete}
                  title={getTranslation(settings.language, 'deleteArticle')}
                  className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all active:scale-95 shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                id={`share-article-btn-${article.id}`}
                onClick={handleShare}
                title={getTranslation(settings.language, 'share')}
                className="p-2 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 transition-all shadow-xs"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                id={`bookmark-article-btn-${article.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleBookmark(article);
                }}
                title={isBookmarked ? getTranslation(settings.language, 'removedBookmark') : getTranslation(settings.language, 'bookmark')}
                className={`p-2 rounded-2xl transition-all shadow-xs ${
                  isBookmarked
                    ? 'bg-amber-500 text-white shadow-amber-500/20'
                    : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  // Full Swipe-to-Delete interactive container wrapper
  if (!onDeleteArticle) {
    return renderCardContent();
  }

  return (
    <div className="relative overflow-hidden rounded-3xl group/swipe select-none">
      {/* Swipe reveal background indicator (Red Delete Zone on Drag) */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-3xl flex items-center justify-between px-6 text-white text-xs font-extrabold shadow-inner z-0">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 animate-pulse" />
          <span>حذف الخبر</span>
        </div>
        <div className="flex items-center gap-2">
          <span>اسحب للحذف</span>
          <Trash2 className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Swipeable Foreground Motion Card */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={{ left: 0.6, right: 0.6 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setTimeout(() => setIsDragging(false), 80);
          if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 450) {
            onDeleteArticle(article);
          }
        }}
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.25 } }}
        className="relative z-10 w-full"
      >
        {renderCardContent()}
      </motion.div>
    </div>
  );
};
