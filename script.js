document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Smooth Scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Reveal on Scroll (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const index = Array.from(revealElements).indexOf(el);
        setTimeout(() => el.classList.add('visible'), index * 100);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Navbar Shrink, Blur & Hide on Scroll ---------- */
  const header = document.querySelector('.glass-nav');
  let lastScrollY = window.scrollY;
  const navScrollHandler = () => {
    const curY = window.scrollY;
    // shrink & blur after 80px
    if (curY > 80) header.classList.add('shrink');
    else header.classList.remove('shrink');

    // hide on scroll down, show on scroll up
    if (curY > lastScrollY && curY > 80) header.classList.add('hidden');
    else header.classList.remove('hidden');

    lastScrollY = curY;
  };
  window.addEventListener('scroll', navScrollHandler);

  /* ---------- Hamburger Menu Toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  /* ---------- Stat Counters ---------- */
  const statElements = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.textContent, 10) || 0;
        const duration = 2000;
        let start = null;
        const step = timestamp => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const current = Math.min(Math.floor((progress / duration) * target), target);
          el.textContent = current;
          if (progress < duration) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  statElements.forEach(el => statObserver.observe(el));

  /* ---------- Gallery Lightbox ---------- */
  const galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
  if (galleryImages.length) {
    // create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
      <img class="lightbox-img" src="" alt="">
      <button class="lightbox-next" aria-label="Next">&#10095;</button>
    `;
    document.body.appendChild(lightbox);
    const imgEl = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIdx = 0;

    const openLightbox = idx => {
      currentIdx = idx;
      imgEl.src = galleryImages[currentIdx].src;
      imgEl.alt = galleryImages[currentIdx].alt || '';
      lightbox.classList.add('active');
    };
    const closeLightbox = () => lightbox.classList.remove('active');
    const showPrev = () => {
      currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
      imgEl.src = galleryImages[currentIdx].src;
      imgEl.alt = galleryImages[currentIdx].alt || '';
    };
    const showNext = () => {
      currentIdx = (currentIdx + 1) % galleryImages.length;
      imgEl.src = galleryImages[currentIdx].src;
      imgEl.alt = galleryImages[currentIdx].alt || '';
    };

    galleryImages.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(i));
    });
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    // close on overlay click
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    // keyboard navigation
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ---------- Form Validation & Success Message ---------- */
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.classList.remove('invalid');
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('invalid');
        } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
          valid = false;
          field.classList.add('invalid');
        }
      });
      if (valid) {
        // simulate successful submit
        const success = form.querySelector('.success-message');
        if (success) {
          success.classList.add('fade-in');
          success.style.display = 'block';
        }
        form.reset();
      }
    });
  });
});