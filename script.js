/**
 * INTERACTIVITY SCRIPT
 * Структура:
 * 1. Глобальная функция перенабора (Scramble)
 * 2. Навигация (Шапка)
 * 3. Секция "Обо мне" (Аккордеон)
 * 4. Портфолио (Фильтры и Карточки кейсов)
 */

// =====================================================================
// 1. УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ПЕРЕНАБОРА СИМВОЛОВ
// =====================================================================
const chars = '!<>-_\\/[]{}—=+*^?#_';

function scrambleText(element, targetText, duration = 800, isSequential = false) {
    clearInterval(element.scrambleInterval);

    let unresolved = [];
    for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] !== ' ') {
            unresolved.push(i);
        }
    }

    const frameRate = 30;
    const totalFrames = Math.max(1, duration / frameRate);
    const lettersPerFrame = Math.max(1, Math.ceil(unresolved.length / totalFrames));

    element.scrambleInterval = setInterval(() => {
        for (let i = 0; i < lettersPerFrame; i++) {
            if (unresolved.length > 0) {
                if (isSequential) {
                    unresolved.shift();
                } else {
                    const randomPos = Math.floor(Math.random() * unresolved.length);
                    unresolved.splice(randomPos, 1);
                }
            }
        }

        element.textContent = targetText.split('').map((letter, index) => {
            if (letter === ' ') return ' ';
            if (unresolved.includes(index)) {
                return chars[Math.floor(Math.random() * chars.length)];
            }
            return letter;
        }).join('');

        if (unresolved.length === 0) {
            clearInterval(element.scrambleInterval);
            element.textContent = targetText;
        }
    }, frameRate);
}

// =====================================================================
// 2. НАВИГАЦИЯ (Анимация ссылок в шапке)
// =====================================================================
const navLinks = document.querySelectorAll('.top-nav a');

navLinks.forEach(link => {
    const spans = link.querySelectorAll('span');

    if (spans.length > 0) {
        // Если внутри ссылки есть спаны (например, текст + [link])
        spans.forEach(span => span.originalText = span.textContent);

        link.addEventListener('mouseenter', () => {
            spans.forEach(span => scrambleText(span, span.originalText, 800, false));
        });
    } else {
        // Резервный вариант для обычных ссылок без спанов
        link.originalText = link.textContent;

        link.addEventListener('mouseenter', () => {
            scrambleText(link, link.originalText, 800, false);
        });
    }
});

// =====================================================================
// 3. СЕКЦИЯ "ОБО МНЕ" (Аккордеон)
// =====================================================================
const accordionBtn = document.getElementById('accordion-btn');

if (accordionBtn) {
    const accordion = accordionBtn.closest('.accordion');
    const title = accordionBtn.querySelector('.accordion-title');
    const paragraphs = accordion.querySelectorAll('.accordion-inner p');

    const baseText = "My achievements and hobby ";
    const textClosed = baseText + "[show]";
    const textOpen = baseText + "[close]";

    // Запоминаем исходный текст абзацев
    paragraphs.forEach(p => {
        p.originalText = p.textContent;
    });

    // Эффект при наведении на заголовок
    accordionBtn.addEventListener('mouseenter', () => {
        const currentText = accordion.classList.contains('is-open') ? textOpen : textClosed;
        scrambleText(title, currentText, 800, false);
    });

    // Эффект при клике (раскрытие/закрытие)
    accordionBtn.addEventListener('click', () => {
        const isOpen = accordion.classList.toggle('is-open');
        const newText = isOpen ? textOpen : textClosed;

        scrambleText(title, newText, 800, false);

        if (isOpen) {
            // Хаотичная расшифровка текста в колонках
            paragraphs.forEach(p => {
                scrambleText(p, p.originalText, 400, false);
            });
        }
    });
}

// =====================================================================
// 4. ПОРТФОЛИО (Фильтры, Блюр и Карточки кейсов)
// =====================================================================

// --- 4.1 Логика кнопок-фильтров ---
const filters = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.case-card');

filters.forEach(btn => {
    // Сохраняем текст для анимации перенабора
    btn.originalText = btn.textContent;

    // Анимация при наведении на фильтр
    btn.addEventListener('mouseenter', () => {
        scrambleText(btn, btn.originalText, 800, false);
    });

    // Логика сортировки (блюр) при клике
    btn.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filterValue = btn.dataset.filter;

        cards.forEach(card => {
            if (filterValue === 'all') {
                card.classList.remove('is-blurred');
            } else {
                const categories = card.dataset.categories.split(' ');
                if (categories.includes(filterValue)) {
                    card.classList.remove('is-blurred');
                } else {
                    card.classList.add('is-blurred');
                }
            }
        });
    });
});

// --- 4.2 Анимация текста при наведении на карточку кейса ---
cards.forEach(card => {
    const captionText = card.querySelector('.case-caption p');

    if (captionText) {
        // Сохраняем оригинальные хэштеги карточки
        captionText.originalText = captionText.textContent;

        card.addEventListener('mouseenter', () => {
            scrambleText(captionText, captionText.originalText, 800, false);
        });
    }
});