/* ── JASMIN AZIZ — Shared hamburger nav toggle ──────────────────
   Load at bottom of <body> on every inner page.
   Requires: .site-nav, .nav-toggle, #nav-drawer in the HTML.

   Behaviour:
   - .nav-toggle click → toggles .open on #nav-drawer (max-height anim)
     and .nav-open on .site-nav (bars → × animation)
   - Escape key closes
   - Tapping a drawer link closes
   - Clicking outside nav + drawer closes
──────────────────────────────────────────────────────────────── */
(function () {
  var nav    = document.querySelector('.site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('nav-drawer');

  if (!toggle || !drawer) return;

  function openNav() {
    drawer.classList.add('open');
    nav.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeNav() {
    drawer.classList.remove('open');
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    drawer.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeNav() : openNav();
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeNav();
  });

  /* Close when a drawer link is tapped */
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  /* Close on tap outside nav + drawer */
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !drawer.contains(e.target)) closeNav();
  });
}());
