-- Insertion de tous les personnages dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Baby Shark (individuel)
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'baby-shark',
  'Bébé Requin',
  'Baby Shark',
  'Bebé Tiburón',
  'Toujours partant pour plonger, danser et chanter avec sa famille.',
  'Always ready to dive, dance, and sing with the family.',
  'Siempre listo para bucear, bailar y cantar con la familia.',
  'L''océan joyeux : une famille de requins qui apprend en musique.',
  'The joyful ocean: a shark family learning with music.',
  'El océano alegre: una familia de tiburones que aprende con música.',
  '/images/sharks/baby-shark.png',
  '/images/sharks/baby-shark.png',
  'XqZsoesa55w',
  'XqZsoesa55w',
  'XqZsoesa55w',
  '#00B7FF',
  '#7F5CFF',
  4
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Mama Shark
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'mama-shark',
  'Maman Requin',
  'Mama Shark',
  'Mamá Tiburón',
  'Elle veille sur tout le monde et donne le tempo des chansons.',
  'She watches over everyone and sets the rhythm for the songs.',
  'Cuida de todos y marca el ritmo de las canciones.',
  'L''océan joyeux : des chansons douces et rassurantes.',
  'The joyful ocean: soothing and friendly songs.',
  'El océano alegre: canciones suaves y cercanas.',
  '/images/sharks/mama-shark.png',
  '/images/sharks/mama-shark.png',
  'XqZsoesa55w',
  'XqZsoesa55w',
  'XqZsoesa55w',
  '#FF8DE5',
  '#FFC300',
  5
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Papa Shark
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'papa-shark',
  'Papa Requin',
  'Papa Shark',
  'Papá Tiburón',
  'Fort et rigolo, il aide les enfants à apprendre en bougeant.',
  'Strong and fun, he helps kids learn by moving.',
  'Fuerte y divertido, ayuda a aprender moviéndose.',
  'L''océan joyeux : des mouvements et des jeux en musique.',
  'The joyful ocean: movement games and music.',
  'El océano alegre: juegos de movimiento y música.',
  '/images/sharks/papa-shark.png',
  '/images/sharks/papa-shark.png',
  'XqZsoesa55w',
  'XqZsoesa55w',
  'XqZsoesa55w',
  '#5AF7FF',
  '#0457BA',
  6
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Grandpa Shark
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'grandpa-shark',
  'Papi Requin',
  'Grandpa Shark',
  'Abuelo Tiburón',
  'Il raconte des histoires de l''océan et des trésors cachés.',
  'He tells stories about the ocean and hidden treasures.',
  'Cuenta historias del océano y tesoros escondidos.',
  'L''océan joyeux : des histoires et des comptines du large.',
  'The joyful ocean: stories and sea songs.',
  'El océano alegre: historias y canciones del mar.',
  '/images/sharks/grandpa-shark.png',
  '/images/sharks/grandpa-shark.png',
  'XqZsoesa55w',
  'XqZsoesa55w',
  'XqZsoesa55w',
  '#FF9F00',
  '#FF2C6A',
  7
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Grandma Shark
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'grandma-shark',
  'Mamie Requin',
  'Grandma Shark',
  'Abuela Tiburón',
  'Elle adore chanter doucement et faire des câlins.',
  'She loves to sing softly and give big hugs.',
  'Le encanta cantar suave y dar abrazos.',
  'L''océan joyeux : des comptines tendres et calmantes.',
  'The joyful ocean: tender and calming songs.',
  'El océano alegre: canciones tiernas y tranquilas.',
  '/images/sharks/grandma-shark.png',
  '/images/sharks/grandma-shark.png',
  'XqZsoesa55w',
  'XqZsoesa55w',
  'XqZsoesa55w',
  '#C57BFF',
  '#FF8DE5',
  8
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Pistou le Cochon
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'farm-pig',
  'Pistou le Cochon',
  'Pistou the Pig',
  'Pistou el Cerdito',
  'Il aime sauter dans les flaques et compter en rythme.',
  'He loves jumping in puddles and counting in rhythm.',
  'Le encanta saltar en charcos y contar con ritmo.',
  'La ferme musicale : des jeux de nombres et de rythmes.',
  'The musical farm: number games and rhythms.',
  'La granja musical: juegos de números y ritmos.',
  '/animals/pig.png',
  '/animals/pig.png',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  '#FF8DE5',
  '#FFE600',
  9
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Lili la Brebis
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'farm-sheep',
  'Lili la Brebis',
  'Lili the Sheep',
  'Lili la Ovejita',
  'Douce et rassurante, elle aide à s''endormir en musique.',
  'Soft and soothing, she helps kids fall asleep with music.',
  'Dulce y calmante, ayuda a dormir con música.',
  'La ferme musicale : des berceuses et des sons doux.',
  'The musical farm: lullabies and soft sounds.',
  'La granja musical: canciones de cuna y sonidos suaves.',
  '/animals/sheep.png',
  '/animals/sheep.png',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  '#BBFF00',
  '#00B7FF',
  10
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Rocket le Cheval
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'farm-horse',
  'Rocket le Cheval',
  'Rocket the Horse',
  'Rocket el Caballo',
  'Rapide et joyeux, il fait galoper les enfants en rythme.',
  'Fast and joyful, he makes kids gallop in rhythm.',
  'Rápido y alegre, hace galopar al ritmo.',
  'La ferme musicale : des jeux de mouvement et de coordination.',
  'The musical farm: movement and coordination games.',
  'La granja musical: juegos de movimiento y coordinación.',
  '/animals/Horse.png',
  '/animals/Horse.png',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  '#FF9F00',
  '#FFE600',
  11
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Quacky le Canard
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'farm-duck',
  'Quacky le Canard',
  'Quacky the Duck',
  'Quacky el Pato',
  'Il barbotte en chantant et apprend les couleurs.',
  'He splashes while singing and learns colors.',
  'Chapotea cantando y aprende colores.',
  'La ferme musicale : des couleurs vives et des comptines.',
  'The musical farm: bright colors and singalongs.',
  'La granja musical: colores vivos y canciones.',
  '/animals/duck.png',
  '/animals/duck.png',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  '#FFE600',
  '#FF9F00',
  12
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Pico l'Oiseau
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'farm-bird',
  'Pico l''Oiseau',
  'Pico the Bird',
  'Pico el Pájaro',
  'Il chante des petites notes pour apprendre les sons.',
  'He sings little notes to learn sounds.',
  'Canta notas pequeñas para aprender sonidos.',
  'La ferme musicale : des sons, des notes et des rimes.',
  'The musical farm: sounds, notes, and rhymes.',
  'La granja musical: sonidos, notas y rimas.',
  '/animals/bird.png',
  '/animals/bird.png',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  'eL9SThZ0k6U',
  '#00B7FF',
  '#5AF7FF',
  13
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;

-- Fino le Poisson
INSERT INTO characters (slug, name_fr, name_en, name_es, description_fr, description_en, description_es, universe_fr, universe_en, universe_es, image_url, coloring_url, video_id_fr, video_id_en, video_id_es, color_primary, color_secondary, order_position)
VALUES (
  'ocean-fish',
  'Fino le Poisson',
  'Fino the Fish',
  'Fino el Pez',
  'Il nage vite et guide les petits poissons en musique.',
  'He swims fast and guides little fish with music.',
  'Nada rápido y guía a los peces con música.',
  'L''océan joyeux : des bulles, des comptines et des jeux d''eau.',
  'The joyful ocean: bubbles, songs, and water games.',
  'El océano alegre: burbujas, canciones y juegos de agua.',
  '/images/fish.png',
  '/images/fish.png',
  'XqZsoesa55w',
  'XqZsoesa55w',
  'XqZsoesa55w',
  '#0457BA',
  '#00B7FF',
  14
)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_en = EXCLUDED.name_en,
  name_es = EXCLUDED.name_es,
  description_fr = EXCLUDED.description_fr,
  description_en = EXCLUDED.description_en,
  description_es = EXCLUDED.description_es,
  universe_fr = EXCLUDED.universe_fr,
  universe_en = EXCLUDED.universe_en,
  universe_es = EXCLUDED.universe_es,
  image_url = EXCLUDED.image_url,
  coloring_url = EXCLUDED.coloring_url,
  video_id_fr = EXCLUDED.video_id_fr,
  video_id_en = EXCLUDED.video_id_en,
  video_id_es = EXCLUDED.video_id_es,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary,
  order_position = EXCLUDED.order_position;
