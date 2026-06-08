(() => {
    const DIVISION_LABELS = Object.freeze({
        acara: 'Events',
        humas: 'Public Relations',
        sponsor: 'Sponsorship',
        logistik: 'Logistics',
        psdm: 'HR Development (Student/Human Resources)',
        medfo: 'Media & Information'
    });

    const STORAGE_KEYS = Object.freeze({
        applicants: 'applicants',
        adminLoggedIn: 'adminLoggedIn'
    });

    const DATA_KEYS = Object.freeze({
        team: 'imtekkuTeamData',
        divisions: 'imtekkuDivisionData',
        teamPhotos: 'imtekkuTeamPhotos',
        divisionPhotos: 'imtekkuDivisionMemberPhotos',
        gallery: 'imtekkuGalleryData',
        galleryCategories: 'imtekkuGalleryCategories',
        archivedCollections: 'imtekkuArchivedCollections',
        homeSettings: 'imtekkuHomeSettings',
        recruitmentSettings: 'imtekkuRecruitmentSettings'
    });

    // Set databaseUrl dengan URL Realtime Database Firebase kamu.
    // Contoh: https://my-project-default-rtdb.asia-southeast1.firebasedatabase.app
    const CLOUD_SYNC_CONFIG = Object.freeze({
        databaseUrl: 'https://imtekkukng-default-rtdb.asia-southeast1.firebasedatabase.app/',
        rootPath: 'imtekkuData'
    });

    const CLOUD_SYNC_KEYS = Object.freeze([
        STORAGE_KEYS.applicants,
        DATA_KEYS.team,
        DATA_KEYS.divisions,
        DATA_KEYS.teamPhotos,
        DATA_KEYS.divisionPhotos,
        DATA_KEYS.gallery,
        DATA_KEYS.galleryCategories,
        DATA_KEYS.archivedCollections,
        DATA_KEYS.homeSettings,
        DATA_KEYS.recruitmentSettings
    ]);

    const INITIAL_RECRUITMENT_SETTINGS = {
        timeline: [
            { phase: 'PHASE 1', title: 'APPLICATION WINDOW', date: 'JANUARY 2026' },
            { phase: 'PHASE 2', title: 'ADMINISTRATIVE SCREENING', date: 'FEBRUARY 2026' },
            { phase: 'PHASE 3', title: 'PROFESSIONAL INTERVIEW', date: 'FEBRUARY 2026' },
            { phase: 'PHASE 4', title: 'OFFICIAL ONBOARDING', date: 'MARCH 2026' }
        ],
        requirements: [
            { id: 'cv', label: 'Upload CV', type: 'file', required: true, accept: '.pdf,.doc,.docx' },
            { id: 'portfolio', label: 'Upload Portfolio', type: 'file', required: false, accept: '.pdf,.ppt,.pptx,.zip' }
        ]
    };

    const INITIAL_ARCHIVED_COLLECTIONS = [
        { id: 1, tag: 'ROADSHOW', title: 'MITRA KUNINGAN SUMMIT', date: 'JANUARY 2026', desc: 'Official documentation of the annual summit between student representatives and regional stakeholders.' },
        { id: 2, tag: 'ROADSHOW', title: 'CAMPUS ENGAGEMENT', date: 'FEBRUARY 2026', desc: 'Strategic sessions with university administration regarding student welfare and regional development.' },
        { id: 3, tag: 'ROADSHOW', title: 'TECH SYMPOSIUM', date: 'MARCH 2026', desc: 'A showcase of technological innovations and academic research presented by students from Kuningan.' },
        { id: 4, tag: 'CHARITY', title: 'TRAINING SEMINAR B1', date: 'OCTOBER 2026', desc: 'Professional development seminar focusing on leadership and organizational management.' },
        { id: 5, tag: 'CHARITY', title: 'ANNUAL SHOWCASE', date: 'JANUARY 2026', desc: 'The flagship event demonstrating organizational achievements throughout the fiscal year.' },
        { id: 6, tag: 'CHARITY', title: 'EXECUTIVE BRIEFING', date: 'MARCH 2026', desc: 'Internal briefing regarding strategic initiatives for the upcoming organizational cycle.' }
    ];

    const INITIAL_TEAM_MEMBERS = [
        { id: 'photo-vito', name: 'Vito Ramdhan', role: 'Chairman', nim: '2026001', major: 'Management', instagram: 'vitoramdhan', zoom: 100 },
        { id: 'photo-daffa', name: 'M. Daffa Fadlurrahman', role: 'First Secretary', nim: '2026002', major: 'Industrial Engineering', instagram: 'daffa_f', zoom: 100 },
        { id: 'photo-nahdah', name: 'Nahdah Runa Musyafa', role: 'Second Secretary', nim: '2026003', major: 'Communication', instagram: 'nahdahruna', zoom: 100 },
        { id: 'photo-hilwa', name: 'Hilwa Dhiya', role: 'First Treasurer', nim: '2026004', major: 'Accounting', instagram: 'hilwadhiya', zoom: 100 },
        { id: 'photo-salwa', name: 'Salwa Regisya Zahlia', role: 'Second Treasurer', nim: '2026005', major: 'Economics', instagram: 'salwareg', zoom: 100 },
        { id: 'photo-serlianah', name: 'Serlianah', role: 'Internal', nim: '2026006', major: 'Psychology', instagram: 'serlianah_', zoom: 100 },
        { id: 'photo-rafid', name: 'M. Rafid Faiz M.', role: 'External', nim: '2026007', major: 'Public Relations', instagram: 'rafidfaiz', zoom: 100 }
    ];

    const INITIAL_DIVISION_SEEDS = {
        acara: {
            ketua: { name: 'Agri Pratama', nim: '707012400064', major: 'Event Management', instagram: 'agri_p' },
            anggota: [
                { name: 'Alifa Anisa Hakim', nim: '607072400030' },
                { name: 'Fakhri Adam Zaki Musyafa', nim: '104062400093' },
                { name: 'Hagia Raisya Shafiyanni', nim: '106022400058' },
                { name: 'Anjar Azzam Fadhilah', nim: '103012500193' },
                { name: 'Wildan Nurcahyadi Nugraha', nim: '109112500139' },
                { name: 'Laodia Friskila', nim: '607072500018' },
                { name: 'Derriel Syafrina Sussendyo', nim: '104042500186' },
                { name: 'Mohamad Nejad Akbar Islami', nim: '104012500394' },
                { name: 'Vika Kamilatun Nisa', nim: '104042500282' }
            ]
        },
        humas: {
            ketua: { name: 'Aryasatya Mahija Sembada', nim: '105022400050' },
            anggota: [
                { name: 'Nopal Rusdiana', nim: '104062400171' },
                { name: 'Dafa Setiya Nugraha', nim: '104062400035' },
                { name: 'Sofia Salsabila', nim: '102032500099' },
                { name: 'Naysilla Nur Andhini', nim: '105022500030' },
                { name: 'Olysiera Sahmin Mohga', nim: '106012530034' },
                { name: 'Muhammad Haiqal Nur Fazri', nim: '101022500286' },
                { name: 'Wulan Cahaya Anugrah', nim: '106022500047' },
                { name: 'Alga Perkasa', nim: '105022500114' },
                { name: 'Achmad Chaibar Achbarulloh', nim: '103032500094' }
            ]
        },
        sponsor: {
            ketua: { name: 'Muhammad Nabhan Fadillah', nim: '105022400202' },
            anggota: [
                { name: 'Candra Budiman Syah', nim: '102052400084' },
                { name: 'Denisa Nayla Azahra', nim: '102032500055' },
                { name: 'Keysha Renata Aniqa', nim: '103012500138' },
                { name: 'Vebri Ardana', nim: '104012500209' },
                { name: 'Kyla Azalya Kusuma Putri', nim: '104042500069' },
                { name: 'Sonic Pratama', nim: '707012500031' },
                { name: 'Muhammad Rizky', nim: '102022500017' }
            ]
        },
        logistik: {
            ketua: { name: 'Ahmad Rizal Fauzi', nim: '104012430016' },
            anggota: [
                { name: 'David Faizul Anwar', nim: '102082400047' },
                { name: 'Dika Marta Dwiputra', nim: '104012400189' },
                { name: 'Mochammad Akbar Alfaridzi P', nim: '103032400043' },
                { name: 'Abhirama Diya Hafizhar', nim: '102082400028' },
                { name: 'Fatur Alfandi', nim: '101022400048' },
                { name: 'Muhammad Hilmi Hifnagholdy', nim: '109112500106' },
                { name: 'Dizy Faiz Bangkit Pratama', nim: '104042500268' },
                { name: 'Galih Pratama Putra', nim: '104012530006' },
                { name: 'Rifqi Aldiansyam Opicaessar', nim: '104042530076' },
                { name: 'Ziyad Aljufy Ahmad', nim: '108112500079' },
                { name: 'Henda Somantri Praja', nim: '109082500066' },
                { name: 'Aprilian Reihan Firdaus', nim: '101022500058' }
            ]
        },
        psdm: {
            ketua: { name: 'Mohamad Nur Faridz Al Yahya', nim: '102012400034' },
            anggota: [
                { name: 'Gardina Ranu Adilah', nim: '106032400129' },
                { name: 'Elvira Dylan Prasasty', nim: '101012400178' },
                { name: 'Bunga Amelia Ramadani', nim: '102022500362' },
                { name: 'Khoirunnisa Nihayatuzain', nim: '104022500099' },
                { name: 'Sabina Alika Anandia', nim: '104022500016' },
                { name: 'Sabila Viena Al Walia', nim: '106022500077' },
                { name: 'Muhammad Albariqi Riqi', nim: '106022500021' },
                { name: 'Gira Kurmayana', nim: '104042500093' }
            ]
        },
        medfo: {
            ketua: { name: 'Deffany Rameyza Putri', nim: '106032430017' },
            anggota: [
                { name: 'Zahran Aditya Rasyad', nim: '104062400154' },
                { name: 'Kayla Al Ghifari', nim: '106012400352' },
                { name: 'Nadhif Dhiyaulhaq Zabadi', nim: '104012400116' },
                { name: 'Muthia Luthfi Nurwindi', nim: '607062400027' },
                { name: 'Fauzan Alim', nim: '104062400120' },
                { name: 'Trisya Rahayu Fauziah', nim: '105012500035' },
                { name: 'Ikna Maulida', nim: '104022500100' },
                { name: 'Ranasywa Leanaskuma Autami', nim: '101032500008' },
                { name: 'Rafa Al Fattah', nim: '103012500364' },
                { name: 'Muhammad Reyan Al Ghifary', nim: '101022500168' },
                { name: 'Nayyara Jawza Athaya', nim: '102012500105' },
                { name: 'Lulu Reswara Puruhita', nim: '101012500272' },
                { name: 'Azka Muhammad Aqila', nim: '103012500017' }
            ]
        }
    };

    const CLOUD_SYNC_EVENT_NAME = 'apputils:cloud-sync';
    const CLOUD_LOCAL_UPDATE_EVENT_NAME = 'apputils:data-updated';
    let hasInitialized = false;
    const dirtyCloudKeys = new Set();
    let preferredImageMimeType = null;
    let hasRequestedPersistentStorage = false;
    const STORAGE_OPTIMIZATION_VERSION_KEY = 'imtekkuStorageOptimizationVersion';
    const STORAGE_OPTIMIZATION_VERSION = '2026-02-18-v1';
    const STORAGE_OPTIMIZATION_PROFILES = Object.freeze({
        member: Object.freeze({ maxWidth: 720, maxHeight: 720, quality: 0.56, maxBytes: 95 * 1024 }),
        gallery: Object.freeze({ maxWidth: 900, maxHeight: 900, quality: 0.56, maxBytes: 150 * 1024 }),
        archived: Object.freeze({ maxWidth: 900, maxHeight: 900, quality: 0.58, maxBytes: 160 * 1024 }),
        homeFamily: Object.freeze({ maxWidth: 1440, maxHeight: 810, quality: 0.58, maxBytes: 240 * 1024 })
    });
    const CLOUD_SYNC_DEFAULT_INTERVAL_MS = 3000;
    const CLOUD_SYNC_BACKGROUND_INTERVAL_MS = 12000;
    const CLOUD_SYNC_FOCUS_DEBOUNCE_MS = 900;
    const CLOUD_SYNC_MIN_INTERVAL_MS = 1200;
    const CLOUD_SYNC_MAX_INTERVAL_MS = 60000;
    const CLOUD_SYNC_COOLDOWN_MS = 900;
    let cloudSyncEtag = null;
    let inFlightCloudSyncPromise = null;
    let lastCloudSyncAt = 0;
    let autoCloudSyncStarted = false;
    let autoCloudSyncTimerId = null;
    let autoCloudSyncVisibleIntervalMs = CLOUD_SYNC_DEFAULT_INTERVAL_MS;
    let autoCloudSyncHiddenIntervalMs = CLOUD_SYNC_BACKGROUND_INTERVAL_MS;
    let autoCloudSyncFocusDebounceMs = CLOUD_SYNC_FOCUS_DEBOUNCE_MS;
    let lastAutoCloudSignalAt = 0;
    let autoCloudSyncListenersBound = false;

    function normalizeCloudDatabaseUrl(databaseUrl) {
        return String(databaseUrl || '').replace(/\/+$/, '');
    }

    function isCloudSyncConfigured() {
        const databaseUrl = normalizeCloudDatabaseUrl(CLOUD_SYNC_CONFIG.databaseUrl);
        if (!databaseUrl) {
            return false;
        }

        return !databaseUrl.includes('YOUR_FIREBASE_DATABASE_URL');
    }

    function buildCloudSyncUrl(key, withCacheBust = false) {
        const databaseUrl = normalizeCloudDatabaseUrl(CLOUD_SYNC_CONFIG.databaseUrl);
        const rootPath = String(CLOUD_SYNC_CONFIG.rootPath || 'imtekkuData').replace(/^\/+|\/+$/g, '');
        const normalizedKey = key ? `/${String(key).replace(/^\/+/, '')}` : '';
        const baseUrl = `${databaseUrl}/${rootPath}${normalizedKey}.json`;
        if (!withCacheBust) {
            return baseUrl;
        }

        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}_ts=${Date.now()}`;
    }

    function tryParseJson(rawValue, fallbackValue = null) {
        try {
            return JSON.parse(rawValue);
        } catch (error) {
            return fallbackValue;
        }
    }

    function resolveCloudEtagHeader(rawValue) {
        if (typeof rawValue !== 'string') {
            return null;
        }

        const normalizedValue = rawValue.trim();
        return normalizedValue.length > 0 ? normalizedValue : null;
    }

    function buildCloudPullHeaders() {
        const headers = { 'X-Firebase-ETag': 'true' };
        if (cloudSyncEtag) {
            headers['if-none-match'] = cloudSyncEtag;
        }
        return headers;
    }

    function rememberCloudEtagFromResponse(response) {
        if (!response || !response.headers || typeof response.headers.get !== 'function') {
            return;
        }

        const etagHeaderValue = resolveCloudEtagHeader(
            response.headers.get('ETag') || response.headers.get('Etag')
        );
        if (etagHeaderValue) {
            cloudSyncEtag = etagHeaderValue;
        }
    }

    function rememberCloudEtagFromXhr(request) {
        if (!request || typeof request.getResponseHeader !== 'function') {
            return;
        }

        const etagHeaderValue = resolveCloudEtagHeader(
            request.getResponseHeader('ETag') || request.getResponseHeader('Etag')
        );
        if (etagHeaderValue) {
            cloudSyncEtag = etagHeaderValue;
        }
    }

    function dispatchDataSyncEvent(source, keys = []) {
        const normalizedSource = source === 'cloud' ? 'cloud' : 'local';
        const normalizedKeys = Array.isArray(keys)
            ? keys.filter((key) => typeof key === 'string' && key.length > 0)
            : [];
        const detail = Object.freeze({
            source: normalizedSource,
            keys: Object.freeze([...normalizedKeys])
        });

        window.dispatchEvent(new CustomEvent(CLOUD_LOCAL_UPDATE_EVENT_NAME, { detail }));
        window.dispatchEvent(new CustomEvent(CLOUD_SYNC_EVENT_NAME, { detail }));
    }

    function applyRemotePayloadToLocal(payload) {
        let hasRemoteData = false;
        const changedKeys = [];

        CLOUD_SYNC_KEYS.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(payload, key)) {
                return;
            }

            const nextRaw = JSON.stringify(payload[key]);
            const previousRaw = localStorage.getItem(key);
            hasRemoteData = true;

            if (previousRaw === nextRaw) {
                dirtyCloudKeys.delete(key);
                return;
            }

            localStorage.setItem(key, nextRaw);
            dirtyCloudKeys.delete(key);
            changedKeys.push(key);
        });

        return { hasRemoteData, changedKeys };
    }

    function setLocalOnlyJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    async function pullCloudStateAsync() {
        if (!isCloudSyncConfigured()) {
            return { ok: false, hasRemoteData: false, changedKeys: [] };
        }

        try {
            const cloudUrl = buildCloudSyncUrl('', true);
            let response = null;

            try {
                response = await fetch(cloudUrl, {
                    headers: buildCloudPullHeaders(),
                    cache: 'no-store'
                });
            } catch (conditionalRequestError) {
                response = null;
            }

            if (!response || (!response.ok && response.status !== 304)) {
                response = await fetch(cloudUrl, { cache: 'no-store' });
            }

            if (response.status === 304) {
                return { ok: true, hasRemoteData: false, changedKeys: [] };
            }
            if (!response.ok) {
                return { ok: false, hasRemoteData: false, changedKeys: [] };
            }

            rememberCloudEtagFromResponse(response);
            const payload = await response.json();
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
                return { ok: true, hasRemoteData: false, changedKeys: [] };
            }

            const appliedState = applyRemotePayloadToLocal(payload);
            return {
                ok: true,
                hasRemoteData: appliedState.hasRemoteData,
                changedKeys: appliedState.changedKeys
            };
        } catch (error) {
            return { ok: false, hasRemoteData: false, changedKeys: [] };
        }
    }

    function pullCloudStateSync() {
        if (!isCloudSyncConfigured()) {
            return { ok: false, hasRemoteData: false, changedKeys: [] };
        }

        try {
            const request = new XMLHttpRequest();
            request.open('GET', buildCloudSyncUrl('', true), false); // Synchronous
            request.send(null);

            if (request.status === 304) {
                return { ok: true, hasRemoteData: false, changedKeys: [] };
            }
            if (request.status < 200 || request.status >= 300) {
                return { ok: false, hasRemoteData: false, changedKeys: [] };
            }

            rememberCloudEtagFromXhr(request);
            const payload = tryParseJson(request.responseText, null);
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
                return { ok: true, hasRemoteData: false, changedKeys: [] };
            }

            const appliedState = applyRemotePayloadToLocal(payload);
            return {
                ok: true,
                hasRemoteData: appliedState.hasRemoteData,
                changedKeys: appliedState.changedKeys
            };
        } catch (error) {
            return { ok: false, hasRemoteData: false, changedKeys: [] };
        }
    }

    function collectLocalCloudPayload() {
        const payload = {};

        CLOUD_SYNC_KEYS.forEach((key) => {
            const raw = localStorage.getItem(key);
            if (raw === null) {
                return;
            }

            payload[key] = tryParseJson(raw, null);
        });

        return payload;
    }

    async function pushCloudPayload(payload, keysToClear = CLOUD_SYNC_KEYS) {
        if (!isCloudSyncConfigured()) {
            return false;
        }

        try {
            const response = await fetch(buildCloudSyncUrl(), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                return false;
            }

            keysToClear.forEach((key) => {
                dirtyCloudKeys.delete(key);
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async function pushCloudKey(key, value) {
        if (!isCloudSyncConfigured()) {
            return false;
        }

        if (!CLOUD_SYNC_KEYS.includes(key)) {
            return false;
        }

        try {
            const response = await fetch(buildCloudSyncUrl(key), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value)
            });

            if (response.ok) {
                dirtyCloudKeys.delete(key);
                return true;
            }
        } catch (error) {
            // Fall through to payload fallback below.
        }

        const payload = collectLocalCloudPayload();
        return pushCloudPayload(payload, [key]);
    }

    async function flushDirtyCloudKeysAsync() {
        if (dirtyCloudKeys.size === 0) {
            return true;
        }

        const keysToFlush = Array.from(dirtyCloudKeys);
        for (const key of keysToFlush) {
            const rawValue = localStorage.getItem(key);
            const parsedValue = rawValue === null ? null : tryParseJson(rawValue, null);
            const pushed = await pushCloudKey(key, parsedValue);
            if (!pushed) {
                return false;
            }
        }

        return dirtyCloudKeys.size === 0;
    }

    function setDefaultDataIfMissing() {
        if (!localStorage.getItem(DATA_KEYS.team)) {
            setLocalOnlyJson(DATA_KEYS.team, INITIAL_TEAM_MEMBERS);
        }
        
        if (!localStorage.getItem(DATA_KEYS.divisions)) {
            const divisions = {};
            Object.entries(INITIAL_DIVISION_SEEDS).forEach(([key, seed]) => {
                divisions[key] = [
                    { id: `${key}-0`, name: seed.ketua.name, role: 'Ketua Divisi', nim: seed.ketua.nim, major: seed.ketua.major || 'Management', instagram: seed.ketua.instagram || '', zoom: 100 },
                    ...seed.anggota.map((m, i) => ({
                        id: `${key}-${i + 1}`,
                        name: m.name,
                        role: 'Anggota Divisi',
                        nim: m.nim,
                        major: 'Telkom University',
                        instagram: '',
                        zoom: 100
                    }))
                ];
            });
            setLocalOnlyJson(DATA_KEYS.divisions, divisions);
        }

        if (!localStorage.getItem(DATA_KEYS.galleryCategories)) {
            setLocalOnlyJson(DATA_KEYS.galleryCategories, [
                { id: 'roadshow', name: 'ANNUAL ROADSHOW' },
                { id: 'carrty', name: 'CHARITY PROGRAM' }
            ]);
        }

        if (!localStorage.getItem(DATA_KEYS.archivedCollections)) {
            setLocalOnlyJson(DATA_KEYS.archivedCollections, INITIAL_ARCHIVED_COLLECTIONS);
        }

        if (!localStorage.getItem(DATA_KEYS.homeSettings)) {
            setLocalOnlyJson(DATA_KEYS.homeSettings, {
                familyImage: 'assets/img/imtekku-family.jpg',
                showLatestActivities: true,
                careersOpen: true
            });
        }

        if (!localStorage.getItem(DATA_KEYS.recruitmentSettings)) {
            setLocalOnlyJson(DATA_KEYS.recruitmentSettings, INITIAL_RECRUITMENT_SETTINGS);
        }
    }

    function normalizeLegacyDataLabels() {
        let hasChanged = false;
        const legacyRoleMap = Object.freeze({
            'coo': 'First Secretary',
            'chief operating officer': 'First Secretary',
            'secgen': 'Second Secretary',
            'secretary general': 'Second Secretary',
            'cfo': 'First Treasurer',
            'chief financial officer': 'First Treasurer',
            'treasury': 'Second Treasurer',
            'treasury director': 'Second Treasurer'
        });

        const teamData = getJson(DATA_KEYS.team, []);
        if (Array.isArray(teamData) && teamData.length > 0) {
            const normalizedTeam = teamData.map((member) => {
                const currentRole = typeof member.role === 'string'
                    ? member.role.trim()
                    : '';
                const mappedRole = legacyRoleMap[currentRole.toLowerCase()];

                if (!mappedRole) {
                    return member;
                }

                return {
                    ...member,
                    role: mappedRole
                };
            });

            if (JSON.stringify(normalizedTeam) !== JSON.stringify(teamData)) {
                setLocalOnlyJson(DATA_KEYS.team, normalizedTeam);
                hasChanged = true;
            }
        }

        const galleryCategories = getJson(DATA_KEYS.galleryCategories, []);
        if (Array.isArray(galleryCategories) && galleryCategories.length > 0) {
            const normalizedCategories = galleryCategories.map((category) => ({
                ...category,
                name: typeof category.name === 'string'
                    ? category.name.replace(/carrty/gi, 'CHARITY')
                    : category.name
            }));

            if (JSON.stringify(normalizedCategories) !== JSON.stringify(galleryCategories)) {
                setLocalOnlyJson(DATA_KEYS.galleryCategories, normalizedCategories);
                hasChanged = true;
            }
        }

        const archivedCollections = getJson(DATA_KEYS.archivedCollections, []);
        if (Array.isArray(archivedCollections) && archivedCollections.length > 0) {
            const normalizedArchived = archivedCollections.map((item) => ({
                ...item,
                tag: typeof item.tag === 'string'
                    ? item.tag.replace(/carrty/gi, 'CHARITY')
                    : item.tag
            }));

            if (JSON.stringify(normalizedArchived) !== JSON.stringify(archivedCollections)) {
                setLocalOnlyJson(DATA_KEYS.archivedCollections, normalizedArchived);
                hasChanged = true;
            }
        }

        const homeSettings = getJson(DATA_KEYS.homeSettings, {});
        if (homeSettings && typeof homeSettings === 'object' && !Array.isArray(homeSettings)) {
            const normalizedHomeSettings = {
                ...homeSettings,
                careersOpen: homeSettings.careersOpen === true
            };

            if (JSON.stringify(normalizedHomeSettings) !== JSON.stringify(homeSettings)) {
                setLocalOnlyJson(DATA_KEYS.homeSettings, normalizedHomeSettings);
                hasChanged = true;
            }
        }

        return hasChanged;
    }

    function isInlineImageDataUrl(value) {
        return typeof value === 'string' && value.startsWith('data:image/');
    }

    function shouldRunStorageOptimization() {
        try {
            return localStorage.getItem(STORAGE_OPTIMIZATION_VERSION_KEY) !== STORAGE_OPTIMIZATION_VERSION;
        } catch (error) {
            return false;
        }
    }

    async function optimizeDataUrlForStorage(dataUrl, profile) {
        if (!isInlineImageDataUrl(dataUrl)) {
            return dataUrl;
        }

        const normalizedProfile = profile || {};
        const maxBytes = Math.max(0, Math.floor(Number(normalizedProfile.maxBytes) || 0));
        if (maxBytes > 0 && estimateDataUrlBytes(dataUrl) <= maxBytes) {
            return dataUrl;
        }

        try {
            const optimizedDataUrl = await resizeImage(
                dataUrl,
                Number(normalizedProfile.maxWidth) || 800,
                Number(normalizedProfile.maxHeight) || 800,
                Number(normalizedProfile.quality) || 0.6,
                maxBytes
            );

            if (
                typeof optimizedDataUrl === 'string'
                && optimizedDataUrl.length > 0
                && optimizedDataUrl.length < dataUrl.length
            ) {
                return optimizedDataUrl;
            }

            return dataUrl;
        } catch (error) {
            return dataUrl;
        }
    }

    async function optimizePhotoMapByKey(key, profile) {
        const photoMap = getJson(key, null);
        if (!photoMap || typeof photoMap !== 'object' || Array.isArray(photoMap)) {
            return false;
        }

        let hasChanges = false;
        const nextPhotoMap = { ...photoMap };
        const entries = Object.entries(photoMap);

        for (const [photoId, photoUrl] of entries) {
            const optimizedDataUrl = await optimizeDataUrlForStorage(photoUrl, profile);
            if (optimizedDataUrl !== photoUrl) {
                nextPhotoMap[photoId] = optimizedDataUrl;
                hasChanges = true;
            }
        }

        if (!hasChanges) {
            return false;
        }

        try {
            setLocalOnlyJson(key, nextPhotoMap);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function optimizeGalleryItemsByKey(key, profile) {
        const galleryItems = getJson(key, []);
        if (!Array.isArray(galleryItems) || galleryItems.length === 0) {
            return false;
        }

        let hasChanges = false;
        const nextGalleryItems = [];

        for (const item of galleryItems) {
            if (!item || typeof item !== 'object') {
                nextGalleryItems.push(item);
                continue;
            }

            const optimizedUrl = await optimizeDataUrlForStorage(item.url, profile);
            if (optimizedUrl !== item.url) {
                nextGalleryItems.push({ ...item, url: optimizedUrl });
                hasChanges = true;
            } else {
                nextGalleryItems.push(item);
            }
        }

        if (!hasChanges) {
            return false;
        }

        try {
            setLocalOnlyJson(key, nextGalleryItems);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function optimizeArchivedCollectionsByKey(key, profile) {
        const archivedCollections = getJson(key, []);
        if (!Array.isArray(archivedCollections) || archivedCollections.length === 0) {
            return false;
        }

        let hasChanges = false;
        const nextArchivedCollections = [];

        for (const item of archivedCollections) {
            if (!item || typeof item !== 'object') {
                nextArchivedCollections.push(item);
                continue;
            }

            const optimizedUrl = await optimizeDataUrlForStorage(item.url, profile);
            if (optimizedUrl !== item.url) {
                nextArchivedCollections.push({ ...item, url: optimizedUrl });
                hasChanges = true;
            } else {
                nextArchivedCollections.push(item);
            }
        }

        if (!hasChanges) {
            return false;
        }

        try {
            setLocalOnlyJson(key, nextArchivedCollections);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function optimizeHomeSettingsByKey(key, profile) {
        const homeSettings = getJson(key, {});
        if (!homeSettings || typeof homeSettings !== 'object' || Array.isArray(homeSettings)) {
            return false;
        }

        const optimizedFamilyImage = await optimizeDataUrlForStorage(homeSettings.familyImage, profile);
        if (optimizedFamilyImage === homeSettings.familyImage) {
            return false;
        }

        try {
            setLocalOnlyJson(key, {
                ...homeSettings,
                familyImage: optimizedFamilyImage
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async function optimizeStorageUsageOnce() {
        if (!shouldRunStorageOptimization()) {
            return false;
        }

        const changedKeys = [];

        if (await optimizePhotoMapByKey(DATA_KEYS.teamPhotos, STORAGE_OPTIMIZATION_PROFILES.member)) {
            changedKeys.push(DATA_KEYS.teamPhotos);
        }

        if (await optimizePhotoMapByKey(DATA_KEYS.divisionPhotos, STORAGE_OPTIMIZATION_PROFILES.member)) {
            changedKeys.push(DATA_KEYS.divisionPhotos);
        }

        if (await optimizeGalleryItemsByKey(DATA_KEYS.gallery, STORAGE_OPTIMIZATION_PROFILES.gallery)) {
            changedKeys.push(DATA_KEYS.gallery);
        }

        if (await optimizeArchivedCollectionsByKey(DATA_KEYS.archivedCollections, STORAGE_OPTIMIZATION_PROFILES.archived)) {
            changedKeys.push(DATA_KEYS.archivedCollections);
        }

        if (await optimizeHomeSettingsByKey(DATA_KEYS.homeSettings, STORAGE_OPTIMIZATION_PROFILES.homeFamily)) {
            changedKeys.push(DATA_KEYS.homeSettings);
        }

        if (changedKeys.length > 0) {
            changedKeys.forEach((key) => {
                if (CLOUD_SYNC_KEYS.includes(key)) {
                    dirtyCloudKeys.add(key);
                }
            });
            dispatchDataSyncEvent('local', changedKeys);
            void pushCloudPayload(collectLocalCloudPayload(), changedKeys);
        }

        try {
            localStorage.setItem(STORAGE_OPTIMIZATION_VERSION_KEY, STORAGE_OPTIMIZATION_VERSION);
        } catch (error) {
            // Ignore write failure; optimization can run again in next load.
        }

        return changedKeys.length > 0;
    }

    function ensureDataInitialized() {
        if (hasInitialized) {
            return;
        }

        setDefaultDataIfMissing();

        const pullState = pullCloudStateSync();
        if (pullState.ok && pullState.hasRemoteData) {
            setDefaultDataIfMissing();
        }

        if (pullState.ok && !pullState.hasRemoteData) {
            void pushCloudPayload(collectLocalCloudPayload());
        }

        if (normalizeLegacyDataLabels()) {
            void pushCloudPayload(collectLocalCloudPayload());
        }

        hasInitialized = true;
        lastCloudSyncAt = Date.now();
        void requestPersistentStorageOnce();
        void optimizeStorageUsageOnce();
        startAutoCloudSync();
    }

    function getJson(key, fallbackValue) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallbackValue;
        } catch (error) {
            return fallbackValue;
        }
    }

    function setJson(key, value) {
        try {
            const jsonString = JSON.stringify(value);
            localStorage.setItem(key, jsonString);
            if (CLOUD_SYNC_KEYS.includes(key)) {
                dirtyCloudKeys.add(key);
            }
            void pushCloudKey(key, value);
            dispatchDataSyncEvent('local', [key]);
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert('PENYIMPANAN PENUH: Memori browser Anda penuh. Mohon hapus beberapa pendaftar/foto yang tidak perlu, atau gunakan tombol "RESET DATABASE" di tab Settings (Admin) untuk mengosongkan memori.');
            } else {
                console.error('setJson Error:', error);
            }
            throw error; // Re-throw so caller knows it failed
        }
    }

    function setBodyScrollLocked(isLocked) {
        document.body.style.overflow = isLocked ? 'hidden' : 'auto';
    }

    function showModal(modalElement) {
        if (!modalElement) {
            return;
        }

        modalElement.style.display = 'block';
        setBodyScrollLocked(true);
    }

    function hideModal(modalElement) {
        if (!modalElement) {
            return;
        }

        modalElement.style.display = 'none';
        setBodyScrollLocked(false);
    }

    function normalizeAutoCloudSyncOptions(options = {}) {
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        const visibleIntervalMs = Math.round(clampNumber(
            normalizedOptions.visibleIntervalMs,
            CLOUD_SYNC_MIN_INTERVAL_MS,
            CLOUD_SYNC_MAX_INTERVAL_MS,
            CLOUD_SYNC_DEFAULT_INTERVAL_MS
        ));
        const hiddenIntervalMs = Math.round(clampNumber(
            normalizedOptions.hiddenIntervalMs,
            CLOUD_SYNC_MIN_INTERVAL_MS,
            CLOUD_SYNC_MAX_INTERVAL_MS,
            CLOUD_SYNC_BACKGROUND_INTERVAL_MS
        ));
        const focusDebounceMs = Math.round(clampNumber(
            normalizedOptions.focusDebounceMs,
            250,
            10000,
            CLOUD_SYNC_FOCUS_DEBOUNCE_MS
        ));

        return {
            visibleIntervalMs,
            hiddenIntervalMs: Math.max(visibleIntervalMs, hiddenIntervalMs),
            focusDebounceMs
        };
    }

    function getActiveAutoCloudIntervalMs() {
        return document.visibilityState === 'hidden'
            ? autoCloudSyncHiddenIntervalMs
            : autoCloudSyncVisibleIntervalMs;
    }

    function clearAutoCloudSyncTimer() {
        if (autoCloudSyncTimerId === null) {
            return;
        }

        clearTimeout(autoCloudSyncTimerId);
        autoCloudSyncTimerId = null;
    }

    function scheduleAutoCloudSync(runImmediately = false) {
        if (!autoCloudSyncStarted) {
            return;
        }

        clearAutoCloudSyncTimer();
        const delayMs = runImmediately ? 0 : getActiveAutoCloudIntervalMs();

        autoCloudSyncTimerId = window.setTimeout(() => {
            autoCloudSyncTimerId = null;
            void runAutoCloudSyncCycle('timer');
        }, delayMs);
    }

    async function runAutoCloudSyncCycle(trigger = 'timer') {
        if (!autoCloudSyncStarted) {
            return false;
        }

        if (trigger !== 'timer') {
            const now = Date.now();
            if (now - lastAutoCloudSignalAt < autoCloudSyncFocusDebounceMs) {
                scheduleAutoCloudSync(false);
                return false;
            }
            lastAutoCloudSignalAt = now;
        }

        const hasCloudChanges = await syncFromCloudAsync();
        scheduleAutoCloudSync(false);
        return hasCloudChanges;
    }

    function bindAutoCloudSyncListeners() {
        if (autoCloudSyncListenersBound) {
            return;
        }

        autoCloudSyncListenersBound = true;

        window.addEventListener('focus', () => {
            void runAutoCloudSyncCycle('focus');
        });

        window.addEventListener('online', () => {
            void runAutoCloudSyncCycle('online');
        });

        document.addEventListener('visibilitychange', () => {
            if (!autoCloudSyncStarted) {
                return;
            }

            if (document.visibilityState === 'visible') {
                void runAutoCloudSyncCycle('visibility');
                return;
            }

            scheduleAutoCloudSync(false);
        });
    }

    function startAutoCloudSync(options = {}) {
        const normalizedOptions = normalizeAutoCloudSyncOptions(options);

        if (!autoCloudSyncStarted) {
            autoCloudSyncVisibleIntervalMs = normalizedOptions.visibleIntervalMs;
            autoCloudSyncHiddenIntervalMs = normalizedOptions.hiddenIntervalMs;
            autoCloudSyncFocusDebounceMs = normalizedOptions.focusDebounceMs;
            autoCloudSyncStarted = true;
            bindAutoCloudSyncListeners();
            scheduleAutoCloudSync(true);
        } else {
            autoCloudSyncVisibleIntervalMs = Math.min(autoCloudSyncVisibleIntervalMs, normalizedOptions.visibleIntervalMs);
            autoCloudSyncHiddenIntervalMs = Math.min(autoCloudSyncHiddenIntervalMs, normalizedOptions.hiddenIntervalMs);
            autoCloudSyncFocusDebounceMs = Math.min(autoCloudSyncFocusDebounceMs, normalizedOptions.focusDebounceMs);
            autoCloudSyncHiddenIntervalMs = Math.max(autoCloudSyncVisibleIntervalMs, autoCloudSyncHiddenIntervalMs);
            scheduleAutoCloudSync(false);
        }

        return Object.freeze({
            started: autoCloudSyncStarted,
            visibleIntervalMs: autoCloudSyncVisibleIntervalMs,
            hiddenIntervalMs: autoCloudSyncHiddenIntervalMs,
            focusDebounceMs: autoCloudSyncFocusDebounceMs
        });
    }

    async function syncFromCloudAsync() {
        if (inFlightCloudSyncPromise) {
            return inFlightCloudSyncPromise;
        }

        if (Date.now() - lastCloudSyncAt < CLOUD_SYNC_COOLDOWN_MS) {
            return false;
        }

        inFlightCloudSyncPromise = (async () => {
            const isDirtyFlushed = await flushDirtyCloudKeysAsync();
            if (!isDirtyFlushed) {
                return false;
            }

            const pullState = await pullCloudStateAsync();
            if (pullState.ok && pullState.hasRemoteData) {
                if (Array.isArray(pullState.changedKeys) && pullState.changedKeys.length > 0) {
                    dispatchDataSyncEvent('cloud', pullState.changedKeys);
                }
                return true;
            }

            return false;
        })();

        try {
            return await inFlightCloudSyncPromise;
        } finally {
            lastCloudSyncAt = Date.now();
            inFlightCloudSyncPromise = null;
        }
    }

    function syncFromCloudNow() {
        if (inFlightCloudSyncPromise) {
            return false;
        }

        if (Date.now() - lastCloudSyncAt < CLOUD_SYNC_COOLDOWN_MS) {
            return false;
        }

        if (dirtyCloudKeys.size > 0) {
            return false;
        }

        const pullState = pullCloudStateSync();
        lastCloudSyncAt = Date.now();

        if (pullState.ok && pullState.hasRemoteData) {
            if (Array.isArray(pullState.changedKeys) && pullState.changedKeys.length > 0) {
                dispatchDataSyncEvent('cloud', pullState.changedKeys);
            }
            return true;
        }

        return false;
    }

    function syncToCloudNow() {
        void pushCloudPayload(collectLocalCloudPayload());
    }

    async function requestPersistentStorageOnce() {
        if (hasRequestedPersistentStorage) {
            return false;
        }

        hasRequestedPersistentStorage = true;

        if (!navigator.storage || typeof navigator.storage.persist !== 'function') {
            return false;
        }

        try {
            return navigator.storage.persist();
        } catch (error) {
            return false;
        }
    }

    function getCloudSyncStatus() {
        return Object.freeze({
            configured: isCloudSyncConfigured(),
            databaseUrl: normalizeCloudDatabaseUrl(CLOUD_SYNC_CONFIG.databaseUrl)
        });
    }

    function clampNumber(value, minValue, maxValue, fallbackValue) {
        const normalizedValue = Number(value);
        if (!Number.isFinite(normalizedValue)) {
            return fallbackValue;
        }

        return Math.min(maxValue, Math.max(minValue, normalizedValue));
    }

    function estimateDataUrlBytes(dataUrl) {
        if (typeof dataUrl !== 'string') {
            return 0;
        }

        const commaIndex = dataUrl.indexOf(',');
        if (commaIndex < 0) {
            return 0;
        }

        const payload = dataUrl.slice(commaIndex + 1);
        if (!payload) {
            return 0;
        }

        const paddingLength = payload.endsWith('==')
            ? 2
            : payload.endsWith('=')
                ? 1
                : 0;
        return Math.max(0, Math.floor((payload.length * 3) / 4) - paddingLength);
    }

    function getPreferredImageMimeType() {
        if (preferredImageMimeType) {
            return preferredImageMimeType;
        }

        try {
            const canvas = document.createElement('canvas');
            const sample = canvas.toDataURL('image/webp', 0.6);
            preferredImageMimeType = sample.startsWith('data:image/webp')
                ? 'image/webp'
                : 'image/jpeg';
        } catch (error) {
            preferredImageMimeType = 'image/jpeg';
        }

        return preferredImageMimeType;
    }

    function encodeCanvasDataUrl(canvas, mimeType, quality) {
        try {
            return canvas.toDataURL(mimeType, quality);
        } catch (error) {
            try {
                return canvas.toDataURL('image/jpeg', quality);
            } catch (fallbackError) {
                return '';
            }
        }
    }

    function resizeImage(dataUrl, maxWidth = 600, maxHeight = 600, quality = 0.6, targetMaxBytes = 0) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const safeMaxWidth = Math.max(120, Math.round(Number(maxWidth) || 600));
                const safeMaxHeight = Math.max(120, Math.round(Number(maxHeight) || 600));
                let width = img.width;
                let height = img.height;

                if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
                    resolve(dataUrl);
                    return;
                }

                if (width > height) {
                    if (width > safeMaxWidth) {
                        height = Math.round(height * (safeMaxWidth / width));
                        width = safeMaxWidth;
                    }
                } else {
                    if (height > safeMaxHeight) {
                        width = Math.round(width * (safeMaxHeight / height));
                        height = safeMaxHeight;
                    }
                }

                const createCanvas = (canvasWidth, canvasHeight, source) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        return null;
                    }

                    if (source) {
                        ctx.drawImage(source, 0, 0, canvasWidth, canvasHeight);
                    } else {
                        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                    }

                    return canvas;
                };

                let workingCanvas = createCanvas(width, height, null);
                if (!workingCanvas) {
                    resolve(dataUrl);
                    return;
                }

                let workingQuality = clampNumber(quality, 0.35, 0.92, 0.6);
                const maxBytes = Math.max(0, Math.floor(Number(targetMaxBytes) || 0));
                const preferredMimeType = getPreferredImageMimeType();
                const renderOutput = () => encodeCanvasDataUrl(workingCanvas, preferredMimeType, workingQuality);

                let output = renderOutput();
                if (!output) {
                    resolve(dataUrl);
                    return;
                }

                if (maxBytes > 0) {
                    let attempts = 0;
                    while (estimateDataUrlBytes(output) > maxBytes && attempts < 12) {
                        attempts += 1;

                        if (workingQuality > 0.4) {
                            workingQuality = Math.max(0.4, workingQuality - 0.08);
                        } else {
                            const nextWidth = Math.max(120, Math.round(workingCanvas.width * 0.88));
                            const nextHeight = Math.max(120, Math.round(workingCanvas.height * 0.88));
                            if (nextWidth === workingCanvas.width && nextHeight === workingCanvas.height) {
                                break;
                            }

                            const scaledCanvas = createCanvas(nextWidth, nextHeight, workingCanvas);
                            if (!scaledCanvas) {
                                break;
                            }

                            workingCanvas = scaledCanvas;
                            workingQuality = Math.min(0.55, workingQuality + 0.03);
                        }

                        output = renderOutput();
                        if (!output) {
                            resolve(dataUrl);
                            return;
                        }
                    }
                }

                resolve(output);
            };
            img.onerror = (err) => reject(err);
            img.src = dataUrl;
        });
    }

    window.AppUtils = Object.freeze({
        DIVISION_LABELS,
        STORAGE_KEYS,
        DATA_KEYS,
        ensureDataInitialized,
        getJson,
        setJson,
        startAutoCloudSync,
        syncFromCloudNow,
        syncFromCloudAsync,
        syncToCloudNow,
        getCloudSyncStatus,
        setBodyScrollLocked,
        showModal,
        hideModal,
        resizeImage
    });

    ensureDataInitialized();
})();
