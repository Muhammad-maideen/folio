/**
 * Rynox Portfolio - Interactive JavaScript Engine & GSAP Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Lenis Smooth Scrolling Integration
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false
            });

            // If GSAP is not available, run standalone requestAnimationFrame
            if (typeof gsap === 'undefined') {
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }
        } catch (e) {
            console.warn('Lenis init warning:', e);
        }
    }

    // 2. Preloader Handler
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Refresh ScrollTrigger once DOM layout stabilizes
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                }, 500);
            }, 300);
        };

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }

    // 3. Sticky Navbar & Scroll-to-Top Button
    const navbar = document.querySelector('.navbar');
    const scrollTopBtns = document.querySelectorAll('.scroll-top-btn');
    const floatingScrollBtn = document.querySelector('.floating-scroll-top');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        if (navbar) {
            if (scrollPos > 80) {
                navbar.classList.add('sticked');
            } else {
                navbar.classList.remove('sticked');
            }
        }

        if (floatingScrollBtn) {
            if (scrollPos > 400) {
                floatingScrollBtn.classList.add('active');
            } else {
                floatingScrollBtn.classList.remove('active');
            }
        }
    }, { passive: true });

    scrollTopBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Side Offcanvas Menu Toggle
    const sideDrawer = document.querySelector('.side');
    const sideMenuBtns = document.querySelectorAll('.side-menu a, .side-menu-trigger');
    const closeSideBtns = document.querySelectorAll('.close-side, .side-backdrop-overlay');
    const sideBackdrop = document.querySelector('.side-backdrop-overlay');

    function openSideMenu(e) {
        if (e) e.preventDefault();
        if (sideDrawer) sideDrawer.classList.add('on');
        if (sideBackdrop) sideBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSideMenu(e) {
        if (e) e.preventDefault();
        if (sideDrawer) sideDrawer.classList.remove('on');
        if (sideBackdrop) sideBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    sideMenuBtns.forEach(btn => {
        btn.addEventListener('click', openSideMenu);
    });

    closeSideBtns.forEach(btn => {
        btn.addEventListener('click', closeSideMenu);
    });

    // Close side drawer when clicking internal anchor links
    document.querySelectorAll('.side a[href^="#"], .navbar a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            closeSideMenu();
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    if (lenis) {
                        lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
                    } else {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // Escape key closes modals and side drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSideMenu();
            closeVideoModal();
        }
    });

    // 5. Video Modal Popup
    const videoModal = document.querySelector('.video-modal-backdrop');
    const modalVideo = document.getElementById('modalVideo');
    const videoTriggers = document.querySelectorAll('.popup-youtube, .video-play-trigger');
    const closeVideoBtn = document.querySelector('.video-modal-close');

    function openVideoModal(e) {
        if (e) e.preventDefault();
        if (videoModal && modalVideo) {
            videoModal.classList.add('active');
            modalVideo.currentTime = 0;
            modalVideo.play().catch(() => { });
            document.body.style.overflow = 'hidden';
        }
    }

    function closeVideoModal(e) {
        if (e) e.preventDefault();
        if (videoModal && modalVideo) {
            modalVideo.pause();
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    videoTriggers.forEach(btn => {
        btn.addEventListener('click', openVideoModal);
    });

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // 6. Testimonial Swiper Slider
    function initTestimonialSwiper() {
        if (typeof Swiper !== 'undefined') {
            const carousel = document.querySelector('.testimonial-one-carousel');
            if (carousel) {
                new Swiper(carousel, {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    grabCursor: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 1,
                            spaceBetween: 30,
                        },
                        992: {
                            slidesPerView: 2,
                            spaceBetween: 40,
                        }
                    }
                });
            }
        }
    }
    initTestimonialSwiper();

    // 7. Hero Autoplay Video Reassurance
    const heroVideo = document.querySelector('.banner-style-one-area video');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.play().catch(() => { });
    }

    // 8. Number Counter Animation on Viewport
    const counters = document.querySelectorAll('.count-number, .stat-value');
    if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalVal = parseInt(target.getAttribute('data-count') || target.innerText.replace(/[^0-9]/g, ''));
                    const suffix = target.getAttribute('data-suffix') || target.innerText.replace(/[0-9]/g, '');

                    if (!isNaN(finalVal) && finalVal > 0) {
                        let current = 0;
                        const duration = 1500;
                        const stepTime = 20;
                        const steps = duration / stepTime;
                        const increment = Math.ceil(finalVal / steps);

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= finalVal) {
                                current = finalVal;
                                clearInterval(timer);
                            }
                            target.innerText = current + suffix;
                        }, stepTime);
                    }
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // 9. Interactive 3D Tilt on Cards
    const tiltCards = document.querySelectorAll('.portfolio-style-one, .project-card, .services-style-one-item, .pricing-style-one-item');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // 10. GSAP & ScrollTrigger Animations
    function initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            if (lenis) {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }
        }

        // A. Hero Banner Entrance
        gsap.from('.banner-style-one-area h2', {
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.2
        });

        gsap.from('.banner-style-one-area p, .banner-style-one-area .video-card', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out',
            delay: 0.5
        });

        gsap.from('.banner-style-one-area video', {
            opacity: 0,
            scale: 0.94,
            duration: 1.3,
            ease: 'power2.out',
            delay: 0.6
        });

        // B. Giant "MAIDEEN" Text Scrub Reveal on Scroll
        const rynoxTrigger = document.querySelector('.text-scroll-items');
        const rynoxText = document.querySelector('.text-move-item');
        if (rynoxTrigger && rynoxText && typeof ScrollTrigger !== 'undefined') {
            gsap.timeline({
                scrollTrigger: {
                    trigger: rynoxTrigger,
                    start: 'top 90%',
                    end: 'bottom 20%',
                    scrub: 1.2
                }
            }).fromTo(rynoxText,
                { scale: 0.88, opacity: 0.75 },
                { scale: 1, opacity: 1, ease: 'power1.out' }
            );
        }

        // C. Paragraph Text Reveal Fill on Scroll
        const scrollTexts = document.querySelectorAll('.text-scroll-animation .text');
        if (scrollTexts.length > 0 && typeof ScrollTrigger !== 'undefined') {
            scrollTexts.forEach(txt => {
                gsap.fromTo(txt, 
                    {
                        backgroundSize: '0% 100%, 100% 100%'
                    },
                    {
                        backgroundSize: '100% 100%, 100% 100%',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: txt,
                            start: 'top 88%',
                            end: 'bottom 45%',
                            scrub: 0.8
                        }
                    }
                );
            });
        }

        // D. Split-Text Headings Reveal
        document.querySelectorAll('.split-text').forEach(heading => {
            const text = heading.innerText;
            if (!heading.dataset.splitDone) {
                heading.dataset.splitDone = 'true';
                heading.innerHTML = text.split(' ').map(w =>
                    `<span class="split-word"><span class="split-word-inner">${w}</span></span>`
                ).join(' ');
            }

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.from(heading.querySelectorAll('.split-word-inner'), {
                    y: '100%',
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.03,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 85%',
                        once: true
                    }
                });
            }
        });

        // E. Fade-In Upwards on Scroll (.fade-amin-item)
        document.querySelectorAll('.fade-amin-item').forEach(item => {
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.from(item, {
                    opacity: 0,
                    y: 45,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        once: true
                    }
                });
            }
        });

        // F. Traveling "Latest Work" Title (Smoothly travels down behind cards)
        const projectWrapper = document.querySelector('.title-sticky-wrapper');
        const stickyHeading = document.querySelector('.large-heading.title-sticky');
        if (projectWrapper && stickyHeading && typeof ScrollTrigger !== 'undefined') {
            const mm = gsap.matchMedia();

            // Desktop & Laptop (width >= 992px)
            mm.add("(min-width: 992px)", () => {
                const getMaxTravel = () => {
                    const cardsContainer = projectWrapper.querySelector('.cards-container');
                    const cardsH = cardsContainer ? cardsContainer.offsetHeight : projectWrapper.offsetHeight;
                    const headingH = stickyHeading.offsetHeight;
                    const scrollRange = projectWrapper.offsetHeight - window.innerHeight + 100;
                    const maxAllowed = Math.max(150, (cardsH - headingH) * 0.45);
                    return Math.min(maxAllowed, Math.max(150, scrollRange * 0.36));
                };

                const tween = gsap.to(stickyHeading, {
                    y: () => getMaxTravel(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: projectWrapper,
                        start: "top top+=80",
                        end: "bottom 30%",
                        scrub: 1.2,
                        invalidateOnRefresh: true
                    }
                });

                return () => {
                    tween.kill();
                    gsap.set(stickyHeading, { clearProps: "all" });
                };
            });

            // Tablet & Mobile (width < 992px)
            mm.add("(max-width: 991px)", () => {
                const getMaxTravelMobile = () => {
                    const cardsContainer = projectWrapper.querySelector('.cards-container');
                    const cardsH = cardsContainer ? cardsContainer.offsetHeight : projectWrapper.offsetHeight;
                    return Math.max(100, (cardsH - stickyHeading.offsetHeight) * 0.32);
                };

                const tween = gsap.to(stickyHeading, {
                    y: () => getMaxTravelMobile(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: projectWrapper,
                        start: "top top+=70",
                        end: "bottom 20%",
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });

                return () => {
                    tween.kill();
                    gsap.set(stickyHeading, { clearProps: "all" });
                };
            });
        }

        // G. Services & Project Cards Stagger
        const serviceItems = document.querySelectorAll('.services-style-one-item');
        if (serviceItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
            gsap.from(serviceItems, {
                opacity: 0,
                y: 40,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.services-style-one-items',
                    start: 'top 85%',
                    once: true
                }
            });
        }
    }

// 10. Project Category Filtering
    const filterButtons = document.querySelectorAll('.project-filter-nav .filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length && projectItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectItems.forEach(item => {
                    const cat = item.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        item.classList.remove('filter-hidden');
                        item.style.display = '';
                    } else {
                        item.classList.add('filter-hidden');
                        item.style.display = 'none';
                    }
                });

                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            });
        });
    }

    // 11. Copy Email to Clipboard
    const copyEmailButtons = document.querySelectorAll('.btn-copy-email');
    if (copyEmailButtons.length) {
        copyEmailButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const email = btn.getAttribute('data-email') || 'mohammedmaideen1020@gmail.com';
                const originalHTML = btn.innerHTML;
                const originalTitle = btn.getAttribute('title') || 'Copy email address';

                const hasIcon = originalHTML.includes('<i');

                const showFeedback = (success) => {
                    if (success) {
                        btn.classList.add('copied');
                        btn.setAttribute('title', 'Copied to clipboard!');
                        const textSpan = btn.querySelector('.btn-copy-text');
                        if (textSpan) {
                            btn.innerHTML = hasIcon
                                ? '<i class="fa-solid fa-check"></i> <span class="btn-copy-text">Copied!</span>'
                                : '<span class="btn-copy-text">Copied!</span>';
                        } else {
                            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                        }
                    } else {
                        btn.setAttribute('title', 'Failed to copy');
                        const textSpan = btn.querySelector('.btn-copy-text');
                        if (textSpan) {
                            btn.innerHTML = hasIcon
                                ? '<i class="fa-solid fa-triangle-exclamation"></i> <span class="btn-copy-text">Failed</span>'
                                : '<span class="btn-copy-text">Failed</span>';
                        } else {
                            btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
                        }
                    }

                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.setAttribute('title', originalTitle);
                        btn.innerHTML = originalHTML;
                    }, 2200);
                };

                // Try modern Clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                    try {
                        await navigator.clipboard.writeText(email);
                        showFeedback(true);
                        return;
                    } catch (err) {
                        console.warn('Clipboard writeText failed, attempting execCommand fallback:', err);
                    }
                }

                // Fallback for non-secure contexts (file:// or plain HTTP)
                try {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = email;
                    tempInput.style.position = 'fixed';
                    tempInput.style.left = '-9999px';
                    tempInput.style.top = '0';
                    tempInput.setAttribute('readonly', '');
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    showFeedback(successful);
                } catch (err) {
                    console.error('Copy fallback error:', err);
                    showFeedback(false);
                }
            });
        });
    }

    // Initialize GSAP
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    } else {
        // Fallback waiting for GSAP scripts
        window.addEventListener('load', initGSAPAnimations);
    }

    // Refresh ScrollTrigger once all fonts, images, and resources are fully rendered
    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });
});
