(function () {
    const header = document.querySelector('.header');
    const burgerButton = document.querySelector('.header__burger-menu');
    const menuLinks = document.querySelectorAll('.header__menu-link');

    const isOpen = () => header.classList.contains('header--open');

    if (!header || !burgerButton) return;

    function openMenu() {
        header.classList.add('header--open');
        burgerButton.setAttribute('aria-expanded', 'true');
        burgerButton.setAttribute('aria-label', 'Close menu');
    }

    function closeMenu() {
        header.classList.remove('header--open');
        burgerButton.setAttribute('aria-expanded', 'false');
        burgerButton.setAttribute('aria-label', 'Open menu');
    }

    burgerButton.addEventListener('click', () => {
        isOpen() ? closeMenu() : openMenu();
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen()) closeMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (!isOpen()) return
        const clickedInsideMenu = e.target.closest('.header__nav-wrapper');
        const clickedBurger = e.target.closest('.header__burger-menu');
        if (!clickedInsideMenu && !clickedBurger) {
            closeMenu();
            burgerButton.focus();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && isOpen()) {
            closeMenu();
            burgerButton.focus();
        }
    });
})();