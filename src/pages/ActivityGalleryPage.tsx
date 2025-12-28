import { useEffect, useState } from 'react';
import { Link } from '../components/LocalizedLink';
import { Palette, Scissors, Download, ArrowLeft, Printer, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase, Activity } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { PageHero } from '../components/PageHero';
import { LoadingState } from '../components/LoadingState';
import { SeoHead } from '../components/SeoHead';

type ActivityType = 'coloring' | 'cutting';

interface ActivityGalleryPageProps {
  activityType: ActivityType;
}

export function ActivityGalleryPage({ activityType }: ActivityGalleryPageProps) {
  const { language } = useLanguage();
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('activities')
          .select('*')
          .eq('activity_type', activityType)
          .order('created_at', { ascending: false });
        setItems(data || []);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [activityType]);

  const getLocalizedField = (item: Activity, field: string) => {
    const key = `${field}_${language}` as keyof Activity;
    return (item[key] as string) || (item[`${field}_fr` as keyof Activity] as string) || '';
  };

  const getDownloadUrl = (item: Activity) => {
    const key = `pdf_url_${language}` as keyof Activity;
    return (item[key] as string) || item.thumbnail_url || '';
  };



  const pageTitle = activityType === 'coloring'
    ? language === 'fr' ? 'Coloriages' : language === 'en' ? 'Coloring Pages' : 'Páginas para Colorear'
    : language === 'fr' ? 'Découpages' : language === 'en' ? 'Paper Crafts' : 'Manualidades';

  const pageSubtitle = activityType === 'coloring'
    ? language === 'fr'
      ? 'Télécharge et imprime des coloriages pour t\'amuser.'
      : language === 'en'
        ? 'Download and print coloring pages to have fun.'
        : 'Descarga e imprime dibujos para divertirte.'
    : language === 'fr'
      ? 'Télécharge et crée tes découpages en papier.'
      : language === 'en'
        ? 'Download and build your paper crafts.'
        : 'Descarga y crea tus manualidades.';

  const seoDescription = activityType === 'coloring'
    ? language === 'fr'
      ? 'Découvrez nos coloriages gratuits à imprimer pour enfants. Des dessins amusants et éducatifs avec les personnages de BoomLaLaBoom.'
      : language === 'en'
        ? 'Discover our free printable coloring pages for kids. Fun and educational drawings featuring BoomLaLaBoom characters.'
        : 'Descubre nuestros dibujos para colorear gratuitos para niños. Dibujos divertidos y educativos con los personajes de BoomLaLaBoom.'
    : language === 'fr'
      ? 'Activités manuelles et découpages gratuits pour enfants. Créez des figurines et jeux en papier avec BoomLaLaBoom.'
      : language === 'en'
        ? 'Free paper crafts and cut-out activities for kids. Create paper figures and games with BoomLaLaBoom.'
        : 'Manualidades y recortables gratuitos para niños. Crea figuras y juegos de papel con BoomLaLaBoom.';

  const emptyText = activityType === 'coloring'
    ? language === 'fr' ? 'Aucun coloriage disponible pour le moment.' : language === 'en' ? 'No coloring pages available yet.' : 'No hay dibujos disponibles por ahora.'
    : language === 'fr' ? 'Aucun découpage disponible pour le moment.' : language === 'en' ? 'No paper crafts available yet.' : 'No hay manualidades disponibles por ahora.';

  const icon = activityType === 'coloring'
    ? <Palette className="w-8 h-8 text-white" />
    : <Scissors className="w-8 h-8 text-white" />;

  const downloadText = language === 'fr' ? 'Télécharger' : language === 'en' ? 'Download' : 'Descargar';
  const printText = language === 'fr' ? 'Imprimer' : language === 'en' ? 'Print' : 'Imprimir';

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <SeoHead
        title={`${pageTitle} - BoomLaLaBoom`}
        description={seoDescription}
      />
      <PageHero
        title={pageTitle}
        subtitle={pageSubtitle}
        icon={icon}
        variant={activityType === 'coloring' ? 'pink' : 'green'}
      />

      <section className="py-16 px-4 section-bg-yellow relative overflow-hidden">

        <div className="container mx-auto max-w-6xl relative z-10">
          {items.length === 0 ? (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl p-8">
              <p className="text-xl text-gray-500 mb-6">{emptyText}</p>
              <Link to="/activities" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                {language === 'fr' ? 'Retour aux activités' : language === 'en' ? 'Back to activities' : 'Volver a actividades'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, index) => (
                <ActivityCard
                  key={item.id}
                  item={item}
                  index={index}
                  activityType={activityType}
                  printText={printText}
                  downloadText={downloadText}
                  getLocalizedField={getLocalizedField}
                  getDownloadUrl={getDownloadUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ActivityCardProps {
  item: Activity;
  index: number;
  activityType: ActivityType;
  printText: string;
  downloadText: string;
  getLocalizedField: (item: Activity, field: string) => string;
  getDownloadUrl: (item: Activity) => string;
}

function ActivityCard({
  item,
  index,
  activityType,
  printText,
  downloadText,
  getLocalizedField,
  getDownloadUrl
}: ActivityCardProps) {
  const title = getLocalizedField(item, 'title');
  const description = getLocalizedField(item, 'description');
  const downloadUrl = getDownloadUrl(item);

  // Combine thumbnail and gallery URLs
  const allImages = [
    item.thumbnail_url || downloadUrl || '',
    ...(item.gallery_urls || [])
  ].filter(Boolean);

  const [currentImage, setCurrentImage] = useState(allImages[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Update current image if item changes (e.g. strict mode re-renders)
  useEffect(() => {
    setCurrentImage(allImages[0]);
  }, [item.thumbnail_url, item.gallery_urls]);

  const delay = index * 100;

  const openModal = (imgIndex: number) => {
    if (imgIndex < 0 || imgIndex >= allImages.length) return;
    setModalImageIndex(imgIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCardDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Get filename from URL or default
      const filename = downloadUrl.split('/').pop()?.split('?')[0] || `BoomLaLaBoom-${activityType}-${Date.now()}.pdf`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <>
      <div
        className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group cursor-pointer" onClick={() => openModal(allImages.indexOf(currentImage))}>
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

              {/* Quick action overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(allImages.indexOf(currentImage));
                  }}
                  className="p-3 bg-white text-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                  title={printText}
                >
                  <Printer className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-5xl bg-gradient-to-br from-gray-50 to-gray-100">🎨</div>
          )}

          {/* New Badge */}
          {index < 2 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-3">
              NEW!
            </div>
          )}

          {/* Gallery Dots/Thumbnails Overlay if multiple images */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 p-2 bg-gradient-to-t from-black/50 to-transparent">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentImage(img);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === img ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">{title}</h3>
          <p className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed flex-grow">{description}</p>

          {/* Mini Gallery Grid */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImage(img)}
                  className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${currentImage === img ? 'border-[var(--brand-pink)] scale-105' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {downloadUrl && (
            <button
              onClick={handleCardDownload}
              className={`
                            w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95
                            ${activityType === 'coloring'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                }
                          `}
            >
              <Download className="w-5 h-5" />
              {downloadText}
            </button>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isModalOpen && allImages.length > 0 && (
        <ImageViewerModal
          images={allImages}
          initialIndex={Math.max(0, Math.min(modalImageIndex, allImages.length - 1))}
          onClose={closeModal}
          printText={printText}
          downloadText={downloadText}
          activityType={activityType}
        />
      )}
    </>
  );
}

// Modal Component for viewing/printing/downloading
interface ImageViewerModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  printText: string;
  downloadText: string;
  activityType: ActivityType;
}


function ImageViewerModal({ images, initialIndex, onClose, printText, downloadText, activityType }: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Safety check to prevent crash if images is empty or index invalid
  if (!images || images.length === 0) return null;
  const safeIndex = Math.max(0, Math.min(currentIndex, images.length - 1));
  const currentImageUrl = images[safeIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handlePrintCurrent = () => {
    const urlWindow = window.open(currentImageUrl, '_blank');
    if (urlWindow) {
      urlWindow.onload = () => {
        urlWindow.print();
      };
    }
  };

  const handleDownloadCurrent = async () => {
    try {
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BoomLaLaBoom-${activityType}-${Date.now()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      window.open(currentImageUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-4 text-white">
          <div className="text-sm font-medium opacity-80">
            {safeIndex + 1} / {images.length}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Main Image Area */}
        <div className="flex-grow flex items-center justify-center relative bg-black/50 rounded-2xl overflow-hidden mb-4 border border-white/10">
          <img
            src={currentImageUrl}
            alt="Full view"
            className="max-w-full max-h-full object-contain shadow-2xl"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePrintCurrent}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Printer className="w-5 h-5" />
            {printText}
          </button>

          <button
            onClick={handleDownloadCurrent}
            className={`
                            flex items-center gap-2 px-6 py-3 font-bold text-white rounded-xl shadow-lg transition-colors
                            ${activityType === 'coloring'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }
                        `}
          >
            <Download className="w-5 h-5" />
            {downloadText}
          </button>
        </div>

        {/* Thumbnails Strip */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 overflow-x-auto py-2">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${i === safeIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" title={`${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
