import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const baseUrl = 'https://boomlalaboom.com';

// Static pages
const staticPages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.6' },
  { loc: '/songs', changefreq: 'weekly', priority: '0.8' },
  { loc: '/games', changefreq: 'weekly', priority: '0.8' },
  { loc: '/characters', changefreq: 'weekly', priority: '0.8' },
  { loc: '/activities', changefreq: 'weekly', priority: '0.7' },
  { loc: '/learning', changefreq: 'monthly', priority: '0.6' },
  { loc: '/resources', changefreq: 'monthly', priority: '0.6' },
  { loc: '/parents', changefreq: 'monthly', priority: '0.6' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.5' },
  { loc: '/contact', changefreq: 'yearly', priority: '0.5' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
  { loc: '/games/lola-memory', changefreq: 'monthly', priority: '0.7' },
  { loc: '/games/shark-rhythm', changefreq: 'monthly', priority: '0.7' },
];

async function generateSitemap() {
  console.log('🔍 Fetching dynamic content from Supabase...');

  // Fetch all articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug_fr, slug_en, slug_es, updated_at')
    .order('updated_at', { ascending: false });

  // Fetch all characters
  const { data: characters } = await supabase
    .from('characters')
    .select('slug_fr, slug_en, slug_es, updated_at')
    .order('updated_at', { ascending: false });

  console.log(`✅ Found ${articles?.length || 0} articles`);
  console.log(`✅ Found ${characters?.length || 0} characters`);

  // Build URL entries
  const urls: string[] = [];

  // Add static pages
  staticPages.forEach(page => {
    urls.push(`  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  });

  const languages = ['fr', 'en', 'es'];

  interface SitemapItem {
    slug_fr?: string;
    slug_en?: string;
    slug_es?: string;
    updated_at?: string;
    [key: string]: string | undefined;
  }

  // Add articles
  if (articles) {
    (articles as SitemapItem[]).forEach(article => {
      languages.forEach(lang => {
        const slug = article[`slug_${lang}`];
        if (slug) {
          const lastmod = article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : '';
          // We append ?lang={lang} because that's what the application uses for consistency, 
          // although strictly speaking distinct URLs are better. 
          // But wait, CharacterDetailPage resolves slug REGARDLESS of query param.
          // IF we put /blog/{slug_fr} in the sitemap, it is a valid URL.
          // IF we put /blog/{slug_en}, it is ALSO a valid URL.
          // We should ideally list the CLEAN url: /blog/{slug}
          // The query param ?lang=xx is used by SeoHead for alternates, but the canonical might be clean.
          // Let's list the clean URL.
          urls.push(`  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`);
        }
      });
    });
  }

  // Add characters
  if (characters) {
    (characters as SitemapItem[]).forEach(character => {
      languages.forEach(lang => {
        const slug = character[`slug_${lang}`];
        if (slug) {
          const lastmod = character.updated_at ? new Date(character.updated_at).toISOString().split('T')[0] : '';
          urls.push(`  <url>
    <loc>${baseUrl}/characters/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`);
        }
      });
    });
  }

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  // Write to public/sitemap.xml
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap, 'utf-8');

  console.log('✅ Sitemap generated successfully!');
  console.log(`📄 Total URLs: ${urls.length}`);
  console.log(`📍 Location: ${sitemapPath}`);
}

generateSitemap().catch(console.error);
