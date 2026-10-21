// Товары каталога. Чтобы поменять цену, модель или добавить телефон — правьте этот файл.
//
// iPhone — РЕАЛЬНЫЕ товары и цены из публикаций @markphone_pmr (16–20.10.2026).
// Это б/у телефоны: у каждого свой объём памяти и состояние аккумулятора.
// Фото — кадры из их роликов (телефон на фоне вывески MARKPHONE), обрезаны над подписью с ценой.
// Цвет не пишем: по видео точно не определить, он виден на фото.
// rub — цена в рублях ПМР, base — в долларах (как в посте), credit — платёж в рассрочку
// на 3, 6 и 12 месяцев (руб. в месяц), post — ссылка на публикацию.
//
// Samsung — в публикациях не было. Одна карточка с «Ценой по запросу», модели уточнить у заказчика.
//
// base: null — на сайте пишется «Цена по запросу».

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'iphone', label: 'iPhone' },
  { id: 'samsung', label: 'Samsung' },
];

// Б/у iPhone из поста: одна конкретная штука в магазине
function usedIphone({ id, name, memory, battery, batteryNote = '', rub, usd, credit, post }) {
  return {
    id,
    category: 'iphone',
    name,
    base: usd,
    rub,
    credit,
    post,
    photo: true,
    img: `assets/phones/${id}.webp`,
    options: [
      { name: 'Память', values: [{ label: memory, add: 0 }] },
    ],
    specs: [
      ['Аккумулятор', battery + '%' + batteryNote],
      ['Гарантия', 'Официальная гарантия магазина'],
      ['Trade-in', 'Можно сдать старый телефон в зачёт'],
      ['Доставка', 'По всему Приднестровью'],
    ],
  };
}

const PRODUCTS = [
  usedIphone({
    id: 'iphone-17-pro-max-256', name: 'iPhone 17 Pro Max', memory: '256 ГБ', battery: 100,
    rub: 22770, usd: 1380, credit: [8349, 4364, 2372],
    post: 'https://www.instagram.com/markphone_pmr/reel/Del5eWctc05/',
  }),
  usedIphone({
    id: 'iphone-17-256', name: 'iPhone 17', memory: '256 ГБ', battery: 100,
    rub: 15050, usd: 922, credit: [5518, 2885, 1568],
    post: 'https://www.instagram.com/markphone_pmr/reel/DeteBgPtZk2/',
  }),
  usedIphone({
    id: 'iphone-16-pro-max-512', name: 'iPhone 16 Pro Max', memory: '512 ГБ', battery: 90,
    rub: 16350, usd: 1001, credit: [5995, 3134, 1703],
    post: 'https://www.instagram.com/markphone_pmr/reel/Del5f93NER7/',
  }),
  usedIphone({
    id: 'iphone-16-pro-max-256', name: 'iPhone 16 Pro Max', memory: '256 ГБ', battery: 90,
    rub: 15370, usd: 940, credit: [5636, 2945, 1601],
    post: 'https://www.instagram.com/markphone_pmr/reel/Delm3eINkKT/',
  }),
  usedIphone({
    id: 'iphone-15-pro-max-256', name: 'iPhone 15 Pro Max', memory: '256 ГБ', battery: 88,
    rub: 12260, usd: 750, credit: [4496, 2350, 1277],
    post: 'https://www.instagram.com/markphone_pmr/reel/Dejg_eGNNxx/',
  }),
  usedIphone({
    id: 'iphone-15-pro-256', name: 'iPhone 15 Pro', memory: '256 ГБ', battery: 86,
    rub: 11300, usd: 692, credit: [4143, 2166, 1177],
    post: 'https://www.instagram.com/markphone_pmr/reel/DeuN0qBt2lI/',
  }),
  usedIphone({
    id: 'iphone-14-pro-128', name: 'iPhone 14 Pro', memory: '128 ГБ', battery: 86,
    rub: 8175, usd: 501, credit: [2998, 1567, 852],
    post: 'https://www.instagram.com/markphone_pmr/reel/DeuN433N95A/',
  }),
  usedIphone({
    id: 'iphone-13-pro-256', name: 'iPhone 13 Pro', memory: '256 ГБ', battery: 99, batteryNote: ', родной',
    rub: 8150, usd: 499, credit: [2988, 1562, 849],
    post: 'https://www.instagram.com/markphone_pmr/reel/DepCEP7NFhJ/',
  }),
  usedIphone({
    id: 'iphone-12-pro-128', name: 'iPhone 12 Pro', memory: '128 ГБ', battery: 100,
    rub: 4580, usd: 280, credit: [1679, 878, 477],
    post: 'https://www.instagram.com/markphone_pmr/reel/DeteINstZMv/',
  }),

  // ---------- Samsung (в публикациях не было — цена по запросу) ----------
  {
    id: 'galaxy-s25-ultra',
    category: 'samsung',
    name: 'Samsung Galaxy S25 Ultra',
    base: null,
    options: [
      { name: 'Цвет', type: 'color', values: [
        { label: 'Titanium Black', hex: '#2C2C2E', img: 'assets/catalog/s25-black.webp' },
        { label: 'Titanium Gray', hex: '#B9B2A8', img: 'assets/catalog/s25-gray.webp' },
        { label: 'Titanium Silverblue', hex: '#AEB9C8', img: 'assets/catalog/s25-silverblue.webp' },
        { label: 'Titanium Whitesilver', hex: '#E6E6E4', img: 'assets/catalog/s25-whitesilver.webp' },
      ] },
    ],
    specs: [['Экран', '6,9"'], ['Основная камера', '200 МП'], ['Стилус', 'S Pen в комплекте'], ['Наличие', 'Уточняйте в магазине']],
  },
];
