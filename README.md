# Сайт «Евгений Ремонт» — Новосибирск

Одностраничный сайт: React + Vite + TypeScript + Tailwind CSS + Motion + Lucide.
Всё бесплатно: шрифты лежат внутри проекта, хостинг — GitHub Pages.

## Где что менять

| Что | Где |
|---|---|
| Телефон, мессенджеры, график, реквизиты | `src/data/site.ts` → `contacts`, `legal` |
| Услуги и их описания | `src/data/site.ts` → `services`, `extraServices` |
| Цены | `src/data/site.ts` → `priceGroups`, `minimums` |
| Отзывы | `src/data/site.ts` → `reviews` (+ скриншоты в `public/images/reviews`) |
| Фото «До / После» | `src/data/site.ts` → `works` (+ файлы в `public/images/works`) |
| Адрес сайта для SEO | `vite.config.ts` → `SITE_URL` |
| Заголовок и описание для поисковиков | `index.html` → `<title>`, `description` |

## Запуск на компьютере

Нужен Node.js (уже установлен).

```bash
npm install
npm run dev
```

Откройте http://localhost:5173 — сайт обновляется сразу при сохранении файлов.

Проверка готовой сборки:

```bash
npm run build
npm run preview
```

## Фотографии

Исходные фото лежат в папке выше (`ЛОГОТИП ИП.png`, `ФОТО ДО ПОСЛЕ`, `ОТЗЫВЫ`, `ФОТО собственника.png`).
Команда `npm run images` заново делает из них оптимизированные WebP-файлы в `public/images`:
режет «До / После» на половины, чистит края логотипа, делает иконки и QR-коды.

Стоковые фото (необязательно) кладутся в папку `СТОК` рядом с исходниками:
`hero.jpg` — первый экран, `facade.jpg` — фасады, `house.jpg` — частные дома. Затем `npm run images`.
Пока их нет, на первом экране стоит фото склада после покраски, а у двух карточек — графическая заставка.

## Форма «Получить расчёт»

Работает без сервера: собирает текст заявки и открывает WhatsApp с готовым сообщением.
Кнопка Telegram копирует текст и открывает чат. Сайт сам ничего не хранит и не отправляет,
поэтому не нужны политика обработки персональных данных и уведомление Роскомнадзора.

## Бесплатная публикация на GitHub Pages

1. Зарегистрируйтесь на https://github.com (бесплатно).
2. Установите Git: https://git-scm.com/download/win (все настройки по умолчанию).
3. Создайте репозиторий с именем `ВАШ_ЛОГИН.github.io` (публичный, без README).
4. В `vite.config.ts` впишите `SITE_URL = 'https://ВАШ_ЛОГИН.github.io/'`.
5. В папке `site` выполните:

```bash
git init -b main
git add .
git commit -m "Сайт Евгений Ремонт"
git remote add origin https://github.com/ВАШ_ЛОГИН/ВАШ_ЛОГИН.github.io.git
git push -u origin main
```

6. В репозитории: **Settings → Pages → Source: GitHub Actions**.
7. Через 1–2 минуты сайт откроется по адресу `https://ВАШ_ЛОГИН.github.io/`.

Дальше любые правки публикуются так:

```bash
git add .
git commit -m "Правки"
git push
```

### Чтобы сайт находили в поиске

- Яндекс Вебмастер: https://webmaster.yandex.ru — добавьте сайт и укажите `sitemap.xml`.
- Google Search Console: https://search.google.com/search-console — то же самое.
- Бесплатно добавьте организацию в Яндекс Бизнес и 2ГИС со ссылкой на сайт.
