import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

export function SeoHead({ title: overrideTitle, description: overrideDescription, image, jsonLd }: SeoHeadProps) {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
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
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}${location.pathname}`;
    const imageUrl = image || `${siteUrl}/logo_boomlalaboom.png`;

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

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BoomLaLaBoom',
      url: siteUrl,
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
  }, [location.pathname, t, overrideTitle, overrideDescription, image, jsonLd]);

  return null;
}
