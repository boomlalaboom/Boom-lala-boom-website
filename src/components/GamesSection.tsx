import { Gamepad2, Star, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Game } from '../lib/supabase';

interface GamesSectionProps {
  games: Game[];
  showHeader?: boolean;
  showViewMore?: boolean;
  viewMoreTo?: string;
}

export function GamesSection({
  games,
  showHeader = true,
  showViewMore = false,
  viewMoreTo = '/games',
}: GamesSectionProps) {
  const { language, t } = useLanguage();

  const getLocalizedText = (obj: Game, field: string) => {
    const key = `${field}_${language}` as keyof Game;
    return (obj[key] as string) || (obj[`${field}_fr` as keyof Game] as string) || '';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-[rgba(122,201,67,0.2)] text-[var(--brand-green)]';
      case 'medium':
        return 'bg-[rgba(255,147,30,0.2)] text-[var(--brand-orange)]';
      case 'hard':
        return 'bg-[rgba(255,29,37,0.2)] text-[var(--brand-red)]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'rhythm':
        return '🎵';
      case 'platform':
        return '🏃';
      case 'puzzle':
        return '🧩';
      case 'memory':
        return '🧠';
      default:
        return '🎮';
    }
  };

  const getSlugs = (game: Game) => {
    return [
      game.slug_fr,
      game.slug_en,
      game.slug_es,
    ].filter(Boolean).map((value) => value.toLowerCase());
  };

  const isLolaMemory = (game: Game) => {
    const slugs = getSlugs(game);
    return slugs.includes('lola-memory') || (game.game_type === 'memory' && slugs.some((slug) => /lola/i.test(slug)));
  };

  const isSharkRhythm = (game: Game) => {
    const slugs = getSlugs(game);
    return slugs.includes('shark-rhythm')
      || slugs.includes('rythme-requin')
      || (game.game_type === 'rhythm' && slugs.some((slug) => /shark|requin/i.test(slug)));
  };

  return (
    <section id="games" className="py-16 px-4 section-bg-yellow screen-section">
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-teal)] rounded-full mb-4">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">
              {t('home_games_title')}
            </h2>
            <p className="text-xl subtitle-text">{t('games_page_subtitle')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-[rgba(63,169,245,0.2)] to-[rgba(34,181,115,0.2)] overflow-hidden">
                {game.thumbnail_url ? (
                  <img
                    src={game.thumbnail_url}
                    alt={getLocalizedText(game, 'name')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-8xl">{getGameTypeIcon(game.game_type)}</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-[var(--brand-blue)] transition-colors flex-1">
                    {getLocalizedText(game, 'name')}
                  </h3>
                  <span className="text-2xl ml-2">{getGameTypeIcon(game.game_type)}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getLocalizedText(game, 'description')}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty === 'easy'
                      ? language === 'fr' ? 'Facile' : language === 'en' ? 'Easy' : 'Fácil'
                      : game.difficulty === 'medium'
                        ? language === 'fr' ? 'Moyen' : language === 'en' ? 'Medium' : 'Medio'
                        : language === 'fr' ? 'Difficile' : language === 'en' ? 'Hard' : 'Difícil'}
                  </span>
                  <span className="px-3 py-1 bg-[rgba(63,169,245,0.2)] text-[var(--brand-blue)] rounded-full text-sm font-medium">
                    {game.age_min}-{game.age_max} {language === 'fr' ? 'ans' : language === 'en' ? 'yo' : 'años'}
                  </span>
                </div>

                {isLolaMemory(game) ? (
                  <Link
                    to={`/games/lola-memory${game[`song_id_${language}` as keyof Game] ? `?songId=${game[`song_id_${language}` as keyof Game]}` : ''}`}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-teal)] text-white rounded-full font-bold text-lg transition-all group-hover:scale-105"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span>{t('play_now')}</span>
                  </Link>
                ) : isSharkRhythm(game) ? (
                  <Link
                    to={`/games/shark-rhythm${game[`song_id_${language}` as keyof Game] ? `?songId=${game[`song_id_${language}` as keyof Game]}` : ''}`}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-teal)] text-white rounded-full font-bold text-lg transition-all group-hover:scale-105"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span>{t('play_now')}</span>
                  </Link>
                ) : (
                  <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-teal)] text-white rounded-full font-bold text-lg transition-all group-hover:scale-105">
                    <Gamepad2 className="w-5 h-5" />
                    <span>{t('play_now')}</span>
                  </button>
                )}

                {game.play_count > 0 && (
                  <div className="mt-3 flex items-center justify-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>
                      {game.play_count.toLocaleString()} {language === 'fr' ? 'parties' : language === 'en' ? 'plays' : 'partidas'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showViewMore && (
          <div className="text-center mt-8">
            <Link to={viewMoreTo} className="inline-flex items-center gap-2 px-8 py-4 btn-primary text-lg">
              <span>{t('view_more')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
