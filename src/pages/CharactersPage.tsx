import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Character } from '../lib/supabase';
import { CharactersSection } from '../components/CharactersSection';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';

export function CharactersPage() {
  const { t } = useLanguage();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('characters')
          .select('*')
          .order('order_position');
        if (data) setCharacters(data);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <PageHero
        title={t('characters_page_title')}
        subtitle={t('characters_page_subtitle')}
        icon={<Users className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <CharactersSection characters={characters} showHeader={false} variant="yellow" />
    </div>
  );
}
