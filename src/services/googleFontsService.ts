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
const STORAGE_KEY_CACHE = 'gfonts_api_cache_data_v1';
const STORAGE_KEY_CACHE_TIME = 'gfonts_api_cache_time_v1';
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

  // If font is variable with wght axis:
  if (font.isVariable && font.axes?.some((a) => a.tag === 'wght')) {
    const wghtAxis = font.axes.find((a) => a.tag === 'wght')!;
    const hasItalic = font.variants.some((v) => v.includes('italic'));

    if (hasItalic) {
      return `https://fonts.googleapis.com/css2?family=${familyEncoded}:ital,wght@0,${wghtAxis.min}..${wghtAxis.max};1,${wghtAxis.min}..${wghtAxis.max}&display=swap`;
    }
    return `https://fonts.googleapis.com/css2?family=${familyEncoded}:wght@${wghtAxis.min}..${wghtAxis.max}&display=swap`;
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

// Track loaded font link elements to avoid duplicate network tags
const loadedFontUrls = new Set<string>();

/**
 * Dynamically loads a Google Font by injecting a <link> stylesheet into document.head
 */
export async function loadGoogleFont(font: GoogleFont): Promise<boolean> {
  const url = buildGoogleFontUrl(font);
  if (loadedFontUrls.has(url)) {
    return true;
  }

  const id = `gfont-link-${font.family.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const existingLink = document.getElementById(id);
  if (existingLink) {
    loadedFontUrls.add(url);
    return true;
  }

  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;

    const timeoutId = setTimeout(() => {
      // Resolve true anyway so it falls back to system font smoothly without hanging
      resolve(true);
    }, 4500);

    link.onload = () => {
      clearTimeout(timeoutId);
      loadedFontUrls.add(url);
      // Wait for document.fonts to catch up if API available
      if ('fonts' in document) {
        document.fonts.load(`16px "${font.family}"`).finally(() => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    };

    link.onerror = () => {
      clearTimeout(timeoutId);
      resolve(false);
    };

    document.head.appendChild(link);
  });
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
        if (json.items && Array.isArray(json.items)) {
          const apiFonts: GoogleFont[] = json.items.map((item: any, index: number) => {
            const axes: VariableAxis[] = [];
            const isVariable = Boolean(item.axes && item.axes.length > 0);

            if (item.axes && Array.isArray(item.axes)) {
              item.axes.forEach((ax: any) => {
                axes.push({
                  tag: ax.tag,
                  name: ax.tag === 'wght' ? 'Weight' : ax.tag === 'wdth' ? 'Width' : ax.tag === 'slnt' ? 'Slant' : ax.tag === 'opsz' ? 'Optical Size' : ax.tag,
                  min: ax.start,
                  max: ax.end,
                  default: ax.tag === 'wght' ? 400 : ax.start,
                  step: ax.tag === 'wght' ? 10 : 1,
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
    return raw ? JSON.parse(raw) : [];
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
  if (key) {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
    localStorage.removeItem(STORAGE_KEY_CACHE);
    localStorage.removeItem(STORAGE_KEY_CACHE_TIME);
  }
}
