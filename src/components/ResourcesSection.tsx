import { Scissors, BookOpen, Music, Gamepad2 } from 'lucide-react';
import { Link } from './LocalizedLink';
import { useLanguage } from '../contexts/LanguageContext';

interface ResourcesSectionProps {
  showHeader?: boolean;
}

export function ResourcesSection({ showHeader = true }: ResourcesSectionProps) {
  const { language, t } = useLanguage();

  const content = language === 'fr'
    ? {
      title: 'Ressources pour la maison',
      subtitle: 'Des activites imprimables et des idees simples pour continuer a la maison',
      items: [
        {
          icon: Scissors,
          title: 'Coloriages et decoupages',
          description: 'Des fiches creatives pour travailler la motricite fine.',
        },
        {
          icon: BookOpen,
          title: 'Cartes de vocabulaire',
          description: 'Images et mots pour apprendre les premiers sons et objets.',
        },
        {
          icon: Music,
          title: 'Rituels du quotidien',
          description: 'Petites chansons pour le rangement, le dodo et le bain.',
        },
        {
          icon: Gamepad2,
          title: 'Jeux de mouvement',
          description: 'Defis corporels et danses pour bouger en musique.',
        },
      ],
      ctaTitle: 'Envie de recevoir les packs ?',
      ctaText: 'Ecrivez-nous pour acceder aux ressources et aux mises a jour.',
    }
    : language === 'en'
      ? {
        title: 'Resources for home',
        subtitle: 'Printable activities and simple ideas to keep learning at home',
        items: [
          {
            icon: Scissors,
            title: 'Coloring and crafts',
            description: 'Creative worksheets to build fine motor skills.',
          },
          {
            icon: BookOpen,
            title: 'Vocabulary cards',
            description: 'Pictures and words to learn early sounds and objects.',
          },
          {
            icon: Music,
            title: 'Daily routines',
            description: 'Short songs for tidying up, bedtime, and bath time.',
          },
          {
            icon: Gamepad2,
            title: 'Movement games',
            description: 'Body challenges and dances to move with music.',
          },
        ],
        ctaTitle: 'Want the printable packs?',
        ctaText: 'Write to us to access the resources and updates.',
      }
      : {
        title: 'Recursos para casa',
        subtitle: 'Actividades imprimibles e ideas simples para seguir aprendiendo',
        items: [
          {
            icon: Scissors,
            title: 'Colorear y recortar',
            description: 'Fichas creativas para trabajar la motricidad fina.',
          },
          {
            icon: BookOpen,
            title: 'Tarjetas de vocabulario',
            description: 'Imagenes y palabras para aprender sonidos y objetos.',
          },
          {
            icon: Music,
            title: 'Rutinas diarias',
            description: 'Canciones cortas para ordenar, dormir y el bano.',
          },
          {
            icon: Gamepad2,
            title: 'Juegos de movimiento',
            description: 'Retos corporales y bailes para moverse con musica.',
          },
        ],
        ctaTitle: 'Quieres los packs imprimibles?',
        ctaText: 'Escribenos para acceder a los recursos y novedades.',
      };

  return (
    <section id="resources" className="py-16 px-4 section-bg-yellow screen-section">
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-teal)] rounded-full mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">{content.title}</h2>
            <p className="text-xl subtitle-text">{content.subtitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {content.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="card p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[rgba(122,201,67,0.2)] to-[rgba(34,181,115,0.2)] rounded-full mb-4">
                  <Icon className="w-6 h-6 text-[var(--brand-green)]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-3">{content.ctaTitle}</h3>
          <p className="text-gray-600 mb-6">{content.ctaText}</p>
          <Link to="/contact" className="btn-primary inline-flex justify-center">
            {t('nav_contact')}
          </Link>
        </div>
      </div>
    </section>
  );
}
