import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, Download, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from '../components/PageHero';
import { supabase, Character } from '../lib/supabase';
import { LoadingState } from '../components/LoadingState';

export function CharacterDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!slug) return;
      setLoading(true);
      const decodedSlug = decodeURIComponent(slug);
      const slugKey = `slug_${language}` as keyof Character;
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq(slugKey, decodedSlug);

      if (!error && data && data.length) {
        setCharacter(data[0]);
      } else {
        const { data: fallbackData } = await supabase
          .from('characters')
          .select('*')
          .or(`slug_fr.eq.${decodedSlug},slug_en.eq.${decodedSlug},slug_es.eq.${decodedSlug}`);
        if (fallbackData && fallbackData.length) {
          setCharacter(fallbackData[0]);
        } else {
          const { data: ilikeData } = await supabase
            .from('characters')
            .select('*')
            .or(`slug_fr.ilike.${decodedSlug},slug_en.ilike.${decodedSlug},slug_es.ilike.${decodedSlug}`);
          setCharacter(ilikeData && ilikeData.length ? ilikeData[0] : null);
        }
      }
      setLoading(false);
    };

    loadCharacter();
  }, [language, slug]);

  const labels = useMemo(() => {
    if (language === 'en') {
      return {
        coloringTitle: 'Coloring page',
        download: 'Download',
        videoTitle: 'Character video',
        back: 'Back to characters',
        notFound: 'Character not found',
        notFoundText: 'This character is not available yet.',
      };
    }
    if (language === 'es') {
      return {
        coloringTitle: 'Dibujo para colorear',
        download: 'Descargar',
        videoTitle: 'Video del personaje',
        back: 'Volver a personajes',
        notFound: 'Personaje no encontrado',
        notFoundText: 'Este personaje aun no esta disponible.',
      };
    }
    return {
      coloringTitle: 'Coloriage du personnage',
      download: 'Telecharger',
      videoTitle: 'Video du personnage',
      back: 'Retour aux personnages',
      notFound: 'Personnage introuvable',
      notFoundText: 'Ce personnage n est pas encore disponible.',
    };
  }, [language]);

  if (loading) {
    return <LoadingState />;
  }

  if (!character) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{labels.notFound}</h1>
          <p className="text-gray-600 mb-6">{labels.notFoundText}</p>
          <Link to="/characters" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            {labels.back}
          </Link>
        </div>
      </div>
    );
  }

  // Utiliser uniquement les données de Supabase
  const name = (character[`name_${language}` as keyof Character] as string) || character.name_fr;
  const description = (character[`description_${language}` as keyof Character] as string) || character.description_fr;
  const universe = (character[`universe_${language}` as keyof Character] as string) || character.universe_fr || '';
  const videoId = (character[`video_id_${language}` as keyof Character] as string) || character.video_id_fr || '';
  const imageUrl = character.image_url || '';
  const coloringUrl = character.coloring_url || imageUrl;
  const colorPrimary = character.color_primary || '#0457BA';

  return (
    <div>
      <PageHero
        title={name}
        subtitle={description}
        variant="blue"
      />

      <section className="py-16 px-4 section-bg-yellow screen-section">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md"
                  style={{ border: `4px solid ${colorPrimary}` }}
                >
                  <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-3xl font-black" style={{ color: colorPrimary }}>
                    {name}
                  </h2>
                  <p className="text-gray-600">{universe}</p>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border border-[rgba(4,87,186,0.15)]">
                <h3 className="text-xl font-bold text-[var(--brand-blue)] mb-3">
                  {language === 'fr'
                    ? 'Son univers'
                    : language === 'en'
                      ? 'Their universe'
                      : 'Su universo'}
                </h3>
                <p className="text-gray-700 leading-relaxed">{universe}</p>
              </div>

              <div className="mt-6">
                <Link to="/characters" className="inline-flex items-center gap-2 text-[var(--brand-blue)] font-semibold">
                  <ArrowLeft className="w-5 h-5" />
                  {labels.back}
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--brand-blue)]">
                  <PlayCircle className="w-4 h-4 text-[var(--brand-orange)]" />
                  {labels.videoTitle}
                </div>
                <div className="mt-4 rounded-2xl overflow-hidden bg-[rgba(0,0,0,0.1)]">
                  {videoId ? (
                    <iframe
                      title={`${name} video`}
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&mute=1`}
                      className="w-full aspect-video"
                      allow="autoplay"
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center text-gray-500">
                      {language === 'fr'
                        ? 'Aucune video disponible'
                        : language === 'en'
                          ? 'No video available'
                          : 'No hay video disponible'}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {language === 'fr'
                    ? 'La video se lance automatiquement en muet.'
                    : language === 'en'
                      ? 'The video starts automatically muted.'
                      : 'El video se inicia automaticamente en silencio.'}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--brand-blue)]">{labels.coloringTitle}</h3>
                    <p className="text-gray-600">
                      {language === 'fr'
                        ? 'Imprime et colorie ton personnage.'
                        : language === 'en'
                          ? 'Print and color your character.'
                          : 'Imprime y colorea tu personaje.'}
                    </p>
                  </div>
                  <a
                    href={coloringUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-blue)] text-white font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    {labels.download}
                  </a>
                </div>
                <div className="mt-4 rounded-2xl overflow-hidden bg-[rgba(4,87,186,0.08)]">
                  <img src={coloringUrl} alt={name} className="w-full h-48 sm:h-56 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
