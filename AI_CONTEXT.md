# Контекст проекта для нового диалога с ChatGPT

> **Прочитать первым делом.** Этот файл нужен, чтобы не восстанавливать контекст проекта по сообщениям. Актуальные HTML/CSS/JS в архиве всегда считаются источником истины, если они расходятся с этим документом.

## 1. Что мы делаем

Это быстрый редизайн и пересборка портфолио Алана Цахилова — `alantsahilov.ru`.

Главная цель: уйти от длинного лендинга, где кейсы идут подряд, и сделать:

- главную как каталог разноформатных превью проектов;
- отдельную страницу для каждого кейса;
- некоторые проекты можно открывать как полноценные «живые» сайты/прототипы внутри портфолио;
- всё собирается сразу кодом, без отдельного дизайн-этапа в Figma.

Проект статический: HTML + CSS + vanilla JS. Не тащить React/Vue/Astro и сборщики без явной просьбы.

В основе визуальной и технической логики — приёмы из **Intuition Design System (IDS)**:
- https://intuition-tech.github.io/ids/
- https://github.com/intuition-tech/ids

IDS здесь не зависимость: нужные решения копируются и адаптируются под проект.

## 2. Как работать с пользователем

Пользователь проектирует прямо в браузере и быстро итератирует.

Обычный цикл:
1. пользователь описывает правку словами/скрином;
2. правим существующие файлы минимально и без лишнего рефакторинга;
3. сохраняем уже настроенную визуальную систему;
4. отдаём либо конкретный изменённый файл, либо небольшой patch-архив, либо полный архив — как попросит пользователь.

Важно:
- не усложнять код без необходимости;
- если можно решить одной переменной/классом — не строить абстракцию;
- не возвращать старые компоненты/ассеты, которые уже были удалены;
- перед правкой смотреть актуальные файлы, а не восстанавливать код по памяти;
- размеры, цвета и повторяющиеся значения по возможности держать в CSS variables;
- визуально ничего не менять «заодно», если пользователь этого не просил.

## 3. Структура проекта

```text
/
├── index.html                 # главная портфолио
├── about.html                 # внутренняя страница на том же шаблоне, что и кейсы
├── home.css                   # стили только главной
├── style.css                  # общий CSS для about + всех страниц кейсов
├── script.js                  # фильтры главной + inline gallery
├── AI_CONTEXT.md              # этот файл
│
├── fonts/                     # PT Root UI; старые Stratos-файлы пока физически не удалены
├── images/                    # превью и изображения кейсов
│   └── case-ads/              # изображения кейса объявлений
│
├── projects/
│   ├── ads/
│   │   └── index.html         # кейс «Человечные объявления в лифте»
│   └── ads-guide/
│       └── index.html         # гайд «Как писать объявления в лифтах…»
│
└── delovoz/                   # отдельный «живой» сайт проекта Деловоз
    ├── index.html
    ├── css/delovoz.css        # СТИЛИ ДЕЛОВОЗА ТОЛЬКО ЗДЕСЬ
    ├── fonts/                 # Montserrat Variable
    └── images/
```

`home.css` и `style.css` намеренно самодостаточные и во многом повторяют друг друга. Отдельный общий `ids.css` не нужен: файлы разделены ради удобства ручного редактирования разных типов страниц.

**Критически важно:** стили `delovoz/` держать отдельно от `home.css` и `style.css`.

## 4. Главная портфолио

Источник стилей главной — `home.css`.

### Основа
- PT Root UI Variable (`fonts/pt-root-ui_vf.woff2`);
- IDS-подход с fluid root font-size;
- `--ids__density`;
- общий `.ids__wrapper` шириной 97%;
- вертикальный ритм через `.ids__space.XS/S/M/L/XL`;
- ссылки: hover включается мгновенно, возврат плавный; подчёркивание остаётся полупрозрачным и на hover.

### Topbar
На главной и внутренних страницах одна визуальная шапка:
- слева аватар + `Алан Цахилов — дизайнер и редактор.`;
- ссылкой является только `Алан Цахилов`;
- `Алан Цахилов` ведёт на главную;
- по центру/справа визуальный `ru en`;
- `Написать` ведёт на `https://t.me/pepenguin`;
- используется sticky-поведение и белая подложка, визуально выходящая за 97% wrapper до краёв экрана.

### Интро
- SVG-росчерк `images/alantsahilovpodpis.svg`;
- текстовая колонка 60%;
- ссылка `Про мой дизайнерский и в целом путь →` ведёт на `about.html`.

### Фильтры
Строка `Чаще всего я делаю:` + светло-серые пилюли. Фильтрация через `script.js`: одна активная категория, повторный клик её снимает.

### Галерея проектов
Галерея — единая 12-колоночная grid-сетка. Размер принадлежит карточке проекта через `grid-column: span ...`, поэтому при фильтрации карточки не растягиваются и не сжимаются из-за смены позиции.

Кликабельность сейчас:
- Деловоз → `./delovoz/`;
- Человечные объявления → `./projects/company-announcement.html`;
- Калькулятор финансовой грамотности → `https://chtokchemu.ru/`;
- остальные карточки временно некликабельны и не получают ссылочный hover подписи.

### Inline gallery
В `script.js` есть упрощённый аналог IDS `.ids__inline-gallery`:
- несколько `<img>` лежат в одном контейнере;
- горизонтальное положение курсора выбирает кадр;
- touchmove поддержан.

## 5. Универсальный шаблон внутренних страниц

`about.html` и все страницы проектов считаются одним типом страницы и используют один `style.css`.

Первый кейс и мастер-пример: `projects/company-announcement.html`.

### Общая база
`style.css` повторяет визуальную основу `home.css`:
- PT Root UI;
- те же цвета;
- те же fluid typography / density;
- тот же 97% `.ids__wrapper`;
- те же `.ids__space.XS/S/M/L/XL`;
- та же шапка;
- та же механика ссылок.

### Врапперы контента
Для новых страниц использовать:
- `.content-wrapper.S` — 60%;
- `.content-wrapper.M` — 80%;
- `.content-wrapper.L` — 100%.

На mobile все три становятся 100%.

### Универсальная типографика
Для новых внутренних страниц использовать готовые классы:
- `.content-label` — небольшой muted-лейбл над заголовком;
- `.content-title` — `h1`;
- `.content-subtitle` — `h2`, используется только когда нужен;
- `.content-copy` — контейнер обычного текста;
- внутри `.content-copy` можно писать любое количество обычных `<p>`: межабзацный отступ уже настроен;
- `.content-link` на `<p>` даёт дополнительный верхний отступ для абзаца со ссылкой;
- ссылки внутри `.content-copy` автоматически используют общую hover-систему.

Типичный блок:

```html
<section class="content-wrapper S">
    <p class="content-label">Лейбл</p>
    <h1 class="content-title">Заголовок проекта</h1>

    <div class="content-copy">
        <p>Первый абзац.</p>
        <p>Второй абзац.</p>
        <p class="content-link"><a href="#">Ссылка&nbsp;→</a></p>
    </div>
</section>
```

### Гайд про объявления
Путь: `projects/announcement-guide.html`. Это внутренняя страница на общей базе `style.css`. Стили гайда — левое оглавление, разделители и карточки примеров — находятся в конце общего `style.css`; отдельного `guide.css` нет. Новые стили для внутренних страниц по возможности дописывать в этот же файл.

На главной гайд добавлен отдельной кликабельной карточкой с временным серым кругом вместо превью.

### Универсальные изображения
Текущий кейс также использует нейтральные классы:
- `.content-gallery`;
- `.content-gallery--four`;
- `.content-gallery--two`;
- `.content-image`;
- `.content-figure`;
- `.content-caption`.

Новые классы добавлять в `style.css` только когда появляется действительно новый тип блока.


### Mobile главной
- шапка сокращается до `Алан`; размер аватара должен совпадать на `home.css` и `style.css`;
- интро занимает 100% wrapper;
- фильтр на mobile состоит из двух строк: заголовок отдельно, пилюли ниже в одной горизонтально прокручиваемой ленте до правого края viewport;
- мобильная галерея использует 6 колонок и utility-классы `mobile-span-1` … `mobile-span-6`, поэтому карточки не обязаны быть полноширинными; текущая раскладка: Деловоз 6, объявления 4, кофейня 2, ВкусВилл 3, калькулятор 6, Прагматика 6.

### Mobile внутренних страниц
Если у `.content-label` несколько смысловых лейблов, оборачивать каждый в `.content-label__item`, а разделитель — в `.content-label__separator`. На desktop они идут в одну строку, на mobile каждый item становится отдельной строкой, разделитель скрывается.

## 6. Деловоз — отдельный живой сайт внутри портфолио

### Важный контекст
**Компании Деловоз в реальности нет.** Это портфолио-проект. Задача — сделать внутри портфолио убедительный работающий бизнес-сайт, который можно открыть из кейса и посмотреть как «реальный» сайт компании.

Путь: `/delovoz/`.

После завершения самого сайта планируется отдельная страница кейса Деловоза.

### Технология
- отдельный `delovoz/index.html`;
- отдельный `delovoz/css/delovoz.css`;
- отдельные Montserrat Variable fonts;
- отдельный SVG логотип;
- JS пока inline внизу `delovoz/index.html`.

Не переносить стили Деловоза в основной `style.css`.

### Шрифт
Montserrat Variable:
- обычный текст: Medium;
- H1/H2/H3: Regular;
- H4: Bold, размером основного текста;
- ссылки под H1: Light Italic;
- кнопки: Medium Italic.

### Цвета Деловоза
Источник истины — `delovoz/css/delovoz.css`.

Текущая система:
- текст `#222224`;
- muted heading `#7D7C8B`;
- accent blue `#0C57C8`;
- background `#FFFBF7`;
- link `#2EB9FF`;
- green hover `#5EFF2E`;
- inactive `#D3D0CD`.

### Навигация Деловоза
Фиксированная, с подложкой по той же логике, что topbar кейса.

Сейчас:
- слева SVG `ДЕЛОВОЗ`;
- переключатель «По России / В Европу / В Казахстан» **удалён**;
- справа `Заказать перевозку` и `Отследить`.

Hover-логика:
- `Заказать перевозку`: чёрный фон → синий фон, текст остаётся светлым;
- `Отследить`: прозрачный фон, чёрный текст и обводка → при hover текст и обводка становятся синими;
- `Получить консультацию`: чёрный фон → синий фон, текст остаётся светлым;
- обычные подчёркнутые ссылки → зелёный hover;
- города → синий hover.

### Главный оффер
Первый фрагмент H1 — muted:
`Перевезём вещи в ваш новый дом или квартиру:`

Остальной текст — основной цвет.

В H1 уже используются неразрывные пробелы там, где нельзя оставлять висячие союзы/предлоги.

### Счётчик завершённых переездов
На загрузке/обновлении страницы число в H2 анимируется от `0` до `47 624` примерно за 0.8 секунды с плавным замедлением к финалу. Реализация находится в inline JS `delovoz/index.html`.

### Города
Блок «Работаем в 54 городах» растянут по ширине общей линии.

Все города — ссылки `.city-link`.

Их hit-area по вертикали специально расширен симметрично вверх/вниз, чтобы между соседними строками не было «мёртвых» зон курсора. Визуальный межстрочный ритм при этом не должен меняться.

В будущем клик по городу будет связан с калькулятором (выбор/скролл к калькулятору).

### Повторяющийся ритм секций Деловоза
Система разделителей согласована как:
- от заголовка до линии — 18 px в масштабе исходного макета 1200 px;
- от линии до текста — 9 px;
- H4 и обычный текст идут подряд без дополнительной вертикальной дырки;
- таблица факторов имеет отдельный увеличенный отступ сверху;
- верхняя линия перед первой строкой таблицы удалена;
- внутренние строки таблицы визуально «прибиты» к верхней разделительной линии.

Точные значения сейчас заведены в переменные CSS (`--space-heading-rule`, `--space-rule-content`, `--space-row-rule`, `--space-to-table`).

### Форма телефона
Справа от блока «Сколько стоит?» обычное классическое поведение:
- сверху `input` с placeholder `Ваш номер телефона`;
- при фокусе появляется `+7`;
- пользователь вводит номер;
- ниже отдельная кнопка `Получить консультацию`;
- после submit поле очищается, кнопка кратко показывает `✓`;
- это липовый фронтовый feedback без настоящего backend.

**Не превращать поле и кнопку в один элемент.** Это уже несколько раз ломалось.

Линия под полем телефона должна быть на одном горизонтальном уровне с линией секции `Сколько стоит?`.

### Калькулятор
Калькулятор уже реализован прямо в `delovoz/index.html`, стили лежат в `delovoz/css/delovoz.css`. Бэкенда нет: это полностью фронтовый интерактивный прототип.

Что умеет:
- выбор города отправления и назначения из списка городов сайта;
- кнопка со стрелками меняет города местами (`images/arrows-down-up.svg`);
- клик по городу в блоке «Работаем в 54 городах» прокручивает к калькулятору и подставляет этот город как точку отправления;
- количество вещей = количество строк груза;
- каждая строка содержит тип (`Техника / Мебель / Коробка`), длину, ширину, высоту и вес;
- размеры и вес редактируются прямо в строке;
- строку можно удалить кнопкой с `images/trash.svg`;
- кнопки «Мебель / Технику / Коробку» добавляют новые строки с пресетами;
- итоговая цена пересчитывается сразу после любого изменения.

Расчёт специально условный, потому что компания вымышленная, но системный и детерминированный: есть тариф маршрута, стоимость по объёму и весу, коэффициент типа вещи и фиксированный сервисный сбор. Формулу можно свободно менять без изменения интерфейса.

Стартовое состояние подобрано близко к макету: Владикавказ → Санкт-Петербург, одна строка «Техника» 160×90×200 см / 20 кг, итог около `12 490 ₽`.

## 7. Текущее состояние / что ещё не закончено

- `style.css` — единственный CSS-файл для `about.html` и кейсов, включая `projects/announcement-guide.html`; специфичные стили гайда находятся в нём же.
- Общий `script.js` также содержит логику активного пункта левого оглавления гайда.
- Главная портфолио собрана. Кликабельны Деловоз, кейс объявлений и внешний финансовый калькулятор; остальные превью пока намеренно некликабельны.
- Кейс «Человечные объявления в лифте» переведён на универсальные `.content-*` классы и задаёт мастер-шаблон внутренних страниц вместе с `about.html`.
- Деловоз уже существует как отдельный живой статичный сайт.
- В футере Деловоза указан период `2022 — 2025`.
- Калькулятор Деловоза реализован как фронтовый интерактивный прототип.
- После сайта Деловоза нужно собрать отдельный кейс Деловоза в стиле остальных страниц портфолио.
- Ссылки/контакты внутри макетов часто пока заглушки `#`; не придумывать реальные URL без пользователя.

## 8. Что не делать

- Не переписывать проект на фреймворк.
- Не подключать IDS как npm/CDN-зависимость.
- Не делать все проектные превью одинаковыми карточками.
- Не заменять текущую fluid/rem-систему без просьбы.
- Не смешивать CSS Деловоза с основным CSS портфолио.
- Не «улучшать» тексты или визуал по собственной инициативе во время технической правки.
- Не считать Деловоз настоящей компанией и не искать для него реальные данные.
- Не удалять файлы из актуального архива, если пользователь явно не попросил почистить структуру.

## 9. Если этот архив открыт в новом диалоге

1. Прочитать этот файл.
2. Затем посмотреть актуальные файлы, которых касается новая задача.
3. Считать **актуальный архив пользователя** source of truth.
4. Не просить пользователя повторно объяснять архитектуру выше.
5. Если задача локальная — менять только необходимые файлы и сообщить, какие именно.

## Pragmatica preview on home
- The `Чат-боты Прагматики` project preview is no longer a static image.
- It is a responsive 3-column group of looping muted MP4 videos in this order: grade detector, product designer simulator, salary calculator.
- Files live in `/videos/` as `pragmatica-grade.mp4`, `pragmatica-matrix.mp4`, `pragmatica-salary.mp4`.
- The whole preview still scales only through `.project-card--pragmatica { grid-column: span ...; }`; internal videos follow the card width automatically.
## 2026-10-03 — Delovoz homepage preview
- Homepage Delovoz preview is currently static.
- `images/delovoz-preview.webp` already contains the `47 624` move count baked into the image.
- The temporary SVG/JS live counter experiment was rolled back; there is no Delovoz-specific overlay or counter code on the homepage.


## 2026-10-03 — Mobile homepage
- On mobile (`<768px`) the shared topbar shortens `Алан Цахилов — дизайнер и редактор.` to just linked `Алан`; `ru / en` and `Написать` remain visible.
- Homepage intro text expands from 60% to 100% of the 97% wrapper.
- Homepage filters stay on one horizontal line and scroll horizontally; the strip extends from the wrapper to the right edge of the viewport and hides its scrollbar.
- Homepage projects collapse to one full-width column.
- The same shortened mobile topbar behavior is also present in `style.css` for About/project pages.

- The wipe has z-index 90 while the shared topbar stays at z-index 100, so the navigation remains visible and does not get covered.
- On destination load, only `main` fades in from white over 0.03 s; the topbar does not animate.


## 2026-10-03 — Pragmatica stacked preview
- Homepage `Чат-боты Прагматики` still uses the three looping muted MP4 files in `/videos/`.
- The preview is now an overlapping three-card stack instead of three equal columns.
- All three videos stay visible at once; the active video is brought to the front and stays in color, while the two inactive videos remain behind it with `grayscale(1)` and protrude from the sides.
- Active video follows horizontal pointer position across the preview in three equal zones, mirroring the interaction logic of the ads inline gallery.
- Touch movement uses the same horizontal selection logic on mobile. Videos do not restart when the active card changes.
- Markup hook: `[data-pragmatica-gallery]`; active state class: `.is-active`.

## 2026-10-03 — Favicon
- Personal favicon added site-wide from Alan's portrait.
- Browser favicon uses the circular transparent source; canonical portfolio favicon assets live in `images/`: `favicon.ico`, `favicon.png`, `favicon-32.png`, `favicon-192.png`, plus `apple-touch-icon.png`. Root compatibility copies of the four files referenced by untouched `delovoz/index.html` are intentionally retained.
- `apple-touch-icon.png` is generated from the square portrait because Apple applies its own icon mask.
- Portfolio favicon links point to `images/` in `index.html`, `about.html`, `projects/company-announcement.html`, and `projects/announcement-guide.html`. `delovoz/index.html` remains untouched and still uses root compatibility copies.

## 2026-10-03 — Search and social preview metadata
- Added `images/og-cover.png` (1200×630 PNG) from Alan's supplied signature artwork.
- Homepage now has canonical URL, Open Graph metadata, Twitter large-card metadata, and `WebSite` JSON-LD.
- `about.html` and `projects/company-announcement.html` have page-specific canonical/Open Graph/Twitter metadata while reusing the same `images/og-cover.png`.
- Delovoz metadata was intentionally left separate from the portfolio social-preview setup.

## 2026-10-05 — Structure cleanup
- `projects/` is flat: `company-announcement.html` and `announcement-guide.html`; the old `projects/ads/` and `projects/ads-guide/` folders were removed.
- Portfolio favicon assets and `og-cover.png` live under `images/`.
- `delovoz/` was left byte-for-byte unchanged. Root favicon compatibility copies remain only because `delovoz/index.html` references them.
- Internal paths, canonical URLs, Open Graph URLs, project links, CSS/JS/image references, and PT Root UI preload paths were updated for the new structure.

## 2026-10-08 — Clean URLs and absolute paths
- Portfolio internal pages use directory-based clean URLs: `/about/`, `/projects/company-announcement/`, `/projects/announcement-guide/`, `/projects/concept/`.
- Their source files are `index.html` inside matching directories.
- Portfolio asset/navigation paths are root-relative absolute paths (`/images/...`, `/fonts/...`, `/style.css`, `/home.css`, `/script.js`, etc.) so nesting changes do not break them.
- `delovoz/` remains isolated and was not rewritten.

## Концепты — внутренняя страница /projects/concept/ (2026-10-09)
- Шаблон страницы: общий `style.css`, `content-wrapper.S` для всех блоков кроме ряда «Прагматика» с `content-wrapper.M`.
- Интро: label «Штуки делаются с 2024 года»; H1 «Это концепты, личные проекты, и просто артовые штуки»; лид пользователя; горизонтальный разделитель.
- Порядок медиа: 2 меню → логотип меню → filter-11 / dieter-rams / poison-drop → видео hs-82 → 3 видео Прагматики (M) → 3 постера ВкусВилла → видео bukva-e на половине ширины S → видео bukva-d / bukva-b.
- Изображения в `/images/concept/`, видео в `/videos/concept/`, для видео сгенерированы постеры. Все видео autoplay muted loop playsinline; на мобильном ряды перестраиваются в одну колонку.
- Остальные страницы и `delovoz/` не изменять для этой задачи.
