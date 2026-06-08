(() => {
    const appUtils = window.AppUtils || {};
    appUtils.ensureDataInitialized();

    const DATA_KEY = appUtils.DATA_KEYS && appUtils.DATA_KEYS.team
        ? appUtils.DATA_KEYS.team
        : 'imtekkuTeamData';
    const PHOTO_KEY = appUtils.DATA_KEYS && appUtils.DATA_KEYS.teamPhotos
        ? appUtils.DATA_KEYS.teamPhotos
        : 'imtekkuTeamPhotos';

    function getJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function normalizeInstagramUsername(rawValue) {
        const value = String(rawValue || '').trim();
        if (!value) {
            return '';
        }

        const urlMatch = value.match(/instagram\.com\/@?([A-Za-z0-9._]+)/i);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1];
        }

        const cleaned = value
            .replace(/^https?:\/\//i, '')
            .replace(/^www\./i, '')
            .replace(/^instagram\.com\//i, '')
            .replace(/^@+/, '')
            .split(/[/?#]/)[0]
            .trim();

        return /^[A-Za-z0-9._]+$/.test(cleaned) ? cleaned : '';
    }

    function applyInstagramLink(card, member) {
        const igLink = card.querySelector('.social-icon');
        if (!igLink) {
            return;
        }

        const igUsername = normalizeInstagramUsername(member.instagram);
        igLink.classList.remove('is-disabled');
        igLink.removeAttribute('aria-disabled');
        igLink.onclick = null;

        if (!igUsername) {
            igLink.href = '#';
            igLink.removeAttribute('target');
            igLink.removeAttribute('rel');
            igLink.classList.add('is-disabled');
            igLink.setAttribute('aria-disabled', 'true');
            igLink.onclick = (event) => {
                event.preventDefault();
            };
            return;
        }

        igLink.href = `https://instagram.com/${igUsername}`;
        igLink.target = '_blank';
        igLink.rel = 'noopener noreferrer';
        igLink.setAttribute('aria-label', `Instagram ${member.name}`);
    }

    function renderTeam() {
        const team = getJson(DATA_KEY, []);
        const photos = getJson(PHOTO_KEY, {});
        
        team.forEach(member => {
            const container = document.getElementById(member.id);
            if (!container) return;

            // Update Name
            const card = container.closest('.card-inner');
            if (card) {
                const nameEl = card.querySelector('h3');
                if (nameEl) nameEl.textContent = member.name;
                
                const posEl = card.querySelector('.position');
                if (posEl) posEl.textContent = member.role;

                const nimEl = card.querySelector('.description');
                if (nimEl && member.nim) {
                    // Update only NIM if description exists
                    nimEl.innerHTML = `NIM: ${member.nim}<br>Major: ${member.major || '-'}`;
                }

                applyInstagramLink(card, member);
            }

            // Update Photo
            if (photos[member.id]) {
                container.innerHTML = `<img src="${photos[member.id]}" alt="${member.name}" style="transform: scale(${member.zoom / 100}); width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                container.innerHTML = `<span>${member.name[0]}</span>`;
            }
        });
    }

    renderTeam();
    window.addEventListener('storage', (event) => {
        if (event.key === DATA_KEY || event.key === PHOTO_KEY) {
            renderTeam();
        }
    });
    window.addEventListener('apputils:cloud-sync', renderTeam);

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
