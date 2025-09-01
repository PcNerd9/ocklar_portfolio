  /* ====== Typing Animation ====== */
    const typingEl = document.getElementById('typing');
    const titles = ['PRO & Music Promoter ✨','PR Strategist','Event Curator','Brand Builder'];
    let ti=0, ci=0;
    (function type(){
      const text = titles[ti];
      typingEl.innerText = text.slice(0, ci);
      ci++;
      if(ci>text.length){
        setTimeout(()=>{ci=0;ti=(ti+1)%titles.length;type()},1500);
      } else setTimeout(type,80);
    })();

    /* ====== Photo stack slider ====== */
    const photos = document.querySelectorAll('.photo-stack .photo');
    const dotsWrap = document.getElementById('photoDots');
    let pIndex=0;
    photos.forEach((p,i)=>{
      const dot=document.createElement('div');dot.className='dot'+(i===0?' active':'');dotsWrap.appendChild(dot);
    });
    function showPhoto(i){photos.forEach((p,idx)=>{p.style.opacity= idx===i?1:0.00;p.style.transform = idx===i? 'translateY(0) rotate(0deg) scale(1)':'translateY(20px) rotate(-6deg) scale(.92)';});
      [...dotsWrap.children].forEach((d,idx)=>d.classList.toggle('active',idx===i));
    }
    showPhoto(0);
    setInterval(()=>{pIndex=(pIndex+1)%photos.length;showPhoto(pIndex);},3500);


    (async function() {
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
  slider.addEventListener('mouseleave',  () => isPaused = false);
  slider.addEventListener('focusin',     () => isPaused = true);
  slider.addEventListener('focusout',    () => isPaused = false);

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
    let sgPos=0;
    setInterval(()=>{sgPos=(sgPos+1)%500;strengthGrid.scrollLeft = (Math.sin(sgPos/80)+1)*60;},120);

    /* ====== Portfolio stacking interaction ====== */
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.pcard.fade-card'));

  // Fade-in reveal with stagger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const idx = cards.indexOf(el);
        const delay = Math.min(600, idx * 120);
        setTimeout(() => el.classList.add('show'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  cards.forEach(c => observer.observe(c));

  // 3D tilt interaction
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    cards.forEach(card => {
      let rect = null;
      const intensity = 12;
      const intensityX = 10;

      function handleMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        const clientX = (e.touches?.[0]?.clientX ?? e.clientX);
        const clientY = (e.touches?.[0]?.clientY ?? e.clientY);
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        const cx = px - 0.5;
        const cy = py - 0.5;
        const ry = cx * intensity;
        const rx = -cy * intensityX;
        card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--scale', '1.03');
        card.style.setProperty('--elevation', '24px');
      }

      function handleLeave() {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--scale', '1');
        card.style.setProperty('--elevation', '8px');
      }

      card.addEventListener('mousemove', handleMove, { passive: true });
      card.addEventListener('mouseleave', handleLeave);

      card.addEventListener('touchmove', handleMove, { passive: true });
      card.addEventListener('touchend', handleLeave);

      card.addEventListener('focus', () => {
        card.style.setProperty('--scale', '1.03');
        card.style.setProperty('--elevation', '24px');
      });
      card.addEventListener('blur', handleLeave);
    });
  } else {
    cards.forEach(c => {
      c.classList.add('show');
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    });
  }
});


    /* ====== Promotions ====== */

(async function() {
  const slider = document.getElementById('promotionsScroll');
  const track = document.getElementById('promotionsTrack');
  if (!slider || !track) return;

  await imagesLoaded(track);

  // Wrap the track in a wrapper for horizontal transform
  const wrapper = document.createElement('div');
  wrapper.className = 'slider-wrapper';
  track.parentNode.insertBefore(wrapper, track);
  wrapper.appendChild(track);

  // Clone track for seamless looping
  const clone = track.cloneNode(true);
  wrapper.appendChild(clone);

  // Variables for animation
  let pos = 0;
  const originalWidth = track.scrollWidth; // width of original track
  let lastTime = null;
  let isPaused = false;
  const speedPxPerSec = 100;

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) return;

  function step(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused) {
      pos += speedPxPerSec * (delta / 1000);
      pos = pos % originalWidth; // seamless infinite
      wrapper.style.transform = `translateX(${-pos}px)`;
    }

    requestAnimationFrame(step);
  }

  // Pause/resume interactions
  slider.addEventListener('mouseenter', () => isPaused = true);
  slider.addEventListener('mouseleave', () => isPaused = false);
  slider.addEventListener('focusin', () => isPaused = true);
  slider.addEventListener('focusout', () => isPaused = false);

  slider.addEventListener('pointerdown', e => {
    isPaused = true;
    slider.setPointerCapture?.(e.pointerId);
  });
  slider.addEventListener('pointerup', e => {
    isPaused = false;
    slider.releasePointerCapture?.(e.pointerId);
  });
  slider.addEventListener('pointercancel', () => { isPaused = false; });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    isPaused = true;
    resizeTimer = setTimeout(() => {
      pos = pos % originalWidth;
      isPaused = false;
    }, 150);
  });

  requestAnimationFrame(step);

  // Helper: wait for images
  function imagesLoaded(container) {
    const imgs = Array.from(container.querySelectorAll('img'));
    const promises = imgs.map(img => img.complete 
      ? Promise.resolve() 
      : new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })
    );
    return Promise.all(promises);
  }
})();



    /* ====== Modal helpers ====== */
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    document.getElementById('modalClose').addEventListener('click', ()=>{modal.style.display='none';history.pushState('',document.title,window.location.pathname+window.location.search)});
    function openModal(html){modalContent.innerHTML = html; modal.style.display='flex'}

    /* ====== Reviews population & slider ====== */
    const reviews = [
      '“Working with Ayomide was a game-changer for my career. His PR strategies got my music in front of the right audience, and the buzz hasn’t stopped since.” — Rising Afrobeats Artist',
      '“Ayomide doesn’t just promote events; he creates an experience. The last show he handled for us sold out and left the crowd asking for more.” — Event Organizer',
      '“Professional, reliable, and innovative — Ayomide knows how to make a brand stand out. His connections in the industry are unmatched.” — Record Label Executive',
      '“I appreciate how Ayomide takes the time to understand an artist’s vision. He helped me build my image and grow my fanbase authentically.” — Independent Artist',
      '“From media coverage to audience engagement, Ayomide handles everything with excellence. He’s the kind of promoter every artist dreams of working with.” — Music Manager',
      '“Ayomide knows how to turn noise into a movement. Every project with him makes waves.” — Club Owner',
      '“Since linking up with Ayomide, my streams have doubled. He pushes your music like it’s his own.” — Upcoming Rapper',
      '“One word: Results. Ayomide delivers every time.” — Music Blogger',
      '“He’s not just a promoter, he’s a connector. The doors he opened for me were priceless.” — Singer-Songwriter',
      '“Ayomide is the bridge between artists and the spotlight. If he’s behind you, people will notice.” — DJ',
      '“His PR game is clean, creative, and consistent. A true professional with passion.” — Media Personality',
      '“What I love most? He makes sure the artist’s brand stays authentic while still blowing up.” — Afropop Artist',
      '“Ayomide is the guy you want on your team if you’re serious about growth in this industry.” — Music Producer',
      '“Every event he promotes feels bigger than life. He brings energy and people follow.” — Entertainment Brand',
      '“From strategy to execution, Ayomide doesn’t miss. He’s the plug.” — Talent Manager'
    ];
    const reviewTrack = document.getElementById('reviewTrack');
    const reviewDots = document.getElementById('reviewDots');
    reviews.forEach((r,i)=>{
      const rc = document.createElement('div'); rc.className='review-card'; rc.innerHTML = `<p>${r}</p>`; reviewTrack.appendChild(rc);
      const d = document.createElement('button'); d.className='dot'; d.addEventListener('click', ()=>goReview(i)); reviewDots.appendChild(d);
    });
    let currentReview=0;
    function showReview(i){
      const width = reviewTrack.children[0].offsetWidth; reviewTrack.style.transform = `translateX(${-i*width}px)`; [...reviewDots.children].forEach((d,idx)=>d.style.background = idx===i? 'var(--accent)':'rgba(255,255,255,0.15)');
    }
    function goReview(i){currentReview=i; showReview(i)}
    window.addEventListener('resize', ()=>showReview(currentReview));
    showReview(0);

    /* simple autoplay for review */
    setInterval(()=>{currentReview=(currentReview+1)%reviews.length;showReview(currentReview);},4200);

    /* ====== Contact handler (mailto fallback) ====== */
    function handleContact(e){
      e.preventDefault(); const f=new FormData(e.target);
      const name=encodeURIComponent(f.get('name'));
      const email=encodeURIComponent(f.get('email'));
      const subject=encodeURIComponent(f.get('subject'));
      const message=encodeURIComponent(f.get('message'));
      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
      window.location.href = `mailto:ayomide@example.com?subject=${subject}&body=${body}`;
      return false;
    }

    /* ====== Read More -> About (hash route) ====== */
    document.getElementById('readMore').addEventListener('click', ()=>{
      history.pushState(null,'About','#about-full'); renderRoute(); window.scrollTo({top:0,behavior:'smooth'});
    });
    document.getElementById('nav-about').addEventListener('click', (e)=>{e.preventDefault(); history.pushState(null,'About','#about-full'); renderRoute();});

    function renderRoute(){
      const h = location.hash;
      if(h === '#about-full' || h === '#about'){
        openModal(`<h2>About — Ayomide Adewunmi (OCKLARPR)</h2><p><strong>Full Biography</strong></p><p>I am a music and management brand student at the University of Ilorin (expected 2026). I am a passionate Public Relations Officer and dynamic music promoter dedicated to building brands, amplifying talent, and creating unforgettable experiences. With a deep love for music and culture, I specialize in connecting artists with the right audiences, crafting impactful publicity strategies, and ensuring every project shines in the spotlight. From managing media relations and brand storytelling to organizing live events and digital campaigns, I thrive on bringing visions to life and driving engagement that lasts. My goal is not just to promote, but to elevate — helping creatives grow their presence while fostering genuine connections with fans and industry stakeholders.</p><div style=\"margin-top:12px;display:flex;gap:8px;justify-content:flex-end\"><a class=\"btn\" href=\"mailto:ayomide@example.com?subject=Interested%20in%20your%20bio\">Contact</a></div>`);
      } else {
        modal.style.display='none';
      }
    }
    window.addEventListener('popstate', renderRoute);

    /* small accessibility for keyboard close */
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') { modal.style.display='none'; history.pushState('',document.title,window.location.pathname+window.location.search) }});

    /* initial route render */
    renderRoute();

  
    /* menu mobile open (very light) */
    document.querySelector('.hamburger').addEventListener('click', ()=>{
      const links = ['#home','#about-full','#services','#portfolio','#contact'];
      const m = links.map(l=>`<a href=\"${l}\">${l.replace('#','')}</a>`).join('<br>'); openModal(`<div style=\"padding:12px;display:flex;flex-direction:column;gap:8px\">${m}</div>`);
    });

    /* Prevent overscroll on small elements */
    document.querySelectorAll('.hscroll').forEach(s=>{s.addEventListener('wheel', e=>{ if(Math.abs(e.deltaX) < 1 && Math.abs(e.deltaY) > 0) { s.scrollLeft += e.deltaY; e.preventDefault();}})});
 