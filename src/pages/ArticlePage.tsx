import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Article } from '../lib/supabase';
import { LoadingState } from '../components/LoadingState';
import { SeoHead } from '../components/SeoHead';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug, language]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      // Try to find article by slug in current language
      const slugColumn = `slug_${language}`;
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`slug_fr.eq.${slug},slug_en.eq.${slug},slug_es.eq.${slug}`)
        .single();

      if (error) throw error;

      if (data) {
        setArticle(data);
        // Load related articles
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

  return (
    <>
      <SeoHead title={metaTitle} description={metaDescription} />

      <article className="py-8 px-4">
        {/* Back button */}
        <div className="container mx-auto max-w-4xl mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--brand-pink)] hover:text-[var(--brand-red)] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'fr' ? 'Retour aux articles' : language === 'en' ? 'Back to articles' : 'Volver a los artículos'}</span>
          </Link>
        </div>

        {/* Article header */}
        <div className="container mx-auto max-w-4xl mb-12">
          {article.thumbnail_url && (
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <img
                src={article.thumbnail_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-6 leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            {article.author_name && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full flex items-center justify-center text-white font-bold">
                  {article.author_name.charAt(0)}
                </div>
                <span className="font-semibold">{article.author_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {article.read_time_minutes} {language === 'fr' ? 'min de lecture' : language === 'en' ? 'min read' : 'min de lectura'}
              </span>
            </div>
          </div>

          {article.is_featured && (
            <div className="inline-block bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              ⭐ {language === 'fr' ? 'Article à la une' : language === 'en' ? 'Featured article' : 'Artículo destacado'}
            </div>
          )}
        </div>

        {/* Article content */}
        <div className="container mx-auto max-w-4xl">
          <div
            className="prose prose-lg max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
              color: '#374151'
            }}
          />
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="container mx-auto max-w-6xl mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">
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
                  <div className="p-4">
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
        .article-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }
        .article-content p {
          margin-bottom: 1.5rem;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content a {
          color: var(--brand-pink);
          text-decoration: underline;
        }
        .article-content a:hover {
          color: var(--brand-red);
        }
        .article-content img {
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .article-content blockquote {
          border-left: 4px solid var(--brand-pink);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </>
  );
}
