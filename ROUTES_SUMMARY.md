# Structure des URLs Localisées - BoomLaLaBoom

Voici le récapitulatif complet des routes du site avec leurs traductions respectives. Le système gère désormais automatiquement la redirection et la traduction des slugs lors du changement de langue.

| Page (Interne) | Version Française (FR) | Version Anglaise (EN) | Version Espagnole (ES) |
| :--- | :--- | :--- | :--- |
| **Accueil** | `/fr` | `/en` | `/es` |
| **À Propos** | `/fr/univers` | `/en/about` | `/es/universo` |
| **Chansons** | `/fr/chansons` | `/en/songs` | `/es/canciones` |
| **Jeux** | `/fr/jeux` | `/en/games` | `/es/juegos` |
| **↳ Lola Memory** | `/fr/jeux/lola-memory` | `/en/games/lola-memory` | `/es/juegos/lola-memory` |
| **↳ Shark Rhythm** | `/fr/jeux/rythme-requin` | `/en/games/shark-rhythm` | `/es/juegos/ritmo-tiburon` |
| **Personnages** | `/fr/personnages` | `/en/characters` | `/es/personajes` |
| **↳ Détail Perso** | `/fr/personnages/:slug_fr` | `/en/characters/:slug_en` | `/es/personajes/:slug_es` |
| **Activités** | `/fr/activites` | `/en/activities` | `/es/actividades` |
| **Apprendre** | `/fr/apprendre` | `/en/learning` | `/es/aprender` |
| **Ressources** | `/fr/ressources` | `/en/resources` | `/es/recursos` |
| **Parents** | `/fr/parents` | `/en/parents` | `/es/padres` |
| **Blog** | `/fr/blog` | `/en/blog` | `/es/blog` |
| **↳ Article Blog** | `/fr/blog/:slug_fr` | `/en/blog/:slug_en` | `/es/blog/:slug_es` |
| **FAQ** | `/fr/faq` | `/en/faq` | `/es/faq` |
| **Contact** | `/fr/contact` | `/en/contact` | `/es/contacto` |

---

### Points techniques clés pour le SEO :

1. **Slugs Traduits** : Chaque page possède son propre mot-clé dans la langue cible (ex: `chansons` vs `songs`).
2. **Hreflang Dynamiques** : Les balises `<link rel="alternate" hreflang="..." />` sont générées dynamiquement. Si vous êtes sur `/fr/chansons`, le site indique à Google que la version espagnole est `/es/canciones`.
3. **Switch Intelligent** : Changer de langue via le menu ne renvoie pas à l'accueil, mais vous maintient sur la version traduite de la page actuelle (ex: de `/fr/chansons` vers `/en/songs`).
4. **Pages Admin/Login** : Restent sur `/login` et `/admin` (non localisées) pour éviter les indexations inutiles.
