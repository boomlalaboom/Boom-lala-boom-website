# Configuration du Bucket Supabase pour les images des personnages

Ce guide explique comment configurer le bucket "personnage" dans Supabase Storage pour permettre l'upload d'images depuis l'interface admin.

## Étapes de configuration

### 1. Créer le bucket "personnage"

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **BoomLaLaBoom**
3. Dans le menu de gauche, cliquez sur **Storage**
4. Cliquez sur **New bucket**
5. Configurez le bucket:
   - **Name:** `personnage`
   - **Public bucket:** ✅ **OUI** (coché) - Important pour que les images soient accessibles publiquement
   - Cliquez sur **Create bucket**

### 2. Configurer les politiques de sécurité (RLS)

Le bucket doit avoir les politiques suivantes pour permettre:
- **Lecture publique** (tout le monde peut voir les images)
- **Upload/modification** uniquement pour les utilisateurs authentifiés (admin)

#### Politique 1: Lecture publique

```sql
-- Nom: "Public read access for character images"
-- Opération: SELECT
CREATE POLICY "Public read access for character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'personnage');
```

#### Politique 2: Upload pour utilisateurs authentifiés

```sql
-- Nom: "Authenticated users can upload character images"
-- Opération: INSERT
CREATE POLICY "Authenticated users can upload character images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'personnage');
```

#### Politique 3: Mise à jour pour utilisateurs authentifiés

```sql
-- Nom: "Authenticated users can update character images"
-- Opération: UPDATE
CREATE POLICY "Authenticated users can update character images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'personnage')
WITH CHECK (bucket_id = 'personnage');
```

#### Politique 4: Suppression pour utilisateurs authentifiés

```sql
-- Nom: "Authenticated users can delete character images"
-- Opération: DELETE
CREATE POLICY "Authenticated users can delete character images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'personnage');
```

### 3. Appliquer les politiques via l'interface Supabase

1. Dans **Storage** → **Policies** (onglet à côté de Buckets)
2. Sélectionnez le bucket `personnage`
3. Cliquez sur **New policy**
4. Pour chaque politique ci-dessus:
   - Choisissez le type d'opération (SELECT, INSERT, UPDATE, DELETE)
   - Collez le code SQL correspondant
   - Cliquez sur **Review** puis **Save policy**

### 4. Vérification

Une fois configuré, vous devriez pouvoir:

✅ **Upload d'images depuis l'admin:**
- Aller sur `/admin`
- Onglet **Characters**
- Créer ou modifier un personnage
- Utiliser les composants d'upload d'image
- Les images seront automatiquement converties en WebP et uploadées dans le bucket

✅ **Accès public aux images:**
- Les URL générées seront accessibles publiquement
- Format: `https://[PROJECT_ID].supabase.co/storage/v1/object/public/personnage/characters/[slug]-avatar.webp`

## Structure des chemins

Les images sont organisées dans le bucket comme suit:

```
personnage/
└── characters/
    ├── baby-shark-avatar.webp      (image principale)
    ├── baby-shark-coloring.webp    (coloriage)
    ├── mama-shark-avatar.webp
    ├── mama-shark-coloring.webp
    └── ...
```

## Fonctionnement de l'upload

Le composant `ImageUploader` gère automatiquement:

1. **Sélection de l'image** (drag & drop ou clic)
2. **Conversion en WebP** (compression optimale)
3. **Upload vers Supabase Storage**
4. **Génération de l'URL publique**
5. **Mise à jour du champ dans la base de données**

## Dépannage

### Erreur: "new row violates row-level security policy"

➡️ Les politiques RLS ne sont pas correctement configurées. Vérifiez que:
- Le bucket est **public**
- Les 4 politiques ci-dessus sont bien créées
- Vous êtes bien connecté en tant qu'utilisateur authentifié

### Les images ne s'affichent pas

➡️ Vérifiez:
- Le bucket est configuré comme **public**
- La politique SELECT (lecture publique) est active
- L'URL générée est correcte

### Impossible d'uploader

➡️ Vérifiez:
- Vous êtes connecté à l'admin
- Les politiques INSERT/UPDATE sont actives pour les utilisateurs authentifiés
- Le bucket existe bien et s'appelle exactement `personnage`

## Buckets existants

Votre projet utilise également ces buckets:

- **`article-images`** - Images des articles de blog
- **`game-images`** - Images/miniatures des jeux
- **`personnage`** - Images des personnages (celui-ci)

Tous doivent être configurés de la même manière (public + politiques RLS).
