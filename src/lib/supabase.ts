import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Character {
  id: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  name_fr: string;
  name_en: string;
  name_es: string;
  description_fr: string;
  description_en: string;
  description_es: string;
  image_url: string;
  coloring_url?: string;
  universe_fr?: string;
  universe_en?: string;
  universe_es?: string;
  video_id_fr?: string;
  video_id_en?: string;
  video_id_es?: string;
  color_primary: string;
  color_secondary: string;
  order_position: number;
}

export interface Song {
  id: string;
  character_id: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  title_fr: string;
  title_en: string;
  title_es: string;
  description_fr: string;
  description_en: string;
  description_es: string;
  youtube_id_fr: string;
  youtube_id_en: string;
  youtube_id_es: string;
  lyrics_fr?: string;
  lyrics_en?: string;
  lyrics_es?: string;
  duration_seconds: number;
  age_min: number;
  age_max: number;
  thumbnail_url: string;
  apple_music_url?: string;
  spotify_url?: string;
  anghami_url?: string;
  play_count: number;
  is_featured: boolean;
}

export interface Game {
  id: string;
  character_id: string;
  song_id_fr?: string;
  song_id_en?: string;
  song_id_es?: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  name_fr: string;
  name_en: string;
  name_es: string;
  description_fr: string;
  description_en: string;
  description_es: string;
  instructions_fr: string;
  instructions_en: string;
  instructions_es: string;
  game_type: string;
  thumbnail_url: string;
  difficulty: string;
  age_min: number;
  age_max: number;
  play_count: number;
  is_featured: boolean;
}

export interface Activity {
  id: string;
  character_id: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  title_fr: string;
  title_en: string;
  title_es: string;
  description_fr: string;
  description_en: string;
  description_es: string;
  activity_type: string;
  pdf_url_fr: string;
  pdf_url_en: string;
  pdf_url_es: string;
  thumbnail_url: string;
  age_min: number;
  age_max: number;
  download_count: number;
}

export interface Article {
  id: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  title_fr: string;
  title_en: string;
  title_es: string;
  excerpt_fr: string;
  excerpt_en: string;
  excerpt_es: string;
  content_fr: string;
  content_en: string;
  content_es: string;
  thumbnail_url: string;
  author_name: string;
  read_time_minutes: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title_fr?: string;
  meta_title_en?: string;
  meta_title_es?: string;
  meta_description_fr?: string;
  meta_description_en?: string;
  meta_description_es?: string;
}
