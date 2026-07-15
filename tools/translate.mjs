import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid frontmatter');
  const fm = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentIndent = 0;
  for (const line of lines) {
    const indent = line.search(/\S/);
    if (indent === 0) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) {
        currentKey = kv[1];
        fm[currentKey] = kv[2].replace(/^'(.*)'$/, '$1').replace(/^"(.*)"$/, '$1');
        currentIndent = 0;
      }
    }
  }
  return { frontmatter: fm, body: match[2] };
}

function buildFrontmatter(fm) {
  let out = '---\n';
  for (const [key, val] of Object.entries(fm)) {
    if (typeof val === 'string' && val.includes('\n')) {
      out += `${key}: |\n`;
      for (const line of val.split('\n')) {
        out += `  ${line}\n`;
      }
    } else {
      out += `${key}: '${val}'\n`;
    }
  }
  out += '---\n';
  return out;
}

async function translateWithGemini(text, sourceLang, targetLang) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY environment variable not set');

  const prompt = `Translate the following Markdown content from ${sourceLang} to ${targetLang}. Preserve all Markdown formatting, links, images, code blocks, and HTML tags exactly as they are. Only translate the visible text content.

CONTENT:
${text}`;

  const res = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node tools/translate.mjs <spanish-file.md>');
    console.error('Example: node tools/translate.mjs src/content/blog/mi-articulo.md');
    process.exit(1);
  }

  const esPath = resolve(args[0]);
  const content = readFileSync(esPath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);

  if (frontmatter.lang === 'en') {
    console.error('File is already in English');
    process.exit(1);
  }

  console.log(`Translating: ${frontmatter.title}`);
  console.log('Sending to Gemini...');

  const translatedBody = await translateWithGemini(body, 'Spanish', 'English');

  const enTitle = (await translateWithGemini(frontmatter.title, 'Spanish', 'English')).replace(/^["']|["']$/g, '').trim();
  const enDescription = (await translateWithGemini(frontmatter.description, 'Spanish', 'English')).replace(/^["']|["']$/g, '').trim();

  const esSlug = esPath.replace(/.*[/\\]/, '').replace(/\.md$/, '');
  const enSlug = slugify(enTitle);

  const enDir = resolve(dirname(esPath), 'en');
  if (!existsSync(enDir)) mkdirSync(enDir, { recursive: true });

  const enFm = {
    title: enTitle,
    description: enDescription,
    pubDate: frontmatter.pubDate,
    category: frontmatter.category || 'fundamentos',
    lang: 'en',
    translationOf: esSlug,
  };
  if (frontmatter.heroImage) enFm.heroImage = frontmatter.heroImage;
  if (frontmatter.ogImage) enFm.ogImage = frontmatter.ogImage;
  if (frontmatter.animation) enFm.animation = frontmatter.animation;

  const enContent = buildFrontmatter(enFm) + translatedBody.trim() + '\n';
  const enPath = resolve(enDir, `${enSlug}.md`);
  writeFileSync(enPath, enContent, 'utf-8');

  frontmatter.translationOf = enSlug;
  const esContent = buildFrontmatter(frontmatter) + body.trim() + '\n';
  writeFileSync(esPath, esContent, 'utf-8');

  console.log(`✓ English version saved: ${enPath}`);
  console.log(`✓ Spanish original updated with translationOf: ${enSlug}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
