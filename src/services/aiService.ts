/**
 * Service de génération d'articles et jeux via IA (OpenRouter ou OpenAI direct)
 * Génère chaque langue séparément pour éviter les limites de tokens
 */

// Récupère la configuration depuis localStorage (configuré dans l'admin)
function getAPIKey(): string {
  const localKey = localStorage.getItem('ai_api_key');
  if (localKey && localKey.trim()) return localKey;
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
}

function getModel(): string {
  const localModel = localStorage.getItem('ai_model');
  if (localModel && localModel.trim()) return localModel;
  return 'gpt-4o-mini';
}

// Détecte si on utilise OpenAI directement ou OpenRouter
function isDirectOpenAI(apiKey: string): boolean {
  return apiKey.startsWith('sk-proj-') || apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-');
}

interface GeneratedArticle {
  title_fr: string;
  title_en: string;
  title_es: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  excerpt_fr: string;
  excerpt_en: string;
  excerpt_es: string;
  content_fr: string;
  content_en: string;
  content_es: string;
  meta_title_fr: string;
  meta_title_en: string;
  meta_title_es: string;
  meta_description_fr: string;
  meta_description_en: string;
  meta_description_es: string;
  read_time_minutes: number;
}

interface LanguageArticle {
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
}

export interface GeneratedGame {
  name_fr: string;
  name_en: string;
  name_es: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  description_fr: string;
  description_en: string;
  description_es: string;
  instructions_fr: string;
  instructions_en: string;
  instructions_es: string;
}

interface LanguageGame {
  name: string;
  description: string;
  instructions: string;
}

export interface GeneratedCharacter {
  name_fr: string;
  name_en: string;
  name_es: string;
  slug_fr: string;
  slug_en: string;
  slug_es: string;
  description_fr: string;
  description_en: string;
  description_es: string;
  universe_fr: string;
  universe_en: string;
  universe_es: string;
}

interface LanguageCharacter {
  name: string;
  description: string;
  universe: string;
}

/**
 * Génère un slug SEO-friendly à partir d'un titre
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Calcule le temps de lecture estimé en minutes
 */
function calculateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * Génère un article dans une langue spécifique
 */
async function generateArticleForLanguage(
  titleInput: string,
  language: 'fr' | 'en' | 'es',
  API_KEY: string,
  MODEL: string,
  useDirectOpenAI: boolean
): Promise<LanguageArticle> {
  const languageNames = {
    fr: 'français',
    en: 'English',
    es: 'español'
  };

  const prompt = `Génère un article de blog complet en ${languageNames[language]} sur le sujet: "${titleInput}"

Public cible: Parents d'enfants de 2 à 8 ans

Réponds UNIQUEMENT avec ce JSON (pas de markdown, pas de texte avant/après):
{
  "title": "Titre accrocheur (55-60 caractères)",
  "excerpt": "Résumé captivant (150-160 caractères)",
  "meta_title": "Meta titre SEO (55-60 caractères)",
  "meta_description": "Meta description SEO (150-160 caractères)",
  "content": "Contenu HTML complet 800-1000 mots avec <h2>, <h3>, <p>, <ul>, <li>"
}

Le contenu HTML doit:
- Commencer par une introduction
- 3-4 sections avec <h2>
- Sous-sections avec <h3> si nécessaire
- Listes <ul><li> pour les points clés
- Conclusion engageante
- Pas de <h1> (déjà dans le titre)
- Optimisé SEO avec mots-clés naturels`;

  const API_URL = useDirectOpenAI
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  if (!useDirectOpenAI) {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'BoomLaLaBoom Admin';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 secondes

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: prompt,
        }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parser le JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;

  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Génère un jeu dans une langue spécifique
 */
async function generateGameForLanguage(
  gameNameInput: string,
  language: 'fr' | 'en' | 'es',
  API_KEY: string,
  MODEL: string,
  useDirectOpenAI: boolean
): Promise<LanguageGame> {
  const languageNames = {
    fr: 'français',
    en: 'English',
    es: 'español'
  };

  const prompt = `Génère les informations pour un jeu éducatif pour enfants en ${languageNames[language]} sur le thème: "${gameNameInput}"

Public cible: Enfants de 2 à 8 ans
Contexte: BoomLaLaBoom - plateforme éducative musicale

Réponds UNIQUEMENT avec ce JSON (pas de markdown, pas de texte avant/après):
{
  "name": "Nom du jeu accrocheur (30-40 caractères max)",
  "description": "Description attractive et éducative du jeu (100-150 caractères max)",
  "instructions": "Instructions détaillées et claires pour jouer (200-300 caractères max)"
}

Les instructions doivent:
- Être simples et adaptées aux jeunes enfants
- Expliquer comment jouer étape par étape
- Être courtes et faciles à comprendre
- Utiliser un langage positif et encourageant

La description doit:
- Mettre en avant l'aspect ludique ET éducatif
- Mentionner les bénéfices pour l'enfant
- Être captivante pour les parents`;

  const API_URL = useDirectOpenAI
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  if (!useDirectOpenAI) {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'BoomLaLaBoom Admin';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 secondes

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: prompt,
        }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parser le JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;

  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Génère un jeu complet en 3 langues via IA
 */
export async function generateGameWithAI(
  gameNameInput: string,
  onProgress?: (message: string) => void
): Promise<GeneratedGame> {
  // Récupérer la configuration
  const API_KEY = getAPIKey();
  let MODEL = getModel();

  if (!API_KEY || API_KEY === 'your-openrouter-api-key-here') {
    throw new Error('La clé API n\'est pas configurée. Veuillez aller dans l\'onglet "AI Settings".');
  }

  const useDirectOpenAI = isDirectOpenAI(API_KEY);

  // Ajuster le nom du modèle
  if (useDirectOpenAI && MODEL.startsWith('openai/')) {
    MODEL = MODEL.replace('openai/', '');
  }

  if (!useDirectOpenAI && !MODEL.includes('/') && !MODEL.includes(':free')) {
    MODEL = `openai/${MODEL}`;
  }

  try {
    // Générer français
    onProgress?.('Génération en français...');
    const frGame = await generateGameForLanguage(gameNameInput, 'fr', API_KEY, MODEL, useDirectOpenAI);

    // Petit délai pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Générer anglais
    onProgress?.('Génération en anglais...');
    const enGame = await generateGameForLanguage(gameNameInput, 'en', API_KEY, MODEL, useDirectOpenAI);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Générer espagnol
    onProgress?.('Génération en espagnol...');
    const esGame = await generateGameForLanguage(gameNameInput, 'es', API_KEY, MODEL, useDirectOpenAI);

    onProgress?.('Finalisation...');

    // Générer les slugs
    const slug_fr = generateSlug(frGame.name);
    const slug_en = generateSlug(enGame.name);
    const slug_es = generateSlug(esGame.name);

    return {
      name_fr: frGame.name,
      name_en: enGame.name,
      name_es: esGame.name,
      slug_fr,
      slug_en,
      slug_es,
      description_fr: frGame.description,
      description_en: enGame.description,
      description_es: esGame.description,
      instructions_fr: frGame.instructions,
      instructions_en: enGame.instructions,
      instructions_es: esGame.instructions,
    };
  } catch (error) {
    console.error('Error generating game with AI:', error);
    throw error;
  }
}

/**
 * Génère un article complet en 3 langues via IA
 */
export async function generateArticleWithAI(
  titleInput: string,
  onProgress?: (message: string) => void
): Promise<GeneratedArticle> {
  // Récupérer la configuration
  const API_KEY = getAPIKey();
  let MODEL = getModel();

  if (!API_KEY || API_KEY === 'your-openrouter-api-key-here') {
    throw new Error('La clé API n\'est pas configurée. Veuillez aller dans l\'onglet "AI Settings".');
  }

  const useDirectOpenAI = isDirectOpenAI(API_KEY);

  // Ajuster le nom du modèle
  if (useDirectOpenAI && MODEL.startsWith('openai/')) {
    MODEL = MODEL.replace('openai/', '');
  }

  if (!useDirectOpenAI && !MODEL.includes('/') && !MODEL.includes(':free')) {
    MODEL = `openai/${MODEL}`;
  }

  try {
    // Générer français
    onProgress?.('Génération en français...');
    const frArticle = await generateArticleForLanguage(titleInput, 'fr', API_KEY, MODEL, useDirectOpenAI);

    // Petit délai pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Générer anglais
    onProgress?.('Génération en anglais...');
    const enArticle = await generateArticleForLanguage(titleInput, 'en', API_KEY, MODEL, useDirectOpenAI);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Générer espagnol
    onProgress?.('Génération en espagnol...');
    const esArticle = await generateArticleForLanguage(titleInput, 'es', API_KEY, MODEL, useDirectOpenAI);

    onProgress?.('Finalisation...');

    // Générer les slugs
    const slug_fr = generateSlug(frArticle.title);
    const slug_en = generateSlug(enArticle.title);
    const slug_es = generateSlug(esArticle.title);

    // Calculer le temps de lecture
    const readTimeFr = calculateReadTime(frArticle.content);
    const readTimeEn = calculateReadTime(enArticle.content);
    const readTimeEs = calculateReadTime(esArticle.content);
    const read_time_minutes = Math.round((readTimeFr + readTimeEn + readTimeEs) / 3);

    return {
      title_fr: frArticle.title,
      title_en: enArticle.title,
      title_es: esArticle.title,
      slug_fr,
      slug_en,
      slug_es,
      excerpt_fr: frArticle.excerpt,
      excerpt_en: enArticle.excerpt,
      excerpt_es: esArticle.excerpt,
      content_fr: frArticle.content,
      content_en: enArticle.content,
      content_es: esArticle.content,
      meta_title_fr: frArticle.meta_title,
      meta_title_en: enArticle.meta_title,
      meta_title_es: esArticle.meta_title,
      meta_description_fr: frArticle.meta_description,
      meta_description_en: enArticle.meta_description,
      meta_description_es: esArticle.meta_description,
      read_time_minutes,
    };
  } catch (error) {
    console.error('Error generating article with AI:', error);
    throw error;
  }
}

/**
 * Génère un personnage dans une langue spécifique
 */
async function generateCharacterForLanguage(
  characterNameInput: string,
  language: 'fr' | 'en' | 'es',
  API_KEY: string,
  MODEL: string,
  useDirectOpenAI: boolean
): Promise<LanguageCharacter> {
  const languageNames = {
    fr: 'français',
    en: 'English',
    es: 'español'
  };

  const prompt = `Génère les informations pour un personnage éducatif pour enfants en ${languageNames[language]} sur le thème: "${characterNameInput}"

Public cible: Enfants de 2 à 8 ans
Contexte: BoomLaLaBoom - plateforme éducative musicale avec des personnages mignons et attachants

Réponds UNIQUEMENT avec ce JSON (pas de markdown, pas de texte avant/après):
{
  "name": "Nom du personnage accrocheur et mignon (20-30 caractères max)",
  "description": "Description courte et attractive du personnage, ce qu'il aime faire (80-120 caractères max)",
  "universe": "Description de son univers, son environnement, ce qu'il apporte aux enfants (100-150 caractères max)"
}

Le personnage doit:
- Être attachant et mignon pour les jeunes enfants
- Avoir une personnalité positive et encourageante
- Être lié à la musique, l'apprentissage ou le jeu
- Avoir un univers cohérent avec BoomLaLaBoom

La description doit:
- Être courte et facile à comprendre
- Mettre en avant ce que le personnage aime faire
- Utiliser un langage simple et positif`;

  const API_URL = useDirectOpenAI
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  if (!useDirectOpenAI) {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'BoomLaLaBoom Admin';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: prompt,
        }],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;

  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Génère un personnage complet en 3 langues via IA
 */
export async function generateCharacterWithAI(
  characterNameInput: string,
  onProgress?: (message: string) => void
): Promise<GeneratedCharacter> {
  const API_KEY = getAPIKey();
  let MODEL = getModel();

  if (!API_KEY || API_KEY === 'your-openrouter-api-key-here') {
    throw new Error('La clé API n\'est pas configurée. Veuillez aller dans l\'onglet "AI Settings".');
  }

  const useDirectOpenAI = isDirectOpenAI(API_KEY);

  if (useDirectOpenAI && MODEL.startsWith('openai/')) {
    MODEL = MODEL.replace('openai/', '');
  }

  if (!useDirectOpenAI && !MODEL.includes('/') && !MODEL.includes(':free')) {
    MODEL = `openai/${MODEL}`;
  }

  try {
    onProgress?.('Génération en français...');
    const frCharacter = await generateCharacterForLanguage(characterNameInput, 'fr', API_KEY, MODEL, useDirectOpenAI);

    await new Promise(resolve => setTimeout(resolve, 1000));

    onProgress?.('Génération en anglais...');
    const enCharacter = await generateCharacterForLanguage(characterNameInput, 'en', API_KEY, MODEL, useDirectOpenAI);

    await new Promise(resolve => setTimeout(resolve, 1000));

    onProgress?.('Génération en espagnol...');
    const esCharacter = await generateCharacterForLanguage(characterNameInput, 'es', API_KEY, MODEL, useDirectOpenAI);

    onProgress?.('Finalisation...');

    // Générer les slugs
    const slug_fr = generateSlug(frCharacter.name);
    const slug_en = generateSlug(enCharacter.name);
    const slug_es = generateSlug(esCharacter.name);

    return {
      name_fr: frCharacter.name,
      name_en: enCharacter.name,
      name_es: esCharacter.name,
      slug_fr,
      slug_en,
      slug_es,
      description_fr: frCharacter.description,
      description_en: enCharacter.description,
      description_es: esCharacter.description,
      universe_fr: frCharacter.universe,
      universe_en: enCharacter.universe,
      universe_es: esCharacter.universe,
    };
  } catch (error) {
    console.error('Error generating character with AI:', error);
    throw error;
  }
}
