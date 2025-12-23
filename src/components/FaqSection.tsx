import { Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FaqSectionProps {
  showHeader?: boolean;
}

export function FaqSection({ showHeader = true }: FaqSectionProps) {
  const { language } = useLanguage();

  const content = language === 'fr'
    ? {
        title: 'Questions frequentes',
        subtitle: 'Tout ce qu\'il faut savoir sur BoomLaLaBoom',
        items: [
          {
            question: 'Pour quel age est BoomLaLaBoom ?',
            answer: 'Nos contenus sont pensés pour les enfants de 2 a 8 ans.',
          },
          {
            question: 'Les contenus sont-ils securises ?',
            answer: 'Oui, chaque video et activite est verifiee pour rester adaptee aux enfants.',
          },
          {
            question: 'Comment apprendre les langues avec les chansons ?',
            answer: 'Les comptines repetent le vocabulaire cle en francais, anglais et espagnol.',
          },
          {
            question: 'Y a-t-il des ressources imprimables ?',
            answer: 'Oui, nous preparons des packs de coloriages et d\'activites maison.',
          },
          {
            question: 'Puis-je proposer une idee de chanson ?',
            answer: 'Avec plaisir. Contactez-nous pour partager vos idees.',
          },
        ],
      }
    : language === 'en'
    ? {
        title: 'Frequently asked questions',
        subtitle: 'Everything you need to know about BoomLaLaBoom',
        items: [
          {
            question: 'What ages is BoomLaLaBoom for?',
            answer: 'Our content is designed for kids ages 2 to 8.',
          },
          {
            question: 'Is the content safe?',
            answer: 'Yes, each video and activity is reviewed to stay kid-friendly.',
          },
          {
            question: 'How do songs help with languages?',
            answer: 'Nursery rhymes repeat key vocabulary in French, English, and Spanish.',
          },
          {
            question: 'Are there printable resources?',
            answer: 'Yes, we are preparing coloring and at-home activity packs.',
          },
          {
            question: 'Can I suggest a song idea?',
            answer: 'Absolutely. Contact us to share your ideas.',
          },
        ],
      }
    : {
        title: 'Preguntas frecuentes',
        subtitle: 'Todo lo que necesitas saber sobre BoomLaLaBoom',
        items: [
          {
            question: 'Para que edades es BoomLaLaBoom?',
            answer: 'Nuestro contenido esta pensado para ninos de 2 a 8 anos.',
          },
          {
            question: 'El contenido es seguro?',
            answer: 'Si, cada video y actividad se revisa para ser apta para ninos.',
          },
          {
            question: 'Como ayudan las canciones con los idiomas?',
            answer: 'Las canciones repiten vocabulario clave en frances, ingles y espanol.',
          },
          {
            question: 'Hay recursos imprimibles?',
            answer: 'Si, estamos preparando packs de colorear y actividades en casa.',
          },
          {
            question: 'Puedo sugerir una cancion?',
            answer: 'Claro. Contactanos para compartir tus ideas.',
          },
        ],
      };

  return (
    <section id="faq" className="py-16 px-4 section-bg-yellow screen-section">
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-sky)] rounded-full mb-4">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">{content.title}</h2>
            <p className="text-xl subtitle-text">{content.subtitle}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid gap-4">
          {content.items.map((item, index) => (
            <div
              key={item.question}
              className="bg-white rounded-3xl p-6 shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {item.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
