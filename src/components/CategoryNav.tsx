import React from 'react';
import { 
  Globe2, 
  Landmark, 
  Trophy, 
  Cpu, 
  TrendingUp, 
  Compass, 
  HeartPulse, 
  Palette,
  Layers
} from 'lucide-react';
import { NewsCategory, AppSettings } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion } from 'motion/react';

interface CategoryNavProps {
  categories: NewsCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts: Record<string, number>;
  settings: AppSettings;
}

const CATEGORY_STYLES: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  all: { icon: Layers, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-950/50' },
  world: { icon: Globe2, color: 'text-sky-500', bgColor: 'bg-sky-50 dark:bg-sky-950/50' },
  politics: { icon: Landmark, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/50' },
  business: { icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-950/50' },
  sports: { icon: Trophy, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-950/50' },
  technology: { icon: Cpu, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/50' },
  health: { icon: HeartPulse, color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-950/50' },
  culture: { icon: Palette, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/50' },
  general: { icon: Compass, color: 'text-teal-500', bgColor: 'bg-teal-50 dark:bg-teal-950/50' },
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  settings,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const getCategoryName = (cat: NewsCategory) => {
    if (settings.language === 'en') return cat.nameEn;
    if (settings.language === 'fr') return cat.nameFr;
    return cat.nameAr || cat.name;
  };

  return (
    <div className={`w-full sticky top-[96px] z-20 overflow-hidden shadow-xs ${bgClasses.header}`}>
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 px-4 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const catStyle = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.all;
          const IconComponent = catStyle.icon;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`category-tab-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 relative select-none shadow-xs ${
                isSelected
                  ? `${theme.primary} text-white shadow-md shadow-blue-600/20 scale-[1.02]`
                  : `${bgClasses.card} ${bgClasses.hover}`
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-2xl bg-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : catStyle.color}`} />
              <span>{getCategoryName(cat)}</span>
              
              {/* Dynamic News Counter (عداد الأخبار حسب كل فئة) */}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-all ${
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200/80 dark:bg-blue-950 text-slate-700 dark:text-blue-200'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
