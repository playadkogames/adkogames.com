/* ADKO Games email guard: addresses are not in the page source, so spam bots
   can't scrape them. A visitor clicks "Show email"; when SITEKEY is set, a
   Cloudflare Turnstile check runs first. */
(function () {
  var SITEKEY = '0x4AAAAAAGPRcaEVO5kUU6oG';
  function addr(a) { return atob(a.dataset.u) + '@' + atob(a.dataset.d); }
  function reveal(a) {
    var e = addr(a), s = a.dataset.s ? '?subject=' + encodeURIComponent(a.dataset.s) : '';
    a.href = 'mailto:' + e + s;
    if (a.dataset.show !== 'keep') a.textContent = e;
    a.classList.add('revealed');
  }
  function revealAll(clicked) {
    document.querySelectorAll('a.eml').forEach(reveal);
    if (clicked && clicked.dataset.show === 'keep') location.href = clicked.href;
  }
  function load(cb) {
    if (window.turnstile) return cb();
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.onload = cb; document.head.appendChild(s);
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a.eml');
    if (!a || a.classList.contains('revealed')) return;
    ev.preventDefault();
    if (!SITEKEY) { revealAll(a); return; }
    if (document.querySelector('.eml-check')) return;
    var box = document.createElement('div');
    box.className = 'eml-check';
    box.style.margin = '12px 0';
    (a.closest('.btns') || a).after(box);
    load(function () {
      turnstile.render(box, { sitekey: SITEKEY, theme: 'dark', callback: function () { box.remove(); revealAll(a); } });
    });
  });
})();
