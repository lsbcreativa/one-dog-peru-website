/* ONEDOG Perú - Professional JavaScript */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Header Scroll
    const header = document.getElementById('header');
    const handleScroll = () => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = mobileMenu?.querySelector('.mobile-menu-close');
    const mobileNavLinks = mobileMenu?.querySelectorAll('.mobile-nav > a');

    const toggleMenu = (open) => {
        mobileMenu?.classList.toggle('active', open);
        menuToggle?.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuToggle?.addEventListener('click', () => toggleMenu(!mobileMenu?.classList.contains('active')));
    mobileClose?.addEventListener('click', () => toggleMenu(false));
    mobileNavLinks?.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(false);
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = header?.offsetHeight || 80;
                window.scrollTo({
                    top: target.offsetTop - offset - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to Top
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        scrollTopBtn?.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    
    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Counter Animation
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 30);
        });
        animated = true;
    };

    if (counters.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsBar = document.querySelector('.stats-bar');
        if (statsBar) observer.observe(statsBar);
    }

    // Testimonials Carousel
    const testimonialTrack = document.querySelector('.testimonials-track');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (testimonialTrack && testimonialItems.length > 0) {
        let currentIndex = 0;
        let autoPlayInterval;
        let isAutoPlaying = true;

        const updateDots = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const scrollToIndex = (index) => {
            const item = testimonialItems[index];
            if (item) {
                const scrollLeft = item.offsetLeft - (testimonialTrack.offsetWidth - item.offsetWidth) / 2;
                testimonialTrack.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
                updateDots();
            }
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            scrollToIndex(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
            scrollToIndex(currentIndex);
        };

        // Auto-play only on mobile
        const startAutoPlay = () => {
            if (window.innerWidth < 640 && isAutoPlaying) {
                autoPlayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
            }
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };

        // Navigation buttons
        nextBtn?.addEventListener('click', () => {
            stopAutoPlay();
            isAutoPlaying = false;
            nextSlide();
        });

        prevBtn?.addEventListener('click', () => {
            stopAutoPlay();
            isAutoPlaying = false;
            prevSlide();
        });

        // Pause on touch/scroll
        testimonialTrack.addEventListener('touchstart', () => {
            stopAutoPlay();
        }, { passive: true });

        testimonialTrack.addEventListener('touchend', () => {
            if (isAutoPlaying) {
                setTimeout(startAutoPlay, 2000);
            }
        }, { passive: true });

        // Dots click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                isAutoPlaying = false;
                currentIndex = index;
                scrollToIndex(currentIndex);
            });
        });

        // Update current index on manual scroll
        testimonialTrack.addEventListener('scroll', () => {
            const scrollLeft = testimonialTrack.scrollLeft;
            const itemWidth = testimonialItems[0]?.offsetWidth || 0;
            const gap = 24; // var(--space-6)
            const newIndex = Math.round(scrollLeft / (itemWidth + gap));
            currentIndex = Math.max(0, Math.min(newIndex, testimonialItems.length - 1));
            updateDots();
        }, { passive: true });

        // Restart auto-play on resize if needed
        window.addEventListener('resize', () => {
            stopAutoPlay();
            if (window.innerWidth < 640 && isAutoPlaying) {
                startAutoPlay();
            }
        });

        // Start auto-play
        startAutoPlay();

        // Pause when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && isAutoPlaying) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(testimonialTrack);
    }

    // Console Branding
    console.log('%c🐕 ONEDOG Perú', 'font-size:24px;font-weight:bold;color:#f0b90b;');
    console.log('%cProfessional Canine School - Pachacamac e Ica', 'font-size:12px;color:#94a3b8;');
});
