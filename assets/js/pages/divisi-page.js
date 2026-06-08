(() => {
    const appUtils = window.AppUtils || {};
    appUtils.ensureDataInitialized();

    const DATA_KEY = 'imtekkuDivisionData';
    const PHOTO_KEY = 'imtekkuDivisionMemberPhotos';
    const DEFAULT_STAFF_TARGET_PER_DIVISION = 14;
    const STAFF_TARGET_BY_DIVISION = Object.freeze({
        acara: 10,
        humas: 10,
        sponsor: 8,
        logistik: 13,
        psdm: 9
    });
    const CARD_TILT_LIMIT = 6;
    const HERO_PARALLAX_LIMIT = 12;

    function getJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function makePlaceholderMember(index, divisionKey) {
        return {
            id: `${divisionKey}-placeholder-${index}`,
            name: `Data anggota ke-${index} belum diisi`,
            nim: '-',
            major: 'Jurusan belum diisi',
            instagram: '',
            role: 'Anggota Divisi',
            zoom: 100
        };
    }

    function buildDivisionMembers(divisionKey, storedMembers) {
        const members = storedMembers || [];
        const fullList = [...members];
        const staffTarget = STAFF_TARGET_BY_DIVISION[divisionKey] || DEFAULT_STAFF_TARGET_PER_DIVISION;

        while (fullList.length < staffTarget) {
            fullList.push(makePlaceholderMember(fullList.length + 1, divisionKey));
        }

        // Do not cap the list so admin can add more staff than baseline target.
        return fullList;
    }

    function makeAvatar(name) {
        const initials = name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0] ? part[0].toUpperCase() : '')
            .join('');

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill="#f2c14e"/><text x="50" y="56" font-family="Arial" font-size="30" font-weight="700" text-anchor="middle" fill="#3b2505">${initials}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function memberCardTemplate(member, photoUrl) {
        const profilePhoto = photoUrl || makeAvatar(member.name);
        const instagramFilled = member.instagram && member.instagram.trim() !== '';
        const instagramText = instagramFilled ? `@${member.instagram}` : 'Instagram belum diisi';
        const instagramHtml = instagramFilled
            ? `<a href="https://instagram.com/${member.instagram}" target="_blank" rel="noopener" class="member-instagram">${instagramText}</a>`
            : `<span class="member-instagram">${instagramText}</span>`;

        const imgStyle = `transform: scale(${member.zoom / 100}); width: 100%; height: 100%; object-fit: cover;`;

        return `
            <article class="member-card">
                <div class="member-photo-frame">
                    <img src="${profilePhoto}" alt="Foto ${member.name}" class="member-photo-image" style="${imgStyle}">
                </div>
                <p class="member-role">${member.role}</p>
                <h4>${member.name}</h4>
                <p class="member-major">${member.major}</p>
                <p class="member-nim">NIM: ${member.nim}</p>
                ${instagramHtml}
            </article>
        `;
    }

    function renderDivisionMembers() {
        const allDivisions = getJson(DATA_KEY, {});
        const photos = getJson(PHOTO_KEY, {});

        ['acara', 'humas', 'sponsor', 'logistik', 'psdm', 'medfo'].forEach((divisionKey) => {
            const container = document.getElementById(`members-${divisionKey}`);
            if (!container) return;

            const members = buildDivisionMembers(divisionKey, allDivisions[divisionKey]);
            container.innerHTML = members
                .map((member) => memberCardTemplate(member, photos[member.id]))
                .join('');

            const teamNote = container.closest('.divisi-team')?.querySelector('.team-note');
            if (teamNote) {
                teamNote.textContent = `TOTAL PROFESSIONALS: ${members.length}`;
            }
        });
    }

    function initRevealAnimation() {
        const revealItems = Array.from(document.querySelectorAll('.reveal-item'));
        if (!revealItems.length) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    function initMemberCardTilt() {
        const cards = Array.from(document.querySelectorAll('.member-card'));
        if (!cards.length) return;
        cards.forEach((card) => {
            card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const relativeX = (event.clientX - rect.left) / rect.width;
                const relativeY = (event.clientY - rect.top) / rect.height;
                const tiltY = (relativeX - 0.5) * CARD_TILT_LIMIT * 2;
                const tiltX = (0.5 - relativeY) * CARD_TILT_LIMIT * 2;
                card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.classList.remove('is-tilting');
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }

    renderDivisionMembers();
    initMemberCardTilt();
    initRevealAnimation();

    window.addEventListener('storage', (event) => {
        if (event.key === DATA_KEY || event.key === PHOTO_KEY) {
            renderDivisionMembers();
        }
    });

    window.addEventListener('apputils:cloud-sync', renderDivisionMembers);

    // Keep sync active with centralized scheduler when available.
    if (typeof appUtils.startAutoCloudSync === 'function') {
        appUtils.startAutoCloudSync({
            visibleIntervalMs: 3000,
            hiddenIntervalMs: 12000,
            focusDebounceMs: 900
        });
    } else {
        window.setInterval(async () => {
            if (typeof appUtils.syncFromCloudAsync === 'function') {
                await appUtils.syncFromCloudAsync();
            } else if (typeof appUtils.syncFromCloudNow === 'function') {
                appUtils.syncFromCloudNow();
            }
        }, 5000);
    }
})();
