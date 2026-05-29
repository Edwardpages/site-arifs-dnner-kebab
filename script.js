// script.js – all features in vanilla JS

document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1. Reveal on scroll (staggered) ----------
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = parseInt(entry.target.dataset.idx, 10) || 0;
                    setTimeout(() => entry.target.classList.add('visible'), idx * 100);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el, i) => {
            el.dataset.idx = i;
            revealObserver.observe(el);
        });
    }

    // ---------- 2. Navbar shrink & hide/show on scroll ----------
    const nav = document.querySelector('.sticky-nav');
    if (nav) {
        let lastY = window.scrollY;
        const onScroll = () => {
            const curY = window.scrollY;

            // shrink after 80px
            if (curY > 80) nav.classList.add('shrink');
            else nav.classList.remove('shrink');

            // hide on scroll down, show on scroll up
            if (curY > lastY && curY > 80) nav.classList.add('hidden');
            else nav.classList.remove('hidden');

            lastY = curY;
        };
        window.addEventListener('scroll', onScroll);
    }

    // ---------- 3. Hamburger menu toggle ----------
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        const navMenu = document.querySelector('.nav-menu');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            if (navMenu) navMenu.classList.toggle('open');
        });
    }

    // ---------- 4. Stat counters ----------
    const statEls = document.querySelectorAll('.stat-number');
    if (statEls.length) {
        const statObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10) || 0;
                    const duration = 2000;
                    const start = performance.now();

                    const step = (now) => {
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

        statEls.forEach(el => statObserver.observe(el));
    }

    // ---------- 5. Gallery lightbox ----------
    const galleryImages = document.querySelectorAll('.gallery img');
    if (galleryImages.length) {
        // create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.9);display:flex;align-items:center;
            justify-content:center;opacity:0;visibility:hidden;
            transition:opacity .3s,visibility .3s;z-index:9999;
        `;

        const img = document.createElement('img');
        img.style.maxWidth = '90%';
        img.style.maxHeight = '85%';
        img.style.borderRadius = '8px';
        lightbox.appendChild(img);

        const btnStyle = `
            position:absolute;top:50%;transform:translateY(-50%);
            background:rgba(255,255,255,0.2);border:none;color:#fff;
            font-size:2rem;padding:0.5rem 1rem;cursor:pointer;
        `;

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&#9664;';
        prevBtn.style.cssText = btnStyle + 'left:20px;';
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&#9654;';
        nextBtn.style.cssText = btnStyle + 'right:20px;';
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position:absolute;top:20px;right:20px;
            background:rgba(255,255,255,0.2);border:none;color:#fff;
            font-size:2rem;padding:0.2rem 0.6rem;cursor:pointer;
        `;
        lightbox.appendChild(prevBtn);
        lightbox.appendChild(nextBtn);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        let currentIdx = 0;
        const openLightbox = (idx) => {
            currentIdx = idx;
            img.src = galleryImages[currentIdx].src;
            lightbox.style.visibility = 'visible';
            lightbox.style.opacity = '1';
        };
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightbox.style.visibility = 'hidden';
        };
        const showPrev = () => {
            currentIdx = (currentIdx - 1 + galleryImages.length) % galleryImages.length;
            img.src = galleryImages[currentIdx].src;
        };
        const showNext = () => {
            currentIdx = (currentIdx + 1) % galleryImages.length;
            img.src = galleryImages[currentIdx].src;
        };

        galleryImages.forEach((image, i) => {
            image.style.cursor = 'pointer';
            image.addEventListener('click', () => openLightbox(i));
        });
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.visibility !== 'visible') return;
            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowLeft') showPrev();
            else if (e.key === 'ArrowRight') showNext();
        });
    }

    // ---------- 6. Form validation & success message ----------
    const form = document.querySelector('form');
    if (form) {
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Thank you! Your message has been sent.';
        successMsg.style.cssText = `
            opacity:0;transition:opacity .5s;
            background:#4caf50;color:#fff;padding:1rem;
            border-radius:8px;margin-top:1rem;text-align:center;
        `;
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            const required = form.querySelectorAll('[required]');
            required.forEach(inp => {
                if (!inp.value.trim()) {
                    valid = false;
                    inp.style.border = '2px solid #e74c3c';
                } else {
                    inp.style.border = '';
                }
            });
            if (valid) {
                // simulate async submit
                setTimeout(() => {
                    successMsg.style.opacity = '1';
                    form.reset();
                }, 300);
            }
        });
    }

    // ---------- 7. Smooth scroll for internal links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});