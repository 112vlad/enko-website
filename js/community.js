/* ══════════════════════════════════════
   ENKO — community gallery
══════════════════════════════════════ */

const GALLERY_ITEMS = [
  { src: 'community/bowtie store.png',  caption: 'Bowtie Store',   author: '@enkosol', type: 'ART' },
  { src: 'community/dressing room.png', caption: 'Dressing Room',  author: '@enkosol', type: 'ART' },
  { src: 'community/trailer.mp4',       caption: 'Trailer',        author: '@enkosol', type: 'VIDEO', video: true },
];

/* ── lightbox ── */
const _lb = document.getElementById('gallery-lightbox');
const _lbImg = document.getElementById('lb-img');
const _lbCaption = document.getElementById('lb-caption');
const _lbAuthor = document.getElementById('lb-author');

function openLightbox(item) {
  _lbCaption.textContent = item.caption || '';
  _lbAuthor.textContent = item.author || '';
  if (item.video) {
    _lbImg.style.display = 'none';
    let vid = document.getElementById('lb-video');
    if (!vid) {
      vid = document.createElement('video');
      vid.id = 'lb-video';
      vid.controls = true;
      vid.autoplay = true;
      vid.style.cssText = 'display:block;max-width:100%;max-height:78vh;border:1px solid var(--rule)';
      _lbImg.parentNode.insertBefore(vid, _lbImg);
    }
    vid.src = item.src;
    vid.style.display = 'block';
  } else {
    const vid = document.getElementById('lb-video');
    if (vid) { vid.pause(); vid.style.display = 'none'; }
    _lbImg.src = item.src;
    _lbImg.alt = item.caption || '';
    _lbImg.style.display = 'block';
  }
  _lb.classList.add('lb-on');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  _lb.classList.remove('lb-on');
  document.body.style.overflow = '';
  setTimeout(() => {
    _lbImg.src = '';
    const vid = document.getElementById('lb-video');
    if (vid) { vid.pause(); vid.src = ''; }
  }, 300);
}

_lb?.addEventListener('click', e => {
  if (e.target === _lb || e.target.id === 'lb-close') closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── gallery grid ── */
function buildGallery() {
  const grid = document.getElementById('community-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!GALLERY_ITEMS.length) {
    grid.innerHTML = '<div class="gallery-empty">Content incoming — check back soon.</div>';
    return;
  }

  GALLERY_ITEMS.forEach(item => {
    const el = document.createElement('div');
    el.className = 'gallery-item';

    const media = item.video
      ? `<video src="${item.src}" muted loop playsinline preload="metadata" style="display:block;width:100%;height:auto"></video>`
      : `<img src="${item.src}" alt="${item.caption || ''}" loading="lazy">`;

    el.innerHTML = `
      ${media}
      <div class="gallery-overlay">
        ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ''}
        ${item.author  ? `<div class="gallery-author">${item.author}</div>`  : ''}
      </div>
      ${item.type ? `<div class="gallery-type-tag">${item.type}</div>` : ''}
    `;

    if (item.video) {
      const vid = el.querySelector('video');
      el.addEventListener('mouseenter', () => vid.play());
      el.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    }

    el.addEventListener('click', () => openLightbox(item));
    grid.appendChild(el);
  });
}

buildGallery();
