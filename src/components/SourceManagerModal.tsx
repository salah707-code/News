import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Globe, 
  Rss, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  ExternalLink,
  Search,
  Radio
} from 'lucide-react';
import { NewsSource, AppSettings, NewsCategory } from '../types';
import { THEME_CONFIG, getBackgroundClasses } from '../utils/themeColors';
import { getTranslation } from '../utils/translations';
import { fetchApi } from '../utils/api';
import { motion, AnimatePresence } from 'motion/react';

interface SourceManagerModalProps {
  sources: NewsSource[];
  categories: NewsCategory[];
  onAddSource: (newSource: Omit<NewsSource, 'id'>, initialArticles?: any[]) => void;
  onDeleteSource: (sourceId: string) => void;
  onToggleSource: (sourceId: string) => void;
  onRestoreDefaults: () => void;
  onClose: () => void;
  settings: AppSettings;
}

export const SourceManagerModal: React.FC<SourceManagerModalProps> = ({
  sources,
  categories,
  onAddSource,
  onDeleteSource,
  onToggleSource,
  onRestoreDefaults,
  onClose,
  settings,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [rssUrl, setRssUrl] = useState('');
  const [category, setCategory] = useState('all');
  const [isTestingRss, setIsTestingRss] = useState(false);
  const [rssStatus, setRssStatus] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const theme = THEME_CONFIG[settings.themeColor];
  const bgClasses = getBackgroundClasses(settings.darkMode);

  const handleTestAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    let fetchedArticles: any[] = [];
    if (rssUrl.trim()) {
      setIsTestingRss(true);
      try {
        const res = await fetchApi('/api/rss', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: rssUrl.trim() })
        });
        const data = await res.json();
        if (res.ok && data.items && data.items.length > 0) {
          fetchedArticles = data.items;
          setRssStatus({
            success: true,
            message: `تم جلب ${data.items.length} خبر بنجاح`,
            count: data.items.length
          });
        } else {
          setRssStatus({
            success: false,
            message: 'تعذر الاتصال بـ RSS، سيتم إضافة الموقع بدون تحديث تلقائي'
          });
        }
      } catch (err) {
        setRssStatus({
          success: false,
          message: 'تعذر الاتصال بـ RSS، سيتم إضافة الموقع بدون تحديث تلقائي'
        });
      } finally {
        setIsTestingRss(false);
      }
    }

    // Add source
    onAddSource({
      name: name.trim(),
      url: formattedUrl,
      rssUrl: rssUrl.trim() || undefined,
      category,
      iconName: 'Globe',
      enabled: true,
      isCustom: true,
      country: 'موقع مخصص'
    }, fetchedArticles);

    // Reset Form
    setName('');
    setUrl('');
    setRssUrl('');
    setCategory('all');
    setIsAdding(false);
    setTimeout(() => setRssStatus(null), 4000);
  };

  const filteredSources = sources.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in" id="source-manager-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden ${bgClasses.surface}`}
      >
        {/* Modal Header */}
        <div className={`p-4 flex items-center justify-between gap-3 shrink-0 ${bgClasses.header}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${theme.primary}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">
                {getTranslation(settings.language, 'manageSources')}
              </h2>
              <p className={`text-[11px] ${bgClasses.muted}`}>
                {sources.length} {getTranslation(settings.language, 'activeSources')}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-source-manager-modal-btn"
            onClick={onClose}
            className={`p-2 rounded-2xl transition-colors ${bgClasses.elevated} ${bgClasses.hover}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-2.5">
          {/* Search Sources */}
          <div className="relative flex-1 min-w-[180px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن موقع..."
              className={`w-full py-2.5 px-3.5 pr-8 text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
                settings.darkMode === 'oled'
                  ? 'bg-[#060b18] text-white'
                  : settings.darkMode === 'dark'
                  ? 'bg-[#0a1128] text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-add-source-form-btn"
              onClick={() => setIsAdding(!isAdding)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-opacity hover:opacity-90 ${theme.primary}`}
            >
              <Plus className="w-4 h-4" />
              <span>{getTranslation(settings.language, 'addSource')}</span>
            </button>

            <button
              id="restore-sources-btn"
              onClick={onRestoreDefaults}
              title={getTranslation(settings.language, 'restoreDefaults')}
              className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1 shadow-xs ${bgClasses.elevated} ${bgClasses.hover}`}
            >
              <RotateCcw className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Add Source Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleTestAndAdd}
              className={`p-4 space-y-3 ${bgClasses.card}`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {getTranslation(settings.language, 'addSource')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {getTranslation(settings.language, 'sourceName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: موقع الرياض بوست"
                    className={`w-full py-2 px-3 text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
                      settings.darkMode === 'oled' ? 'bg-[#060b18] text-white' : settings.darkMode === 'dark' ? 'bg-[#0a1128] text-white' : 'bg-white text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {getTranslation(settings.language, 'sourceUrl')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className={`w-full py-2 px-3 text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
                      settings.darkMode === 'oled' ? 'bg-[#060b18] text-white' : settings.darkMode === 'dark' ? 'bg-[#0a1128] text-white' : 'bg-white text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {getTranslation(settings.language, 'sourceRss')}
                  </label>
                  <input
                    type="text"
                    value={rssUrl}
                    onChange={(e) => setRssUrl(e.target.value)}
                    placeholder="https://example.com/feed/rss"
                    className={`w-full py-2 px-3 text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
                      settings.darkMode === 'oled' ? 'bg-[#060b18] text-white' : settings.darkMode === 'dark' ? 'bg-[#0a1128] text-white' : 'bg-white text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1">
                    {getTranslation(settings.language, 'sourceCategory')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full py-2 px-3 text-xs rounded-2xl focus:outline-none ${theme.ring} focus:ring-2 shadow-xs ${
                      settings.darkMode === 'oled' ? 'bg-[#060b18] text-white' : settings.darkMode === 'dark' ? 'bg-[#0a1128] text-white' : 'bg-white text-slate-900'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {settings.language === 'en' ? c.nameEn : c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {rssStatus && (
                <div className={`p-2.5 rounded-2xl text-xs flex items-center gap-2 ${
                  rssStatus.success ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}>
                  {rssStatus.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{rssStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold ${bgClasses.card}`}
                >
                  {settings.language === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  disabled={isTestingRss}
                  className={`px-5 py-2 rounded-2xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 ${theme.primary}`}
                >
                  {isTestingRss ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>جاري الفحص...</span>
                    </>
                  ) : (
                    <span>{settings.language === 'en' ? 'Save Source' : 'حفظ المصدر'}</span>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Source List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredSources.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <p>لا توجد مصادر مطابقة لبحثك</p>
            </div>
          ) : (
            filteredSources.map((source) => (
              <div
                key={source.id}
                className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs transition-all ${bgClasses.card} ${
                  source.enabled ? '' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Toggle switch button */}
                  <button
                    type="button"
                    onClick={() => onToggleSource(source.id)}
                    className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
                      source.enabled ? theme.primary : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform transform shadow-xs ${
                        source.enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-1 rtl:-translate-x-1'
                      }`}
                    />
                  </button>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm truncate">
                        {settings.language === 'en' && source.nameEn ? source.nameEn : source.name}
                      </span>
                      {source.rssUrl && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          RSS
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${bgClasses.muted} truncate`}>
                      {source.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-xl ${bgClasses.elevated} text-slate-400 hover:text-blue-500`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {source.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteSource(source.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 hover:bg-rose-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
