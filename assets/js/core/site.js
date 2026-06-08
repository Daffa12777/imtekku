(() => {
    const MOBILE_BREAKPOINT = 968;
    const LEGACY_FADE_DELAYS = Object.freeze({
        'fade-in': 0,
        'fade-in-delay': 120,
        'fade-in-delay-2': 220,
        'fade-in-delay-3': 320
    });
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
    let revealSequence = 0;

    function initNavigation() {
        const hamburgerButton = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navbar = document.getElementById('navbar');

        if (hamburgerButton && navMenu) {
            hamburgerButton.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburgerButton.classList.toggle('active');
            });
        }

        document.querySelectorAll('.nav-menu a, .nav-menu button').forEach((link) => {
            link.addEventListener('click', () => {
                const isMobileDropdownToggle =
                    window.innerWidth <= MOBILE_BREAKPOINT &&
                    link.classList.contains('dropbtn');

                if (isMobileDropdownToggle) {
                    return;
                }

                if (navMenu) {
                    navMenu.classList.remove('active');
                }

                if (hamburgerButton) {
                    hamburgerButton.classList.remove('active');
                }
            });
        });

        document.querySelectorAll('.dropdown').forEach((dropdown) => {
            const dropdownToggle = dropdown.querySelector('.dropbtn');
            const dropdownLinks = dropdown.querySelectorAll('.dropdown-content a');

            if (dropdownToggle) {
                dropdownToggle.addEventListener('click', (event) => {
                    if (window.innerWidth > MOBILE_BREAKPOINT) {
                        return;
                    }

                    event.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }

            dropdownLinks.forEach((submenuLink) => {
                submenuLink.addEventListener('click', () => {
                    dropdown.classList.remove('active');
                });
            });
        });

        if (navbar) {
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
        }
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function onAnchorClick(event) {
                const targetSelector = this.getAttribute('href');

                if (targetSelector !== '#' && document.querySelector(targetSelector)) {
                    event.preventDefault();
                    document.querySelector(targetSelector).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function initMenuPageTransitions() {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isReducedMotion) {
            return;
        }

        const transitionDurationMs = 280;
        const currentOrigin = window.location.origin;

        document.querySelectorAll('a[href]').forEach((linkElement) => {
            if (linkElement.dataset.menuTransitionBound === 'true') {
                return;
            }

            linkElement.dataset.menuTransitionBound = 'true';
            linkElement.addEventListener('click', (event) => {
                if (event.defaultPrevented || event.button !== 0) {
                    return;
                }

                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                    return;
                }

                if (
                    linkElement.dataset.careersLocked === 'true' ||
                    linkElement.getAttribute('aria-disabled') === 'true'
                ) {
                    return;
                }

                if (linkElement.target === '_blank' || linkElement.hasAttribute('download')) {
                    return;
                }

                const href = linkElement.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
                    return;
                }

                let targetUrl;
                try {
                    targetUrl = new URL(href, window.location.href);
                } catch (error) {
                    return;
                }

                if (targetUrl.origin !== currentOrigin) {
                    return;
                }

                const samePath = targetUrl.pathname === window.location.pathname;
                const sameSearch = targetUrl.search === window.location.search;
                const hasHashTarget = Boolean(targetUrl.hash);
                if (samePath && sameSearch && hasHashTarget) {
                    return;
                }

                if (samePath && sameSearch && !hasHashTarget) {
                    return;
                }

                event.preventDefault();
                linkElement.classList.add('is-routing');
                document.body.classList.add('page-leave');

                window.setTimeout(() => {
                    window.location.href = targetUrl.href;
                }, transitionDurationMs);
            });
        });
    }

    function animateCounter(counterElement) {
        const targetValue = Number.parseInt(counterElement.getAttribute('data-target'), 10);
        const durationMs = 2000;
        const stepValue = targetValue / (durationMs / 16);
        let currentValue = 0;

        function updateCounter() {
            currentValue += stepValue;

            if (currentValue < targetValue) {
                counterElement.textContent = Math.floor(currentValue);
                requestAnimationFrame(updateCounter);
                return;
            }

            counterElement.textContent = targetValue;
        }

        updateCounter();
    }

    function initCounterAnimation() {
        const statsSection = document.querySelector('.about-section');

        if (!statsSection) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            statsSection.querySelectorAll('.stat-number[data-target]').forEach((counterElement) => {
                animateCounter(counterElement);
            });
            return;
        }

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.querySelectorAll('.stat-number[data-target]').forEach((counterElement) => {
                        animateCounter(counterElement);
                    });
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.5 }
        );

        counterObserver.observe(statsSection);
    }

    function resolveLegacyDelay(element) {
        for (const [className, delay] of Object.entries(LEGACY_FADE_DELAYS)) {
            if (element.classList.contains(className)) {
                return delay;
            }
        }

        return null;
    }

    function shouldSkipAutoReveal(element) {
        if (!(element instanceof HTMLElement)) {
            return true;
        }

        if (element.dataset.revealReady === 'true') {
            return true;
        }

        if (element.matches('html, body, script, style, meta, link')) {
            return true;
        }

        if (element.closest('.modal, .dropdown-content')) {
            return true;
        }

        if (element.hasAttribute('data-no-auto-reveal')) {
            return true;
        }

        return false;
    }

    function applyRevealDelay(element) {
        if (element.style.getPropertyValue('--reveal-delay')) {
            return;
        }

        const legacyDelay = resolveLegacyDelay(element);

        if (legacyDelay !== null) {
            element.style.setProperty('--reveal-delay', `${legacyDelay}ms`);
            return;
        }

        const delayMs = (revealSequence % 7) * 80;
        revealSequence += 1;
        element.style.setProperty('--reveal-delay', `${delayMs}ms`);
    }

    function collectRevealCandidates(rootNode) {
        if (!(rootNode instanceof HTMLElement) && rootNode !== document) {
            return [];
        }

        const candidates = [];
        const queryRoot = rootNode === document ? document.documentElement : rootNode;

        if (queryRoot instanceof HTMLElement && queryRoot.matches(AUTO_REVEAL_SELECTORS)) {
            candidates.push(queryRoot);
        }

        queryRoot.querySelectorAll(AUTO_REVEAL_SELECTORS).forEach((element) => {
            candidates.push(element);
        });

        return candidates;
    }

    function initPageAndElementAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const supportsObserver = 'IntersectionObserver' in window;

        document.body.classList.add('page-enter');

        window.requestAnimationFrame(() => {
            document.body.classList.add('page-enter-active');
        });

        if (document.readyState === 'complete') {
            document.body.classList.add('page-loaded');
        } else {
            window.addEventListener('load', () => {
                document.body.classList.add('page-loaded');
            }, { once: true });
        }

        if (prefersReducedMotion) {
            collectRevealCandidates(document).forEach((element) => {
                if (element instanceof HTMLElement) {
                    element.classList.add('reveal-on-scroll', 'is-visible');
                }
            });
            return;
        }

        const revealObserver = supportsObserver
            ? new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
            )
            : null;

        function registerRevealElement(element) {
            if (shouldSkipAutoReveal(element)) {
                return;
            }

            element.dataset.revealReady = 'true';
            element.classList.add('reveal-on-scroll');
            applyRevealDelay(element);

            if (!revealObserver) {
                element.classList.add('is-visible');
                return;
            }

            revealObserver.observe(element);
        }

        function registerRevealFromNode(node) {
            collectRevealCandidates(node).forEach((candidateElement) => {
                registerRevealElement(candidateElement);
            });
        }

        registerRevealFromNode(document);

        if ('MutationObserver' in window) {
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (!(addedNode instanceof HTMLElement)) {
                            return;
                        }

                        registerRevealFromNode(addedNode);
                    });
                });
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    function preventFormResubmission() {
        if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.href);
        }
    }

    function initFaq() {
        document.querySelectorAll('.faq-question').forEach((question) => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                item.classList.toggle('active');
                
                const icon = question.querySelector('span:last-child');
                if (icon) {
                    icon.textContent = item.classList.contains('active') ? '[-]' : '[+]';
                }
            });
        });
    }

    function initDynamicHomeGallery() {
        const grid = document.getElementById('dynamicHomeGallery');
        const section = document.getElementById('homeGallery');
        const familyImg = document.querySelector('.about-image img');
        
        if (!window.AppUtils) return;

        // Dynamic Family Image
        const settings = window.AppUtils.getJson(window.AppUtils.DATA_KEYS.homeSettings, {});
        if (settings.familyImage && familyImg) {
            familyImg.src = settings.familyImage;
        }

        if (!grid || !section) return;

        if (settings.showLatestActivities === false) {
            section.style.display = 'none';
            return;
        }

        const gallery = window.AppUtils.getJson(window.AppUtils.DATA_KEYS.gallery, []);
        if (gallery.length === 0) return;

        section.style.display = 'block';
        // Show only latest 4 on home
        grid.innerHTML = gallery.slice(0, 4).map(item => `
            <div class="program-card" style="padding: 0; overflow: hidden; height: 300px;">
                <img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover; transition: var(--transition);">
            </div>
        `).join('');
    }

    function initPremiumCtaMotion() {
        const ctaSection = document.querySelector('.cta-section');
        const ctaShell = document.getElementById('ctaShell');
        const ctaOrbs = Array.from(document.querySelectorAll('.cta-orb'));
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isFinePointer = window.matchMedia('(pointer: fine)').matches;

        if (!ctaSection || !ctaShell || isReducedMotion || !isFinePointer) {
            return;
        }

        ctaSection.addEventListener('pointermove', (event) => {
            const bounds = ctaSection.getBoundingClientRect();
            const ratioX = (event.clientX - bounds.left) / bounds.width - 0.5;
            const ratioY = (event.clientY - bounds.top) / bounds.height - 0.5;
            const tiltX = -ratioY * 8;
            const tiltY = ratioX * 10;

            ctaShell.style.transform = `translateY(-8px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
            ctaOrbs.forEach((orb, index) => {
                const factor = index === 0 ? 14 : -16;
                const moveX = ratioX * factor;
                const moveY = ratioY * factor;
                orb.style.transform = `translate(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px)`;
            });
        });

        ctaSection.addEventListener('pointerleave', () => {
            ctaShell.style.transform = '';
            ctaOrbs.forEach((orb) => {
                orb.style.transform = '';
            });
        });
    }

    function getCareersAccessSnapshot() {
        if (!window.AppUtils || typeof window.AppUtils.getJson !== 'function') {
            return {
                careersOpen: true,
                adminLoggedIn: false,
                careersAvailable: true
            };
        }

        const homeSettingsKey = window.AppUtils.DATA_KEYS
            ? window.AppUtils.DATA_KEYS.homeSettings
            : 'imtekkuHomeSettings';
        const adminStorageKey = window.AppUtils.STORAGE_KEYS
            ? window.AppUtils.STORAGE_KEYS.adminLoggedIn
            : 'adminLoggedIn';
        const homeSettings = window.AppUtils.getJson(homeSettingsKey, {});
        const careersOpen = homeSettings.careersOpen === true;
        const adminLoggedIn = localStorage.getItem(adminStorageKey) === 'true';

        return {
            careersOpen,
            adminLoggedIn,
            careersAvailable: careersOpen || adminLoggedIn
        };
    }

    function applyCareersMenuState() {
        const careerMenuLinks = Array.from(document.querySelectorAll('.btn-rekrutasi'));
        if (!careerMenuLinks.length) {
            return;
        }

        const accessState = getCareersAccessSnapshot();
        const isLockedForPublic = !accessState.careersAvailable;

        careerMenuLinks.forEach((careerLink) => {
            if (!careerLink.dataset.originalCareerLabel) {
                const initialLabel = careerLink.textContent.trim();
                careerLink.dataset.originalCareerLabel = initialLabel || 'CAREERS';
            }

            if (!careerLink.dataset.careersGuardBound) {
                careerLink.addEventListener('click', (event) => {
                    if (careerLink.dataset.careersLocked === 'true') {
                        event.preventDefault();
                    }
                });
                careerLink.dataset.careersGuardBound = 'true';
            }

            careerLink.dataset.careersLocked = isLockedForPublic ? 'true' : 'false';
            careerLink.classList.toggle('is-coming-soon', isLockedForPublic);
            careerLink.setAttribute('aria-disabled', isLockedForPublic ? 'true' : 'false');
            careerLink.textContent = isLockedForPublic
                ? 'COMING SOON!!!'
                : careerLink.dataset.originalCareerLabel;
            careerLink.title = isLockedForPublic
                ? 'Coming Soon!!! Akses publik akan dibuka oleh admin.'
                : '';
        });
    }

    function syncAllData() {
        applyCareersMenuState();
        initDynamicHomeGallery();
    }

    function initCareersMenuState() {
        const hasCareersMenu = document.querySelector('.btn-rekrutasi');
        const hasHomeElements = Boolean(
            document.getElementById('dynamicHomeGallery')
            || document.querySelector('.about-image img')
        );
        if (!hasCareersMenu && !hasHomeElements) {
            return;
        }

        syncAllData();

        if (window.AppUtils && typeof window.AppUtils.syncFromCloudAsync === 'function') {
            window.AppUtils.syncFromCloudAsync().then(() => syncAllData());
        } else if (window.AppUtils && typeof window.AppUtils.syncFromCloudNow === 'function') {
            window.AppUtils.syncFromCloudNow();
            syncAllData();
        }

        window.addEventListener('storage', (event) => {
            const homeSettingsKey = window.AppUtils && window.AppUtils.DATA_KEYS
                ? window.AppUtils.DATA_KEYS.homeSettings
                : 'imtekkuHomeSettings';
            const galleryKey = window.AppUtils && window.AppUtils.DATA_KEYS
                ? window.AppUtils.DATA_KEYS.gallery
                : 'imtekkuGalleryData';
            const adminStorageKey = window.AppUtils && window.AppUtils.STORAGE_KEYS
                ? window.AppUtils.STORAGE_KEYS.adminLoggedIn
                : 'adminLoggedIn';

            if (
                event.key === homeSettingsKey
                || event.key === adminStorageKey
                || event.key === galleryKey
            ) {
                syncAllData();
            }
        });

        window.addEventListener('apputils:cloud-sync', syncAllData);
        window.addEventListener('pageshow', async () => {
            if (window.AppUtils && typeof window.AppUtils.syncFromCloudAsync === 'function') {
                await window.AppUtils.syncFromCloudAsync();
            } else if (window.AppUtils && typeof window.AppUtils.syncFromCloudNow === 'function') {
                window.AppUtils.syncFromCloudNow();
            }
            syncAllData();
        });

        // Keep menu state synced across devices without manual refresh.
        if (window.AppUtils && typeof window.AppUtils.startAutoCloudSync === 'function') {
            window.AppUtils.startAutoCloudSync({
                visibleIntervalMs: 3000,
                hiddenIntervalMs: 12000,
                focusDebounceMs: 900
            });
        } else {
            window.setInterval(async () => {
                if (window.AppUtils && typeof window.AppUtils.syncFromCloudAsync === 'function') {
                    await window.AppUtils.syncFromCloudAsync();
                } else if (window.AppUtils && typeof window.AppUtils.syncFromCloudNow === 'function') {
                    window.AppUtils.syncFromCloudNow();
                }
                syncAllData();
            }, 5000);
        }
    }

    function initAdminLogin() {
        const modal = document.getElementById('globalAdminLoginModal');
        const form = document.getElementById('globalAdminLoginForm');
        const closeButton = modal ? modal.querySelector('[data-admin-login-close]') : null;
        const loginTriggers = Array.from(document.querySelectorAll('[data-admin-login-trigger]'));

        if (loginTriggers.length === 0) {
            return;
        }

        const storageKey = window.AppUtils && window.AppUtils.STORAGE_KEYS
            ? window.AppUtils.STORAGE_KEYS.adminLoggedIn
            : 'adminLoggedIn';

        function openModal() {
            if (window.AppUtils && typeof window.AppUtils.showModal === 'function') {
                window.AppUtils.showModal(modal);
                return;
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (window.AppUtils && typeof window.AppUtils.hideModal === 'function') {
                window.AppUtils.hideModal(modal);
                return;
            }

            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function resolveAdminPath() {
            const normalizedPath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            const isInsidePagesDirectory = normalizedPath.includes('/pages/');
            return isInsidePagesDirectory ? 'admin.html' : 'pages/admin.html';
        }

        function resolveRecruitmentPath() {
            const normalizedPath = window.location.pathname.replace(/\\/g, '/').toLowerCase();
            const isInsidePagesDirectory = normalizedPath.includes('/pages/');
            return isInsidePagesDirectory ? 'rekrutasi.html' : 'pages/rekrutasi.html';
        }

        function goToAdminDashboard() {
            window.location.href = resolveAdminPath();
        }

        function goToAdminLoginFallback() {
            if (typeof window.showAdminLogin === 'function') {
                window.showAdminLogin();
                return;
            }

            const recruitmentPath = resolveRecruitmentPath();
            const separator = recruitmentPath.includes('?') ? '&' : '?';
            window.location.href = `${recruitmentPath}${separator}admin=true`;
        }

        loginTriggers.forEach((triggerElement) => {
            triggerElement.addEventListener('click', (event) => {
                event.preventDefault();

                if (localStorage.getItem(storageKey) === 'true') {
                    goToAdminDashboard();
                    return;
                }

                if (!modal || !form) {
                    goToAdminLoginFallback();
                    return;
                }

                openModal();
            });
        });

        if (!modal || !form) {
            return;
        }

        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('globalAdminUsername');
            const passwordInput = document.getElementById('globalAdminPassword');
            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (username === 'IMTEKKUKNG' && password === 'azkaganteng25') {
                localStorage.setItem(storageKey, 'true');
                closeModal();
                goToAdminDashboard();
                return;
            }

            alert('Username atau password salah.');
        });

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            openModal();
        }
    }

    initNavigation();
    initSmoothScroll();
    initMenuPageTransitions();
    initCounterAnimation();
    initPageAndElementAnimations();
    initFaq();
    initDynamicHomeGallery();
    initPremiumCtaMotion();
    initCareersMenuState();
    initAdminLogin();
    preventFormResubmission();
})();


