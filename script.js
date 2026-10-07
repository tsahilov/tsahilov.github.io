const filterButtons = document.querySelectorAll('.portfolio-filter__button');
const projectCards = document.querySelectorAll('.project-card');
const galleries = document.querySelectorAll('[data-inline-gallery]');

let activeFilter = null;

function applyFilter(filter) {
    projectCards.forEach((card) => {
        const categories = (card.dataset.categories || '').split(/\s+/).filter(Boolean);
        const shouldShow = !filter || categories.includes(filter);
        card.classList.toggle('is-hidden', !shouldShow);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        const isSameFilter = activeFilter === filter;

        activeFilter = isSameFilter ? null : filter;

        filterButtons.forEach((item) => {
            item.setAttribute('aria-pressed', String(item.dataset.filter === activeFilter));
        });

        applyFilter(activeFilter);
    });
});

galleries.forEach((gallery) => {
    const images = Array.from(gallery.querySelectorAll(':scope > img'));
    if (!images.length) return;

    let activeIndex = 0;
    let pendingClientX = null;
    let animationFrame = null;
    let isReady = false;

    const decodeImage = (image) => {
        if (typeof image.decode === 'function') {
            return image.decode().catch(() => undefined);
        }

        if (image.complete) return Promise.resolve();

        return new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
        });
    };

    const render = () => {
        animationFrame = null;
        if (!isReady || pendingClientX === null) return;

        const rect = gallery.getBoundingClientRect();
        const x = Math.min(Math.max(pendingClientX - rect.left, 0), rect.width);
        const progress = rect.width ? x / rect.width : 0;
        const nextIndex = Math.min(images.length - 1, Math.floor(progress * images.length));

        if (nextIndex !== activeIndex) {
            images[activeIndex].style.visibility = 'hidden';
            images[nextIndex].style.visibility = 'visible';
            activeIndex = nextIndex;
        }
    };

    const queueRender = (clientX) => {
        pendingClientX = clientX;
        if (!isReady || animationFrame !== null) return;

        animationFrame = window.requestAnimationFrame(render);
    };

    // Inline galleries are small after image optimization. Decode every frame up front
    // so the first pointer movement never triggers a visible load/decode hitch.
    Promise.all(images.map(decodeImage)).then(() => {
        isReady = true;
        if (pendingClientX !== null && animationFrame === null) {
            animationFrame = window.requestAnimationFrame(render);
        }
    });

    gallery.addEventListener('pointermove', (event) => {
        queueRender(event.clientX);
    }, { passive: true });

    gallery.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        if (touch) queueRender(touch.clientX);
    }, { passive: true });
});

const guideNavLinks = Array.from(document.querySelectorAll('.guide-nav__link'));

if (guideNavLinks.length) {
    const guideSections = guideNavLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActiveGuideSection = (id) => {
        guideNavLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            if (isActive) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    };

    let guideNavTicking = false;

    const updateActiveGuideSection = () => {
        const marker = window.scrollY + window.innerHeight * 0.28;
        let activeSection = guideSections[0];

        guideSections.forEach((section) => {
            if (section.offsetTop <= marker) activeSection = section;
        });

        if (activeSection) setActiveGuideSection(activeSection.id);
        guideNavTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (guideNavTicking) return;
        window.requestAnimationFrame(updateActiveGuideSection);
        guideNavTicking = true;
    }, { passive: true });

    window.addEventListener('resize', updateActiveGuideSection);
    updateActiveGuideSection();
}
