import React, { useState, useCallback } from 'react';
import { NewsSource, NewsArticle } from '../types';
import { fetchWithTimeout, getApiUrl } from '../utils/api';
import { normalizeItem } from '../utils/rssUtils';

export async function validateAndFetchSourceRss(rssUrl: string, src: Omit<NewsSource, 'id'>, timeout = 15000, retries = 1): Promise<{ success: boolean; articles: NewsArticle[]; error?: string }> {
  let attempts = 0;
  while (attempts <= retries) {
    attempts++;
    try {
      const res = await fetchWithTimeout(getApiUrl('/api/rss'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rssUrl }),
      }, timeout);

      if (!res.ok) {
        const body = await res.text();
        return { success: false, articles: [], error: `HTTP ${res.status} ${body}` };
      }

      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        return { success: false, articles: [], error: 'Empty feed or invalid RSS' };
      }

      const normalized = data.items.map((it: any, idx: number) => normalizeItem(it, src as NewsSource, idx));
      return { success: true, articles: normalized };
    } catch (err: any) {
      if (attempts > retries) {
        return { success: false, articles: [], error: err?.message || String(err) };
      }
      // backoff small delay
      await new Promise(r => setTimeout(r, 500 * attempts));
    }
  }
  return { success: false, articles: [], error: 'Unknown error' };
}
