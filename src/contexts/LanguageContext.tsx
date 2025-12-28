import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STATIC_ROUTES, getCanonicalKey } from '../lib/routes';

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
    home_cta_all_songs: 'Découvrir toutes nos chansons',
    loading: 'Chargement...',
    footer_legal: 'Mentions Légales',
    footer_privacy: 'Confidentialité',
    footer_terms: 'CGU / CGV',
    footer_cookies: 'Cookies',
    cookie_title: 'Respect de votre vie privée',
    cookie_text: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu. En continuant à naviguer, vous acceptez notre utilisation des cookies.',
    cookie_accept: 'Tout accepter',
    cookie_decline: 'Refuser',
    cookie_settings: 'Paramètres',
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
    home_cta_all_songs: 'Discover all our songs',
    loading: 'Loading...',
    footer_legal: 'Legal Mentions',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_cookies: 'Cookies Policy',
    cookie_title: 'Respect for your privacy',
    cookie_text: 'We use cookies to improve your experience, analyze site traffic and personalize content. By continuing to browse, you agree to our use of cookies.',
    cookie_accept: 'Accept all',
    cookie_decline: 'Decline',
    cookie_settings: 'Settings',
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
    home_cta_all_songs: 'Descubrir todas nuestras canciones',
    loading: 'Cargando...',
    footer_legal: 'Avisos Legales',
    footer_privacy: 'Privacidad',
    footer_terms: 'Condiciones Generales',
    footer_cookies: 'Cookies',
    cookie_title: 'Respeto a su privacidad',
    cookie_text: 'Utilizamos cookies para mejorar su experiencia, analizar el tráfico del sitio y personalizar el contenido. Al continuar navegando, acepta nuestro uso de cookies.',
    cookie_accept: 'Aceptar todo',
    cookie_decline: 'Rechazar',
    cookie_settings: 'Ajustes',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive language from URL path first (e.g. /fr/about -> fr)
  const getLanguageFromPath = (pathname: string): Language | null => {
    const segments = pathname.split('/');
    const firstSegment = segments[1]; // segments[0] is empty string
    if (['fr', 'en', 'es'].includes(firstSegment)) {
      return firstSegment as Language;
    }
    return null;
  };

  const currentLang = getLanguageFromPath(location.pathname) || 'fr';

  useEffect(() => {
    document.documentElement.lang = currentLang;
    localStorage.setItem('boomlalaboom_language', currentLang);
  }, [currentLang]);

  const setLanguage = (lang: Language) => {
    if (lang === currentLang) return;

    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);

    // segments[0] is current language (fr, en, es)
    // segments[1] is the current localized slug (e.g. "chansons")

    let newPath = `/${lang}`;

    if (segments.length > 0) {
      const isLang = ['fr', 'en', 'es'].includes(segments[0]);
      const currentSlug = isLang ? segments[1] : segments[0];
      const rest = isLang ? segments.slice(2).join('/') : segments.slice(1).join('/');

      if (currentSlug) {
        // Try to find the canonical key for the current slug
        const canonicalKey = getCanonicalKey(currentSlug, currentLang);

        if (canonicalKey && STATIC_ROUTES[canonicalKey]) {
          // We found a translated route, use the target language version
          const targetSlug = STATIC_ROUTES[canonicalKey][lang];
          newPath += `/${targetSlug}${rest ? `/${rest}` : ''}`;
        } else {
          // No mapping found, just keep the segment as is (or it's a dynamic slug like /blog/slug)
          newPath += '/' + (isLang ? segments.slice(1).join('/') : segments.join('/'));
        }
      }
    }

    navigate(newPath + location.search);
  };

  const t = (key: string): string => {
    return translations[currentLang][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language: currentLang, setLanguage, t }}>
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
