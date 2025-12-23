-- Configuration du Storage Supabase pour les images d'articles
-- Ce script doit être exécuté dans l'éditeur SQL de Supabase

-- 1. Créer le bucket 'article-images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'article-images',
    'article-images',
    true,  -- Bucket public pour accès direct aux images
    10485760,  -- 10 MB max par fichier
    ARRAY['image/webp']  -- Uniquement WebP (conversion côté client)
)
ON CONFLICT (id) DO NOTHING;

-- 2. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete article images" ON storage.objects;

-- 3. Créer les policies pour l'accès au bucket

-- 3.1 Lecture publique (tout le monde peut voir les images)
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
USING (bucket_id = 'article-images');

-- 3.2 Upload (uniquement les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'article-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'public'
);

-- 3.3 Update (uniquement les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can update article images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'article-images'
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'article-images'
    AND auth.role() = 'authenticated'
);

-- 3.4 Delete (uniquement les utilisateurs authentifiés)
CREATE POLICY "Authenticated users can delete article images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'article-images'
    AND auth.role() = 'authenticated'
);

-- 4. Vérification
-- Afficher les informations du bucket
SELECT * FROM storage.buckets WHERE id = 'article-images';

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
WHERE tablename = 'objects' AND policyname LIKE '%article images%';
