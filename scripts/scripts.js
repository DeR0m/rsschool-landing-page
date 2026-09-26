(function () {
    const AUTOPLAY_DELAY = 5500;

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
        isPaused = true;
        if (isPaused) return;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    function resume() {
        isPaused = false;
        if (isPaused) return;
        lastTick = 0;
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
        dots.forEach((dotElement, index) => dotElement.classList.toggle('slider__dot--active', index === sliderIndex));

        const activeDot = dots[sliderIndex];
        if (activeDot) activeDot.style.setProperty('--dot-progress', 0);
    }

    updateSlider();
    startLoop();

    slider.addEventListener('pointerdown', pause);
    slider.addEventListener('pointerup', resume);
    slider.addEventListener('pointerleave', resume);
    slider.addEventListener('pointercancel', resume);

    sliderButtonPrev?.addEventListener('click', () => setSliderPrev());
    sliderButtonNext?.addEventListener('click', () => setSliderNext());
    dots.forEach((dotElement, dotIndex) => {
        dotElement.addEventListener('click', () => setSlider(dotIndex));
    });
    
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                setSliderPrev();
                break;
            case 'ArrowRight':
                setSliderNext();
            default:
                break;
        }
    });
})();