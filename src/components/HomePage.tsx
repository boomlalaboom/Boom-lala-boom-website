import { useEffect, useState } from 'react';
import { Music, Gamepad2, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Character, Song, Game } from '../lib/supabase';
import { SongsSection } from './SongsSection';
import { GamesSection } from './GamesSection';
import { CharactersSection } from './CharactersSection';
import { ActivitiesSection } from './ActivitiesSection';
import { ParentsSection } from './ParentsSection';

export function HomePage() {
  const { language, t } = useLanguage();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [charactersRes, songsRes, gamesRes] = await Promise.all([
        supabase
          .from('characters')
          .select('*')
          .order('order_position'),
        supabase
          .from('songs')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('games')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false }),
      ]);

      if (charactersRes.data) setCharacters(charactersRes.data);
      if (songsRes.data) setSongs(songsRes.data);
      if (gamesRes.data) setGames(gamesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj: any, field: string) => {
    return obj?.[`${field}_${language}`] || obj?.[`${field}_fr`] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 opacity-50"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <img
                src="/logo_boomlalaboom.png"
                alt="BoomLaLaBoom"
                className="h-32 md:h-40 w-auto animate-bounce-gentle"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              {t('home_hero_title')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-8">
              {t('home_hero_subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById('songs');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Music className="w-6 h-6 group-hover:animate-bounce" />
                <span>{t('home_cta_sing')}</span>
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('games');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Gamepad2 className="w-6 h-6 group-hover:animate-bounce" />
                <span>{t('home_cta_play')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {characters.slice(0, 3).map((character, index) => (
              <div
                key={character.id}
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  background: `linear-gradient(135deg, ${character.color_primary}15, ${character.color_secondary}15)`,
                }}
                onClick={() => {
                  const element = document.getElementById('characters');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: character.color_primary }}>
                  {getLocalizedText(character, 'name')}
                </h3>
                <p className="text-gray-600">
                  {getLocalizedText(character, 'description').substring(0, 100)}...
                </p>
                <div className="mt-4 inline-block px-4 py-2 rounded-full text-white font-medium text-sm"
                     style={{ backgroundColor: character.color_primary }}>
                  {t('home_cta_discover')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SongsSection songs={songs} />
      <GamesSection games={games} />
      <CharactersSection characters={characters} />
      <ActivitiesSection />
      <ParentsSection />
    </div>
  );
}
