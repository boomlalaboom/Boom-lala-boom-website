import { Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactSection } from '../components/ContactSection';
import { PageHero } from '../components/PageHero';

export function ContactPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        title={t('contact_page_title')}
        subtitle={t('contact_page_subtitle')}
        icon={<Mail className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <ContactSection showHeader={false} variant="yellow" />
    </div>
  );
}
