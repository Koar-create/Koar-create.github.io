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

// On page load, check stored language and redirect if mismatch
window.addEventListener('load', function() {
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

    // Redirect to the corresponding version of the current page
    const baseName = getBasePageName();
    if (newLang === 'cn') {
        const newPath = (baseName === 'index') ? '/index_cn.html' : `/${baseName}_cn.html`;
        window.location.replace(newPath);
    } else {
        const newPath = (baseName === 'index') ? '/' : `/${baseName}.html`;
        window.location.replace(newPath);
    }
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

// Attach the toggle function to your language button
document.addEventListener('DOMContentLoaded', function() {
    const toggleElement = document.getElementById('lang-toggle');
    if (toggleElement) {
        toggleElement.addEventListener('click', toggleLanguage);
    }
});