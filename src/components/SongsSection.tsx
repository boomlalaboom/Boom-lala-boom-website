import { Music, Play, ArrowRight, X } from 'lucide-react';
import { Link } from './LocalizedLink';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Song } from '../lib/supabase';
import { useState } from 'react';

interface SongsSectionProps {
  songs: Song[];
  showHeader?: boolean;
  showViewMore?: boolean;
  viewMoreTo?: string;
  variant?: 'blue' | 'yellow';
  watchMode?: 'page' | 'modal';
  watchPagePath?: string;
  viewMoreLabel?: string;
}

export function SongsSection({
  songs,
  showHeader = true,
  showViewMore = false,
  viewMoreTo = '/songs',
  variant = 'blue',
  watchMode = 'page',
  watchPagePath = '/songs',
  viewMoreLabel,
}: SongsSectionProps) {
  const { language, t } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const navigate = useNavigate();

  const getLocalizedField = (obj: Song, field: string) => {
    const key = `${field}_${language}` as keyof Song;
    return (obj[key] as string) || (obj[`${field}_fr` as keyof Song] as string) || '';
  };

  const getYouTubeId = (song: Song) => {
    const key = `youtube_id_${language}` as keyof Song;
    return (song[key] as string) || song.youtube_id_fr || '';
  };

  const openYouTube = (youtubeId: string) => {
    if (!youtubeId) return;
    if (watchMode === 'modal') {
      setActiveVideo(youtubeId);
      return;
    }
    const path = watchPagePath?.startsWith('/') ? watchPagePath : `/${watchPagePath}`;
    navigate(`/${language}${path}?video=${youtubeId}`);
  };

  return (
    <section
      id="songs"
      className={`py-16 px-4 screen-section ${variant === 'blue' ? 'section-bg-blue' : 'section-bg-yellow'}`}
    >
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">
              {t('home_songs_title')}
            </h2>
            <p className="text-xl subtitle-text">{t('songs_page_subtitle')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-[rgba(255,123,172,0.2)] to-[rgba(63,169,245,0.2)] overflow-hidden">
                {song.thumbnail_url ? (
                  <img
                    src={song.thumbnail_url}
                    alt={getLocalizedField(song, 'title')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(song)}/maxresdefault.jpg`}
                      alt={getLocalizedField(song, 'title')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${getYouTubeId(song)}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <button
                    onClick={() => openYouTube(getYouTubeId(song))}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 text-[var(--brand-pink)] ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[var(--brand-red)] transition-colors">
                  {getLocalizedField(song, 'title')}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getLocalizedField(song, 'description')}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-[rgba(255,123,172,0.2)] text-[var(--brand-red)] rounded-full font-medium">
                      {song.age_min}-{song.age_max} {language === 'fr' ? 'ans' : language === 'en' ? 'yo' : 'años'}
                    </span>
                  </div>

                  <button
                    onClick={() => openYouTube(getYouTubeId(song))}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white rounded-full font-medium transition-all hover:scale-105"
                  >
                    <span>{t('watch_now')}</span>
                  </button>
                </div>

                {(song.spotify_url || song.apple_music_url || song.anghami_url) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      {language === 'fr' ? 'Écouter sur' : language === 'en' ? 'Listen on' : 'Escuchar en'}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {song.spotify_url && (
                        <a
                          href={song.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          Spotify
                        </a>
                      )}
                      {song.apple_music_url && (
                        <a
                          href={song.apple_music_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          Apple Music
                        </a>
                      )}
                      {song.anghami_url && (
                        <a
                          href={song.anghami_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[rgba(63,169,245,0.2)] text-[var(--brand-blue)] rounded-full text-sm font-medium hover:bg-[rgba(63,169,245,0.3)] transition-colors"
                        >
                          Anghami
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showViewMore && (
          <div className="text-center mt-8">
            <Link to={viewMoreTo} className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-lg">
              <span>{viewMoreLabel || t('view_more')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md"
              aria-label="Close video"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="aspect-video bg-black">
              <iframe
                title="YouTube video"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
