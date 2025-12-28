import { Scissors, ArrowRight, Palette, Award } from 'lucide-react';
import { Link } from './LocalizedLink';
import { useLanguage } from '../contexts/LanguageContext';

interface ActivitiesSectionProps {
  showHeader?: boolean;
  variant?: 'blue' | 'yellow';
}

export function ActivitiesSection({ showHeader = true, variant = 'blue' }: ActivitiesSectionProps) {
  const { language, t } = useLanguage();

  const activityTypes = [
    {
      icon: Palette,
      title: language === 'fr' ? 'Coloriages' : language === 'en' ? 'Coloring Pages' : 'Páginas para Colorear',
      description: language === 'fr'
        ? 'Imprime et colorie tes personnages préférés'
        : language === 'en'
          ? 'Print and color your favorite characters'
          : 'Imprime y colorea tus personajes favoritos',
      color: 'from-[var(--brand-pink)] to-[var(--brand-orange)]',
      emoji: '🎨',
      cta: language === 'fr' ? 'Découvrir tous nos coloriages' : language === 'en' ? 'Discover all coloring pages' : 'Descubrir todos los dibujos',
      to: language === 'fr' ? '/activites/coloriages' : language === 'en' ? '/activities/coloring-pages' : '/actividades/paginas-para-colorear',
    },
    {
      icon: Scissors,
      title: language === 'fr' ? 'Découpages' : language === 'en' ? 'Paper Crafts' : 'Manualidades',
      description: language === 'fr'
        ? 'Crée tes propres jouets en papier'
        : language === 'en'
          ? 'Create your own paper toys'
          : 'Crea tus propios juguetes de papel',
      color: 'from-[var(--brand-blue)] to-[var(--brand-teal)]',
      emoji: '✂️',
      cta: language === 'fr' ? 'Découvrir tous nos découpages' : language === 'en' ? 'Discover all cutouts' : 'Descubrir todos los recortes',
      to: language === 'fr' ? '/activites/decoupages' : language === 'en' ? '/activities/paper-crafts' : '/actividades/manualidades',
    },
    {
      icon: Award,
      title: language === 'fr' ? 'Jeux de cartes' : language === 'en' ? 'Card Games' : 'Juegos de Cartas',
      description: language === 'fr'
        ? 'Joue avec des cartes personnalisées'
        : language === 'en'
          ? 'Play with custom cards'
          : 'Juega con tarjetas personalizadas',
      color: 'from-[var(--brand-green)] to-[var(--brand-sky)]',
      emoji: '🃏',
      cta: language === 'fr' ? 'Bientôt disponible' : language === 'en' ? 'Coming soon' : 'Muy pronto',
    },
  ];

  return (
    <section
      id="activities"
      className={`py-16 px-4 screen-section ${variant === 'blue' ? 'section-bg-blue' : 'section-bg-yellow'}`}
    >
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-teal)] rounded-full mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">
              {t('activities_page_title')}
            </h2>
            <p className="text-xl subtitle-text">{t('activities_page_subtitle')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activityTypes.map((activity, index) => {
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${activity.color} rounded-full mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-4xl">{activity.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:bg-gradient-to-r group-hover:from-[var(--brand-green)] group-hover:to-[var(--brand-teal)] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{activity.description}</p>

                  {activity.to ? (
                    <Link
                      to={activity.to}
                      className={`flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r ${activity.color} text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all group-hover:scale-105`}
                    >
                      <ArrowRight className="w-5 h-5" />
                      <span>{activity.cta}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className={`flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r ${activity.color} text-white rounded-full font-bold shadow-lg opacity-70 cursor-not-allowed`}
                    >
                      <span>{activity.cta}</span>
                    </button>
                  )}

                  <div className="mt-4 text-sm text-gray-500">
                    {language === 'fr' ? 'Téléchargement disponible sur la page dédiée' : language === 'en' ? 'Downloads available on the dedicated page' : 'Descargas disponibles en la página dedicada'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-pink)] rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === 'fr' ? 'Conseils pour les parents' : language === 'en' ? 'Tips for Parents' : 'Consejos para Padres'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr'
                  ? 'Toutes nos activités sont conçues pour développer la créativité et la motricité fine de votre enfant. Imprimez sur du papier épais pour de meilleurs résultats !'
                  : language === 'en'
                    ? 'All our activities are designed to develop your child\'s creativity and fine motor skills. Print on thick paper for best results!'
                    : '¡Todas nuestras actividades están diseñadas para desarrollar la creatividad y las habilidades motoras finas de su hijo. Imprima en papel grueso para obtener mejores resultados!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
