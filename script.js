document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Smooth scrolling ---------- */
  document.body.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ---------- Navbar behavior ---------- */
  const nav = document.querySelector('.nav');
  let lastScroll = window.scrollY;
  const navThreshold = 80;
  const navHideClass = 'nav-hide';
  const navShrinkClass = 'nav-shrink';

  const handleNav = () => {
    const curScroll = window.scrollY;
    // shrink & backdrop blur
    if (curScroll > navThreshold) {
      nav.classList.add(navShrinkClass);
    } else {
      nav.classList.remove(navShrinkClass);
    }
    // hide on scroll down, show on scroll up
    if (curScroll > lastScroll && curScroll > navThreshold) {
      nav.classList.add(navHideClass);
    } else {
      nav.classList.remove(navHideClass);
    }
    lastScroll = curScroll <= 0 ? 0 : curScroll;
  };
  window.addEventListener('scroll', handleNav);
  handleNav();

  /* ---------- Hamburger menu toggle ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav nav ul');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  let revealCounter = 0;
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = revealCounter * 100; // 100ms per element
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealCounter++;
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target || +el.textContent;
        const duration = 2000;
        const start = performance.now();

        const step = now => {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => counterObserver.observe(el));

  /* ---------- Gallery Lightbox ---------- */
  const gallery = document.querySelector('.gallery-grid');
  if (gallery) {
    const images = Array.from(gallery.querySelectorAll('img'));
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lb-close">&times;</button>
      <button class="lb-prev">&#10094;</button>
      <img class="lb-img" src="" alt="">
      <button class="lb-next">&#10095;</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lb-img');
    const closeBtn = lightbox.querySelector('.lb-close');
    const prevBtn = lightbox.querySelector('.lb-prev');
    const nextBtn = lightbox.querySelector('.lb-next');

    let curIndex = 0;

    const openLightbox = idx => {
      curIndex = idx;
      lbImg.src = images[curIndex].src;
      lightbox.classList.add('open');
    };
    const closeLightbox = () => lightbox.classList.remove('open');
    const showPrev = () => openLightbox((curIndex - 1 + images.length) % images.length);
    const showNext = () => openLightbox((curIndex + 1) % images.length);

    images.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ---------- Form validation & success message ---------- */
  const form = document.querySelector('.contact form');
  if (form) {
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.textContent = 'Thank you! Your message has been sent.';
    successMsg.style.opacity = '0';
    successMsg.style.transition = 'opacity 0.5s';
    form.parentNode.insertBefore(successMsg, form.nextSibling);

    const showError = (input, msg) => {
      let err = input.parentNode.querySelector('.error-msg');
      if (!err) {
        err = document.createElement('div');
        err.className = 'error-msg';
        err.style.color = 'red';
        err.style.fontSize = '0.9em';
        input.parentNode.appendChild(err);
      }
      err.textContent = msg;
    };
    const clearError = input => {
      const err = input.parentNode.querySelector('.error-msg');
      if (err) err.remove();
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(inp => {
        clearError(inp);
        if (inp.hasAttribute('required') && !inp.value.trim()) {
          valid = false;
          showError(inp, 'This field is required');
        } else if (inp.type === 'email' && inp.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(inp.value)) {
            valid = false;
            showError(inp, 'Enter a valid email address');
          }
        }
      });
      if (valid) {
        // simulate async send
        fetch(form.action || '#', { method: 'POST', body: new FormData(form) })
          .then(() => {
            form.reset();
            successMsg.style.opacity = '1';
            setTimeout(() => (successMsg.style.opacity = '0'), 3000);
          })
          .catch(() => alert('Submission failed. Please try again.'));
      }
    });
  }
});