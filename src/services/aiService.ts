/**
 * Service de génération d'articles via IA (OpenRouter ou OpenAI direct)
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
 * Génère un article complet en 3 langues via IA
 */
export async function generateArticleWithAI(
  titleInput: string,
  targetAudience: string = 'parents et enfants de 2 à 8 ans',
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
