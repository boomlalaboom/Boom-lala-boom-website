import { Cookie } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from '../components/PageHero';

export function CookiesPolicyPage() {
    const { language } = useLanguage();

    const content = {
        fr: {
            title: 'Politique des Cookies',
            subtitle: 'Comment nous utilisons les cookies pour améliorer votre expérience',
            sections: [
                {
                    title: '1. Qu\'est-ce qu\'un cookie ?',
                    text: 'Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d\'un site. Il permet de mémoriser vos préférences et d\'analyser l\'utilisation du site.'
                },
                {
                    title: '2. Cookies utilisés',
                    text: 'Nous utilisons des cookies essentiels (techniques) et des cookies de mesure d\'audience. Ces derniers nous aident à comprendre quels contenus vous plaisent le plus.'
                },
                {
                    title: '3. Gestion des cookies',
                    text: 'Vous pouvez modifier vos choix à tout moment via le bandeau de consentement ou dans les réglages de votre navigateur.'
                },
                {
                    title: '4. Durée de conservation',
                    text: 'Les cookies sont conservés pour une durée maximale de 13 mois conformément à la législation en vigueur.'
                }
            ]
        },
        en: {
            title: 'Cookies Policy',
            subtitle: 'How we use cookies to improve your experience',
            sections: [
                {
                    title: '1. What is a cookie?',
                    text: 'A cookie is a small text file placed on your device when visiting a site. It allows remembering your preferences and analyzing site usage.'
                },
                {
                    title: '2. Cookies Used',
                    text: 'We use essential cookies (technical) and audience measurement cookies. The latter help us understand which content you like best.'
                },
                {
                    title: '3. Cookie Management',
                    text: 'You can change your choices at any time via the consent banner or in your browser settings.'
                },
                {
                    title: '4. Retention Period',
                    text: 'Cookies are stored for a maximum period of 13 months in accordance with current legislation.'
                }
            ]
        },
        es: {
            title: 'Política de Cookies',
            subtitle: 'Cómo utilizamos las cookies para mejorar su experiencia',
            sections: [
                {
                    title: '1. ¿Qué es una cookie?',
                    text: 'Una cookie es un pequeño archivo de texto que se coloca en su dispositivo al visitar un sitio. Permite recordar sus preferencias y analizar el uso del sitio.'
                },
                {
                    title: '2. Cookies utilizadas',
                    text: 'Utilizamos cookies esenciales (técnicas) y cookies de medición de audiencia. Estas últimas nos ayudan a comprender qué contenidos le gustan más.'
                },
                {
                    title: '3. Gestión de cookies',
                    text: 'Puede cambiar sus opciones en cualquier momento a través del banner de consentimiento o en la configuración de su navegador.'
                },
                {
                    title: '4. Período de conservación',
                    text: 'Las cookies se conservan durante un período máximo de 13 meses de acuerdo con la legislación vigente.'
                }
            ]
        }
    };

    const currentContent = content[language as keyof typeof content] || content.fr;

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                title={currentContent.title}
                subtitle={currentContent.subtitle}
                icon={<Cookie className="w-8 h-8 text-white" />}
                variant="cyan"
            />
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    {currentContent.sections.map((section, idx) => (
                        <section key={idx} className="mb-12 last:mb-0">
                            <h2 className="text-2xl font-bold text-[#00BCD4] mb-4">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{section.text}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
