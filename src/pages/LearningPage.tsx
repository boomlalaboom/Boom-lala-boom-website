import { BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LearningSection } from '../components/LearningSection';
import { PageHero } from '../components/PageHero';

export function LearningPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('learning_page_title')}
        subtitle={t('learning_page_subtitle')}
        icon={<BookOpen className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <LearningSection showHeader={false} />
    </div>
  );
}
