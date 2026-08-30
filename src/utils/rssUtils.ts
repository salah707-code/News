// RSS helpers: normalization, deduplication, canonicalization
import { NewsArticle, NewsSource } from '../types';

const TRACKING_PARAMS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','mc_cid','mc_eid'];

export function stripTrackingParams(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    TRACKING_PARAMS.forEach(p => u.searchParams.delete(p));
    // remove empty search
    if (![...u.searchParams].length) u.search = '';
    return u.toString();
  } catch (e) {
    return rawUrl;
  }
}

export function chooseBestId(item: any, src: NewsSource, idx: number): string {
  const link = item.link || item.guid || item.isoDate || src.url || `source-${src.id}`;
  const canonical = stripTrackingParams(String(link || ''));
  if (item.id) return String(item.id);
  if (item.guid) return String(item.guid);
  if (canonical) return `${src.id}::${canonical}`;
  return `${src.id}::${idx}::${Date.now()}`;
}

export function normalizeItem(raw: any, src: NewsSource, idx: number): NewsArticle {
  const link = raw.link || raw.guid || src.url || '';
  const canonicalLink = stripTrackingParams(link || '');
  const pub = raw.pubDate || raw.published || raw.isoDate || raw.updated || new Date().toISOString();

  // best image extraction
  let imageUrl = '';
  try {
    if (raw.enclosure && raw.enclosure.url) imageUrl = raw.enclosure.url;
    else if (raw['media:content'] && raw['media:content'].$?.url) imageUrl = raw['media:content'].$.url;
    else if (raw.mediaContent && Array.isArray(raw.mediaContent) && raw.mediaContent[0]?.$?.url) imageUrl = raw.mediaContent[0].$.url;
    else if (raw.mediaThumbnail && Array.isArray(raw.mediaThumbnail) && raw.mediaThumbnail[0]?.$?.url) imageUrl = raw.mediaThumbnail[0].$.url;
    else if (raw.image) imageUrl = raw.image;
    else if (raw['media:thumbnail'] && raw['media:thumbnail'].$?.url) imageUrl = raw['media:thumbnail'].$.url;
  } catch (e) {}

  // try to extract img from content
  if (!imageUrl) {
    const pool = String(raw.content || raw.contentEncoded || raw.description || raw.summary || '');
    const unescaped = pool.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '\"');
    const m = unescaped.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m && m[1]) imageUrl = m[1];
  }

  const id = chooseBestId(raw, src, idx);

  const title = raw.title || raw['dc:title'] || 'بدون عنوان';
  const summaryRaw = raw.contentSnippet || raw.summary || raw.description || '';
  const summary = String(summaryRaw).replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();

  const article: NewsArticle = {
    id: id,
    title: title,
    summary: summary,
    fullContent: raw.content || raw.contentEncoded || summary,
    author: raw.creator || raw.author || src.name || 'محرر الأخبار',
    source: src.name,
    sourceId: src.id,
    category: src.category === 'all' ? 'world' : src.category,
    pubDate: new Date(pub).toISOString(),
    imageUrl: imageUrl || '',
    link: canonicalLink || link || src.url || '',
    isBreaking: Boolean(raw.isBreaking) || false,
    readTimeMinutes: raw.readTimeMinutes || 3,
    viewsCount: raw.viewsCount || 0,
    isForeign: src.isForeign || false,
  };

  return article;
}

export function dedupeArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const out: NewsArticle[] = [];
  for (const a of articles) {
    // canonicalize link for keys
    const canonicalLink = a.link ? stripTrackingParams(a.link) : '';
    const titleKey = a.title ? a.title.trim().toLowerCase() : '';
    const keyCandidates = [a.id || '', canonicalLink || '', `${titleKey}::${a.sourceId}`].filter(Boolean);
    let found = false;
    for (const k of keyCandidates) {
      const kk = k.toString();
      if (seen.has(kk)) { found = true; break; }
    }
    if (!found) {
      // add all keys to seen for robust dedup
      for (const k of keyCandidates) {
        seen.add(k.toString());
      }
      out.push(a);
    }
  }
  return out;
}
