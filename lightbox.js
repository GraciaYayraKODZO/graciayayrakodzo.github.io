// Visionneuse de photos : clic sur une photo = affichage en grand.
// Fermer : bouton ✕, touche Échap ou clic à côté. Flèches ← → : photo précédente / suivante.
(function () {
  var en = document.documentElement.lang === 'en';
  var txt = en
    ? { open: 'Enlarge photo', close: 'Close', prev: 'Previous photo', next: 'Next photo' }
    : { open: 'Agrandir la photo', close: 'Fermer', prev: 'Photo précédente', next: 'Photo suivante' };

  var dlg = document.createElement('dialog');
  dlg.className = 'visionneuse';
  dlg.setAttribute('aria-label', txt.open);
  dlg.innerHTML =
    '<button type="button" class="v-fermer" aria-label="' + txt.close + '">✕</button>' +
    '<button type="button" class="v-prec" aria-label="' + txt.prev + '">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="v-suiv" aria-label="' + txt.next + '">›</button>';
  document.body.appendChild(dlg);

  var grande = dlg.querySelector('img');
  var legende = dlg.querySelector('figcaption');
  var actuelle = 0;

  function photos() {
    // Seulement les photos visibles (la galerie peut être filtrée)
    return Array.prototype.filter.call(
      document.querySelectorAll('.galerie img, .photo-hero img, .cas-hero figure img'),
      function (img) { return img.offsetParent !== null; }
    );
  }

  function afficher(i) {
    var liste = photos();
    if (!liste.length) return;
    actuelle = (i + liste.length) % liste.length;
    var img = liste[actuelle];
    grande.src = img.currentSrc || img.src;
    grande.alt = img.alt;
    var cap = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    legende.innerHTML = cap ? cap.innerHTML : '';
    legende.hidden = !cap;
    var plusieurs = liste.length > 1;
    dlg.querySelector('.v-prec').hidden = !plusieurs;
    dlg.querySelector('.v-suiv').hidden = !plusieurs;
  }

  function ouvrir(img) {
    afficher(photos().indexOf(img));
    dlg.showModal();
  }

  photos().forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', txt.open + ' : ' + img.alt);
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () { ouvrir(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(img); }
    });
  });

  dlg.querySelector('.v-fermer').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.v-prec').addEventListener('click', function () { afficher(actuelle - 1); });
  dlg.querySelector('.v-suiv').addEventListener('click', function () { afficher(actuelle + 1); });
  // Clic sur le fond sombre (en dehors de la photo) = fermer
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') afficher(actuelle - 1);
    if (e.key === 'ArrowRight') afficher(actuelle + 1);
  });
})();
