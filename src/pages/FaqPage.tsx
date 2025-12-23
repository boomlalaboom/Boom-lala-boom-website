import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaqSection } from '../components/FaqSection';
import { PageHero } from '../components/PageHero';

export function FaqPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('faq_page_title')}
        subtitle={t('faq_page_subtitle')}
        icon={<Info className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <FaqSection showHeader={false} />
    </div>
  );
}
