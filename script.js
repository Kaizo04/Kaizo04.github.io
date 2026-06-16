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

// Boutons flèche
document.querySelectorAll('.fleche-bas').forEach((btn, i) => {
  btn.addEventListener('click', () => allerSection(i + 1));
});

// Swipe tactile (mobile)
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
});

function fermerLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}