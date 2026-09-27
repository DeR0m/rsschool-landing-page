(function () {
    const header = document.querySelector('.header');
    const burgerButton = document.querySelector('.header__burger-menu');
    const menuLinks = document.querySelectorAll('.header__menu-link');

    burgerButton.addEventListener('click', () => {
        const isOpen = header.classList.toggle('header--open');
        burgerButton.setAttribute('aria-expanded', isOpen);
        burgerButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('header--open');
            burgerButton.setAttribute('aria-expanded', 'false');
            burgerButton.setAttribute('aria-label', 'Open menu');
        });
    });

    document.addEventListener('click', (e) => {
        if (!header.classList.contains('header--open')) return;
        const clickedInsideMenu = e.target.closest('.header__nav');
        const clickedBurger = e.target.closest('.header__burger-menu');
        if (!clickedInsideMenu && !clickedBurger) {
            header.classList.remove('header--open');
            burgerButton.setAttribute('aria-expanded', 'false');
            burgerButton.setAttribute('aria-label', 'Open menu');
        }
    });
})();