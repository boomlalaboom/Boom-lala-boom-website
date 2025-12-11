import { Users, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Character } from '../lib/supabase';

interface CharactersSectionProps {
  characters: Character[];
}

export function CharactersSection({ characters }: CharactersSectionProps) {
  const { language, t } = useLanguage();

  const getLocalizedText = (obj: any, field: string) => {
    return obj?.[`${field}_${language}`] || obj?.[`${field}_fr`] || '';
  };

  return (
    <section id="characters" className="py-16 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            {t('home_characters_title')}
          </h2>
          <p className="text-xl text-gray-600">{t('characters_page_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${character.color_primary}, ${character.color_secondary})`,
                }}
              ></div>

              <div className="relative p-8">
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                    <Sparkles
                      className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    />
                  </div>
                </div>

                <div
                  className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${character.color_primary}, ${character.color_secondary})`,
                  }}
                >
                  {character.image_url ? (
                    <img
                      src={character.image_url}
                      alt={getLocalizedText(character, 'name')}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white">
                      {character.slug === 'lola-the-cow' ? '🐮' :
                       character.slug === 'baby-shark-family' ? '🦈' :
                       character.slug === 'vehicles-crew' ? '🚗' : '⭐'}
                    </span>
                  )}
                </div>

                <h3
                  className="text-3xl font-black text-center mb-4"
                  style={{ color: character.color_primary }}
                >
                  {getLocalizedText(character, 'name')}
                </h3>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {getLocalizedText(character, 'description')}
                </p>

                <div className="flex justify-center">
                  <button
                    className="flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${character.color_primary}, ${character.color_secondary})`,
                    }}
                  >
                    <Heart className="w-5 h-5" />
                    <span>{t('home_cta_discover')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
