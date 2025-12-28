import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FaqSectionProps {
  showHeader?: boolean;
}

export function FaqSection({ showHeader = true }: FaqSectionProps) {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const content = language === 'fr'
    ? {
      title: 'Foire Aux Questions (FAQ)',
      subtitle: 'Découvrez tout sur l\'éveil musical et linguistique avec BoomLaLaBoom',
      items: [
        {
          question: 'Qu\'est-ce que BoomLaLaBoom et quel est son objectif pédagogique ?',
          answer: 'BoomLaLaBoom est une plateforme d\'éveil musical et linguistique dédiée aux jeunes enfants. Notre mission est de transformer l\'apprentissage en un jeu mélodieux, en utilisant des chansons originales et des personnages attachants pour initier les petits au français, à l\'anglais et à l\'espagnol de manière naturelle et joyeuse.',
        },
        {
          question: 'Pour quelle tranche d\'âge les contenus sont-ils adaptés ?',
          answer: 'Nos contenus, notamment les chansons, jeux et activités créatives, sont spécifiquement conçus pour les enfants de 2 à 8 ans. Chaque groupe d\'âge y trouve son compte : les plus petits développent leur motricité et leur langage, tandis que les plus grands s\'initient à la structure des langues étrangères.',
        },
        {
          question: 'Comment BoomLaLaBoom favorise-t-il l\'apprentissage des langues étrangères ?',
          answer: 'Grâce à la méthode de répétition mélodique, les enfants mémorisent sans effort le vocabulaire essentiel. Nos chansons trilingues permettent de passer naturellement d\'une langue à l\'autre, renforçant ainsi la plasticité cérébrale et la curiosité culturelle dès le plus jeune âge.',
        },
        {
          question: 'Dois-je être bilingue pour accompagner mon enfant sur BoomLaLaBoom ?',
          answer: 'Pas du tout ! BoomLaLaBoom est conçu pour que les enfants puissent explorer l\'univers en toute autonomie ou avec leurs parents, même si ces derniers ne parlent pas les trois langues. Les mélodies et les visuels sont suffisamment explicites pour guider l\'enfant naturellement dans sa compréhension.',
        },
        {
          question: 'Les vidéos et jeux sont-ils sécurisés et sans publicité ?',
          answer: 'Absolument. La sécurité de vos enfants est notre priorité absolue. Tous nos contenus sont rigoureusement sélectionnés et vérifiés pour être adaptés à un jeune public. Nous offrons un environnement sain, stimulant et protégé pour une navigation en toute sérénité.',
        },
        {
          question: 'Puis-je accéder à BoomLaLaBoom sur tablette ou smartphone ?',
          answer: 'Oui, le site BoomLaLaBoom est entièrement "responsive". Cela signifie que vous pouvez en profiter pleinement sur ordinateur, tablette ou smartphone, que vous soyez à la maison ou en déplacement. L\'interface s\'adapte pour offrir une expérience ludique optimale sur tous les écrans.',
        },
        {
          question: 'À quelle fréquence ajoutez-vous de nouvelles chansons et activités ?',
          answer: 'Nous enrichissons régulièrement notre catalogue ! Notre équipe créative travaille constamment sur de nouvelles compositions musicales, de nouveaux jeux interactifs et des ressources pédagogiques inédites pour que l\'éveil de vos enfants soit une aventure sans cesse renouvelée.',
        },
        {
          question: 'Pourquoi la musique est-elle un outil si efficace pour l\'éveil linguistique ?',
          answer: 'La musique stimule plusieurs zones du cerveau simultanément. Le rythme et la mélodie facilitent la mémorisation des sons et des structures grammaticales. Associée au plaisir, elle réduit la barrière de l\'apprentissage et favorise une prononciation plus naturelle dès le plus jeune âge.',
        },
        {
          question: 'Proposez-vous des ressources pour les parents et les enseignants ?',
          answer: 'Oui ! Nous proposons une section "Ressources" riche en fiches pédagogiques, coloriages et guides d\'activités à imprimer. Ces outils permettent de prolonger l\'expérience BoomLaLaBoom en dehors des écrans, favorisant l\'interaction parent-enfant ou le travail en classe.',
        },
        {
          question: 'Quels sont les personnages principaux de l\'univers BoomLaLaBoom ?',
          answer: 'Notre univers est peuplé de personnages hauts en couleur comme Lola la Girafe, Sharky le Requin et bien d\'autres. Chaque personnage a sa propre personnalité et accompagne l\'enfant dans ses découvertes musicales et linguistiques à travers tout l\'univers.',
        }
      ],
    }
    : language === 'en'
      ? {
        title: 'Frequently Asked Questions (FAQ)',
        subtitle: 'Everything you need to know about musical and linguistic awakening with BoomLaLaBoom',
        items: [
          {
            question: 'What is BoomLaLaBoom and what is its educational goal?',
            answer: 'BoomLaLaBoom is a musical and linguistic awakening platform dedicated to young children. Our mission is to turn learning into a melodious game, using original songs and engaging characters to introduce children to French, English, and Spanish in a natural and joyful way.',
          },
          {
            question: 'What age group is the content suitable for?',
            answer: 'Our content, including songs, games, and creative activities, is specifically designed for children aged 2 to 8. Every age group benefits: the younger ones develop their motor skills and language, while the older ones get introduced to foreign language structures.',
          },
          {
            question: 'How does BoomLaLaBoom encourage foreign language learning?',
            answer: 'Through the melodic repetition method, children effortlessly memorize essential vocabulary. Our trilingual songs allow them to move naturally from one language to another, thus reinforcing brain plasticity and cultural curiosity from an early age.',
          },
          {
            question: 'Do I need to be bilingual to support my child on BoomLaLaBoom?',
            answer: 'Not at all! BoomLaLaBoom is designed so that children can explore the universe independently or with their parents, even if the parents don\'t speak all three languages. The melodies and visuals are explicit enough to naturally guide the child in their understanding.',
          },
          {
            question: 'Are the videos and games safe and ad-free?',
            answer: 'Absolutely. Your children\'s safety is our top priority. All our content is rigorously selected and verified to be suitable for a young audience. We offer a healthy, stimulating, and protected environment for worry-free browsing.',
          },
          {
            question: 'Can I access BoomLaLaBoom on a tablet or smartphone?',
            answer: 'Yes, the BoomLaLaBoom website is fully "responsive." This means you can enjoy it on a computer, tablet, or smartphone, whether you are at home or on the go. The interface adjusts to provide an optimal fun experience on all screens.',
          },
          {
            question: 'How often do you add new songs and activities?',
            answer: 'We regularly enrich our catalog! Our creative team is constantly working on new musical compositions, new interactive games, and fresh educational resources so that your children\'s awakening is a constantly renewed adventure.',
          },
          {
            question: 'Why is music such an effective tool for linguistic awakening?',
            answer: 'Music stimulates several areas of the brain simultaneously. Rhythm and melody facilitate the memorization of sounds and grammatical structures. Combined with fun, it lowers learning barriers and promotes more natural pronunciation from an early age.',
          },
          {
            question: 'Do you offer resources for parents and teachers?',
            answer: 'Yes! We offer a "Resources" section rich in educational sheets, coloring pages, and printable activity guides. These tools extend the BoomLaLaBoom experience beyond the screen, fostering parent-child interaction or classroom work.',
          },
          {
            question: 'Who are the main characters in the BoomLaLaBoom universe?',
            answer: 'Our universe is populated by colorful characters like Lola the Giraffe, Sharky the Shark, and many others. Each character has their own personality and accompanies children on their musical and linguistic discoveries across the universe.',
          }
        ],
      }
      : {
        title: 'Preguntas Frecuentes (FAQ)',
        subtitle: 'Descubre todo sobre el despertar musical y lingüístico con BoomLaLaBoom',
        items: [
          {
            question: '¿Qué es BoomLaLaBoom y cuál es su objetivo pedagógico?',
            answer: 'BoomLaLaBoom es una plataforma de despertar musical y lingüístico dedicada a los niños pequeños. Nuestra misión es transformar el aprendizaje en un juego melodioso, utilizando canciones originales y personajes entrañables para iniciar a los más pequeños en el francés, el inglés y el español de manera natural y alegre.',
          },
          {
            question: '¿Para qué grupo de edad es adecuado el contenido?',
            answer: 'Nuestros contenidos, incluyendo canciones, juegos y actividades creativas, están diseñados específicamente para niños de 2 a 8 años. Cada grupo de edad encuentra su lugar: los más pequeños desarrollan su motricidad y lenguaje, mientras que los más grandes se inician en la estructura de las lenguas extranjeras.',
          },
          {
            question: '¿Cómo fomenta BoomLaLaBoom el aprendizaje de lenguas extranjeras?',
            answer: 'Gracias al método de repetición melódica, los niños memorizan sin esfuerzo el vocabulario esencial. Nuestras canciones trilingües permiten pasar de forma natural de un idioma a otro, reforzando así la plasticidad cerebral y la curiosidad cultural desde una edad temprana.',
          },
          {
            question: '¿Debo ser bilingüe para acompañar a mi hijo en BoomLaLaBoom?',
            answer: '¡Para nada! BoomLaLaBoom está diseñado para que los niños puedan explorar el universo de forma autónoma o con sus padres, incluso si estos últimos no hablan los tres idiomas. Las melodías y los visuales son lo suficientemente explícitos como para guiar al niño de forma natural en su comprensión.',
          },
          {
            question: '¿Son los videos y juegos seguros y sin publicidad?',
            answer: 'Absolutamente. La seguridad de sus hijos es nuestra prioridad absoluta. Todos nuestros contenidos son rigurosamente seleccionados y verificados para ser adecuados a un público joven. Ofrecemos un entorno sano, estimulante y protegido para una navegación tranquila.',
          },
          {
            question: '¿Puedo acceder a BoomLaLaBoom en tableta o smartphone?',
            answer: 'Sí, el sitio web de BoomLaLaBoom es totalmente "responsive". Esto significa que puede disfrutarlo plenamente en una computadora, tableta o teléfono inteligente, ya sea que esté en casa o de viaje. La interfaz se adapta para ofrecer una experiencia lúdica óptima en todas las pantallas.',
          },
          {
            question: '¿Con qué frecuencia añaden nuevas canciones y actividades?',
            answer: '¡Enriquecemos regularmente nuestro catálogo! Nuestro equipo creativo trabaja constantemente en nuevas composiciones musicales, nuevos juegos interactivos y recursos educativos inéditos para que el despertar de sus hijos sea una aventura en constante renovación.',
          },
          {
            question: '¿Por qué la música es una herramienta tan eficaz para el despertar lingüístico?',
            answer: 'La música estimula varias áreas del cerebro simultáneamente. El ritmo y la melodía facilitan la memorización de sonidos y estructuras gramaticales. Asociada al placer, reduce la barrera del aprendizaje y favorece una pronunciación más natural desde una edad temprana.',
          },
          {
            question: '¿Ofrecen recursos para padres y maestros?',
            answer: '¡Sí! Ofrecemos una sección de "Recursos" rica en fichas pedagógicas, dibujos para colorear y guías de actividades imprimibles. Estas herramientas permiten prolongar la experiencia BoomLaLaBoom fuera de las pantallas, fomentando la interacción padre-hijo o el trabajo en clase.',
          },
          {
            question: '¿Quiénes son los personajes principales del universo BoomLaLaBoom?',
            answer: 'Nuestro universo está poblado por personajes coloridos como Lola la Jirafa, Sharky el Tiburón y muchos otros. Cada personaje tiene su propia personalidad y acompaña al niño en sus descubrimientos musicales y lingüísticos por todo el universo.',
          }
        ],
      };

  // Build the JSON-LD FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-16 px-4 section-bg-yellow screen-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

        <div className="max-w-3xl mx-auto space-y-4">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h3 className={`text-lg md:text-xl font-bold transition-colors ${openIndex === index ? 'text-[var(--brand-blue)]' : 'text-gray-800'}`}>
                  {item.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-[var(--brand-blue)] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 text-base md:text-lg">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 italic">
            {language === 'fr'
              ? 'Vous avez d\'autres questions ?'
              : language === 'en'
                ? 'Have more questions?'
                : '¿Tiene más preguntas?'}
            <a href="#contact" className="ml-2 text-[var(--brand-blue)] font-bold hover:underline">
              {language === 'fr' ? 'Contactez-nous !' : language === 'en' ? 'Contact us!' : '¡Contáctenos!'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
