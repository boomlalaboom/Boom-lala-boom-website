import { useEffect, useMemo, useState } from 'react';
import { Music, Play, ListVideo } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Song } from '../lib/supabase';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';
import { SeoHead } from '../components/SeoHead';

export function SongsPage() {
  const { t, language } = useLanguage();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) {
          setSongs(data);
        }
      } catch (err) {
        setError(language === 'fr'
          ? 'Impossible de charger les chansons.'
          : language === 'en'
            ? 'Unable to load songs.'
            : 'No se pudieron cargar las canciones.');
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  const getLocalizedField = (obj: Song, field: string) => {
    const key = `${field}_${language}` as keyof Song;
    return (obj[key] as string) || (obj[`${field}_fr` as keyof Song] as string) || '';
  };

  const getYouTubeId = (song: Song) => {
    const key = `youtube_id_${language}` as keyof Song;
    return (song[key] as string) || song.youtube_id_fr || (song as unknown as { youtube_id?: string }).youtube_id || '';
  };

  const getAllYouTubeIds = (song: Song) => {
    return [
      song.youtube_id_fr,
      song.youtube_id_en,
      song.youtube_id_es,
      (song as unknown as { youtube_id?: string }).youtube_id,
    ].filter(Boolean);
  };

  const activeVideoId = activeSong ? getYouTubeId(activeSong) : '';
  const activeTitle = activeSong ? getLocalizedField(activeSong, 'title') : '';
  const activeDescription = activeSong ? getLocalizedField(activeSong, 'description') : '';

  const playlist = useMemo(() => songs.filter((song) => getYouTubeId(song)), [songs, language]);
  const requestedVideo = useMemo(() => new URLSearchParams(location.search).get('video'), [location.search]);

  useEffect(() => {
    if (!songs.length) return;
    if (requestedVideo) {
      const match = songs.find((song) => getAllYouTubeIds(song).includes(requestedVideo));
      if (match) {
        setActiveSong(match);
        return;
      }
    }
    setActiveSong((prev) => prev || songs[0] || null);
  }, [songs, requestedVideo]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {language === 'fr' ? 'Oups, un probleme est survenu' : language === 'en' ? 'Oops, something went wrong' : 'Ups, algo salio mal'}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            {language === 'fr' ? 'Reessayer' : language === 'en' ? 'Retry' : 'Reintentar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SeoHead
        title={activeTitle ? `${activeTitle} - BoomLaLaBoom` : undefined}
        description={activeDescription}
        image={activeVideoId ? `https://img.youtube.com/vi/${activeVideoId}/maxresdefault.jpg` : undefined}
      />
      <PageHero
        title={t('songs_page_title')}
        subtitle={t('songs_page_subtitle')}
        icon={<Music className="w-8 h-8 text-white" />}
        variant="blue"
      />
      <section className="py-16 px-4 section-bg-yellow screen-section">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative aspect-video bg-black">
                {activeVideoId ? (
                  <iframe
                    title={activeTitle}
                    src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {language === 'fr' ? 'Aucune video disponible' : language === 'en' ? 'No video available' : 'No hay video disponible'}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[var(--brand-blue)] mb-2">
                  {activeTitle}
                </h2>
                <p className="text-gray-600">
                  {activeDescription}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4 text-[var(--brand-blue)] font-bold">
                <ListVideo className="w-5 h-5" />
                {language === 'fr' ? 'A suivre' : language === 'en' ? 'Up next' : 'Siguiente'}
              </div>
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
                {playlist.map((song) => {
                  const videoId = getYouTubeId(song);
                  const title = getLocalizedField(song, 'title');
                  return (
                    <button
                      key={song.id}
                      onClick={() => setActiveSong(song)}
                      className={`w-full flex items-center gap-3 text-left rounded-2xl p-3 transition-all ${activeSong?.id === song.id
                        ? 'bg-[rgba(255,159,0,0.2)]'
                        : 'hover:bg-[rgba(4,87,186,0.08)]'
                        }`}
                    >
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {getLocalizedField(song, 'description')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
