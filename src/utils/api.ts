// API Utility for Web and Android Capacitor

// Remote live backend URL (Cloud Run deployment)
const REMOTE_BACKEND_URL = 'https://ais-pre-pjxq3hugpjuplygf7vje6o-833271402120.europe-west2.run.app';

export function getApiBaseUrl(): string {
  // If running inside Capacitor Native Webview (https://localhost or capacitor://)
  if (typeof window !== 'undefined') {
    const isCapacitor = window.location.protocol === 'capacitor:' || 
      window.location.hostname === 'localhost' || 
      (window as any).Capacitor?.isNativePlatform?.();

    if (isCapacitor && !window.location.port) {
      return REMOTE_BACKEND_URL;
    }
  }

  return '';
}

export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  if (!endpoint.startsWith('/')) endpoint = `/${endpoint}`;
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
}

export async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeout = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const merged = { ...init, signal: controller.signal } as RequestInit;
    const res = await fetch(input, merged);
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
}
