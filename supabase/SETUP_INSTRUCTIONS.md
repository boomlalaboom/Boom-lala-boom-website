# Instructions de Configuration Supabase

## 1. Configuration du Blog (Articles)

### Créer la table articles
Dans le dashboard Supabase, allez dans **SQL Editor** et exécutez le fichier:
```
supabase/articles.sql
```

Cela créera:
- La table `articles` avec tous les champs multilingues
- Les index pour optimiser les recherches par slug
- Les policies RLS (Row Level Security)
- Les triggers pour `updated_at`
- 2 articles d'exemple

---

## 2. Configuration du Storage pour les Images

### Étape 1: Créer le bucket et les policies
Dans le dashboard Supabase, allez dans **SQL Editor** et exécutez le fichier:
```
supabase/storage-setup.sql
```

Cela créera:
- Le bucket `article-images` (public, 10 MB max, WebP uniquement)
- Les policies pour l'accès en lecture publique
- Les policies pour upload/update/delete (authentifiés uniquement)

### Étape 2: Vérifier la configuration
1. Allez dans **Storage** dans le dashboard Supabase
2. Vous devriez voir le bucket `article-images`
3. Cliquez dessus pour voir le dossier `public/` (créé automatiquement lors du premier upload)

---

## 3. Fonctionnalités Disponibles

### Upload d'Images
- **Format accepté**: JPEG, PNG (max 10 MB)
- **Conversion automatique**: En WebP avec compression 85%
- **Redimensionnement**: Max 1200x800 pixels (ratio préservé)
- **Nommage**: Basé sur le slug de l'article + timestamp + random
- **Exemple**: `mon-article-1703123456-abc123.webp`

### Génération IA d'Articles
- **Modèle**: ChatGPT 4o-mini (via OpenRouter)
- **Input**: Un titre dans n'importe quelle langue
- **Output**: Article complet en 3 langues (FR, EN, ES) avec:
  - Titres optimisés SEO
  - Slugs générés automatiquement
  - Excerpts (résumés)
  - Contenu HTML structuré (H2, H3, paragraphes, listes)
  - Temps de lecture calculé automatiquement

---

## 4. Workflow Recommandé pour Créer un Article

### Option 1: Avec IA (Recommandé)
1. Aller dans **Admin** → **Blog Articles** → **Add New**
2. Entrer un titre dans n'importe quelle langue (ex: "Les bienfaits de la musique pour les enfants")
3. Cliquer sur **"Générer avec IA"** ✨
4. Attendre 10-20 secondes
5. L'IA génère automatiquement:
   - Les 3 titres (FR, EN, ES)
   - Les 3 slugs
   - Les 3 excerpts
   - Les 3 contenus HTML complets
   - Le temps de lecture
6. Uploader une image (optionnel mais recommandé)
7. Cliquer sur **"Save Changes"**

### Option 2: Manuel
1. Aller dans **Admin** → **Blog Articles** → **Add New**
2. Remplir tous les champs manuellement:
   - Les 3 slugs (ex: `mon-article`, `my-article`, `mi-articulo`)
   - Les 3 titres
   - Les 3 excerpts
   - Les 3 contenus HTML
   - Auteur, temps de lecture
3. Uploader une image
4. Cliquer sur **"Save Changes"**

---

## 5. Structure des Données

### Table Articles
```sql
articles (
  id UUID PRIMARY KEY,
  slug_fr TEXT UNIQUE,
  slug_en TEXT UNIQUE,
  slug_es TEXT UNIQUE,
  title_fr TEXT,
  title_en TEXT,
  title_es TEXT,
  excerpt_fr TEXT,
  excerpt_en TEXT,
  excerpt_es TEXT,
  content_fr TEXT (HTML),
  content_en TEXT (HTML),
  content_es TEXT (HTML),
  thumbnail_url TEXT,
  author_name TEXT,
  read_time_minutes INTEGER,
  is_featured BOOLEAN,
  published_at TIMESTAMP,
  meta_title_* TEXT,
  meta_description_* TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Storage Structure
```
article-images/
└── public/
    ├── mon-article-1703123456-abc123.webp
    ├── another-article-1703123789-def456.webp
    └── ...
```

---

## 6. Sécurité

### RLS (Row Level Security)
- **Lecture**: Tout le monde peut lire les articles
- **Écriture**: Seuls les utilisateurs authentifiés peuvent créer/modifier/supprimer

### Storage Policies
- **Lecture**: Publique (tout le monde peut voir les images)
- **Upload/Update/Delete**: Uniquement les utilisateurs authentifiés

### API Keys
- L'API key OpenRouter est codée en dur dans `src/services/aiService.ts`
- En production, il est recommandé de la déplacer dans une variable d'environnement
- Ajoutez `VITE_OPENROUTER_API_KEY` dans `.env` et `import.meta.env.VITE_OPENROUTER_API_KEY` dans le code

---

## 7. Dépannage

### L'upload d'image ne fonctionne pas
1. Vérifier que le bucket `article-images` existe dans **Storage**
2. Vérifier que les policies sont créées (exécuter `storage-setup.sql`)
3. Vérifier que l'utilisateur est bien connecté (authentifié)
4. Vérifier que l'article a un slug (sauvegarder d'abord l'article)

### La génération IA ne fonctionne pas
1. Vérifier la clé API OpenRouter dans `src/services/aiService.ts`
2. Vérifier la console du navigateur pour les erreurs
3. Vérifier que vous avez entré au moins un titre
4. Vérifier votre connexion internet

### Les images ne s'affichent pas
1. Vérifier que le bucket est bien **public**
2. Vérifier l'URL de l'image dans la base de données
3. Vérifier les CORS si nécessaire (normalement géré par Supabase)

---

## 8. URLs Importantes

### Dashboard Supabase
- https://supabase.com/dashboard/project/[votre-projet-id]

### SQL Editor
- https://supabase.com/dashboard/project/[votre-projet-id]/sql/new

### Storage
- https://supabase.com/dashboard/project/[votre-projet-id]/storage/buckets

### OpenRouter Dashboard
- https://openrouter.ai/keys (pour gérer votre clé API)

---

## Prochaines Étapes

1. ✅ Exécuter `supabase/articles.sql` dans SQL Editor
2. ✅ Exécuter `supabase/storage-setup.sql` dans SQL Editor
3. ✅ Tester la création d'un article avec l'IA
4. ✅ Tester l'upload d'une image
5. ✅ Vérifier l'affichage sur le blog public

Bon développement! 🚀
