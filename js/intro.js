// Интро: при первом заходе сайт открывается выключенным (cOFFnect), посетитель жмёт
// кнопку питания, звучит клик, логотип включается. При следующих заходах на главную
// сайт сразу включён, без анимации.

const root = document.documentElement;
const body = document.body;
const power = document.querySelector('.power');
const skip = document.querySelector('.skip');
const header = document.querySelector('.site-header');

const SEEN_KEY = 'markphone-intro-seen';
const SWITCH_MS = 800;

// Звук: «Mouse 2 Button Fast Click» от aphom000, freesound.org/s/687107, лицензия CC0.
const clickSound = new Audio('assets/sound/click.mp3');
clickSound.preload = 'auto';

// Запасной клик, собранный в браузере, — если mp3 не загрузился.
function playSynthClick() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();

  const tick = (at, volume, freq) => {
    const length = Math.floor(ctx.sampleRate * 0.03);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 6);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(ctx.currentTime + at);
  };

  tick(0, 1.4, 2600);     // нажатие
  tick(0.075, 0.6, 1700); // кнопка возвращается
}

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(playSynthClick);
}

function turnOn() {
  body.classList.remove('is-off', 'is-switching');
  body.classList.add('is-on');
  header.removeAttribute('aria-hidden');
  try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* приватный режим */ }
}

function switchOn() {
  if (!body.classList.contains('is-off')) return;
  playClick();
  body.classList.remove('is-off');
  // powering-on — включили кнопкой: всё остальное плавно проявляется одновременно
  body.classList.add('is-switching', 'powering-on');
  setTimeout(turnOn, SWITCH_MS);
}

power.addEventListener('click', switchOn);
skip.addEventListener('click', turnOn);

// Шапка получает фон, когда страницу прокрутили ниже первого экрана
addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', scrollY > 40);
}, { passive: true });

// Уже видел интро (решено в <head>) — сразу включённый сайт.
// Для проверки интро заново: добавь к адресу ?intro
if (root.classList.contains('intro-seen')) turnOn();
