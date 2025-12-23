import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  variant?: 'yellow' | 'blue';
}

export function PageHero({ title, subtitle, icon, variant = 'yellow' }: PageHeroProps) {
  const isBlue = variant === 'blue';
  const backgroundClass = isBlue
    ? 'from-[#00B7FF] to-[#0457BA]'
    : 'from-[#FFE600] to-[#FF9F00]';

  return (
    <section className="relative overflow-hidden py-14 px-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundClass} opacity-80`}></div>
      <div className="container mx-auto relative z-10 text-center">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--brand-pink)] to-[var(--brand-orange)] rounded-full mb-4">
            {icon}
          </div>
        )}
        <h1 className={`text-3xl md:text-5xl font-black mb-4 ${isBlue ? 'text-[#FFE600]' : 'gradient-text'}`}>
          {title}
        </h1>
        <p className={`text-xl md:text-2xl font-medium ${isBlue ? 'text-[#FF9F00]' : 'subtitle-text'}`}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
