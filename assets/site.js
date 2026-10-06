/* 曼報 Pro 開放參觀｜深淺色切換
   預設跟隨裝置設定；讀者手動切換後，記住選擇並在換頁時沿用。 */
(function () {
  var KEY = 'mp-theme';
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  var text = btn.querySelector('.theme-text');
  var toDark = btn.getAttribute('data-label-dark') || '深色';
  var toLight = btn.getAttribute('data-label-light') || '淺色';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function current() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return mq && mq.matches ? 'dark' : 'light';
  }

  function render() {
    var dark = current() === 'dark';
    text.textContent = dark ? toLight : toDark;
    btn.setAttribute('aria-label', dark ? '切換為淺色模式' : '切換為深色模式');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#14161a' : '#ffffff');
  }

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    render();
  });

  if (mq) {
    var onChange = function () { if (!saved()) render(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  btn.hidden = false;
  render();
})();

/* 桌機寬螢幕：標示目前讀到的站點 */
(function () {
  var links = document.querySelectorAll('.toc a[data-stop]');
  if (!links.length) return;
  var stops = [];
  for (var i = 0; i < links.length; i++) stops.push(document.getElementById(links[i].getAttribute('data-stop')));
  var pending = false;

  function update() {
    pending = false;
    var line = window.innerHeight * 0.35;
    var cur = 0;
    for (var i = 0; i < stops.length; i++) {
      if (stops[i] && stops[i].getBoundingClientRect().top <= line) cur = i;
    }
    for (var j = 0; j < links.length; j++) {
      if (j === cur) links[j].setAttribute('aria-current', 'step');
      else links[j].removeAttribute('aria-current');
    }
  }

  window.addEventListener('scroll', function () {
    if (!pending) { pending = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
