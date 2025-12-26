import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
  alternates?: { hreflang: string; href: string }[];
}

export function SeoHead({ title: overrideTitle, description: overrideDescription, image, jsonLd, alternates }: SeoHeadProps) {
  const { t, language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const envSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;
    const baseUrl = (envSiteUrl || window.location.origin).replace(/\/$/, '');
    const pageMeta: Record<string, { title: string; description: string }> = {
      '/about': { title: t('about_page_title'), description: t('about_page_subtitle') },
      '/songs': { title: t('songs_page_title'), description: t('songs_page_subtitle') },
      '/games': { title: t('games_page_title'), description: t('games_page_subtitle') },
      '/characters': { title: t('characters_page_title'), description: t('characters_page_subtitle') },
      '/activities': { title: t('activities_page_title'), description: t('activities_page_subtitle') },
      '/learning': { title: t('learning_page_title'), description: t('learning_page_subtitle') },
      '/resources': { title: t('resources_page_title'), description: t('resources_page_subtitle') },
      '/parents': { title: t('parents_page_title'), description: t('parents_page_subtitle') },
      '/faq': { title: t('faq_page_title'), description: t('faq_page_subtitle') },
      '/contact': { title: t('contact_page_title'), description: t('contact_page_subtitle') },
    };

    const meta = pageMeta[location.pathname];
    const title = overrideTitle || (meta ? `${t('meta_title')} - ${meta.title}` : t('meta_title'));
    const description = overrideDescription || (meta ? meta.description : t('meta_description'));
    const canonicalUrl = `${baseUrl}${location.pathname}`;
    const imageUrl = image || `${baseUrl}/logo_boomlalaboom.png`;

    document.title = title;

    const ensureMeta = (selector: string, attributes: Record<string, string>) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => {
          element?.setAttribute(key, value);
        });
        document.head.appendChild(element);
      }
      return element;
    };

    const descriptionMeta = ensureMeta('meta[name="description"]', { name: 'description' });
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }

    const ogTitle = ensureMeta('meta[property="og:title"]', { property: 'og:title' });
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = ensureMeta('meta[property="og:description"]', { property: 'og:description' });
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    const twitterTitle = ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' });
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' });
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }

    const ogImage = ensureMeta('meta[property="og:image"]', { property: 'og:image' });
    if (ogImage) {
      ogImage.setAttribute('content', imageUrl);
    }

    const twitterImage = ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' });
    if (twitterImage) {
      twitterImage.setAttribute('content', imageUrl);
    }

    const ogUrl = ensureMeta('meta[property="og:url"]', { property: 'og:url' });
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }

    const ogSiteName = ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name' });
    if (ogSiteName) {
      ogSiteName.setAttribute('content', 'BoomLaLaBoom');
    }

    const twitterCard = ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' });
    if (twitterCard) {
      twitterCard.setAttribute('content', 'summary_large_image');
    }

    const localeMap: Record<string, string> = {
      fr: 'fr_FR',
      en: 'en_US',
      es: 'es_ES',
    };

    const currentLocale = localeMap[language] || 'fr_FR';
    const ogLocale = ensureMeta('meta[property="og:locale"]', { property: 'og:locale' });
    if (ogLocale) {
      ogLocale.setAttribute('content', currentLocale);
    }

    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(e => e.remove());
    Object.entries(localeMap).forEach(([lang, locale]) => {
      if (lang !== language) {
        const el = document.createElement('meta');
        el.setAttribute('property', 'og:locale:alternate');
        el.setAttribute('content', locale);
        document.head.appendChild(el);
      }
    });

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const defaultAlternates = [
      { hreflang: 'fr', href: `${baseUrl}${location.pathname}?lang=fr` },
      { hreflang: 'en', href: `${baseUrl}${location.pathname}?lang=en` },
      { hreflang: 'es', href: `${baseUrl}${location.pathname}?lang=es` },
      { hreflang: 'x-default', href: `${baseUrl}${location.pathname}` },
    ];

    const alternatesToApply = alternates && alternates.length ? alternates : defaultAlternates;
    document.querySelectorAll('link[rel="alternate"][data-seo="alternate"]').forEach((node) => node.remove());
    alternatesToApply.forEach((alternate) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alternate.hreflang);
      link.setAttribute('href', alternate.href);
      link.setAttribute('data-seo', 'alternate');
      document.head.appendChild(link);
    });

    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BoomLaLaBoom',
      url: baseUrl,
      description,
    };

    const payload = jsonLd || defaultJsonLd;
    let script = document.querySelector<HTMLScriptElement>('script[data-seo="jsonld"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'jsonld');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }, [location.pathname, location.search, t, language, overrideTitle, overrideDescription, image, jsonLd, alternates]);

  return null;
}
