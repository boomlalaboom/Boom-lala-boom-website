import { useEffect, useRef, useState } from 'react';

interface AnimatedLogoProps {
  size?: number; // Taille en pixels (défaut: 300)
}

export function AnimatedLogo({ size = 300 }: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const logoX = rect.left + rect.width / 2;
      const logoY = rect.top + rect.height / 2;

      // Position de la souris relative au logo
      const mouseX = e.clientX - logoX;
      const mouseY = e.clientY - logoY;

      // Calculer l'angle et la distance
      const angle = Math.atan2(mouseY, mouseX);
      const distance = Math.sqrt(mouseX ** 2 + mouseY ** 2);

      // Position des pupilles (limitée à 15px max de mouvement)
      const maxMove = 15;
      const moveRatio = Math.min(distance / 500, 1); // Plus on est loin, plus ça bouge
      const moveX = Math.cos(angle) * maxMove * moveRatio;
      const moveY = Math.sin(angle) * maxMove * moveRatio;

      setLeftPupil({ x: moveX, y: moveY });
      setRightPupil({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  // Positions des yeux en pourcentage du logo (basées sur le SVG)
  // Œil gauche: cx="781.92" cy="623.84" (39.1%, 31.2% de 2000x2000)
  // Œil droit: cx="1188.22" cy="615.07" (59.4%, 30.8%)
  const leftEyePos = { x: 39.1, y: 31.2 };
  const rightEyePos = { x: 59.4, y: 30.8 };

  // Taille pupille proportionnelle au logo (agrandie)
  const pupilSize = size * 0.13; // 13% de la taille du logo

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* Logo SVG de base */}
      <img
        src="/LOGO_BOOMLALABOOM.svg"
        alt="BoomLaLaBoom"
        className="w-full h-full object-contain"
      />

      {/* Pupille gauche (bleue fixe) */}
      <div
        className="absolute rounded-full bg-[#1a1a4d] shadow-lg"
        style={{
          width: pupilSize,
          height: pupilSize,
          left: `calc(${leftEyePos.x}% - ${pupilSize / 2}px)`,
          top: `calc(${leftEyePos.y}% - ${pupilSize / 2}px)`,
        }}
      >
        {/* Reflet blanc qui bouge */}
        <div
          className="absolute bg-white rounded-full transition-transform duration-100 ease-out"
          style={{
            width: pupilSize * 0.35,
            height: pupilSize * 0.35,
            top: '20%',
            left: '25%',
            transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
          }}
        />
      </div>

      {/* Pupille droite (bleue fixe) */}
      <div
        className="absolute rounded-full bg-[#1a1a4d] shadow-lg"
        style={{
          width: pupilSize,
          height: pupilSize,
          left: `calc(${rightEyePos.x}% - ${pupilSize / 2}px)`,
          top: `calc(${rightEyePos.y}% - ${pupilSize / 2}px)`,
        }}
      >
        {/* Reflet blanc qui bouge */}
        <div
          className="absolute bg-white rounded-full transition-transform duration-100 ease-out"
          style={{
            width: pupilSize * 0.35,
            height: pupilSize * 0.35,
            top: '20%',
            left: '25%',
            transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
          }}
        />
      </div>
    </div>
  );
}
