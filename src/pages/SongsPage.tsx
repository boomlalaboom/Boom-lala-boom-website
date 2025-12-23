import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Song } from '../lib/supabase';
import { SongsSection } from '../components/SongsSection';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';

export function SongsPage() {
  const { t } = useLanguage();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setSongs(data);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <PageHero
        title={t('songs_page_title')}
        subtitle={t('songs_page_subtitle')}
        icon={<Music className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <SongsSection songs={songs} showHeader={false} variant="yellow" />
    </div>
  );
}
