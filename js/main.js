// Footer contact form
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

const contactButton = contactForm.querySelector('[type="submit"]');

// Sends to Formspree (the form's action) in the background so visitors stay on the page.
// Without JS the form still posts there directly.
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (contactButton.disabled) return;

  const invalid = [...contactForm.elements].filter((el) => el.willValidate && !el.checkValidity());
  contactForm.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));

  if (invalid.length) {
    invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    contactStatus.textContent = 'Please add your email and a message.';
    invalid[0].focus();
    return;
  }

  contactButton.disabled = true;
  contactStatus.textContent = 'Sending…';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Formspree responded ${response.status}`);

    contactStatus.textContent = "Thanks! We'll be in touch soon.";
    contactForm.reset();
  } catch (error) {
    console.error(error);
    contactStatus.textContent = 'Sorry, your message didn’t send. Please try again in a moment.';
  } finally {
    contactButton.disabled = false;
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canObserve = 'IntersectionObserver' in window;

// Smooth, eased wheel/trackpad scrolling (js/vendor/lenis.min.js).
// Touch devices keep native scrolling; reduced-motion visitors get plain scrolling.
let lenis = null;

if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.09 });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

// In-page links (e.g. Contact) glide to their section with Lenis
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.hash);
    if (!lenis || !target) return; // Without Lenis, CSS scroll-behavior handles it

    event.preventDefault();
    lenis.scrollTo(target, { duration: 1.6 });
    history.pushState(null, '', link.hash);

    // Move keyboard focus to the section, as a normal anchor jump would
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// Runs callback once, the first time el is at least `threshold` visible.
// The bottom margin waits until el is a little way up the screen.
function onceVisible(el, threshold, callback) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        callback();
        observer.disconnect();
      }
    },
    { threshold, rootMargin: '0px 0px -8% 0px' }
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

// Footer wave: hold the Figma shape for reduced motion; otherwise only animate while on screen
const footerWave = document.querySelector('.site-footer__wave');

if (footerWave) {
  if (reduceMotion) {
    footerWave.pauseAnimations();
    footerWave.setCurrentTime(0);
  } else if (canObserve) {
    new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) footerWave.unpauseAnimations();
      else footerWave.pauseAnimations();
    }).observe(footerWave);
  }
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
