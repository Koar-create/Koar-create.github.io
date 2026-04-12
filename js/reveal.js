/**
 * reveal.js — Staggered scroll-entrance animation driver
 * Phase 2 of academic site modernization.
 *
 * Strategy:
 *  - Select all .reveal-item elements
 *  - Assign staggered --reveal-delay CSS custom properties
 *  - Use IntersectionObserver to add .is-visible when items enter the viewport
 *  - Graceful degradation: if IntersectionObserver is unavailable, show all items immediately
 */

(function () {
  'use strict';

  // Stagger config — keep short for academic sobriety
  var STAGGER_MS = 90;   // delay between consecutive items in same viewport sweep
  var THRESHOLD  = 0.12; // fraction of item height that must be visible to trigger

  var items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  // --- Graceful degradation ---
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  // Track index within each "batch" so stagger resets per scroll event
  var visibleCount = 0;
  var batchTimer   = null;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
        // Assign stagger delay relative to batch position
        var delay = (visibleCount * STAGGER_MS) / 1000;
        entry.target.style.setProperty('--reveal-delay', delay + 's');
        entry.target.classList.add('is-visible');
        visibleCount++;

        // Reset batch counter after a quiet period so next scroll starts fresh
        clearTimeout(batchTimer);
        batchTimer = setTimeout(function () { visibleCount = 0; }, 600);

        // Once visible, no need to keep observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: THRESHOLD,
    rootMargin: '0px 0px -40px 0px' // trigger slightly before item fully enters
  });

  items.forEach(function (el) { observer.observe(el); });
}());
