import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Volume2, VolumeX, RotateCcw, ArrowRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Card = {
  id: string;
  pairId: string;
  content: string;
};

const LEVELS = [4, 6, 8, 12];
const SYMBOLS = [
  { id: 'cow', src: '/animals/Cow.png', alt: 'Lola la vache' },
  { id: 'pig', src: '/animals/pig.png', alt: 'Cochon' },
  { id: 'sheep', src: '/animals/sheep.png', alt: 'Mouton' },
  { id: 'horse', src: '/animals/Horse.png', alt: 'Cheval' },
  { id: 'duck', src: '/animals/duck.png', alt: 'Canard' },
  { id: 'bird', src: '/animals/bird.png', alt: 'Oiseau' },
];
const LOLA_VIDEO_ID = 'eL9SThZ0k6U';

export function LolaMemoryPage() {
  const { language } = useLanguage();
  const [levelIndex, setLevelIndex] = useState(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [checking, setChecking] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [customVideoId, setCustomVideoId] = useState<string | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const songId = searchParams.get('songId');

  useEffect(() => {
    if (songId) {
      const fetchSong = async () => {
        const { data, error } = await supabase
          .from('songs')
          .select(`youtube_id_${language}`)
          .eq('id', songId)
          .single();

        if (data && !error) {
          const vid = data[`youtube_id_${language}` as keyof typeof data];
          if (vid) setCustomVideoId(vid);
        }
      };
      fetchSong();
    }
  }, [songId, language]);

  const pairsCount = LEVELS[levelIndex] / 2;

  const shuffledSymbols = useMemo(() => {
    const pool = [...SYMBOLS].sort(() => Math.random() - 0.5);
    return pool.slice(0, pairsCount);
  }, [pairsCount]);

  useEffect(() => {
    const cards = shuffledSymbols.flatMap((symbol, index) => {
      const pairId = `pair-${index}`;
      return [
        { id: `${pairId}-a`, pairId, content: symbol.src },
        { id: `${pairId}-b`, pairId, content: symbol.src },
      ];
    });
    const shuffled = cards.sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setChecking(false);
  }, [levelIndex, shuffledSymbols]);

  const isMatched = (id: string) => matched.has(id);
  const isFlipped = (id: string) => flipped.includes(id) || isMatched(id);

  const handleFlip = (id: string) => {
    if (checking || isFlipped(id)) return;
    if (!audioStarted) {
      setAudioStarted(true);
      setAudioOn(true);
    }
    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setChecking(true);
      const [firstId, secondId] = nextFlipped;
      const first = deck.find((card) => card.id === firstId);
      const second = deck.find((card) => card.id === secondId);

      if (first && second && first.pairId === second.pairId) {
        setMatched((prev) => new Set([...prev, firstId, secondId]));
        setTimeout(() => {
          setFlipped([]);
          setChecking(false);
        }, 400);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setChecking(false);
        }, 800);
      }
    }
  };

  const totalPairsFound = matched.size / 2;
  const totalPairs = pairsCount;
  const levelComplete = totalPairsFound === totalPairs;

  const resetLevel = () => {
    setLevelIndex(0);
  };

  const nextLevel = () => {
    setLevelIndex((prev) => Math.min(prev + 1, LEVELS.length - 1));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#00B7FF] to-[#0457BA] text-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              {language === 'fr' ? 'Jeu mémoire de Lola' : language === 'en' ? 'Lola Memory Game' : 'Memoria de Lola'}
            </div>
            <h1 className="text-3xl md:text-5xl font-black mt-4 text-[#FFE600]">
              {language === 'fr' ? 'Retourne les bonnes cartes !' : language === 'en' ? 'Find the matching cards!' : '¡Encuentra las parejas!'}
            </h1>
            <p className="mt-3 text-lg text-[#FF9F00] max-w-2xl">
              {language === 'fr'
                ? 'Écoute Lola la vache et entraîne ta mémoire. Plus tu avances, plus le jeu devient difficile.'
                : language === 'en'
                  ? 'Listen to Lola the cow and train your memory. Each level gets a little harder.'
                  : 'Escucha a la vaca Lola y entrena tu memoria. Cada nivel es un poco más difícil.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!audioStarted) setAudioStarted(true);
                setAudioOn((prev) => !prev);
              }}
              className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full hover:bg-white/25 transition-all"
            >
              {audioOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="font-semibold">
                {audioOn ? (language === 'fr' ? 'Musique activée' : language === 'en' ? 'Music on' : 'Música activada')
                  : (language === 'fr' ? 'Activer la musique' : language === 'en' ? 'Turn music on' : 'Activar música')}
              </span>
            </button>
            <button
              onClick={resetLevel}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[#0457BA] font-semibold hover:bg-[#FFE600] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              {language === 'fr' ? 'Recommencer' : language === 'en' ? 'Restart' : 'Reiniciar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm uppercase tracking-wide text-white/70">
                  {language === 'fr' ? 'Niveau' : language === 'en' ? 'Level' : 'Nivel'}
                </span>
                <span className="text-2xl font-black text-[#FFE600]">
                  {levelIndex + 1}
                </span>
                <span className="text-white/70">
                  {language === 'fr' ? `${LEVELS[levelIndex]} cartes` : language === 'en' ? `${LEVELS[levelIndex]} cards` : `${LEVELS[levelIndex]} cartas`}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-white/70">{language === 'fr' ? 'Coups' : language === 'en' ? 'Moves' : 'Movimientos'}</span>
                  <div className="text-xl font-bold text-white">{moves}</div>
                </div>
                <div>
                  <span className="text-white/70">{language === 'fr' ? 'Paires' : language === 'en' ? 'Pairs' : 'Parejas'}</span>
                  <div className="text-xl font-bold text-white">{totalPairsFound}/{totalPairs}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 max-w-5xl mx-auto">
              {deck.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  className={`relative w-24 h-32 sm:w-28 sm:h-40 md:w-36 md:h-52 rounded-2xl transition-all duration-300 shadow-lg ${isFlipped(card.id)
                    ? 'bg-white scale-105'
                    : 'bg-gradient-to-br from-[#FFE600] to-[#FF9F00] hover:scale-105'
                    }`}
                >
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden">
                    {isFlipped(card.id) ? (
                      <img src={card.content} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🐾</span>
                    )}
                  </span>
                  {isMatched(card.id) && (
                    <span className="absolute top-2 right-2 bg-[#39B54A] text-white text-xs px-2 py-1 rounded-full">
                      {language === 'fr' ? 'Trouvé' : language === 'en' ? 'Matched' : 'Encontrado'}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {levelComplete && (
              <div className="mt-8 bg-white rounded-3xl p-6 text-center text-[#0457BA]">
                <h2 className="text-2xl font-black">
                  {language === 'fr' ? 'Bravo ! Niveau terminé.' : language === 'en' ? 'Great job! Level complete.' : '¡Muy bien! Nivel completado.'}
                </h2>
                <p className="mt-2 text-gray-600">
                  {language === 'fr'
                    ? 'Prêt pour le niveau suivant ?'
                    : language === 'en'
                      ? 'Ready for the next level?'
                      : '¿Listo para el siguiente nivel?'}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {levelIndex < LEVELS.length - 1 ? (
                    <button
                      onClick={nextLevel}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0457BA] text-white font-bold hover:bg-[#002C72] transition-all"
                    >
                      {language === 'fr' ? 'Niveau suivant' : language === 'en' ? 'Next level' : 'Siguiente nivel'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={resetLevel}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0457BA] text-white font-bold hover:bg-[#002C72] transition-all"
                    >
                      {language === 'fr' ? 'Rejouer' : language === 'en' ? 'Play again' : 'Jugar otra vez'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-white/70">
              <PlayCircle className="w-4 h-4 text-yellow-300" />
              {language === 'fr' ? 'Vidéo de Lola' : language === 'en' ? 'Lola video' : 'Video de Lola'}
            </div>
            <div className="mt-4 rounded-2xl overflow-hidden bg-white/20">
              <iframe
                key={audioOn ? 'sound-on' : 'sound-off'}
                title="Lola la vache"
                src={`https://www.youtube.com/embed/${customVideoId || LOLA_VIDEO_ID}?autoplay=${audioStarted ? 1 : 0}&loop=1&playlist=${customVideoId || LOLA_VIDEO_ID}&controls=0&modestbranding=1&rel=0&mute=${audioOn ? 0 : 1}`}
                className="w-full aspect-video"
                allow="autoplay"
              />
            </div>
            <p className="mt-4 text-sm text-white/70">
              {language === 'fr'
                ? 'La vidéo se lance automatiquement. Active le son si besoin.'
                : language === 'en'
                  ? 'The video starts automatically. Turn on the sound if needed.'
                  : 'El video se inicia automáticamente. Activa el sonido si lo necesitas.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
