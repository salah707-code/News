import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bookmark, 
  Clock, 
  Calendar, 
  User, 
  Sparkles, 
  Maximize2,
  Trash2,
  Languages,
  Zap,
  Globe,
  Bell,
  Eye,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Image as ImageIcon,
  Database,
  Camera
} from 'lucide-react';
import { NewsArticle, AppSettings, FontSize } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { getDistinctArticleImage, SECONDARY_EDITORIAL_PHOTOS } from '../utils/newsImages';
import { CachedImage } from './CachedImage';
import { translateArticleContent, getCachedTranslation } from '../utils/translationService';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onDeleteArticle?: (article: NewsArticle) => void;
  onOpenReminder?: (article: NewsArticle) => void;
  onUpdateFontSize?: (size: FontSize) => void;
  settings: AppSettings;
}

const FONT_SIZE_STEPS: FontSize[] = ['sm', 'base', 'lg', 'xl', '2xl'];

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onDeleteArticle,
  onOpenReminder,
  onUpdateFontSize,
  settings,
}) => {
  const [currentFontSize, setCurrentFontSize] = useState<FontSize>(settings.fontSize);
  const [isComfortView, setIsComfortView] = useState<boolean>(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState<string>('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);
  const fontStyle = FONT_SIZES[currentFontSize];

  // Sync font size from settings
  useEffect(() => {
    setCurrentFontSize(settings.fontSize);
  }, [settings.fontSize]);

  // Reset state on new article and load cached translation if available
  useEffect(() => {
    setIsTranslated(false);
    if (article?.id) {
      const cached = getCachedTranslation(article.id, 'ar');
      if (cached) {
        article.translatedTitle = cached.translatedTitle;
        article.translatedSummary = cached.translatedSummary;
        article.translatedFullContent = cached.translatedFullContent;
      }
    }
  }, [article?.id]);

  if (!isOpen || !article) return null;

  const displayTitle = isTranslated && article.translatedTitle ? article.translatedTitle : article.title;
  const displaySummary = isTranslated && article.translatedSummary ? article.translatedSummary : article.summary;
  const displayContent = isTranslated && article.translatedFullContent ? article.translatedFullContent : article.fullContent;
  const displayImage = article.imageUrl || getDistinctArticleImage(article.id, article.category, article.isBreaking, article.title);

  // Compute secondary and tertiary figure images unique to this article for photo gallery
  const secondaryImageIndex = Math.abs((article.id || '').charCodeAt(0) || 0) % SECONDARY_EDITORIAL_PHOTOS.length;
  const secondaryImage = SECONDARY_EDITORIAL_PHOTOS[secondaryImageIndex];
  const tertiaryImageIndex = (secondaryImageIndex + 1) % SECONDARY_EDITORIAL_PHOTOS.length;
  const tertiaryImage = SECONDARY_EDITORIAL_PHOTOS[tertiaryImageIndex];
  const articleGallery = [displayImage, secondaryImage, tertiaryImage].filter(Boolean);

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
      const translated = await translateArticleContent(article, 'ar');
      article.translatedTitle = translated.translatedTitle || article.title;
      article.translatedSummary = translated.translatedSummary || article.summary;
      article.translatedFullContent = translated.translatedFullContent || article.fullContent;
      setIsTranslated(true);
    } catch {
      setIsTranslated(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDelete = () => {
    if (onDeleteArticle) {
      onDeleteArticle(article);
      onClose();
    }
  };

  const handleIncreaseFont = () => {
    const currentIndex = FONT_SIZE_STEPS.indexOf(currentFontSize);
    if (currentIndex < FONT_SIZE_STEPS.length - 1) {
      const nextSize = FONT_SIZE_STEPS[currentIndex + 1];
      setCurrentFontSize(nextSize);
      if (onUpdateFontSize) {
        onUpdateFontSize(nextSize);
      }
    }
  };

  const handleDecreaseFont = () => {
    const currentIndex = FONT_SIZE_STEPS.indexOf(currentFontSize);
    if (currentIndex > 0) {
      const nextSize = FONT_SIZE_STEPS[currentIndex - 1];
      setCurrentFontSize(nextSize);
      if (onUpdateFontSize) {
        onUpdateFontSize(nextSize);
      }
    }
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

  // Comfort Cream theme styles
  const modalContainerBg = isComfortView 
    ? 'bg-[#fbf7ee] text-[#2c2317] border border-[#e8dec8]' 
    : bgClasses.surface;

  // Split paragraphs
  const paragraphs = displayContent ? displayContent.split('\n\n').filter(p => p.trim().length > 0) : [displaySummary];

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
              src={fullscreenImageSrc || displayImage}
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
        className={`w-full max-w-4xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative transition-colors duration-300 ${modalContainerBg}`}
      >
        {/* Top Control Bar */}
        <div className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-2 z-20 ${isComfortView ? 'bg-[#f4ebd9]/90 border-[#e5d9bf]' : bgClasses.header}`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="close-article-modal-btn"
              onClick={onClose}
              className={`p-2 rounded-2xl transition-all ${isComfortView ? 'bg-[#ebdcb9] hover:bg-[#e2ceaa] text-[#4a3b2c]' : `${bgClasses.elevated} ${bgClasses.hover}`}`}
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <span className={`px-3 py-1 rounded-xl text-xs font-extrabold shadow-xs ${theme.primary} text-white`}>
              {article.source}
            </span>

            {article.isBreaking && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span className="hidden sm:inline">{getTranslation(settings.language, 'breakingNews')}</span>
              </span>
            )}
          </div>

          {/* Action buttons (No share button, no external link) */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Eye Comfort / Reader View Toggle */}
            <button
              type="button"
              id="comfort-reader-toggle-btn"
              onClick={() => setIsComfortView(!isComfortView)}
              className={`px-2.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                isComfortView
                  ? 'bg-amber-700 text-amber-50 ring-2 ring-amber-600'
                  : `${bgClasses.elevated} ${bgClasses.hover} text-amber-600 dark:text-amber-400`
              }`}
              title={getTranslation(settings.language, 'visualReaderDesc')}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline">{getTranslation(settings.language, 'visualReaderMode')}</span>
            </button>

            {/* Reading Reminder Trigger */}
            {onOpenReminder && (
              <button
                type="button"
                id="article-modal-reminder-btn"
                onClick={() => onOpenReminder(article)}
                title={getTranslation(settings.language, 'readingReminder')}
                className={`p-2 rounded-2xl transition-all shadow-xs ${
                  isComfortView ? 'bg-[#ebdcb9] hover:bg-[#e2ceaa] text-amber-800' : `${bgClasses.elevated} ${bgClasses.hover} text-amber-500`
                }`}
              >
                <Bell className="w-4 h-4" />
              </button>
            )}

            {/* Font Zoom Controls (A- / A+) */}
            <div className={`flex items-center rounded-2xl p-0.5 shadow-xs ${isComfortView ? 'bg-[#ebdcb9]' : bgClasses.elevated}`}>
              <button
                type="button"
                id="font-zoom-out-btn"
                onClick={handleDecreaseFont}
                disabled={currentFontSize === 'sm'}
                title={getTranslation(settings.language, 'zoomOut')}
                className="p-1.5 rounded-xl hover:bg-black/10 transition-colors disabled:opacity-40"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-black px-1.5 select-none uppercase">
                {currentFontSize}
              </span>
              <button
                type="button"
                id="font-zoom-in-btn"
                onClick={handleIncreaseFont}
                disabled={currentFontSize === '2xl'}
                title={getTranslation(settings.language, 'zoomIn')}
                className="p-1.5 rounded-xl hover:bg-black/10 transition-colors disabled:opacity-40"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Translation Button */}
            <button
              type="button"
              id="article-translate-btn"
              onClick={handleToggleTranslation}
              disabled={isTranslating}
              className={`px-2.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs ${
                isTranslated
                  ? 'bg-emerald-600 text-white'
                  : `${bgClasses.elevated} ${bgClasses.hover} text-emerald-600 dark:text-emerald-400`
              }`}
              title={isTranslated ? getTranslation(settings.language, 'showOriginal') : getTranslation(settings.language, 'translateToArabic')}
            >
              <Languages className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isTranslating ? '...' : isTranslated ? 'مترجم' : 'ترجمة'}
              </span>
            </button>

            {/* Bookmark */}
            <button
              type="button"
              id="modal-bookmark-btn"
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-2xl transition-all shadow-xs ${
                isBookmarked ? 'bg-amber-500 text-white' : isComfortView ? 'bg-[#ebdcb9]' : `${bgClasses.elevated} ${bgClasses.hover}`
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-white' : 'text-amber-600'}`} />
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
          </div>
        </div>

        {/* Scrollable Full Reader Body */}
        <div ref={contentScrollRef} className={`flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 scroll-smooth ${isComfortView ? 'bg-[#fbf7ee]' : ''}`}>
          {/* Article Header & Metadata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${bgClasses.elevated} text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>خبر موثق من {article.source}</span>
              </span>
            </div>

            {/* Title with Instant Translation Button */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <h1 className={`font-black tracking-tight leading-snug flex-1 ${isComfortView ? 'text-[#2a2215]' : 'text-slate-900 dark:text-white'} ${fontStyle.title} text-2xl sm:text-3xl`}>
                {displayTitle}
              </h1>

              {/* Prominent Instant Translation Button beside Title */}
              <button
                type="button"
                id="inline-article-translate-btn"
                onClick={handleToggleTranslation}
                disabled={isTranslating}
                className={`self-start shrink-0 px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isTranslated
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 ring-2 ring-emerald-500/30'
                    : isComfortView
                      ? 'bg-[#ebdcb9] hover:bg-[#e2ceaa] text-amber-900 border border-amber-300/40'
                      : `${bgClasses.elevated} ${bgClasses.hover} text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/50`
                }`}
                title={isTranslated ? getTranslation(settings.language, 'showOriginal') : getTranslation(settings.language, 'translateToArabic')}
              >
                <Languages className={`w-4 h-4 ${isTranslating ? 'animate-spin text-sky-500' : ''}`} />
                <span>
                  {isTranslating 
                    ? (settings.language === 'ar' ? 'جارِ الترجمة...' : 'Translating...') 
                    : isTranslated 
                      ? (settings.language === 'ar' ? 'عرض الأصلي' : 'Show Original') 
                      : (settings.language === 'ar' ? 'ترجمة' : 'Translate')}
                </span>
              </button>
            </div>

            <div className={`flex flex-wrap items-center gap-3 text-xs ${isComfortView ? 'text-[#6e5d44]' : 'text-slate-500 dark:text-blue-200/70'} pt-1`}>
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

          {/* Primary High-Resolution Editorial Hero Image with Caching */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg group bg-slate-100 dark:bg-[#0c1630]">
            <CachedImage
              src={displayImage}
              alt={displayTitle}
              className="w-full max-h-[440px] transition-transform duration-500 hover:scale-[1.01]"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>{getTranslation(settings.language, 'fullArticleWithPhotos')}</span>
              </div>
              <div className="hidden sm:flex bg-emerald-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-emerald-300 text-[10px] font-bold items-center gap-1 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>{getTranslation(settings.language, 'cachedDataSaver')}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFullscreenImageSrc(displayImage);
                setIsImageFullscreen(true);
              }}
              className="absolute bottom-3 right-3 p-2.5 rounded-2xl bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
              title="تكبير الصورة"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* AI Summary and Highlights Box */}
          {article.aiKeyPoints && article.aiKeyPoints.length > 0 && (
            <div className={`p-4 sm:p-5 rounded-3xl shadow-sm ${isComfortView ? 'bg-[#f4ecd8] border-r-4 border-amber-600 text-[#2c2214]' : `${bgClasses.card} border-r-4 ${theme.border}`}`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span>{getTranslation(settings.language, 'aiKeyPoints')}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {article.aiKeyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Article Content with Rich In-Depth Paragraphs & Contextual Photo Insertion */}
          <div className={`space-y-5 leading-loose ${isComfortView ? 'text-[#2a2215]' : 'text-slate-800 dark:text-blue-50'} ${fontStyle.body}`}>
            {paragraphs.slice(0, 2).map((paragraph, index) => (
              <p key={index} className="text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* In-text Editorial Photo Breakout for rich visual article experience */}
            {paragraphs.length > 2 && (
              <div className="my-6 rounded-3xl overflow-hidden shadow-md relative bg-slate-100 dark:bg-[#0c1630]">
                <CachedImage
                  src={secondaryImage}
                  alt={`${displayTitle} - صورة توضيحية`}
                  className="w-full max-h-[300px]"
                />
                <div className="p-3 bg-black/50 backdrop-blur-sm text-white/90 text-xs flex items-center justify-between">
                  <span>جانب من التغطية الإخبارية والتحليل الميداني للحدث</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFullscreenImageSrc(secondaryImage);
                      setIsImageFullscreen(true);
                    }}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {paragraphs.slice(2).map((paragraph, index) => (
              <p key={`rest-${index}`} className="text-justify leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Dedicated Photo Coverage Gallery */}
          <div className={`p-4 sm:p-6 rounded-3xl space-y-3 ${isComfortView ? 'bg-[#f4ecd8]' : bgClasses.card} border border-slate-100 dark:border-blue-900/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-800 dark:text-white">
                <Camera className="w-4 h-4 text-sky-500" />
                <span>{getTranslation(settings.language, 'photoGallery')}</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-blue-200/60 font-medium">
                {articleGallery.length} صور وثائقية
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {articleGallery.map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setFullscreenImageSrc(imgSrc);
                    setIsImageFullscreen(true);
                  }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-xs bg-slate-200 dark:bg-slate-800"
                >
                  <CachedImage
                    src={imgSrc}
                    alt={`لقطة ${idx + 1} - ${displayTitle}`}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification & Agency Footer (No external link) */}
          <div className={`p-4 sm:p-5 rounded-3xl flex items-center gap-3 shadow-md ${isComfortView ? 'bg-[#f4ecd8]' : bgClasses.card}`}>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${theme.primary}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">المصدر الإخباري: {article.source}</p>
              <p className="text-xs text-slate-500 dark:text-blue-200/60">تم استعراض هذا المحتوى بالكامل وقراءته بصرياً بأعلى درجات الدقة دون الحاجة لمغادرة التطبيق.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

