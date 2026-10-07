import { GoogleFont, ParsedVariant, VariableAxis } from '../types/font';
import { BUILTIN_GOOGLE_FONTS } from '../data/googleFontsData';

const WEIGHT_NAMES: Record<number, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

const STORAGE_KEY_FAVORITES = 'gfonts_favorites_v1';
const STORAGE_KEY_API_KEY = 'gfonts_custom_api_key_v1';
const STORAGE_KEY_CACHE = 'gfonts_api_cache_data_v2';
const STORAGE_KEY_CACHE_TIME = 'gfonts_api_cache_time_v2';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function parseVariant(raw: string): ParsedVariant {
  const isItalic = raw.includes('italic');
  let weight = 400;

  if (raw === 'regular') {
    weight = 400;
  } else if (raw === 'italic') {
    weight = 400;
  } else {
    const num = parseInt(raw.replace('italic', ''), 10);
    if (!isNaN(num) && num >= 100 && num <= 900) {
      weight = num;
    }
  }

  const weightName = WEIGHT_NAMES[weight] || `Weight ${weight}`;
  const label = isItalic
    ? (weight === 400 ? `Italic 400` : `${weightName} Italic ${weight}`)
    : `${weightName} ${weight}`;

  return {
    raw,
    weight,
    weightName,
    isItalic,
    label,
  };
}

export function getSortedVariants(variants: string[]): ParsedVariant[] {
  const parsed = variants.map(parseVariant);
  return parsed.sort((a, b) => {
    if (a.weight !== b.weight) {
      return a.weight - b.weight;
    }
    return a.isItalic ? 1 : -1;
  });
}

/**
 * Builds the Google Fonts CSS2 URL for a given font family and its supported variants.
 */
export function buildGoogleFontUrl(font: GoogleFont): string {
  const familyEncoded = encodeURIComponent(font.family).replace(/%20/g, '+');

  if (font.isVariable && font.axes?.length) {
    const hasItalic = font.variants.some((v) => v.includes('italic'));
    const hasNormal = font.variants.some((v) => !v.includes('italic'));
    const axes = font.axes.filter((a) => a.tag !== 'ital').map((a) => ({
      tag: a.tag, value: a.min === a.max ? String(a.min) : `${a.min}..${a.max}`,
    }));
    if (hasItalic) axes.push({ tag: 'ital', value: '0' });
    axes.sort((a, b) => a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0);
    const styles = hasItalic ? (hasNormal ? [0, 1] : [1]) : [0];
    const tuples = styles.map((style) => axes.map((axis) => axis.tag === 'ital' ? style : axis.value).join(','));
    return `https://fonts.googleapis.com/css2?family=${familyEncoded}:${axes.map((a) => a.tag).join(',')}@${tuples.join(';')}&display=swap`;
  }

  // Non-variable or discrete variant list
  const normalWeights: number[] = [];
  const italicWeights: number[] = [];

  for (const v of font.variants) {
    const parsed = parseVariant(v);
    if (parsed.isItalic) {
      if (!italicWeights.includes(parsed.weight)) italicWeights.push(parsed.weight);
    } else {
      if (!normalWeights.includes(parsed.weight)) normalWeights.push(parsed.weight);
    }
  }

  normalWeights.sort((a, b) => a - b);
  italicWeights.sort((a, b) => a - b);

  if (italicWeights.length > 0 && normalWeights.length > 0) {
    const tuples: string[] = [];
    normalWeights.forEach((w) => tuples.push(`0,${w}`));
    italicWeights.forEach((w) => tuples.push(`1,${w}`));
    return `https://fonts.googleapis.com/css2?family=${familyEncoded}:ital,wght@${tuples.join(';')}&display=swap`;
  } else if (italicWeights.length > 0) {
    return `https://fonts.googleapis.com/css2?family=${familyEncoded}:ital,wght@${italicWeights.map((w) => `1,${w}`).join(';')}&display=swap`;
  } else if (normalWeights.length > 0) {
    return `https://fonts.googleapis.com/css2?family=${familyEncoded}:wght@${normalWeights.join(';')}&display=swap`;
  }

  return `https://fonts.googleapis.com/css2?family=${familyEncoded}&display=swap`;
}

// Share in-flight requests; a failed request is removed so Retry makes a new request.
const fontLoads = new Map<string, Promise<boolean>>();

export function loadGoogleFont(font: GoogleFont): Promise<boolean> {
  const url = buildGoogleFontUrl(font);
  const pending = fontLoads.get(url);
  if (pending) return pending;
  const promise = new Promise<boolean>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    let settled = false;
    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      link.onload = null;
      link.onerror = null;
      if (!success) {
        link.remove();
        fontLoads.delete(url);
      }
      resolve(success);
    };
    const timer = setTimeout(() => finish(false), 15000);
    link.onerror = () => finish(false);
    link.onload = async () => {
      try {
        const variant = getSortedVariants(font.variants)[0];
        const faces = await document.fonts.load(`${variant?.isItalic ? 'italic ' : ''}${variant?.weight || 400} 16px "${font.family}"`);
        finish(faces.length > 0);
      } catch {
        finish(false);
      }
    };
    document.head.appendChild(link);
  });
  fontLoads.set(url, promise);
  return promise;
}

/**
 * Fetch Google Fonts list with fallback to comprehensive built-in catalog
 */
export async function getGoogleFontsCatalog(apiKeyOverride?: string): Promise<{
  fonts: GoogleFont[];
  source: 'api' | 'cache' | 'builtin';
}> {
  const storedKey = localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  const apiKey = (apiKeyOverride !== undefined ? apiKeyOverride : storedKey) || (import.meta.env.VITE_GOOGLE_FONTS_API_KEY as string) || '';

  // Check cache first if we have a key
  if (apiKey) {
    const cachedTime = Number(localStorage.getItem(STORAGE_KEY_CACHE_TIME) || 0);
    const cachedData = localStorage.getItem(STORAGE_KEY_CACHE);

    if (cachedData && Date.now() - cachedTime < CACHE_DURATION_MS) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { fonts: parsed, source: 'cache' };
        }
      } catch (e) {
        console.warn('Failed to parse cached Google Fonts data', e);
      }
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(apiKey)}&sort=popularity`
      );

      if (response.ok) {
        const json = await response.json();
        // Keep static variants for weight pills and enrich with variable metadata.
        const vfResponse = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(apiKey)}&capability=VF&sort=popularity`);
        if (!vfResponse.ok) throw new Error('Variable metadata request failed');
        const vfJson = await vfResponse.json();
        const variableItems = new Map<string, any>((vfJson.items || []).map((item: any) => [item.family, item]));
        if (json.items && Array.isArray(json.items)) {
          const apiFonts: GoogleFont[] = json.items.map((item: any, index: number) => {
            const axes: VariableAxis[] = [];
            item = { ...item, axes: variableItems.get(item.family)?.axes };
            const isVariable = Boolean(item.axes && item.axes.length > 0);

            if (item.axes && Array.isArray(item.axes)) {
              item.axes.forEach((ax: any) => {
                axes.push({
                  tag: ax.tag,
                  name: ax.tag === 'wght' ? 'Weight' : ax.tag === 'wdth' ? 'Width' : ax.tag === 'slnt' ? 'Slant' : ax.tag === 'opsz' ? 'Optical Size' : ax.tag,
                  min: ax.start,
                  max: ax.end,
                  default: Math.min(ax.end, Math.max(ax.start, ax.tag === 'wght' ? 400 : ax.tag === 'wdth' ? 100 : ax.tag === 'opsz' ? 14 : 0)),
                  step: (ax.end - ax.start) < 10 ? 0.01 : 1,
                });
              });
            }

            return {
              family: item.family,
              category: (item.category as GoogleFont['category']) || 'sans-serif',
              variants: item.variants || ['regular'],
              subsets: item.subsets || ['latin'],
              version: item.version,
              lastModified: item.lastModified,
              isVariable,
              axes: axes.length > 0 ? axes : undefined,
              popularityRank: index + 1,
              designer: item.designer || undefined,
            };
          });

          // Cache parsed data
          try {
            localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(apiFonts));
            localStorage.setItem(STORAGE_KEY_CACHE_TIME, String(Date.now()));
          } catch (storageErr) {
            console.warn('Local storage quota exceeded for font cache', storageErr);
          }

          return { fonts: apiFonts, source: 'api' };
        }
      }
    } catch (err) {
      console.warn('Could not fetch from live Google Fonts API, using built-in catalog', err);
    }
  }

  return { fonts: BUILTIN_GOOGLE_FONTS, source: 'builtin' };
}

/**
 * Favorites persistence in localStorage
 */
export function getSavedFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleSavedFavorite(family: string): string[] {
  const current = getSavedFavorites();
  const exists = current.includes(family);
  const updated = exists ? current.filter((f) => f !== family) : [...current, family];
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save favorites to localStorage', err);
  }
  return updated;
}

/**
 * Custom API key persistence
 */
export function getStoredApiKey(): string {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.removeItem(STORAGE_KEY_CACHE);
  localStorage.removeItem(STORAGE_KEY_CACHE_TIME);
  if (key) {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
    localStorage.removeItem(STORAGE_KEY_CACHE);
    localStorage.removeItem(STORAGE_KEY_CACHE_TIME);
  }
}

