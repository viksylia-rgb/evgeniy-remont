// Готовит изображения для сайта из исходных файлов в родительской папке.
// Запуск: npm run images
import sharp from 'sharp';
import QRCode from 'qrcode';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('..');
const OUT = path.resolve('public/images');
await mkdir(OUT, { recursive: true });
await mkdir(path.join(OUT, 'works'), { recursive: true });
await mkdir(path.join(OUT, 'reviews'), { recursive: true });

// 1. Логотип: убираем красно-жёлтую «бахрому» от неаккуратного удаления фона
const logoSrc = path.join(SRC, 'ЛОГОТИП ИП.png');
const { data, info } = await sharp(logoSrc).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const pureRed = r > 170 && g < 110 && b < 110;
  const pureYellow = r > 200 && g > 190 && b < 90;
  if (a < 200 || spread > 150 || pureRed || pureYellow) data[i + 3] = 0;
}
const cleanLogo = sharp(data, { raw: info });
const cleanBuf = await cleanLogo.png().toBuffer();
// слегка сглаживаем край прозрачности
const alpha = await sharp(cleanBuf).extractChannel(3).blur(0.6).toBuffer();
const rgb = await sharp(cleanBuf).removeAlpha().toBuffer();
const logoFull = await sharp(rgb).joinChannel(alpha).png().toBuffer();
const trimmed = await sharp(logoFull).trim().png().toBuffer();
await sharp(trimmed).resize({ width: 900 }).webp({ quality: 90 }).toFile(path.join(OUT, 'logo.webp'));
await sharp(trimmed).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo.png'));

// Компактная монограмма «ЕР» (верхняя часть логотипа без линий)
// (extract и trim разнесены: в одном конвейере sharp выполняет trim раньше extract)
const monoRaw = await sharp(logoFull).extract({ left: 940, top: 80, width: 292, height: 272 }).png().toBuffer();
const mono = await sharp(monoRaw).trim().png().toBuffer();
await sharp(mono).resize({ height: 160 }).webp({ quality: 92 }).toFile(path.join(OUT, 'monogram.webp'));
await sharp(mono).resize({ height: 160 }).png().toFile(path.join(OUT, 'monogram.png'));

// Иконки вкладки: монограмма на чёрном квадрате
async function icon(size, file) {
  const inner = Math.round(size * 0.78);
  const m = await sharp(mono).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#0B0B0D' } })
    .composite([{ input: m, gravity: 'center' }]).png().toFile(path.join(OUT, '..', file));
}
await icon(32, 'favicon-32.png');
await icon(180, 'apple-touch-icon.png');
await icon(512, 'icon-512.png');

// 2. Фото «До / После»: режем склеенные снимки на две половины, срезаем плашки с подписями
const works = [
  { file: '104c003b-b6e6-4ca6-966c-1310e82c799b.png', name: 'interior-green', left: 762, rightStart: 774, top: 100 },
  { file: '975eb954-14f5-48ed-973e-038679d9700c.png', name: 'interior-terracotta', left: 764, rightStart: 771, top: 100 },
  { file: 'f3e1623a-b185-43bf-8318-499e7cb964f4.png', name: 'warehouse', left: 826, rightStart: 846, top: 100 },
];
for (const w of works) {
  const src = path.join(SRC, 'ФОТО ДО ПОСЛЕ', w.file);
  const meta = await sharp(src).metadata();
  const h = meta.height - w.top;
  for (const [side, left] of [['before', 0], ['after', w.rightStart]]) {
    const img = sharp(src).extract({ left, top: w.top, width: w.left, height: h });
    await img.clone().webp({ quality: 80 }).toFile(path.join(OUT, 'works', `${w.name}-${side}.webp`));
  }
}
// Фото склада «после» — запасной фон первого экрана
await sharp(path.join(SRC, 'ФОТО ДО ПОСЛЕ', works[2].file))
  .extract({ left: 846, top: 0, width: 826, height: 941 }).resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 78 }).toFile(path.join(OUT, 'hero-fallback.webp'));

// 3. Фото первого экрана: стоковое из папки «СТОК/hero.jpg», иначе — фото склада после покраски
const STOCK = path.join(SRC, 'СТОК');
const stockHero = path.join(STOCK, 'hero.jpg');
if (existsSync(stockHero)) {
  // Отражаем по горизонтали: мастер оказывается справа, слева остаётся место для заголовка
  const flipped = await sharp(stockHero).flop().toBuffer();
  const { width: hw, height: hh } = await sharp(flipped).metadata();
  await sharp(flipped).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(OUT, 'hero.webp'));
  // для телефона — правая часть кадра, где мастер с краскопультом
  const left = Math.round(hw * 0.2);
  await sharp(flipped).extract({ left, top: 0, width: hw - left, height: hh })
    .resize({ width: 900, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(OUT, 'hero-mobile.webp'));
} else {
  const fb = path.join(OUT, 'hero-fallback.webp');
  await sharp(fb).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(OUT, 'hero.webp'));
  await sharp(fb).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(OUT, 'hero-mobile.webp'));
}

// Картинки для карточек услуг (4:3)
await mkdir(path.join(OUT, 'services'), { recursive: true });
const card = (src, file, region) => {
  let p = sharp(src);
  if (region) p = p.extract(region);
  return p.resize({ width: 900, height: 675, fit: 'cover', position: 'attention' }).webp({ quality: 76 }).toFile(path.join(OUT, 'services', file));
};
const BA = (f) => path.join(SRC, 'ФОТО ДО ПОСЛЕ', f);
await card(BA(works[1].file), 'airless.webp', { left: 771, top: 120, width: 764, height: 700 });
await card(BA(works[2].file), 'warehouse.webp', { left: 846, top: 120, width: 826, height: 821 });
await card(BA(works[2].file), 'metal.webp', { left: 846, top: 100, width: 826, height: 440 });
await card(BA(works[0].file), 'apartment.webp', { left: 774, top: 120, width: 762, height: 760 });
// Фасад и частный дом — только если положить стоковые фото в папку «СТОК»
if (existsSync(path.join(STOCK, 'facade.jpg'))) await card(path.join(STOCK, 'facade.jpg'), 'facade.webp');
const houseSrc = path.join(STOCK, 'house.jpg');
if (existsSync(houseSrc)) {
  // вертикальное фото: берём полосу 4:3 с фронтоном дома и мастером на крыше
  const { width: w, height: h } = await sharp(houseSrc).metadata();
  const ch = Math.round(w * 0.75);
  await card(houseSrc, 'house.webp', { left: 0, top: Math.min(h - ch, Math.round(h * 0.3)), width: w, height: ch });
}

// 4. Фото мастера
await sharp(path.join(SRC, 'ФОТО собственника.png')).resize({ width: 900 }).webp({ quality: 82 }).toFile(path.join(OUT, 'master.webp'));

// 5. Скриншоты отзывов — обезличенные: фото профиля заменяется кружком с буквой,
// фамилия сокращается до первой буквы (без согласия авторов на распространение, ст. 10.1 152-ФЗ).
// avatar: центр и радиус фото профиля; name: прямоугольник с именем, новое имя, базовая линия и размер шрифта.
const reviews = [
  { file: '8e472e2c-47a8-4c16-a683-ccf755b59c21', letter: 'Е', avatar: [108, 108, 64], name: { box: [184, 44, 400, 66], text: 'Егор А.', x: 192, y: 95, size: 44 } },
  { file: 'b1a091f7-07ad-4cb6-8472-67e253f680bd', letter: 'В', avatar: [110, 92, 68], name: { box: [198, 24, 540, 66], text: 'Виктория Л.', x: 206, y: 75, size: 46 } },
  { file: 'c4564641-3b6f-4494-abbc-48854ad92dea', letter: 'M', avatar: [106, 82, 64] },
  { file: '48821456-cde7-44e6-9408-f42c5005e615', letter: 'А', avatar: [108, 85, 64], name: { box: [184, 32, 580, 62], text: 'Анастасия Т.', x: 192, y: 78, size: 42 } },
  { file: '1bb63092-e796-42e7-b9ed-b4feeca04b0a' }, // без фото и без фамилии — оставляем как есть
  { file: 'fbf90886-921f-4733-bbf5-c69076cffac5', letter: 'Т', avatar: [108, 130, 64], name: { box: [184, 80, 480, 58], text: 'Татьяна Т.', x: 192, y: 122, size: 42 } },
];
for (const [i, r] of reviews.entries()) {
  const src = path.join(SRC, 'ОТЗЫВЫ', `${r.file}.jpg`);
  const { width, height } = await sharp(src).metadata();
  let svg = '';
  if (r.avatar) {
    const [cx, cy, rad] = r.avatar;
    svg += `<circle cx="${cx}" cy="${cy}" r="${rad + 4}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${rad - 4}" fill="#B9B4A8"/>`;
    svg += `<text x="${cx}" y="${cy + rad * 0.36}" font-family="Arial, sans-serif" font-size="${rad}" fill="#fff" text-anchor="middle">${r.letter}</text>`;
  }
  if (r.name) {
    const [x, y, w, h] = r.name.box;
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>`;
    svg += `<text x="${r.name.x}" y="${r.name.y}" font-family="Arial, sans-serif" font-weight="700" font-size="${r.name.size}" fill="#111">${r.name.text}</text>`;
  }
  const img = sharp(src);
  if (svg) img.composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svg}</svg>`) }]);
  await img.webp({ quality: 85 }).toFile(path.join(OUT, 'reviews', `review-${i + 1}.webp`));
}

// 6. QR-коды
const qrOpts = { margin: 1, color: { dark: '#0B0B0D', light: '#F7F6F2' }, errorCorrectionLevel: 'M' };
await writeFile(path.join(OUT, 'qr-telegram.svg'), await QRCode.toString('https://t.me/PROREMONTCOM', { ...qrOpts, type: 'svg' }));
await writeFile(path.join(OUT, 'qr-vk.svg'), await QRCode.toString('https://vk.ru/id812225893', { ...qrOpts, type: 'svg' }));

// 7. Картинка для превью ссылки в соцсетях (1200x630)
const ogLogo = await sharp(trimmed).resize({ width: 760 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#0B0B0D' } })
  .composite([{ input: ogLogo, gravity: 'center' }]).jpeg({ quality: 85 }).toFile(path.join(OUT, 'og-image.jpg'));

console.log('Готово: изображения в public/images');
