import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Clock, 
  Eye, 
  Zap,
  Check,
  Trash2,
  ExternalLink,
  Languages,
  ArrowRight,
  Globe2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { NewsArticle, AppSettings } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, useAnimation, PanInfo } from 'motion/react';

interface ArticleCardProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenArticle: (article: NewsArticle) => void;
  onDeleteArticle?: (article: NewsArticle) => void;
  settings: AppSettings;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isBookmarked,
  onToggleBookmark,
  onOpenArticle,
  onDeleteArticle,
  settings,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const controls = useAnimation();
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);
  const fontStyle = FONT_SIZES[settings.fontSize];

  // Translation helpers
  const displayTitle = isTranslated && article.translatedTitle ? article.translatedTitle : article.title;
  const displaySummary = isTranslated && article.translatedSummary ? article.translatedSummary : article.summary;

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
          title: displayTitle,
          text: displaySummary,
          url: article.link || window.location.href,
        });
      } catch (err) {
        // Fallback
      }
    } else {
      navigator.clipboard.writeText(`${displayTitle} - ${article.link}`);
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

  const toggleTranslation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (article.translatedTitle) {
      setIsTranslated(true);
      return;
    }
    try {
      setIsTranslating(true);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          summary: article.summary,
          fullContent: article.fullContent,
          targetLang: 'ar'
        })
      });
      if (res.ok) {
        const data = await res.json();
        article.translatedTitle = data.translatedTitle || article.title;
        article.translatedSummary = data.translatedSummary || article.summary;
        article.translatedFullContent = data.translatedFullContent || article.fullContent;
      }
      setIsTranslated(true);
    } catch (err) {
      setIsTranslated(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click happened on an interactive button, do not open
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    onOpenArticle(article);
  };

  // Drag handler for swipe-to-delete
  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setTimeout(() => setIsDragging(false), 50);
    const threshold = 120;
    if (info.offset.x > threshold) {
      // Swiped Right
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.25 } });
      if (onDeleteArticle) onDeleteArticle(article);
    } else if (info.offset.x < -threshold) {
      // Swiped Left
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.25 } });
      if (onDeleteArticle) onDeleteArticle(article);
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
  const displayImage = imageError || !article.imageUrl ? fallbackImage : article.imageUrl;

  // -------------------------------------------------------------
  // 1. IMMERSIVE READING MODE LAYOUT (عند تفعيل وضع القراءة في الهيدر)
  // -------------------------------------------------------------
  if (settings.appViewMode === 'reading') {
    return (
      <div className="relative overflow-hidden rounded-3xl mb-5">
        {/* Background Action Reveal on Swipe */}
        <div className="absolute inset-0 bg-rose-600 rounded-3xl flex items-center justify-between px-6 text-white font-bold text-xs select-none">
          <div className="flex items-center gap-1.5"><Trash2 className="w-5 h-5" /> <span>{getTranslation(settings.language, 'deleteArticle')}</span></div>
          <div className="flex items-center gap-1.5"><span>{getTranslation(settings.language, 'deleteArticle')}</span> <Trash2 className="w-5 h-5" /></div>
        </div>

        <motion.article
          id={`article-card-reader-${article.id}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={controls}
          onTap={(_, info) => {
            if (Math.abs(info.offset.x) < 8 && Math.abs(info.offset.y) < 8) {
              onOpenArticle(article);
            }
          }}
          onClick={handleCardClick}
          className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 p-6 sm:p-7 relative z-10 flex flex-col space-y-4 shadow-sm hover:shadow-md ${bgClasses.card}`}
        >
          {/* Header Meta: Source & Time & Translation Pill */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold shadow-xs ${theme.primary} text-white`}>
                {article.source}
              </span>
              <span className={`text-xs ${bgClasses.muted} flex items-center gap-1 font-medium`}>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {getRelativeTime(article.pubDate)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Foreign News Translation Toggle */}
              {article.isForeign && (
                <button
                  type="button"
                  id={`translate-btn-${article.id}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={toggleTranslation}
                  disabled={isTranslating}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    isTranslated
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                  title={isTranslated ? getTranslation(settings.language, 'showOriginal') : getTranslation(settings.language, 'translateToArabic')}
                >
                  <Languages className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
                  <span>{isTranslating ? 'جار الترجمة...' : isTranslated ? getTranslation(settings.language, 'translatedTag') : getTranslation(settings.language, 'translateToArabic')}</span>
                </button>
              )}

              {article.isBreaking && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs animate-pulse">
                  <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {getTranslation(settings.language, 'breakingNews')}
                </span>
              )}
            </div>
          </div>

          {/* Large Title */}
          <h2 className={`font-extrabold text-lg sm:text-xl md:text-2xl leading-snug tracking-tight text-slate-900 dark:text-white group-hover:${theme.primaryText} transition-colors`}>
            {displayTitle}
          </h2>

          {/* High-res Image */}
          <div className="w-full aspect-[21/9] sm:aspect-[16/8] rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-[#0c1630]">
            <img
              src={displayImage}
              alt={displayTitle}
              loading="lazy"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Full Rich Excerpt */}
          <p className={`text-slate-700 dark:text-blue-100/90 leading-relaxed ${fontStyle.body}`}>
            {displaySummary}
          </p>

          {/* Footer controls: Bookmark, Share, Delete, Open in Full View */}
          <div className="pt-3 border-t border-slate-100 dark:border-blue-900/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id={`reader-bookmark-${article.id}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleBookmark(article);
                }}
                className={`p-2 rounded-2xl transition-all ${
                  isBookmarked
                    ? 'bg-amber-500 text-white shadow-xs'
                    : `${bgClasses.elevated} ${bgClasses.hover} text-amber-500`
                }`}
                title={getTranslation(settings.language, 'favorites')}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                id={`reader-share-${article.id}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleShare}
                className={`p-2 rounded-2xl transition-all ${bgClasses.elevated} ${bgClasses.hover} text-sky-500`}
                title={getTranslation(settings.language, 'shareArticle')}
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-sky-500" />}
              </button>

              {onDeleteArticle && (
                <button
                  type="button"
                  id={`reader-delete-${article.id}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleDelete}
                  className="p-2 rounded-2xl transition-all bg-rose-50 dark:bg-rose-950/50 text-rose-500 hover:bg-rose-100"
                  title={getTranslation(settings.language, 'deleteArticle')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div 
              onClick={(e) => {
                e.stopPropagation();
                onOpenArticle(article);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline cursor-pointer"
            >
              <span>قراءة النص الكامل</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </div>
        </motion.article>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. BROWSING MODE LAYOUTS (Standard, Bento Grid, Compact, Magazine)
  // -------------------------------------------------------------

  // BENTO GRID LAYOUT
  if (settings.readingSpeed === 'grid') {
    return (
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-rose-600 rounded-3xl flex items-center justify-between px-5 text-white font-bold text-xs select-none">
          <Trash2 className="w-4 h-4" />
          <Trash2 className="w-4 h-4" />
        </div>

        <motion.div
          id={`article-card-grid-${article.id}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={controls}
          onTap={(_, info) => {
            if (Math.abs(info.offset.x) < 8 && Math.abs(info.offset.y) < 8) {
              onOpenArticle(article);
            }
          }}
          onClick={handleCardClick}
          className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between relative z-10 shadow-sm hover:shadow-md ${bgClasses.card}`}
        >
          {/* Square Image Top */}
          <div className="w-full aspect-[4/3] sm:aspect-square overflow-hidden relative bg-slate-200 dark:bg-[#0d1733]">
            <img
              src={displayImage}
              alt={displayTitle}
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
              {article.isForeign && (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={toggleTranslation}
                  disabled={isTranslating}
                  className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1"
                >
                  <Languages className={`w-3 h-3 ${isTranslating ? 'animate-spin' : ''}`} />
                  <span>{isTranslating ? '...' : isTranslated ? 'مترجم' : 'ترجمة'}</span>
                </button>
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
              <h3 className={`font-bold line-clamp-2 text-xs sm:text-sm leading-snug group-hover:${theme.primaryText} transition-colors text-slate-900 dark:text-white`}>
                {displayTitle}
              </h3>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-blue-900/30 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                {onDeleteArticle && (
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={handleDelete}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-500"
                    title={getTranslation(settings.language, 'deleteArticle')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleShare}
                  className={`p-1.5 rounded-xl ${bgClasses.elevated} text-sky-500`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleBookmark(article);
                }}
                className={`p-1.5 rounded-xl transition-colors ${
                  isBookmarked ? 'bg-amber-500 text-white' : `${bgClasses.elevated} text-amber-500`
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // STANDARD FULL CARD (Default Browsing Mode)
  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Background Swipe Container */}
      <div className="absolute inset-0 bg-rose-600 rounded-3xl flex items-center justify-between px-6 text-white font-bold text-xs select-none">
        <div className="flex items-center gap-1.5"><Trash2 className="w-4 h-4" /> <span>{getTranslation(settings.language, 'deleteArticle')}</span></div>
        <div className="flex items-center gap-1.5"><span>{getTranslation(settings.language, 'deleteArticle')}</span> <Trash2 className="w-4 h-4" /></div>
      </div>

      <motion.article
        id={`article-card-${article.id}`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        onTap={(_, info) => {
          if (Math.abs(info.offset.x) < 8 && Math.abs(info.offset.y) < 8) {
            onOpenArticle(article);
          }
        }}
        onClick={handleCardClick}
        className={`group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 relative z-10 flex flex-col sm:flex-row shadow-sm hover:shadow-md ${bgClasses.card}`}
      >
        {/* Dynamic Image Container */}
        <div className="sm:w-2/5 aspect-[16/10] sm:aspect-auto sm:min-h-[190px] relative overflow-hidden bg-slate-200 dark:bg-[#0c1630] shrink-0">
          <img
            src={displayImage}
            alt={displayTitle}
            loading="lazy"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Badges on Image */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <span className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold shadow-md backdrop-blur-md ${theme.primary} text-white`}>
              {article.source}
            </span>
          </div>

          {article.isBreaking && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2 py-0.5 rounded-xl text-[10px] font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                {getTranslation(settings.language, 'breakingNews')}
              </span>
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{getTranslation(settings.language, 'readTime', { n: article.readTimeMinutes || 3 })}</span>
          </div>
        </div>

        {/* Content Side */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`text-[11px] ${bgClasses.muted} font-medium`}>
                {getRelativeTime(article.pubDate)}
              </span>

              {/* Translation Trigger for foreign items */}
              {article.isForeign && (
                <button
                  type="button"
                  id={`btn-translate-card-${article.id}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={toggleTranslation}
                  disabled={isTranslating}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    isTranslated
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <Languages className={`w-3 h-3 ${isTranslating ? 'animate-spin' : ''}`} />
                  <span>{isTranslating ? '...' : isTranslated ? getTranslation(settings.language, 'translatedTag') : getTranslation(settings.language, 'translateToArabic')}</span>
                </button>
              )}
            </div>

            <h3 className={`font-bold line-clamp-2 leading-snug tracking-tight text-slate-900 dark:text-white group-hover:${theme.primaryText} transition-colors ${fontStyle.title}`}>
              {displayTitle}
            </h3>

            <p className={`line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-blue-200/80`}>
              {displaySummary}
            </p>
          </div>

          {/* Card Footer Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-blue-900/30 flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              {onDeleteArticle && (
                <button
                  type="button"
                  id={`delete-btn-${article.id}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleDelete}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 transition-colors"
                  title={getTranslation(settings.language, 'deleteArticle')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                id={`share-btn-${article.id}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleShare}
                className={`p-1.5 rounded-xl ${bgClasses.elevated} ${bgClasses.hover} text-sky-500 transition-colors`}
                title={getTranslation(settings.language, 'shareArticle')}
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id={`bookmark-btn-${article.id}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleBookmark(article);
                }}
                className={`p-1.5 rounded-xl transition-all ${
                  isBookmarked
                    ? 'bg-amber-500 text-white shadow-xs'
                    : `${bgClasses.elevated} ${bgClasses.hover} text-amber-500`
                }`}
                title={getTranslation(settings.language, 'favorites')}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
