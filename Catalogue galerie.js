/**
 * ÉMÉRAUDE OPTIQUE — Carousel automatique du catalogue
 * Cherche les images directement à la racine du dossier
 */

(function () {

  const PLACEHOLDERS = {
    vue:         'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240"><rect width="480" height="240" fill="%23F5EDE4"/><ellipse cx="140" cy="120" rx="80" ry="55" fill="none" stroke="%231F5C42" stroke-width="8"/><ellipse cx="340" cy="120" rx="80" ry="55" fill="none" stroke="%231F5C42" stroke-width="8"/><line x1="220" y1="120" x2="260" y2="120" stroke="%231F5C42" stroke-width="6"/><line x1="60" y1="105" x2="20" y2="90" stroke="%231F5C42" stroke-width="6"/><line x1="420" y1="105" x2="460" y2="90" stroke="%231F5C42" stroke-width="6"/><text x="240" y="200" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="%231F5C42">Lunettes de vue</text></svg>',
    soleil:      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240"><rect width="480" height="240" fill="%231A1A1A"/><ellipse cx="140" cy="110" rx="80" ry="55" fill="%23111" stroke="%23C8A870" stroke-width="6"/><ellipse cx="340" cy="110" rx="80" ry="55" fill="%23111" stroke="%23C8A870" stroke-width="6"/><line x1="220" y1="110" x2="260" y2="110" stroke="%23C8A870" stroke-width="5"/><text x="240" y="210" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="%23C8A870">Lunettes de soleil</text></svg>',
    lentilles:   'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240"><rect width="480" height="240" fill="%23E8F4F8"/><circle cx="240" cy="115" r="80" fill="none" stroke="%231F5C42" stroke-width="6" stroke-dasharray="8 4"/><circle cx="240" cy="115" r="55" fill="rgba(95,174,74,0.08)" stroke="%235FAE4A" stroke-width="3"/><circle cx="240" cy="115" r="18" fill="rgba(31,92,66,0.15)"/><text x="240" y="210" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="%231F5C42">Lentilles de contact</text></svg>',
    accessoires: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240"><rect width="480" height="240" fill="%23F5F0E8"/><rect x="80" y="85" width="320" height="90" rx="45" fill="%231F5C42"/><rect x="215" y="82" width="50" height="12" rx="6" fill="%23E8B86D"/><text x="240" y="210" text-anchor="middle" font-family="Georgia,serif" font-size="14" fill="%231F5C42">Accessoires</text></svg>',
  };

  const SECTIONS = [
    { id: 'vue',         categorie: 'vue'         },
    { id: 'soleil',      categorie: 'soleil'       },
    { id: 'lentilles',   categorie: 'lentilles'    },
    { id: 'accessoires', categorie: 'accessoires'  },
  ];

  // Extensions à essayer dans l'ordre
  const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'];

  // Créer une image avec fallback sur plusieurs extensions
  function makeImg(nomFichier, alt, placeholder) {
    var img = document.createElement('img');
    img.alt = alt;
    img.style.cssText = 'width:100%;height:170px;object-fit:cover;display:block;';

    // Essayer chaque extension jusqu'à en trouver une qui marche
    var exts = EXTENSIONS.slice();

    function tryNext() {
      if (exts.length === 0) {
        img.src = placeholder;
        return;
      }
      var ext = exts.shift();
      var tentative = nomFichier + ext;
      img.onerror = tryNext;
      img.src = tentative;
    }

    // Si le nom contient déjà une extension connue, essayer directement
    var aDejaExt = EXTENSIONS.some(function(e) {
      return nomFichier.toLowerCase().endsWith(e.toLowerCase());
    });

    if (aDejaExt) {
      img.onerror = function() { img.src = placeholder; };
      img.src = nomFichier;
    } else {
      tryNext();
    }

    return img;
  }

  // Construire un carousel
  function buildCarousel(photos, categorie, produitIndex) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'height:170px;overflow:hidden;position:relative;';
    var placeholder = PLACEHOLDERS[categorie];

    if (!photos || photos.length === 0) {
      var img = document.createElement('img');
      img.src = placeholder;
      img.style.cssText = 'width:100%;height:170px;object-fit:cover;display:block;';
      wrap.appendChild(img);
      return wrap;
    }

    // Créer les slides
    var slides = [];
    photos.forEach(function(nom, i) {
      var slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:' + (i===0?'1':'0') + ';transition:opacity .5s ease;';
      slide.appendChild(makeImg(nom, categorie + ' ' + (i+1), placeholder));
      wrap.appendChild(slide);
      slides.push(slide);
    });

    // Boutons navigation si plusieurs photos
    if (photos.length > 1) {
      var btnStyle = 'position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:#fff;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:16px;z-index:5;display:flex;align-items:center;justify-content:center;line-height:1;';

      var prev = document.createElement('button');
      prev.innerHTML = '&#8249;';
      prev.style.cssText = btnStyle + 'left:6px;';

      var next = document.createElement('button');
      next.innerHTML = '&#8250;';
      next.style.cssText = btnStyle + 'right:6px;';

      var current = [0];

      function goTo(n) {
        slides[current[0]].style.opacity = '0';
        current[0] = (n + slides.length) % slides.length;
        slides[current[0]].style.opacity = '1';
      }

      prev.onclick = function(e) { e.stopPropagation(); goTo(current[0] - 1); };
      next.onclick = function(e) { e.stopPropagation(); goTo(current[0] + 1); };

      wrap.appendChild(prev);
      wrap.appendChild(next);

      // Défilement automatique toutes les 3.5 secondes
      setInterval(function() { goTo(current[0] + 1); }, 3500);
    }

    return wrap;
  }

  function injecterCarousels() {
    if (typeof PHOTOS_CATALOGUE === 'undefined') {
      console.warn('photos.js non chargé');
      return;
    }

    SECTIONS.forEach(function(section) {
      var sectionEl = document.getElementById(section.id);
      if (!sectionEl) return;

      var cartes = sectionEl.querySelectorAll('.carte-produit');
      var photos = PHOTOS_CATALOGUE[section.categorie] || [];

      cartes.forEach(function(carte, idx) {
        var visuel = carte.querySelector('.carte-produit-visuel');
        if (!visuel) return;
        visuel.style.padding = '0';
        visuel.style.overflow = 'hidden';
        visuel.style.position = 'relative';
        visuel.innerHTML = '';

        // Chaque carte affiche TOUTES les photos de la catégorie en carousel
        visuel.appendChild(buildCarousel(photos, section.categorie, idx));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injecterCarousels);
  } else {
    injecterCarousels();
  }

})();