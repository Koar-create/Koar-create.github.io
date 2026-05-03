var LANG_FADE_OUT_MS = 180;
var SESSION_KEY = 'justSwitchedLang';

function applyLangEnteringIfNeeded() {
    try {
        if (!sessionStorage.getItem(SESSION_KEY)) return;
        sessionStorage.removeItem(SESSION_KEY);
        var root = document.documentElement;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        var wrap = document.querySelector('.site-wrapper');
        if (!wrap) return;
        root.classList.add('lang-entering');
        wrap.addEventListener('animationend', function onEnd(ev) {
            if (ev.animationName !== 'pageEnter') return;
            wrap.removeEventListener('animationend', onEnd);
            root.classList.remove('lang-entering');
        });
    } catch (e) {
        /* sessionStorage unavailable */
    }
}

// Function to get the base filename without extension or _cn suffix
function getBasePageName() {
    let path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
        return 'index';  // Handle home page specially
    }
    let filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    return filename.replace('_cn', '');
}

// Function to check if current page is Chinese version
function isChinesePage() {
    return window.location.pathname.includes('_cn');
}

function isChinesePath(pathname) {
    return pathname.indexOf('_cn') !== -1;
}

function navigateWithLangFade(url) {
    try {
        sessionStorage.setItem('justSwitchedLang', '1');
    } catch (e) {
        /* ignore */
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.location.replace(url);
        return;
    }
    document.body.classList.add('lang-fade-out');
    window.setTimeout(function () {
        window.location.replace(url);
    }, LANG_FADE_OUT_MS);
}

// On page load, check stored language and redirect if mismatch
window.addEventListener('load', function () {
    const preferredLang = localStorage.getItem('preferredLang') || 'en'; // Default to 'en'
    const baseName = getBasePageName();
    const currentIsCn = isChinesePage();

    if (preferredLang === 'cn' && !currentIsCn) {
        // Redirect to Chinese version
        const newPath = (baseName === 'index') ? '/index_cn.html' : `/${baseName}_cn.html`;
        window.location.replace(newPath);
    } else if (preferredLang === 'en' && currentIsCn) {
        // Redirect to English version
        const newPath = (baseName === 'index') ? '/' : `/${baseName}.html`;
        window.location.replace(newPath);
    }

    // Update nav links and toggle button
    updateNavLinks(preferredLang);
    updateToggleButton(preferredLang);
});

// Function to toggle language
function toggleLanguage() {
    const currentLang = localStorage.getItem('preferredLang') || 'en';
    const newLang = currentLang === 'en' ? 'cn' : 'en';
    localStorage.setItem('preferredLang', newLang);

    const baseName = getBasePageName();
    let newPath;
    if (newLang === 'cn') {
        newPath = (baseName === 'index') ? '/index_cn.html' : `/${baseName}_cn.html`;
    } else {
        newPath = (baseName === 'index') ? '/' : `/${baseName}.html`;
    }
    navigateWithLangFade(newPath);
}

// Function to update the toggle button's text
function updateToggleButton(lang) {
    const toggleElement = document.getElementById('lang-toggle');
    if (toggleElement) {
        toggleElement.textContent = lang === 'en' ? '中文' : 'English';
    }
}

// Dynamically update all nav links based on preferred lang
function updateNavLinks(lang) {
    const navLinks = document.querySelectorAll('nav a:not(#lang-toggle)'); // Adjust to your nav selector, exclude lang-toggle
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (href && !href.includes('_cn') && href !== 'javascript:void(0);') { // Only modify internal page links
            if (lang === 'cn') {
                if (href === '/' || href === '/index.html') {
                    link.setAttribute('href', '/index_cn.html');
                } else {
                    link.setAttribute('href', href.replace('.html', '_cn.html').replace(/\/$/, '_cn.html'));
                }
            } else {
                link.setAttribute('href', href.replace('_cn.html', '.html'));
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    applyLangEnteringIfNeeded();

    const toggleElement = document.getElementById('lang-toggle');
    if (toggleElement) {
        toggleElement.addEventListener('click', toggleLanguage);
    }

    var headerNav = document.querySelector('header nav');
    if (!headerNav) return;

    headerNav.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a || !headerNav.contains(a)) return;
        if (a.id === 'lang-toggle' || a.id === 'theme-toggle') return;
        var href = a.getAttribute('href');
        if (!href || href.indexOf('javascript:') === 0) return;

        var targetUrl;
        try {
            targetUrl = new URL(a.href, window.location.href);
        } catch (err) {
            return;
        }
        if (targetUrl.origin !== window.location.origin) return;

        var cur = window.location.pathname;
        var next = targetUrl.pathname;
        if (isChinesePath(cur) === isChinesePath(next)) return;

        e.preventDefault();
        navigateWithLangFade(targetUrl.pathname + targetUrl.search + targetUrl.hash);
    });
});
