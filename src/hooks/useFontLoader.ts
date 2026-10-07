import { useState, useEffect, useCallback } from 'react';
import { GoogleFont } from '../types/font';
import { loadGoogleFont } from '../services/googleFontsService';

export type FontLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export function useFontLoader(fontsToLoad: GoogleFont[]) {
  const [statusMap, setStatusMap] = useState<Record<string, FontLoadStatus>>({});

  useEffect(() => {
    fontsToLoad.forEach((font) => {
      const currentStatus = statusMap[font.family];
      if (currentStatus === 'loaded' || currentStatus === 'loading') {
        return;
      }

      setStatusMap((prev) => ({ ...prev, [font.family]: 'loading' }));

      loadGoogleFont(font)
        .then((success) => {
          setStatusMap((prev) => ({
            ...prev,
            [font.family]: success ? 'loaded' : 'error',
          }));
        })
        .catch(() => {
          setStatusMap((prev) => ({
            ...prev,
            [font.family]: 'error',
          }));
        });
    });
  }, [fontsToLoad]);

  const retry = useCallback((font: GoogleFont) => {
    setStatusMap((prev) => ({ ...prev, [font.family]: 'loading' }));
    loadGoogleFont(font)
      .then((success) => {
        setStatusMap((prev) => ({
          ...prev,
          [font.family]: success ? 'loaded' : 'error',
        }));
      })
      .catch(() => {
        setStatusMap((prev) => ({
          ...prev,
          [font.family]: 'error',
        }));
      });
  }, []);

  return { statusMap, retry };
}
