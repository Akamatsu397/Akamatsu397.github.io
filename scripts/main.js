/**
 * ポートフォリオページ用メインスクリプト
 * スクロールアニメーションとナビゲーション制御を担当
 */

document.addEventListener('DOMContentLoaded', () => {
    const HEADER_OFFSET = 64; // Height of the app bar

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach((el) => observer.observe(el));

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });
    // Screenshot Gallery Scroll
    const gallery = document.querySelector('.screenshot-gallery');
    const prevBtn = document.querySelector('.scroll-btn.prev');
    const nextBtn = document.querySelector('.scroll-btn.next');

    if (gallery && prevBtn && nextBtn) {
        const scrollAmount = 300; // Adjust based on item width + gap

        prevBtn.addEventListener('click', () => {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        });

        nextBtn.addEventListener('click', () => {
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        });

        // Hide/show buttons based on scroll position (Optional but premium feel)
        const updateButtons = () => {
            const isAtStart = gallery.scrollLeft <= 5;
            const isAtEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 5;

            prevBtn.style.opacity = isAtStart ? '0' : '1';
            prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';

            nextBtn.style.opacity = isAtEnd ? '0' : '1';
            nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        };

        gallery.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons(); // Initial call
    }
});
