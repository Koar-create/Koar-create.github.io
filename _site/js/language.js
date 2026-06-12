var LANG_FADE_OUT_MS = 180;
var SESSION_KEY = 'justSwitchedLang';

/* English path → Chinese path (from _config.yml navigation + built *_cn.html permalinks) */
var PAGE_MAP = {
    '/': '/index_cn.html',
    '/index.html': '/index_cn.html',
    '/research': '/research_cn.html',
    '/research.html': '/research_cn.html',
    '/education': '/education_cn.html',
    '/education.html': '/education_cn.html',
    '/rbm_recruit': '/rbm_recruit_cn.html',
    '/rbm_recruit.html': '/rbm_recruit_cn.html'
};

var PAGE_MAP_REVERSE = {};
Object.keys(PAGE_MAP).forEach(function (en) {
    PAGE_MAP_REVERSE[PAGE_MAP[en]] = en === '/' ? '/index.html' : en;
});

function resolveUrl(pathname, targetLang) {
    var p = pathname.replace(/\/$/, '') || '/';
    if (targetLang === 'cn') {
        if (PAGE_MAP[p]) return PAGE_MAP[p];
        if (PAGE_MAP[p + '.html']) return PAGE_MAP[p + '.html'];
        return null;
    }
    return PAGE_MAP_REVERSE[p] || null;
}

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
        const newPath = (baseName === 'index') ? '/index_cn.html' : `/${baseName}_cn.html`;
        window.location.replace(newPath);
    } else if (preferredLang === 'en' && currentIsCn) {
        const newPath = (baseName === 'index') ? '/' : `/${baseName}.html`;
        window.location.replace(newPath);
    }

    updateToggleButton(preferredLang);
    window.setTimeout(function () {
        updateNavLinks(preferredLang);
    }, 0);
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

// Fallback: rewrite nav hrefs for "Open in new tab" / copy link (primary clicks use interceptor when lang is cn)
function updateNavLinks(lang) {
    document.querySelectorAll('nav a:not(#lang-toggle):not(#theme-toggle)').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href || href.indexOf('javascript:') === 0) return;
        var url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (err) {
            return;
        }
        if (url.origin !== window.location.origin) return;

        if (lang === 'cn') {
            var cnPath = resolveUrl(url.pathname, 'cn');
            if (cnPath) {
                link.setAttribute('href', cnPath + url.search + url.hash);
            }
        } else if (url.pathname.indexOf('_cn') !== -1) {
            var enPath = resolveUrl(url.pathname, 'en');
            if (enPath) {
                link.setAttribute('href', enPath + url.search + url.hash);
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

    var preferredNav = localStorage.getItem('preferredLang') || 'en';
    updateNavLinks(preferredNav);

    var nav = document.querySelector('header nav') ||
        document.querySelector('nav') ||
        document.querySelector('.site-nav');
    if (nav) {
        nav.addEventListener('click', function (e) {
            var link = e.target.closest('a');
            if (!link || !nav.contains(link)) return;

            if (link.id === 'lang-toggle' ||
                link.id === 'theme-toggle' ||
                link.classList.contains('lang-toggle') ||
                link.classList.contains('theme-toggle')) {
                return;
            }

            if (link.hostname !== window.location.hostname) return;

            var preferredLang = localStorage.getItem('preferredLang') || 'en';
            if (preferredLang !== 'cn') return;

            var targetPath = link.pathname;
            var cnUrl = resolveUrl(targetPath, 'cn');

            if (cnUrl && cnUrl !== window.location.pathname) {
                e.preventDefault();
                var dest = cnUrl + link.search + link.hash;
                if (typeof navigateWithLangFade === 'function') {
                    navigateWithLangFade(dest);
                } else {
                    window.location.href = dest;
                }
            }
        });
    }
});
