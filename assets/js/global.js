/*
=========================
  GLOBAL JS for Portfolio
=========================
*/

console.log("Global JS is loaded!");

/**
 * $$ — shorthand for document.querySelectorAll()
 * @param {string} selector — CSS selector
 * @param {Element|Document} context — where to query (defaults to document)
 * @returns {Array<Element>}
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
  { url: "cv/", title: "C.V." }
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


// Profile Pane

let lastScrollTop = 0;
const profilePane = document.querySelector('.profile-pane');

window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;

  if (st > lastScrollTop) {
    // scrolling down
    profilePane.style.transform = 'translateX(-100%)';
  } else {
    // scrolling up
    profilePane.style.transform = 'translateX(0)';
  }

  lastScrollTop = st <= 0 ? 0 : st;
});



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

/*
====================
Back to Top Behavior
====================
*/

document.querySelector('.back-to-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/*
=============
Projects Page
=============
*/
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Parse and return the JSON data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  if (projects.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No projects found.';
    emptyMsg.className = 'no-results';
    containerElement.appendChild(emptyMsg);
    return;
  }

  for (const project of projects) {
    const article = document.createElement('article');

    // Image
    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    img.loading = 'lazy';
    img.style.objectFit = 'cover';
    article.appendChild(img);

    // Title
    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;
    article.appendChild(heading);

    // Description
    const description = document.createElement('p');
    description.textContent = project.description;
    article.appendChild(description);

    // Link
    if (project.url && project.url !== '#') {
      const linkWrapper = document.createElement('div');
      linkWrapper.className = 'link-wrapper';

      const link = document.createElement('a');
      link.href = project.url;
      link.textContent = 'View Project';
      link.className = 'project-link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      linkWrapper.appendChild(link);
      article.appendChild(linkWrapper);
    }

    // Year
    const year = document.createElement('p');
    year.className = 'project-year';
    year.textContent = `c. ${project.year}`;
    article.appendChild(year);

    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}