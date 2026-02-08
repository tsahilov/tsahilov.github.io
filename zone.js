const zones = document.querySelectorAll('.hover-zone');
const zonesWrapper = document.querySelector('.hover-zones');
const items = document.querySelectorAll('.preview-element');

const reset = () => {
    items.forEach(el => {
        el.style.zIndex = 1;
        el.classList.remove('is-active');
    });
};

zones.forEach(zone => {
    const index = zone.dataset.index;

    zone.addEventListener('mouseenter', () => {
        reset();
        items[index].style.zIndex = 10;
        items[index].classList.add('is-active');
    });
});

zonesWrapper.addEventListener('mouseleave', reset);