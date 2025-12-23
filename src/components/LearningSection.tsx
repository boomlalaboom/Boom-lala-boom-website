import { BookOpen, Music, Gamepad2, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LearningSectionProps {
  showHeader?: boolean;
}

export function LearningSection({ showHeader = true }: LearningSectionProps) {
  const { language } = useLanguage();

  const content = language === 'fr'
    ? {
        title: 'Apprendre en s\'amusant',
        subtitle: 'Un parcours ludique pour developper le langage, la motricite et l\'imagination',
        pillars: [
          {
            icon: BookOpen,
            title: 'Langues et vocabulaire',
            description: 'Chansons en francais, anglais et espagnol pour enrichir le vocabulaire.',
          },
          {
            icon: Music,
            title: 'Musique et rythme',
            description: 'Des jeux sonores pour reconnaitre les sons, les instruments et les tempos.',
          },
          {
            icon: Gamepad2,
            title: 'Logique et coordination',
            description: 'Des activites simples pour exercer la memoire, la logique et la precision.',
          },
          {
            icon: Heart,
            title: 'Emotions et partage',
            description: 'Des histoires pour comprendre les emotions et apprendre a cooperer.',
          },
        ],
        pathsTitle: 'Parcours par age',
        paths: [
          {
            title: '2-3 ans : decouverte',
            description: 'Repetition, chansons courtes, gestes et images pour apprendre en douceur.',
          },
          {
            title: '4-5 ans : exploration',
            description: 'Jeux d\'ecoute, comptines a repondre et premiers quiz visuels.',
          },
          {
            title: '6-8 ans : creation',
            description: 'Jeux de roles, activites creatives et petites missions en equipe.',
          },
        ],
      }
    : language === 'en'
    ? {
        title: 'Learning through play',
        subtitle: 'A fun journey to grow language, motor skills, and imagination',
        pillars: [
          {
            icon: BookOpen,
            title: 'Languages and vocabulary',
            description: 'Songs in French, English, and Spanish to expand vocabulary.',
          },
          {
            icon: Music,
            title: 'Music and rhythm',
            description: 'Sound games to recognize instruments, tempo, and patterns.',
          },
          {
            icon: Gamepad2,
            title: 'Logic and coordination',
            description: 'Simple activities to train memory, logic, and precision.',
          },
          {
            icon: Heart,
            title: 'Emotions and sharing',
            description: 'Stories that help kids understand feelings and cooperate.',
          },
        ],
        pathsTitle: 'Age-based paths',
        paths: [
          {
            title: 'Ages 2-3: discovery',
            description: 'Repetition, short songs, gestures, and images to learn gently.',
          },
          {
            title: 'Ages 4-5: exploration',
            description: 'Listening games, call-and-response rhymes, and visual quizzes.',
          },
          {
            title: 'Ages 6-8: creation',
            description: 'Role play, creative activities, and small team missions.',
          },
        ],
      }
    : {
        title: 'Aprender jugando',
        subtitle: 'Un recorrido divertido para desarrollar el lenguaje, la motricidad y la imaginacion',
        pillars: [
          {
            icon: BookOpen,
            title: 'Idiomas y vocabulario',
            description: 'Canciones en frances, ingles y espanol para ampliar vocabulario.',
          },
          {
            icon: Music,
            title: 'Musica y ritmo',
            description: 'Juegos sonoros para reconocer instrumentos, tempo y patrones.',
          },
          {
            icon: Gamepad2,
            title: 'Logica y coordinacion',
            description: 'Actividades simples para entrenar memoria, logica y precision.',
          },
          {
            icon: Heart,
            title: 'Emociones y convivencia',
            description: 'Historias que ayudan a comprender emociones y cooperar.',
          },
        ],
        pathsTitle: 'Recorridos por edad',
        paths: [
          {
            title: '2-3 anos: descubrimiento',
            description: 'Repeticion, canciones cortas, gestos e imagenes para aprender.',
          },
          {
            title: '4-5 anos: exploracion',
            description: 'Juegos de escucha, rimas de respuesta y quizzes visuales.',
          },
          {
            title: '6-8 anos: creacion',
            description: 'Juegos de rol, actividades creativas y misiones en equipo.',
          },
        ],
      };

  return (
    <section id="learning" className="py-16 px-4 section-bg-yellow screen-section">
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-green)] rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">{content.title}</h2>
            <p className="text-xl subtitle-text">{content.subtitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {content.pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="card p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[rgba(63,169,245,0.2)] to-[rgba(122,201,67,0.2)] rounded-full mb-4">
                  <Icon className="w-6 h-6 text-[var(--brand-blue)]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
            {content.pathsTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.paths.map((path) => (
              <div key={path.title} className="bg-gradient-to-br from-[rgba(63,169,245,0.12)] to-[rgba(122,201,67,0.12)] rounded-2xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {path.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {path.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
