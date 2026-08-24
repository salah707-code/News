import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Clock, 
  Calendar, 
  User, 
  Play, 
  Pause, 
  Type, 
  Check, 
  Maximize2,
  Trash2
} from 'lucide-react';
import { NewsArticle, AppSettings, FontSize } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion } from 'motion/react';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onDeleteArticle?: (article: NewsArticle) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onDeleteArticle,
  settings,
  onUpdateSettings,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTeleprompterActive, setIsTeleprompterActive] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState<number>(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const teleprompterIntervalRef = useRef<any>(null);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);
  const currentFontSize = settings.fontSize;
  const fontStyle = FONT_SIZES[currentFontSize];

  // Lock body scroll when modal open
  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (teleprompterIntervalRef.current) {
        clearInterval(teleprompterIntervalRef.current);
      }
    };
  }, [article]);

  // Teleprompter / Auto-Scroll Effect
  useEffect(() => {
    if (isTeleprompterActive && contentScrollRef.current) {
      teleprompterIntervalRef.current = setInterval(() => {
        if (contentScrollRef.current) {
          contentScrollRef.current.scrollTop += teleprompterSpeed;
        }
      }, 30);
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
  }, [isTeleprompterActive, teleprompterSpeed]);

  if (!article) return null;

  // Text to Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${article.title}. ${article.summary}. ${article.fullContent || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = settings.language === 'ar' ? 'ar-SA' : settings.language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const cycleFontSize = () => {
    const sizes: FontSize[] = ['sm', 'base', 'lg', 'xl', '2xl'];
    const nextIdx = (sizes.indexOf(currentFontSize) + 1) % sizes.length;
    onUpdateSettings({ fontSize: sizes[nextIdx] });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.link || window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${article.title} - ${article.link}`);
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

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString(settings.language === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className={`w-full max-w-3xl h-full sm:h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden ${bgClasses.surface}`}
      >
        {/* Top Sticky Reader Navigation Bar */}
        <div className={`px-4 py-3 flex items-center justify-between gap-2 z-20 shrink-0 ${bgClasses.header}`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="close-article-modal-btn"
              onClick={onClose}
              className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <X className="w-5 h-5 text-slate-500 hover:text-slate-900 dark:text-blue-200" />
            </button>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold ${theme.primary} text-white shadow-xs`}>
              {article.source}
            </span>
          </div>

          {/* Quick Reader Controls with Colorful Graphic Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Size Adjuster */}
            <button
              type="button"
              id="font-size-adjust-btn"
              onClick={cycleFontSize}
              title={getTranslation(settings.language, 'fontSize')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>{currentFontSize.toUpperCase()}</span>
            </button>

            {/* Auto-Scroll / Teleprompter Toggle */}
            <button
              type="button"
              id="teleprompter-toggle-btn"
              onClick={() => setIsTeleprompterActive(!isTeleprompterActive)}
              title={getTranslation(settings.language, 'teleprompter')}
              className={`p-2 rounded-2xl transition-all shadow-xs ${
                isTeleprompterActive ? 'bg-amber-500 text-white' : `${bgClasses.elevated} ${bgClasses.hover}`
              }`}
            >
              {isTeleprompterActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Audio Speech */}
            <button
              type="button"
              id="audio-speech-btn"
              onClick={toggleSpeech}
              title={getTranslation(settings.language, 'listenNews')}
              className={`p-2 rounded-2xl transition-all shadow-xs ${
                isSpeaking ? 'bg-emerald-500 text-white animate-pulse' : `${bgClasses.elevated} ${bgClasses.hover}`
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
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
                className={`p-2 rounded-2xl transition-all bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 active:scale-95 shadow-xs`}
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
            <h1 className={`font-extrabold tracking-tight leading-snug ${fontStyle.title} text-2xl sm:text-3xl`}>
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-blue-200/70 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>{formatDate(article.pubDate)}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{getTranslation(settings.language, 'readTime', { n: article.readTimeMinutes || 3 })}</span>
              </span>
            </div>
          </div>

          {/* High Definition Image Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg group">
            <img
              src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[380px] object-cover"
            />
            <button
              type="button"
              onClick={() => setIsImageFullscreen(!isImageFullscreen)}
              className="absolute bottom-3 right-3 p-2 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Full Article Content */}
          <div className={`space-y-4 leading-loose ${fontStyle.body}`}>
            {article.fullContent ? (
              article.fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-slate-800 dark:text-blue-50">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-slate-800 dark:text-blue-50">
                {article.summary}
              </p>
            )}
          </div>

          {/* Original Source Reference */}
          <div className={`p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${bgClasses.card}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${theme.primary}`}>
                {article.source.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-xs">{article.source}</p>
                <p className="text-[11px] text-slate-500 dark:text-blue-200/60">{getTranslation(settings.language, 'visitSource')}</p>
              </div>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <span>{getTranslation(settings.language, 'visitSource')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
