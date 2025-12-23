import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Article } from '../lib/supabase';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';

export function BlogPage() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (data) setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (article: Article, field: string) => {
    const key = `${field}_${language}` as keyof Article;
    return (article[key] as string) || (article[`${field}_fr` as keyof Article] as string) || '';
  };

  const getSlug = (article: Article) => {
    const key = `slug_${language}` as keyof Article;
    return (article[key] as string) || article.slug_fr || '';
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

  return (
    <div>
      <PageHero
        title={t('blog_page_title')}
        subtitle={t('blog_page_subtitle')}
        icon={<BookOpen className="w-8 h-8 text-white" />}
        variant="blue"
      />

      <section className="py-16 px-4 section-bg-yellow screen-section">
        <div className="container mx-auto max-w-6xl">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                {language === 'fr' ? 'Aucun article pour le moment' : language === 'en' ? 'No articles yet' : 'Aún no hay artículos'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/blog/${getSlug(article)}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-[rgba(255,123,172,0.2)] to-[rgba(63,169,245,0.2)] overflow-hidden">
                    {article.thumbnail_url ? (
                      <img
                        src={article.thumbnail_url}
                        alt={getLocalizedField(article, 'title')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-16 h-16 text-[var(--brand-pink)] opacity-50" />
                      </div>
                    )}
                    {article.is_featured && (
                      <div className="absolute top-4 right-4 bg-[var(--brand-pink)] text-white px-3 py-1 rounded-full text-sm font-bold">
                        ⭐ {language === 'fr' ? 'À la une' : language === 'en' ? 'Featured' : 'Destacado'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[var(--brand-red)] transition-colors line-clamp-2">
                      {getLocalizedField(article, 'title')}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {getLocalizedField(article, 'excerpt')}
                    </p>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {article.read_time_minutes} {language === 'fr' ? 'min' : language === 'en' ? 'min' : 'min'}
                        </span>
                      </div>
                    </div>

                    {article.author_name && (
                      <p className="text-sm text-gray-500 mb-4">
                        {language === 'fr' ? 'Par' : language === 'en' ? 'By' : 'Por'} <span className="font-semibold">{article.author_name}</span>
                      </p>
                    )}

                    {/* Read more button */}
                    <div className="flex items-center gap-2 text-[var(--brand-pink)] font-bold group-hover:gap-3 transition-all">
                      <span>{language === 'fr' ? 'Lire l\'article' : language === 'en' ? 'Read article' : 'Leer artículo'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
