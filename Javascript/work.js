


//FADE IN ON SCROLL
        const fadeEls = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        }
        });
        }, { threshold: 0.08 });

        fadeEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity .7s ease, transform .7s ease';
        observer.observe(el);
        });

        // REVIEW CAROUSEL
        const track   = document.getElementById('reviewTrack');
        const cards   = Array.from(track.children);
        const dotsEl  = document.getElementById('dots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        let current = 0;

        function visibleCount() {
        return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
        }

        function totalSlides() {
        return cards.length - visibleCount() + 1;
        }

        function buildDots() {
        dotsEl.innerHTML = '';
        for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === current ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
        }
        }

        function goTo(index) {
        current = Math.max(0, Math.min(index, totalSlides() - 1));
        const cardWidth = cards[0].offsetWidth + 24;
        track.style.transform = `translateX(-${current * cardWidth}px)`;
        buildDots();
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));
        window.addEventListener('resize', () => { current = 0; goTo(0); });

        buildDots();


        // MOBILE SWIPE
        let startX = 0;

        track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        });


        //TIMELINE FILL ON SCROLL
        const timelineEl = document.querySelector('.process-steps');
        const fillLine   = document.querySelector('.process-fill');
        const stepNums   = document.querySelectorAll('.step-num');
        function updateTimeline() {
        const tlRect       = timelineEl.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.75;
        const visible      = triggerPoint - tlRect.top;
        const progress     = Math.min(Math.max(visible / timelineEl.offsetHeight, 0), 1);
        fillLine.style.height = (progress * 100) + '%';
        stepNums.forEach(num => {
        const numCentre = num.getBoundingClientRect().top + num.getBoundingClientRect().height / 2;
        if (numCentre <= triggerPoint) {
        num.style.background = '#c94f7c';
        num.style.color      = '#fff';
        } else {
        num.style.background = '#fff';
        num.style.color      = '#c94f7c';
        }
        });
        }
        window.addEventListener('scroll', updateTimeline);
        window.addEventListener('resize', updateTimeline);
        window.addEventListener('load',   updateTimeline);
        var galleryImages = document.querySelectorAll(".masonry-grid img");
        var lightbox = document.getElementById("lightbox");
        var lightboxImg = document.getElementById("lightboxImg");
        var closeBtn = document.getElementById("closeLightbox");
        galleryImages.forEach(function(img) {
        img.addEventListener("click", function() {
        lightbox.style.display = "flex";
        lightboxImg.src = this.src;
        });
        });
        closeBtn.addEventListener("click", function() {
        lightbox.style.display = "none";
        });
        lightbox.addEventListener("click", function(e) {
        if (e.target === lightbox) {
        lightbox.style.display = "none";
        }
        });
