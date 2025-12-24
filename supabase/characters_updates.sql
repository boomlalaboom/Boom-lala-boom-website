-- Add new fields for character details, videos, and coloring assets
-- Safe to run multiple times
alter table public.characters
  add column if not exists universe_fr text,
  add column if not exists universe_en text,
  add column if not exists universe_es text,
  add column if not exists coloring_url text,
  add column if not exists video_id_fr text,
  add column if not exists video_id_en text,
  add column if not exists video_id_es text;
