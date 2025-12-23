import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AboutSection } from '../components/AboutSection';
import { PageHero } from '../components/PageHero';

export function AboutPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('about_page_title')}
        subtitle={t('about_page_subtitle')}
        icon={<Sparkles className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <AboutSection showHeader={false} />
    </div>
  );
}
