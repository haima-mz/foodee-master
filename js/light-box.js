/*
 * Craving Jar - click-to-enlarge popup for pickle photos
 * Any <img class="zoomable"> opens in a popup when clicked.
 * Optional: data-full="path/to/bigger-image.jpg" to show a larger version in the popup.
 * Close with the X button, by clicking outside the photo, or with the Esc key.
 */
(function () {
  'use strict';

  var overlay, imgEl, capEl, closeBtn, lastFocus;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'cj-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Pickle photo');
    overlay.innerHTML =
      '<button type="button" class="cj-lightbox-close" aria-label="Close">&times;</button>' +
      '<figure class="cj-lightbox-figure">' +
        '<img class="cj-lightbox-img" alt="">' +
        '<figcaption class="cj-lightbox-caption"></figcaption>' +
      '</figure>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('.cj-lightbox-img');
    capEl = overlay.querySelector('.cj-lightbox-caption');
    closeBtn = overlay.querySelector('.cj-lightbox-close');

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { close(); }   // click on the dark backdrop
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) { close(); }
    });
  }

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || '';
    capEl.textContent = alt || '';
    lastFocus = document.activeElement;
    overlay.classList.add('is-open');
    document.documentElement.classList.add('cj-lightbox-lock');
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.documentElement.classList.remove('cj-lightbox-lock');
    imgEl.removeAttribute('src');
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    var pics = document.querySelectorAll('img.zoomable');
    Array.prototype.forEach.call(pics, function (pic) {
      pic.setAttribute('tabindex', '0');
      pic.setAttribute('role', 'button');
      pic.addEventListener('click', function () {
        open(pic.getAttribute('data-full') || pic.currentSrc || pic.src, pic.alt);
      });
      pic.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pic.click();
        }
      });
    });
  });
})();
