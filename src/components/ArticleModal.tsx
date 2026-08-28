import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Clock, 
  Calendar, 
  User, 
  Check, 
  Sparkles, 
  Type, 
  Play, 
  Pause, 
  Maximize2,
  Trash2,
  Languages,
  Zap,
  Globe
} from 'lucide-react';
import { NewsArticle, AppSettings, FontSize } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onDeleteArticle?: (article: NewsArticle) => void;
  settings: AppSettings;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onDeleteArticle,
  settings,
}) => {
  const [currentFontSize, setCurrentFontSize] = useState<FontSize>(settings.fontSize);
  const [isCopied, setIsCopied] = useState(false);
  const [isTeleprompterActive, setIsTeleprompterActive] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary?: string;
    keyPoints?: string[];
    context?: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const teleprompterIntervalRef = useRef<number | null>(null);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);
  const fontStyle = FONT_SIZES[currentFontSize];

  // Sync font size from settings
  useEffect(() => {
    setCurrentFontSize(settings.fontSize);
  }, [settings.fontSize]);

  // Reset state on new article
  useEffect(() => {
    setIsTranslated(false);
    setIsTeleprompterActive(false);
    if (teleprompterIntervalRef.current) {
      clearInterval(teleprompterIntervalRef.current);
    }
  }, [article?.id]);

  // Teleprompter auto scroll handler
  useEffect(() => {
    if (isTeleprompterActive) {
      teleprompterIntervalRef.current = window.setInterval(() => {
        if (contentScrollRef.current) {
          contentScrollRef.current.scrollTop += 1.5;
        }
      }, 50);
    } else {
      if (teleprompterIntervalRef.current) {
        clearInterval(teleprompterIntervalRef.current);
      }
    }
    return () => {
      if (teleprompterIntervalRef.current) {
        clearInterval(teleprompterIntervalRef.current);
      }
    };
  }, [isTeleprompterActive]);

  if (!isOpen || !article) return null;

  const displayTitle = isTranslated && article.translatedTitle ? article.translatedTitle : article.title;
  const displaySummary = isTranslated && article.translatedSummary ? article.translatedSummary : article.summary;
  const displayContent = isTranslated && article.translatedFullContent ? article.translatedFullContent : article.fullContent;

  const handleToggleTranslation = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (article.translatedTitle && article.translatedFullContent) {
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

  const handleShare = async () => {
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

  const handleDelete = () => {
    if (onDeleteArticle) {
      onDeleteArticle(article);
      onClose();
    }
  };

  const cycleFontSize = () => {
    const sizes: FontSize[] = ['sm', 'base', 'lg', 'xl', '2xl'];
    const nextIndex = (sizes.indexOf(currentFontSize) + 1) % sizes.length;
    setCurrentFontSize(sizes[nextIndex]);
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(settings.language === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in" id="article-modal-backdrop">
      {/* Fullscreen Image Overlay */}
      <AnimatePresence>
        {isImageFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageFullscreen(false)}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <img
              src={article.imageUrl}
              alt={displayTitle}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className={`w-full max-w-4xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative ${bgClasses.surface}`}
      >
        {/* Top Control Bar */}
        <div className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-2 z-20 ${bgClasses.header}`}>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="close-article-modal-btn"
              onClick={onClose}
              className={`p-2 rounded-2xl transition-all ${bgClasses.elevated} ${bgClasses.hover}`}
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <span className={`px-3 py-1 rounded-xl text-xs font-extrabold ${theme.primary} text-white shadow-xs`}>
              {article.source}
            </span>

            {article.isBreaking && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{getTranslation(settings.language, 'breakingNews')}</span>
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Translation Button for Foreign Articles */}
            {article.isForeign && (
              <button
                type="button"
                id="article-translate-btn"
                onClick={handleToggleTranslation}
                disabled={isTranslating}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isTranslated
                    ? 'bg-emerald-600 text-white'
                    : `${bgClasses.elevated} ${bgClasses.hover} text-emerald-600 dark:text-emerald-400`
                }`}
                title={isTranslated ? getTranslation(settings.language, 'showOriginal') : getTranslation(settings.language, 'translateToArabic')}
              >
                <Languages className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isTranslating ? 'جار الترجمة...' : isTranslated ? getTranslation(settings.language, 'showOriginal') : getTranslation(settings.language, 'translateToArabic')}
                </span>
              </button>
            )}

            {/* Font Size Toggle */}
            <button
              type="button"
              id="font-size-cycle-btn"
              onClick={cycleFontSize}
              title={getTranslation(settings.language, 'fontSize')}
              className={`p-2 rounded-2xl transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <Type className="w-4 h-4 text-blue-500" />
            </button>

            {/* Teleprompter Auto-Scroll */}
            <button
              type="button"
              id="teleprompter-btn"
              onClick={() => setIsTeleprompterActive(!isTeleprompterActive)}
              title={getTranslation(settings.language, 'teleprompter')}
              className={`p-2 rounded-2xl transition-all shadow-xs ${
                isTeleprompterActive ? 'bg-amber-500 text-white' : `${bgClasses.elevated} ${bgClasses.hover}`
              }`}
            >
              {isTeleprompterActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Bookmark */}
            <button
              type="button"
              id="modal-bookmark-btn"
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-2xl transition-all shadow-xs ${
                isBookmarked ? 'bg-amber-500 text-white' : `${bgClasses.elevated} ${bgClasses.hover}`
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-white' : 'text-amber-500'}`} />
            </button>

            {/* Delete Article Button */}
            {onDeleteArticle && (
              <button
                type="button"
                id="modal-delete-btn"
                onClick={handleDelete}
                title={getTranslation(settings.language, 'deleteArticle')}
                className="p-2 rounded-2xl transition-all bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Share */}
            <button
              type="button"
              id="modal-share-btn"
              onClick={handleShare}
              className={`p-2 rounded-2xl transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-sky-500" />}
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div ref={contentScrollRef} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 scroll-smooth">
          {/* Article Header & Metadata */}
          <div className="space-y-3">
            <h1 className={`font-black tracking-tight leading-snug text-slate-900 dark:text-white ${fontStyle.title} text-2xl sm:text-3xl`}>
              {displayTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-blue-200/70 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>{article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                <span>{formatDate(article.pubDate)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{getTranslation(settings.language, 'readTime', { n: article.readTimeMinutes || 3 })}</span>
              </span>
            </div>
          </div>

          {/* High Definition Image Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg group bg-slate-100 dark:bg-[#0c1630]">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className="w-full max-h-[420px] object-cover"
            />
            <button
              type="button"
              onClick={() => setIsImageFullscreen(true)}
              className="absolute bottom-3 right-3 p-2 rounded-2xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
              title="تكبير الصورة"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* AI Summary and Highlights Box */}
          {article.aiKeyPoints && article.aiKeyPoints.length > 0 && (
            <div className={`p-4 sm:p-5 rounded-3xl shadow-sm ${bgClasses.card} border-r-4 ${theme.border}`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>{getTranslation(settings.language, 'aiKeyPoints')}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-blue-100">
                {article.aiKeyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Article Content with Clear Paragraphs */}
          <div className={`space-y-4 leading-loose text-slate-800 dark:text-blue-50 ${fontStyle.body}`}>
            {displayContent ? (
              displayContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-justify leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-justify leading-relaxed">
                {displaySummary}
              </p>
            )}
          </div>

          {/* Original Source Reference Box */}
          <div className={`p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${bgClasses.card}`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${theme.primary}`}>
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{article.source}</p>
                <p className="text-xs text-slate-500 dark:text-blue-200/60">{getTranslation(settings.language, 'visitSource')}</p>
              </div>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs ${bgClasses.elevated} ${bgClasses.hover} text-blue-600 dark:text-blue-400`}
            >
              <span>{getTranslation(settings.language, 'visitSource')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
