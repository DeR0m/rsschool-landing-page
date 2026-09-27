(function () {
    const ITEM_VISIBLE = 4;
    const tabList = document.querySelector('.menu__tabs');
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('.menu__button'));
    const panels = Array.from(document.querySelectorAll('.menu-panel'));
    const moreButton = document.querySelector('.menu__more');

    if (!moreButton) return;
    const mq = window.matchMedia('(max-width: 768px)');

    function getActivePanel() {
        return panels.find(p => p.classList.contains('menu-panel--active'));
    }

    function renderPanel(panel) {
        const page = Number(panel.dataset.page) || 1;
        const items = panel.querySelectorAll('.menu-grid__item');
        const visibleCount = page * ITEM_VISIBLE;

        items.forEach((item, index) => {
            item.hidden = mq.matches && index >= visibleCount;
        });

        const shouldShow = mq.matches && visibleCount < items.length;
        moreButton.classList.toggle('menu__more--active', shouldShow);
    }

    function updateMenu(tabValue) {
        tabs.forEach(el => {
            const isActive = el.dataset.tab === tabValue;
            el.classList.toggle('menu__button--active', isActive);

            const tabItem = el.querySelector('.menu__item');
            if (tabItem) tabItem.classList.toggle('menu__item--active', isActive);
        });
        panels.forEach(panel => {
            const isActive = panel.dataset.content === tabValue;
            panel.classList.toggle('menu-panel--active', isActive);

            if (isActive) {
                panel.dataset.page = '1';
                renderPanel(panel);
            }
        });
    }

    tabs.forEach(item => {
        item.addEventListener('click', () => updateMenu(item.dataset.tab));
    });

    document.addEventListener('click', e => {
        const moreButton = e.target.closest('.menu__more');
        if (!moreButton) return;

        const panel = panels.find(p => p.classList.contains('menu-panel--active'));
        if (!panel) return;

        const page = Number(panel.dataset.page) || 1;
        panel.dataset.page = String(page + 1);
        renderPanel(panel);
    });

    mq.addEventListener('change', () => {
        const panel = getActivePanel();
        if (panel) renderPanel(panel);
    });

    const activePanel = panels.find(p => p.classList.contains('menu-panel--active'));
    if (activePanel) renderPanel(activePanel);
})();