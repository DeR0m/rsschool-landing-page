(function () {
    const tabList = document.querySelector('.menu__tabs');
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('.menu__button'));
    const panels = Array.from(document.querySelectorAll('.menu-panel'));

    function updateMenu(tabValue) {
        tabs.forEach(el => {
            const isActive = el.dataset.tab === tabValue;
            el.classList.toggle('menu__button--active', isActive);

            const tabItem = el.querySelector('.menu__item');
            if (tabItem) tabItem.classList.toggle('menu__item--active', isActive);
        });
        panels.forEach(el =>
            el.classList.toggle('menu-panel--active', el.dataset.content === tabValue)
        );
    }

    tabs.forEach(item => {
        item.addEventListener('click', () => updateMenu(item.dataset.tab));
    });
})();

