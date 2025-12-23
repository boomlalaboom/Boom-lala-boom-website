interface LoadingLogoProps {
  size?: number; // Taille en pixels (défaut: 80)
  text?: string; // Texte optionnel en dessous
}

export function LoadingLogo({ size = 80, text = 'Chargement...' }: LoadingLogoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="animate-spin"
        style={{
          width: size,
          height: size,
          animationDuration: '1.5s',
        }}
      >
        <img
          src="/LOGO_BOOMLALABOOM.svg"
          alt="Loading"
          className="w-full h-full object-contain"
        />
      </div>
      {text && (
        <p className="text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}
