import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    nav_songs: 'Chansons',
    nav_games: 'Jeux',
    nav_characters: 'Personnages',
    nav_activities: 'Activités',
    nav_parents: 'Parents',
    home_hero_title: 'Bienvenue dans l\'univers BoomLaLaBoom !',
    home_hero_subtitle: 'Chante, joue et apprends avec tes personnages préférés',
    home_songs_title: 'Chansons du moment',
    home_games_title: 'Jeux populaires',
    home_characters_title: 'Découvre tes personnages',
    home_cta_sing: 'Chanter',
    home_cta_play: 'Jouer',
    home_cta_discover: 'Découvrir',
    songs_page_title: 'Nos Chansons',
    songs_page_subtitle: 'Découvre toutes nos chansons préférées',
    games_page_title: 'Nos Jeux',
    games_page_subtitle: 'Amuse-toi avec nos jeux musicaux',
    characters_page_title: 'Nos Personnages',
    characters_page_subtitle: 'Rencontre tous tes amis BoomLaLaBoom',
    activities_page_title: 'Activités',
    activities_page_subtitle: 'Coloriages, découpages et plus encore',
    parents_page_title: 'Espace Parents',
    parents_page_subtitle: 'Tout savoir sur BoomLaLaBoom',
    view_more: 'Voir plus',
    play_now: 'Jouer maintenant',
    watch_now: 'Regarder maintenant',
    download: 'Télécharger',
    loading: 'Chargement...',
  },
  en: {
    nav_songs: 'Songs',
    nav_games: 'Games',
    nav_characters: 'Characters',
    nav_activities: 'Activities',
    nav_parents: 'Parents',
    home_hero_title: 'Welcome to the BoomLaLaBoom Universe!',
    home_hero_subtitle: 'Sing, play and learn with your favorite characters',
    home_songs_title: 'Featured Songs',
    home_games_title: 'Popular Games',
    home_characters_title: 'Meet Your Characters',
    home_cta_sing: 'Sing',
    home_cta_play: 'Play',
    home_cta_discover: 'Discover',
    songs_page_title: 'Our Songs',
    songs_page_subtitle: 'Discover all our favorite songs',
    games_page_title: 'Our Games',
    games_page_subtitle: 'Have fun with our musical games',
    characters_page_title: 'Our Characters',
    characters_page_subtitle: 'Meet all your BoomLaLaBoom friends',
    activities_page_title: 'Activities',
    activities_page_subtitle: 'Coloring, crafts and more',
    parents_page_title: 'Parents Area',
    parents_page_subtitle: 'Everything about BoomLaLaBoom',
    view_more: 'View more',
    play_now: 'Play now',
    watch_now: 'Watch now',
    download: 'Download',
    loading: 'Loading...',
  },
  es: {
    nav_songs: 'Canciones',
    nav_games: 'Juegos',
    nav_characters: 'Personajes',
    nav_activities: 'Actividades',
    nav_parents: 'Padres',
    home_hero_title: '¡Bienvenido al universo BoomLaLaBoom!',
    home_hero_subtitle: 'Canta, juega y aprende con tus personajes favoritos',
    home_songs_title: 'Canciones destacadas',
    home_games_title: 'Juegos populares',
    home_characters_title: 'Conoce a tus personajes',
    home_cta_sing: 'Cantar',
    home_cta_play: 'Jugar',
    home_cta_discover: 'Descubrir',
    songs_page_title: 'Nuestras Canciones',
    songs_page_subtitle: 'Descubre todas nuestras canciones favoritas',
    games_page_title: 'Nuestros Juegos',
    games_page_subtitle: 'Diviértete con nuestros juegos musicales',
    characters_page_title: 'Nuestros Personajes',
    characters_page_subtitle: 'Conoce a todos tus amigos BoomLaLaBoom',
    activities_page_title: 'Actividades',
    activities_page_subtitle: 'Colorear, manualidades y más',
    parents_page_title: 'Área de Padres',
    parents_page_subtitle: 'Todo sobre BoomLaLaBoom',
    view_more: 'Ver más',
    play_now: 'Jugar ahora',
    watch_now: 'Ver ahora',
    download: 'Descargar',
    loading: 'Cargando...',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('boomlalaboom_language');
    if (saved && ['fr', 'en', 'es'].includes(saved)) {
      return saved as Language;
    }
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'en', 'es'].includes(browserLang)) {
      return browserLang as Language;
    }
    return 'fr';
  });

  useEffect(() => {
    localStorage.setItem('boomlalaboom_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
