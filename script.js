'use strict';

// ===== DÉFILEMENT PLEIN ÉCRAN =====
const sections = document.querySelectorAll('.page');
let sectionActive = 0;
let enTransition = false;

function allerSection(index) {
  if (index < 0 || index >= sections.length) return;
  sections[index].scrollIntoView({ behavior: 'smooth' });
  sectionActive = index;
}

// Scroll molette
window.addEventListener('wheel', (e) => {
  if (enTransition) return;
  enTransition = true;
  allerSection(sectionActive + (e.deltaY > 0 ? 1 : -1));
  setTimeout(() => { enTransition = false; }, 900);
}, { passive: true });

// Boutons flèche bas
document.querySelectorAll('.fleche-bas').forEach((btn, i) => {
  btn.addEventListener('click', () => allerSection(i + 1));
});

// Swipe tactile
let touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
});
document.addEventListener('touchend', e => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 50 || enTransition) return;
  enTransition = true;
  allerSection(sectionActive + (diff > 0 ? 1 : -1));
  setTimeout(() => { enTransition = false; }, 900);
});

// ===== CARROUSEL =====
const piste      = document.getElementById('carrousel-piste');
const btnPrev    = document.getElementById('btn-prev');
const btnNext    = document.getElementById('btn-next');
const pointsDiv  = document.getElementById('carrousel-points');

const PHOTOS_PAR_PAGE = 4; // nombre de photos visibles à la fois
let pageCarrousel = 0;

const photos = piste.querySelectorAll('.photo-ongle');
const nbPages = Math.ceil(photos.length / PHOTOS_PAR_PAGE);

// Créer les points de navigation
for (let i = 0; i < nbPages; i++) {
  const pt = document.createElement('button');
  pt.classList.add('carrousel-point');
  pt.setAttribute('aria-label', `Page ${i + 1}`);
  pt.addEventListener('click', () => allerPageCarrousel(i));
  pointsDiv.appendChild(pt);
}

function largeurPhoto() {
  const img = piste.querySelector('.photo-ongle');
  if (!img) return 214;
  return img.offsetWidth + 14; // largeur + gap
}

function allerPageCarrousel(page) {
  pageCarrousel = Math.max(0, Math.min(page, nbPages - 1));
  const offset = pageCarrousel * PHOTOS_PAR_PAGE * largeurPhoto();
  piste.style.transform = `translateX(-${offset}px)`;
  mettreAJourCarrousel();
}

function mettreAJourCarrousel() {
  // Boutons
  btnPrev.disabled = pageCarrousel === 0;
  btnNext.disabled = pageCarrousel >= nbPages - 1;

  // Points
  document.querySelectorAll('.carrousel-point').forEach((pt, i) => {
    pt.classList.toggle('actif', i === pageCarrousel);
  });
}

btnPrev.addEventListener('click', () => allerPageCarrousel(pageCarrousel - 1));
btnNext.addEventListener('click', () => allerPageCarrousel(pageCarrousel + 1));

// Init
mettreAJourCarrousel();

// ===== LIGHTBOX =====
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const fermerBtn   = document.getElementById('lightbox-fermer');

document.querySelectorAll('.photo-ongle').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

fermerBtn.addEventListener('click', fermerLightbox);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) fermerLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fermerLightbox();
  if (e.key === 'ArrowRight') allerPageCarrousel(pageCarrousel + 1);
  if (e.key === 'ArrowLeft')  allerPageCarrousel(pageCarrousel - 1);
});

function fermerLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}