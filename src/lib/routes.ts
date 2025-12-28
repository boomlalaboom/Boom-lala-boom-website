export type Language = 'fr' | 'en' | 'es';

export interface RouteMapping {
    fr: string;
    en: string;
    es: string;
}

export const STATIC_ROUTES: Record<string, RouteMapping> = {
    about: {
        fr: 'univers',
        en: 'about',
        es: 'universo'
    },
    songs: {
        fr: 'chansons',
        en: 'songs',
        es: 'canciones'
    },
    games: {
        fr: 'jeux',
        en: 'games',
        es: 'juegos'
    },
    characters: {
        fr: 'personnages',
        en: 'characters',
        es: 'personajes'
    },
    activities: {
        fr: 'activites',
        en: 'activities',
        es: 'actividades'
    },
    colorings: {
        fr: 'activites/coloriages',
        en: 'activities/coloring-pages',
        es: 'actividades/paginas-para-colorear'
    },
    cuttings: {
        fr: 'activites/decoupages',
        en: 'activities/paper-crafts',
        es: 'actividades/manualidades'
    },
    learning: {
        fr: 'apprendre',
        en: 'learning',
        es: 'aprender'
    },
    resources: {
        fr: 'ressources',
        en: 'resources',
        es: 'recursos'
    },
    parents: {
        fr: 'parents',
        en: 'parents',
        es: 'padres'
    },
    faq: {
        fr: 'faq',
        en: 'faq',
        es: 'faq'
    },
    contact: {
        fr: 'contact',
        en: 'contact',
        es: 'contacto'
    },
    blog: {
        fr: 'blog',
        en: 'blog',
        es: 'blog'
    },
    legal: {
        fr: 'mentions-legales',
        en: 'legal-mentions',
        es: 'avisos-legales'
    },
    privacy: {
        fr: 'politique-de-confidentialite',
        en: 'privacy-policy',
        es: 'politica-de-privacidad'
    },
    terms: {
        fr: 'conditions-generales',
        en: 'terms-of-service',
        es: 'condiciones-generales'
    },
    cookies: {
        fr: 'politique-des-cookies',
        en: 'cookie-policy',
        es: 'politica-de-cookies'
    },
    'games/shark-rhythm': {
        fr: 'jeux/rythme-requin',
        en: 'games/shark-rhythm',
        es: 'juegos/ritmo-tiburon'
    },
    'games/lola-memory': {
        fr: 'jeux/lola-memory',
        en: 'games/lola-memory',
        es: 'juegos/lola-memory'
    }
};

/**
 * Gets the localized slug for a given canonical route and language.
 */
export function getLocalizedPath(canonicalPath: string, lang: Language): string {
    // Remove leading/trailing slashes
    const cleanPath = canonicalPath.replace(/^\/|\/$/g, '');
    const mapping = STATIC_ROUTES[cleanPath];

    if (mapping) {
        return `/${lang}/${mapping[lang]}`;
    }

    // If no mapping found, just prepend language (for dynamic routes like /blog/:slug)
    return `/${lang}/${cleanPath}`;
}

/**
 * Finds the canonical route key from a localized slug and language.
 */
export function getCanonicalKey(slug: string, lang: Language): string | null {
    if (!slug) return null;

    const normalizedSlug = slug.replace(/^\/|\/$/g, '').toLowerCase();

    for (const [key, mapping] of Object.entries(STATIC_ROUTES)) {
        if (!mapping[lang]) continue;
        const langPath = mapping[lang].replace(/^\/|\/$/g, '').toLowerCase();
        if (langPath === normalizedSlug) {
            return key;
        }
    }
    return null;
}
