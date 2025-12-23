-- Create articles table for blog functionality
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- SEO-friendly slugs for each language
    slug_fr TEXT NOT NULL UNIQUE,
    slug_en TEXT NOT NULL UNIQUE,
    slug_es TEXT NOT NULL UNIQUE,

    -- Multilingual content
    title_fr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,

    excerpt_fr TEXT NOT NULL DEFAULT '',
    excerpt_en TEXT NOT NULL DEFAULT '',
    excerpt_es TEXT NOT NULL DEFAULT '',

    content_fr TEXT NOT NULL DEFAULT '',
    content_en TEXT NOT NULL DEFAULT '',
    content_es TEXT NOT NULL DEFAULT '',

    -- Media and metadata
    thumbnail_url TEXT DEFAULT '',
    author_name TEXT DEFAULT 'BoomLaLaBoom Team',
    read_time_minutes INTEGER DEFAULT 5,

    -- Publication control
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- SEO metadata (optional)
    meta_title_fr TEXT DEFAULT '',
    meta_title_en TEXT DEFAULT '',
    meta_title_es TEXT DEFAULT '',
    meta_description_fr TEXT DEFAULT '',
    meta_description_en TEXT DEFAULT '',
    meta_description_es TEXT DEFAULT '',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug_fr ON articles(slug_fr);
CREATE INDEX IF NOT EXISTS idx_articles_slug_en ON articles(slug_en);
CREATE INDEX IF NOT EXISTS idx_articles_slug_es ON articles(slug_es);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured) WHERE is_featured = true;

-- Add RLS (Row Level Security) policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

-- Allow public read access
CREATE POLICY "Articles are viewable by everyone"
    ON articles FOR SELECT
    USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert articles"
    ON articles FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles"
    ON articles FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete articles"
    ON articles FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS articles_updated_at ON articles;

CREATE TRIGGER articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_articles_updated_at();

-- Insert sample articles (only if they don't exist)
INSERT INTO articles (
    slug_fr, slug_en, slug_es,
    title_fr, title_en, title_es,
    excerpt_fr, excerpt_en, excerpt_es,
    content_fr, content_en, content_es,
    thumbnail_url,
    author_name,
    read_time_minutes,
    is_featured
)
SELECT * FROM (VALUES
(
    'bienfaits-musique-enfants',
    'benefits-music-children',
    'beneficios-musica-ninos',
    'Les bienfaits de la musique pour les enfants',
    'The Benefits of Music for Children',
    'Los beneficios de la música para los niños',
    'Découvrez comment la musique aide au développement cognitif et émotionnel des tout-petits.',
    'Discover how music helps in the cognitive and emotional development of toddlers.',
    'Descubre cómo la música ayuda en el desarrollo cognitivo y emocional de los niños pequeños.',
    '<h2>Pourquoi la musique est importante</h2><p>La musique joue un rôle essentiel dans le développement des enfants. Elle stimule la mémoire, améliore la coordination et favorise l''expression émotionnelle.</p><h3>Développement cognitif</h3><p>Les études montrent que l''écoute de musique active plusieurs zones du cerveau simultanément, renforçant les connexions neuronales.</p>',
    '<h2>Why Music Matters</h2><p>Music plays an essential role in children''s development. It stimulates memory, improves coordination, and encourages emotional expression.</p><h3>Cognitive Development</h3><p>Studies show that listening to music activates multiple brain areas simultaneously, strengthening neural connections.</p>',
    '<h2>Por qué la música es importante</h2><p>La música juega un papel esencial en el desarrollo de los niños. Estimula la memoria, mejora la coordinación y fomenta la expresión emocional.</p><h3>Desarrollo cognitivo</h3><p>Los estudios muestran que escuchar música activa varias áreas del cerebro simultáneamente, fortaleciendo las conexiones neuronales.</p>',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    'Dr. Marie Dupont',
    8,
    true
),
(
    'apprendre-langues-musique',
    'learn-languages-music',
    'aprender-idiomas-musica',
    'Apprendre les langues en chantant',
    'Learning Languages Through Singing',
    'Aprender idiomas cantando',
    'Comment les comptines multilingues facilitent l''apprentissage des langues étrangères.',
    'How multilingual nursery rhymes facilitate foreign language learning.',
    'Cómo las canciones infantiles multilingües facilitan el aprendizaje de idiomas extranjeros.',
    '<h2>La musique comme outil d''apprentissage</h2><p>Les chansons sont des outils puissants pour apprendre une nouvelle langue. Le rythme et les répétitions aident à mémoriser le vocabulaire.</p>',
    '<h2>Music as a Learning Tool</h2><p>Songs are powerful tools for learning a new language. Rhythm and repetition help memorize vocabulary.</p>',
    '<h2>La música como herramienta de aprendizaje</h2><p>Las canciones son herramientas poderosas para aprender un nuevo idioma. El ritmo y las repeticiones ayudan a memorizar el vocabulario.</p>',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    'Sophie Martin',
    6,
    true
)) AS new_articles(slug_fr, slug_en, slug_es, title_fr, title_en, title_es, excerpt_fr, excerpt_en, excerpt_es, content_fr, content_en, content_es, thumbnail_url, author_name, read_time_minutes, is_featured)
WHERE NOT EXISTS (
    SELECT 1 FROM articles WHERE articles.slug_fr = new_articles.slug_fr
);
