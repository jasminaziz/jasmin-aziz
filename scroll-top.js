/* ── JASMIN AZIZ — Scroll-to-top button ──────────────────────────
   Requires: #scroll-top-btn in the HTML.
   Shows the button after 300px scroll; hidden on desktop via CSS.
──────────────────────────────────────────────────────────────── */
(function () {
  var btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}());
