import React from 'react';
import { 
  X, 
  Palette, 
  Moon, 
  Sun, 
  Type, 
  Zap, 
  RefreshCw, 
  Globe2, 
  Bell, 
  Smartphone, 
  Volume2,
  Check,
  LayoutGrid,
  Grid2X2,
  List,
  Flame,
  Rows
} from 'lucide-react';
import { AppSettings, ThemeColor, DarkMode, FontSize, ReadingSpeed, Language } from '../types';
import { THEME_CONFIG, FONT_SIZES, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { motion } from 'motion/react';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClose: () => void;
  onTestChime?: () => void;
}

const THEME_OPTIONS: { id: ThemeColor; nameAr: string; nameEn: string; nameFr: string; colorHex: string; descriptionAr: string }[] = [
  { id: 'indigo', nameAr: 'نيلي ملكي', nameEn: 'Royal Indigo', nameFr: 'Indigo Royal', colorHex: '#4f46e5', descriptionAr: 'اللون الافتراضي الهادئ' },
  { id: 'blue', nameAr: 'أزرق محيطي', nameEn: 'Ocean Blue', nameFr: 'Bleu Océan', colorHex: '#2563eb', descriptionAr: 'أزرق نقي وحيوي' },
  { id: 'orange', nameAr: 'برتقالي مشرق', nameEn: 'Vibrant Orange', nameFr: 'Orange Vif', colorHex: '#ea580c', descriptionAr: 'طاقة ونشاط إخباري' },
  { id: 'green', nameAr: 'أخضر كلاسيكي', nameEn: 'Forest Green', nameFr: 'Vert Classique', colorHex: '#16a34a', descriptionAr: 'أخضر طبيعي مريح' },
  { id: 'emerald', nameAr: 'زمردي راقٍ', nameEn: 'Emerald Green', nameFr: 'Émeraude', colorHex: '#059669', descriptionAr: 'زمردي حديث متوازن' },
  { id: 'teal', nameAr: 'تركوازي مائي', nameEn: 'Ocean Teal', nameFr: 'Sarcelle Océan', colorHex: '#0d9488', descriptionAr: 'مزيج أزرق مخضر' },
  { id: 'cyan', nameAr: 'سماوي ساطع', nameEn: 'Sky Cyan', nameFr: 'Cyan Ciel', colorHex: '#0891b2', descriptionAr: 'سماوي بارد وواضح' },
  { id: 'amber', nameAr: 'كهرماني ذهبي', nameEn: 'Sunset Amber', nameFr: 'Ambre Doré', colorHex: '#d97706', descriptionAr: 'دافئ كشروق الشمس' },
  { id: 'crimson', nameAr: 'أحمر قرمزي', nameEn: 'Crimson Red', nameFr: 'Rouge Cramoisi', colorHex: '#e11d48', descriptionAr: 'أحمر عاجل وقوي' },
  { id: 'rose', nameAr: 'وردي عصري', nameEn: 'Modern Rose', nameFr: 'Rose Moderne', colorHex: '#db2777', descriptionAr: 'أنيق ومميز' },
  { id: 'violet', nameAr: 'بنفسجي ملكي', nameEn: 'Deep Violet', nameFr: 'Violet Profond', colorHex: '#9333ea', descriptionAr: 'عمق وجمال استثنائي' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onTestChime,
}) => {
  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${bgClasses.surface}`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-3 ${bgClasses.header}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${theme.primary}`}>
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {getTranslation(settings.language, 'settings')}
              </h2>
              <p className={`text-xs ${bgClasses.muted}`}>
                تخصيص كامل للألوان، المظهر، الخطوط والسرعة
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-2xl border transition-colors ${bgClasses.surface} ${bgClasses.hover}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Options */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Theme Color (إمكانية تغيير أنظمة ألوان التطبيق: أزرق، برتقالي، أخضر، إلخ) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>{getTranslation(settings.language, 'themeColor')}</span>
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                {THEME_OPTIONS.find(t => t.id === settings.themeColor)?.nameAr || settings.themeColor}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = settings.themeColor === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`theme-color-${opt.id}`}
                    onClick={() => onUpdateSettings({ themeColor: opt.id })}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-right group ${
                      isSelected
                        ? `ring-2 ${theme.ring} ring-offset-2 shadow-xs ${bgClasses.card}`
                        : `${bgClasses.surface} ${bgClasses.hover}`
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white transition-transform group-hover:scale-110"
                      style={{ backgroundColor: opt.colorHex }}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate text-[13px]">
                        {settings.language === 'en' ? opt.nameEn : settings.language === 'fr' ? opt.nameFr : opt.nameAr}
                      </div>
                      <div className={`text-[10px] truncate ${bgClasses.muted}`}>
                        {opt.descriptionAr}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Accent Preview Box */}
            <div className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${bgClasses.card}`}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold opacity-70">معاينة فورية للون:</span>
                <span className={`px-2.5 py-1 rounded-xl text-white font-bold text-[11px] ${theme.primary}`}>
                  زر تفاعلي
                </span>
                <span className={`px-2.5 py-1 rounded-xl font-bold text-[11px] border ${theme.badge}`}>
                  شارة التصنيف
                </span>
              </div>
              <span className={`text-[11px] font-mono font-bold ${theme.primaryText}`}>
                {THEME_CONFIG[settings.themeColor].hex}
              </span>
            </div>
          </div>

          {/* 2. Display / Dark Mode (وضع ليلي إضافي) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'displayMode')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                id="mode-light-btn"
                onClick={() => onUpdateSettings({ darkMode: 'light' })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  settings.darkMode === 'light'
                    ? `${theme.primary} text-white shadow-xs`
                    : `${bgClasses.surface} ${bgClasses.hover}`
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>{getTranslation(settings.language, 'lightMode')}</span>
              </button>

              <button
                id="mode-dark-btn"
                onClick={() => onUpdateSettings({ darkMode: 'dark' })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  settings.darkMode === 'dark'
                    ? `${theme.primary} text-white shadow-xs`
                    : `${bgClasses.surface} ${bgClasses.hover}`
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>{getTranslation(settings.language, 'darkMode')}</span>
              </button>

              <button
                id="mode-oled-btn"
                onClick={() => onUpdateSettings({ darkMode: 'oled' })}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  settings.darkMode === 'oled'
                    ? `${theme.primary} text-white shadow-xs`
                    : `${bgClasses.surface} ${bgClasses.hover}`
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-black border border-neutral-700 flex items-center justify-center text-[10px] text-white font-mono">
                  ●
                </div>
                <span>{getTranslation(settings.language, 'oledMode')}</span>
              </button>
            </div>
          </div>

          {/* 3. Font Size (التحكم في حجم الخط) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'fontSize')}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['sm', 'base', 'lg', 'xl', '2xl'] as FontSize[]).map((size) => {
                const isSelected = settings.fontSize === size;
                const info = FONT_SIZES[size];
                return (
                  <button
                    key={size}
                    id={`font-size-${size}`}
                    onClick={() => onUpdateSettings({ fontSize: size })}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? `${theme.primary} text-white shadow-xs`
                        : `${bgClasses.surface} ${bgClasses.hover}`
                    }`}
                  >
                    <span className="block font-bold">
                      {settings.language === 'en' ? info.labelEn : settings.language === 'fr' ? info.labelFr : info.labelAr}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Live Font Preview */}
            <div className={`p-3.5 rounded-2xl border ${bgClasses.card}`}>
              <p className="text-[11px] text-slate-400 mb-1">معاينة مباشرة لحجم الخط:</p>
              <p className={`${FONT_SIZES[settings.fontSize].body} font-medium`}>
                شهدت الساحة الإخبارية اليوم تطورات متسارعة مع انطلاق المؤتمرات الدولية واستمرار التحولات الرقمية في عالم الصحافة.
              </p>
            </div>
          </div>

          {/* 4. Reading Speed & Layout (تنسيق ونمط العرض) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'readingSpeed')}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'normal', label: getTranslation(settings.language, 'readingSpeedNormal'), desc: 'بطاقات أنيقة وكاملة بالصور والتفاصيل والملخصات', icon: LayoutGrid },
                { id: 'grid', label: getTranslation(settings.language, 'readingSpeedGrid'), desc: 'مربعات شبكية بنتو متناسقة لتصفح بصري جذاب', icon: Grid2X2 },
                { id: 'fast', label: getTranslation(settings.language, 'readingSpeedFast'), desc: 'أشرطة إعلامية سريعة مع صور جانبية', icon: Rows },
                { id: 'compact', label: getTranslation(settings.language, 'readingSpeedCompact'), desc: 'قائمة مدمجة مكثفة لعرض أكبر عدد من الأخبار', icon: List },
                { id: 'magazine', label: getTranslation(settings.language, 'readingSpeedMagazine'), desc: 'تجربة مجلة بصرية بصور عريضة وغامرة', icon: Flame },
              ].map((item) => {
                const isSelected = settings.readingSpeed === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`reading-speed-${item.id}`}
                    onClick={() => onUpdateSettings({ readingSpeed: item.id as ReadingSpeed })}
                    className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                      isSelected
                        ? `ring-2 ${theme.ring} ring-offset-1 ${bgClasses.card}`
                        : `${bgClasses.surface} ${bgClasses.hover}`
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-white shrink-0 ${isSelected ? theme.primary : 'bg-slate-400 dark:bg-neutral-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className={`text-[11px] ${bgClasses.muted}`}>{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Auto Refresh (تحديث تلقائي) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'autoRefresh')}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { seconds: 0, label: getTranslation(settings.language, 'autoRefreshOff') },
                { seconds: 30, label: getTranslation(settings.language, 'autoRefresh30s') },
                { seconds: 60, label: getTranslation(settings.language, 'autoRefresh1m') },
                { seconds: 180, label: getTranslation(settings.language, 'autoRefresh3m') },
                { seconds: 300, label: getTranslation(settings.language, 'autoRefresh5m') },
              ].map((item) => {
                const isSelected = settings.autoRefreshInterval === item.seconds;
                return (
                  <button
                    key={item.seconds}
                    id={`auto-refresh-${item.seconds}s`}
                    onClick={() => onUpdateSettings({ autoRefreshInterval: item.seconds })}
                    className={`py-2 px-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? `${theme.primary} text-white shadow-xs`
                        : `${bgClasses.surface} ${bgClasses.hover}`
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Multi-language (دعم لغات متعددة خاصة العربية) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'language')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'ar', label: 'العربية (RTL)', desc: 'اللغة الأساسية' },
                { id: 'en', label: 'English (LTR)', desc: 'Global English' },
                { id: 'fr', label: 'Français (LTR)', desc: 'Édition Française' },
              ].map((item) => {
                const isSelected = settings.language === item.id;
                return (
                  <button
                    key={item.id}
                    id={`lang-select-${item.id}`}
                    onClick={() => onUpdateSettings({ language: item.id as Language })}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? `${theme.primary} text-white shadow-xs font-bold`
                        : `${bgClasses.surface} ${bgClasses.hover}`
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] opacity-75">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Notifications & Audio Sound */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'notifications')}</span>
            </label>
            <div className="space-y-2.5">
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${bgClasses.card}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-white ${theme.primary}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{getTranslation(settings.language, 'notificationsEnabled')}</p>
                    <p className={`text-[11px] ${bgClasses.muted}`}>استقبال تنبيهات فورية للأحداث الهامة</p>
                  </div>
                </div>
                <button
                  id="toggle-notifications-switch"
                  onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${settings.notificationsEnabled ? theme.primary : 'bg-slate-300 dark:bg-neutral-700'}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.notificationsEnabled ? (settings.language === 'ar' ? 'left-1' : 'right-1') : (settings.language === 'ar' ? 'right-1' : 'left-1')}`}
                  />
                </button>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${bgClasses.card}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-white ${theme.primary}`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{getTranslation(settings.language, 'audioChime')}</p>
                    <p className={`text-[11px] ${bgClasses.muted}`}>صوت تنبيه خفيف للأخبار العاجلة</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="test-audio-chime-btn"
                    onClick={() => {
                      if (!settings.audioChimeEnabled) {
                        onUpdateSettings({ audioChimeEnabled: true });
                      }
                      onTestChime?.();
                    }}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${bgClasses.surface} ${bgClasses.hover} text-indigo-500`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{getTranslation(settings.language, 'testAudioChime')}</span>
                  </button>
                  <button
                    id="toggle-audio-chime-switch"
                    onClick={() => onUpdateSettings({ audioChimeEnabled: !settings.audioChimeEnabled })}
                    className={`w-10 h-6 rounded-full transition-colors relative ${settings.audioChimeEnabled ? theme.primary : 'bg-slate-300 dark:bg-neutral-700'}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.audioChimeEnabled ? (settings.language === 'ar' ? 'left-1' : 'right-1') : (settings.language === 'ar' ? 'right-1' : 'left-1')}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-end ${bgClasses.header}`}>
          <button
            id="done-settings-btn"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-2xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 ${theme.primary}`}
          >
            حفظ وإغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};
