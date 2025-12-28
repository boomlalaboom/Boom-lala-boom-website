import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  variant?: 'yellow' | 'blue' | 'pink' | 'green' | 'purple' | 'orange' | 'cyan';
}

export function PageHero({ title, subtitle, icon, variant = 'yellow' }: PageHeroProps) {
  const styles = {
    yellow: {
      bg: 'from-[#FFE600] to-[#FF9F00]',
      title: 'text-[#0457BA]',
      subtitle: 'text-[#E91E63]'
    },
    blue: {
      bg: 'from-[#00B7FF] to-[#0457BA]',
      title: 'text-[#FFE600]',
      subtitle: 'text-white'
    },
    pink: {
      bg: 'from-[#FF9A9E] to-[#FECFEF]',
      title: 'text-[#C71585]',
      subtitle: 'text-[#880E4F]'
    },
    green: {
      bg: 'from-[#84FAB0] to-[#8FD3F4]',
      title: 'text-[#00695C]',
      subtitle: 'text-[#004D40]'
    },
    purple: {
      bg: 'from-[#E0C3FC] to-[#8EC5FC]',
      title: 'text-[#4A148C]',
      subtitle: 'text-[#311B92]'
    },
    orange: {
      bg: 'from-[#FFECD2] to-[#FCB69F]',
      title: 'text-[#E65100]',
      subtitle: 'text-[#BF360C]'
    },
    cyan: {
      bg: 'from-[#00C6FF] to-[#0072FF]',
      title: 'text-white',
      subtitle: 'text-[#E3F2FD]'
    }
  };

  const currentStyle = styles[variant] || styles.yellow;

  return (
    <section className="relative overflow-hidden py-14 px-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentStyle.bg} opacity-90`}></div>
      <div className="container mx-auto relative z-10 text-center">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-4 shadow-lg border border-white/30">
            {icon}
          </div>
        )}
        <h1 className={`text-3xl md:text-5xl font-black mb-4 ${currentStyle.title} drop-shadow-sm`}>
          {title}
        </h1>
        <p className={`text-xl md:text-2xl font-medium ${currentStyle.subtitle}`}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
