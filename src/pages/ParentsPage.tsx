import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ParentsSection } from '../components/ParentsSection';
import { PageHero } from '../components/PageHero';

export function ParentsPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('parents_page_title')}
        subtitle={t('parents_page_subtitle')}
        icon={<Info className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <ParentsSection showHeader={false} variant="yellow" />
    </div>
  );
}
