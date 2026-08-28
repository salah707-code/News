import React from 'react';
import { 
  Home, 
  Flame, 
  Bookmark, 
  Globe2, 
  SlidersHorizontal 
} from 'lucide-react';
import { AppSettings } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';

export type MainTab = 'home' | 'breaking' | 'favorites' | 'sources' | 'settings';

interface BottomNavBarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  favoritesCount: number;
  breakingCount: number;
  settings: AppSettings;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  breakingCount,
  settings,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const TABS: { id: MainTab; labelAr: string; labelEn: string; icon: React.ElementType; color: string; badge?: number; isPrimary?: boolean }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: Home, color: 'text-indigo-500', isPrimary: true },
    { id: 'breaking', labelAr: 'عاجل', labelEn: 'Breaking', icon: Flame, color: 'text-rose-500', badge: breakingCount },
    { id: 'favorites', labelAr: 'المفضلة', labelEn: 'Saved', icon: Bookmark, color: 'text-amber-500', badge: favoritesCount },
    { id: 'sources', labelAr: 'المواقع', labelEn: 'Websites', icon: Globe2, color: 'text-sky-500' },
    { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: SlidersHorizontal, color: 'text-purple-500' },
  ];

  return (
    <nav className={`w-full fixed bottom-0 z-30 pb-safe shadow-2xl transition-colors duration-200 ${bgClasses.header}`}>
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around px-3 py-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHome = tab.id === 'home';
          const Icon = tab.icon;
          const label = settings.language === 'en' ? tab.labelEn : tab.labelAr;

          if (isHome) {
            return (
              <button
                key={tab.id}
                id={`bottom-nav-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all duration-200 select-none group shadow-md ${
                  isActive 
                    ? `${theme.primary} text-white shadow-blue-600/30 scale-105` 
                    : `${bgClasses.card} ${bgClasses.hover}`
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.6]' : 'text-blue-500'}`} />
                </div>
                <span className="text-[10.5px] font-extrabold mt-0.5 tracking-tight">
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative select-none ${
                isActive ? `${theme.primaryLight}` : `${bgClasses.hover}`
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5] ' + theme.primaryText : tab.color}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] bg-red-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-0.5 ${isActive ? theme.primaryText : bgClasses.muted}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
