/**
 * features.js - Phase 4 Additions
 * Includes: Dark Mode Toggle, Reading Progress Bar, Copy BibTeX
 */

(function () {
  'use strict';

  // 1. Theme (Dark Mode) Toggle
  var themeToggle = document.getElementById('theme-toggle');
  var icon = themeToggle ? themeToggle.querySelector('i') : null;
  
  // Apply saved theme on load
  var currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      var targetTheme = 'light';
      
      if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        targetTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
        if(icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      } else {
        document.documentElement.removeAttribute('data-theme');
        if(icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
      localStorage.setItem('theme', targetTheme);
    });
  }

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
