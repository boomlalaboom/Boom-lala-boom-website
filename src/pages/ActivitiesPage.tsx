import { Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ActivitiesSection } from '../components/ActivitiesSection';
import { PageHero } from '../components/PageHero';

export function ActivitiesPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('activities_page_title')}
        subtitle={t('activities_page_subtitle')}
        icon={<Scissors className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <ActivitiesSection showHeader={false} variant="yellow" />
    </div>
  );
}
