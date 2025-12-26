import { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, PlayCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SeoHead } from '../components/SeoHead';

type SharkType = 'baby' | 'papa' | 'mama' | 'grandma' | 'grandpa';

type Fish = {
  id: string;
  type: SharkType | 'fish';
  x: number;
  y: number;
  speed: number;
  size: number;
};

type Instruction = {
  sharks: SharkType[];
  order?: boolean; // Si true, l'ordre est important
};

const SHARKS: { type: SharkType; name: { fr: string; en: string; es: string } }[] = [
  { type: 'baby', name: { fr: 'Bébé Requin', en: 'Baby Shark', es: 'Bebé Tiburón' } },
  { type: 'papa', name: { fr: 'Papa Requin', en: 'Papa Shark', es: 'Papá Tiburón' } },
  { type: 'mama', name: { fr: 'Maman Requin', en: 'Mama Shark', es: 'Mamá Tiburón' } },
  { type: 'grandma', name: { fr: 'Mamie Requin', en: 'Grandma Shark', es: 'Abuela Tiburón' } },
  { type: 'grandpa', name: { fr: 'Papi Requin', en: 'Grandpa Shark', es: 'Abuelo Tiburón' } },
];

// Vidéos Baby Shark selon la langue
const BABY_SHARK_VIDEOS = {
  fr: 'eL9SThZ0k6U', // Baby Shark en français
  en: 'XqZsoesa55w', // Baby Shark en anglais
  es: 'R2LrYx8wb-E', // Baby Shark en espagnol
};

const ROUNDS: Instruction[] = [
  { sharks: ['baby'] }, // Round 1: attraper Baby Shark
  { sharks: ['papa'] }, // Round 2: attraper Papa Shark
  { sharks: ['mama'] }, // Round 3: attraper Mama Shark
  { sharks: ['baby', 'papa'] }, // Round 4: attraper 2 requins
  { sharks: ['baby', 'mama'] }, // Round 5: attraper 2 requins
];

export function SharkRhythmGamePage() {
  const { language } = useLanguage();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const [round, setRound] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [caughtSharks, setCaughtSharks] = useState<SharkType[]>([]);
  const [score, setScore] = useState(0);
  const [audioOn, setAudioOn] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [netPosition, setNetPosition] = useState({ x: 0, y: 0 });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
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

  const currentInstruction = ROUNDS[round];
  const baseSpeed = 0.3 + round * 0.1; // Vitesse très lente
  const fishCount = 2 + round; // Moins de poissons

  // Fonction pour générer un poisson ou requin aléatoire (qui tombe du haut)
  const generateFish = (): Fish => {
    const isShark = Math.random() < 0.4; // 40% de chance d'être un requin
    const sharkType = isShark
      ? SHARKS[Math.floor(Math.random() * SHARKS.length)].type
      : 'fish';

    return {
      id: Math.random().toString(36),
      type: sharkType,
      x: Math.random() * 80 + 10, // Position horizontale aléatoire entre 10% et 90%
      y: -20, // Commence au-dessus de l'écran
      speed: baseSpeed,
      size: 120, // Taille fixe et grosse pour tous
    };
  };

  // Initialiser les poissons pour un round
  useEffect(() => {
    if (!gameStarted) return;

    const initialFishes: Fish[] = [];

    // Ajouter les requins requis
    currentInstruction.sharks.forEach((sharkType, index) => {
      initialFishes.push({
        id: `required-${sharkType}-${index}`,
        type: sharkType,
        x: 20 + index * 30, // Espacés horizontalement
        y: -20 - index * 40, // Décalés verticalement pour tomber un par un
        speed: baseSpeed,
        size: 120, // Taille fixe et grosse pour tous
      });
    });

    // Ajouter des poissons normaux et autres requins
    for (let i = 0; i < fishCount; i++) {
      initialFishes.push(generateFish());
    }

    setFishes(initialFishes);
    setCaughtSharks([]);
    setRoundComplete(false);
  }, [round, gameStarted]);

  // Animation des poissons (tombent du haut vers le bas)
  useEffect(() => {
    if (!gameStarted) return;

    const animate = () => {
      setFishes((prevFishes) => {
        const updated = prevFishes
          .map((fish) => ({
            ...fish,
            y: fish.y + fish.speed, // Mouvement vertical vers le bas
          }))
          .filter((fish) => fish.y < 110); // Retirer les poissons hors écran (en bas)

        // Ajouter de nouveaux poissons aléatoirement
        if (Math.random() < 0.02 && updated.length < fishCount + 5) {
          updated.push(generateFish());
        }

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, fishCount]);

  // Suivre la souris pour l'épuisette
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      setNetPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Vérifier si le round est complété
  useEffect(() => {
    if (!gameStarted) return;

    const instruction = currentInstruction;

    if (instruction.order) {
      // Vérifier l'ordre exact
      if (caughtSharks.length === instruction.sharks.length) {
        const isCorrectOrder = instruction.sharks.every(
          (shark, index) => caughtSharks[index] === shark
        );
        if (isCorrectOrder) {
          setRoundComplete(true);
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 1500);
        }
      }
    } else {
      // Vérifier que tous les requins ont été attrapés (ordre pas important)
      const allCaught = instruction.sharks.every((shark) =>
        caughtSharks.includes(shark)
      );
      if (allCaught && caughtSharks.length === instruction.sharks.length) {
        setRoundComplete(true);
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 1500);
      }
    }
  }, [caughtSharks, currentInstruction, gameStarted]);

  // Attraper un poisson
  const catchFish = (fish: Fish) => {
    if (fish.type === 'fish') return; // Ignorer les poissons normaux

    const sharkType = fish.type as SharkType;

    // Vérifier si c'est un requin demandé
    if (currentInstruction.sharks.includes(sharkType)) {
      if (currentInstruction.order) {
        // Vérifier si c'est le bon requin dans l'ordre
        const nextExpected = currentInstruction.sharks[caughtSharks.length];
        if (sharkType === nextExpected) {
          setCaughtSharks((prev) => [...prev, sharkType]);
          setScore((prev) => prev + 10);
          setFishes((prev) => prev.filter((f) => f.id !== fish.id));
        }
      } else {
        // Attraper sans ordre
        if (!caughtSharks.includes(sharkType)) {
          setCaughtSharks((prev) => [...prev, sharkType]);
          setScore((prev) => prev + 10);
          setFishes((prev) => prev.filter((f) => f.id !== fish.id));
        }
      }
    }
  };

  const handleFishClick = (fish: Fish) => {
    // Attraper directement le poisson cliqué (simplifié pour les enfants)
    catchFish(fish);
  };

  const startGame = () => {
    setShowTutorial(false);
    setGameStarted(true);
    setAudioStarted(true);
    setAudioOn(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextRound = () => {
    if (round < ROUNDS.length - 1) {
      setRound((prev) => prev + 1);
      setRoundComplete(false);
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    setRound(0);
    setScore(0);
    setGameStarted(false);
    setRoundComplete(false);
    setCaughtSharks([]);
  };

  const getInstructionText = () => {
    const instruction = currentInstruction;
    const lang = language as 'fr' | 'en' | 'es';

    if (instruction.sharks.length === 1) {
      const sharkName = SHARKS.find((s) => s.type === instruction.sharks[0])?.name[lang];
      return language === 'fr'
        ? `Attrape ${sharkName} !`
        : language === 'en'
          ? `Catch ${sharkName}!`
          : `¡Atrapa ${sharkName}!`;
    } else if (instruction.order) {
      const names = instruction.sharks.map(
        (s) => SHARKS.find((shark) => shark.type === s)?.name[lang]
      );
      return language === 'fr'
        ? `Attrape dans l'ordre : ${names.join(', ')}`
        : language === 'en'
          ? `Catch in order: ${names.join(', ')}`
          : `Atrapa en orden: ${names.join(', ')}`;
    } else {
      return language === 'fr'
        ? `Attrape ${instruction.sharks.length} requins !`
        : language === 'en'
          ? `Catch ${instruction.sharks.length} sharks!`
          : `¡Atrapa ${instruction.sharks.length} tiburones!`;
    }
  };

  const videoId = customVideoId || BABY_SHARK_VIDEOS[language as keyof typeof BABY_SHARK_VIDEOS] || BABY_SHARK_VIDEOS.fr;

  // SEO
  const baseUrl = 'https://boomlalaboom.com';
  const alternates = [
    { hreflang: 'fr', href: `${baseUrl}/games/shark-rhythm` },
    { hreflang: 'en', href: `${baseUrl}/games/shark-rhythm` },
    { hreflang: 'es', href: `${baseUrl}/games/shark-rhythm` },
    { hreflang: 'x-default', href: `${baseUrl}/games/shark-rhythm` },
  ];

  const titles = {
    fr: 'Rythme Requin - Jeu Baby Shark',
    en: 'Shark Rhythm - Baby Shark Game',
    es: 'Ritmo Tiburón - Juego Baby Shark',
  };

  const descriptions = {
    fr: 'Attrape les requins au rythme de Baby Shark ! Un jeu musical éducatif pour enfants.',
    en: 'Catch the sharks to the rhythm of Baby Shark! An educational music game for kids.',
    es: '¡Atrapa los tiburones al ritmo de Baby Shark! Un juego musical educativo para niños.',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: titles[language as keyof typeof titles],
    description: descriptions[language as keyof typeof descriptions],
    url: `${baseUrl}/games/shark-rhythm`,
    publisher: {
      '@type': 'Organization',
      name: 'BoomLaLaBoom',
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#00B7FF] via-[#0080C8] to-[#004D7A] text-white overflow-hidden">
      <SeoHead
        title={titles[language as keyof typeof titles]}
        description={descriptions[language as keyof typeof descriptions]}
        alternates={alternates}
        jsonLd={jsonLd}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              {language === 'fr' ? 'Rythme Requin' : language === 'en' ? 'Shark Rhythm' : 'Ritmo Tiburón'}
            </div>
            <h1 className="text-3xl md:text-5xl font-black mt-4 text-[#FFE600]">
              {language === 'fr'
                ? 'Attrape les requins !'
                : language === 'en'
                  ? 'Catch the sharks!'
                  : '¡Atrapa los tiburones!'}
            </h1>
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
            </button>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[#0457BA] font-semibold hover:bg-[#FFE600] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              {language === 'fr' ? 'Recommencer' : language === 'en' ? 'Restart' : 'Reiniciar'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8">
          {/* Zone de jeu */}
          <div className="bg-white/10 border border-white/20 rounded-3xl overflow-hidden backdrop-blur-sm relative">
            {showTutorial && !gameStarted ? (
              <div className="flex flex-col items-center justify-center h-[600px] p-8">
                <h2 className="text-3xl font-black text-[#FFE600] mb-6">
                  {language === 'fr'
                    ? 'Comment jouer ?'
                    : language === 'en'
                      ? 'How to play?'
                      : '¿Cómo jugar?'}
                </h2>

                {/* Démonstration visuelle */}
                <div className="bg-gradient-to-b from-[#0080C8]/30 to-[#004D7A]/50 rounded-2xl p-6 mb-6 relative h-64 w-full max-w-md overflow-hidden"
                  style={{
                    backgroundImage: 'url(/images/ocean-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0080C8]/20 to-[#004D7A]/30"></div>

                  {/* Exemple de requin qui tombe */}
                  <div className="absolute animate-float" style={{ left: '30%', top: '20%' }}>
                    <div className="text-6xl">🦈</div>
                  </div>

                  {/* Filet avec la souris */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <img src="/images/net.svg" alt="Net" className="w-24 h-24 animate-bounce" />
                  </div>

                  {/* Flèche indicative */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-[#FFE600] animate-pulse">
                    <div className="text-4xl">↓</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 mb-6 max-w-md">
                  <ul className="space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-2xl">🦈</span>
                      <span className="text-white">
                        {language === 'fr'
                          ? 'Les poissons tombent du haut'
                          : language === 'en'
                            ? 'Fish fall from the top'
                            : 'Los peces caen desde arriba'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-2xl">🖱️</span>
                      <span className="text-white">
                        {language === 'fr'
                          ? 'Bouge ta souris pour déplacer le filet'
                          : language === 'en'
                            ? 'Move your mouse to move the net'
                            : 'Mueve el ratón para mover la red'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-2xl">🎯</span>
                      <span className="text-white">
                        {language === 'fr'
                          ? 'Clique pour attraper les bons requins !'
                          : language === 'en'
                            ? 'Click to catch the right sharks!'
                            : '¡Haz clic para atrapar los tiburones correctos!'}
                      </span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={startGame}
                  className="flex items-center gap-3 bg-[#FFE600] text-[#0457BA] px-8 py-4 rounded-full font-black text-xl hover:bg-[#FF9F00] transition-all shadow-lg"
                >
                  <PlayCircle className="w-8 h-8" />
                  {language === 'fr' ? 'Commencer' : language === 'en' ? 'Start' : 'Empezar'}
                </button>
              </div>
            ) : !gameStarted ? (
              <div className="flex flex-col items-center justify-center h-[600px] p-8">
                <h2 className="text-4xl font-black text-[#FFE600] mb-4">
                  {language === 'fr'
                    ? 'Prêt à jouer ?'
                    : language === 'en'
                      ? 'Ready to play?'
                      : '¿Listo para jugar?'}
                </h2>
                <button
                  onClick={startGame}
                  className="flex items-center gap-3 bg-[#FFE600] text-[#0457BA] px-8 py-4 rounded-full font-black text-xl hover:bg-[#FF9F00] transition-all shadow-lg"
                >
                  <PlayCircle className="w-8 h-8" />
                  {language === 'fr' ? 'Commencer' : language === 'en' ? 'Start' : 'Empezar'}
                </button>
              </div>
            ) : (
              <>
                {/* Barre de statut */}
                <div className="bg-gradient-to-r from-[#0457BA] to-[#00B7FF] p-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm uppercase tracking-wide text-white/70">
                      {language === 'fr' ? 'Round' : language === 'en' ? 'Round' : 'Ronda'}
                    </span>
                    <span className="ml-2 text-2xl font-black text-[#FFE600]">{round + 1}/5</span>
                  </div>
                  <div>
                    <span className="text-sm uppercase tracking-wide text-white/70">
                      {language === 'fr' ? 'Score' : language === 'en' ? 'Score' : 'Puntos'}
                    </span>
                    <span className="ml-2 text-2xl font-black text-white">{score}</span>
                  </div>
                </div>

                {/* Consigne */}
                <div className="bg-white/20 p-4 text-center">
                  {countdown !== null ? (
                    <div className="text-6xl font-black text-[#FFE600] animate-bounce">
                      {countdown}
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-white">{getInstructionText()}</div>
                  )}
                </div>

                {/* Zone océan avec poissons */}
                <div
                  ref={gameAreaRef}
                  className="relative h-[500px] overflow-hidden cursor-none"
                  style={{
                    backgroundImage: 'url(/images/ocean-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Overlay léger pour améliorer la lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0080C8]/20 to-[#004D7A]/30 pointer-events-none"></div>

                  {/* Poissons et requins */}
                  {fishes.map((fish) => (
                    <button
                      key={fish.id}
                      onClick={() => handleFishClick(fish)}
                      className="absolute transition-none cursor-pointer hover:scale-110"
                      style={{
                        left: `${fish.x}%`,
                        top: `${fish.y}%`,
                        width: fish.size + 20,
                        height: fish.size * 0.6 + 20,
                        transform: 'translate(-50%, -50%)',
                        padding: '10px',
                      }}
                    >
                      <img
                        src={
                          fish.type === 'fish'
                            ? '/images/fish.png'
                            : `/images/sharks/${fish.type}-shark.png`
                        }
                        alt={fish.type}
                        className="w-full h-full object-contain pointer-events-none"
                        onError={(e) => {
                          // Placeholder si l'image n'existe pas encore
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"%3E%3Ctext x="50" y="30" text-anchor="middle" font-size="30"%3E🐟%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </button>
                  ))}

                  {/* Épuisette (curseur) */}
                  <div
                    className="absolute pointer-events-none transition-none"
                    style={{
                      left: `${netPosition.x}%`,
                      top: `${netPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full opacity-20 animate-ping" />
                      <img
                        src="/images/net.svg"
                        alt="Fishing net"
                        className="w-full h-full drop-shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Animation de succès */}
                  {showSuccessAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm animate-fade-in">
                      <div className="text-8xl animate-bounce">🎉</div>
                    </div>
                  )}
                </div>

                {/* Modal de complétion de round */}
                {roundComplete && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-white rounded-3xl p-8 text-center max-w-md">
                      <div className="text-6xl mb-4">🎊</div>
                      <h2 className="text-3xl font-black text-[#0457BA] mb-2">
                        {language === 'fr'
                          ? 'Bravo !'
                          : language === 'en'
                            ? 'Great job!'
                            : '¡Muy bien!'}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {round < ROUNDS.length - 1
                          ? language === 'fr'
                            ? 'Prêt pour le round suivant ?'
                            : language === 'en'
                              ? 'Ready for the next round?'
                              : '¿Listo para la siguiente ronda?'
                          : language === 'fr'
                            ? 'Tu as terminé tous les rounds !'
                            : language === 'en'
                              ? 'You completed all rounds!'
                              : '¡Completaste todas las rondas!'}
                      </p>
                      <button
                        onClick={nextRound}
                        className="bg-[#0457BA] text-white px-8 py-4 rounded-full font-black hover:bg-[#002C72] transition-all"
                      >
                        {round < ROUNDS.length - 1
                          ? language === 'fr'
                            ? 'Round suivant'
                            : language === 'en'
                              ? 'Next round'
                              : 'Siguiente ronda'
                          : language === 'fr'
                            ? 'Rejouer'
                            : language === 'en'
                              ? 'Play again'
                              : 'Jugar otra vez'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Vidéo Baby Shark */}
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-white/70 mb-4">
              <PlayCircle className="w-4 h-4 text-yellow-300" />
              Baby Shark
            </div>
            <div className="rounded-2xl overflow-hidden bg-white/20">
              <iframe
                key={`${audioOn}-${language}`}
                title="Baby Shark"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=${audioStarted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&mute=${audioOn ? 0 : 1}`}
                className="w-full aspect-video"
                allow="autoplay"
              />
            </div>
            <p className="mt-4 text-sm text-white/70">
              {language === 'fr'
                ? 'La musique Baby Shark joue automatiquement pendant le jeu.'
                : language === 'en'
                  ? 'Baby Shark music plays automatically during the game.'
                  : 'La música Baby Shark se reproduce automáticamente durante el juego.'}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
