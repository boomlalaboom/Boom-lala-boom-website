import { Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ResourcesSection } from '../components/ResourcesSection';
import { PageHero } from '../components/PageHero';

export function ResourcesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('resources_page_title')}
        subtitle={t('resources_page_subtitle')}
        icon={<Scissors className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <ResourcesSection showHeader={false} />
    </div>
  );
}
