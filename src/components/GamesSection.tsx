import { Gamepad2, Star, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Game } from '../lib/supabase';

interface GamesSectionProps {
  games: Game[];
}

export function GamesSection({ games }: GamesSectionProps) {
  const { language, t } = useLanguage();

  const getLocalizedText = (obj: any, field: string) => {
    return obj?.[`${field}_${language}`] || obj?.[`${field}_fr`] || '';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
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

  return (
    <section id="games" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            {t('home_games_title')}
          </h2>
          <p className="text-xl text-gray-600">{t('games_page_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video bg-gradient-to-br from-blue-200 to-cyan-200 overflow-hidden">
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
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex-1">
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
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {game.age_min}-{game.age_max} {language === 'fr' ? 'ans' : language === 'en' ? 'yo' : 'años'}
                  </span>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full font-bold text-lg transition-all group-hover:scale-105">
                  <Gamepad2 className="w-5 h-5" />
                  <span>{t('play_now')}</span>
                </button>

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
      </div>
    </section>
  );
}
