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
      const distance = Math.min(Math.sqrt(mouseX ** 2 + mouseY ** 2), size * 0.08); // Max 8% du logo

      // Position des pupilles (limitée)
      const maxMove = size * 0.05; // Max 5% du logo
      const moveX = Math.cos(angle) * Math.min(distance, maxMove);
      const moveY = Math.sin(angle) * Math.min(distance, maxMove);

      setLeftPupil({ x: moveX, y: moveY });
      setRightPupil({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  // Positions des yeux en pourcentage du logo
  const leftEyePos = { x: 35, y: 28 }; // Œil gauche
  const rightEyePos = { x: 57, y: 28 }; // Œil droit
  const eyeSize = size * 0.17; // Taille de l'œil (17% du logo)
  const pupilSize = eyeSize * 0.35; // Taille de la pupille (35% de l'œil)

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* Logo de base */}
      <img
        src="/logo_boomlalaboom.png"
        alt="BoomLaLaBoom"
        className="w-full h-full object-contain"
      />

      {/* Pupille gauche */}
      <div
        className="absolute rounded-full bg-[#1a1a4d] transition-transform duration-100 ease-out"
        style={{
          width: pupilSize,
          height: pupilSize,
          left: `${leftEyePos.x}%`,
          top: `${leftEyePos.y}%`,
          transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
        }}
      >
        {/* Reflet blanc dans la pupille */}
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: pupilSize * 0.3,
            height: pupilSize * 0.3,
            top: '15%',
            left: '20%',
          }}
        />
      </div>

      {/* Pupille droite */}
      <div
        className="absolute rounded-full bg-[#1a1a4d] transition-transform duration-100 ease-out"
        style={{
          width: pupilSize,
          height: pupilSize,
          left: `${rightEyePos.x}%`,
          top: `${rightEyePos.y}%`,
          transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
        }}
      >
        {/* Reflet blanc dans la pupille */}
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: pupilSize * 0.3,
            height: pupilSize * 0.3,
            top: '15%',
            left: '20%',
          }}
        />
      </div>
    </div>
  );
}
