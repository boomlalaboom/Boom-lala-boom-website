import { Sparkles, Music, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutSectionProps {
  showHeader?: boolean;
}

export function AboutSection({ showHeader = true }: AboutSectionProps) {
  const { language } = useLanguage();

  const content = language === 'fr'
    ? {
        title: 'L\'univers BoomLaLaBoom',
        subtitle: 'Un site educatif pour enfants avec comptines, jeux et personnages bienveillants',
        intro:
          'BoomLaLaBoom est un monde musical pense pour les enfants de 2 a 8 ans. Nos contenus aident a apprendre les langues, le rythme, les couleurs et les emotions.',
        details:
          'Chaque chanson et activite est concue pour renforcer la confiance et la curiosite. Les familles y trouvent des contenus surs et faciles a partager.',
        cards: [
          {
            icon: Music,
            title: 'Comptines originales',
            description:
              'Des chansons courtes et rythmees pour memoriser le vocabulaire, les nombres et les routines.',
          },
          {
            icon: Sparkles,
            title: 'Jeux educatifs',
            description:
              'Des mini-jeux pour entrainer la logique, l\'ecoute et la coordination.',
          },
          {
            icon: Users,
            title: 'Personnages adores',
            description:
              'Des amis attachants qui accompagnent l\'enfant dans ses decouvertes.',
          },
        ],
      }
    : language === 'en'
    ? {
        title: 'The BoomLaLaBoom Universe',
        subtitle: 'An educational kids site with songs, games, and kind characters',
        intro:
          'BoomLaLaBoom is a musical world designed for kids ages 2 to 8. Our content supports language learning, rhythm, colors, and emotions.',
        details:
          'Every song and activity is built to grow confidence and curiosity. Families enjoy safe content that is easy to share together.',
        cards: [
          {
            icon: Music,
            title: 'Original nursery rhymes',
            description:
              'Short, catchy songs to memorize vocabulary, numbers, and daily routines.',
          },
          {
            icon: Sparkles,
            title: 'Educational games',
            description:
              'Mini-games that train logic, listening skills, and coordination.',
          },
          {
            icon: Users,
            title: 'Beloved characters',
            description:
              'Friendly companions who guide kids through fun discoveries.',
          },
        ],
      }
    : {
        title: 'El universo BoomLaLaBoom',
        subtitle: 'Un sitio educativo para ninos con canciones, juegos y personajes amables',
        intro:
          'BoomLaLaBoom es un mundo musical creado para ninos de 2 a 8 anos. Nuestro contenido apoya el aprendizaje de idiomas, el ritmo, los colores y las emociones.',
        details:
          'Cada cancion y actividad ayuda a desarrollar confianza y curiosidad. Las familias encuentran contenido seguro y facil de compartir.',
        cards: [
          {
            icon: Music,
            title: 'Canciones originales',
            description:
              'Canciones cortas y pegadizas para memorizar vocabulario, numeros y rutinas.',
          },
          {
            icon: Sparkles,
            title: 'Juegos educativos',
            description:
              'Mini-juegos para entrenar la logica, la escucha y la coordinacion.',
          },
          {
            icon: Users,
            title: 'Personajes queridos',
            description:
              'Amigos cercanos que acompanhan a los ninos en sus descubrimientos.',
          },
        ],
      };

  return (
    <section id="about" className="py-16 px-4 section-bg-yellow screen-section">
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">{content.title}</h2>
            <p className="text-xl subtitle-text">{content.subtitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {content.cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="card p-8 bg-white animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[rgba(255,123,172,0.2)] to-[rgba(255,147,30,0.2)] rounded-full mb-4">
                    <Icon className="w-7 h-7 text-[var(--brand-pink)]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {content.intro}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.details}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
