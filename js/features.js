/**
 * features.js - Phase 4 Additions
 * Includes: Dark Mode Toggle, Reading Progress Bar, Copy BibTeX
 */

(function () {
  'use strict';

  function updateThemeIcon(isDark) {
    var themeToggle = document.getElementById('theme-toggle');
    var icon = themeToggle ? themeToggle.querySelector('i') : null;
    if (!icon) return;
    if (isDark) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  // Theme is already applied by the blocking <head> script.
  // This function only syncs the UI icon and wires the toggle.
  function initThemeToggle() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    updateThemeIcon(isDark);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (nowDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          updateThemeIcon(false);
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          updateThemeIcon(true);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initThemeToggle);

  // 2. Reading Progress Bar
  window.addEventListener('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Only attempt if there's sufficient scrollable height
    if (height > 0) {
      var scrolled = (winScroll / height) * 100;
      var myBar = document.getElementById('myBar');
      if (myBar) {
        myBar.style.width = scrolled + '%';
      }
    }
  });

  // 3. Copy BibTeX Functionality
  // Export to global scope since it's triggered via inline `onclick`
  window.copyBibtex = function(id) {
    var bibtexElement = document.getElementById(id);
    if (!bibtexElement) return;

    var bibtexText = bibtexElement.textContent || bibtexElement.innerText;

    // Fallback for older browsers
    const fallbackCopy = function(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {}
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(bibtexText).catch(function() {
        fallbackCopy(bibtexText);
      });
    } else {
      fallbackCopy(bibtexText);
    }

    // Temporary UX feedback
    var btn = event.currentTarget || event.target;
    var originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--color-brand)';
    btn.style.borderColor = 'var(--color-brand)';

    setTimeout(function() {
      btn.textContent = originalText;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  };

})();
