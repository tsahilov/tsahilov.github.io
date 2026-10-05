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

function updateInlineGallery(gallery, clientX) {
    const images = Array.from(gallery.querySelectorAll(':scope > img'));
    if (!images.length) return;

    const rect = gallery.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const progress = rect.width ? x / rect.width : 0;
    const index = Math.min(images.length - 1, Math.floor(progress * images.length));

    images.forEach((image, imageIndex) => {
        image.style.visibility = imageIndex === index ? 'visible' : 'hidden';
    });
}

galleries.forEach((gallery) => {
    gallery.addEventListener('pointermove', (event) => {
        updateInlineGallery(gallery, event.clientX);
    });

    gallery.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        if (touch) updateInlineGallery(gallery, touch.clientX);
    }, { passive: true });
});


const pragmaticaGalleries = document.querySelectorAll('[data-pragmatica-gallery]');

function updatePragmaticaGallery(gallery, clientX) {
    const videos = Array.from(gallery.querySelectorAll('.pragmatica-preview__video'));
    if (!videos.length) return;

    const rect = gallery.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const progress = rect.width ? x / rect.width : 0;
    const index = Math.min(videos.length - 1, Math.floor(progress * videos.length));

    videos.forEach((video, videoIndex) => {
        video.classList.toggle('is-active', videoIndex === index);
        video.style.zIndex = String(3 - Math.abs(videoIndex - index));
    });
}

pragmaticaGalleries.forEach((gallery) => {
    gallery.addEventListener('pointermove', (event) => {
        updatePragmaticaGallery(gallery, event.clientX);
    });

    gallery.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        if (touch) updatePragmaticaGallery(gallery, touch.clientX);
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
