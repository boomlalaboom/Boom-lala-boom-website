import { useLanguage } from '../contexts/LanguageContext';
import { LoadingLogo } from './LoadingLogo';

export function LoadingState() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingLogo size={120} text={t('loading')} />
    </div>
  );
}
