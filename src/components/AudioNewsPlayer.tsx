import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { motion, AnimatePresence } from 'motion/react';

interface AudioNewsPlayerProps {
  currentTrack: { title: string; text: string } | null;
  onClose: () => void;
  settings: AppSettings;
}

export const AudioNewsPlayer: React.FC<AudioNewsPlayerProps> = ({
  currentTrack,
  onClose,
  settings,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  useEffect(() => {
    if (!currentTrack) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${currentTrack.title}. ${currentTrack.text}`);
      utterance.lang = settings.language === 'ar' ? 'ar-SA' : settings.language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = playbackRate;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentTrack, playbackRate]);

  if (!currentTrack) return null;

  const togglePlay = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        const utterance = new SpeechSynthesisUtterance(`${currentTrack.title}. ${currentTrack.text}`);
        utterance.lang = settings.language === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = playbackRate;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 0.8];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className={`fixed bottom-16 sm:bottom-20 right-4 left-4 max-w-xl mx-auto z-40 p-3 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-between gap-3 ${bgClasses.surface}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-xl text-white ${theme.primary} shrink-0`}>
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              قارئ الأخبار الصوتي
            </span>
            <p className="text-xs font-bold truncate">
              {currentTrack.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={cycleRate}
            className={`px-2 py-1 rounded-lg border text-[11px] font-mono font-bold ${bgClasses.surface}`}
          >
            {playbackRate}x
          </button>

          <button
            id="audio-player-play-btn"
            onClick={togglePlay}
            className={`p-2 rounded-xl text-white shadow-xs ${theme.primary}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            id="close-audio-player-btn"
            onClick={onClose}
            className={`p-2 rounded-xl border text-slate-400 hover:text-slate-600 ${bgClasses.surface}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
