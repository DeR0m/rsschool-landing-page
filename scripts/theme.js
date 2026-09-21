(function () {
  const root = document.documentElement;
  const lightBtn = document.getElementById('theme-light');
  const darkBtn  = document.getElementById('theme-dark');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  lightBtn.addEventListener('click', () => setTheme('light'));

  darkBtn.addEventListener('click', () => setTheme('dark'));
})();