// Theme switching shared by every page.
// Loaded synchronously in <head> so the saved or system theme is applied before first paint.
(function () {
  var KEY = 'tv-asset-tools-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* storage blocked, theme still applies for this visit */ }
  }
  function current() {
    return root.getAttribute('data-theme') || (media && media.matches ? 'dark' : 'light');
  }
  function paintToggles() {
    var dark = current() === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.innerHTML = '<i class="ph ' + (dark ? 'ph-sun' : 'ph-moon') + '" aria-hidden="true"></i>';
    });
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    paintToggles();
    document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }

  var initial = saved();
  if (initial === 'light' || initial === 'dark') root.setAttribute('data-theme', initial);
  else if (media) root.setAttribute('data-theme', media.matches ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    paintToggles();
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        save(next);
        apply(next);
      });
    });
  });

  // Follow the OS until the user makes an explicit choice.
  if (media && media.addEventListener) {
    media.addEventListener('change', function (e) {
      if (!saved()) apply(e.matches ? 'dark' : 'light');
    });
  }
})();
