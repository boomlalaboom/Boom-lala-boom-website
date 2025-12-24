type LocalizedText = {
  fr: string;
  en: string;
  es: string;
};

export type CharacterProfile = {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  universe: LocalizedText;
  image: string;
  coloringImage: string;
  videoByLang: {
    fr: string;
    en: string;
    es: string;
  };
  colorPrimary: string;
  colorSecondary: string;
};

export const characterProfiles: CharacterProfile[] = [
  {
    slug: 'lola-the-cow',
    name: {
      fr: 'Lola la Vache',
      en: 'Lola the Cow',
      es: 'La Vaca Lola',
    },
    description: {
      fr: 'Lola adore chanter et danser avec tous ses amis de la ferme.',
      en: 'Lola loves to sing and dance with all her farm friends.',
      es: 'A Lola le encanta cantar y bailar con todos sus amigos de la granja.',
    },
    universe: {
      fr: 'La ferme musicale : des rythmes joyeux, des couleurs et des animaux rigolos.',
      en: 'The musical farm: joyful rhythms, bright colors, and funny animals.',
      es: 'La granja musical: ritmos alegres, colores y animales divertidos.',
    },
    image: '/animals/Cow.png',
    coloringImage: '/animals/Cow.png',
    videoByLang: {
      fr: 'eL9SThZ0k6U',
      en: 'eL9SThZ0k6U',
      es: 'eL9SThZ0k6U',
    },
    colorPrimary: '#FF6B6B',
    colorSecondary: '#FFD93D',
  },
  {
    slug: 'baby-shark',
    name: {
      fr: 'Bebe Requin',
      en: 'Baby Shark',
      es: 'Bebe Tiburon',
    },
    description: {
      fr: 'Toujours partant pour plonger, danser et chanter avec sa famille.',
      en: 'Always ready to dive, dance, and sing with the family.',
      es: 'Siempre listo para bucear, bailar y cantar con la familia.',
    },
    universe: {
      fr: 'L ocean joyeux : une famille de requins qui apprend en musique.',
      en: 'The joyful ocean: a shark family learning with music.',
      es: 'El oceano alegre: una familia de tiburones que aprende con musica.',
    },
    image: '/images/sharks/baby-shark.png',
    coloringImage: '/images/sharks/baby-shark.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#00B7FF',
    colorSecondary: '#7F5CFF',
  },
  {
    slug: 'baby-shark-family',
    name: {
      fr: 'Famille Requin',
      en: 'Baby Shark Family',
      es: 'Familia Tiburon',
    },
    description: {
      fr: 'Une famille joyeuse qui apprend en musique sous l ocean.',
      en: 'A joyful family learning through music under the sea.',
      es: 'Una familia alegre que aprende con musica bajo el mar.',
    },
    universe: {
      fr: 'L ocean joyeux : chansons, jeux et aventures en famille.',
      en: 'The joyful ocean: songs, games, and family adventures.',
      es: 'El oceano alegre: canciones, juegos y aventuras en familia.',
    },
    image: '/images/sharks/baby-shark.png',
    coloringImage: '/images/sharks/baby-shark.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#4FACFE',
    colorSecondary: '#00F2FE',
  },
  {
    slug: 'mama-shark',
    name: {
      fr: 'Maman Requin',
      en: 'Mama Shark',
      es: 'Mama Tiburon',
    },
    description: {
      fr: 'Elle veille sur tout le monde et donne le tempo des chansons.',
      en: 'She watches over everyone and sets the rhythm for the songs.',
      es: 'Cuida de todos y marca el ritmo de las canciones.',
    },
    universe: {
      fr: 'L ocean joyeux : des chansons douces et rassurantes.',
      en: 'The joyful ocean: soothing and friendly songs.',
      es: 'El oceano alegre: canciones suaves y cercanas.',
    },
    image: '/images/sharks/mama-shark.png',
    coloringImage: '/images/sharks/mama-shark.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#FF8DE5',
    colorSecondary: '#FFC300',
  },
  {
    slug: 'papa-shark',
    name: {
      fr: 'Papa Requin',
      en: 'Papa Shark',
      es: 'Papa Tiburon',
    },
    description: {
      fr: 'Fort et rigolo, il aide les enfants a apprendre en bougeant.',
      en: 'Strong and fun, he helps kids learn by moving.',
      es: 'Fuerte y divertido, ayuda a aprender moviendose.',
    },
    universe: {
      fr: 'L ocean joyeux : des mouvements et des jeux en musique.',
      en: 'The joyful ocean: movement games and music.',
      es: 'El oceano alegre: juegos de movimiento y musica.',
    },
    image: '/images/sharks/papa-shark.png',
    coloringImage: '/images/sharks/papa-shark.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#5AF7FF',
    colorSecondary: '#0457BA',
  },
  {
    slug: 'grandpa-shark',
    name: {
      fr: 'Papi Requin',
      en: 'Grandpa Shark',
      es: 'Abuelo Tiburon',
    },
    description: {
      fr: 'Il raconte des histoires de l ocean et des tresors caches.',
      en: 'He tells stories about the ocean and hidden treasures.',
      es: 'Cuenta historias del oceano y tesoros escondidos.',
    },
    universe: {
      fr: 'L ocean joyeux : des histoires et des comptines du large.',
      en: 'The joyful ocean: stories and sea songs.',
      es: 'El oceano alegre: historias y canciones del mar.',
    },
    image: '/images/sharks/grandpa-shark.png',
    coloringImage: '/images/sharks/grandpa-shark.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#FF9F00',
    colorSecondary: '#FF2C6A',
  },
  {
    slug: 'grandma-shark',
    name: {
      fr: 'Mamie Requin',
      en: 'Grandma Shark',
      es: 'Abuela Tiburon',
    },
    description: {
      fr: 'Elle adore chanter doucement et faire des calins.',
      en: 'She loves to sing softly and give big hugs.',
      es: 'Le encanta cantar suave y dar abrazos.',
    },
    universe: {
      fr: 'L ocean joyeux : des comptines tendres et calmantes.',
      en: 'The joyful ocean: tender and calming songs.',
      es: 'El oceano alegre: canciones tiernas y tranquilas.',
    },
    image: '/images/sharks/grandma-shark.png',
    coloringImage: '/images/sharks/grandma-shark.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#C57BFF',
    colorSecondary: '#FF8DE5',
  },
  {
    slug: 'farm-pig',
    name: {
      fr: 'Pistou le Cochon',
      en: 'Pistou the Pig',
      es: 'Pistou el Cerdito',
    },
    description: {
      fr: 'Il aime sauter dans les flaques et compter en rythme.',
      en: 'He loves jumping in puddles and counting in rhythm.',
      es: 'Le encanta saltar en charcos y contar con ritmo.',
    },
    universe: {
      fr: 'La ferme musicale : des jeux de nombres et de rythmes.',
      en: 'The musical farm: number games and rhythms.',
      es: 'La granja musical: juegos de numeros y ritmos.',
    },
    image: '/animals/pig.png',
    coloringImage: '/animals/pig.png',
    videoByLang: {
      fr: 'eL9SThZ0k6U',
      en: 'eL9SThZ0k6U',
      es: 'eL9SThZ0k6U',
    },
    colorPrimary: '#FF8DE5',
    colorSecondary: '#FFE600',
  },
  {
    slug: 'farm-sheep',
    name: {
      fr: 'Lili la Brebis',
      en: 'Lili the Sheep',
      es: 'Lili la Ovejita',
    },
    description: {
      fr: 'Douce et rassurante, elle aide a s endormir en musique.',
      en: 'Soft and soothing, she helps kids fall asleep with music.',
      es: 'Dulce y calmante, ayuda a dormir con musica.',
    },
    universe: {
      fr: 'La ferme musicale : des berceuses et des sons doux.',
      en: 'The musical farm: lullabies and soft sounds.',
      es: 'La granja musical: canciones de cuna y sonidos suaves.',
    },
    image: '/animals/sheep.png',
    coloringImage: '/animals/sheep.png',
    videoByLang: {
      fr: 'eL9SThZ0k6U',
      en: 'eL9SThZ0k6U',
      es: 'eL9SThZ0k6U',
    },
    colorPrimary: '#BBFF00',
    colorSecondary: '#00B7FF',
  },
  {
    slug: 'farm-horse',
    name: {
      fr: 'Rocket le Cheval',
      en: 'Rocket the Horse',
      es: 'Rocket el Caballo',
    },
    description: {
      fr: 'Rapide et joyeux, il fait galoper les enfants en rythme.',
      en: 'Fast and joyful, he makes kids gallop in rhythm.',
      es: 'Rapido y alegre, hace galopar al ritmo.',
    },
    universe: {
      fr: 'La ferme musicale : des jeux de mouvement et de coordination.',
      en: 'The musical farm: movement and coordination games.',
      es: 'La granja musical: juegos de movimiento y coordinacion.',
    },
    image: '/animals/Horse.png',
    coloringImage: '/animals/Horse.png',
    videoByLang: {
      fr: 'eL9SThZ0k6U',
      en: 'eL9SThZ0k6U',
      es: 'eL9SThZ0k6U',
    },
    colorPrimary: '#FF9F00',
    colorSecondary: '#FFE600',
  },
  {
    slug: 'farm-duck',
    name: {
      fr: 'Quacky le Canard',
      en: 'Quacky the Duck',
      es: 'Quacky el Pato',
    },
    description: {
      fr: 'Il barbotte en chantant et apprend les couleurs.',
      en: 'He splashes while singing and learns colors.',
      es: 'Chapotea cantando y aprende colores.',
    },
    universe: {
      fr: 'La ferme musicale : des couleurs vives et des comptines.',
      en: 'The musical farm: bright colors and singalongs.',
      es: 'La granja musical: colores vivos y canciones.',
    },
    image: '/animals/duck.png',
    coloringImage: '/animals/duck.png',
    videoByLang: {
      fr: 'eL9SThZ0k6U',
      en: 'eL9SThZ0k6U',
      es: 'eL9SThZ0k6U',
    },
    colorPrimary: '#FFE600',
    colorSecondary: '#FF9F00',
  },
  {
    slug: 'farm-bird',
    name: {
      fr: 'Pico l Oiseau',
      en: 'Pico the Bird',
      es: 'Pico el Pajaro',
    },
    description: {
      fr: 'Il chante des petites notes pour apprendre les sons.',
      en: 'He sings little notes to learn sounds.',
      es: 'Canta notas pequenas para aprender sonidos.',
    },
    universe: {
      fr: 'La ferme musicale : des sons, des notes et des rimes.',
      en: 'The musical farm: sounds, notes, and rhymes.',
      es: 'La granja musical: sonidos, notas y rimas.',
    },
    image: '/animals/bird.png',
    coloringImage: '/animals/bird.png',
    videoByLang: {
      fr: 'eL9SThZ0k6U',
      en: 'eL9SThZ0k6U',
      es: 'eL9SThZ0k6U',
    },
    colorPrimary: '#00B7FF',
    colorSecondary: '#5AF7FF',
  },
  {
    slug: 'ocean-fish',
    name: {
      fr: 'Fino le Poisson',
      en: 'Fino the Fish',
      es: 'Fino el Pez',
    },
    description: {
      fr: 'Il nage vite et guide les petits poissons en musique.',
      en: 'He swims fast and guides little fish with music.',
      es: 'Nada rapido y guia a los peces con musica.',
    },
    universe: {
      fr: 'L ocean joyeux : des bulles, des comptines et des jeux d eau.',
      en: 'The joyful ocean: bubbles, songs, and water games.',
      es: 'El oceano alegre: burbujas, canciones y juegos de agua.',
    },
    image: '/images/fish.png',
    coloringImage: '/images/fish.png',
    videoByLang: {
      fr: 'XqZsoesa55w',
      en: 'XqZsoesa55w',
      es: 'XqZsoesa55w',
    },
    colorPrimary: '#0457BA',
    colorSecondary: '#00B7FF',
  },
];

export const getCharacterProfile = (slug?: string) => {
  if (!slug) return undefined;
  return characterProfiles.find((profile) => profile.slug === slug);
};
