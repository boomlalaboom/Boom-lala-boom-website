import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type Language = 'fr' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    meta_title: 'BoomLaLaBoom | Chansons et jeux éducatifs pour enfants',
    meta_description: 'Comptines multilingues, jeux éducatifs, coloriages et activités créatives pour enfants de 2 à 8 ans. Un univers sécurisé pour apprendre en s\'amusant.',
    nav_about: 'Univers',
    nav_songs: 'Chansons',
    nav_games: 'Jeux',
    nav_characters: 'Personnages',
    nav_activities: 'Activités',
    nav_learning: 'Apprendre',
    nav_resources: 'Ressources',
    nav_parents: 'Parents',
    nav_faq: 'FAQ',
    nav_contact: 'Contact',
    nav_blog: 'Blog',
    nav_more: 'Plus',
    about_page_title: 'L\'univers BoomLaLaBoom',
    about_page_subtitle: 'Un monde musical et educatif pense pour les enfants',
    home_hero_title: 'Chansons et jeux éducatifs pour enfants',
    home_hero_subtitle: 'Comptines, histoires, activités et jeux pour apprendre en musique',
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
    learning_page_title: 'Apprendre en s\'amusant',
    learning_page_subtitle: 'Langues, rythme et creativite au coeur des jeux',
    resources_page_title: 'Ressources',
    resources_page_subtitle: 'Fiches imprimables et idees pour la maison',
    parents_page_title: 'Espace Parents',
    parents_page_subtitle: 'Tout savoir sur BoomLaLaBoom',
    faq_page_title: 'Questions frequentes',
    faq_page_subtitle: 'Reponses aux questions des familles',
    contact_page_title: 'Contact',
    contact_page_subtitle: 'Ecrivez-nous pour toute demande',
    blog_page_title: 'Blog',
    blog_page_subtitle: 'Conseils, astuces et découvertes pour parents et enfants',
    footer_tagline: 'Un univers musical et joyeux pour apprendre en s\'amusant',
    footer_nav_title: 'Navigation',
    footer_contact_title: 'Contact',
    view_more: 'Voir plus',
    play_now: 'Jouer maintenant',
    watch_now: 'Regarder maintenant',
    download: 'Télécharger',
    loading: 'Chargement...',
  },
  en: {
    meta_title: 'BoomLaLaBoom | Kids songs and educational games',
    meta_description: 'Multilingual nursery rhymes, educational games, coloring pages, and creative activities for kids ages 2-8. A safe world to learn through play.',
    nav_about: 'Universe',
    nav_songs: 'Songs',
    nav_games: 'Games',
    nav_characters: 'Characters',
    nav_activities: 'Activities',
    nav_learning: 'Learning',
    nav_resources: 'Resources',
    nav_parents: 'Parents',
    nav_faq: 'FAQ',
    nav_contact: 'Contact',
    nav_blog: 'Blog',
    nav_more: 'More',
    about_page_title: 'The BoomLaLaBoom Universe',
    about_page_subtitle: 'A musical and educational world built for kids',
    home_hero_title: 'Kids songs and educational games',
    home_hero_subtitle: 'Nursery rhymes, stories, activities, and games to learn with music',
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
    learning_page_title: 'Learning through play',
    learning_page_subtitle: 'Languages, rhythm, and creativity at the core',
    resources_page_title: 'Resources',
    resources_page_subtitle: 'Printable packs and ideas for home',
    parents_page_title: 'Parents Area',
    parents_page_subtitle: 'Everything about BoomLaLaBoom',
    faq_page_title: 'Frequently asked questions',
    faq_page_subtitle: 'Answers for families and teachers',
    contact_page_title: 'Contact',
    contact_page_subtitle: 'Write to us with any request',
    blog_page_title: 'Blog',
    blog_page_subtitle: 'Tips, tricks and discoveries for parents and children',
    footer_tagline: 'A joyful musical world to learn through play',
    footer_nav_title: 'Navigation',
    footer_contact_title: 'Contact',
    view_more: 'View more',
    play_now: 'Play now',
    watch_now: 'Watch now',
    download: 'Download',
    loading: 'Loading...',
  },
  es: {
    meta_title: 'BoomLaLaBoom | Canciones y juegos educativos para ninos',
    meta_description: 'Canciones multilingues, juegos educativos, paginas para colorear y actividades creativas para ninos de 2 a 8 anos. Un mundo seguro para aprender jugando.',
    nav_about: 'Universo',
    nav_songs: 'Canciones',
    nav_games: 'Juegos',
    nav_characters: 'Personajes',
    nav_activities: 'Actividades',
    nav_learning: 'Aprender',
    nav_resources: 'Recursos',
    nav_parents: 'Padres',
    nav_faq: 'FAQ',
    nav_contact: 'Contacto',
    nav_blog: 'Blog',
    nav_more: 'Mas',
    about_page_title: 'El universo BoomLaLaBoom',
    about_page_subtitle: 'Un mundo musical y educativo para ninos',
    home_hero_title: 'Canciones y juegos educativos para ninos',
    home_hero_subtitle: 'Canciones, historias, actividades y juegos para aprender con musica',
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
    learning_page_title: 'Aprender jugando',
    learning_page_subtitle: 'Idiomas, ritmo y creatividad en cada juego',
    resources_page_title: 'Recursos',
    resources_page_subtitle: 'Packs imprimibles e ideas para casa',
    parents_page_title: 'Área de Padres',
    parents_page_subtitle: 'Todo sobre BoomLaLaBoom',
    faq_page_title: 'Preguntas frecuentes',
    faq_page_subtitle: 'Respuestas para familias y docentes',
    contact_page_title: 'Contacto',
    contact_page_subtitle: 'Escribenos para cualquier consulta',
    blog_page_title: 'Blog',
    blog_page_subtitle: 'Consejos, trucos y descubrimientos para padres y niños',
    footer_tagline: 'Un mundo musical y alegre para aprender jugando',
    footer_nav_title: 'Navegacion',
    footer_contact_title: 'Contacto',
    view_more: 'Ver más',
    play_now: 'Jugar ahora',
    watch_now: 'Ver ahora',
    download: 'Descargar',
    loading: 'Cargando...',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [language, setLanguageState] = useState<Language>(() => {
    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');
    if (queryLang && ['fr', 'en', 'es'].includes(queryLang)) {
      return queryLang as Language;
    }
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryLang = params.get('lang');
    if (queryLang && ['fr', 'en', 'es'].includes(queryLang) && queryLang !== language) {
      setLanguageState(queryLang as Language);
    }
  }, [language, location.search]);

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
