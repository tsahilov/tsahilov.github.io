// Список фраз для перебора
const words = [
    "верстальщик",
    "редактор",
    "стартапер",
    "кальянщик",
    "программист",
    "безработный.."
];

const typewriterEl = document.getElementById("typewriter");

let wordIndex = 0;
let charIndex = words[0].length; // Стартуем с уже выведенного слова
let isDeleting = true; // Сначала стираем стартовое слово

// Настройки таймингов (в миллисекундах)
const TYPING_SPEED = 90;      // Скорость печати одной буквы
const DELETING_SPEED = 45;    // Скорость стирания (обычно быстрее набора)
const HOLD_BEFORE_DELETE = 1800; // Пауза перед тем, как начать стирать слово
const HOLD_BEFORE_TYPE = 400;   // Пауза перед набором следующего слова

function typeLoop() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
    } else {
        charIndex++;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    // Когда слово напечатано целиком
    if (!isDeleting && charIndex === currentWord.length) {
        delay = HOLD_BEFORE_DELETE;
        isDeleting = true;
    } 
    // Когда слово полностью стерто
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Переход к следующему слову по кругу
        delay = HOLD_BEFORE_TYPE;
    }

    setTimeout(typeLoop, delay);
}

// Запускаем через небольшую паузу после загрузки страницы
setTimeout(typeLoop, HOLD_BEFORE_DELETE);