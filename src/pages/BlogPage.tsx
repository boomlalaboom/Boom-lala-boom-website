import { useEffect, useMemo, useState } from 'react';
import { Link } from '../components/LocalizedLink';
import { BookOpen, Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, Article } from '../lib/supabase';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';

export function BlogPage() {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return articles;
    return articles.filter((article) => {
      const title = getLocalizedField(article, 'title').toLowerCase();
      const excerpt = getLocalizedField(article, 'excerpt').toLowerCase();
      return title.includes(normalizedQuery) || excerpt.includes(normalizedQuery);
    });
  }, [articles, searchQuery, language]);

  const { featuredArticles, pagedArticles, totalPages, safePage } = useMemo(() => {
    const topRanked = filteredArticles
      .filter((article) => article.top_rank)
      .sort((a, b) => (a.top_rank || 0) - (b.top_rank || 0))
      .slice(0, 3);

    const topRankedIds = new Set(topRanked.map((article) => article.id));
    const mostViewed = filteredArticles
      .filter((article) => !topRankedIds.has(article.id))
      .sort((a, b) => {
        const viewsDiff = (b.view_count || 0) - (a.view_count || 0);
        if (viewsDiff !== 0) return viewsDiff;
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      });

    const featured = [...topRanked, ...mostViewed.slice(0, Math.max(0, 3 - topRanked.length))];
    const featuredIds = new Set(featured.map((article) => article.id));
    const listArticles = filteredArticles.filter((article) => !featuredIds.has(article.id));
    const total = Math.max(1, Math.ceil(listArticles.length / pageSize));
    const safePage = Math.min(currentPage, total);
    const startIndex = (safePage - 1) * pageSize;
    const pageItems = listArticles.slice(startIndex, startIndex + pageSize);

    return {
      featuredArticles: featured,
      pagedArticles: pageItems,
      totalPages: total,
      safePage,
    };
  }, [filteredArticles, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
          <div className="mb-10">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher un article...' : language === 'en' ? 'Search articles...' : 'Buscar artículos...'}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white shadow-md border border-transparent focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-[rgba(255,123,172,0.25)] outline-none"
              />
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">
                {language === 'fr' ? 'Aucun article pour le moment' : language === 'en' ? 'No articles yet' : 'Aún no hay artículos'}
              </p>
            </div>
          ) : (
            <>
              {featuredArticles.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-800">
                      {language === 'fr' ? 'Les plus vus' : language === 'en' ? 'Most viewed' : 'Más vistos'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredArticles.map((article, index) => (
                      <Link
                        key={article.id}
                        to={`/blog/${getSlug(article)}`}
                        className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
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
                          <div className="absolute top-4 left-4 bg-[var(--brand-blue)] text-white px-3 py-1 rounded-full text-sm font-bold">
                            #{index + 1}
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[var(--brand-red)] transition-colors line-clamp-2">
                            {getLocalizedField(article, 'title')}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {getLocalizedField(article, 'excerpt')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pagedArticles.map((article, index) => (
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

              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safePage === 1}
                    className="px-6 py-3 rounded-full bg-white text-gray-700 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'fr' ? 'Page précédente' : language === 'en' ? 'Previous page' : 'Página anterior'}
                  </button>
                  <span className="text-sm text-gray-500">
                    {language === 'fr'
                      ? `Page ${safePage} sur ${totalPages}`
                      : language === 'en'
                        ? `Page ${safePage} of ${totalPages}`
                        : `Página ${safePage} de ${totalPages}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safePage === totalPages}
                    className="px-6 py-3 rounded-full bg-[var(--brand-blue)] text-white font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'fr' ? 'Page suivante' : language === 'en' ? 'Next page' : 'Página siguiente'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
