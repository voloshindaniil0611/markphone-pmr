// Каталог: вкладки категорий, сетка товаров и окно товара с выбором цвета,
// памяти и других вариантов. Цена пересчитывается при каждом выборе.
// Ссылка на товар: catalog.html#iphone-15-pro-256

const tabsEl = document.querySelector('.tabs');
const listEl = document.querySelector('.products');
const dialog = document.querySelector('.product');
const header = document.querySelector('.site-header');

const usd = (n) => '$' + n.toLocaleString('en-US').replace(/,/g, ' ');
const rub = (n) => n.toLocaleString('en-US').replace(/,/g, ' ') + ' руб.';
const memoryOf = (p) => p.options.find((o) => o.name === 'Память')?.values[0].label;

const firstImage = (p) => p.img || p.options.find((o) => o.type === 'color')?.values[0].img;
const ON_REQUEST = 'Цена по запросу';

// ---------- Вкладки и сетка ----------
let activeCategory = 'all';

function renderTabs() {
  tabsEl.innerHTML = CATEGORIES
    .filter((c) => c.id === 'all' || PRODUCTS.some((p) => p.category === c.id))
    .map((c) => `<button type="button" data-cat="${c.id}" aria-pressed="${c.id === activeCategory}">${c.label}</button>`)
    .join('');
}

function renderList() {
  const items = PRODUCTS.filter((p) => activeCategory === 'all' || p.category === activeCategory);
  listEl.innerHTML = items.map((p) => {
    const colors = p.options.find((o) => o.type === 'color');
    const dots = colors ? colors.values.map((v) => `<i style="background:${v.hex}"></i>`).join('') : '';
    return `<li>
      <button class="card" type="button" data-id="${p.id}">
        <img class="card__img${p.photo ? ' card__img--photo' : ''}" src="${firstImage(p)}" alt="" loading="lazy">
        <span class="card__name">${p.name}</span>
        ${p.rub ? `<span class="card__meta">${memoryOf(p)} · аккумулятор ${p.specs[0][1].split(',')[0]}</span>` : ''}
        <span class="card__price">${p.base == null ? ON_REQUEST : p.rub ? `<b>${rub(p.rub)}</b> · ${usd(p.base)}` : 'от ' + usd(p.base)}</span>
        ${p.credit ? `<span class="card__credit">или ${rub(p.credit[2])} в месяц</span>` : ''}
        <span class="card__dots">${dots}</span>
      </button>
    </li>`;
  }).join('');
}

tabsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cat]');
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderTabs();
  renderList();
});

listEl.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) location.hash = card.dataset.id;
});

// ---------- Окно товара ----------
let current = null;   // открытый товар
let selected = [];    // индекс выбранного значения в каждой опции

function price() {
  if (current.base == null) return null;
  return current.options.reduce((sum, opt, i) => sum + (opt.values[selected[i]].add || 0), current.base);
}

function renderProduct() {
  const p = current;
  dialog.querySelector('.product__name').textContent = p.name;
  const sum = price();
  dialog.querySelector('.product__price').innerHTML = sum == null
    ? `${ON_REQUEST}<small>позвоните или напишите — подскажем наличие</small>`
    : current.rub
      ? `${rub(current.rub)}<small>${usd(sum)} · рассрочка без первого взноса</small>`
      : `${usd(sum)}<small>цена ориентировочная, уточняйте в магазине</small>`;

  const colorIdx = p.options.findIndex((o) => o.type === 'color');
  const img = (colorIdx >= 0 && p.options[colorIdx].values[selected[colorIdx]].img) || firstImage(p);
  const imgEl = dialog.querySelector('.product__media img');
  imgEl.src = img;
  imgEl.alt = p.name;

  dialog.querySelector('.product__options').innerHTML = p.options.map((opt, i) => {
    const chosen = opt.values[selected[i]];
    const buttons = opt.values.map((v, j) => {
      const pressed = j === selected[i];
      return opt.type === 'color'
        ? `<button class="swatch" type="button" data-opt="${i}" data-val="${j}" aria-pressed="${pressed}" aria-label="${v.label}" title="${v.label}" style="background:${v.hex}"></button>`
        : `<button class="chip" type="button" data-opt="${i}" data-val="${j}" aria-pressed="${pressed}">${v.label}</button>`;
    }).join('');
    return `<div class="option">
      <p class="option__label">${opt.name}: <b>${chosen.label}</b></p>
      <div class="option__values">${buttons}</div>
    </div>`;
  }).join('');

  const credit = p.credit
    ? [['Рассрочка на 3 мес.', rub(p.credit[0]) + ' в месяц'], ['Рассрочка на 6 мес.', rub(p.credit[1]) + ' в месяц'], ['Рассрочка на 12 мес.', rub(p.credit[2]) + ' в месяц']]
    : [];
  dialog.querySelector('.product__media').classList.toggle('product__media--photo', !!p.photo);
  dialog.querySelector('.specs').innerHTML = [...p.specs, ...credit]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('');
}

dialog.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-opt]');
  if (btn) {
    selected[+btn.dataset.opt] = +btn.dataset.val;
    renderProduct();
    return;
  }
  // клик по затемнённому фону вокруг окна закрывает его
  if (e.target === dialog) closeProduct();
});

dialog.querySelector('.product__close').addEventListener('click', closeProduct);
dialog.addEventListener('close', () => {
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
});

function openFromHash() {
  const p = PRODUCTS.find((x) => x.id === location.hash.slice(1));
  if (!p) {
    if (dialog.open) dialog.close();
    return;
  }
  current = p;
  selected = p.options.map(() => 0);
  renderProduct();
  if (!dialog.open) dialog.showModal();
}

function closeProduct() {
  dialog.close();
}

addEventListener('hashchange', openFromHash);

addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', scrollY > 40);
}, { passive: true });

renderTabs();
renderList();
openFromHash();
