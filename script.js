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

    /* ---------- Navbar shrink & hide on scroll ---------- */
    const nav = document.querySelector('.glass-nav');
    let lastScroll = 0;
    const scrollHandler = () => {
        const cur = window.scrollY;
        if (cur > 80) nav.classList.add('shrink');
        else nav.classList.remove('shrink');

        if (cur > lastScroll && cur > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = cur;
    };
    window.addEventListener('scroll', scrollHandler);

    /* ---------- Hamburger menu toggle ---------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }

    /* ---------- Reveal on scroll with stagger ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const idx = parseInt(el.dataset.revealIdx, 10) || 0;
                setTimeout(() => el.classList.add('visible'), idx * 100);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach((el, i) => {
        el.dataset.revealIdx = i;
        revealObserver.observe(el);
    });

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
                    const prog = Math.min((now - start) / duration, 1);
                    el.textContent = Math.floor(prog * target);
                    if (prog < 1) requestAnimationFrame(step);
                    else el.textContent = target;
                };
                requestAnimationFrame(step);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.6 });
    statEls.forEach(el => counterObserver.observe(el));

    /* ---------- Gallery Lightbox ---------- */
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&#10094;</button>
            <img class="lightbox-img" src="" alt="">
            <button class="lightbox-next">&#10095;</button>
        `;
        document.body.appendChild(overlay);

        const imgEl = overlay.querySelector('.lightbox-img');
        const closeBtn = overlay.querySelector('.lightbox-close');
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');

        let currentIndex = -1;
        const items = Array.from(gallery.querySelectorAll('img'));

        const openLightbox = idx => {
            currentIndex = idx;
            imgEl.src = items[idx].src;
            overlay.classList.add('open');
        };
        const closeLightbox = () => overlay.classList.remove('open');
        const showPrev = () => {
            if (currentIndex > 0) openLightbox(currentIndex - 1);
        };
        const showNext = () => {
            if (currentIndex < items.length - 1) openLightbox(currentIndex + 1);
        };

        gallery.addEventListener('click', e => {
            const img = e.target.closest('img');
            if (!img) return;
            const idx = items.indexOf(img);
            if (idx !== -1) openLightbox(idx);
        });
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeLightbox();
        });
        document.addEventListener('keydown', e => {
            if (!overlay.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    /* ---------- Booking form validation & success message ---------- */
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Your reservation has been received!';
        successMsg.style.opacity = '0';
        successMsg.style.transition = 'opacity 0.5s';
        bookingForm.parentNode.insertBefore(successMsg, bookingForm.nextSibling);

        bookingForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }
            // Simulate async submit
            setTimeout(() => {
                bookingForm.reset();
                successMsg.style.opacity = '1';
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                }, 3000);
            }, 500);
        });
    }
});