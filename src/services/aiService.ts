/**
 * Service de génération d'articles via IA (OpenRouter + ChatGPT 4o-mini)
 */

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini'; // Free tier

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
  read_time_minutes: number;
}

/**
 * Génère un slug SEO-friendly à partir d'un titre
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder uniquement lettres, chiffres, espaces et tirets
    .trim()
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-'); // Supprimer tirets multiples
}

/**
 * Calcule le temps de lecture estimé en minutes
 */
function calculateReadTime(html: string): number {
  // Retirer les balises HTML
  const text = html.replace(/<[^>]*>/g, '');
  // Compter les mots (moyenne 200 mots/min)
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Génère un article complet en 3 langues via IA
 */
export async function generateArticleWithAI(
  titleInput: string,
  targetAudience: string = 'parents et enfants de 2 à 8 ans'
): Promise<GeneratedArticle> {
  const prompt = `Tu es un rédacteur expert pour BoomLaLaBoom, un site éducatif pour enfants.

Génère un article de blog complet et détaillé sur le sujet suivant : "${titleInput}"

Public cible : ${targetAudience}

L'article doit être :
- Informatif, engageant et optimisé SEO
- Structuré avec des titres H2, H3, des paragraphes, des listes
- Entre 800 et 1200 mots
- Adapté à des parents cherchant du contenu éducatif de qualité

IMPORTANT : Réponds UNIQUEMENT avec un objet JSON valide contenant ces champs (pas de markdown, pas de texte avant/après) :

{
  "title_fr": "Titre en français (60 caractères max)",
  "title_en": "Title in English (60 characters max)",
  "title_es": "Título en español (60 caracteres max)",
  "excerpt_fr": "Résumé captivant en français (150-160 caractères)",
  "excerpt_en": "Captivating summary in English (150-160 characters)",
  "excerpt_es": "Resumen cautivador en español (150-160 caracteres)",
  "content_fr": "Contenu complet en HTML (avec <h2>, <h3>, <p>, <ul>, <li>, etc.)",
  "content_en": "Full content in HTML (with <h2>, <h3>, <p>, <ul>, <li>, etc.)",
  "content_es": "Contenido completo en HTML (con <h2>, <h3>, <p>, <ul>, <li>, etc.)"
}

Le contenu HTML doit :
- Commencer directement par le contenu (pas de <h1>, il est déjà dans le titre)
- Utiliser <h2> pour les sections principales
- Utiliser <h3> pour les sous-sections
- Inclure des <p> pour les paragraphes
- Utiliser <ul> et <li> pour les listes
- Être bien formaté et structuré`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'BoomLaLaBoom Admin',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parser le JSON retourné par l'IA
    let parsedContent;
    try {
      // Nettoyer le contenu pour extraire uniquement le JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      parsedContent = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Générer les slugs
    const slug_fr = generateSlug(parsedContent.title_fr);
    const slug_en = generateSlug(parsedContent.title_en);
    const slug_es = generateSlug(parsedContent.title_es);

    // Calculer le temps de lecture (moyenne des 3 langues)
    const readTimeFr = calculateReadTime(parsedContent.content_fr);
    const readTimeEn = calculateReadTime(parsedContent.content_en);
    const readTimeEs = calculateReadTime(parsedContent.content_es);
    const read_time_minutes = Math.round((readTimeFr + readTimeEn + readTimeEs) / 3);

    return {
      title_fr: parsedContent.title_fr,
      title_en: parsedContent.title_en,
      title_es: parsedContent.title_es,
      slug_fr,
      slug_en,
      slug_es,
      excerpt_fr: parsedContent.excerpt_fr,
      excerpt_en: parsedContent.excerpt_en,
      excerpt_es: parsedContent.excerpt_es,
      content_fr: parsedContent.content_fr,
      content_en: parsedContent.content_en,
      content_es: parsedContent.content_es,
      read_time_minutes,
    };
  } catch (error) {
    console.error('Error generating article with AI:', error);
    throw error;
  }
}
