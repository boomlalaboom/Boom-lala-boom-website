import { Music, Play, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Song } from '../lib/supabase';

interface SongsSectionProps {
  songs: Song[];
}

export function SongsSection({ songs }: SongsSectionProps) {
  const { language, t } = useLanguage();

  const getLocalizedText = (obj: any, field: string) => {
    return obj?.[`${field}_${language}`] || obj?.[`${field}_fr`] || '';
  };

  const openYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  return (
    <section id="songs" className="py-16 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            {t('home_songs_title')}
          </h2>
          <p className="text-xl text-gray-600">{t('songs_page_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-pink-200 to-purple-200 overflow-hidden">
                {song.thumbnail_url ? (
                  <img
                    src={song.thumbnail_url}
                    alt={getLocalizedText(song, 'title')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={`https://img.youtube.com/vi/${song.youtube_id}/maxresdefault.jpg`}
                      alt={getLocalizedText(song, 'title')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <button
                    onClick={() => openYouTube(song.youtube_id)}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 text-pink-500 ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                  {getLocalizedText(song, 'title')}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getLocalizedText(song, 'description')}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full font-medium">
                      {song.age_min}-{song.age_max} {language === 'fr' ? 'ans' : language === 'en' ? 'yo' : 'años'}
                    </span>
                  </div>

                  <button
                    onClick={() => openYouTube(song.youtube_id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full font-medium transition-all"
                  >
                    <span>{t('watch_now')}</span>
                    <ExternalLink className="w-4 h-4" />
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
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
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
      </div>
    </section>
  );
}
