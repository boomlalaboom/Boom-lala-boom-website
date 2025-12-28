import { FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from '../components/PageHero';

export function LegalNoticePage() {
    const { language, t } = useLanguage();

    const content = {
        fr: {
            title: 'Mentions Légales',
            subtitle: 'Informations obligatoires concernant l\'éditeur du site',
            sections: [
                {
                    title: '1. Éditeur du site',
                    text: 'Le site BoomLaLaBoom est édité par WebFitYou, agissant en tant que professionnel libéral. Siège social : 96 nahalat binyamin Tel aviv. Email : contact@boomlalaboom.com.'
                },
                {
                    title: '2. Hébergement',
                    text: 'Le site est hébergé par Netlify, Inc., situé à San Francisco, Californie, USA.'
                },
                {
                    title: '3. Propriété intellectuelle',
                    text: 'L\'ensemble des éléments présents sur le site (textes, logos, chansons, personnages, jeux) est la propriété exclusive de BoomLaLaBoom ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.'
                },
                {
                    title: '4. Limitation de responsabilité',
                    text: 'BoomLaLaBoom s\'efforce d\'assurer l\'exactitude des informations diffusées mais ne saurait être tenu responsable des erreurs ou omissions.'
                }
            ]
        },
        en: {
            title: 'Legal Mentions',
            subtitle: 'Required information about the website editor',
            sections: [
                {
                    title: '1. Site Editor',
                    text: 'The BoomLaLaBoom website is edited by WebFitYou, acting as a professional. Registered office: 96 nahalat binyamin Tel aviv. Email: contact@boomlalaboom.com.'
                },
                {
                    title: '2. Hosting',
                    text: 'The site is hosted by Netlify, Inc., located in San Francisco, California, USA.'
                },
                {
                    title: '3. Intellectual Property',
                    text: 'All elements on the site (texts, logos, songs, characters, games) are the exclusive property of BoomLaLaBoom or its partners. Any reproduction, even partial, is prohibited without prior authorization.'
                },
                {
                    title: '4. Limitation of Liability',
                    text: 'BoomLaLaBoom strives to ensure the accuracy of the information provided but cannot be held responsible for errors or omissions.'
                }
            ]
        },
        es: {
            title: 'Avisos Legales',
            subtitle: 'Información obligatoria sobre el editor del sitio',
            sections: [
                {
                    title: '1. Editor del sitio',
                    text: 'El sitio web BoomLaLaBoom es editado por WebFitYou, actuando como profesional. Domicilio social: 96 nahalat binyamin Tel aviv. Correo electrónico: contact@boomlalaboom.com.'
                },
                {
                    title: '2. Alojamiento',
                    text: 'El sitio está alojado por Netlify, Inc., con sede en San Francisco, California, EE. UU.'
                },
                {
                    title: '3. Propiedad intelectual',
                    text: 'Todos los elementos presentes en el sitio (textos, logotipos, canciones, personajes, juegos) son propiedad exclusiva de BoomLaLaBoom o de sus socios. Queda prohibida cualquier reproducción, incluso parcial, sin autorización previa.'
                },
                {
                    title: '4. Limitación de responsabilidad',
                    text: 'BoomLaLaBoom se esfuerza por garantizar la precisión de la información difundida, pero no se hace responsable de errores u omisiones.'
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
                icon={<FileText className="w-8 h-8 text-white" />}
                variant="blue"
            />
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    {currentContent.sections.map((section, idx) => (
                        <section key={idx} className="mb-12 last:mb-0">
                            <h2 className="text-2xl font-bold text-[#0457BA] mb-4">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{section.text}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
