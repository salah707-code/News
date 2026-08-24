export type ThemeColor = 'indigo' | 'blue' | 'orange' | 'green' | 'emerald' | 'crimson' | 'amber' | 'violet' | 'teal' | 'rose' | 'cyan';
export type DarkMode = 'light' | 'dark' | 'oled';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type ReadingSpeed = 'normal' | 'grid' | 'fast' | 'compact' | 'magazine';
export type Language = 'ar' | 'en' | 'fr';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent?: string;
  author: string;
  source: string;
  sourceId: string;
  sourceLogo?: string;
  category: string; // 'politics' | 'sports' | 'tech' | 'economy' | 'world' | 'health' | 'culture'
  pubDate: string;
  imageUrl: string;
  link: string;
  isBreaking?: boolean;
  readTimeMinutes?: number;
  aiSummary?: string;
  aiKeyPoints?: string[];
  viewsCount?: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  icon: string;
  badgeColor?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  category: string;
  iconName: string;
  enabled: boolean;
  isCustom: boolean;
  country?: string;
  color?: string;
}

export interface AppSettings {
  themeColor: ThemeColor;
  darkMode: DarkMode;
  fontSize: FontSize;
  readingSpeed: ReadingSpeed;
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
