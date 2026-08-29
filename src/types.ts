export type ThemeColor = 'blue' | 'indigo' | 'emerald' | 'amber' | 'crimson' | 'violet' | 'teal' | 'orange' | 'cyan' | 'rose';
export type DarkMode = 'light' | 'dark' | 'oled';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type ReadingSpeed = 'normal' | 'grid' | 'fast' | 'compact' | 'magazine';
export type Language = 'ar' | 'en';
export type AppViewMode = 'browsing' | 'reading';
export type ReaderVisualMode = 'normal' | 'cream' | 'sepia' | 'dark';

export interface ReadingReminder {
  id: string;
  articleId: string;
  articleTitle: string;
  articleSource: string;
  articleImage?: string;
  reminderTime?: string; // ISO String
  remindAt: string; // ISO String
  createdAt: string;
  completed?: boolean;
  notified?: boolean;
}

export interface ReadingStats {
  totalArticlesRead: number;
  totalReadingMinutes: number;
  categoryCounts: Record<string, number>;
  sourceCounts?: Record<string, number>;
  lastReadDate?: string;
  streakDays?: number;
  weeklyReading?: { day: string; minutes: number }[];
  history?: {
    articleId: string;
    title: string;
    category: string;
    source: string;
    readAt: string;
    readMinutes: number;
  }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  author: string;
  source: string;
  sourceId: string;
  sourceLogo?: string;
  category: string; // 'world' | 'politics' | 'sports' | 'tech' | 'economy' | 'health' | 'culture'
  pubDate: string;
  imageUrl: string;
  link: string;
  isBreaking?: boolean;
  readTimeMinutes?: number;
  aiSummary?: string;
  aiKeyPoints?: string[];
  viewsCount?: number;
  // Foreign translation support
  isForeign?: boolean;
  originalLanguage?: string;
  translatedTitle?: string;
  translatedSummary?: string;
  translatedFullContent?: string;
  isTranslated?: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  badgeColor?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  nameEn?: string;
  url: string;
  rssUrl?: string;
  category: string;
  iconName: string;
  enabled: boolean;
  isCustom: boolean;
  country?: string;
  color?: string;
  isForeign?: boolean;
}

export interface AppSettings {
  themeColor: ThemeColor;
  darkMode: DarkMode;
  fontSize: FontSize;
  readingSpeed: ReadingSpeed;
  appViewMode: AppViewMode; // 'browsing' or 'reading'
  autoRefreshInterval: number; // in seconds, 0 = off
  language: Language;
  notificationsEnabled: boolean;
  audioChimeEnabled: boolean;
  breakingNewsOnly: boolean;
  viewMode: 'responsive-fluid' | 'mobile-frame';
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  articleId?: string;
  category?: string;
  isBreaking?: boolean;
}
