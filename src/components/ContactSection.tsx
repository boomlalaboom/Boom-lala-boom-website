import { Mail, Heart, Sparkles, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactSectionProps {
  showHeader?: boolean;
  variant?: 'blue' | 'yellow';
  onNewsletterClick?: () => void;
}

export function ContactSection({
  showHeader = true,
  variant = 'blue',
  onNewsletterClick
}: ContactSectionProps) {
  const { language } = useLanguage();

  const content = language === 'fr'
    ? {
      title: 'Contact',
      subtitle: 'Une question ou une idee ? Parlons-en.',
      infoTitle: 'Ecrivez-nous',
      infoText: 'Nous repondons aux parents, enseignants et partenaires.',
      emailLabel: 'Email',
      emailValue: 'contact@boomlalaboom.com',
      phoneLabel: 'Telephone',
      phoneValue: '+33 1 42 80 02 01',
      addressLabel: 'Adresse',
      addressValue: '5 Rue de Charonne, 75011 Paris, France',
      hoursLabel: 'Horaires',
      hoursValue: 'Du lundi au vendredi, 9h-18h',
      ctaTitle: 'Rejoindre la communaute',
      ctaText: 'Recevez les nouveautes, chansons et activites.',
      ctaButton: 'Recevoir les nouvelles',
    }
    : language === 'en'
      ? {
        title: 'Contact',
        subtitle: 'Have a question or an idea? Let\'s talk.',
        infoTitle: 'Write to us',
        infoText: 'We respond to parents, teachers, and partners.',
        emailLabel: 'Email',
        emailValue: 'contact@boomlalaboom.com',
        phoneLabel: 'Phone',
        phoneValue: '+33 1 42 80 02 01',
        addressLabel: 'Address',
        addressValue: '5 Rue de Charonne, 75011 Paris, France',
        hoursLabel: 'Hours',
        hoursValue: 'Monday to Friday, 9am-6pm',
        ctaTitle: 'Join the community',
        ctaText: 'Get news, songs, and new activities.',
        ctaButton: 'Get updates',
      }
      : {
        title: 'Contacto',
        subtitle: 'Tienes una pregunta o una idea? Hablemos.',
        infoTitle: 'Escribenos',
        infoText: 'Respondemos a familias, docentes y socios.',
        emailLabel: 'Email',
        emailValue: 'contact@boomlalaboom.com',
        phoneLabel: 'Telefono',
        phoneValue: '+33 1 42 80 02 01',
        addressLabel: 'Direccion',
        addressValue: '5 Rue de Charonne, 75011 Paris, Francia',
        hoursLabel: 'Horario',
        hoursValue: 'Lunes a viernes, 9h-18h',
        ctaTitle: 'Unete a la comunidad',
        ctaText: 'Recibe novedades, canciones y actividades.',
        ctaButton: 'Recibir novedades',
      };

  return (
    <section
      id="contact"
      className={`py-16 px-4 screen-section ${variant === 'blue' ? 'section-bg-blue' : 'section-bg-yellow'}`}
    >
      <div className="container mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="section-title">{content.title}</h2>
            <p className="text-xl subtitle-text">{content.subtitle}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-[var(--brand-pink)]" />
              <h3 className="text-xl font-bold text-gray-800">
                {content.infoTitle}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{content.infoText}</p>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center justify-between bg-[rgba(255,123,172,0.15)] rounded-2xl px-4 py-3">
                <span className="font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {content.emailLabel}
                </span>
                <a
                  href={`mailto:${content.emailValue}`}
                  className="text-[var(--brand-red)] font-medium hover:underline"
                >
                  {content.emailValue}
                </a>
              </div>
              <div className="flex items-center justify-between bg-[rgba(0,183,255,0.15)] rounded-2xl px-4 py-3">
                <span className="font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {content.phoneLabel}
                </span>
                <a
                  href={`tel:${content.phoneValue}`}
                  className="text-[var(--brand-blue)] font-medium hover:underline"
                >
                  {content.phoneValue}
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[rgba(255,158,0,0.15)] rounded-2xl px-4 py-3 gap-2">
                <span className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {content.addressLabel}
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=5+Rue+de+Charonne+75011+Paris+France"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand-orange)] font-medium hover:underline text-sm sm:text-base"
                >
                  {content.addressValue}
                </a>
              </div>
              <div className="flex items-center justify-between bg-[rgba(255,147,30,0.15)] rounded-2xl px-4 py-3">
                <span className="font-semibold">{content.hoursLabel}</span>
                <span>{content.hoursValue}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-800">
                {content.ctaTitle}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{content.ctaText}</p>
            <button
              onClick={onNewsletterClick}
              className="btn-secondary w-full"
            >
              <span className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>{content.ctaButton}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
