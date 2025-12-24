import { Users, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Character } from '../lib/supabase';

interface CharactersSectionProps {
  characters: Character[];
  showHeader?: boolean;
  showViewMore?: boolean;
  viewMoreTo?: string;
  variant?: 'blue' | 'yellow';
}

export function CharactersSection({
  characters,
  showHeader = true,
  showViewMore = false,
  viewMoreTo = '/characters',
  variant = 'blue',
}: CharactersSectionProps) {
  const { language, t } = useLanguage();

  const getLocalizedText = (obj: Character, field: string) => {
    const key = `${field}_${language}` as keyof Character;
    return (obj[key] as string) || (obj[`${field}_fr` as keyof Character] as string) || '';
  };

  // Utiliser uniquement les données de Supabase
  const displayCharacters = characters.map((character) => ({
    slug: character.slug,
    name: getLocalizedText(character, 'name'),
    description: getLocalizedText(character, 'description'),
    imageUrl: character.image_url,
    colorPrimary: character.color_primary,
    colorSecondary: character.color_secondary,
  }));

  return (
    <section
      id="characters"
      className={`py-16 px-4 screen-section ${variant === 'blue' ? 'section-bg-blue' : 'section-bg-yellow'}`}
    >
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-pink)] rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">
              {t('home_characters_title')}
            </h2>
            <p className="text-xl subtitle-text">{t('characters_page_subtitle')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCharacters.map((character, index) => (
            <div
              key={character.slug}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative p-8">
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-[var(--brand-orange)] animate-pulse" />
                    <Sparkles
                      className="w-6 h-6 text-[var(--brand-pink)] absolute -top-2 -right-2 animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    />
                  </div>
                </div>

                <div
                  className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-6xl shadow-lg bg-white"
                  style={{
                    border: `6px solid ${character.colorPrimary}`,
                  }}
                >
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <h3
                  className="text-xl font-black text-center mb-4"
                  style={{ color: character.colorPrimary }}
                >
                  {character.name}
                </h3>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {character.description}
                </p>

                <div className="flex justify-center">
                  <Link
                    to={`/characters/${character.slug}`}
                    className="flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${character.colorPrimary}, ${character.colorSecondary})`,
                    }}
                  >
                    <Heart className="w-5 h-5" />
                    <span>{t('home_cta_discover')}</span>
                  </Link>
                </div>
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
