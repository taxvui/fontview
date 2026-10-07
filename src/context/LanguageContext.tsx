import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types/font';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof (typeof translations)['en'], params?: Record<string, string | number>) => string;
}

const STORAGE_LANG_KEY = 'gfonts_language_preference_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language;
    if (saved && (saved === 'vi' || saved === 'en' || saved === 'zh')) {
      return saved;
    }
    // Detect browser language
    if (typeof navigator !== 'undefined') {
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('vi')) return 'vi';
      if (navLang.startsWith('zh')) return 'zh';
    }
    return 'vi'; // Default Vietnamese as preferred in brief
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  };

  const t = (
    key: keyof (typeof translations)['en'],
    params?: Record<string, string | number>
  ): string => {
    const dict = translations[language] || translations.en;
    let text: string = (dict as any)[key] || (translations.en as any)[key] || String(key);

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
