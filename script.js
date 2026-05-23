/* ─── script.js ─── Dr. Pinnika Syam Yadav Portfolio ─── */

/* ═══════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════ */
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-pct', pct + '%');
}

/* ═══════════════════════════════════════════════════════
   BOOK ICON – Opens when scrolling, closes when idle
═══════════════════════════════════════════════════════ */
const bookWrap = document.querySelector('.book-wrap');
const scrollBookEl = document.getElementById('scroll-book');
let bookTimer = null;
let lastScrollY = 0;

function openBook() {
  bookWrap.classList.add('open');
}
function closeBook() {
  bookWrap.classList.remove('open');
}

window.addEventListener('scroll', () => {
  updateScrollProgress();

  const scrollY = window.scrollY;

  // Show/hide book (hide after 90% scroll)
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollY > docHeight * 0.92) {
    scrollBookEl.classList.add('hidden');
  } else {
    scrollBookEl.classList.remove('hidden');
  }

  // Book opens while scrolling, closes when stopped
  openBook();
  clearTimeout(bookTimer);
  bookTimer = setTimeout(() => {
    closeBook();
  }, 600);

  lastScrollY = scrollY;
}, { passive: true });

/* ═══════════════════════════════════════════════════════
   NAV – Scrolled state
═══════════════════════════════════════════════════════ */
const mainNav = document.getElementById('main-nav');
function updateNav() {
  mainNav.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ═══════════════════════════════════════════════════════
   NAV – Active link highlight on scroll
═══════════════════════════════════════════════════════ */
const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

/* ═══════════════════════════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════════════════════════ */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navTabs.forEach(tab => {
  tab.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ═══════════════════════════════════════════════════════
   REVEAL ON SCROLL (Intersection Observer)
═══════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════
   HERO PARTICLES
═══════════════════════════════════════════════════════ */
(function spawnParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('hero-particle');
    const size = Math.random() * 180 + 40;
    const left = Math.random() * 100;
    const dur = Math.random() * 18 + 10;
    const delay = Math.random() * 12;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -${size}px;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ═══════════════════════════════════════════════════════
   RESEARCH TABS – Click + Hover Toggle
═══════════════════════════════════════════════════════ */
const rtabBtns = document.querySelectorAll('.rtab-btn');
const rtabPanels = document.querySelectorAll('.rtab-panel');

function switchTab(tabId) {
  rtabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
  rtabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
    // Re-trigger reveals in newly active panel
    if (panel.id === tabId) {
      panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 60);
      });
    }
  });
}

rtabBtns.forEach(btn => {
  // Toggle on click
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  // Toggle on cursor hover (mousenter)
  btn.addEventListener('mouseenter', () => switchTab(btn.dataset.tab));
});

/* ═══════════════════════════════════════════════════════
   NAV TABS – Hover toggle already handled via CSS
   Extra: smooth scroll on click
═══════════════════════════════════════════════════════ */
navTabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(tab.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════════════════
   EXPERTISE CARDS – Stagger on reveal
═══════════════════════════════════════════════════════ */
const expertiseCards = document.querySelectorAll('.expertise-card');
const expertiseObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      expertiseObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
expertiseCards.forEach(card => expertiseObserver.observe(card));

/* ═══════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════ */
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('contact-form');
  const btn = form.querySelector('.form-btn');
  const successNote = document.getElementById('form-success');
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-msg').value.trim();
  const source = document.getElementById('cf-source').value || 'lets_connect_platform';

  btn.textContent = 'Sending… ⏳';
  btn.disabled = true;
  successNote.style.display = 'none';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message, source }),
    });

    if (!response.ok) {
      throw new Error('Unable to send message');
    }

    successNote.textContent = '✅ Thank you! Your message has been sent.';
    successNote.style.display = 'block';
    form.reset();
  } catch (error) {
    console.error(error);
    successNote.textContent = '⚠️ Sorry, something went wrong. Please try again later.';
    successNote.style.display = 'block';
  } finally {
    btn.textContent = 'Send Message ✉️';
    btn.disabled = false;
  }
}

/* ═══════════════════════════════════════════════════════
   PUBLICATION ITEMS – Hover micro-animation (ripple)
═══════════════════════════════════════════════════════ */
document.querySelectorAll('.pub-item, .expertise-card, .tl-card').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', x + '%');
    el.style.setProperty('--my', y + '%');
  });
});

/* ═══════════════════════════════════════════════════════
   INITIAL LOAD ANIMATION
═══════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  // Trigger hero reveal immediately
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
  }, 200);

  // Initial scroll check
  updateScrollProgress();
  updateNav();
  highlightNav();
});
