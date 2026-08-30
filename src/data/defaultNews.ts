import { NewsArticle, NewsCategory, NewsSource } from '../types';

export const DEFAULT_CATEGORIES: NewsCategory[] = [
  { id: 'all', name: 'الكل', nameAr: 'جميع الأخبار والمناطق', nameEn: 'All Locations & News', icon: 'Globe2' },
  { id: 'palestine', name: 'فلسطين والقدس', nameAr: 'فلسطين والقدس', nameEn: 'Palestine & Jerusalem', icon: 'MapPin', badgeColor: 'bg-emerald-600' },
  { id: 'gulf', name: 'الخليج العربي', nameAr: 'الخليج العربي واليمن', nameEn: 'Arabian Gulf & Yemen', icon: 'Compass', badgeColor: 'bg-amber-600' },
  { id: 'egypt_levant', name: 'مصر والشام', nameAr: 'مصر وبلاد الشام والعراق', nameEn: 'Egypt & Levant', icon: 'Landmark', badgeColor: 'bg-sky-600' },
  { id: 'maghreb', name: 'المغرب العربي', nameAr: 'المغرب العربي وشمال إفريقيا', nameEn: 'Maghreb & North Africa', icon: 'Flame', badgeColor: 'bg-rose-600' },
  { id: 'middle_east', name: 'الشرق الأوسط', nameAr: 'الشرق الأوسط والعالم العربي', nameEn: 'Middle East', icon: 'Layers', badgeColor: 'bg-indigo-600' },
  { id: 'world', name: 'دولي وعالمي', nameAr: 'أخبار العالم وأوروبا والأمريكتين', nameEn: 'International & Global', icon: 'Globe', badgeColor: 'bg-blue-600' },
  { id: 'asia_world', name: 'آسيا والعالم', nameAr: 'آسيا وباقي العالم', nameEn: 'Asia & World', icon: 'Cpu', badgeColor: 'bg-teal-600' },
];

export const DEFAULT_SOURCES: NewsSource[] = [
  {
    id: 'aljazeera',
    name: 'الجزيرة نت',
    nameEn: 'Al Jazeera',
    url: 'https://www.aljazeera.net',
    rssUrl: 'https://news.google.com/rss/search?q=site:aljazeera.net&hl=ar&gl=SA&ceid=SA:ar',
    category: 'middle_east',
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
    category: 'gulf',
    iconName: 'Newspaper',
    enabled: true,
    isCustom: false,
    country: 'السعودية / الخليج',
    color: '#7b1113'
  },
  {
    id: 'palestine_today',
    name: 'القدس الإخبارية',
    nameEn: 'Al Quds News',
    url: 'https://qudsn.co',
    rssUrl: 'https://news.google.com/rss/search?q=فلسطين+القدس+غزة&hl=ar&gl=SA&ceid=SA:ar',
    category: 'palestine',
    iconName: 'Flame',
    enabled: true,
    isCustom: false,
    country: 'فلسطين والقدس',
    color: '#15803d'
  },
  {
    id: 'skynews_ar',
    name: 'سكاي نيوز عربية',
    nameEn: 'Sky News Arabia',
    url: 'https://www.skynewsarabia.com',
    rssUrl: 'https://www.skynewsarabia.com/rss.xml',
    category: 'gulf',
    iconName: 'Flame',
    enabled: true,
    isCustom: false,
    country: 'الإمارات / الخليج',
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
    country: 'دولي / بريطانيا',
    color: '#bb1919'
  },
  {
    id: 'hespress',
    name: 'هسبريس',
    nameEn: 'Hespress',
    url: 'https://www.hespress.com',
    rssUrl: 'https://www.hespress.com/feed',
    category: 'maghreb',
    iconName: 'Newspaper',
    enabled: true,
    isCustom: false,
    country: 'المغرب العربي / المغرب',
    color: '#3a0ca3'
  },
  {
    id: 'almasry_alyoum',
    name: 'المصري اليوم',
    nameEn: 'Al Masry Al Youm',
    url: 'https://www.almasryalyoum.com',
    rssUrl: 'https://news.google.com/rss/search?q=مصر+القاهرة&hl=ar&gl=EG&ceid=EG:ar',
    category: 'egypt_levant',
    iconName: 'Newspaper',
    enabled: true,
    isCustom: false,
    country: 'مصر وبلاد الشام / مصر',
    color: '#1e3a8a'
  },
  {
    id: 'dw_arabic',
    name: 'DW عربية (ألمانيا)',
    nameEn: 'Deutsche Welle Arabic',
    url: 'https://www.dw.com/ar',
    rssUrl: 'https://rss.dw.com/rdf/rss-ar-all',
    category: 'world',
    iconName: 'Globe',
    enabled: true,
    isCustom: false,
    country: 'دولي / ألمانيا',
    color: '#0284c7'
  },
  {
    id: 'france24_ar',
    name: 'فرانس 24 عربي',
    nameEn: 'France 24 Arabic',
    url: 'https://www.france24.com/ar',
    rssUrl: 'https://www.france24.com/ar/rss',
    category: 'world',
    iconName: 'Tv',
    enabled: true,
    isCustom: false,
    country: 'دولي / فرنسا',
    color: '#0891b2'
  },
  {
    id: 'asharq_news',
    name: 'الشرق للأخبار',
    nameEn: 'Asharq News',
    url: 'https://asharq.com',
    rssUrl: 'https://news.google.com/rss/search?q=site:asharq.com&hl=ar&gl=SA&ceid=SA:ar',
    category: 'gulf',
    iconName: 'TrendingUp',
    enabled: true,
    isCustom: false,
    country: 'الشرق الأوسط والخليج',
    color: '#1d3557'
  },
  {
    id: 'reuters_global',
    name: 'رويترز (Reuters)',
    nameEn: 'Reuters Global',
    url: 'https://www.reuters.com',
    rssUrl: 'https://news.google.com/rss/search?q=Reuters+breaking+news&hl=en-US&gl=US&ceid=US:en',
    category: 'world',
    iconName: 'Globe',
    enabled: true,
    isCustom: false,
    country: 'وكالة أنباء دولية',
    color: '#ff8000',
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
  }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'news-palestine-1',
    title: 'تطورات ميدانية واسعة في القدس والضفة وجهود إغاثية مكثفة لإعادة تأهيل البنية التحتية والمستشفيات',
    summary: 'وفود إنسانية دولية تصل لمتابعة تنفيذ خطط الاستجابة الإغاثية العاجلة وتوزيع المستلزمات الطبية والوقود على المنشآت الحيوية في القدس ومحافظات الضفة وغزة.',
    fullContent: `تتواصل في القدس والضفة الغربية والقطاع التحركات الإنسانية الحثيثة لدعم العائلات المتضررة وتأهيل خطوط المياه والكهرباء بالمراكز الطبية الحيوية، بإشراف المنظمات الإغاثية المشتركة.

وأكدت الهيئات الميدانية وصول شحنات جديدة من الأدوية والمولدات الكهربائية لتأمين استمرار العمل في غرف العمليات والطوارئ، مع توفير نقاط طبية متنقلة في مختلف الأحياء.

وشددت اللجان الميدانية على أهمية تضافر الجهود العربية والدولية لضمان التدفق المستمر للإمدادات الأساسية وتأمين المأوى العاجل للمتضررين دون انقطاع.`,
    author: 'أحمد شاهين',
    source: 'القدس الإخبارية',
    sourceId: 'palestine_today',
    category: 'palestine',
    pubDate: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    link: 'https://qudsn.co',
    isBreaking: true,
    readTimeMinutes: 3,
    viewsCount: 3820,
    aiSummary: '• تحركات إغاثية مكثفة لتأهيل المرافق الطبية والشبكات الأساسية.\n• وصول شحنات عاجلة من الوقود والمستلزمات الحيوية للمستشفيات.\n• مطالبات بتأمين ممرات دائمة للمساعدات الإنسانية.',
    aiKeyPoints: [
      'وصول مستلزمات طبية وأدوية لغرف الطوارئ',
      'تأهيل شبكات المياه والكهرباء في المناطق المتضررة',
      'إشراف مباشر من الفرق الإغاثية الميدانية'
    ]
  },
  {
    id: 'news-gulf-1',
    title: 'الخليج يطلق أضخم مجمع إقليمي للهيدروجين الأخضر ومشاريع الطاقة المتجددة باستثمارات 85 مليار دولار',
    summary: 'تدشين تحالف خليجي صناعي مشترك لتصدير الطاقة النظيفة وتطوير شبكات الربط الكهربائي الذكية بين دول مجلس التعاون والأسواق العالمية.',
    fullContent: `أعلنت دول مجلس التعاون الخليجي اليوم عن إطلاق مشروع استراتيجي مشترك لتطوير وتصدير الهيدروجين الأخضر ومزارع الطاقة الشمسية الكبرى باستثمارات أولية تبلغ 85 مليار دولار.

ويهدف المشروع إلى ترسيخ مكانة الخليج كمركز عالمي رائد للطاقة المستدامة والتقنيات البيئية الخالية من الانبعاثات، مع تأسيس مراكز أبحاث متخصصة في تقنيات تخزين الطاقة وتدوير الكربون.

وأوضح وزراء الطاقة المشاركون أن هذا التعاون يعكس الرؤية التنموية الحديثة لدول المنطقة نحو تنويع مصادر الاقتصاد وجذب رؤوس الأموال التقنية المتقدمة.`,
    author: 'سعود الفهد',
    source: 'العربية',
    sourceId: 'alarabiya',
    category: 'gulf',
    pubDate: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.alarabiya.net',
    isBreaking: true,
    readTimeMinutes: 4,
    viewsCount: 4120,
    aiSummary: '• استثمار 85 مليار دولار في إنتاج وتصدير الهيدروجين الأخضر.\n• تعزيز الربط الكهربائي الإقليمي وتطوير تقنيات الطاقة المستدامة.\n• ترسيخ مكانة الخليج العربي كمركز عالمي للطاقة النظيفة.',
    aiKeyPoints: [
      'تحالف صناعي خليجي مشترك للطاقة النظيفة',
      'بناء مزارع شمسية ومراكز بحثية للطاقة المستقبلية',
      'خفض البصمة الكربونية وتوطين الصناعات المتقدمة'
    ]
  },
  {
    id: 'news-egypt-1',
    title: 'مصر وبلاد الشام تدشن شبكة الموانئ الجافة وقطارات الشحن السريعة لتعزيز التجارة البينية',
    summary: 'بدء التشغيل التجريبي للربط اللوجستي السككي بين المراكز الصناعية والموانئ البحرية المطلة على البحر المتوسط والأحمر لتقليص زمن النقل بنسبة 65%.',
    fullContent: `أعلنت وزارات النقل والتجارة في مصر وبلاد الشام عن تدشين أولى مراحل الممر اللوجستي المتكامل الذي يربط شبكات السكك الحديدية السريعة بالموانئ الجافة والمناطق الصناعية الكبرى.

تسهم المنظومة الجديدة في تسريع تدفق الصادرات والواردات، وخفض تكاليف سلاسل الإمداد بنسبة تفوق 65%، إلى جانب تقليل الانبعاثات عبر اعتماد القاطرات الكهربائية الحديثة.

كما تم ربط المراكز الجمركية بأنظمة فحص وتخليص رقمية مؤتمتة تعمل بالذكاء الاصطناعي لتسهيل حركة البضائع وتنشيط التبادل التجاري الإقليمي.`,
    author: 'محمود عبد الرازق',
    source: 'المصري اليوم',
    sourceId: 'almasry_alyoum',
    category: 'egypt_levant',
    pubDate: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.almasryalyoum.com',
    isBreaking: false,
    readTimeMinutes: 3,
    viewsCount: 2740,
    aiSummary: '• تدشين شبكة لوجستية وسككية متطورة تربط الموانئ بالمراكز الصناعية.\n• خفض زمن الشحن وتكاليف سلاسل الإمداد بنسبة 65%.\n• أتمتة الإجراءات الجمركية لتعزيز التجارة البينية.',
    aiKeyPoints: [
      'ربط الموانئ البحرية بالمناطق الصناعية عبر شبكة قطارات كهربائية',
      'تقليص ملحوظ في تكاليف الشحن وزمن الترانزيت',
      'تطبيق الرقمنة الشاملة لتسريع الإفراج الجمركي'
    ]
  },
  {
    id: 'news-maghreb-1',
    title: 'المغرب العربي وشمال إفريقيا: مشاريع كبرى في البنية التحتية والربط القاري وتصنيع السيارات والبطاريات',
    summary: 'توسع صناعي هائل في المنطقة مع افتتاح مصانع متقدمة للسيارات الكهربائية ومجمعات للطاقة الشمسية تربط بين المغرب وتونس وشمال القارة الإفريقية.',
    fullContent: `تشهد بلدان المغرب العربي وشمال إفريقيا حراكاً اقتصادياً واستثمارياً غير مسبوق بعد استقطاب كبرى الشركات العالمية لإنشاء مصانع لبطاريات السيارات الكهربائية ومكونات الطيران.

وتتضمن الخطط التنموية تعزيز شبكات الطرق السريعة والموانئ المحورية في طنجة المتوسط والدار البيضاء وتونس، لرفع القدرة الاستيعابية لحركة الملاحة والتجارة الدولية مع أوروبا وإفريقيا.

وأكدت التقارير الاقتصادية أن هذه الاستثمارات توفر آلاف فرص العمل للكوادر الهندسية والتقنية الشابة وتدعم مكانة المنطقة كبوابة تجارية عالمية.`,
    author: 'سفيان العلمي',
    source: 'هسبريس',
    sourceId: 'hespress',
    category: 'maghreb',
    pubDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.hespress.com',
    isBreaking: false,
    readTimeMinutes: 4,
    viewsCount: 3120,
    aiSummary: '• طفرة صناعية في المغرب وشمال إفريقيا في مجال تصنيع السيارات والطاقات النظيفة.\n• توسعة الموانئ وشبكات الربط القاري مع الأسواق الأوروبية والإفريقية.\n• توفير آلاف الوظائف النوعية للشباب والمهندسين.',
    aiKeyPoints: [
      'افتتاح مصانع متقدمة لبطاريات ومكونات النقل الكهربائي',
      'تطوير البنية التحتية لموانئ طنجة والمراكز اللوجستية',
      'تعزيز مكانة المنطقة كمحور تجاري واستثماري قاري'
    ]
  },
  {
    id: 'news-world-1',
    title: 'قمة دولية في جنيف لبحث الاستقرار المالي وتنسيق السياسات النقدية لدعم النمو العالمي',
    summary: 'محافظو البنوك المركزية والمؤسسات المالية الدولية يتفقون على خطة عمل موحدة لضمان استقرار سلاسل التوريد والحد من التضخم العالمي.',
    fullContent: `اختتمت في جنيف اليوم أعمال القمة المالية الدولية بمشاركة قادة البنوك المركزية وممثلي المؤسسات النقدية الكبرى، حيث تم الاتفاق على حزمة إجراءات منسقة لدعم السيولة الاستثمارية.

وأكد البيان الختامي على تحسن المؤشرات الاقتصادية العامة واستقرار أسواق الصرف، مع دعوة لتسهيل الائتمان للمؤسسات الصغيرة ودعم التحول نحو العملات الرقمية المؤمنة.

ولاقى هذا التنسيق ترحيباً واسعاً في الأسواق المالية العالمية التي سجلت مؤشراتها الرئيسية مكاسب ملحوظة في أسواق آسيا وأوروبا.`,
    author: 'David Miller',
    source: 'رويترز (Reuters)',
    sourceId: 'reuters_global',
    category: 'world',
    isForeign: true,
    originalLanguage: 'en',
    translatedTitle: 'قمة دولية في جنيف لبحث الاستقرار المالي وتنسيق السياسات النقدية لدعم النمو العالمي',
    translatedSummary: 'محافظو البنوك المركزية والمؤسسات المالية الدولية يتفقون على خطة عمل موحدة لضمان استقرار سلاسل التوريد والحد من التضخم العالمي.',
    translatedFullContent: `اختتمت في جنيف اليوم أعمال القمة المالية الدولية بمشاركة قادة البنوك المركزية وممثلي المؤسسات النقدية الكبرى، حيث تم الاتفاق على حزمة إجراءات منسقة لدعم السيولة الاستثمارية.

وأكد البيان الختامي على تحسن المؤشرات الاقتصادية العامة واستقرار أسواق الصرف، مع دعوة لتسهيل الائتمان للمؤسسات الصغيرة ودعم التحول نحو العملات الرقمية المؤمنة.

ولاقى هذا التنسيق ترحيباً واسعاً في الأسواق المالية العالمية التي سجلت مؤشراتها الرئيسية مكاسب ملحوظة في أسواق آسيا وأوروبا.`,
    pubDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.reuters.com',
    isBreaking: false,
    readTimeMinutes: 3,
    viewsCount: 2890,
    aiSummary: '• اتفاق دولي على تنسيق السياسات النقدية وحماية استقرار الأسواق.\n• استقرار مؤشرات التضخم وتفاؤل بنمو الاقتصاد العالمي.\n• دعم الائتمان التجاري وتبني المعايير الرقمية الحديثة.',
    aiKeyPoints: [
      'تنسيق مشترك بين البنوك المركزية والمؤسسات النقدية',
      'ارتفاع مؤشرات الأسواق المالية العالمية عقب الإعلان',
      'تسهيلات للمؤسسات الصغيرة والتحول الرقمي'
    ]
  },
  {
    id: 'news-asia-1',
    title: 'طوكيو وسيول تعلنان ابتكار معالج كمومي ضوئي فائق الكفاءة لمعالجة البيانات المعقدة',
    summary: 'فريق بحثي آسيوي مشترك ينجح في تشغيل أول معالج كمومي ضوئي قادر على إجراء تريليونات العمليات الحسابية في ثوانٍ معدودة باستهلاك طاقة منخفض.',
    fullContent: `كشفت مراكز الأبحاث المتقدمة في طوكيو وسيول عن تطوير معالج حوسبة كمومية ضوئية ثوري يتفوق على أسرع الحواسيب الفائقة بمعدل ألف ضعف في معالجة خوارزميات الذكاء الاصطناعي والتشفير.

ويعتمد المعالج الجديد على الفوتونات الضوئية بدلاً من الإلكترونات التقليدية، مما يقلل الانبعاثات الحرارية ويسمح بتشغيله في درجات الحرارة العادية دون الحاجة لأنظمة تبريد فائق معقدة.

ويفتح هذا التطور آفاقاً واعدة لتسريع اكتشاف المواد المتقدمة وتطوير نماذج محاكاة المناخ وتصميم الأدوية الجينية بدقة متناهية.`,
    author: 'Kenji Tanaka',
    source: 'بي بي سي عربي',
    sourceId: 'bbc_ar',
    category: 'asia_world',
    pubDate: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    link: 'https://www.bbc.com/arabic',
    isBreaking: false,
    readTimeMinutes: 4,
    viewsCount: 3450,
    aiSummary: '• ابتكار معالج كمومي ضوئي فائق السرعة يعمل في درجات الحرارة العادية.\n• قدرة على معالجة البيانات المعقدة وخوارزميات الذكاء الاصطناعي بكفاءة قصوى.\n• تطبيقات واعدة في علوم المواد والتنبؤ بالمناخ والأبحاث الجينية.',
    aiKeyPoints: [
      'معالجة ضوئية تقلل استهلاك الطاقة وتلغي الحاجة للتبريد المعقد',
      'سرعة فائقة تتجاوز الحواسيب التقليدية بآلاف المرات',
      'تعاون علمي وبحثي مشترك بين كبرى الجامعات الآسيوية'
    ]
  }
];
