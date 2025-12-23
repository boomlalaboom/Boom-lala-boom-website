-- Seed data for BoomLaLaBoom

-- Clear existing data (optional, but good for a fresh start)
TRUNCATE characters, songs, games, activities CASCADE;

-- Insert characters
INSERT INTO characters (id, slug, name_fr, name_en, name_es, description_fr, description_en, description_es, color_primary, color_secondary, order_position) 
VALUES 
  (gen_random_uuid(), 'lola-the-cow', 'Lola la Vache', 'Lola the Cow', 'La Vaca Lola', 'Lola adore chanter et danser avec tous ses amis de la ferme !', 'Lola loves to sing and dance with all her farm friends!', '¡A Lola le encanta cantar y bailar con todos sus amigos de la granja!', '#FF6B6B', '#FFD93D', 1),
  (gen_random_uuid(), 'baby-shark-family', 'Famille Requin', 'Baby Shark Family', 'Familia Tiburón', 'Plongez dans l''océan avec Bébé Requin et toute sa famille !', 'Dive into the ocean with Baby Shark and all his family!', '¡Sumérgete en el océano con Baby Shark y toda su familia!', '#4FACFE', '#00F2FE', 2),
  (gen_random_uuid(), 'vehicles-crew', 'L''Équipe des Bolides', 'Vehicles Crew', 'El Equipo de los Bólidos', 'Vroom vroom ! Apprenez les couleurs avec nos voitures joyeuses.', 'Vroom vroom! Learn colors with our happy cars.', '¡Brum brum! Aprende los colores con nuestros coches alegres.', '#6A11CB', '#2575FC', 3);

-- Get IDs for songs and games linking
DO $$ 
DECLARE 
    lola_id uuid;
    shark_id uuid;
    vehicles_id uuid;
BEGIN
    SELECT id INTO lola_id FROM characters WHERE slug = 'lola-the-cow';
    SELECT id INTO shark_id FROM characters WHERE slug = 'baby-shark-family';
    SELECT id INTO vehicles_id FROM characters WHERE slug = 'vehicles-crew';

    -- Insert songs
    INSERT INTO songs (character_id, slug, title_fr, title_en, title_es, description_fr, description_en, description_es, youtube_id, is_featured, age_min, age_max)
    VALUES 
      (lola_id, 'la-vaca-lola-song', 'La Vaca Lola', 'Lola the Cow', 'La Vaca Lola', 'Suivez Lola dans sa danse préférée !', 'Follow Lola in her favorite dance!', '¡Sigue a Lola en su baile favorito!', 'eL9SThZ0k6U', true, 2, 6),
      (shark_id, 'baby-shark-dance', 'Bébé Requin', 'Baby Shark Dance', 'Baby Shark Dance', 'La chanson préférée de tous les enfants !', 'The favorite song of all children!', '¡La canción favorita de todos los niños!', 'XqZsoesa55w', true, 1, 5),
      (vehicles_id, 'color-cars-song', 'Les Voitures de Couleur', 'Color Cars Song', 'Los Coches de Colores', 'Apprenez les couleurs en vous amusant !', 'Learn colors while having fun!', '¡Aprende los colores divirtiéndote!', 'p7_K0f0SgOk', true, 2, 6);

    -- Insert games
    INSERT INTO games (character_id, slug, name_fr, name_en, name_es, description_fr, description_en, description_es, game_type, difficulty, is_featured, age_min, age_max)
    VALUES 
      (lola_id, 'lola-memory', 'Mémoire de Lola', 'Lola Memory', 'Memoria de Lola', 'Retrouvez les paires d''amis de la ferme !', 'Find the pairs of farm friends!', '¡Encuentra las parejas de amigos de la granja!', 'memory', 'easy', true, 3, 7),
      (shark_id, 'shark-rhythm', 'Rythme Requin', 'Shark Rhythm', 'Ritmo Tiburón', 'Tapez en rythme avec Bébé Requin !', 'Tap in rhythm with Baby Shark!', '¡Toca al ritmo de Baby Shark!', 'rhythm', 'medium', true, 4, 8);
END $$;
