import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactSection } from '../components/ContactSection';
import { PageHero } from '../components/PageHero';
import { NewsletterModal } from '../components/NewsletterModal';

export function ContactPage() {
  const { t } = useLanguage();
  const [showNewsletter, setShowNewsletter] = useState(false);

  return (
    <div>
      <PageHero
        title={t('contact_page_title')}
        subtitle={t('contact_page_subtitle')}
        icon={<Mail className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <ContactSection
        showHeader={false}
        variant="yellow"
        onNewsletterClick={() => setShowNewsletter(true)}
      />

      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />
    </div>
  );
}
