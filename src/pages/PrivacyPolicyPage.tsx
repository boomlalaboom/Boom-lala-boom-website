import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from '../components/PageHero';

export function PrivacyPolicyPage() {
    const { language } = useLanguage();

    const content = {
        fr: {
            title: 'Politique de Confidentialité',
            subtitle: 'Comment nous protégeons vos données et votre vie privée',
            sections: [
                {
                    title: '1. Introduction',
                    text: 'BoomLaLaBoom accorde une importance capitale à la protection de la vie privée, en particulier celle des enfants. Cette politique explique comment nous traitons vos informations.'
                },
                {
                    title: '2. Collecte des données',
                    text: 'Nous collectons uniquement les données nécessaires au bon fonctionnement du site (par exemple, via le formulaire de contact). Nous ne collectons aucune donnée personnelle auprès des enfants naviguant sur le site.'
                },
                {
                    title: '3. Utilisation des données',
                    text: 'Vos données sont utilisées exclusivement pour répondre à vos demandes ou améliorer votre expérience sur le site. Elles ne sont jamais vendues ou partagées à des fins commerciales avec des tiers.'
                },
                {
                    title: '4. Vos droits',
                    text: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles. Contactez-nous à contact@boomlalaboom.com pour toute demande.'
                }
            ]
        },
        en: {
            title: 'Privacy Policy',
            subtitle: 'How we protect your data and privacy',
            sections: [
                {
                    title: '1. Introduction',
                    text: 'BoomLaLaBoom attaches paramount importance to the protection of privacy, especially that of children. This policy explains how we handle your information.'
                },
                {
                    title: '2. Data Collection',
                    text: 'We only collect data necessary for the proper functioning of the site (for example, via the contact form). We do not collect any personal data from children browsing the site.'
                },
                {
                    title: '3. Data Use',
                    text: 'Your data is used exclusively to respond to your requests or improve your experience on the site. It is never sold or shared for commercial purposes with third parties.'
                },
                {
                    title: '4. Your Rights',
                    text: 'In accordance with the GDPR, you have the right to access, rectify, and delete your personal data. Contact us at contact@boomlalaboom.com for any request.'
                }
            ]
        },
        es: {
            title: 'Política de Privacidad',
            subtitle: 'Cómo protegemos sus datos y su privacidad',
            sections: [
                {
                    title: '1. Introducción',
                    text: 'BoomLaLaBoom concede una importancia capital a la protección de la privacidad, especialmente la de los niños. Esta política explica cómo tratamos su información.'
                },
                {
                    title: '2. Recogida de datos',
                    text: 'Solo recopilamos los datos necesarios para el buen funcionamiento del sitio (por ejemplo, a través del formulario de contacto). No recopilamos ningún dato personal de los niños que navegan por el sitio.'
                },
                {
                    title: '3. Uso de los datos',
                    text: 'Sus datos se utilizan exclusivamente para responder a sus solicitudes o mejorar su experiencia en el sitio. Nunca se venden ni se comparten con fines comerciales con terceros.'
                },
                {
                    title: '4. Sus derechos',
                    text: 'De acuerdo con el RGPD, usted tiene derecho a acceder, rectificar y suprimir sus datos personales. Póngase en contacto con nosotros en contact@boomlalaboom.com para cualquier solicitud.'
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
                icon={<ShieldCheck className="w-8 h-8 text-white" />}
                variant="purple"
            />
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    {currentContent.sections.map((section, idx) => (
                        <section key={idx} className="mb-12 last:mb-0">
                            <h2 className="text-2xl font-bold text-[#E91E63] mb-4">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{section.text}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
