-- Configuration du Storage Supabase pour les images de jeux
-- Ce script doit être exécuté dans l'éditeur SQL de Supabase

-- 1. Créer le bucket 'game-images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'game-images',
    'game-images',
    true,  -- Bucket public pour accès direct aux images
    10485760,  -- 10 MB max par fichier
    ARRAY['image/webp']  -- Uniquement WebP (conversion côté client)
)
ON CONFLICT (id) DO NOTHING;

-- 2. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Public can view game images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload game images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update game images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete game images" ON storage.objects;

-- 3. Créer les policies pour l'accès au bucket

-- 3.1 Lecture publique (tout le monde peut voir les images)
CREATE POLICY "Public can view game images"
ON storage.objects FOR SELECT
USING (bucket_id = 'game-images');

-- 3.2 Upload (uniquement les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can upload game images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'game-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'public'
);

-- 3.3 Update (uniquement les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can update game images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'game-images'
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'game-images'
    AND auth.role() = 'authenticated'
);

-- 3.4 Delete (uniquement les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can delete game images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'game-images'
    AND auth.role() = 'authenticated'
);

-- 4. Vérification
-- Afficher les informations du bucket
SELECT * FROM storage.buckets WHERE id = 'game-images';

-- Afficher les policies créées
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%game images%';
