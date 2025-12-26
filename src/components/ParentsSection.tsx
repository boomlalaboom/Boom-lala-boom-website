import { Info, Shield, Heart, BookOpen, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ParentsSectionProps {
  showHeader?: boolean;
  variant?: 'blue' | 'yellow';
  onNewsletterClick?: () => void;
}

export function ParentsSection({
  showHeader = true,
  variant = 'blue',
  onNewsletterClick
}: ParentsSectionProps) {
  const { language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: language === 'fr' ? 'Contenu Sécurisé' : language === 'en' ? 'Safe Content' : 'Contenido Seguro',
      description: language === 'fr'
        ? 'Tous nos contenus sont adaptés aux enfants et respectent les normes COPPA et RGPD.'
        : language === 'en'
          ? 'All our content is child-friendly and complies with COPPA and GDPR standards.'
          : 'Todo nuestro contenido es apropiado para niños y cumple con los estándares COPPA y GDPR.',
    },
    {
      icon: BookOpen,
      title: language === 'fr' ? 'Éducatif' : language === 'en' ? 'Educational' : 'Educativo',
      description: language === 'fr'
        ? 'Nos chansons et jeux favorisent l\'apprentissage des langues, des couleurs et des formes.'
        : language === 'en'
          ? 'Our songs and games promote learning languages, colors and shapes.'
          : 'Nuestras canciones y juegos promueven el aprendizaje de idiomas, colores y formas.',
    },
    {
      icon: Heart,
      title: language === 'fr' ? 'Créé avec Amour' : language === 'en' ? 'Made with Love' : 'Hecho con Amor',
      description: language === 'fr'
        ? 'Chaque contenu est conçu par des professionnels de l\'éducation et des parents.'
        : language === 'en'
          ? 'Every content is designed by education professionals and parents.'
          : 'Cada contenido es diseñado por profesionales de la educación y padres.',
    },
  ];

  return (
    <section
      id="parents"
      className={`py-16 px-4 screen-section ${variant === 'blue' ? 'section-bg-blue' : 'section-bg-yellow'}`}
    >
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-pink)] rounded-full mb-4">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">
              {language === 'fr' ? 'Espace Parents' : language === 'en' ? 'Parents Area' : 'Área de Padres'}
            </h2>
            <p className="text-xl subtitle-text">
              {language === 'fr'
                ? 'Tout ce que vous devez savoir sur BoomLaLaBoom'
                : language === 'en'
                  ? 'Everything you need to know about BoomLaLaBoom'
                  : 'Todo lo que necesita saber sobre BoomLaLaBoom'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[rgba(63,169,245,0.2)] to-[rgba(255,123,172,0.2)] rounded-full mb-4">
                    <Icon className="w-8 h-8 text-[var(--brand-blue)]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {language === 'fr'
                ? 'Notre Mission'
                : language === 'en'
                  ? 'Our Mission'
                  : 'Nuestra Misión'}
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {language === 'fr'
                ? 'BoomLaLaBoom a pour mission de créer un environnement d\'apprentissage joyeux et stimulant pour les enfants du monde entier. À travers nos chansons multilingues, nos jeux éducatifs et nos personnages attachants, nous aidons les enfants à développer leurs compétences linguistiques, cognitives et créatives tout en s\'amusant.'
                : language === 'en'
                  ? 'BoomLaLaBoom\'s mission is to create a joyful and stimulating learning environment for children around the world. Through our multilingual songs, educational games and lovable characters, we help children develop their linguistic, cognitive and creative skills while having fun.'
                  : 'La misión de BoomLaLaBoom es crear un ambiente de aprendizaje alegre y estimulante para niños de todo el mundo. A través de nuestras canciones multilingües, juegos educativos y personajes adorables, ayudamos a los niños a desarrollar sus habilidades lingüísticas, cognitivas y creativas mientras se divierten.'}
            </p>

            <div className="bg-gradient-to-r from-[rgba(63,169,245,0.12)] to-[rgba(255,123,172,0.12)] rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                {language === 'fr'
                  ? 'Bénéfices pour votre enfant'
                  : language === 'en'
                    ? 'Benefits for Your Child'
                    : 'Beneficios para su Hijo'}
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Apprentissage naturel de 3 langues (FR/EN/ES)'
                      : language === 'en'
                        ? 'Natural learning of 3 languages (FR/EN/ES)'
                        : 'Aprendizaje natural de 3 idiomas (FR/EN/ES)'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Développement de la coordination et de la motricité'
                      : language === 'en'
                        ? 'Development of coordination and motor skills'
                        : 'Desarrollo de la coordinación y habilidades motoras'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Stimulation de la créativité et de l\'imagination'
                      : language === 'en'
                        ? 'Stimulation of creativity and imagination'
                        : 'Estimulación de la creatividad y la imaginación'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Renforcement de la mémoire et de l\'attention'
                      : language === 'en'
                        ? 'Strengthening of memory and attention'
                        : 'Fortalecimiento de la memoria y la atención'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onNewsletterClick}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-pink)] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>
                  {language === 'fr'
                    ? 'Inscrivez-vous à notre Newsletter'
                    : language === 'en'
                      ? 'Subscribe to our Newsletter'
                      : 'Suscríbase a nuestro Boletín'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
