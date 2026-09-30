(function () {
    const ITEM_VISIBLE = 4;
    const tabList = document.querySelector('.menu__tabs');
    if (!tabList) return;

    const tabs = Array.from(tabList.querySelectorAll('.menu__button'));
    const panels = Array.from(document.querySelectorAll('.menu-panel'));
    const moreButton = document.querySelector('.menu__more');

    if (!moreButton) return;
    const mq = window.matchMedia('(max-width: 768px)');

    const IMG_EXT = {
        coffee: 'jpg',
        tea: 'png',
        dessert: 'png'
    };

    function slugify(str) {
        return String(str)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function createCard(dish, index, category) {
        const card = document.createElement('div');
        card.className = 'menu-grid__item';

        const imgSrc = `images/catalog/${category}/${slugify(dish.name)}.${IMG_EXT[category] || 'jpg'}`;

        card.innerHTML = `
            <div class="menu-grid__box">
                <img class="menu-grid__image" src="${imgSrc}" alt="${dish.name}">
            </div>
            <div class="menu-grid__content">
                <div class="menu-grid__title">
                    <h2 class="menu-grid__name">${dish.name}</h2>
                    <p class="menu-grid__text">${dish.description}</p>
                </div>
                <p class="menu-grid__cost">$${dish.price}</p>
            </div>
        `;
        return card;
    }

    function renderCatalog(data) {
        panels.forEach(panel => {
            const category = panel.dataset.content;
            const items = data.filter(p => p.category === category);

            panel.innerHTML = '';
            items.forEach((dish, index) => {
                panel.appendChild(createCard(dish, index, category));
            });
        });
    }

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

    fetch('products.json')
        .then(r => r.json())
        .then(data => {
            renderCatalog(data);

            const activePanel = panels.find(p => p.classList.contains('menu-panel--active'));
            if (activePanel) renderPanel(activePanel);
        })
        .catch(err => console.error('Failed to load the menu:', err));
})();