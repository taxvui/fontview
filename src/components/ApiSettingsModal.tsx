import React, { useState } from 'react';
import { X, KeyRound, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { getStoredApiKey, setStoredApiKey } from '../services/googleFontsService';
import { useToast } from './Toast';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveAndSync = async () => {
    if (!apiKey.trim()) {
      handleClear();
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${encodeURIComponent(
          apiKey.trim()
        )}&sort=popularity`
      );

      if (res.ok) {
        setStoredApiKey(apiKey.trim());
        setTestResult({
          success: true,
          msg: 'Connection verified! Key saved and catalog synchronized.',
        });
        showToast(t('keySavedSuccess'));
        onKeyUpdated();
        setTimeout(() => onClose(), 1200);
      } else {
        const errorJson = await res.json().catch(() => ({}));
        setTestResult({
          success: false,
          msg: errorJson.error?.message || 'Invalid API Key or unauthorized domain.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        msg: err.message || 'Network error while contacting Google Fonts API.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setTestResult(null);
    showToast(t('clearKey'));
    onKeyUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg liquid-glass rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-settings-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl liquid-glass shadow-xs">
              <BrandLogo className="w-6 h-6" />
            </div>
            <h3
              id="api-settings-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {t('apiKeyTitle')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('apiKeyDesc')}
        </p>

        <div className="space-y-1.5">
          <label
            htmlFor="api-key-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Google Fonts API Key
          </label>
          <input
            id="api-key-input"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t('apiKeyInputPlaceholder')}
            className="w-full px-3.5 py-2.5 rounded-xl liquid-input text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 focus-visible:outline-none"
          />
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <p>{testResult.msg}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {t('clearKey')}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {t('close')}
            </button>
            <button
              type="button"
              disabled={testing}
              onClick={handleSaveAndSync}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>{t('saveKey')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
