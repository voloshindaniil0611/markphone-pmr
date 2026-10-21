// Частицы на фоне всего сайта — по мотивам компонента Particles из Magic UI
// (magicui.design/docs/components/particles), переписано на чистом JS.
// Точки медленно плывут, у краёв затухают и чуть тянутся за курсором.

(function () {
  // Один холст на весь экран, закреплён и лежит позади всех блоков (стили — .particles в style.css)
  const canvas = document.createElement('canvas');
  canvas.className = 'particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  // Если в системе выключены анимации — частицы всё равно плывут, но втрое медленнее
  const SPEED = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.33 : 1;

  const QUANTITY = innerWidth < 760 ? 120 : 260;
  const STATICITY = 30; // чем больше, тем слабее реакция на курсор
  const EASE = 60;
  const COLOR = '232, 212, 160'; // золотистые точки

  const dpr = Math.min(devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  let dots = [];
  const mouse = { x: 0, y: 0 };

  function resize() {
    w = innerWidth;
    h = innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = Array.from({ length: QUANTITY }, makeDot);
  }

  function makeDot() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      tx: 0, ty: 0,                            // смещение от курсора
      size: Math.random() * 2.2 + 0.8,
      alpha: 0,
      maxAlpha: Math.random() * 0.6 + 0.35,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      magnet: 0.1 + Math.random() * 4,
    };
  }

  // Плавное затухание у краёв экрана
  function edgeFade(d) {
    const edge = Math.min(d.x + d.tx, w - d.x - d.tx, d.y + d.ty, h - d.y - d.ty);
    return Math.max(0, Math.min(1, edge / 40));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const fade = edgeFade(d);
      d.alpha = fade < 1 ? d.maxAlpha * fade : Math.min(d.maxAlpha, d.alpha + 0.02);

      d.x += d.dx * SPEED;
      d.y += d.dy * SPEED;
      d.tx += (mouse.x / (STATICITY / d.magnet) - d.tx) / EASE;
      d.ty += (mouse.y / (STATICITY / d.magnet) - d.ty) / EASE;

      ctx.beginPath();
      ctx.arc(d.x + d.tx, d.y + d.ty, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${d.alpha})`;
      ctx.fill();

      // ушла за край — появляется заново в случайном месте
      if (d.x < -10 || d.x > w + 10 || d.y < -10 || d.y > h + 10) dots[i] = makeDot();
    }
    requestAnimationFrame(frame);
  }

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX - w / 2;
    mouse.y = e.clientY - h / 2;
  }, { passive: true });

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  frame();
})();
