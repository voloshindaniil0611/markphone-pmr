// Баннер о cookies и загрузка карты Google только с согласия посетителя.
// Выбор хранится в localStorage: 'all' — всё разрешено, 'necessary' — только необходимое.
// Подробности для посетителей — на странице cookies.html.

(function () {
  const KEY = 'markphone-cookie-consent';

  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* приватный режим */ } };

  // ---------- Карта ----------
  function loadMap(box) {
    if (box.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = box.dataset.mapSrc;
    frame.title = 'MARKPHONE на карте';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    box.replaceChildren(frame);
    box.classList.add('is-loaded');
  }

  document.querySelectorAll('[data-map-src]').forEach((box) => {
    box.querySelector('.map__load')?.addEventListener('click', () => loadMap(box));
  });

  const loadAllMaps = () => document.querySelectorAll('[data-map-src]').forEach(loadMap);

  // ---------- Баннер ----------
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Настройки cookies');
  banner.innerHTML = `
    <p>Сайт использует локальное хранилище браузера, чтобы запомнить ваши настройки, а карта Google может сохранять свои cookies.
      <a href="cookies.html">Подробнее</a></p>
    <div class="cookie-banner__actions">
      <button class="btn" type="button" data-consent="all">Принять все</button>
      <button class="btn btn--ghost" type="button" data-consent="necessary">Только необходимые</button>
    </div>`;
  document.body.append(banner);

  const show = () => banner.classList.add('is-visible');
  const hide = () => banner.classList.remove('is-visible');

  banner.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-consent]');
    if (!btn) return;
    save(btn.dataset.consent);
    if (btn.dataset.consent === 'all') loadAllMaps();
    hide();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.cookie-settings')) show();
  });

  const choice = read();
  if (choice === 'all') loadAllMaps();
  // На главной ждём, пока посетитель «включит» сайт, чтобы баннер не перекрывал заставку
  if (!choice) {
    if (document.body.classList.contains('is-on')) {
      setTimeout(show, 600);
    } else {
      new MutationObserver((_, obs) => {
        if (document.body.classList.contains('is-on')) { obs.disconnect(); setTimeout(show, 1200); }
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }
})();
