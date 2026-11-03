import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// АДРЕС САЙТА. После публикации впишите сюда настоящий адрес (со слешем в конце)
// и пересоберите сайт: из него строятся sitemap.xml, robots.txt и превью ссылок.
export const SITE_URL = 'https://viksylia-rgb.github.io/evgeniy-remont/';

/** Подставляет адрес сайта в index.html и создаёт robots.txt и sitemap.xml при сборке */
function seoFiles(): Plugin {
  return {
    name: 'seo-files',
    // order: 'pre' — подставляем адрес до того, как Vite начнёт разбирать ссылки в html
    transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL) },
    closeBundle() {
      const out = resolve(__dirname, 'dist');
      const today = new Date().toISOString().slice(0, 10);
      writeFileSync(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`);
      writeFileSync(
        resolve(out, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_URL}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      );
      // GitHub Pages: отключаем обработку Jekyll, чтобы файлы отдавались как есть
      writeFileSync(resolve(out, '.nojekyll'), '');
    },
  };
}

// base: './' — сайт работает из любой папки (GitHub Pages, Cloudflare Pages)
export default defineConfig({
  base: './',
  plugins: [react(), seoFiles()],
  build: {
    target: 'es2019',
    assetsInlineLimit: 2048,
  },
});
