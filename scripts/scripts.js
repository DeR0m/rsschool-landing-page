(function () {
    const sliders = document.querySelector('.slider__row');
    const sliderButtonPrev = document.querySelector('.slider__button--prev');
    const sliderButtonNext = document.querySelector('.slider__button--next');
    const slider = Array.from(sliders.querySelectorAll('.slider__content'));
    const sliderCount = slider.length;
    let sliderIndex = 0;

    const dots = document.querySelector('.slider-control');
    const dot = Array.from(dots.querySelectorAll('.slider__dot'));

    function setSliderPrev() {
        sliderIndex = (sliderIndex - 1 + sliderCount) % sliderCount;
        updateSlider();
    }

    function setSliderNext() {
        sliderIndex = (sliderIndex + 1) % sliderCount;
        updateSlider();
    }

    function updateSlider() {
        slider.forEach((element, index) => {
            if (index === sliderIndex) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
        dot.forEach((element, index) => {
            if (index === sliderIndex) {
                element.classList.toggle('slider__dot--active', index == sliderIndex);
            } else {
                element.classList.remove('slider__dot--active', index == sliderIndex);
            }
        });
    }

    updateSlider();

    sliderButtonPrev.addEventListener('click', () => setSliderPrev());
    sliderButtonNext.addEventListener('click', () => setSliderNext());
})();