/*
=========================
  GLOBAL JS for Portfolio
=========================
*/

console.log("Global JS is loaded!");

/**
 * $$ — shorthand for document.querySelectorAll()
 */
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Determine base path depending on environment
const isDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const BASE = isDev ? "/" : "/portfolio/";

/*
===============
Navigation Menu
===============
*/


// Define navigation links
const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "blog/", title: "Blog" },
  { url: "https://github.com/russluber", title: "GitHub" }
];

// Create and insert nav element
const nav = document.createElement("nav");
document.body.prepend(nav);

// Add links to nav
for (const page of pages) {
  const a = document.createElement("a");
  a.href = page.url.startsWith("http") ? page.url : BASE + page.url;
  a.textContent = page.title;

  // Open external links in new tab
  if (a.host !== location.host) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  // Highlight current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  nav.appendChild(a);
}



/*
================
Dark mode toggle
================
*/

const toggle = document.createElement('button');
toggle.textContent = '🕶';
toggle.setAttribute('aria-label', 'Toggle dark mode');
toggle.id = 'dark-mode-toggle';

// Add the button to the placeholder div
document.getElementById('theme-toggle')?.appendChild(toggle);

// Restore theme preference from localStorage
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    // Use stored preference
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
    }
  } else {
    // No saved preference → check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
    }
  }

toggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
  
    if (isDark) {
      html.removeAttribute('data-theme');
      toggle.textContent = '🕶';
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });
