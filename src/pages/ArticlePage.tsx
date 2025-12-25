import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, BookOpen, List } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Article } from '../lib/supabase';
import { LoadingState } from '../components/LoadingState';
import { SeoHead } from '../components/SeoHead';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug, language]);

  useEffect(() => {
    if (!article) return;
    const rafId = window.requestAnimationFrame(() => {
      extractTableOfContents();
      setupScrollSpy();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [article]);

  const extractTableOfContents = () => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h2, h3, h4');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const existingId = heading.id;
      const text = heading.textContent || '';
      const id = existingId || `section-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${index}`;
      if (!existingId) heading.id = id;
      tocItems.push({
        id,
        text,
        level: parseInt(heading.tagName.charAt(1), 10),
      });
    });

    setToc(tocItems);
  };

  const setupScrollSpy = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px'
      }
    );

    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3, h4');
      headings.forEach((heading) => observer.observe(heading));
    }

    observerRef.current = observer;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const loadArticle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`slug_fr.eq.${slug},slug_en.eq.${slug},slug_es.eq.${slug}`)
        .single();

      if (error) throw error;

      if (data) {
        setArticle(data);
        const { data: related } = await supabase
          .from('articles')
          .select('*')
          .neq('id', data.id)
          .order('published_at', { ascending: false })
          .limit(3);
        if (related) setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error loading article:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (obj: Article, field: string) => {
    const key = `${field}_${language}` as keyof Article;
    return (obj[key] as string) || (obj[`${field}_fr` as keyof Article] as string) || '';
  };

  const getSlug = (obj: Article) => {
    const key = `slug_${language}` as keyof Article;
    return (obj[key] as string) || obj.slug_fr || '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {language === 'fr' ? 'Article non trouvé' : language === 'en' ? 'Article not found' : 'Artículo no encontrado'}
          </h2>
          <Link to="/blog" className="text-[var(--brand-pink)] hover:underline">
            {language === 'fr' ? 'Retour au blog' : language === 'en' ? 'Back to blog' : 'Volver al blog'}
          </Link>
        </div>
      </div>
    );
  }

  const title = getLocalizedField(article, 'title');
  const content = getLocalizedField(article, 'content');
  const metaTitle = getLocalizedField(article, 'meta_title') || title;
  const metaDescription = getLocalizedField(article, 'meta_description') || getLocalizedField(article, 'excerpt');
  const imageUrl = article.thumbnail_url || '/logo_boomlalaboom.png';
  const baseUrl = ((import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin).replace(/\/$/, '');
  const alternates: { hreflang: string; href: string }[] = [];

  if (article.slug_fr) {
    alternates.push({ hreflang: 'fr', href: `${baseUrl}/blog/${article.slug_fr}?lang=fr` });
  }
  if (article.slug_en) {
    alternates.push({ hreflang: 'en', href: `${baseUrl}/blog/${article.slug_en}?lang=en` });
  }
  if (article.slug_es) {
    alternates.push({ hreflang: 'es', href: `${baseUrl}/blog/${article.slug_es}?lang=es` });
  }
  if (article.slug_fr) {
    alternates.push({ hreflang: 'x-default', href: `${baseUrl}/blog/${article.slug_fr}` });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metaTitle,
    description: metaDescription,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: article.author_name || 'BoomLaLaBoom',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BoomLaLaBoom',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo_boomlalaboom.png`,
      },
    },
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    mainEntityOfPage: `${baseUrl}/blog/${getSlug(article)}`,
  };

  return (
    <>
      <SeoHead title={metaTitle} description={metaDescription} image={imageUrl} jsonLd={jsonLd} alternates={alternates} />

      <article className="py-8 px-4 bg-gradient-to-b from-[var(--accent-yellow)] to-[var(--accent-orange)]">
        {/* Back button */}
        <div className="container mx-auto max-w-7xl mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--brand-pink)] hover:text-[var(--brand-red)] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'fr' ? 'Retour aux articles' : language === 'en' ? 'Back to articles' : 'Volver a los artículos'}</span>
          </Link>
        </div>

        {/* Article header */}
        <div className="container mx-auto max-w-7xl mb-12">
          {article.thumbnail_url && (
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <img
                src={article.thumbnail_url}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
              {article.author_name && (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {article.author_name.charAt(0)}
                  </div>
                  <span className="font-semibold text-gray-800">{article.author_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--brand-pink)]" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--brand-pink)]" />
                <span>
                  {article.read_time_minutes} {language === 'fr' ? 'min de lecture' : language === 'en' ? 'min read' : 'min de lectura'}
                </span>
              </div>
              {article.is_featured && (
                <div className="inline-block bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ {language === 'fr' ? 'À la une' : language === 'en' ? 'Featured' : 'Destacado'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article content with TOC */}
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main content */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <div
                  ref={contentRef}
                  className="prose prose-lg max-w-none article-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>

            {/* Table of Contents - Sticky sidebar */}
            {toc.length > 0 && (
              <aside className="order-1 lg:order-2">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[var(--brand-pink)]">
                    <div className="flex items-center gap-2 mb-4">
                      <List className="w-5 h-5 text-[var(--brand-pink)]" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {language === 'fr' ? 'Table des matières' : language === 'en' ? 'Table of contents' : 'Tabla de contenido'}
                      </h3>
                    </div>
                    <nav className="space-y-2">
                      {toc.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left py-2 px-3 rounded-lg transition-all text-sm ${
                            item.level === 3 ? 'pl-6' : ''
                          } ${
                            activeSection === item.id
                              ? 'bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white font-semibold shadow-md'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="container mx-auto max-w-7xl mt-20 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              {language === 'fr' ? 'Articles similaires' : language === 'en' ? 'Related articles' : 'Artículos relacionados'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/blog/${getSlug(relatedArticle)}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-[rgba(255,123,172,0.2)] to-[rgba(63,169,245,0.2)]">
                    {relatedArticle.thumbnail_url && (
                      <img
                        src={relatedArticle.thumbnail_url}
                        alt={getLocalizedField(relatedArticle, 'title')}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[var(--brand-red)] transition-colors">
                      {getLocalizedField(relatedArticle, 'title')}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {getLocalizedField(relatedArticle, 'excerpt')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <style>{`
        .article-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }

        .article-content h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: #111827;
          scroll-margin-top: 100px;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid var(--brand-pink);
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #1f2937;
          scroll-margin-top: 100px;
        }

        .article-content p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .article-content li {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }

        .article-content ul li {
          position: relative;
          padding-left: 0.5rem;
        }

        .article-content ul li::marker {
          color: var(--brand-pink);
          font-size: 1.2em;
        }

        .article-content a {
          color: var(--brand-pink);
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.2s;
        }

        .article-content a:hover {
          color: var(--brand-red);
        }

        .article-content img {
          border-radius: 1rem;
          margin: 2.5rem 0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          width: 100%;
        }

        .article-content blockquote {
          border-left: 4px solid var(--brand-pink);
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
          background: rgba(255,123,172,0.05);
          border-radius: 0.5rem;
        }

        .article-content strong {
          color: #1f2937;
          font-weight: 700;
        }

        .article-content code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #be185d;
        }

        .article-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .article-content pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        @media (max-width: 1024px) {
          .article-content h2 {
            font-size: 1.75rem;
          }
          .article-content h3 {
            font-size: 1.375rem;
          }
        }
      `}</style>
    </>
  );
}
