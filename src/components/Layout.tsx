import { ReactNode, useEffect, useRef, useState } from 'react';
import { Music, Gamepad2, Users, Scissors, Info, Globe, Sparkles, BookOpen, Folder, Mail, Heart, FileText, Menu, X as CloseIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introWithSound, setIntroWithSound] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem('boomlala_intro_seen');
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

  const closeIntro = () => {
    sessionStorage.setItem('boomlala_intro_seen', '1');
    setShowIntro(false);
  };

  const enableIntroSound = () => {
    const video = introVideoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => undefined);
    }
    setIntroWithSound(true);
  };

  const primaryNavItems = [
    { icon: Sparkles, label: t('nav_about'), to: '/about' },
    { icon: Music, label: t('nav_songs'), to: '/songs' },
    { icon: Gamepad2, label: t('nav_games'), to: '/games' },
    { icon: Users, label: t('nav_characters'), to: '/characters' },
    { icon: Scissors, label: t('nav_activities'), to: '/activities' },
    { icon: Heart, label: t('nav_parents'), to: '/parents' },
  ];

  const secondaryNavItems = [
    { icon: BookOpen, label: t('nav_learning'), to: '/learning' },
    { icon: Folder, label: t('nav_resources'), to: '/resources' },
    { icon: FileText, label: t('nav_blog'), to: '/blog' },
    { icon: Info, label: t('nav_faq'), to: '/faq' },
    { icon: Mail, label: t('nav_contact'), to: '/contact' },
  ];

  const footerNavItems = [...primaryNavItems, ...secondaryNavItems];

  const languages = [
    { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
    { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE600] to-[#FF9F00]">
      {showIntro && (
        <div className="fixed inset-0 z-[60] bg-[#002C72] flex items-center justify-center">
          <video
            src="https://rdtwxlqapkswyzxuihea.supabase.co/storage/v1/object/public/Videos/MASTER_LOGO_INTRO_16_9.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            ref={introVideoRef}
          />
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 flex flex-col items-end gap-3 px-6">
            <div className="flex flex-col items-end gap-3">
              <button
                onClick={enableIntroSound}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#FFE600] text-[#0457BA] font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-transform"
              >
                {language === 'fr' ? 'Lancer avec le son' : language === 'en' ? 'Play with sound' : 'Reproducir con sonido'}
              </button>
              <button
                onClick={closeIntro}
                className="inline-flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 rounded-full bg-white/80 text-[#0457BA] font-semibold text-sm sm:text-base hover:bg-white transition-transform"
              >
                {language === 'fr' ? 'Entrer' : language === 'en' ? 'Enter' : 'Entrar'}
              </button>
            </div>
            <p className="text-sm text-white/80 text-right">
              {introWithSound
                ? language === 'fr'
                  ? 'Son active. Vous pouvez entrer quand vous voulez.'
                  : language === 'en'
                  ? 'Sound on. Enter whenever you want.'
                  : 'Sonido activo. Entra cuando quieras.'
                : language === 'fr'
                ? 'Le son demarrera apres votre clic.'
                : language === 'en'
                ? 'Sound starts after your click.'
                : 'El sonido empieza despues de tu clic.'}
            </p>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 md:grid md:grid-cols-[auto,1fr,auto] md:gap-6">
            <Link
              to="/"
              className="hover:scale-105 transition-transform sm:-translate-x-[60px]"
            >
              <div className="relative">
                <img
                  src="/logo_boomlalaboom.png"
                  alt="BoomLaLaBoom"
                  className="h-16 sm:h-24 w-auto"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-[38px] text-2xl font-bold gradient-text hidden sm:inline">
                  BoomLaLaBoom
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-3 flex-wrap min-w-0 translate-x-[34px]">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group whitespace-nowrap ${isActive
                        ? 'bg-gradient-to-r from-[rgba(255,123,172,0.2)] to-[rgba(255,147,30,0.2)]'
                        : 'hover:bg-gradient-to-r hover:from-[rgba(255,123,172,0.18)] hover:to-[rgba(255,147,30,0.18)]'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 text-[var(--brand-pink)] group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-700 group-hover:text-[var(--brand-red)]">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}

              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-[rgba(255,123,172,0.18)] hover:to-[rgba(63,169,245,0.18)] transition-all duration-300 group"
                >
                  <Info className="w-5 h-5 text-[var(--brand-pink)] group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-700 group-hover:text-[var(--brand-red)]">
                    {t('nav_more')}
                  </span>
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setShowMoreMenu(false)}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[rgba(255,123,172,0.12)] hover:to-[rgba(255,147,30,0.12)] transition-colors"
                        >
                          <Icon className="w-5 h-5 text-[var(--brand-pink)]" />
                          <span className="font-medium text-gray-700">
                            {item.label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-3">
              {/* Burger menu - visible uniquement sur mobile, positionné en premier à droite */}
              <button
                type="button"
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden p-3 rounded-full bg-gradient-to-r from-[rgba(255,123,172,0.15)] to-[rgba(255,147,30,0.15)] hover:from-[rgba(255,123,172,0.25)] hover:to-[rgba(255,147,30,0.25)] shadow-md active:scale-95 transition-all order-2"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-[var(--brand-blue)]" />
              </button>

              {/* Sélecteur de langue */}
              <div className="relative order-1 md:order-none">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-full bg-gradient-to-r from-[rgba(63,169,245,0.2)] to-[rgba(255,123,172,0.2)] hover:from-[rgba(63,169,245,0.3)] hover:to-[rgba(255,123,172,0.3)] transition-all"
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--brand-blue)]" />
                  <span className="font-medium text-[var(--brand-blue)] uppercase text-sm sm:text-base">
                    {language}
                  </span>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[rgba(63,169,245,0.12)] hover:to-[rgba(255,123,172,0.12)] transition-colors ${language === lang.code ? 'bg-[rgba(63,169,245,0.12)]' : ''
                          }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium text-gray-700">
                          {lang.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-[55] bg-black/40 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div
            className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--brand-blue)]">
                {language === 'fr' ? 'Menu' : language === 'en' ? 'Menu' : 'Menu'}
              </span>
              <button
                type="button"
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-full bg-gray-100"
                aria-label="Close menu"
              >
                <CloseIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[...primaryNavItems, ...secondaryNavItems].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${isActive
                        ? 'bg-gradient-to-r from-[rgba(255,123,172,0.2)] to-[rgba(255,147,30,0.2)] text-[var(--brand-red)]'
                        : 'bg-gray-50 text-gray-700'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 text-[var(--brand-pink)]" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main>{children}</main>

      <footer className="bg-[#0457BA] text-[#FFE600] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <div className="relative inline-block md:-translate-x-[53px]">
                <img
                  src="/logo_boomlalaboom.png"
                  alt="BoomLaLaBoom"
                  className="h-16 sm:h-24 w-auto"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-[38px] text-2xl font-bold footer-gradient-text">
                  BoomLaLaBoom
                </span>
              </div>
              <p className="text-sm md:text-base md:translate-x-[15px]">
                {t('footer_tagline')}
              </p>
              <Link
                to="/parents"
                className="inline-flex items-center space-x-2 px-5 py-2 border-2 border-[#FFE600] rounded-full hover:bg-[#FFE600] hover:text-[#0457BA] transition-all md:translate-x-[15px]"
              >
                <Info className="w-5 h-5" />
                <span className="font-medium">{t('nav_parents')}</span>
              </Link>
            </div>

            <div>
              <h4 className="text-lg font-bold footer-gradient-text mb-3">
                {t('footer_nav_title')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {footerNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="px-4 py-2 rounded-full border-2 border-[#FFE600] text-sm hover:bg-[#FFE600] hover:text-[#0457BA] transition-all"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold footer-gradient-text mb-3">
                {t('footer_contact_title')}
              </h4>
              <div className="space-y-2">
                <a
                  href="mailto:contact@boomlalaboom.com"
                  className="inline-flex items-center space-x-2 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="footer-gradient-text">contact@boomlalaboom.com</span>
                </a>
                <div className="inline-flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span className="footer-gradient-text">
                    {language === 'fr' ? 'Lun-Ven 9h-18h' : language === 'en' ? 'Mon-Fri 9am-6pm' : 'Lun-Vie 9h-18h'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm">
            © 2024 BoomLaLaBoom. {language === 'fr' ? 'Tous droits réservés' : language === 'en' ? 'All rights reserved' : 'Todos los derechos reservados'}.
            <Link to="/login" className="ml-4 text-xs opacity-50 hover:opacity-100 transition-opacity">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
