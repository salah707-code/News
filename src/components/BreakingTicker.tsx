import React, { useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { NewsArticle, AppSettings } from '../types';
import { getTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';

interface BreakingTickerProps {
  breakingArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  settings: AppSettings;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  breakingArticles,
  onSelectArticle,
  settings,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (breakingArticles.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [breakingArticles.length, isPaused]);

  if (breakingArticles.length === 0) return null;

  const currentArticle = breakingArticles[currentIndex] || breakingArticles[0];

  return (
    <div 
      className="w-full bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 flex items-center gap-2.5 text-xs select-none transition-colors border-b border-red-700 shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Breaking Badge */}
      <div className="flex items-center gap-1.5 bg-red-950/80 px-2.5 py-1 rounded-lg shrink-0 font-bold uppercase tracking-wider text-[11px] shadow-xs">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <Zap className="w-3.5 h-3.5 text-amber-300" />
        <span>{getTranslation(settings.language, 'breakingNews')}</span>
      </div>

      {/* Animated Headline */}
      <div className="flex-1 overflow-hidden relative h-5 flex items-center cursor-pointer" onClick={() => onSelectArticle(currentArticle)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="truncate font-semibold hover:underline"
          >
            <span className="opacity-80 text-[10px] ml-1.5 font-normal">[{currentArticle.source}]</span>
            {currentArticle.title}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Chevrons */}
      {breakingArticles.length > 1 && (
        <div className="flex items-center gap-1 shrink-0 opacity-90">
          <span className="text-[10px] px-1 font-mono font-bold">{currentIndex + 1}/{breakingArticles.length}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev - 1 + breakingArticles.length) % breakingArticles.length);
            }}
            className="p-1 hover:bg-red-800 rounded-md transition-colors"
          >
            {settings.language === 'ar' ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
            }}
            className="p-1 hover:bg-red-800 rounded-md transition-colors"
          >
            {settings.language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
