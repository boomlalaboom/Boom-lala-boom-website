import { useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Game } from '../lib/supabase';
import { GamesSection } from '../components/GamesSection';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';

export function GamesPage() {
  const { t } = useLanguage();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setGames(data);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <PageHero
        title={t('games_page_title')}
        subtitle={t('games_page_subtitle')}
        icon={<Gamepad2 className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <GamesSection games={games} showHeader={false} />
    </div>
  );
}
