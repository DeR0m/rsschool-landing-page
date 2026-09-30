(function () {

    const modalWindow = document.querySelector('.modal');
    const buttonClose = document.querySelector('.modal__button-close');
    const modalImg = document.getElementById('modal__img');

    const sizesContainer = document.getElementById('modal__sizes');
    const additivesContainer = document.getElementById('modal__additives');

    const menuSection = document.querySelector('.menu');

    let json = null;
    let currentProduct = null;
    let currentSize = 's';
    let currentAdditives = new Set();

    async function getJson() {
        if (json) return json;

        const response = await fetch('products.json');
        if (response.ok) {
            json = await response.json();
        } else {
            alert("Error HTTP: " + response.status);
        }
        return json;
    }

    function lockScroll() {
        document.documentElement.classList.add('modal-open');
    }

    function unlockScroll() {
        document.documentElement.classList.remove('modal-open');
    }

    function openModal() {
        modalWindow.classList.add('modal--active');
        lockScroll();
    }

    function closeModal() {
        modalWindow.classList.remove('modal--active');
        unlockScroll();
    }

    function renderSizes() {
        sizesContainer.innerHTML = '';
        if (!currentProduct.sizes) return;

        Object.keys(currentProduct.sizes).forEach(key => {
            const sizeData = currentProduct.sizes[key];

            const button = document.createElement('button');
            button.className = 'modal__button button-size';
            button.dataset.size = key;
            button.innerHTML = `<span class="menu__item">${key.toUpperCase()}</span> ${sizeData.size}`;
            button.addEventListener('click', () => setSize(key));

            sizesContainer.appendChild(button);
        });
    }

    function renderAdditives() {
        additivesContainer.innerHTML = '';
        if (!Array.isArray(currentProduct.additives)) return;

        currentProduct.additives.forEach((add, index) => {
            const button = document.createElement('button');
            button.className = 'modal__button button-additives';
            button.dataset.index = index;
            button.innerHTML = `<span class="menu__item">${index + 1}</span> ${add.name}`;
            button.addEventListener('click', () => toggleAdditive(index));

            additivesContainer.appendChild(button);
        });
    }

    async function modalWin(name, image) {
        const data = await getJson();
        if (!data) return;

        const product = data.find(el => el.name === name);
        if (!product) return;

        currentProduct = product;
        currentSize = product.sizes ? Object.keys(product.sizes)[0] : null;
        currentAdditives = new Set();

        modalImg.src = image.getAttribute('src');
        document.getElementById('modal__name').textContent = product.name;
        document.getElementById('modal__text').textContent = product.description;

        renderSizes();
        renderAdditives();

        if (currentSize) setSize(currentSize);

        openModal();
    }

    function setSize(sizeKey) {
        if (!currentProduct || !currentProduct.sizes) return;

        currentSize = sizeKey;

        sizesContainer.querySelectorAll('.button-size').forEach(button => {
            button.classList.toggle(
                'modal__button--active',
                button.dataset.size === sizeKey
            );
        });

        updateTotal();
    }

    function toggleAdditive(index) {
        if (!currentProduct) return;
        if (!Array.isArray(currentProduct.additives)) return;

        if (currentAdditives.has(index)) {
            currentAdditives.delete(index);
        } else {
            currentAdditives.add(index);
        }

        additivesContainer.querySelectorAll('.button-additives').forEach(button => {
            button.classList.toggle(
                'modal__button--active',
                currentAdditives.has(Number(button.dataset.index))
            );
        });

        updateTotal();
    }

    function updateTotal() {
        if (!currentProduct) return;

        let total = parseFloat(currentProduct.price);

        if (currentSize && currentProduct.sizes && currentProduct.sizes[currentSize]) {
            total += parseFloat(currentProduct.sizes[currentSize]["add-price"] || 0);
        }

        if (Array.isArray(currentProduct.additives)) {
            currentAdditives.forEach(index => {
                const add = currentProduct.additives[index];
                if (add) {
                    total += parseFloat(add["add-price"] || 0);
                }
            });
        }
        document.getElementById('modal__total').textContent = total.toFixed(2);
    }

    if (menuSection) {
        menuSection.addEventListener('click', e => {
            const item = e.target.closest('.menu-grid__item');
            if (!item) return;

            const nameEl = item.querySelector('.menu-grid__name');
            const imageEl = item.querySelector('.menu-grid__image');
            if (!nameEl || !imageEl) return;

            modalWin(nameEl.textContent.trim(), imageEl);
        });
    }

    if (buttonClose) {
        buttonClose.addEventListener('click', closeModal);
    }

    if (modalWindow) {
        modalWindow.addEventListener('click', e => {
            if (e.target === modalWindow) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modalWindow.classList.contains('modal--active')) {
            closeModal();
        }
    });

})();