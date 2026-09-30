(function () {
    const AUTOPLAY_DELAY = 5500;
    const SWIPE_THRESHOLD = 50;

    const slider = document.querySelector('.slider__row');
    if (!slider) return;

    const sliderButtonPrev = document.querySelector('.slider__button--prev');
    const sliderButtonNext = document.querySelector('.slider__button--next');
    const sliders = Array.from(slider.querySelectorAll('.slider__content'));
    const sliderCount = sliders.length;

    const dot = document.querySelector('.slider-control');
    const dots = dot ? Array.from(dot.querySelectorAll('.slider__dot')) : [];

    let sliderIndex = 0;
    let isPaused = false;
    let elapsed = 0;
    let lastTick = 0;
    let rafId = null;
    let isSelecting = false;
    let pointerStartX = null;
    let pointerStartY = null;
    let pointerMoved = false;

    function loop(time) {
        if (isPaused) return;

        if (!lastTick) lastTick = time;
        elapsed += time - lastTick;
        lastTick = time;

        const progress = Math.min(elapsed / AUTOPLAY_DELAY, 1);
        updateDotProgress(progress);

        if (elapsed >= AUTOPLAY_DELAY) {
            elapsed = 0;
            lastTick = 0;
            setSliderNext(true);
        }

        rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
        if (rafId) cancelAnimationFrame(rafId);
        lastTick = 0;
        rafId = requestAnimationFrame(loop);
    }

    function pause() {
        if (isPaused) return;
        isPaused = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;

        document.addEventListener('pointerup', resume, { once: true });
        document.addEventListener('pointercancel', resume, { once: true });
    }

    function resume() {
        if (!isPaused) return;
        if (isSelecting) return;
        isPaused = false;
        lastTick = 0;
        pointerStartX = null;
        pointerStartY = null;
        pointerMoved = false;
        startLoop();
    }

    function resetProgress() {
        elapsed = 0;
        lastTick = 0;
    }

    function updateDotProgress(progress) {
        const activeDot = dots[sliderIndex];
        if (!activeDot) return;
        activeDot.style.setProperty('--dot-progress', progress);
    }

    function setSliderPrev() {
        sliderIndex = (sliderIndex - 1 + sliderCount) % sliderCount;
        resetProgress();
        updateSlider();
    }

    function setSliderNext(auto = false) {
        sliderIndex = (sliderIndex + 1) % sliderCount;
        if (!auto) resetProgress();
        updateSlider();
    }

    function setSlider(dotIndex) {
        sliderIndex = dotIndex;
        resetProgress();
        updateSlider();
    }

    function updateSlider() {
        sliders.forEach((sliderElement, index) => sliderElement.classList.toggle('active', index === sliderIndex));
        dots.forEach((dotElement, index) => {
            dotElement.classList.toggle('slider__dot--active', index === sliderIndex);
            dotElement.style.setProperty('--dot-progress', 0);
        });
        updateDotProgress(0);
    }

    function onPointerDown(e) {
        if (e.target.closest('.slider__button')) return;

        isSelecting = false;

        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        pointerMoved = false;
    }

    function onPointerMove(e) {
        if (pointerMoved) return;
        if (pointerStartX === null || pointerStartY === null) return;

        const dx = e.clientX - pointerStartX;
        const dy = e.clientY - pointerStartY;

        if (Math.abs(dy) > Math.abs(dx)) return;

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
            pointerMoved = true;
            if (dx < 0) setSliderNext();
            else setSliderPrev();
        }
    }

    function onPointerUp() {
        pointerStartX = null;
        pointerStartY = null;
        pointerMoved = false;
    }

    updateSlider();
    startLoop();

    slider.addEventListener('pointerdown', pause);

    slider.addEventListener('pointerdown', onPointerDown);
    slider.addEventListener('pointermove', onPointerMove);
    slider.addEventListener('pointerup', onPointerUp);
    slider.addEventListener('pointercancel', onPointerUp);

    slider.addEventListener('contextmenu', (e) => {
        if (e.target.closest('img')) e.preventDefault();
    });

    document.addEventListener('selectionchange', () => {
        const sel = document.getSelection();
        const hasSelection = sel && !sel.isCollapsed && slider.contains(sel.anchorNode);

        if (hasSelection && !isSelecting) {
            isSelecting = true;
            pause();
        } else if (!hasSelection && isSelecting) {
            isSelecting = false;
            resume();
        }
    });

    sliderButtonPrev?.addEventListener('click', () => setSliderPrev());
    sliderButtonNext?.addEventListener('click', () => setSliderNext());
    dots.forEach((dotElement, dotIndex) => {
        dotElement.addEventListener('click', () => setSlider(dotIndex));
        dotElement.blur();
    });

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (e.repeat) return;
                setSliderPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (e.repeat) return;
                setSliderNext();
                break;
        }
    });
})();