/*
  # BoomLaLaBoom Platform Database Schema

  ## Overview
  Creates the complete database structure for the BoomLaLaBoom multilingual platform
  supporting songs, games, characters, and activities in FR/EN/ES.

  ## New Tables Created
  
  ### 1. `characters`
  Stores character information (Lola the Cow, Baby Shark, Vehicles, etc.)
  - `id` (uuid, primary key)
  - `slug` (text, unique) - URL-friendly identifier
  - `name_fr`, `name_en`, `name_es` (text) - Character names in each language
  - `description_fr`, `description_en`, `description_es` (text) - Character descriptions
  - `image_url` (text) - Character illustration
  - `color_primary` (text) - Main brand color for the character
  - `color_secondary` (text) - Secondary color
  - `order_position` (integer) - Display order
  - `created_at`, `updated_at` (timestamptz)

  ### 2. `songs`
  Stores song/video content linked to characters
  - `id` (uuid, primary key)
  - `character_id` (uuid, foreign key to characters)
  - `slug` (text, unique)
  - `title_fr`, `title_en`, `title_es` (text) - Song titles
  - `description_fr`, `description_en`, `description_es` (text)
  - `youtube_id` (text) - YouTube video ID
  - `lyrics_fr`, `lyrics_en`, `lyrics_es` (text) - Song lyrics for karaoke
  - `duration_seconds` (integer)
  - `age_min`, `age_max` (integer) - Recommended age range
  - `thumbnail_url` (text)
  - `apple_music_url`, `spotify_url`, `anghami_url` (text) - Streaming links
  - `play_count` (integer) - Track popularity
  - `is_featured` (boolean) - Show on homepage
  - `created_at`, `updated_at` (timestamptz)

  ### 3. `games`
  Stores interactive games linked to songs and characters
  - `id` (uuid, primary key)
  - `character_id` (uuid, foreign key)
  - `song_id` (uuid, foreign key) - Related song that plays during game
  - `slug` (text, unique)
  - `name_fr`, `name_en`, `name_es` (text)
  - `description_fr`, `description_en`, `description_es` (text)
  - `instructions_fr`, `instructions_en`, `instructions_es` (text)
  - `game_type` (text) - rhythm, platform, puzzle, memory, etc.
  - `thumbnail_url` (text)
  - `difficulty` (text) - easy, medium, hard
  - `age_min`, `age_max` (integer)
  - `play_count` (integer)
  - `is_featured` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ### 4. `activities`
  Printable activities (coloring, crafts, etc.)
  - `id` (uuid, primary key)
  - `character_id` (uuid, foreign key)
  - `slug` (text, unique)
  - `title_fr`, `title_en`, `title_es` (text)
  - `description_fr`, `description_en`, `description_es` (text)
  - `activity_type` (text) - coloring, craft, puzzle, card_game
  - `pdf_url_fr`, `pdf_url_en`, `pdf_url_es` (text) - Download links
  - `thumbnail_url` (text)
  - `age_min`, `age_max` (integer)
  - `download_count` (integer)
  - `created_at`, `updated_at` (timestamptz)

  ### 5. `playlists`
  Curated song collections
  - `id` (uuid, primary key)
  - `slug` (text, unique)
  - `name_fr`, `name_en`, `name_es` (text)
  - `description_fr`, `description_en`, `description_es` (text)
  - `thumbnail_url` (text)
  - `is_featured` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ### 6. `playlist_songs`
  Junction table for playlists and songs
  - `id` (uuid, primary key)
  - `playlist_id` (uuid, foreign key)
  - `song_id` (uuid, foreign key)
  - `position` (integer) - Order in playlist
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for all content (kid-friendly, no auth required)
  - Admin-only write access (managed separately)
*/

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  name_es text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  color_primary text NOT NULL DEFAULT '#FF6B6B',
  color_secondary text NOT NULL DEFAULT '#4ECDC4',
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  title_es text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  youtube_id text NOT NULL,
  lyrics_fr text DEFAULT '',
  lyrics_en text DEFAULT '',
  lyrics_es text DEFAULT '',
  duration_seconds integer DEFAULT 0,
  age_min integer DEFAULT 3,
  age_max integer DEFAULT 8,
  thumbnail_url text DEFAULT '',
  apple_music_url text DEFAULT '',
  spotify_url text DEFAULT '',
  anghami_url text DEFAULT '',
  play_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
  song_id uuid REFERENCES songs(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  name_es text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  instructions_fr text NOT NULL DEFAULT '',
  instructions_en text NOT NULL DEFAULT '',
  instructions_es text NOT NULL DEFAULT '',
  game_type text NOT NULL DEFAULT 'rhythm',
  thumbnail_url text DEFAULT '',
  difficulty text DEFAULT 'easy',
  age_min integer DEFAULT 3,
  age_max integer DEFAULT 8,
  play_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  title_es text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  activity_type text NOT NULL DEFAULT 'coloring',
  pdf_url_fr text DEFAULT '',
  pdf_url_en text DEFAULT '',
  pdf_url_es text DEFAULT '',
  thumbnail_url text DEFAULT '',
  age_min integer DEFAULT 3,
  age_max integer DEFAULT 8,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  name_es text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlist_songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, song_id)
);

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (all content is kid-friendly)
CREATE POLICY "Anyone can view characters"
  ON characters FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view songs"
  ON songs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view playlists"
  ON playlists FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view playlist songs"
  ON playlist_songs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_songs_character_id ON songs(character_id);
CREATE INDEX IF NOT EXISTS idx_songs_is_featured ON songs(is_featured);
CREATE INDEX IF NOT EXISTS idx_games_character_id ON games(character_id);
CREATE INDEX IF NOT EXISTS idx_games_song_id ON games(song_id);
CREATE INDEX IF NOT EXISTS idx_games_is_featured ON games(is_featured);
CREATE INDEX IF NOT EXISTS idx_activities_character_id ON activities(character_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();