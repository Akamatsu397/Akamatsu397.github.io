/**
 * ポートフォリオページ用メインスクリプト
 * スクロールアニメーションとナビゲーション制御を担当
 */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 64; // Height of the app bar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // Screenshot Gallery Scroll
    const galleries = document.querySelectorAll('.screenshot-gallery-wrapper');
    galleries.forEach(wrapper => {
        const gallery = wrapper.querySelector('.screenshot-gallery');
        const prevBtn = wrapper.querySelector('.scroll-btn.prev');
        const nextBtn = wrapper.querySelector('.scroll-btn.next');

        if (gallery && prevBtn && nextBtn) {
            const scrollAmount = gallery.clientWidth * 0.6; // Scroll 60% of visible area
            
            prevBtn.addEventListener('click', () => {
                gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });
});
