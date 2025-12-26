import { useState } from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ParentsSection } from '../components/ParentsSection';
import { PageHero } from '../components/PageHero';
import { NewsletterModal } from '../components/NewsletterModal';

export function ParentsPage() {
  const { t } = useLanguage();
  const [showNewsletter, setShowNewsletter] = useState(false);

  return (
    <div>
      <PageHero
        title={t('parents_page_title')}
        subtitle={t('parents_page_subtitle')}
        icon={<Info className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <ParentsSection
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
