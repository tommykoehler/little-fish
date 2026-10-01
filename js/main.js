// Footer contact form
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const invalid = [...contactForm.elements].filter((el) => el.willValidate && !el.checkValidity());
  contactForm.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));

  if (invalid.length) {
    invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    contactStatus.textContent = 'Please add your email and a message.';
    invalid[0].focus();
    return;
  }

  // TODO: send the form data to a form service (Formspree, Netlify Forms, etc.)
  contactStatus.textContent = "Thanks! We'll be in touch soon.";
  contactForm.reset();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canObserve = 'IntersectionObserver' in window;

// Runs callback once, the first time el is at least `threshold` visible
function onceVisible(el, threshold, callback) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        callback();
        observer.disconnect();
      }
    },
    { threshold }
  );
  observer.observe(el);
}

// Content rises in as it scrolls into view (see _motion.scss)
document.querySelectorAll('[data-reveal]').forEach((el) => {
  const reveal = () => el.classList.add('is-revealed');
  if (canObserve) onceVisible(el, 0.15, reveal);
  else reveal();
});

// About cork: drop in, splash, then bob once the art scrolls into view
const corkArt = document.querySelector('.about__art');

if (corkArt && !reduceMotion && canObserve) {
  corkArt.classList.add('is-ready');
  onceVisible(corkArt, 0.3, () => corkArt.classList.add('is-visible'));
}

// Hero parallax: the photo scrolls slower than the page, the headline slightly faster
const hero = document.querySelector('.hero');

if (hero && !reduceMotion) {
  let ticking = false;

  const update = () => {
    ticking = false;
    const scrolled = Math.min(window.scrollY, hero.offsetHeight);
    hero.style.setProperty('--parallax-photo', `${scrolled * 0.3}px`);
    hero.style.setProperty('--parallax-title', `${scrolled * -0.12}px`);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}
