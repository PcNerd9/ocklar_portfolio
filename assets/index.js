
/* ====== Typing Animation ====== */
const typingEl = document.getElementById('typing');
const titles = ['PRO & Music Promoter ✨', 'PR Strategist', 'Event Curator', 'Brand Builder'];
let ti = 0, ci = 0;
(function type() {
  const text = titles[ti];
  typingEl.innerText = text.slice(0, ci);
  ci++;
  if (ci > text.length) {
    setTimeout(() => { ci = 0; ti = (ti + 1) % titles.length; type() }, 1500);
  } else setTimeout(type, 80);
})();

/* ====== Photo stack slider ====== */
const photos = document.querySelectorAll('.photo-stack .photo');
const dotsWrap = document.getElementById('photoDots');
let pIndex = 0;
photos.forEach((p, i) => {
  const dot = document.createElement('div'); dot.className = 'dot' + (i === 0 ? ' active' : ''); dotsWrap.appendChild(dot);
});
function showPhoto(i) {
  photos.forEach((p, idx) => { p.style.opacity = idx === i ? 1 : 0.00; p.style.transform = idx === i ? 'translateY(0) rotate(0deg) scale(1)' : 'translateY(20px) rotate(-6deg) scale(.92)'; });
  [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
}
showPhoto(0);
setInterval(() => { pIndex = (pIndex + 1) % photos.length; showPhoto(pIndex); }, 3500);


(async function () {
  const slider = document.getElementById('servicesSlider');
  const track = document.getElementById('sliderTrack');
  if (!slider || !track) return;

  // Wait until images inside the track load to avoid layout jumps
  await imagesLoaded(track);

  // Duplicate the track content once to create a seamless loop.
  // (If you have very few items you might duplicate more times — adjust as needed)
  track.innerHTML += track.innerHTML;

  // Variables for animation
  let pos = 0; // current translateX in px
  const trackWidth = () => track.scrollWidth / 2; // width of original content
  let lastTime = null;
  let isPaused = false;

  // speed in pixels per second (tweak as needed)
  let speedPxPerSec = 100; // 60px/sec ~ adjust for faster/slower

  // Respect reduced motion preference — if user prefers reduce, don't animate
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) return;

  // Animation step using delta time for smooth consistent speed
  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime; // ms
    lastTime = timestamp;

    if (!isPaused) {
      pos += (speedPxPerSec * (delta / 1000)); // px increments
      const resetAt = trackWidth();
      if (pos >= resetAt) {
        // seamless reset
        pos -= resetAt;
      }
      track.style.transform = `translateX(${-pos}px)`;
    }

    requestAnimationFrame(step);
  }

  // Pause when user hovers, touches, or focuses inside slider
  slider.addEventListener('mouseenter', () => isPaused = true);
  slider.addEventListener('mouseleave', () => isPaused = false);
  slider.addEventListener('focusin', () => isPaused = true);
  slider.addEventListener('focusout', () => isPaused = false);

  // On pointer down (touch/drag) pause so users can interact
  let pointerActive = false;
  slider.addEventListener('pointerdown', (e) => {
    pointerActive = true;
    isPaused = true;
    slider.setPointerCapture(e.pointerId);
  });
  slider.addEventListener('pointerup', (e) => {
    pointerActive = false;
    isPaused = false;
    slider.releasePointerCapture?.(e.pointerId);
  });
  slider.addEventListener('pointercancel', () => { pointerActive = false; isPaused = false; });

  // Recompute on resize — ensures seamlessness after layout change
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    // Pause during resize to avoid jumps
    isPaused = true;
    resizeTimer = setTimeout(() => {
      // reset values to avoid overflow
      pos = pos % trackWidth();
      isPaused = false;
    }, 150);
  });

  // Start animation
  requestAnimationFrame(step);


  // --- helper: wait for all images inside a container to finish loading ---
  function imagesLoaded(container) {
    const imgs = Array.from(container.querySelectorAll('img'));
    const promises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    return Promise.all(promises);
  }
})();

/* ====== Strengths auto horizontal scroll (gentle) ====== */
const strengthGrid = document.getElementById('strengthGrid');
let sgPos = 0;
setInterval(() => { sgPos = (sgPos + 1) % 500; strengthGrid.scrollLeft = (Math.sin(sgPos / 80) + 1) * 60; }, 120);

/* ====== artist stacking interaction ====== */
const cards = Array.from(document.querySelectorAll('.artist-card.stacking'));

// Ensure cards are visible
cards.forEach(card => {
  card.style.opacity = '1';
  card.classList.add('show');
});

// Staggered fade-in animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const idx = cards.indexOf(el);
      setTimeout(() => {
        el.classList.add('show');
        el.style.opacity = '1';
      }, idx * 120);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.2 });
cards.forEach(c => observer.observe(c));

// Stacking animation
cards.forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('active'));
  card.addEventListener('mouseleave', () => card.classList.remove('active'));
  card.addEventListener('focus', () => card.classList.add('active'));
  card.addEventListener('blur', () => card.classList.remove('active'));
});

// Fallback: ensure all cards are visible after a delay
setTimeout(() => {
  cards.forEach(card => {
    card.style.opacity = '1';
    card.classList.add('show');
  });
}, 1000);


/* ====== Promotions ====== */
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.dataset.name; const role = card.dataset.role; const desc = card.dataset.desc;
    openModal(`<h2>${name}</h2><p style="font-weight:700">${role}</p><p>${desc}</p><div style=\"margin-top:12px;display:flex;gap:8px;justify-content:flex-end\"><a class=\"btn\" href=\"mailto:Ocklarpromoter@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(name)}\">Contact about this</a></div>`);
  });
  card.addEventListener('mouseenter', () => card.classList.add('active'));
  card.addEventListener('mouseleave', () => card.classList.remove('active'));
});


/* ====== Modal helpers ====== */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
document.getElementById('modalClose').addEventListener('click', () => { modal.style.display = 'none'; history.pushState('', document.title, window.location.pathname + window.location.search) });
function openModal(html) { modalContent.innerHTML = html; modal.style.display = 'flex' }


/* ====== Contact handler (mailto fallback) ====== */
function handleContact(e) {
  e.preventDefault(); const f = new FormData(e.target);
  const name = encodeURIComponent(f.get('name'));
  const email = encodeURIComponent(f.get('email'));
  const subject = encodeURIComponent(f.get('subject'));
  const message = encodeURIComponent(f.get('message'));
  const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
  window.location.href = `mailto:Ocklarpromoter@gmail.com?subject=${subject}&body=${body}`;
  return false;
}

/* ====== Read More -> About (hash route) ====== */
// document.getElementById('readMore').addEventListener('click', () => {
//   history.pushState(null, 'About', '#about-full'); renderRoute(); window.scrollTo({ top: 0, behavior: 'smooth' });
// });
// document.getElementById('nav-about').addEventListener('click', (e) => { e.preventDefault(); history.pushState(null, 'About', '#about-full'); renderRoute(); });

function renderRoute() {
  const h = location.hash;
  if (h === '#about-full' || h === '#about') {
    openModal(`<h2>About — Ayomide Adewunmi (OCKLARPR)</h2><p><strong>Full Biography</strong></p><p>I am a music and management brand student at the University of Ilorin (expected 2026). I am a passionate Public Relations Officer and dynamic music promoter dedicated to building brands, amplifying talent, and creating unforgettable experiences. With a deep love for music and culture, I specialize in connecting artists with the right audiences, crafting impactful publicity strategies, and ensuring every project shines in the spotlight. From managing media relations and brand storytelling to organizing live events and digital campaigns, I thrive on bringing visions to life and driving engagement that lasts. My goal is not just to promote, but to elevate — helping creatives grow their presence while fostering genuine connections with fans and industry stakeholders.</p><div style=\"margin-top:12px;display:flex;gap:8px;justify-content:flex-end\"><a class=\"btn\" href=\"mailto:Ocklarpromoter@gmail.com?subject=Interested%20in%20your%20bio\">Contact</a></div>`);
  } else {
    modal.style.display = 'none';
  }
}
window.addEventListener('popstate', renderRoute);

/* small accessibility for keyboard close */
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { modal.style.display = 'none'; history.pushState('', document.title, window.location.pathname + window.location.search) } });

/* initial route render */
renderRoute();

/* ====== Mobile nav toggle ====== */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('nav.primary');

/* menu mobile open (very light) */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');

});

navLinks.addEventListener('click', () => {
  navLinks.classList.remove('show');
})
/* Prevent overscroll on small elements */
document.querySelectorAll('.hscroll').forEach(s => { s.addEventListener('wheel', e => { if (Math.abs(e.deltaX) < 1 && Math.abs(e.deltaY) > 0) { s.scrollLeft += e.deltaY; e.preventDefault(); } }) });

/* ====== NEW ANIMATIONS FOR REDESIGNED SECTIONS ====== */

// Intersection Observer for promotion cards
const promotionCards = document.querySelectorAll('.promotion-card');
const promotionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.1 });

promotionCards.forEach(card => {
  promotionObserver.observe(card);
});

// Intersection Observer for portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');
const portfolioObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.1 });

portfolioItems.forEach(item => {
  portfolioObserver.observe(item);
});

// Smooth scroll for navigation links
document.querySelectorAll('nav.primary a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Parallax effect for background elements
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('#promotions::before, #portfolio::before, .reviews::before, footer::before');

  parallaxElements.forEach(element => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Enhanced button hover effects
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px) scale(1.02)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0) scale(1)';
  });
});

// Simple hover effects instead of floating animation
function addHoverEffects() {
  const cards = document.querySelectorAll('.promotion-card, .portfolio-item');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Initialize hover effects after page load
window.addEventListener('load', () => {
  setTimeout(addHoverEffects, 1000);
});

// Handle image loading errors gracefully
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.style.cssText = `
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, rgba(240, 224, 110, 0.2) 0%, rgba(112, 44, 152, 0.2) 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          font-weight: 600;
          font-size: 1.1rem;
        `;
    fallback.textContent = 'Image Loading...';
    this.parentNode.insertBefore(fallback, this);
  });

  // Ensure images are visible after loading
  img.addEventListener('load', function () {
    this.style.opacity = '1';
    this.style.visibility = 'visible';
  });
});

// Force re-render of images after animations complete
setTimeout(() => {
  document.querySelectorAll('.promotion-card img, .portfolio-item img').forEach(img => {
    img.style.opacity = '1';
    img.style.visibility = 'visible';
    img.style.display = 'block';
  });
}, 2000);

// Additional safety check to ensure images stay visible
setInterval(() => {
  document.querySelectorAll('.promotion-card img, .portfolio-item img').forEach(img => {
    if (img.style.opacity === '0' || img.style.visibility === 'hidden' || img.style.display === 'none') {
      img.style.opacity = '1';
      img.style.visibility = 'visible';
      img.style.display = 'block';
    }
  });
}, 3000);

// Portfolio Platform Filtering
const platformFilters = document.querySelectorAll('.platform-filter');
const portfolioEmpty = document.querySelector('.portfolio-empty');
const portfolioGrid = document.querySelector('.portfolio-grid');

platformFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    // Remove active class from all filters
    platformFilters.forEach(f => f.classList.remove('active'));
    // Add active class to clicked filter
    filter.classList.add('active');

    const selectedPlatform = filter.getAttribute('data-platform');

    // Show/hide portfolio items based on platform
    portfolioItems.forEach(item => {
      const itemPlatform = item.getAttribute('data-platform');

      if (selectedPlatform === 'all' || itemPlatform === selectedPlatform) {
        item.classList.remove('hidden');
        item.classList.add('visible');
      } else {
        item.classList.add('hidden');
        item.classList.remove('visible');
      }
    });

    // Show empty state if no items are visible
    const visibleItems = document.querySelectorAll('.portfolio-item.visible');
    if (visibleItems.length === 0) {
      portfolioEmpty.style.display = 'block';
      portfolioGrid.style.display = 'none';
    } else {
      portfolioEmpty.style.display = 'none';
      portfolioGrid.style.display = 'grid';
    }
  });
});

// Animate metrics on scroll
const metricItems = document.querySelectorAll('.metric-item');
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const metricValue = entry.target.querySelector('.metric-value');
      const finalValue = metricValue.textContent;

      // Animate the metric value
      if (finalValue.includes('K') || finalValue.includes('M')) {
        animateMetric(metricValue, finalValue);
      }
    }
  });
}, { threshold: 0.5 });

metricItems.forEach(item => metricObserver.observe(item));

function animateMetric(element, finalValue) {
  const isNumber = /\d/.test(finalValue);
  if (!isNumber) return;

  const number = parseInt(finalValue.replace(/[^\d]/g, ''));
  const suffix = finalValue.replace(/[\d]/g, '');
  let current = 0;
  const increment = number / 30;

  const timer = setInterval(() => {
    current += increment;
    if (current >= number) {
      element.textContent = finalValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 50);
}

// Enhanced hover effects for platform badges
const platformBadges = document.querySelectorAll('.platform-badge');
platformBadges.forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'scale(1.1)';
    badge.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
  });

  badge.addEventListener('mouseleave', () => {
    badge.style.transform = 'scale(1)';
    badge.style.boxShadow = 'none';
  });
});

// Smooth transitions for portfolio items
portfolioItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const badge = item.querySelector('.platform-badge');
    if (badge) {
      badge.style.transform = 'scale(1.05)';
    }
  });

  item.addEventListener('mouseleave', () => {
    const badge = item.querySelector('.platform-badge');
    if (badge) {
      badge.style.transform = 'scale(1)';
    }
  });
});

/* ====== STICKY NOTE REVIEWS CAROUSEL ====== */

// Sticky note reviews carousel functionality
const stickyNotes = document.querySelectorAll('.sticky-note');
const prevBtn = document.getElementById('prevReview');
const nextBtn = document.getElementById('nextReview');
const indicators = document.getElementById('reviewIndicators');

let currentStickyReview = 0;
const totalReviews = stickyNotes.length;

// Create indicators
stickyNotes.forEach((_, index) => {
  const indicator = document.createElement('div');
  indicator.className = 'review-indicator';
  indicator.addEventListener('click', () => goToReview(index));
  indicators.appendChild(indicator);
});

function showReview(index) {
  // Hide all notes
  stickyNotes.forEach(note => {
    note.style.transform = 'translateX(100vw) rotate(-2deg)';
    note.style.display = 'none';
  });

  // Show current note
  stickyNotes[index].style.transform = 'translateX(0) rotate(-2deg)';
  stickyNotes[index].style.display = 'flex';

  // Update indicators
  document.querySelectorAll('.review-indicator').forEach((ind, i) => {
    ind.classList.toggle('active', i === index);
  });

  currentStickyReview = index;
}

function nextReview() {
  const next = (currentStickyReview + 1) % totalReviews;
  showReview(next);
}

function prevReview() {
  const prev = (currentStickyReview - 1 + totalReviews) % totalReviews;
  showReview(prev);
}

function goToReview(index) {
  showReview(index);
}

// Event listeners
if (nextBtn) nextBtn.addEventListener('click', nextReview);
if (prevBtn) prevBtn.addEventListener('click', prevReview);

// Auto-advance every 3 seconds
setInterval(nextReview, 10000);

// Initialize first review
showReview(0);

