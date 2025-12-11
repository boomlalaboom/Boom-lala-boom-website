import { ReactNode, useState } from 'react';
import { Music, Gamepad2, Users, Scissors, Info, Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navItems = [
    { icon: Music, label: t('nav_songs'), id: 'songs' },
    { icon: Gamepad2, label: t('nav_games'), id: 'games' },
    { icon: Users, label: t('nav_characters'), id: 'characters' },
    { icon: Scissors, label: t('nav_activities'), id: 'activities' },
  ];

  const languages = [
    { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
    { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 hover:scale-105 transition-transform"
            >
              <img
                src="/logo_boomlalaboom.png"
                alt="BoomLaLaBoom"
                className="h-12 w-auto"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent hidden sm:inline">
                BoomLaLaBoom
              </span>
            </button>

            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      const element = document.getElementById(item.id);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-700 group-hover:text-pink-600">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 transition-all"
              >
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-700 uppercase">
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors ${
                        language === lang.code ? 'bg-purple-50' : ''
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

          <div className="md:hidden flex overflow-x-auto pb-3 space-x-2 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    const element = document.getElementById(item.id);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-pink-50 hover:to-blue-50 transition-all whitespace-nowrap"
                >
                  <Icon className="w-6 h-6 text-pink-500" />
                  <span className="text-xs font-medium text-gray-600">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="/logo_boomlalaboom.png"
                alt="BoomLaLaBoom"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">BoomLaLaBoom</span>
            </div>

            <button
              onClick={() => {
                const element = document.getElementById('parents');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">{t('nav_parents')}</span>
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-white/80">
            © 2024 BoomLaLaBoom. {language === 'fr' ? 'Tous droits réservés' : language === 'en' ? 'All rights reserved' : 'Todos los derechos reservados'}.
          </div>
        </div>
      </footer>
    </div>
  );
}
