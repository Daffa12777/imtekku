import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AUTO_REVEAL_SELECTORS = [
    '.fade-in',
    '.fade-in-delay',
    '.fade-in-delay-2',
    '.fade-in-delay-3',
    'section',
    '.hero-content > *',
    '.header-content > *',
    '.section-header > *',
    'section > .container > *',
    '.program-card',
    '.vm-card',
    '.stat-item',
    '.team-card',
    '.member-card',
    '.gallery-item',
    '.gallery-card',
    '.benefit-item',
    '.timeline-info',
    '.registration-form-container',
    '.form-group',
    '.faq-item',
    '.management-card',
    '.stat-card',
    '.member-admin-item',
    '.control-bar',
    '.table-container',
    '.tab-btn',
    'tbody tr',
    '.divisi-info > *',
    '.divisi-team > *',
    '.feature-item',
    '.footer-col',
    '.footer-bottom',
    '.cta-shell',
    '.cta-action',
    '[data-animate]'
].join(', ');

export default function ScrollReveal() {
    const location = useLocation();

    useEffect(() => {
        let revealSequence = 0;
        
        const applyRevealSequence = (element) => {
            if (element.classList.contains('is-visible')) {
                return;
            }
            let delayMs = 0;

            if (element.classList.contains('fade-in')) delayMs = 0;
            else if (element.classList.contains('fade-in-delay')) delayMs = 120;
            else if (element.classList.contains('fade-in-delay-2')) delayMs = 220;
            else if (element.classList.contains('fade-in-delay-3')) delayMs = 320;
            else {
                revealSequence += 1;
                delayMs = revealSequence * 60;
                
                if (delayMs > 600) {
                    delayMs = 600;
                }
            }

            if (delayMs > 0) {
                element.style.transitionDelay = `${delayMs}ms`;
            }

            requestAnimationFrame(() => {
                element.classList.add('is-visible');
            });
        };

        const observer = new IntersectionObserver((entries) => {
            let newlyVisible = 0;
            
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    newlyVisible += 1;
                    applyRevealSequence(entry.target);
                    observer.unobserve(entry.target);
                }
            });

            if (newlyVisible > 0) {
                setTimeout(() => {
                    revealSequence = 0;
                }, 100);
            }
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -5% 0px'
        });

        // Add a slight delay to allow React to mount the DOM elements
        const timeoutId = setTimeout(() => {
            const items = document.querySelectorAll(AUTO_REVEAL_SELECTORS);
            items.forEach((item) => {
                item.classList.add('reveal-item');
                observer.observe(item);
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [location.pathname]); // Re-run when path changes

    return null;
}
