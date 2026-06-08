(() => {
    const appUtils = window.AppUtils || {};
    const showModal = appUtils.showModal || ((modalElement) => {
        if (!modalElement) {
            return;
        }

        modalElement.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    const hideModal = appUtils.hideModal || ((modalElement) => {
        if (!modalElement) {
            return;
        }

        modalElement.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    const filterButtonsContainer = document.querySelector('.filter-buttons');
    const galleryModal = document.getElementById('galleryModal');
    const dynamicGrid = document.getElementById('dynamicGalleryGrid');
    const archivedGrid = document.getElementById('galleryGrid');
    const closeModalButton = document.querySelector('.close-modal');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function renderArchivedCollections() {
        if (!archivedGrid) return;
        const archived = appUtils.getJson(appUtils.DATA_KEYS.archivedCollections, []);
        
        archivedGrid.innerHTML = archived.map(item => `
            <div class="gallery-item" data-category="${item.tag.toLowerCase()}">
                <div class="gallery-card">
                    <div class="gallery-image">
                        ${item.url ? `<img src="${item.url}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div class="image-placeholder"><span class="placeholder-icon">${item.id < 4 ? `DOC-0${item.id}` : (item.id <= 6 ? `CRP-0${item.id-3}` : `ARC-${item.id}`)}</span></div>`}
                        <div class="gallery-overlay"><button class="view-btn" onclick="openModal(${item.id})">VIEW DETAILS</button></div>
                    </div>
                    <div class="gallery-info">
                        <span class="gallery-tag">${item.tag}</span>
                        <h3>${item.title}</h3>
                        <p>${item.date}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function openModal(id) {
        const archived = appUtils.getJson(appUtils.DATA_KEYS.archivedCollections, []);
        const item = archived.find(a => a.id == id);
        if (!item || !galleryModal) return;

        document.getElementById('modalTag').textContent = item.tag;
        document.getElementById('modalTitle').textContent = item.title;
        document.getElementById('modalDate').textContent = item.date;
        document.getElementById('modalDescription').textContent = item.desc;
        
        
        const iconEl = document.getElementById('modalIcon');
        if (item.url) {
            iconEl.innerHTML = `<img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            if (item.id <= 6) {
                iconEl.textContent = item.id < 4 ? `DOC-0${item.id}` : `CRP-0${item.id-3}`;
            } else {
                iconEl.textContent = `ARC-${item.id}`;
            }
        }

        showModal(galleryModal);
    }

    function closeModal() {
        hideModal(galleryModal);
    }

    function viewDynamicPhoto(url) {
        if (!galleryModal) return;
        document.getElementById('modalTag').textContent = 'COMMUNITY';
        document.getElementById('modalTitle').textContent = 'ORGANIZATION ACTIVITY';
        document.getElementById('modalDate').textContent = 'RECENTLY UPLOADED';
        document.getElementById('modalDescription').textContent = 'Live documentation from recent organizational events and community gatherings.';
        const iconEl = document.getElementById('modalIcon');
        iconEl.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        showModal(galleryModal);
    }

    function renderDynamicGallery(filterName = 'roadshow') {
        if (!dynamicGrid) return;
        const gallery = appUtils.getJson(appUtils.DATA_KEYS.gallery, []);
        const filteredGallery = gallery.filter(item => item.category === filterName);
        
        if (filteredGallery.length === 0) {
            dynamicGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #999;">No photos found in this section.</div>';
            return;
        }

        dynamicGrid.style.display = 'grid';
        dynamicGrid.innerHTML = filteredGallery.map(item => `
            <div class="gallery-item" style="opacity: 1; transform: scale(1); display: block;">
                <div class="gallery-card">
                    <div class="gallery-image">
                        <img src="${item.url}" alt="Gallery Image" style="width: 100%; height: 100%; object-fit: cover;">
                        <div class="gallery-overlay">
                            <button class="view-btn" onclick="window.viewDynamicPhoto('${item.url}')">VIEW PHOTO</button>
                        </div>
                    </div>
                    <div class="gallery-info">
                        <span class="gallery-tag">${(filterName || 'Community').toUpperCase()}</span>
                        <h3>ORGANIZATION ACTIVITY</h3>
                        <p>${item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently Uploaded'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function initFilterButtons() {
        if (!filterButtonsContainer) return;
        const categories = appUtils.getJson(appUtils.DATA_KEYS.galleryCategories, [
            { id: 'roadshow', name: 'ANNUAL ROADSHOW' },
            { id: 'carrty', name: 'CHARITY PROGRAM' }
        ]);

        filterButtonsContainer.innerHTML = categories.map((cat, index) => `
            <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${cat.id}">${cat.name}</button>
        `).join('');

        const buttons = filterButtonsContainer.querySelectorAll('.filter-btn');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                renderDynamicGallery(button.getAttribute('data-filter'));
            });
        });

        if (categories.length > 0) {
            renderDynamicGallery(categories[0].id);
        }
    }

    function initModalEvents() {
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (event) => {
            if (event.target === galleryModal) {
                closeModal();
            }
        });
    }

    function initEntryAnimation() {
        document.addEventListener('DOMContentLoaded', () => {
            galleryItems.forEach((itemElement, index) => {
                itemElement.style.opacity = '0';
                itemElement.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    itemElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    itemElement.style.opacity = '1';
                    itemElement.style.transform = 'scale(1)';
                }, index * 100);
            });
        });
    }

    function renderAll() {
        renderArchivedCollections();
        initFilterButtons();
    }

    window.openModal = openModal;
    window.viewDynamicPhoto = viewDynamicPhoto;

    renderAll();
    initModalEvents();
    initEntryAnimation();

    window.addEventListener('apputils:cloud-sync', () => {
        renderAll();
    });

    window.addEventListener('storage', (event) => {
        const dataKeys = appUtils.DATA_KEYS || {};
        const galleryKey = dataKeys.gallery || 'imtekkuGalleryData';
        const galleryCategoriesKey = dataKeys.galleryCategories || 'imtekkuGalleryCategories';
        const archivedCollectionsKey = dataKeys.archivedCollections || 'imtekkuArchivedCollections';

        if (
            event.key === galleryKey
            || event.key === galleryCategoriesKey
            || event.key === archivedCollectionsKey
        ) {
            renderAll();
        }
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
            if (typeof appUtils.syncFromCloudAsync === 'function') {
                await appUtils.syncFromCloudAsync();
            } else if (typeof appUtils.syncFromCloudNow === 'function') {
                appUtils.syncFromCloudNow();
            }
        }, 5000);
    }
})();
