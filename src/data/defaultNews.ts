import { NewsArticle, NewsCategory, NewsSource } from '../types';

export const DEFAULT_CATEGORIES: NewsCategory[] = [
  { id: 'all', name: 'الكل', nameAr: 'جميع الأخبار', nameEn: 'All News', icon: 'Globe2' },
  { id: 'world', name: 'أخبار العالم', nameAr: 'أخبار العالم', nameEn: 'World News', icon: 'Compass' },
  { id: 'politics', name: 'سياسة', nameAr: 'السياسة', nameEn: 'Politics', icon: 'Landmark' },
  { id: 'economy', name: 'اقتصاد', nameAr: 'اقتصاد', nameEn: 'Economy', icon: 'TrendingUp' },
  { id: 'tech', name: 'تكنولوجيا', nameAr: 'تكنولوجيا', nameEn: 'Technology', icon: 'Cpu' },
  { id: 'sports', name: 'رياضة', nameAr: 'الرياضة', nameEn: 'Sports', icon: 'Trophy' },
  { id: 'health', name: 'صحة وعلوم', nameAr: 'صحة وعلوم', nameEn: 'Health & Science', icon: 'HeartPulse' },
  { id: 'culture', name: 'ثقافة وفنون', nameAr: 'ثقافة وفنون', nameEn: 'Culture & Arts', icon: 'Palette' },
];

export const DEFAULT_SOURCES: NewsSource[] = [
  {
    id: 'aljazeera',
    name: 'الجزيرة نت',
    nameEn: 'Al Jazeera',
    url: 'https://www.aljazeera.net',
    rssUrl: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8cab9',
    category: 'all',
    iconName: 'Radio',
    enabled: true,
    isCustom: false,
    country: 'قطر / عربي',
    color: '#eb7e10'
  },
  {
    id: 'alarabiya',
    name: 'العربية',
    nameEn: 'Al Arabiya',
    url: 'https://www.alarabiya.net',
    rssUrl: 'https://www.alarabiya.net/.mrss/ar/breaking-news.xml',
    category: 'world',
    iconName: 'Newspaper',
    enabled: true,
    isCustom: false,
    country: 'السعودية / عربي',
    color: '#7b1113'
  },
  {
    id: 'skynews_ar',
    name: 'سكاي نيوز عربية',
    nameEn: 'Sky News Arabia',
    url: 'https://www.skynewsarabia.com',
    rssUrl: 'https://www.skynewsarabia.com/rss.xml',
    category: 'politics',
    iconName: 'Flame',
    enabled: true,
    isCustom: false,
    country: 'الإمارات / عربي',
    color: '#e63946'
  },
  {
    id: 'bbc_ar',
    name: 'بي بي سي عربي',
    nameEn: 'BBC Arabic',
    url: 'https://www.bbc.com/arabic',
    rssUrl: 'https://feeds.bbci.co.uk/arabic/rss.xml',
    category: 'world',
    iconName: 'Tv',
    enabled: true,
    isCustom: false,
    country: 'بريطانيا / عربي',
    color: '#bb1919'
  },
  {
    id: 'asharq_econ',
    name: 'اقتصاد الشرق',
    nameEn: 'Asharq Business',
    url: 'https://asharqbusiness.com',
    rssUrl: 'https://asharqbusiness.com/rss',
    category: 'economy',
    iconName: 'TrendingUp',
    enabled: true,
    isCustom: false,
    country: 'اقتصاد عالمي',
    color: '#1d3557'
  },
  {
    id: 'reuters_global',
    name: 'رويترز (Reuters)',
    nameEn: 'Reuters Global',
    url: 'https://www.reuters.com',
    rssUrl: 'https://www.reutersagency.com/feed/?best-topics=world',
    category: 'world',
    iconName: 'Globe',
    enabled: true,
    isCustom: false,
    country: 'وكالة أنباء دولية',
    color: '#ff8000',
    isForeign: true
  },
  {
    id: 'tech_crunch_global',
    name: 'تيك كرانش (TechCrunch)',
    nameEn: 'TechCrunch',
    url: 'https://techcrunch.com',
    rssUrl: 'https://techcrunch.com/feed/',
    category: 'tech',
    iconName: 'Cpu',
    enabled: true,
    isCustom: false,
    country: 'أمريكا / تقنية عالمية',
    color: '#00a562',
    isForeign: true
  },
  {
    id: 'cnn_arabic',
    name: 'CNN بالعربية',
    nameEn: 'CNN Arabic',
    url: 'https://arabic.cnn.com',
    rssUrl: 'https://arabic.cnn.com/api/v1/rss/rss.xml',
    category: 'world',
    iconName: 'Globe',
    enabled: true,
    isCustom: false,
    country: 'أمريكا / عربي',
    color: '#cc0000'
  },
  {
    id: 'yallakora',
    name: 'يلا كورة',
    nameEn: 'YallaKora',
    url: 'https://www.yallakora.com',
    rssUrl: 'https://www.yallakora.com/rss',
    category: 'sports',
    iconName: 'Trophy',
    enabled: true,
    isCustom: false,
    country: 'مصر / رياضة',
    color: '#2a9d8f'
  },
  {
    id: 'hespress',
    name: 'هسبريس',
    nameEn: 'Hespress',
    url: 'https://www.hespress.com',
    rssUrl: 'https://www.hespress.com/feed',
    category: 'world',
    iconName: 'Newspaper',
    enabled: true,
    isCustom: false,
    country: 'المغرب / عربي',
    color: '#3a0ca3'
  }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'قمة دولية كبرى لتعزيز حلول الطاقة النظيفة ومشاريع الهيدروجين الأخضر باستثمارات 120 مليار دولار',
    summary: 'اختتام فعاليات المؤتمر الدولي للطاقة المتجددة بالاتفاق على حزمة استثمارات ضخمة لدعم مزارع الطاقة الشمسية وتطوير شبكات الربط الكهربائي الذكية بين القارات.',
    fullContent: `شهدت العاصمة اليوم ختام القمة الدولية للطاقة النظيفة بمشاركة وزراء وممثلين عن أكثر من 80 دولة ومؤسسة مالية كبرى، حيث تم التوصل إلى اتفاقيات شراكة استراتيجية لضخ استثمارات تتجاوز 120 مليار دولار في مشاريع الهيدروجين الأخضر والطاقة الشمسية خلال السنوات الخمس القادمة.

وأكد البيان الختامي للقمة على أهمية تسريع وتيرة التحول الطاقي العادل وتوفير التمويل الميسر للدول النامية، بالإضافة إلى تطوير البنية التحتية لشبكات الربط الكهربائي القاري والاعتماد على الذكاء الاصطناعي في إدارة توزيع الأحمال الكهربائية بكفاءة قصوى.

وصرح المتحدث باسم المؤتمر أن هذه الخطوات تمثل نقطة تحول حقيقية لخفض الانبعاثات الكربونية وتحقيق أهداف الاستدامة العالمية بحلول عام 2030، مع إطلاق صندوق دعم الابتكار التكنولوجي في تقنيات تخزين الطاقة وتدوير البطاريات الصناعية.`,
    author: 'طارق المنصوري',
    source: 'اقتصاد الشرق',
    sourceId: 'asharq_econ',
    category: 'economy',
    pubDate: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    link: 'https://asharqbusiness.com',
    isBreaking: true,
    readTimeMinutes: 3,
    viewsCount: 1840,
    aiSummary: '• اتفاق دولي لاستثمار 120 مليار دولار في الطاقة النظيفة والهيدروجين الأخضر.\n• التركيز على دعم الدول النامية وتطوير شبكات الربط الكهربائي الذكية.\n• تأكيد خفض الانبعاثات والوصول إلى أهداف 2030.',
    aiKeyPoints: [
      'استثمارات بـ 120 مليار دولار في مشاريع الطاقة المتجددة',
      'مشاركة أكثر من 80 دولة ومؤسسة مالية كبرى',
      'دمج الذكاء الاصطناعي في إدارة شبكات توزيع الكهرباء'
    ]
  },
  {
    id: 'news-foreign-1',
    title: 'Breakthrough Quantum Computing Architecture Solves Complex Molecular Simulations in Seconds',
    summary: 'Leading international research teams unveil a fault-tolerant photonic quantum processor capable of simulating protein structures with unprecedented chemical accuracy.',
    fullContent: `Quantum engineering scientists in Zurich and Boston have achieved a major scientific milestone by demonstrating a 1,000-qubit fault-tolerant quantum computing processor. The breakthrough allows researchers to calculate intricate molecular bonds and folding mechanisms in seconds, a feat that would take conventional supercomputers thousands of years.

The newly developed architecture implements topological error correction, allowing continuous coherence during computation without quantum state degradation. Pharmaceutical partners have already commenced testing the platform for accelerated enzyme design and drug discovery targeting rare diseases.

"This is not just an incremental step; it marks the transition of quantum technology from experimental physics into a practical industrial and medical powerhouse," stated the lead investigator during the European Quantum Summit.`,
    translatedTitle: 'معمارية حوسبة كمومية ثورية تنجح في محاكاة التفاعلات الجزيئية المعقدة في ثوانٍ معدودة',
    translatedSummary: 'فرق بحثية دولية تكشف عن معالج كمومي ضوئي قادر على محاكاة طي البروتينات والمركبات الدوائية بدقة كيميائية فائقة وسرعة غير مسبوقة.',
    translatedFullContent: `حقق علماء الهندسة الكمومية في زيورخ وبوسطن إنجازاً علمياً تاريخياً بتشغيل معالج كمومي يتحمل الأخطاء ويحتوي على 1000 كيوبت مستقر. يتيح هذا الإنجاز محاكاة الروابط الجزيئية الدقيقة وآليات طي البروتين في ثوانٍ، وهي مهام كانت تتطلب آلاف السنين من الحواسيب الفائقة التقليدية.

تعتمد المعمارية الجديدة على تقنيات تصحيح الأخطاء الطوبولوجية، مما يحافظ على استقرار الحسابات دون انهيار الحالات الكمومية. وبدأت شركات الأدوية العالمية بالفعل في استخدام المنصة لتسريع تصميم الأنزيمات واكتشاف أدوية فعالة للأمراض النادرة.

وصرح رئيس الفريق البحثي: "هذه النقلة تمثل تحول تقنيات الكم من مجرد تجارب فيزيائية معملية إلى أداة صناعية وطبية ذات تأثير هائل في حياة البشر".`,
    author: 'Sarah Jenkins',
    source: 'تيك كرانش (TechCrunch)',
    sourceId: 'tech_crunch_global',
    category: 'tech',
    isForeign: true,
    originalLanguage: 'en',
    pubDate: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    link: 'https://techcrunch.com',
    isBreaking: true,
    readTimeMinutes: 4,
    viewsCount: 4210,
    aiSummary: '• ابتكار معالج كمومي عالي الدقة لمحاكاة الجزيئات المعقدة في ثوانٍ.\n• فتح آفاق لتسريع ابتكار الأدوية وتصميم الأنزيمات الطبية.\n• حل مشكلة الأخطاء الكمومية واستقرار المعالجة.',
    aiKeyPoints: [
      'معالج كمومي 1000 كيوبت عالي الاستقرار',
      'محاكاة كيميائية في ثوانٍ تختصر عقوداً من العمل',
      'تطبيقات واعدة في علاج الأمراض وتطوير المواد المتقدمة'
    ]
  },
  {
    id: 'news-2',
    title: 'انطلاق الجولة الحاسمة في دوري أبطال أوروبا وسط حضور جماهيري قياسي وترقب تكتيكي كبير',
    summary: 'مواجهات نارية تجمع عمالقة الكرة الأوروبية في سهرات كروية مشتعلة، والمدربون يضعون آخر اللمسات التكتيكية لحسم بطاقات التأهل إلى المربع الذهبي.',
    fullContent: `تتجه أنظار عشاق الساحرة المستديرة مساء اليوم إلى الملاعب الأوروبية التي تحتضن مواجهات الإياب الحاسمة في ربع نهائي دوري أبطال أوروبا، في ليلة ينتظر أن تشهد إثارة كروية بالغة ومنافسة شرسة على خطف بطاقات التأهل.

وتشهد الملاعب مواجهات من العيار الثقيل بعد نتائج الذهاب المتقاربة التي تركت كل الاحتمالات مفتوحة على مصراعيها. وعكف المدربون خلال التدريبات الأخيرة على معالجة الثغرات الدفاعية وتعزيز الفاعلية الهجومية من خلال الكرات الثابتة والضغط العالي في مناطق المنافس.

وأكد نجوم الفرق جاهزيتهم التامة لخوض هذا التحدي الحاسم وسط حضور جماهيري قياسي متوقع في كافة الملاعب المستضيفة وتغطية إعلامية عالمية غير مسبوقة.`,
    author: 'كريم الشناوي',
    source: 'يلا كورة',
    sourceId: 'yallakora',
    category: 'sports',
    pubDate: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.yallakora.com',
    isBreaking: false,
    readTimeMinutes: 4,
    viewsCount: 3890,
    aiSummary: '• انطلاق مباريات الإياب الحاسمة لربع نهائي دوري أبطال أوروبا.\n• منافسة مفتوحة ومتقاربة بعد نتائج جولة الذهاب.\n• تركيز فني مكثف من المدربين لحسم التأهل.',
    aiKeyPoints: [
      'مواجهات حاسمة لحجز بطاقات نصف النهائي',
      'حضور جماهيري ضخم في مختلف الملاعب',
      'تعديلات تكتيكية مكثفة لتعزيز الكفاءة الهجومية'
    ]
  },
  {
    id: 'news-foreign-2',
    title: 'Global Central Banks Coordinate Policy Framework as Inflation Signals Stabilize Worldwide',
    summary: 'Financial regulators and central bankers agree on unified monetary guidelines to spur sustainable economic growth and navigate digital currency integration.',
    fullContent: `International financial leaders concluded a multilateral monetary policy summit in London today, agreeing on a shared framework to navigate stabilizing global inflation while bolstering supply chain resilience.

The communique highlighted positive trends across major consumer indexes, alongside strategic measures to safeguard credit liquidity for small and medium enterprises. The governors also reviewed shared benchmarks for digital sovereign currencies (CBDCs) and cross-border settlement rails.

Analysts noted that the consensus provides long-awaited clarity to capital markets, with major stock indices responding positively across Asian and European trading desks.`,
    translatedTitle: 'البنوك المركزية الكبرى تنسق سياساتها النقدية لدعم النمو الاقتصادي واستقرار الأسواق المالية',
    translatedSummary: 'صناع السياسات المالية الدولية يتفقون على توجيهات موحدة لتشجيع الاستثمار والتعامل مع التحول الرقمي وتخفيف أعباء التضخم العالمي.',
    translatedFullContent: `اختتم محافظو البنوك المركزية والمؤسسات المالية الدولية قمتهم المشتركة في لندن اليوم، بالاتفاق على إطار عمل متكامل يدعم النمو الاقتصادي المستدام بعد عودة معدلات التضخم إلى مستويات مقبولة.

وأكد البيان الختامي المشترك على استقرار مؤشرات أسعار المستهلكين، وضرورة تيسير الائتمان للشركات المتوسطة والصغيرة مع تسريع اعتماد المعايير الموحدة للمدفوعات الرقمية والعملات المركزية المؤمنة.

ولاقى هذا التنسيق ارتياحاً كبيراً في البورصات وأسواق الأسهم العالمية التي سجلت مكاسب جماعية مدفوعة بوضوح مسار أسعار الفائدة والسيولة الاستثمارية.`,
    author: 'David Miller',
    source: 'رويترز (Reuters)',
    sourceId: 'reuters_global',
    category: 'economy',
    isForeign: true,
    originalLanguage: 'en',
    pubDate: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.reuters.com',
    isBreaking: false,
    readTimeMinutes: 3,
    viewsCount: 2980,
    aiSummary: '• اتفاق البنوك المركزية على مسار نقدي موحد يدعم الاستقرار.\n• تراجع الضغوط التضخمية وتوقعات إيجابية لنمو الأسواق.\n• تسهيل الائتمان التجاري ودمج تقنيات الدفع الحديثة.',
    aiKeyPoints: [
      'تنسيق دولي بين البنوك المركزية الكبرى',
      'استقرار مؤشرات الأسعار والبورصات',
      'تفاؤل استثماري يدعم المشاريع الاقتصادية'
    ]
  },
  {
    id: 'news-4',
    title: 'مشاورات دبلوماسية مكثفة في الأمم المتحدة لتعزيز الاستقرار الإقليمي وفتح الممرات الإنسانية',
    summary: 'انعقاد جلسة طارئة لمجلس الأمن لبحث جهود التهدئة وتسهيل وصول المساعدات الإغاثية إلى المناطق المتضررة، ومطالبات بوقف فوري للتصعيد.',
    fullContent: `تتواصل في مقر الأمم المتحدة بنيويورك جلسات المشاورات والاتصالات الدبلوماسية رفيعة المستوى بهدف صياغة قرار أممي موحد يدعم جهود السلام وفتح ممرات إنسانية آمنة لنقل الإمدادات الغذائية والطبية.

وشدد المندوبون خلال كلماتهم على ضرورة الامتثال الكامل للقوانين الدولية وحماية المدنيين والبنية التحتية الحيوية، مع التأكيد على الدور المحوري للمنظمات الدولية والإغاثية في الميدان.

وأكدت الوفود المشاركة على ضرورة تفعيل آليات الرقابة الميدانية المستقلة وتأمين قوافل الإغاثة الإنسانية العاجلة لضمان وصولها السريع للمتضررين دون عوائق.`,
    author: 'جمال عبد العزيز',
    source: 'الجزيرة نت',
    sourceId: 'aljazeera',
    category: 'politics',
    pubDate: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.aljazeera.net',
    isBreaking: false,
    readTimeMinutes: 3,
    viewsCount: 3150,
    aiSummary: '• مشاورات بمجلس الأمن لدعم جهود التهدئة الدولية.\n• مطالبات ملحة بفتح ممرات إنسانية آمنة وحماية المدنيين.\n• مساعٍ حثيثة لصياغة قرار أممي موحد.',
    aiKeyPoints: [
      'جلسة طارئة بالأمم المتحدة لتعزيز الاستقرار',
      'تأكيد حماية المنشآت الحيوية والمدنيين',
      'تسهيل عمل المنظمات الإغاثية والطبية'
    ]
  },
  {
    id: 'news-5',
    title: 'اكتشاف علمي واعد في مجال العلاج المناعي للأمراض المزمنة بنسبة تحسن 85%',
    summary: 'فريق بحثي طبي يتوصل إلى بروتين طبيعي يحفز خلايا الجسم الدفاعية لمقاومة الالتهابات المزمنة دون أعراض جانبية، ونتائج التجارب السريرية تظهر نجاحاً باهراً.',
    fullContent: `نشرت الدورية الطبية المرموقة اليوم نتائج دراسة علمية رائدة قادها باحثون في علم المناعة والجينات، أظهرت فعالية استثنائية لمركب بيولوجي طبيعي في تنشيط المستقبلات المناعية.

وأوضحت التجارب السريرية للمرحلة الثانية أن العلاج الجديد قادر على خفض معدلات الالتهاب المزمن بنسبة تفوق 85%، مع الحفاظ على توازن الخلايا السليمة وتجنب الآثار الجانبية الشائعة في العلاجات التقليدية.

ويتوقع الخبراء أن يمهد هذا الاكتشاف الطريق لجيل جديد من الأدوية الذكية المستهدفة خلال العامين المقبلين، مما يخفف معاناة الملايين حول العالم.`,
    author: 'د. ليلى الفاسي',
    source: 'سكاي نيوز عربية',
    sourceId: 'skynews_ar',
    category: 'health',
    pubDate: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.skynewsarabia.com',
    isBreaking: false,
    readTimeMinutes: 4,
    viewsCount: 2240,
    aiSummary: '• اكتشاف مركب بيولوجي يحفز المناعة لمقاومة الالتهابات المزمنة.\n• نتائج التجارب السريرية تحقق نسبة استجابة 85% بدون آثار جانبية.\n• أفق واعد لأدوية مناعية ذكية في المستقبل القريب.',
    aiKeyPoints: [
      'تطوير بروتين مناعي ذكي يستهدف الخلايا المتضررة',
      'تحسن بنسبة 85% في نتائج التجارب السريرية',
      'تقليل كبير في الآثار الجانبية مقارنة بالعلاجات التقليدية'
    ]
  },
  {
    id: 'news-6',
    title: 'معرض الفن المعاصر يفتتح دورته الجديدة بمشاركة نخبة من المبدعين والتشكيليين',
    summary: 'تنوع فني بديع يجمع بين الخط العربي الأصيل، الفنون التشكيلية الرقمية، والتجهيزات الفراغية التفاعلية التي تروي قصص الهوية والتراث بأسلوب عصري جذاب.',
    fullContent: `افتتحت في دار الفنون التشكيلية فعاليات بينالي الفن العربي المعاصر بمشاركة أكثر من 150 فناناً وفنانة من مختلف البلدان العربية، مقدمين أكثر من 300 عمل فني مميز.

تتنوع المعروضات بين لوحات زيتية، ومنحوتات رخامية وبرونزية، وأعمال رقمية تعتمد على الواقع المعزز لتجسيد التراث الثقافي العريق بأسلوب بصري حديث.

ويشهد المعرض إقامة ورش عمل تفاعلية وندوات نقدية مفتوحة للجمهور والمهتمين بالصناعات الإبداعية طوال فترة انعقاده.`,
    author: 'نادية بدران',
    source: 'بي بي سي عربي',
    sourceId: 'bbc_ar',
    category: 'culture',
    pubDate: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.bbc.com/arabic',
    isBreaking: false,
    readTimeMinutes: 3,
    viewsCount: 1420,
    aiSummary: '• افتتاح الدورة الجديدة لبينالي الفن العربي المعاصر بمشاركة 150 فناناً.\n• دمج التراث والخط العربي مع التقنيات الرقمية والواقع المعزز.\n• ورش تفاعلية وحوارات ثقافية مثرية لجميع الزوار.',
    aiKeyPoints: [
      'مشاركة واسعة لأكثر من 150 مبدعاً عربياً',
      'دمج الفنون التقليدية مع التقنيات التفاعلية',
      'برنامج ثقافي غني بالورش والندوات النقدية'
    ]
  },
  {
    id: 'news-7',
    title: 'تطورات كبرى في البنية التحتية والمدن الذكية والربط اللوجستي الإقليمي',
    summary: 'تدشين موانئ جافة جديدة وشبكات سكك حديدية فائقة السرعة لربط المراكز الصناعية بالموانئ البحرية وتقليل زمن الشحن بنسبة 60%.',
    fullContent: `أعلنت الهيئات الاقتصادية والتنموية اليوم عن بدء التشغيل التجريبي لمنظومة النقل السككي فائق السرعة والموانئ الجافة الذكية التي تربط المناطق الصناعية الكبرى بالمرافئ البحرية.

تسهم هذه المشاريع الحيوية في تقليص زمن وتكلفة نقل البضائع بنسبة تفوق 60%، مع تقليل البصمة الكربونية لقطاع الشحن عبر الاعتماد على قاطرات كهربائية متطورة تعمل بالطاقة النظيفة.

كما تتضمن المنظومة مراكز لوجستية مؤتمتة بالكامل مزودة بأنظمة التتبع الذكي والفحص الجمركي الفوري عبر الذكاء الاصطناعي.`,
    author: 'سفيان العلمي',
    source: 'هسبريس',
    sourceId: 'hespress',
    category: 'economy',
    pubDate: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.hespress.com',
    isBreaking: false,
    readTimeMinutes: 3,
    viewsCount: 2610,
    aiSummary: '• إطلاق منظومة النقل اللوجستي الذكي وسكك الحديد السريعة.\n• خفض تكلفة وزمن الشحن بنسبة 60% مع استخدام الطاقة النظيفة.\n• مراكز لوجستية مؤتمتة بالكامل مدعومة بالذكاء الاصطناعي.',
    aiKeyPoints: [
      'ربط المناطق الصناعية بالموانئ البحرية بكفاءة عالية',
      'تقليل البصمة الكربونية لقطاع النقل والشحن',
      'أتمتة الفحص الجمركي والتتبع اللوجستي'
    ]
  },
  {
    id: 'news-8',
    title: 'إنجازات لافتة في سباقات ألعاب القوى والسباحة الدولية وتتويج بميداليات ذهبية جديدة',
    summary: 'أبطال وبطلات العرب يرفعون الراية عالياً في بطولة العالم محققين أرقاماً قياسية جديدة وسط إشادات واسعة بالانضباط والتفوق الرياضي.',
    fullContent: `حقق أبطال الرياضة العربية إنجازاً تاريخياً مشرفاً في بطولة ألعاب القوى والسباحة الدولية المقامة حالياً، بعد حصد ثلاث ميداليات ذهبية وفضية في سباقات المسافات المتوسطة والسباحة الحرة.

وسجل الرياضيون أرقاماً قياسية غير مسبوقة على الصعيد الإقليمي والدولي، مؤكدين تطور البرامج التدريبية المتقدمة والإعداد البدني والنفسي الفائق الذي سبق خوض غمار البطولة.

وأشادت اللجان الأولمبية الدولية بالمستوى الفني المتقدم الذي أظهره المتنافسون، والروح الرياضية العالية التي عكست التطور المتسارع للرياضة في المنطقة.`,
    author: 'سعيد العتيبي',
    source: 'العربية',
    sourceId: 'alarabiya',
    category: 'sports',
    pubDate: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.alarabiya.net',
    isBreaking: true,
    readTimeMinutes: 3,
    viewsCount: 4520,
    aiSummary: '• إنجاز عربي رياضي بحصد ميداليات ذهبية في بطولة العالم.\n• تسجيل أرقام قياسية جديدة في ألعاب القوى والسباحة.\n• إشادة دولية بالمستوى الفني والإعداد البدني المتميز.',
    aiKeyPoints: [
      'ثلاث ميداليات ذهبية وفضية للأبطال العرب',
      'أرقام قياسية إقليمية ودولية جديدة',
      'استعدادات متقدمة تؤتي ثمارها في البطولات العالمية'
    ]
  }
];
