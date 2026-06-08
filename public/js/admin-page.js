(() => {
    const appUtils = window.AppUtils || {};
    const divisionLabels = appUtils.DIVISION_LABELS || {
        acara: 'Events',
        humas: 'Public Relations',
        sponsor: 'Sponsorship',
        logistik: 'Logistics',
        psdm: 'HR Development (Student/Human Resources)',
        medfo: 'Media & Information'
    };

    const storageKeys = appUtils.STORAGE_KEYS || {
        applicants: 'applicants',
        adminLoggedIn: 'adminLoggedIn'
    };

    const DATA_KEYS = appUtils.DATA_KEYS || {
        team: 'imtekkuTeamData',
        divisions: 'imtekkuDivisionData',
        teamPhotos: 'imtekkuTeamPhotos',
        divisionPhotos: 'imtekkuDivisionMemberPhotos',
        homeSettings: 'imtekkuHomeSettings',
        recruitmentSettings: 'imtekkuRecruitmentSettings'
    };

    const HOME_SETTINGS_DEFAULT = {
        familyImage: 'assets/img/imtekku-family.jpg',
        showLatestActivities: true,
        careersOpen: false
    };
    const RECRUITMENT_TIMELINE_DEFAULT = [
        { phase: 'PHASE 1', title: 'APPLICATION WINDOW', date: 'JANUARY 2026' },
        { phase: 'PHASE 2', title: 'ADMINISTRATIVE SCREENING', date: 'FEBRUARY 2026' },
        { phase: 'PHASE 3', title: 'PROFESSIONAL INTERVIEW', date: 'FEBRUARY 2026' },
        { phase: 'PHASE 4', title: 'OFFICIAL ONBOARDING', date: 'MARCH 2026' }
    ];
    const RECRUITMENT_REQUIREMENTS_DEFAULT = [
        { id: 'cv', label: 'Upload CV', type: 'file', required: true, accept: '.pdf,.doc,.docx' },
        { id: 'portfolio', label: 'Upload Portfolio', type: 'file', required: false, accept: '.pdf,.ppt,.pptx,.zip' }
    ];
    const DEFAULT_DIVISION_STAFF_TARGET = 14;
    const DIVISION_STAFF_TARGETS = Object.freeze({
        acara: 10,
        humas: 10,
        sponsor: 8,
        logistik: 13,
        psdm: 9
    });
    const MAX_UPLOAD_FILE_BYTES = 10 * 1024 * 1024;
    const IMAGE_STORAGE_PROFILES = Object.freeze({
        archived: Object.freeze({ maxWidth: 900, maxHeight: 900, quality: 0.58, maxBytes: 160 * 1024 }),
        gallery: Object.freeze({ maxWidth: 900, maxHeight: 900, quality: 0.56, maxBytes: 150 * 1024 }),
        member: Object.freeze({ maxWidth: 720, maxHeight: 720, quality: 0.56, maxBytes: 95 * 1024 }),
        homeFamily: Object.freeze({ maxWidth: 1440, maxHeight: 810, quality: 0.58, maxBytes: 240 * 1024 })
    });
    const MAX_UPLOAD_FILE_LABEL = '';

    function initializeMemberData() {
        appUtils.ensureDataInitialized();
    }

    const getJson = appUtils.getJson;
    const setJson = appUtils.setJson;
    const showModal = appUtils.showModal;
    const hideModal = appUtils.hideModal;
    const nativeAlert = typeof window.alert === 'function'
        ? window.alert.bind(window)
        : () => { };
    const nativeConfirm = typeof window.confirm === 'function'
        ? window.confirm.bind(window)
        : () => false;
    let appConfirmResolver = null;

    const state = {
        applicants: [],
        filteredApplicants: [],
        deleteId: null,
        searchTerm: '',
        selectedDivision: 'all',
        lastApplicantsSnapshot: '[]',
        activeTab: 'applicants',
        selectedMediaDivision: 'acara',
        selectedArchivedId: null,
        recruitmentRequirementsDraft: null,
        detailFileRegistry: {},
        pendingEditPhotoDataUrl: null
    };

    function isFileTooLarge(file) {
        return Boolean(file && Number(file.size) > MAX_UPLOAD_FILE_BYTES);
    }

    function showUploadLimitAlert(file, label = 'File') {
        const fileName = file && file.name ? ` "${file.name}"` : '';
        alert(`${label}${fileName} melebihi batas maksimal. Mohon kompres foto Anda menjadi lebih kecil menggunakan tool online/aplikasi lain lalu upload ulang.`);
    }

    async function optimizeImageForStorage(rawDataUrl, profile) {
        const resizeImage = window.AppUtils && typeof window.AppUtils.resizeImage === 'function'
            ? window.AppUtils.resizeImage
            : null;

        if (!resizeImage) {
            return rawDataUrl;
        }

        const normalizedProfile = profile || {};
        return resizeImage(
            rawDataUrl,
            Number(normalizedProfile.maxWidth) || 800,
            Number(normalizedProfile.maxHeight) || 800,
            Number(normalizedProfile.quality) || 0.6,
            Number(normalizedProfile.maxBytes) || 0
        );
    }

    function createArchivedId() {
        return `arch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }

    function normalizeArchivedId(rawId) {
        const value = String(rawId ?? '').trim();
        return value || '';
    }

    function escapeInlineJsString(value) {
        return String(value ?? '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'");
    }

    function commitArchivedCollections(archivedCollections) {
        try {
            setJson(appUtils.DATA_KEYS.archivedCollections, archivedCollections);
            return true;
        } catch (error) {
            alert('Penyimpanan arsip gagal disimpan. Kurangi ukuran/ jumlah foto lalu coba lagi.');
            return false;
        }
    }

    function getArchivedCollectionsNormalized() {
        const rawCollections = getJson(appUtils.DATA_KEYS.archivedCollections, []);
        if (!Array.isArray(rawCollections)) {
            return [];
        }

        const usedIds = new Set();
        let hasUpdatedIds = false;
        const normalizedCollections = rawCollections
            .filter((item) => item && typeof item === 'object')
            .map((item) => {
                const normalizedCurrentId = normalizeArchivedId(item.id);
                let nextId = normalizedCurrentId;

                if (!nextId || usedIds.has(nextId)) {
                    nextId = createArchivedId();
                    while (usedIds.has(nextId)) {
                        nextId = createArchivedId();
                    }
                    hasUpdatedIds = true;
                }

                usedIds.add(nextId);

                if (nextId !== normalizedCurrentId) {
                    return { ...item, id: nextId };
                }

                return item;
            });

        if (hasUpdatedIds) {
            commitArchivedCollections(normalizedCollections);
        }

        return normalizedCollections;
    }

    const elements = {
        totalApplicants: document.getElementById('totalApplicants'),
        acaraCount: document.getElementById('acaraCount'),
        humasCount: document.getElementById('humasCount'),
        sponsorCount: document.getElementById('sponsorCount'),
        logistikCount: document.getElementById('logistikCount'),
        psdmCount: document.getElementById('psdmCount'),
        medfoCount: document.getElementById('medfoCount'),
        searchInput: document.getElementById('searchInput'),
        divisionFilter: document.getElementById('divisionFilter'),
        tableBody: document.getElementById('tableBody'),
        emptyState: document.getElementById('emptyState'),
        detailModal: document.getElementById('detailModal'),
        detailRequirements: document.getElementById('detailRequirements'),
        detailSkills: document.getElementById('detailSkills'),
        detailExperience: document.getElementById('detailExperience'),
        deleteModal: document.getElementById('deleteModal'),
        appAlertModal: document.getElementById('appAlertModal'),
        appAlertTitle: document.getElementById('appAlertTitle'),
        appAlertMessage: document.getElementById('appAlertMessage'),
        appAlertOkBtn: document.getElementById('appAlertOkBtn'),
        appConfirmModal: document.getElementById('appConfirmModal'),
        appConfirmTitle: document.getElementById('appConfirmTitle'),
        appConfirmMessage: document.getElementById('appConfirmMessage'),
        appConfirmOkBtn: document.getElementById('appConfirmOkBtn'),
        appConfirmCancelBtn: document.getElementById('appConfirmCancelBtn'),
        tabs: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        teamMemberList: document.getElementById('teamMemberList'),
        newTeamMemberName: document.getElementById('newTeamMemberName'),
        newTeamMemberRole: document.getElementById('newTeamMemberRole'),
        newTeamMemberNim: document.getElementById('newTeamMemberNim'),
        newTeamMemberMajor: document.getElementById('newTeamMemberMajor'),
        newTeamMemberInstagram: document.getElementById('newTeamMemberInstagram'),
        newTeamMemberPhoto: document.getElementById('newTeamMemberPhoto'),
        addTeamMemberBtn: document.getElementById('addTeamMemberBtn'),
        divisionMemberList: document.getElementById('divisionMemberList'),
        divisionPhotoFilter: document.getElementById('divisionPhotoFilter'),
        newDivisionStaffName: document.getElementById('newDivisionStaffName'),
        newDivisionStaffNim: document.getElementById('newDivisionStaffNim'),
        newDivisionStaffMajor: document.getElementById('newDivisionStaffMajor'),
        newDivisionStaffInstagram: document.getElementById('newDivisionStaffInstagram'),
        newDivisionStaffPhoto: document.getElementById('newDivisionStaffPhoto'),
        addDivisionStaffBtn: document.getElementById('addDivisionStaffBtn'),
        divisionStaffLimitNote: document.getElementById('divisionStaffLimitNote'),
        galleryAdminList: document.getElementById('galleryAdminList'),
        galleryUploadInput: document.getElementById('galleryUploadInput'),
        galleryCategoryFilter: document.getElementById('galleryCategoryFilter'),
        categoryAdminList: document.getElementById('categoryAdminList'),
        newCategoryName: document.getElementById('newCategoryName'),
        archivedAdminList: document.getElementById('archivedAdminList'),
        newArchivedTitle: document.getElementById('newArchivedTitle'),
        newArchivedTag: document.getElementById('newArchivedTag'),
        newArchivedDate: document.getElementById('newArchivedDate'),
        newArchivedDesc: document.getElementById('newArchivedDesc'),
        newArchivedPhoto: document.getElementById('newArchivedPhoto'),
        addArchivedRecordBtn: document.getElementById('addArchivedRecordBtn'),
        homeFamilyUpload: document.getElementById('homeFamilyUpload'),
        homeFamilyPreview: document.getElementById('homeFamilyPreview'),
        homeGalleryVisibilityStatus: document.getElementById('homeGalleryVisibilityStatus'),
        homeGalleryToggleBtn: document.getElementById('homeGalleryToggleBtn'),
        careersAccessStatus: document.getElementById('careersAccessStatus'),
        careersAccessToggleBtn: document.getElementById('careersAccessToggleBtn'),
        saveRecruitmentTimelineBtn: document.getElementById('saveRecruitmentTimelineBtn'),
        requirementLabelInput: document.getElementById('requirementLabelInput'),
        requirementTypeInput: document.getElementById('requirementTypeInput'),
        requirementAcceptInput: document.getElementById('requirementAcceptInput'),
        requirementRequiredInput: document.getElementById('requirementRequiredInput'),
        addRecruitmentRequirementBtn: document.getElementById('addRecruitmentRequirementBtn'),
        saveRecruitmentRequirementsBtn: document.getElementById('saveRecruitmentRequirementsBtn'),
        recruitmentRequirementsAdminList: document.getElementById('recruitmentRequirementsAdminList'),
        editMemberModal: document.getElementById('editMemberModal'),
        editMemberForm: document.getElementById('editMemberForm'),
        editMemberZoom: document.getElementById('editMemberZoom'),
        zoomValue: document.getElementById('zoomValue')
    };

    function getApplicantsSnapshot() {
        return window.ImtekkuStore.getItem(storageKeys.applicants) || '[]';
    }

    function showAppAlert(message, title = 'NOTIFICATION') {
        const alertMessage = String(message ?? '').trim() || 'No message.';
        const alertTitle = String(title ?? '').trim() || 'NOTIFICATION';

        if (!elements.appAlertModal || !elements.appAlertMessage || !elements.appAlertTitle) {
            nativeAlert(alertMessage);
            return;
        }

        elements.appAlertTitle.textContent = alertTitle;
        elements.appAlertMessage.textContent = alertMessage;
        showModal(elements.appAlertModal);
    }

    function closeAppAlert() {
        hideModal(elements.appAlertModal);
    }

    function installCustomAlert() {
        window.alert = (message) => {
            showAppAlert(message, 'UPDATE STATUS');
        };
    }

    function resolveAppConfirm(result) {
        if (appConfirmResolver) {
            const resolve = appConfirmResolver;
            appConfirmResolver = null;
            hideModal(elements.appConfirmModal);
            resolve(Boolean(result));
            return;
        }

        hideModal(elements.appConfirmModal);
    }

    function closeAppConfirm() {
        resolveAppConfirm(false);
    }

    function acceptAppConfirm() {
        resolveAppConfirm(true);
    }

    function showAppConfirm(message, title = 'CONFIRM ACTION', confirmLabel = 'CONFIRM', cancelLabel = 'CANCEL') {
        const confirmMessage = String(message ?? '').trim() || 'Proceed with this action?';
        const confirmTitle = String(title ?? '').trim() || 'CONFIRM ACTION';

        if (
            !elements.appConfirmModal ||
            !elements.appConfirmTitle ||
            !elements.appConfirmMessage ||
            !elements.appConfirmOkBtn ||
            !elements.appConfirmCancelBtn
        ) {
            return Promise.resolve(nativeConfirm(confirmMessage));
        }

        if (appConfirmResolver) {
            const previousResolve = appConfirmResolver;
            appConfirmResolver = null;
            previousResolve(false);
        }

        elements.appConfirmTitle.textContent = confirmTitle;
        elements.appConfirmMessage.textContent = confirmMessage;
        elements.appConfirmOkBtn.textContent = String(confirmLabel || 'CONFIRM').toUpperCase();
        elements.appConfirmCancelBtn.textContent = String(cancelLabel || 'CANCEL').toUpperCase();

        showModal(elements.appConfirmModal);

        return new Promise((resolve) => {
            appConfirmResolver = resolve;
            setTimeout(() => {
                if (elements.appConfirmOkBtn) {
                    elements.appConfirmOkBtn.focus();
                }
            }, 0);
        });
    }

    function switchTab(tabId) {
        state.activeTab = tabId;
        elements.tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        elements.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}Tab` || content.id === `${tabId}View`);
        });
        if (tabId === 'media') renderMediaManagement();
        if (tabId === 'gallery') renderGalleryManagement();
        if (tabId === 'archived') renderArchivedManagement();
        if (tabId === 'settings') renderSettings();
        window.scrollTo(0, 0);
    }

    function renderArchivedManagement() {
        if (!elements.archivedAdminList) return;
        const archived = getArchivedCollectionsNormalized();
        elements.archivedAdminList.innerHTML = archived.map(item => `
            <div class="member-admin-item" style="padding: 1.5rem; flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        ${item.url ? `<img src="${item.url}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : `<div style="width: 40px; height: 40px; background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem;">NO PIC</div>`}
                        <h4 style="margin: 0; color: var(--corp-navy);">${item.title}</h4>
                    </div>
                    <span style="font-size: 0.7rem; background: var(--corp-gold); padding: 2px 8px; border-radius: 4px; font-weight: 800;">${item.tag}</span>
                </div>
                <p style="margin: 0; font-size: 0.85rem; color: #666;">Date: ${item.date}</p>
                <p style="margin: 0; font-size: 0.85rem; font-style: italic;">${item.desc}</p>
                <div class="admin-actions" style="margin-top: 1rem; width: 100%; justify-content: flex-end; gap: 0.5rem;">
                    <button class="upload-icon-btn" onclick="window.editArchivedRecord('${escapeInlineJsString(item.id)}')">EDIT</button>
                    <button class="delete-icon-btn" onclick="window.deleteArchivedRecord('${escapeInlineJsString(item.id)}')">DELETE</button>
                </div>
            </div>
        `).join('') || '<div style="text-align: center; padding: 2rem; color: #999;">No records found.</div>';
    }

    function editArchivedRecord(id) {
        const targetId = normalizeArchivedId(id);
        if (!targetId) return;

        const archived = getArchivedCollectionsNormalized();
        const item = archived.find((record) => normalizeArchivedId(record.id) === targetId);
        if (!item) return;

        elements.newArchivedTitle.value = item.title;
        elements.newArchivedTag.value = item.tag;
        elements.newArchivedDate.value = item.date;
        elements.newArchivedDesc.value = item.desc;
        state.selectedArchivedId = targetId;

        const addBtn = elements.addArchivedRecordBtn;
        if (addBtn) {
            addBtn.textContent = 'UPDATE ARCHIVED RECORD';
            addBtn.style.background = 'var(--corp-gold)';
        }
        window.scrollTo(0, 0);
    }

    async function addArchivedRecord() {
        const title = elements.newArchivedTitle.value.trim();
        const tag = elements.newArchivedTag.value.trim().toUpperCase();
        const date = elements.newArchivedDate.value.trim().toUpperCase();
        const desc = elements.newArchivedDesc.value.trim();
        const photoFile = elements.newArchivedPhoto.files[0];

        if (!title || !tag || !date) { alert('Please fill in all required fields.'); return; }

        const saveRecord = (url = null) => {
            const archived = getArchivedCollectionsNormalized();

            if (state.selectedArchivedId) {
                const selectedId = normalizeArchivedId(state.selectedArchivedId);
                const index = archived.findIndex((record) => normalizeArchivedId(record.id) === selectedId);
                if (index !== -1) {
                    const oldRecord = archived[index];
                    archived[index] = { ...oldRecord, title, tag, date, desc, url: url || oldRecord.url };
                }
                state.selectedArchivedId = null;
            } else {
                archived.push({ id: createArchivedId(), title, tag, date, desc, url });
            }

            if (!commitArchivedCollections(archived)) {
                return;
            }

            elements.newArchivedTitle.value = '';
            elements.newArchivedTag.value = '';
            elements.newArchivedDate.value = '';
            elements.newArchivedDesc.value = '';
            elements.newArchivedPhoto.value = '';

            const addBtn = elements.addArchivedRecordBtn;
            if (addBtn) {
                addBtn.textContent = 'ADD TO ARCHIVE';
                addBtn.style.background = 'var(--corp-navy)';
            }

            renderArchivedManagement();
            alert('Archive updated successfully!');
        };

        if (photoFile) {
            if (isFileTooLarge(photoFile)) { showUploadLimitAlert(photoFile, 'Foto'); return; }
            try {
                const rawDataUrl = await readFileAsDataUrl(photoFile);
                const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.archived);
                saveRecord(downsizedDataUrl);
            } catch (e) {
                alert('Gagal memproses foto.');
            }
        } else {
            saveRecord();
        }
    }

    async function deleteArchivedRecord(id) {
        const targetId = normalizeArchivedId(id);
        if (!targetId) return;

        const shouldDelete = await showAppConfirm(
            'Permanently delete this archived record?',
            'DELETE ARCHIVED RECORD',
            'DELETE',
            'CANCEL'
        );
        if (!shouldDelete) return;

        let archived = getArchivedCollectionsNormalized();
        archived = archived.filter((record) => normalizeArchivedId(record.id) !== targetId);
        if (!commitArchivedCollections(archived)) {
            return;
        }

        if (state.selectedArchivedId === targetId) {
            state.selectedArchivedId = null;
        }
        renderArchivedManagement();
    }

    function renderSettings() {
        const settings = getHomeSettings();

        if (elements.homeFamilyPreview) {
            elements.homeFamilyPreview.innerHTML = `<img src="${settings.familyImage}" style="width: 100%; height: 100%; object-fit: cover;">`;
        }

        if (elements.homeGalleryVisibilityStatus) {
            const isVisible = settings.showLatestActivities !== false;
            elements.homeGalleryVisibilityStatus.textContent = isVisible
                ? 'Status: section LATEST ACTIVITIES tampil di homepage.'
                : 'Status: section LATEST ACTIVITIES disembunyikan dari homepage.';
        }

        if (elements.homeGalleryToggleBtn) {
            const isVisible = settings.showLatestActivities !== false;
            elements.homeGalleryToggleBtn.textContent = isVisible
                ? 'HIDE LATEST ACTIVITIES SECTION'
                : 'SHOW LATEST ACTIVITIES SECTION';
            elements.homeGalleryToggleBtn.style.background = isVisible ? '#b42318' : 'var(--corp-navy)';
        }

        if (elements.careersAccessStatus) {
            elements.careersAccessStatus.textContent = settings.careersOpen
                ? 'Status: menu CAREERS terbuka untuk publik.'
                : 'Status: menu CAREERS disembunyikan untuk publik (Coming Soon mode aktif).';
        }

        if (elements.careersAccessToggleBtn) {
            elements.careersAccessToggleBtn.textContent = settings.careersOpen
                ? 'SET CAREERS TO COMING SOON'
                : 'OPEN CAREERS FOR PUBLIC';
            elements.careersAccessToggleBtn.style.background = settings.careersOpen ? '#b42318' : 'var(--corp-navy)';
        }

        renderRecruitmentTimelineEditor();
        renderRecruitmentRequirementsEditor();
        syncRequirementAcceptInput();
    }

    async function handleHomeFamilyUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (isFileTooLarge(file)) { showUploadLimitAlert(file, 'Foto'); return; }
        try {
            const rawDataUrl = await readFileAsDataUrl(file);
            const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.homeFamily);
            const settings = getHomeSettings();
            settings.familyImage = downsizedDataUrl;
            setJson(DATA_KEYS.homeSettings, settings);
            renderSettings();
            alert('Home Family Image Updated!');
        } catch (err) {
            alert('Gagal memproses foto.');
        }
    }

    function getHomeSettings() {
        const settings = getJson(DATA_KEYS.homeSettings, HOME_SETTINGS_DEFAULT);

        return {
            familyImage: settings.familyImage || HOME_SETTINGS_DEFAULT.familyImage,
            showLatestActivities: settings.showLatestActivities !== false,
            careersOpen: settings.careersOpen === true
        };
    }

    function getInputValueById(id, fallback = '') {
        const input = document.getElementById(id);
        if (!input) {
            return fallback;
        }

        return String(input.value || '').trim() || fallback;
    }

    function normalizeRequirementType(rawType) {
        const typeValue = String(rawType || '').trim().toLowerCase();
        if (typeValue === 'text' || typeValue === 'textarea') {
            return typeValue;
        }

        return 'file';
    }

    function normalizeRecruitmentRequirements(requirements) {
        const source = Array.isArray(requirements) ? requirements : RECRUITMENT_REQUIREMENTS_DEFAULT;

        return source
            .map((requirement, index) => {
                const label = String(requirement.label || '').trim();
                if (!label) return null;

                const type = normalizeRequirementType(requirement.type);
                const normalizedRequirement = {
                    id: String(requirement.id || `req-${Date.now()}-${index}`),
                    label,
                    type,
                    required: requirement.required !== false
                };

                if (type === 'file') {
                    normalizedRequirement.accept = String(requirement.accept || '').trim();
                }

                return normalizedRequirement;
            })
            .filter(Boolean);
    }

    function getRecruitmentSettings() {
        const rawSettings = getJson(DATA_KEYS.recruitmentSettings, {});
        const timelineRaw = Array.isArray(rawSettings.timeline) ? rawSettings.timeline : [];
        const requirementsRaw = Array.isArray(rawSettings.requirements)
            ? rawSettings.requirements
            : RECRUITMENT_REQUIREMENTS_DEFAULT;

        const timeline = RECRUITMENT_TIMELINE_DEFAULT.map((defaultItem, index) => {
            const sourceItem = timelineRaw[index] || {};
            return {
                phase: String(sourceItem.phase || defaultItem.phase).trim() || defaultItem.phase,
                title: String(sourceItem.title || defaultItem.title).trim() || defaultItem.title,
                date: String(sourceItem.date || defaultItem.date).trim() || defaultItem.date
            };
        });

        const requirements = normalizeRecruitmentRequirements(requirementsRaw);
        return { timeline, requirements };
    }

    function collectTimelineFromEditor() {
        return RECRUITMENT_TIMELINE_DEFAULT.map((defaultItem, index) => {
            const row = index + 1;
            return {
                phase: getInputValueById(`timelinePhase${row}`, defaultItem.phase),
                title: getInputValueById(`timelineTitle${row}`, defaultItem.title),
                date: getInputValueById(`timelineDate${row}`, defaultItem.date)
            };
        });
    }

    function renderRecruitmentTimelineEditor() {
        const { timeline } = getRecruitmentSettings();

        timeline.forEach((item, index) => {
            const row = index + 1;
            const phaseInput = document.getElementById(`timelinePhase${row}`);
            const titleInput = document.getElementById(`timelineTitle${row}`);
            const dateInput = document.getElementById(`timelineDate${row}`);

            if (phaseInput) phaseInput.value = item.phase;
            if (titleInput) titleInput.value = item.title;
            if (dateInput) dateInput.value = item.date;
        });
    }

    function requirementTypeLabel(type) {
        if (type === 'text') return 'SHORT TEXT';
        if (type === 'textarea') return 'PARAGRAPH';
        return 'FILE UPLOAD';
    }

    function syncRequirementAcceptInput() {
        if (!elements.requirementTypeInput || !elements.requirementAcceptInput) {
            return;
        }

        const selectedType = normalizeRequirementType(elements.requirementTypeInput.value);
        const isFileType = selectedType === 'file';
        elements.requirementAcceptInput.disabled = !isFileType;
        elements.requirementAcceptInput.placeholder = isFileType
            ? 'Allowed file type: .pdf,.doc,.docx'
            : 'Not used for this field type';
    }

    function renderRecruitmentRequirementsEditor() {
        if (!elements.recruitmentRequirementsAdminList) {
            return;
        }

        const { requirements } = getRecruitmentSettings();
        state.recruitmentRequirementsDraft = requirements.map((item) => ({ ...item }));

        const list = state.recruitmentRequirementsDraft;
        if (!list.length) {
            elements.recruitmentRequirementsAdminList.innerHTML = '<div style="text-align: center; padding: 1rem; color: #999;">No requirements configured.</div>';
            return;
        }

        elements.recruitmentRequirementsAdminList.innerHTML = list.map((requirement) => `
            <div class="requirements-admin-item">
                <div class="requirements-admin-main">
                    <h4>${requirement.label}</h4>
                    <p class="requirements-admin-meta">
                        ${requirementTypeLabel(requirement.type)} | ${requirement.required ? 'REQUIRED' : 'OPTIONAL'}${requirement.type === 'file' && requirement.accept ? ` | ${requirement.accept}` : ''}
                    </p>
                </div>
                <button class="delete-icon-btn" onclick="window.removeRecruitmentRequirement('${requirement.id}')" title="Remove Requirement">REMOVE</button>
            </div>
        `).join('');
    }

    function addRecruitmentRequirement() {
        const label = elements.requirementLabelInput ? elements.requirementLabelInput.value.trim() : '';
        const type = normalizeRequirementType(elements.requirementTypeInput ? elements.requirementTypeInput.value : 'file');
        const required = elements.requirementRequiredInput ? elements.requirementRequiredInput.checked : true;
        const accept = elements.requirementAcceptInput ? elements.requirementAcceptInput.value.trim() : '';

        if (!label) {
            alert('Requirement label wajib diisi.');
            return;
        }

        if (!Array.isArray(state.recruitmentRequirementsDraft)) {
            state.recruitmentRequirementsDraft = getRecruitmentSettings().requirements.map((item) => ({ ...item }));
        }

        state.recruitmentRequirementsDraft.push({
            id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            label,
            type,
            required,
            accept: type === 'file' ? accept : ''
        });

        if (elements.requirementLabelInput) elements.requirementLabelInput.value = '';
        if (elements.requirementAcceptInput) elements.requirementAcceptInput.value = '';
        if (elements.requirementTypeInput) elements.requirementTypeInput.value = 'file';
        if (elements.requirementRequiredInput) elements.requirementRequiredInput.checked = true;
        syncRequirementAcceptInput();
        renderRecruitmentRequirementsFromDraft();
    }

    function renderRecruitmentRequirementsFromDraft() {
        if (!elements.recruitmentRequirementsAdminList) {
            return;
        }

        const list = normalizeRecruitmentRequirements(state.recruitmentRequirementsDraft || []);
        state.recruitmentRequirementsDraft = list;

        if (!list.length) {
            elements.recruitmentRequirementsAdminList.innerHTML = '<div style="text-align: center; padding: 1rem; color: #999;">No requirements configured.</div>';
            return;
        }

        elements.recruitmentRequirementsAdminList.innerHTML = list.map((requirement) => `
            <div class="requirements-admin-item">
                <div class="requirements-admin-main">
                    <h4>${requirement.label}</h4>
                    <p class="requirements-admin-meta">
                        ${requirementTypeLabel(requirement.type)} | ${requirement.required ? 'REQUIRED' : 'OPTIONAL'}${requirement.type === 'file' && requirement.accept ? ` | ${requirement.accept}` : ''}
                    </p>
                </div>
                <button class="delete-icon-btn" onclick="window.removeRecruitmentRequirement('${requirement.id}')" title="Remove Requirement">REMOVE</button>
            </div>
        `).join('');
    }

    function removeRecruitmentRequirement(requirementId) {
        if (!Array.isArray(state.recruitmentRequirementsDraft)) {
            state.recruitmentRequirementsDraft = getRecruitmentSettings().requirements.map((item) => ({ ...item }));
        }

        state.recruitmentRequirementsDraft = state.recruitmentRequirementsDraft
            .filter((item) => item.id !== requirementId);

        renderRecruitmentRequirementsFromDraft();
    }

    function saveRecruitmentTimelineSettings() {
        const timeline = collectTimelineFromEditor();
        const requirements = normalizeRecruitmentRequirements(
            Array.isArray(state.recruitmentRequirementsDraft)
                ? state.recruitmentRequirementsDraft
                : getRecruitmentSettings().requirements
        );

        setJson(DATA_KEYS.recruitmentSettings, { timeline, requirements });
        alert('Recruitment timeline updated successfully!');
    }

    function saveRecruitmentRequirements() {
        const timeline = collectTimelineFromEditor();
        const requirements = normalizeRecruitmentRequirements(state.recruitmentRequirementsDraft || []);
        setJson(DATA_KEYS.recruitmentSettings, { timeline, requirements });
        renderRecruitmentRequirementsFromDraft();
        alert('Recruitment requirements updated successfully!');
    }

    function toggleHomeGalleryVisibility() {
        const settings = getHomeSettings();
        settings.showLatestActivities = !settings.showLatestActivities;
        setJson(DATA_KEYS.homeSettings, settings);
        renderSettings();
        alert(settings.showLatestActivities
            ? 'Section LATEST ACTIVITIES ditampilkan di homepage.'
            : 'Section LATEST ACTIVITIES disembunyikan dari homepage.');
    }

    function toggleCareersAccess() {
        const settings = getHomeSettings();
        settings.careersOpen = !settings.careersOpen;
        setJson(DATA_KEYS.homeSettings, settings);
        renderSettings();
        alert(settings.careersOpen
            ? 'Menu CAREERS sekarang terbuka untuk publik.'
            : 'Menu CAREERS dikunci ke mode Coming Soon untuk publik.');
    }

    function renderGalleryManagement() {
        renderCategoryAdmin();
        const categories = getJson(DATA_KEYS.galleryCategories, []);
        const gallery = getJson(DATA_KEYS.gallery, []);

        // Update category filter dropdown
        if (elements.galleryCategoryFilter) {
            const currentVal = elements.galleryCategoryFilter.value;
            elements.galleryCategoryFilter.innerHTML = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
            if (currentVal && categories.find(c => c.id === currentVal)) {
                elements.galleryCategoryFilter.value = currentVal;
            } else if (categories.length > 0 && !currentVal) {
                elements.galleryCategoryFilter.value = categories[0].id;
            }
        }

        if (!elements.galleryAdminList) return;

        const selectedCat = elements.galleryCategoryFilter ? elements.galleryCategoryFilter.value : 'roadshow';
        const filteredGallery = gallery.filter(item => item.category === selectedCat);

        elements.galleryAdminList.innerHTML = filteredGallery.length > 0 ? filteredGallery.map(item => `
            <div class="gallery-admin-item" style="position: relative; aspect-ratio: 1; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <img src="${item.url}" alt="Gallery" style="width: 100%; height: 100%; object-fit: cover;">
                <button onclick="window.deleteGalleryItem('${item.id}')" style="position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,0.7); color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">🗑️</button>
            </div>
        `).join('') : '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No photos in this section.</div>';
    }

    function renderCategoryAdmin() {
        if (!elements.categoryAdminList) return;
        const categories = getJson(DATA_KEYS.galleryCategories, []);
        elements.categoryAdminList.innerHTML = categories.map(cat => `
            <div class="member-admin-item" style="padding: 1rem;">
                <div class="member-admin-info">
                    <h4>${cat.name}</h4>
                    <p>ID: ${cat.id}</p>
                </div>
                <div class="admin-actions">
                    <button class="delete-icon-btn" onclick="window.deleteGalleryCategory('${cat.id}')" title="Delete Section">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    function addGalleryCategory() {
        const name = elements.newCategoryName.value.trim();
        if (!name) return;
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const categories = getJson(DATA_KEYS.galleryCategories, []);

        if (categories.find(c => c.id === id)) { alert('Section ID already exists!'); return; }

        categories.push({ id, name: name.toUpperCase() });
        setJson(DATA_KEYS.galleryCategories, categories);
        elements.newCategoryName.value = '';
        renderGalleryManagement();
    }

    async function deleteGalleryCategory(id) {
        if (id === 'roadshow' || id === 'carrty') { alert('Cannot delete default sections.'); return; }
        const shouldDelete = await showAppConfirm(
            'Delete this section and all its photos?',
            'DELETE DOCUMENTATION SECTION',
            'DELETE',
            'CANCEL'
        );
        if (!shouldDelete) return;

        let categories = getJson(DATA_KEYS.galleryCategories, []);
        categories = categories.filter(c => c.id !== id);
        setJson(DATA_KEYS.galleryCategories, categories);

        let gallery = getJson(DATA_KEYS.gallery, []);
        gallery = gallery.filter(item => item.category !== id);
        setJson(DATA_KEYS.gallery, gallery);

        renderGalleryManagement();
    }

    async function handleGalleryUpload(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const category = elements.galleryCategoryFilter.value;
        const gallery = getJson(DATA_KEYS.gallery, []);

        const validFiles = files.filter((file) => {
            if (!isFileTooLarge(file)) {
                return true;
            }

            showUploadLimitAlert(file, 'File');
            return false;
        });

        if (!validFiles.length) {
            e.target.value = '';
            return;
        }

        for (const file of validFiles) {
            try {
                const rawDataUrl = await readFileAsDataUrl(file);
                const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.gallery);

                gallery.unshift({
                    id: 'gal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    url: downsizedDataUrl,
                    category: category,
                    date: new Date().toISOString()
                });
            } catch (err) {
                console.error('Gagal memproses gallery upload:', err);
            }
        }

        setJson(DATA_KEYS.gallery, gallery);
        renderGalleryManagement();
        e.target.value = '';
    }

    async function deleteGalleryItem(id) {
        const shouldDelete = await showAppConfirm(
            'Delete this photo from gallery?',
            'DELETE PHOTO',
            'DELETE',
            'CANCEL'
        );
        if (!shouldDelete) return;
        let gallery = getJson(DATA_KEYS.gallery, []);
        gallery = gallery.filter(item => item.id !== id);
        setJson(DATA_KEYS.gallery, gallery);
        renderGalleryManagement();
    }

    function normalizeInstagramValue(rawValue) {
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

    function clearTeamMemberInputs() {
        if (elements.newTeamMemberName) elements.newTeamMemberName.value = '';
        if (elements.newTeamMemberRole) elements.newTeamMemberRole.value = '';
        if (elements.newTeamMemberNim) elements.newTeamMemberNim.value = '';
        if (elements.newTeamMemberMajor) elements.newTeamMemberMajor.value = '';
        if (elements.newTeamMemberInstagram) elements.newTeamMemberInstagram.value = '';
        if (elements.newTeamMemberPhoto) elements.newTeamMemberPhoto.value = '';
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function addTeamMember() {
        const fullName = elements.newTeamMemberName ? elements.newTeamMemberName.value.trim() : '';
        const role = elements.newTeamMemberRole ? elements.newTeamMemberRole.value.trim() : '';
        const nim = elements.newTeamMemberNim ? elements.newTeamMemberNim.value.trim() : '';
        const major = elements.newTeamMemberMajor ? elements.newTeamMemberMajor.value.trim() : '';
        const instagramRaw = elements.newTeamMemberInstagram ? elements.newTeamMemberInstagram.value.trim() : '';
        const instagram = normalizeInstagramValue(instagramRaw);
        const photoFile = elements.newTeamMemberPhoto ? elements.newTeamMemberPhoto.files[0] : null;

        if (!fullName) {
            alert('Nama anggota wajib diisi.');
            return;
        }

        if (photoFile && isFileTooLarge(photoFile)) {
            showUploadLimitAlert(photoFile, 'Foto');
            return;
        }

        const memberId = `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const team = getJson(DATA_KEYS.team, []);

        if (photoFile) {
            try {
                const rawDataUrl = await readFileAsDataUrl(photoFile);
                const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.member);
                const photos = getPhotos(DATA_KEYS.teamPhotos);
                photos[memberId] = downsizedDataUrl;
                setJson(DATA_KEYS.teamPhotos, photos);
            } catch (e) {
                alert('Gagal memproses foto.');
                return;
            }
        }

        team.push({
            id: memberId,
            name: fullName,
            role: role || 'Organizational Core',
            nim: nim || '-',
            major: major || 'Telkom University',
            instagram,
            zoom: 100
        });

        setJson(DATA_KEYS.team, team);
        clearTeamMemberInputs();
        renderTeamManagement();
        alert('Anggota Organizational Core berhasil ditambahkan.');
    }

    async function deleteTeamMember(memberId) {
        const team = getJson(DATA_KEYS.team, []);
        const targetMember = team.find((member) => member.id === memberId);

        if (!targetMember) {
            return;
        }

        const shouldDelete = await showAppConfirm(
            `Hapus anggota "${targetMember.name}" dari Organizational Core?`,
            'HAPUS ANGGOTA',
            'HAPUS',
            'BATAL'
        );
        if (!shouldDelete) {
            return;
        }

        const updatedTeam = team.filter((member) => member.id !== memberId);
        setJson(DATA_KEYS.team, updatedTeam);

        const teamPhotos = getPhotos(DATA_KEYS.teamPhotos);
        if (teamPhotos[memberId]) {
            delete teamPhotos[memberId];
            setJson(DATA_KEYS.teamPhotos, teamPhotos);
        }

        renderTeamManagement();
        alert('Anggota Organizational Core berhasil dihapus.');
    }

    function getDivisionStaffTarget(divisionKey) {
        return DIVISION_STAFF_TARGETS[divisionKey] || DEFAULT_DIVISION_STAFF_TARGET;
    }

    function clearDivisionStaffInputs() {
        if (elements.newDivisionStaffName) elements.newDivisionStaffName.value = '';
        if (elements.newDivisionStaffNim) elements.newDivisionStaffNim.value = '';
        if (elements.newDivisionStaffMajor) elements.newDivisionStaffMajor.value = '';
        if (elements.newDivisionStaffInstagram) elements.newDivisionStaffInstagram.value = '';
        if (elements.newDivisionStaffPhoto) elements.newDivisionStaffPhoto.value = '';
    }

    function updateDivisionStaffLimitStatus(currentCount, targetCount, divisionKey) {
        if (elements.divisionStaffLimitNote) {
            const reachedTarget = currentCount >= targetCount;
            elements.divisionStaffLimitNote.textContent = reachedTarget
                ? `Current staff: ${currentCount} (${mapDivisionLabel(divisionKey)}). Target awal ${targetCount} sudah terpenuhi, admin tetap bisa menambahkan staff.`
                : `Current staff: ${currentCount}/${targetCount} (${mapDivisionLabel(divisionKey)})`;
        }

        if (elements.addDivisionStaffBtn) {
            elements.addDivisionStaffBtn.disabled = false;
            elements.addDivisionStaffBtn.textContent = 'ADD STAFF';
        }
    }

    async function addDivisionStaff() {
        const divisionKey = state.selectedMediaDivision;
        const allDivisions = getJson(DATA_KEYS.divisions, {});
        const members = Array.isArray(allDivisions[divisionKey]) ? [...allDivisions[divisionKey]] : [];

        const fullName = elements.newDivisionStaffName ? elements.newDivisionStaffName.value.trim() : '';
        const nim = elements.newDivisionStaffNim ? elements.newDivisionStaffNim.value.trim() : '';
        const major = elements.newDivisionStaffMajor ? elements.newDivisionStaffMajor.value.trim() : '';
        const instagramRaw = elements.newDivisionStaffInstagram ? elements.newDivisionStaffInstagram.value.trim() : '';
        const instagram = normalizeInstagramValue(instagramRaw);
        const photoFile = elements.newDivisionStaffPhoto ? elements.newDivisionStaffPhoto.files[0] : null;

        if (!fullName) {
            alert('Nama staff wajib diisi.');
            return;
        }

        if (photoFile && isFileTooLarge(photoFile)) {
            showUploadLimitAlert(photoFile, 'Foto');
            return;
        }

        const staffId = `${divisionKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        if (photoFile) {
            try {
                const rawDataUrl = await readFileAsDataUrl(photoFile);
                const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.member);
                const photos = getPhotos(DATA_KEYS.divisionPhotos);
                photos[staffId] = downsizedDataUrl;
                setJson(DATA_KEYS.divisionPhotos, photos);
            } catch (e) {
                alert('Gagal memproses foto.');
                return;
            }
        }

        members.push({
            id: staffId,
            name: fullName,
            role: 'Anggota Divisi',
            nim: nim || '-',
            major: major || 'Telkom University',
            instagram: instagram || '',
            zoom: 100
        });

        allDivisions[divisionKey] = members;
        setJson(DATA_KEYS.divisions, allDivisions);
        clearDivisionStaffInputs();
        renderDivisionManagement();
        alert('Staff baru berhasil ditambahkan.');
    }

    async function deleteDivisionStaff(memberId) {
        const divisionKey = state.selectedMediaDivision;
        const allDivisions = getJson(DATA_KEYS.divisions, {});
        const members = Array.isArray(allDivisions[divisionKey]) ? [...allDivisions[divisionKey]] : [];
        const targetMember = members.find((member) => member.id === memberId);

        if (!targetMember) {
            return;
        }

        const shouldDelete = await showAppConfirm(
            `Hapus staff "${targetMember.name}" dari ${mapDivisionLabel(divisionKey)}?`,
            'HAPUS STAFF',
            'HAPUS',
            'BATAL'
        );
        if (!shouldDelete) {
            return;
        }

        allDivisions[divisionKey] = members.filter((member) => member.id !== memberId);
        setJson(DATA_KEYS.divisions, allDivisions);

        const divisionPhotos = getPhotos(DATA_KEYS.divisionPhotos);
        if (divisionPhotos[memberId]) {
            delete divisionPhotos[memberId];
            setJson(DATA_KEYS.divisionPhotos, divisionPhotos);
        }

        renderDivisionManagement();
        alert('Staff berhasil dihapus.');
    }

    function renderTeamManagement() {
        const team = getJson(DATA_KEYS.team, []);
        const photos = getPhotos(DATA_KEYS.teamPhotos);
        elements.teamMemberList.innerHTML = team.map(member => `
            <div class="member-admin-item">
                <div class="member-admin-photo">
                    <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                        ${photos[member.id] ? `<img src="${photos[member.id]}" alt="Photo" style="transform: scale(${member.zoom / 100}); width: 100%; height: 100%; object-fit: cover;">` : `<span>${member.name[0]}</span>`}
                    </div>
                </div>
                <div class="member-admin-info">
                    <h4>${member.name}</h4>
                    <p>${member.role} | NIM: ${member.nim}</p>
                </div>
                <div class="admin-actions">
                    <button class="upload-icon-btn" onclick="window.showEditMember('team', '${member.id}')" title="Edit Profile Page">EDIT PROFILE</button>
                    <button class="delete-icon-btn" onclick="window.deleteTeamMember('${member.id}')" title="Delete Member">REMOVE MEMBER</button>
                    <button class="delete-icon-btn" onclick="window.adminPhotoDelete('${DATA_KEYS.teamPhotos}', '${member.id}')" title="Remove Photo">REMOVE PHOTO</button>
                </div>
            </div>
        `).join('') || '<div style="text-align: center; padding: 1rem; color: #999;">Belum ada anggota Organizational Core.</div>';
    }

    function renderDivisionManagement() {
        const divisionKey = state.selectedMediaDivision;
        const allDivisions = getJson(DATA_KEYS.divisions, {});
        const members = allDivisions[divisionKey] || [];
        const targetStaff = getDivisionStaffTarget(divisionKey);
        const photos = getPhotos(DATA_KEYS.divisionPhotos);
        updateDivisionStaffLimitStatus(members.length, targetStaff, divisionKey);
        elements.divisionMemberList.innerHTML = members.map(member => `
            <div class="member-admin-item">
                <div class="member-admin-photo">
                    <div style="width: 100%; height: 100%; overflow: hidden; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                        ${photos[member.id] ? `<img src="${photos[member.id]}" alt="Photo" style="transform: scale(${member.zoom / 100}); width: 100%; height: 100%; object-fit: cover;">` : `<span>${member.name[0]}</span>`}
                    </div>
                </div>
                <div class="member-admin-info">
                    <h4>${member.name}</h4>
                    <p>${member.role} | NIM: ${member.nim}</p>
                </div>
                <div class="admin-actions">
                    <button class="upload-icon-btn" onclick="window.showEditMember('division', '${member.id}')" title="Edit Profile Page">EDIT PROFILE</button>
                    <button class="delete-icon-btn" onclick="window.deleteDivisionStaff('${member.id}')" title="Delete Staff">REMOVE STAFF</button>
                    <button class="delete-icon-btn" onclick="window.adminPhotoDelete('${DATA_KEYS.divisionPhotos}', '${member.id}')" title="Remove Photo">REMOVE PHOTO</button>
                </div>
            </div>
        `).join('') || '<div style="text-align: center; padding: 1rem; color: #999;">Belum ada staff di divisi ini.</div>';
    }

    function updateEditPreview() {
        const zoom = document.getElementById('editMemberZoom').value;
        const previewImg = document.querySelector('#editPhotoPreview img');
        if (previewImg) {
            previewImg.style.transform = `scale(${zoom / 100})`;
        }
        document.getElementById('zoomValue').textContent = `${zoom}%`;
    }

    function showEditMember(type, id) {
        const dataKey = type === 'team' ? DATA_KEYS.team : DATA_KEYS.divisions;
        const photoKey = type === 'team' ? DATA_KEYS.teamPhotos : DATA_KEYS.divisionPhotos;
        const allData = getJson(dataKey, type === 'team' ? [] : {});
        const photos = getPhotos(photoKey);

        let member;
        if (type === 'team') member = allData.find(m => m.id === id);
        else { const div = id.split('-')[0]; member = allData[div].find(m => m.id === id); }

        if (!member) return;
        state.pendingEditPhotoDataUrl = null;

        const editPhotoInput = document.getElementById('editMemberPhotoInput');
        if (editPhotoInput) {
            editPhotoInput.value = '';
        }

        // Fill form fields
        document.getElementById('editMemberId').value = member.id;
        document.getElementById('editMemberType').value = type;
        document.getElementById('editMemberName').value = member.name;
        document.getElementById('editMemberNim').value = member.nim || '';
        document.getElementById('editMemberInstagram').value = member.instagram || '';
        document.getElementById('editMemberMajor').value = member.major || '';
        document.getElementById('editMemberZoom').value = member.zoom || 100;
        document.getElementById('zoomValue').textContent = `${member.zoom || 100}%`;

        // Render Photo Preview
        const previewContainer = document.getElementById('editPhotoPreview');
        if (photos[id]) {
            previewContainer.innerHTML = `<img src="${photos[id]}" style="width: 100%; height: 100%; object-fit: cover; transform: scale(${(member.zoom || 100) / 100})">`;
        } else {
            previewContainer.innerHTML = `<div style="font-size: 3rem; color: #ccc;">${member.name[0]}</div>`;
        }

        switchTab('editMember');
    }

    async function handleEditMemberSubmit(event) {
        event.preventDefault();
        const type = document.getElementById('editMemberType').value;
        const id = document.getElementById('editMemberId').value;
        const photoInput = document.getElementById('editMemberPhotoInput');
        const dataKey = type === 'team' ? DATA_KEYS.team : DATA_KEYS.divisions;
        const allData = getJson(dataKey, type === 'team' ? [] : {});

        const updatedProfile = {
            name: document.getElementById('editMemberName').value,
            nim: document.getElementById('editMemberNim').value,
            instagram: normalizeInstagramValue(document.getElementById('editMemberInstagram').value),
            major: document.getElementById('editMemberMajor').value,
            zoom: parseInt(document.getElementById('editMemberZoom').value)
        };

        if (photoInput && photoInput.files && photoInput.files[0]) {
            const photoFile = photoInput.files[0];
            if (isFileTooLarge(photoFile)) {
                showUploadLimitAlert(photoFile, 'Foto');
                return;
            }
            try {
                let downsizedDataUrl = state.pendingEditPhotoDataUrl;
                if (!downsizedDataUrl) {
                    const rawDataUrl = await readFileAsDataUrl(photoFile);
                    downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.member);
                }
                const photoKey = type === 'team' ? DATA_KEYS.teamPhotos : DATA_KEYS.divisionPhotos;
                const photos = getPhotos(photoKey);
                photos[id] = downsizedDataUrl;
                setJson(photoKey, photos);
                state.pendingEditPhotoDataUrl = null;
            } catch (err) {
                alert('Gagal memproses foto baru.');
            }
        }

        if (type === 'team') {
            const index = allData.findIndex(m => m.id === id);
            if (index !== -1) {
                allData[index] = { ...allData[index], ...updatedProfile };
                setJson(DATA_KEYS.team, allData);
            }
        } else {
            const div = id.split('-')[0];
            const index = allData[div].findIndex(m => m.id === id);
            if (index !== -1) {
                allData[div][index] = { ...allData[div][index], ...updatedProfile };
                setJson(DATA_KEYS.divisions, allData);
            }
        }

        alert('Profile Updated Successfully!');
        state.pendingEditPhotoDataUrl = null;
        if (photoInput) {
            photoInput.value = '';
        }
        switchTab('media');
    }

    function renderMediaManagement() {
        renderTeamManagement();
        renderDivisionManagement();
    }

    function getPhotos(key) {
        return getJson(key, {});
    }

    async function deletePhoto(key, id) {
        const shouldDelete = await showAppConfirm(
            'Hapus foto ini?',
            'HAPUS FOTO',
            'HAPUS',
            'BATAL'
        );
        if (!shouldDelete) return;
        const photos = getPhotos(key);
        delete photos[id];
        setJson(key, photos);
        renderMediaManagement();
    }

    async function handlePhotoUpload(key, id, e) {
        const file = e.target.files[0];
        if (!file) return;
        if (isFileTooLarge(file)) { showUploadLimitAlert(file, 'Foto'); return; }
        try {
            const rawDataUrl = await readFileAsDataUrl(file);
            const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.member);
            const photos = getPhotos(key);
            photos[id] = downsizedDataUrl;
            setJson(key, photos);
            renderMediaManagement();
        } catch (err) {
            alert('Gagal memproses foto.');
        }
    }

    function loadApplicants() {
        state.applicants = getJson(storageKeys.applicants, []);
        state.lastApplicantsSnapshot = JSON.stringify(state.applicants);
        updateStatistics();
        applyFilters();
    }

    function mapDivisionLabel(key) {
        return divisionLabels[key] || key;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatBytes(size) {
        const bytes = Number(size || 0);
        if (!Number.isFinite(bytes) || bytes <= 0) {
            return '';
        }

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        const kb = bytes / 1024;
        if (kb < 1024) {
            return `${kb.toFixed(1)} KB`;
        }

        return `${(kb / 1024).toFixed(1)} MB`;
    }

    function parseDataUrl(dataUrl) {
        if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
            return null;
        }

        const commaIndex = dataUrl.indexOf(',');
        if (commaIndex < 0) {
            return null;
        }

        const meta = dataUrl.slice(5, commaIndex);
        const payload = dataUrl.slice(commaIndex + 1);
        const mimeType = meta.split(';')[0] || 'application/octet-stream';
        const isBase64 = /;base64/i.test(meta);

        try {
            if (isBase64) {
                const binary = atob(payload);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i += 1) {
                    bytes[i] = binary.charCodeAt(i);
                }
                return new Blob([bytes], { type: mimeType });
            }

            return new Blob([decodeURIComponent(payload)], { type: mimeType });
        } catch (error) {
            return null;
        }
    }

    function registerDetailFile(fileData) {
        const fileKey = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        state.detailFileRegistry[fileKey] = fileData;
        return fileKey;
    }

    function openFileViewerModal(fileItem) {
        const existingModal = document.getElementById('fileViewerModal');
        if (existingModal) {
            existingModal.remove();
        }

        const blob = parseDataUrl(fileItem.dataUrl);
        if (!blob) {
            alert('File tidak bisa diproses.');
            return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const mimeType = String(fileItem.type || blob.type || '').toLowerCase();
        const fileName = String(fileItem.name || 'document');
        const isImage = mimeType.startsWith('image/');
        const isPdf = mimeType === 'application/pdf' || /\.pdf$/i.test(fileName);

        const modal = document.createElement('div');
        modal.id = 'fileViewerModal';
        modal.className = 'app-modal is-active file-viewer-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="app-modal-backdrop" data-viewer-close="1"></div>
            <div class="app-modal-content file-viewer-content" role="document">
                <div class="app-modal-header file-viewer-header">
                    <h3 class="app-modal-title">${escapeHtml(fileName)}</h3>
                    <button type="button" class="app-modal-close" data-viewer-close="1" aria-label="Close">×</button>
                </div>
                <div class="file-viewer-body">
                    ${isImage
                ? `<img src="${objectUrl}" alt="${escapeHtml(fileName)}" class="file-viewer-image">`
                : isPdf
                    ? `<iframe src="${objectUrl}" class="file-viewer-iframe" title="${escapeHtml(fileName)}"></iframe>`
                    : `<iframe src="${objectUrl}" class="file-viewer-iframe" title="${escapeHtml(fileName)}"></iframe>`}
                </div>
                <div class="file-viewer-footer">
                    <a href="${objectUrl}" download="${escapeHtml(fileName)}" class="export-btn">DOWNLOAD</a>
                    <button type="button" class="export-btn" style="background: #b42318;" data-viewer-close="1">CLOSE</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');

        const cleanup = () => {
            modal.remove();
            document.body.classList.remove('modal-open');
            URL.revokeObjectURL(objectUrl);
        };

        modal.querySelectorAll('[data-viewer-close="1"]').forEach((el) => {
            el.addEventListener('click', cleanup);
        });

        document.addEventListener('keydown', function onKeydown(event) {
            if (event.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', onKeydown);
            }
        });
    }

    function viewRequirementFile(fileKey) {
        const fileItem = state.detailFileRegistry[fileKey];
        if (!fileItem || typeof fileItem.dataUrl !== 'string') {
            alert('File tidak tersedia.');
            return;
        }

        // Selalu gunakan modal viewer inline agar tidak terblokir popup blocker browser.
        try {
            openFileViewerModal(fileItem);
        } catch (error) {
            alert('Gagal membuka file. Silakan coba lagi.');
        }
    }

    function downloadRequirementFile(fileKey) {
        const fileItem = state.detailFileRegistry[fileKey];
        if (!fileItem || typeof fileItem.dataUrl !== 'string') {
            alert('File tidak tersedia.');
            return;
        }

        const fileName = String(fileItem.name || 'document')
            .replace(/"/g, '')
            .replace(/[<>]/g, '');
        const blob = parseDataUrl(fileItem.dataUrl);

        if (!blob) {
            alert('File tidak bisa diproses.');
            return;
        }

        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    }

    function buildRequirementResponsesMarkup(requirementResponses) {
        const responses = Array.isArray(requirementResponses) ? requirementResponses : [];
        state.detailFileRegistry = {};

        if (!responses.length) {
            return '<div class="detail-requirement-empty">No additional requirements submitted.</div>';
        }

        return responses.map((response, responseIndex) => {
            const label = escapeHtml(response.label || `Requirement ${responseIndex + 1}`);
            const type = String(response.type || '').toLowerCase();

            if (type === 'file') {
                const files = Array.isArray(response.files) ? response.files : [];

                if (!files.length) {
                    return `
                        <div class="detail-requirement-item">
                            <div class="detail-requirement-header">
                                <strong>${label}</strong>
                                <span class="detail-requirement-type">FILE</span>
                            </div>
                            <div class="detail-requirement-value">
                                <span class="detail-requirement-empty">${escapeHtml(response.value || '-')}</span>
                            </div>
                        </div>
                    `;
                }

                const fileLinksMarkup = files.map((file, fileIndex) => {
                    const rawFileName = String(file.name || `File ${fileIndex + 1}`);
                    const fileName = escapeHtml(rawFileName);
                    const safeDownloadName = rawFileName
                        .replace(/"/g, '')
                        .replace(/[<>]/g, '');
                    const fileSizeText = formatBytes(file.size);
                    const safeDataUrl = typeof file.dataUrl === 'string' && file.dataUrl.startsWith('data:')
                        ? file.dataUrl
                        : '';

                    if (!safeDataUrl) {
                        return `<span class="requirement-file-missing">${fileName}${fileSizeText ? ` (${fileSizeText})` : ''} - unavailable</span>`;
                    }

                    const fileKey = registerDetailFile({
                        name: safeDownloadName,
                        type: file.type || 'application/octet-stream',
                        dataUrl: safeDataUrl
                    });

                    return `
                        <div class="requirement-file-card">
                            <span class="requirement-file-name">${fileName}${fileSizeText ? ` (${fileSizeText})` : ''}</span>
                            <div class="requirement-file-actions">
                                <button type="button" class="requirement-file-btn" onclick="window.viewRequirementFile('${fileKey}')">VIEW</button>
                                <button type="button" class="requirement-file-btn is-secondary" onclick="window.downloadRequirementFile('${fileKey}')">DOWNLOAD</button>
                            </div>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="detail-requirement-item">
                        <div class="detail-requirement-header">
                            <strong>${label}</strong>
                            <span class="detail-requirement-type">FILE</span>
                        </div>
                        <div class="detail-requirement-value">${fileLinksMarkup}</div>
                    </div>
                `;
            }

            return `
                <div class="detail-requirement-item">
                    <div class="detail-requirement-header">
                        <strong>${label}</strong>
                        <span class="detail-requirement-type">${type === 'textarea' ? 'PARAGRAPH' : 'TEXT'}</span>
                    </div>
                    <div class="detail-requirement-value">
                        <span class="detail-requirement-text">${escapeHtml(response.value || '-')}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function logout() {
        window.ImtekkuStore.removeItem(storageKeys.adminLoggedIn);
        window.location.href = '../index.html';
    }

    function ensureAdminAuthenticated() {
        if (!window.ImtekkuStore.getItem(storageKeys.adminLoggedIn)) {
            window.location.href = '../index.html';
        }
    }

    function bindEditMemberEvents() {
        if (elements.editMemberForm) {
            elements.editMemberForm.addEventListener('submit', handleEditMemberSubmit);
        }
        if (elements.editMemberZoom) {
            elements.editMemberZoom.addEventListener('input', updateEditPreview);
        }
        const photoInput = document.getElementById('editMemberPhotoInput');
        if (photoInput) {
            photoInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (isFileTooLarge(file)) {
                    showUploadLimitAlert(file, 'Foto');
                    e.target.value = '';
                    state.pendingEditPhotoDataUrl = null;
                    return;
                }

                try {
                    const rawDataUrl = await readFileAsDataUrl(file);
                    const downsizedDataUrl = await optimizeImageForStorage(rawDataUrl, IMAGE_STORAGE_PROFILES.member);
                    state.pendingEditPhotoDataUrl = downsizedDataUrl;
                    const previewContainer = document.getElementById('editPhotoPreview');
                    const zoom = document.getElementById('editMemberZoom').value;
                    previewContainer.innerHTML = `<img src="${downsizedDataUrl}" style="width: 100%; height: 100%; object-fit: cover; transform: scale(${zoom / 100})">`;
                } catch (error) {
                    state.pendingEditPhotoDataUrl = null;
                    alert('Gagal memproses foto baru.');
                }
            });
        }
    }

    function bindTabEvents() {
        elements.tabs.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
        if (elements.addTeamMemberBtn) {
            elements.addTeamMemberBtn.addEventListener('click', addTeamMember);
        }
        if (elements.divisionPhotoFilter) {
            elements.divisionPhotoFilter.addEventListener('change', (e) => {
                state.selectedMediaDivision = e.target.value;
                renderDivisionManagement();
            });
        }
        if (elements.addDivisionStaffBtn) {
            elements.addDivisionStaffBtn.addEventListener('click', addDivisionStaff);
        }
        if (elements.galleryUploadInput) {
            elements.galleryUploadInput.addEventListener('change', handleGalleryUpload);
        }
        if (elements.galleryCategoryFilter) {
            elements.galleryCategoryFilter.addEventListener('change', renderGalleryManagement);
        }
        if (elements.homeFamilyUpload) {
            elements.homeFamilyUpload.addEventListener('change', handleHomeFamilyUpload);
        }
        if (elements.homeGalleryToggleBtn) {
            elements.homeGalleryToggleBtn.addEventListener('click', toggleHomeGalleryVisibility);
        }
        if (elements.careersAccessToggleBtn) {
            elements.careersAccessToggleBtn.addEventListener('click', toggleCareersAccess);
        }
        if (elements.saveRecruitmentTimelineBtn) {
            elements.saveRecruitmentTimelineBtn.addEventListener('click', saveRecruitmentTimelineSettings);
        }
        if (elements.requirementTypeInput) {
            elements.requirementTypeInput.addEventListener('change', syncRequirementAcceptInput);
        }
        if (elements.addRecruitmentRequirementBtn) {
            elements.addRecruitmentRequirementBtn.addEventListener('click', addRecruitmentRequirement);
        }
        if (elements.saveRecruitmentRequirementsBtn) {
            elements.saveRecruitmentRequirementsBtn.addEventListener('click', saveRecruitmentRequirements);
        }
    }

    function applyFilters() {
        const keyword = state.searchTerm.trim().toLowerCase();
        const division = state.selectedDivision;
        state.filteredApplicants = state.applicants.filter(a => {
            const s = keyword.length === 0 || a.fullName.toLowerCase().includes(keyword) || a.nim.toLowerCase().includes(keyword) || a.email.toLowerCase().includes(keyword);
            const d = division === 'all' || a.divisi === division || a.divisi2 === division;
            return s && d;
        });
        renderApplicantsTable();
    }

    function updateStatistics() {
        const counts = { acara: 0, humas: 0, sponsor: 0, logistik: 0, psdm: 0, medfo: 0 };
        state.applicants.forEach(a => { if (counts[a.divisi] !== undefined) counts[a.divisi]++; });
        if (elements.totalApplicants) elements.totalApplicants.textContent = state.applicants.length;
        if (elements.acaraCount) elements.acaraCount.textContent = counts.acara;
        if (elements.humasCount) elements.humasCount.textContent = counts.humas;
        if (elements.sponsorCount) elements.sponsorCount.textContent = counts.sponsor;
        if (elements.logistikCount) elements.logistikCount.textContent = counts.logistik;
        if (elements.psdmCount) elements.psdmCount.textContent = counts.psdm;
        if (elements.medfoCount) elements.medfoCount.textContent = counts.medfo;
    }

    function renderApplicantsTable() {
    if (!elements.tableBody || !elements.emptyState) return;
    if (state.filteredApplicants.length === 0) {
        elements.tableBody.innerHTML = '';
        elements.emptyState.style.display = 'block';
        return;
    }
    elements.emptyState.style.display = 'none';
    elements.tableBody.innerHTML = state.filteredApplicants.map((a, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${a.fullName}</td>
            <td>${a.nim}</td>
            <td>${a.semester}</td>
            <td>${a.email}</td>
            <td>${a.phone}</td>
            <td>${mapDivisionLabel(a.divisi)}</td>
            <td>${a.divisi2 && a.divisi2 !== '-' ? mapDivisionLabel(a.divisi2) : '-'}</td>
            <td>${a.registrationDate}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-detail" onclick="showDetail(${a.id})">Detail</button>
                    <button class="btn-delete" onclick="showDeleteModal(${a.id})">Hapus</button>
                </div>
            </td>
        </tr>`).join('');
}

    function showDetail(id) {
        const a = state.applicants.find(item => item.id === id);
        if (!a || !elements.detailModal) return;
        document.getElementById('detailName').textContent = a.fullName;
        document.getElementById('detailNim').textContent = a.nim;
        document.getElementById('detailSemester').textContent = `Semester ${a.semester}`;
        document.getElementById('detailEmail').textContent = a.email;
        document.getElementById('detailPhone').textContent = a.phone;
        document.getElementById('detailDivisi').textContent = mapDivisionLabel(a.divisi);
        document.getElementById('detailDivisi2').textContent = a.divisi2 && a.divisi2 !== '-' ? mapDivisionLabel(a.divisi2) : '-';
        document.getElementById('detailDate').textContent = a.registrationDate;
        document.getElementById('detailMotivation').textContent = a.motivation || '-';

        if (elements.detailSkills) {
            elements.detailSkills.textContent = a.skills || '-';
        }

        if (elements.detailExperience) {
            elements.detailExperience.textContent = a.experience || '-';
        }

        if (elements.detailRequirements) {
            elements.detailRequirements.innerHTML = buildRequirementResponsesMarkup(a.requirementResponses);
        }

        showModal(elements.detailModal);
    }

    function closeDetailModal() { hideModal(elements.detailModal); }
    function showDeleteModal(id) { state.deleteId = id; showModal(elements.deleteModal); }
    function closeDeleteModal() { hideModal(elements.deleteModal); state.deleteId = null; }

    function confirmDelete() {
        if (state.deleteId === null) return;
        state.applicants = state.applicants.filter(item => item.id !== state.deleteId);
        setJson(storageKeys.applicants, state.applicants);
        closeDeleteModal();
        loadApplicants();
    }

    function exportToExcel() {
        if (!window.XLSX || state.applicants.length === 0) { alert('Export unavailable or no data.'); return; }
        const data = state.applicants.map((a, i) => ({
            No: i + 1,
            'Nama Lengkap': a.fullName,
            NIM: a.nim,
            Semester: a.semester,
            Email: a.email,
            'No. Telepon': a.phone,
            'Divisi 1': mapDivisionLabel(a.divisi),
            'Divisi 2': a.divisi2 && a.divisi2 !== '-' ? mapDivisionLabel(a.divisi2) : '-',
            Tanggal: a.registrationDate
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, 'Rekrutasi_IMTEKKU.xlsx');
    }

    function bindSearchAndFilterEvents() {
        if (elements.searchInput) elements.searchInput.addEventListener('input', e => { state.searchTerm = e.target.value || ''; applyFilters(); });
        if (elements.divisionFilter) elements.divisionFilter.addEventListener('change', e => { state.selectedDivision = e.target.value || 'all'; applyFilters(); });
    }

    function bindModalCloseHandlers() {
        window.addEventListener('click', e => {
            if (e.target === elements.detailModal) closeDetailModal();
            if (e.target === elements.deleteModal) closeDeleteModal();
            if (e.target === elements.appAlertModal) closeAppAlert();
            if (e.target === elements.appConfirmModal) closeAppConfirm();
        });
    }

    function bindKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') { closeDetailModal(); closeDeleteModal(); closeAppAlert(); closeAppConfirm(); }
        });
    }

    function bindAlertEvents() {
        if (elements.appAlertOkBtn) {
            elements.appAlertOkBtn.addEventListener('click', closeAppAlert);
        }
        if (elements.appConfirmOkBtn) {
            elements.appConfirmOkBtn.addEventListener('click', acceptAppConfirm);
        }
        if (elements.appConfirmCancelBtn) {
            elements.appConfirmCancelBtn.addEventListener('click', closeAppConfirm);
        }
    }

    function animateStatisticsCards() {
        const stats = document.querySelectorAll('.stat-info h3');
        stats.forEach((s, i) => {
            s.style.opacity = '0';
            s.style.transform = 'scale(0.5)';
            setTimeout(() => { s.style.transition = 'all 0.5s ease'; s.style.opacity = '1'; s.style.transform = 'scale(1)'; }, i * 100 + 50);
        });
    }

    function refreshAllData() {
        loadApplicants();
        if (state.activeTab === 'media') renderMediaManagement();
        if (state.activeTab === 'gallery') renderGalleryManagement();
        if (state.activeTab === 'archived') renderArchivedManagement();
        if (state.activeTab === 'settings') renderSettings();
    }

    function initAutoRefresh() {
        if (typeof appUtils.startAutoCloudSync === 'function') {
            appUtils.startAutoCloudSync({
                visibleIntervalMs: 3000,
                hiddenIntervalMs: 12000,
                focusDebounceMs: 900
            });
            return;
        }

        setInterval(async () => {
            if (typeof appUtils.syncFromCloudAsync === 'function') {
                await appUtils.syncFromCloudAsync();
            }

            if (getApplicantsSnapshot() !== state.lastApplicantsSnapshot) {
                loadApplicants();
            }
        }, 10000);
    }

    async function resetDatabase() {
        const firstConfirm = await showAppConfirm(
            'Apakah Anda yakin ingin mereset seluruh database? Semua data pendaftar, foto staff, dan galeri akan dihapus permanen.',
            'RESET DATABASE - PERINGATAN 1/2',
            'YA, LANJUTKAN',
            'BATAL'
        );

        if (!firstConfirm) return;

        const secondConfirm = await showAppConfirm(
            'TINDAKAN INI TIDAK DAPAT DIBATALKAN. Semua memori browser akan dibersihkan dan data di cloud akan ikut terhapus. Yakin?',
            'RESET DATABASE - PERINGATAN TERAKHIR 2/2',
            'SAYA YAKIN, HAPUS SEMUA',
            'BATAL'
        );

        if (!secondConfirm) return;

        // Clear all relevant local storage
        window.ImtekkuStore.clear();

        // Sync the empty state to cloud
        if (typeof appUtils.syncToCloudNow === 'function') {
            appUtils.syncToCloudNow();
        }

        alert('Database telah direset. Halaman akan dimuat ulang.');
        window.location.reload();
    }

    // Expose functions to window
    window.resetDatabase = resetDatabase;
    window.switchTab = switchTab;
    window.showEditMember = (type, id) => showEditMember(type, id);
    window.adminPhotoUpload = (key, id, e) => handlePhotoUpload(key, id, e);
    window.adminPhotoDelete = (key, id) => deletePhoto(key, id);
    window.showDetail = showDetail;
    window.closeDetailModal = closeDetailModal;
    window.showDeleteModal = showDeleteModal;
    window.closeDeleteModal = closeDeleteModal;
    window.confirmDelete = confirmDelete;
    window.exportToExcel = exportToExcel;
    window.deleteGalleryItem = (id) => deleteGalleryItem(id);
    window.addGalleryCategory = addGalleryCategory;
    window.deleteGalleryCategory = deleteGalleryCategory;
    window.addArchivedRecord = addArchivedRecord;
    window.editArchivedRecord = editArchivedRecord;
    window.deleteArchivedRecord = deleteArchivedRecord;
    window.removeRecruitmentRequirement = removeRecruitmentRequirement;
    window.viewRequirementFile = viewRequirementFile;
    window.downloadRequirementFile = downloadRequirementFile;
    window.deleteTeamMember = deleteTeamMember;
    window.deleteDivisionStaff = deleteDivisionStaff;
    window.closeAppAlert = closeAppAlert;
    window.closeAppConfirm = closeAppConfirm;
    window.acceptAppConfirm = acceptAppConfirm;
    window.logout = logout;
    window.AppUtils = appUtils;

    ensureAdminAuthenticated();
    const __runAdminInit = () => {
        installCustomAlert();
        initializeMemberData();
        bindSearchAndFilterEvents();
        bindModalCloseHandlers();
        bindKeyboardShortcuts();
        bindAlertEvents();
        bindTabEvents();
        bindEditMemberEvents();
        loadApplicants();
        animateStatisticsCards();
        initAutoRefresh();
        switchTab('applicants');

        const observedStorageKeys = new Set([storageKeys.applicants]);
        if (appUtils.DATA_KEYS && typeof appUtils.DATA_KEYS === 'object') {
            Object.values(appUtils.DATA_KEYS).forEach((key) => {
                if (typeof key === 'string' && key.length > 0) {
                    observedStorageKeys.add(key);
                }
            });
        }

        window.addEventListener('storage', (event) => {
            if (event.key === null || observedStorageKeys.has(event.key)) {
                refreshAllData();
            }
        });

        window.addEventListener('apputils:cloud-sync', () => {
            refreshAllData();
        });
    };
    __runAdminInit();
})();
