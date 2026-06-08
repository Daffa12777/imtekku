(() => {
    const appUtils = window.AppUtils || {};
    if (typeof appUtils.ensureDataInitialized === 'function') {
        appUtils.ensureDataInitialized();
    }

    const storageKeys = appUtils.STORAGE_KEYS || {
        applicants: 'applicants',
        adminLoggedIn: 'adminLoggedIn'
    };

    const dataKeys = appUtils.DATA_KEYS || {
        recruitmentSettings: 'imtekkuRecruitmentSettings',
        homeSettings: 'imtekkuHomeSettings'
    };

    const DEFAULT_RECRUITMENT_TIMELINE = [
        { phase: 'PHASE 1', title: 'APPLICATION WINDOW', date: 'JANUARY 2026' },
        { phase: 'PHASE 2', title: 'ADMINISTRATIVE SCREENING', date: 'FEBRUARY 2026' },
        { phase: 'PHASE 3', title: 'PROFESSIONAL INTERVIEW', date: 'FEBRUARY 2026' },
        { phase: 'PHASE 4', title: 'OFFICIAL ONBOARDING', date: 'MARCH 2026' }
    ];

    const DEFAULT_RECRUITMENT_REQUIREMENTS = [
        // Hardcoded in HTML now to ensure reliability
    ];

    const getJson = appUtils.getJson || ((key, fallback) => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    });

    const setJson = appUtils.setJson || ((key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    const showModal = appUtils.showModal || ((modalElement) => {
        if (!modalElement) return;
        modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    const hideModal = appUtils.hideModal || ((modalElement) => {
        if (!modalElement) return;
        modalElement.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const successModal = document.getElementById('successModal');
    const registrationForm = document.getElementById('registrationForm');
    const recruitmentTimelineList = document.getElementById('recruitmentTimelineList');
    const dynamicRequirementsContainer = document.getElementById('dynamicRecruitmentRequirements');

    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const nimInput = document.getElementById('nim');
    const firstDivisionSelect = document.getElementById('divisi');
    const secondDivisionSelect = document.getElementById('divisi2');

    const MAX_TEXTAREA_LENGTH = 500;
    const MAX_EMBEDDED_FILE_BYTES = 10 * 1024 * 1024;
    const MAX_TOTAL_EMBEDDED_BYTES = 10 * 1024 * 1024;
    const PORTFOLIO_IMAGE_PROFILE = Object.freeze({ maxWidth: 900, maxHeight: 900, quality: 0.56, maxBytes: 160 * 1024 });
    const MAX_EMBEDDED_FILE_LABEL = '';
    let careersLockedForPublic = false;

    function showAdminLogin() {
        showModal(adminLoginModal);
    }

    function closeAdminLogin() {
        hideModal(adminLoginModal);
    }

    function closeSuccessModal() {
        hideModal(successModal);
    }

    function isAdminSessionActive() {
        return localStorage.getItem(storageKeys.adminLoggedIn) === 'true';
    }

    function isCareersOpenForPublic() {
        const homeSettings = getJson(dataKeys.homeSettings, {});
        return homeSettings && homeSettings.careersOpen === true;
    }

    function updateCareersLockState() {
        careersLockedForPublic = !isCareersOpenForPublic() && !isAdminSessionActive();
    }

    function renderCareersComingSoon() {
        updateCareersLockState();
        const registrationSection = document.querySelector('.registration-section');
        const existingOverlay = registrationSection
            ? registrationSection.querySelector('.careers-coming-soon-overlay')
            : null;

        if (!careersLockedForPublic) {
            document.body.classList.remove('careers-locked-mode');
            if (registrationForm) {
                registrationForm.querySelectorAll('input, select, textarea, button').forEach((fieldElement) => {
                    if (fieldElement.hasAttribute('data-lock-disabled')) {
                        fieldElement.disabled = false;
                        fieldElement.removeAttribute('data-lock-disabled');
                    }
                });
            }
            if (existingOverlay) {
                existingOverlay.remove();
            }
            return;
        }

        document.body.classList.add('careers-locked-mode');
        if (registrationForm) {
            registrationForm.querySelectorAll('input, select, textarea, button').forEach((fieldElement) => {
                fieldElement.disabled = true;
                fieldElement.setAttribute('data-lock-disabled', 'true');
            });
        }
        if (!registrationSection) return;

        let overlay = existingOverlay;
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'careers-coming-soon-overlay';
            overlay.innerHTML = `
                <div class="careers-coming-soon-card">
                    <span class="coming-soon-badge">CAREERS</span>
                    <h2>COMING SOON!!!</h2>
                    <p>Menu rekrutasi sedang dipersiapkan. Akses publik akan dibuka oleh admin.</p>
                </div>
            `;
            registrationSection.appendChild(overlay);
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizeRequirementType(rawType) {
        const typeValue = String(rawType || '').trim().toLowerCase();
        if (typeValue === 'text' || typeValue === 'textarea') {
            return typeValue;
        }

        return 'file';
    }

    function normalizeRecruitmentRequirements(requirements) {
        const source = Array.isArray(requirements) && requirements.length > 0
            ? requirements
            : DEFAULT_RECRUITMENT_REQUIREMENTS;

        return source
            .map((requirement, index) => {
                const label = String(requirement.label || '').trim();
                if (!label) return null;

                const type = normalizeRequirementType(requirement.type);
                const normalizedRequirement = {
                    id: String(requirement.id || `req-${index + 1}`),
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
        const rawSettings = getJson(dataKeys.recruitmentSettings, {});
        const timelineSource = Array.isArray(rawSettings.timeline) ? rawSettings.timeline : [];

        const timeline = DEFAULT_RECRUITMENT_TIMELINE.map((defaultItem, index) => {
            const sourceItem = timelineSource[index] || {};
            return {
                phase: String(sourceItem.phase || defaultItem.phase).trim() || defaultItem.phase,
                title: String(sourceItem.title || defaultItem.title).trim() || defaultItem.title,
                date: String(sourceItem.date || defaultItem.date).trim() || defaultItem.date
            };
        });

        const requirements = normalizeRecruitmentRequirements(rawSettings.requirements);
        return { timeline, requirements };
    }

    function renderRecruitmentTimeline() {
        if (!recruitmentTimelineList) return;

        const { timeline } = getRecruitmentSettings();
        recruitmentTimelineList.innerHTML = timeline
            .map((item) => `<li><span>${escapeHtml(item.phase)}</span> ${escapeHtml(item.title)}: ${escapeHtml(item.date)}</li>`)
            .join('');
    }

    function requirementTypeLabel(type) {
        if (type === 'textarea') return 'PARAGRAPH';
        if (type === 'text') return 'SHORT TEXT';
        return 'FILE UPLOAD';
    }

    function renderDynamicRecruitmentRequirements() {
        if (!dynamicRequirementsContainer) {
            return;
        }

        const { requirements } = getRecruitmentSettings();
        // Filter out fixed requirements as they are handled by syncFixedRequirementsVisibility
        const dynamicOnly = requirements.filter(r => r.id !== 'cv' && r.id !== 'portfolio');

        if (!dynamicOnly.length) {
            dynamicRequirementsContainer.innerHTML = '';
            return;
        }

        dynamicRequirementsContainer.innerHTML = dynamicOnly.map((requirement, index) => {
            const fieldId = `requirementField_${index + 1}`;
            const requiredMarker = requirement.required ? ' *' : '';
            const requiredAttr = requirement.required ? 'required' : '';
            const acceptAttr = requirement.type === 'file' && requirement.accept
                ? `accept="${escapeHtml(requirement.accept)}"`
                : '';
            const placeholderText = `Input ${requirement.label.toLowerCase()}...`;

            let fieldHtml = '';
            if (requirement.type === 'textarea') {
                fieldHtml = `<textarea id="${fieldId}" rows="3" data-requirement-index="${index}" ${requiredAttr} placeholder="${escapeHtml(placeholderText)}"></textarea>`;
            } else if (requirement.type === 'text') {
                fieldHtml = `<input type="text" id="${fieldId}" data-requirement-index="${index}" ${requiredAttr} placeholder="${escapeHtml(placeholderText)}">`;
            } else {
                fieldHtml = `
                    <input type="file" id="${fieldId}" data-requirement-index="${index}" ${requiredAttr} ${acceptAttr}>
                    <small class="requirement-helper">Ukuran file terlalu besar.</small>
                `;
            }

            return `
                <div class="form-group dynamic-requirement-item">
                    <div class="requirement-label-row">
                        <label for="${fieldId}">${escapeHtml(requirement.label)}${requiredMarker}</label>
                        <span class="requirement-badge">${requirementTypeLabel(requirement.type)}</span>
                    </div>
                    ${fieldHtml}
                </div>
            `;
        }).join('');
    }

    function getFieldValue(fieldId, fallback = '') {
        const fieldElement = document.getElementById(fieldId);
        if (!fieldElement) return fallback;
        return fieldElement.value;
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error(`Gagal membaca file: ${file.name}`));
            reader.readAsDataURL(file);
        });
    }

    function setSubmitButtonState(isLoading) {
        if (!registrationForm) return;

        const submitButton = registrationForm.querySelector('button[type="submit"]');
        if (!submitButton) return;

        submitButton.disabled = isLoading;
        submitButton.style.opacity = isLoading ? '0.8' : '1';
        submitButton.style.cursor = isLoading ? 'wait' : 'pointer';
        submitButton.textContent = isLoading ? 'PROCESSING...' : 'SUBMIT APPLICATION';
    }

    async function collectDynamicRequirementPayload() {
        const { requirements } = getRecruitmentSettings();
        if (!dynamicRequirementsContainer || !requirements.length) {
            return [];
        }

        let totalEmbeddedBytes = 0;
        const requirementPayload = [];

        for (let index = 0; index < requirements.length; index += 1) {
            const requirement = requirements[index];
            const inputElement = dynamicRequirementsContainer.querySelector(`[data-requirement-index="${index}"]`);

            if (!inputElement) {
                requirementPayload.push({
                    id: requirement.id,
                    label: requirement.label,
                    type: requirement.type,
                    required: requirement.required,
                    value: '-'
                });
                continue;
            }

            if (requirement.type === 'file') {
                const selectedFiles = inputElement.files
                    ? Array.from(inputElement.files).filter(Boolean)
                    : [];

                if (!selectedFiles.length) {
                    requirementPayload.push({
                        id: requirement.id,
                        label: requirement.label,
                        type: requirement.type,
                        required: requirement.required,
                        value: '-',
                        files: []
                    });
                    continue;
                }

                const embeddedFiles = [];
                for (const file of selectedFiles) {
                    if (file.size > MAX_EMBEDDED_FILE_BYTES) {
                        throw new Error(`File "${file.name}" terlalu besar.`);
                    }

                    totalEmbeddedBytes += file.size;
                    if (totalEmbeddedBytes > MAX_TOTAL_EMBEDDED_BYTES) {
                        throw new Error(`Total ukuran seluruh dokumen terlalu besar.`);
                    }

                    const dataUrl = await readFileAsDataUrl(file);
                    embeddedFiles.push({
                        name: file.name,
                        type: file.type || 'application/octet-stream',
                        size: file.size,
                        dataUrl
                    });
                }

                requirementPayload.push({
                    id: requirement.id,
                    label: requirement.label,
                    type: requirement.type,
                    required: requirement.required,
                    value: embeddedFiles.map((file) => file.name).join(', ') || '-',
                    files: embeddedFiles
                });
                continue;
            }

            requirementPayload.push({
                id: requirement.id,
                label: requirement.label,
                type: requirement.type,
                required: requirement.required,
                value: String(inputElement.value || '').trim() || '-'
            });
        }

        return requirementPayload;
    }

    async function buildApplicantPayload() {
        const payload = {
            id: Date.now(),
            fullName: getFieldValue('fullName'),
            nim: getFieldValue('nim'),
            semester: getFieldValue('semester'),
            email: getFieldValue('email'),
            phone: getFieldValue('phone'),
            divisi: getFieldValue('divisi'),
            divisi2: getFieldValue('divisi2', '-') || '-',
            motivation: getFieldValue('motivation'),
            skills: getFieldValue('skills', '-') || '-',
            experience: getFieldValue('experience', '-') || '-',
            requirementResponses: await collectDynamicRequirementPayload(),
            registrationDate: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        };

        // Collect hardcoded files (only if they exist in settings)
        const { requirements } = getRecruitmentSettings();
        const cvSetting = requirements.find(r => r.id === 'cv');
        const portfolioSetting = requirements.find(r => r.id === 'portfolio');

        const cvFileInput = document.getElementById('cvFile');
        const portfolioFileInput = document.getElementById('portfolioFile');

        if (cvSetting && cvFileInput && cvFileInput.files && cvFileInput.files[0]) {
            const file = cvFileInput.files[0];
            if (file.size > MAX_EMBEDDED_FILE_BYTES) {
                throw new Error(`Ukuran ${cvSetting.label} maksimal ${MAX_EMBEDDED_FILE_BYTES / (1024 * 1024)}MB`);
            }
            payload.cvData = {
                name: file.name,
                type: file.type,
                dataUrl: await readFileAsDataUrl(file)
            };
        }

        if (portfolioSetting && portfolioFileInput && portfolioFileInput.files && portfolioFileInput.files[0]) {
            const file = portfolioFileInput.files[0];
            if (file.size > MAX_EMBEDDED_FILE_BYTES) {
                throw new Error(`Ukuran ${portfolioSetting.label} maksimal ${MAX_EMBEDDED_FILE_BYTES / (1024 * 1024)}MB`);
            }

            let dataUrl = await readFileAsDataUrl(file);
            
            // Downsize if it's an image to save space
            if (file.type.startsWith('image/')) {
                try {
                    dataUrl = await appUtils.resizeImage(
                        dataUrl,
                        PORTFOLIO_IMAGE_PROFILE.maxWidth,
                        PORTFOLIO_IMAGE_PROFILE.maxHeight,
                        PORTFOLIO_IMAGE_PROFILE.quality,
                        PORTFOLIO_IMAGE_PROFILE.maxBytes
                    );
                } catch (e) {
                    console.warn('Failed to resize portfolio image, using original.');
                }
            }

            payload.portfolioData = {
                name: file.name,
                type: file.type,
                dataUrl: dataUrl
            };
        }

        return payload;
    }

    function handleAdminLoginSubmit(event) {
        event.preventDefault();

        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === 'IMTEKKUKNG' && password === 'azkaganteng25') {
            localStorage.setItem(storageKeys.adminLoggedIn, 'true');
            window.location.href = 'admin.html';
            return;
        }

        alert('Username atau password salah!');
    }

    async function handleRegistrationSubmit(event) {
        event.preventDefault();

        if (careersLockedForPublic) {
            alert('Menu CAREERS masih Coming Soon. Akses publik belum dibuka.');
            return;
        }

        setSubmitButtonState(true);

        try {
            const applicants = getJson(storageKeys.applicants, []);
            const payload = await buildApplicantPayload();
            applicants.push(payload);
            setJson(storageKeys.applicants, applicants);

            showModal(successModal);
            if (registrationForm) {
                registrationForm.reset();
            }
            renderRecruitmentContent();
        } catch (error) {
            if (error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                // Handled by setJson alert
            } else {
                alert(error && error.message ? error.message : 'Terjadi kesalahan saat submit. Silakan coba lagi.');
            }
        } finally {
            setSubmitButtonState(false);
        }
    }

    function setValidationState(inputElement, isValid, invalidMessage) {
        if (!inputElement) return;

        inputElement.style.borderColor = isValid ? '#e0e0e0' : '#ff4444';
        if (!isValid) {
            alert(invalidMessage);
        }
    }

    function initFieldValidation() {
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isValid = !emailInput.value || emailRegex.test(emailInput.value);
                setValidationState(emailInput, isValid, 'Format email tidak valid!');
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                const phoneRegex = /^[0-9]{10,13}$/;
                const isValid = !phoneInput.value || phoneRegex.test(phoneInput.value);
                setValidationState(phoneInput, isValid, 'Nomor telepon harus 10-13 digit!');
            });
        }

        if (nimInput) {
            nimInput.addEventListener('blur', () => {
                const nimRegex = /^[0-9]+$/;
                const isValid = !nimInput.value || nimRegex.test(nimInput.value);
                setValidationState(nimInput, isValid, 'NIM harus berupa angka!');
            });
        }
    }

    function initDivisionValidation() {
        if (!firstDivisionSelect || !secondDivisionSelect) {
            return;
        }

        secondDivisionSelect.addEventListener('change', () => {
            const sameSelection =
                firstDivisionSelect.value &&
                secondDivisionSelect.value === firstDivisionSelect.value;

            if (sameSelection) {
                alert('Divisi pilihan 2 harus berbeda dengan divisi pilihan 1!');
                secondDivisionSelect.value = '';
            }
        });
    }

    function initTextareaCounters() {
        document.querySelectorAll('textarea').forEach((textareaElement) => {
            if (textareaElement.dataset.counterInitialized === 'true') {
                return;
            }

            const counterElement = document.createElement('div');
            counterElement.style.textAlign = 'right';
            counterElement.style.fontSize = '0.85rem';
            counterElement.style.color = '#999';
            counterElement.style.marginTop = '0.5rem';
            textareaElement.parentNode.appendChild(counterElement);

            function updateCounter() {
                let remaining = MAX_TEXTAREA_LENGTH - textareaElement.value.length;
                if (remaining < 0) {
                    textareaElement.value = textareaElement.value.substring(0, MAX_TEXTAREA_LENGTH);
                    remaining = 0;
                }

                counterElement.textContent = `${remaining} karakter tersisa`;
                counterElement.style.color = remaining === 0 ? '#ff4444' : '#999';
            }

            textareaElement.addEventListener('input', updateCounter);
            textareaElement.dataset.counterInitialized = 'true';
            updateCounter();
        });
    }

    function initClickOutsideHandler() {
        window.addEventListener('click', (event) => {
            if (event.target === adminLoginModal) {
                closeAdminLogin();
            }

            if (event.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    function initForms() {
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);
        }

        if (registrationForm) {
            registrationForm.addEventListener('submit', handleRegistrationSubmit);
        }
    }

    function renderRecruitmentContent() {
        renderRecruitmentTimeline();
        syncFixedRequirementsVisibility();
        renderDynamicRecruitmentRequirements();
        initTextareaCounters();
    }

    function syncFixedRequirementsVisibility() {
        const { requirements } = getRecruitmentSettings();
        const cvField = document.getElementById('cvFieldGroup');
        const portfolioField = document.getElementById('portfolioFieldGroup');
        const fixedRow = document.getElementById('fixedRequirementsRow');

        const cvSetting = requirements.find(r => r.id === 'cv');
        const portfolioSetting = requirements.find(r => r.id === 'portfolio');

        if (cvField) {
            if (cvSetting) {
                cvField.style.display = 'block';
                const label = document.getElementById('cvLabel');
                const input = document.getElementById('cvFile');
                const helper = document.getElementById('cvHelper');
                if (label) label.textContent = `${cvSetting.label.toUpperCase()}${cvSetting.required ? '*' : ''}`;
                if (input) {
                    input.required = cvSetting.required;
                    if (cvSetting.accept) input.accept = cvSetting.accept;
                }
                if (helper && cvSetting.accept) {
                    helper.textContent = `Allowed: ${cvSetting.accept.replace(/\./g, '').toUpperCase()}`;
                }
            } else {
                cvField.style.display = 'none';
                const input = document.getElementById('cvFile');
                if (input) input.required = false;
            }
        }

        if (portfolioField) {
            if (portfolioSetting) {
                portfolioField.style.display = 'block';
                const label = document.getElementById('portfolioLabel');
                const input = document.getElementById('portfolioFile');
                const helper = document.getElementById('portfolioHelper');
                if (label) label.textContent = `${portfolioSetting.label.toUpperCase()}${portfolioSetting.required ? '*' : ''}`;
                if (input) {
                    input.required = portfolioSetting.required;
                    if (portfolioSetting.accept) input.accept = portfolioSetting.accept;
                }
                if (helper && portfolioSetting.accept) {
                    helper.textContent = `Allowed: ${portfolioSetting.accept.replace(/\./g, '').toUpperCase()}`;
                }
            } else {
                portfolioField.style.display = 'none';
                const input = document.getElementById('portfolioFile');
                if (input) input.required = false;
            }
        }

        if (fixedRow) {
            fixedRow.style.display = (!cvSetting && !portfolioSetting) ? 'none' : 'flex';
        }
    }

    window.showAdminLogin = showAdminLogin;
    window.closeAdminLogin = closeAdminLogin;
    window.closeSuccessModal = closeSuccessModal;

    if (typeof appUtils.syncFromCloudNow === 'function') {
        appUtils.syncFromCloudNow();
    }

    updateCareersLockState();
    initForms();
    initClickOutsideHandler();
    renderRecruitmentContent();

    if (!careersLockedForPublic) {
        initFieldValidation();
        initDivisionValidation();
    } else {
        renderCareersComingSoon();
    }

    window.addEventListener('apputils:cloud-sync', () => {
        const previousLockState = careersLockedForPublic;
        updateCareersLockState();
        if (previousLockState !== careersLockedForPublic) {
            window.location.reload();
            return;
        }

        renderRecruitmentContent();
        if (careersLockedForPublic) {
            renderCareersComingSoon();
        }
    });
    window.addEventListener('storage', (event) => {
        if (event.key === dataKeys.recruitmentSettings) {
            renderRecruitmentContent();
        }

        if (event.key === dataKeys.homeSettings || event.key === storageKeys.adminLoggedIn) {
            window.location.reload();
        }
    });

    window.addEventListener('pageshow', () => {
        if (typeof appUtils.syncFromCloudNow === 'function') {
            appUtils.syncFromCloudNow();
        }
        renderCareersComingSoon();
        renderRecruitmentContent();
    });

    // Keep sync active with centralized scheduler when available.
    if (typeof appUtils.startAutoCloudSync === 'function') {
        appUtils.startAutoCloudSync({
            visibleIntervalMs: 3000,
            hiddenIntervalMs: 12000,
            focusDebounceMs: 900
        });
    } else {
        window.setInterval(async () => {
            const previousLockState = careersLockedForPublic;
            if (typeof appUtils.syncFromCloudAsync === 'function') {
                await appUtils.syncFromCloudAsync();
            } else if (typeof appUtils.syncFromCloudNow === 'function') {
                appUtils.syncFromCloudNow();
            }
            updateCareersLockState();

            if (previousLockState !== careersLockedForPublic) {
                window.location.reload();
                return;
            }

            renderCareersComingSoon();
        }, 5000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        showAdminLogin();
    }
})();
