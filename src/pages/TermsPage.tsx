import { Gavel } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from '../components/PageHero';

export function TermsPage() {
    const { language } = useLanguage();

    const content = {
        fr: {
            title: 'Conditions Générales',
            subtitle: 'Les règles d\'utilisation de notre plateforme',
            sections: [
                {
                    title: '1. Acceptation des conditions',
                    text: 'L\'accès au site BoomLaLaBoom implique l\'acceptation pleine et entière des présentes conditions générales d\'utilisation.'
                },
                {
                    title: '2. Services fournis',
                    text: 'BoomLaLaBoom propose des contenus ludo-éducatifs (vidéos, jeux, activités). Bien que nous fassions de notre mieux, nous ne garantissons pas que les services seront ininterrompus ou sans erreur.'
                },
                {
                    title: '3. Utilisation autorisée',
                    text: 'Les utilisateurs s\'engagent à utiliser le site de manière licite, pour un usage strictement personnel. Toute utilisation à des fins commerciales ou publicitaires est interdite sans accord écrit.'
                },
                {
                    title: '4. Droit applicable',
                    text: 'Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort de la cour d\'appel [A compléter].'
                }
            ]
        },
        en: {
            title: 'Terms of Service',
            subtitle: 'The rules for using our platform',
            sections: [
                {
                    title: '1. Acceptance of Terms',
                    text: 'Access to the BoomLaLaBoom site implies full and complete acceptance of these general terms of use.'
                },
                {
                    title: '2. Services Provided',
                    text: 'BoomLaLaBoom offers edutainment content (videos, games, activities). While we do our best, we do not guarantee that the services will be uninterrupted or error-free.'
                },
                {
                    title: '3. Authorized Use',
                    text: 'Users agree to use the site lawfully, for strictly personal use. Any use for commercial or advertising purposes is prohibited without written agreement.'
                },
                {
                    title: '4. Applicable Law',
                    text: 'These conditions are governed by French law. In the event of a dispute, the competent courts will be those within the jurisdiction of the [To be completed] Court of Appeal.'
                }
            ]
        },
        es: {
            title: 'Condiciones Generales',
            subtitle: 'Las reglas de uso de nuestra plataforma',
            sections: [
                {
                    title: '1. Aceptación de las condiciones',
                    text: 'El acceso al sitio BoomLaLaBoom implica la aceptación plena y total de estas condiciones generales de uso.'
                },
                {
                    title: '2. Servicios prestados',
                    text: 'BoomLaLaBoom ofrece contenidos ludo-educativos (vídeos, juegos, actividades). Aunque hacemos todo lo posible, no garantizamos que los servicios sean ininterrumpidos o libres de errores.'
                },
                {
                    title: '3. Uso autorizado',
                    text: 'Los usuarios se comprometen a utilizar el sitio de forma lícita, para un uso estrictamente personal. Queda prohibido cualquier uso con fines comerciales o publicitarios sin acuerdo por escrito.'
                },
                {
                    title: '4. Ley aplicable',
                    text: 'Estas condiciones se rigen por la ley francesa. En caso de litigio, los tribunales competentes serán los del ámbito de la Audiencia Provincial de [A completar].'
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
                icon={<Gavel className="w-8 h-8 text-white" />}
                variant="yellow"
            />
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    {currentContent.sections.map((section, idx) => (
                        <section key={idx} className="mb-12 last:mb-0">
                            <h2 className="text-2xl font-bold text-[#FF9F00] mb-4">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{section.text}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
