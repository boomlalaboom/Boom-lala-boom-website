import { useEffect, useState } from 'react';
import { Music, Gamepad2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Character, Song, Game } from '../lib/supabase';
import { SongsSection } from './SongsSection';
import { GamesSection } from './GamesSection';
import { CharactersSection } from './CharactersSection';
import { ActivitiesSection } from './ActivitiesSection';
import { ParentsSection } from './ParentsSection';
import { LoadingState } from './LoadingState';
import { AboutSection } from './AboutSection';
import { LearningSection } from './LearningSection';
import { ResourcesSection } from './ResourcesSection';
import { FaqSection } from './FaqSection';
import { ContactSection } from './ContactSection';
import { AnimatedLogo } from './AnimatedLogo';

export function HomePage() {
  const { language, t } = useLanguage();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase request timeout')), 12000),
      );

      const [charactersRes, songsRes, gamesRes] = await Promise.race([
        Promise.all([
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
        ]),
        timeout,
      ]);

      if (charactersRes.data) setCharacters(charactersRes.data);
      if (songsRes.data) setSongs(songsRes.data);
      if (gamesRes.data) setGames(gamesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(
        language === 'fr'
          ? 'Chargement bloque. Verifie la connexion Supabase.'
          : language === 'en'
          ? 'Loading blocked. Check Supabase connection.'
          : 'Carga bloqueada. Verifica la conexion a Supabase.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {language === 'fr'
              ? 'Oups, le contenu ne charge pas'
              : language === 'en'
              ? 'Oops, content is not loading'
              : 'Ups, el contenido no carga'}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
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
      <section className="relative overflow-hidden py-20 px-4 screen-section">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00B7FF] to-[#0457BA] opacity-90"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <AnimatedLogo size={300} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-[#FFE600] leading-tight">
              {t('home_hero_title')}
            </h1>
            <p className="text-2xl md:text-3xl text-[#FF9F00] font-medium mb-8">
              {t('home_hero_subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById('songs');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center space-x-3 px-8 py-4 btn-primary text-xl"
              >
                <Music className="w-6 h-6 group-hover:animate-bounce" />
                <span>{t('home_cta_sing')}</span>
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('games');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center space-x-3 px-8 py-4 btn-secondary text-xl"
              >
                <Gamepad2 className="w-6 h-6 group-hover:animate-bounce" />
                <span>{t('home_cta_play')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {characters.slice(0, 3).map((character, index) => {
              const getLocalizedText = (field: string) => {
                const key = `${field}_${language}` as keyof Character;
                return (character[key] as string) || (character[`${field}_fr` as keyof Character] as string) || '';
              };

              return (
                <Link
                  key={character.slug}
                  to={`/characters/${character.slug}`}
                  className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                  </div>
                  <div
                    className="w-28 h-28 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg bg-white"
                    style={{ border: `5px solid ${character.color_primary}` }}
                  >
                    <img
                      src={character.image_url}
                      alt={getLocalizedText('name')}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: character.color_primary }}>
                    {getLocalizedText('name')}
                  </h3>
                  <p className="text-gray-600">
                    {getLocalizedText('description').substring(0, 100)}...
                  </p>
                  <div className="mt-4 inline-block px-4 py-2 rounded-full text-white font-medium text-sm"
                    style={{ backgroundColor: character.color_primary }}>
                    {t('home_cta_discover')}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <SongsSection
        songs={songs.slice(0, 3)}
        showViewMore={songs.length > 3}
        viewMoreTo="/songs"
      />
      <GamesSection
        games={games.slice(0, 3)}
        showViewMore={games.length > 3}
        viewMoreTo="/games"
      />
      <CharactersSection
        characters={characters.slice(0, 3)}
        showViewMore={characters.length > 3}
        viewMoreTo="/characters"
      />

      <AboutSection />
      <ParentsSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
}
