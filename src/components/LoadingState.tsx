import { useLanguage } from '../contexts/LanguageContext';

export function LoadingState() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--brand-pink)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );
}
