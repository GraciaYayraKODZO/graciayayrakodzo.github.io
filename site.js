/* site.js — menu, filtres, CV, animations, visionneuse */
(function () {
  var en = document.documentElement.lang === 'en';
  var reduMouv = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Menu mobile ──────────────────────────────────── */
  var burger = document.querySelector('.burger');
  var nav    = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert);
      burger.setAttribute('aria-label', ouvert
        ? (en ? 'Close menu' : 'Fermer le menu')
        : (en ? 'Open menu'  : 'Ouvrir le menu'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('ouvert')) {
        nav.classList.remove('ouvert');
        burger.setAttribute('aria-expanded', false);
        burger.setAttribute('aria-label', en ? 'Open menu' : 'Ouvrir le menu');
        burger.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('ouvert') && !nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('ouvert');
        burger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── 2. Bouton Imprimer ──────────────────────────────── */
  var imprimer = document.querySelector('[data-imprimer]');
  if (imprimer) imprimer.addEventListener('click', function () { window.print(); });

  /* ── 3. Filtres (galerie + frise) ───────────────────── */
  document.querySelectorAll('[data-filtres]').forEach(function (groupe) {
    var cible = document.querySelector(groupe.getAttribute('data-filtres'));
    if (!cible) return;
    groupe.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        groupe.querySelectorAll('button').forEach(function (x) {
          x.setAttribute('aria-pressed', x === b);
        });
        cible.querySelectorAll('[data-g]').forEach(function (el) {
          el.hidden = !(f === 'tout' || el.getAttribute('data-g').split(' ').indexOf(f) > -1);
        });
        cible.querySelectorAll('.annee').forEach(function (a) {
          a.hidden = !a.querySelector('[data-g]:not([hidden])');
        });
      });
    });
  });

  /* ── 4. Animations au défilement ────────────────────── */
  if (!reduMouv && typeof IntersectionObserver !== 'undefined') {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      if (!el.closest('.hero')) revealObs.observe(el);
    });

    var staggerObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var items = entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
          items.forEach(function (item, i) {
            setTimeout(function () { item.classList.add('visible'); }, i * 90);
          });
          staggerObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.stagger').forEach(function (el) {
      staggerObs.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── 5. Visionneuse de photos ────────────────────────── */
  function getPhotos() {
    return Array.prototype.slice.call(
      document.querySelectorAll('.galerie img, .cas-hero figure img, .photo-hero img, .prix figure img')
    ).filter(function (img) { return img.offsetParent !== null; });
  }

  if (!getPhotos().length || typeof HTMLDialogElement === 'undefined') return;

  var t = en
    ? { label: 'Photo viewer', close: 'Close', prev: 'Previous photo', next: 'Next photo' }
    : { label: 'Visionneuse de photos', close: 'Fermer', prev: 'Photo précédente', next: 'Photo suivante' };

  var dlg = document.createElement('dialog');
  dlg.className = 'visionneuse';
  dlg.setAttribute('aria-label', t.label);
  dlg.innerHTML =
    '<button type="button" class="v-fermer" aria-label="' + t.close + '">✕</button>' +
    '<button type="button" class="v-prec"   aria-label="' + t.prev  + '">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="v-suiv"   aria-label="' + t.next  + '">›</button>';
  document.body.appendChild(dlg);

  var grande  = dlg.querySelector('img');
  var legende = dlg.querySelector('figcaption');
  var actuelle = 0;

  function afficher(i) {
    var liste = getPhotos();
    actuelle = (i + liste.length) % liste.length;
    var img = liste[actuelle];
    grande.src = img.currentSrc || img.src;
    grande.alt = img.alt;
    var fig = img.closest('figure');
    var cap = fig && fig.querySelector('figcaption');
    legende.textContent = cap ? cap.textContent : '';
    legende.hidden = !cap;
    dlg.querySelector('.v-prec').hidden = dlg.querySelector('.v-suiv').hidden = liste.length < 2;
  }

  getPhotos().forEach(function (img) {
    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (en ? 'Enlarge: ' : 'Agrandir : ') + img.alt);
    function ouvrir() { afficher(getPhotos().indexOf(img)); dlg.showModal(); }
    img.addEventListener('click', ouvrir);
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); }
    });
  });

  dlg.querySelector('.v-fermer').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.v-prec').addEventListener('click',   function () { afficher(actuelle - 1); });
  dlg.querySelector('.v-suiv').addEventListener('click',   function () { afficher(actuelle + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  afficher(actuelle - 1);
    if (e.key === 'ArrowRight') afficher(actuelle + 1);
  });
})();
