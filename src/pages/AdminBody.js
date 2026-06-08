export const adminHtml = `
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="logo">
                <img src="/img/LogoImtekku.png" alt="Logo IMTEKKU" class="logo-image">
                <span>IMTEKKU MANAGEMENT</span>
            </div>
            <div class="admin-info">
                <span class="admin-name">ADMINISTRATOR</span>
                <button class="logout-btn" onclick="logout()">LOGOUT</button>
            </div>
        </div>
    </nav>

    <section class="dashboard-header">
        <div class="container">
            <div class="dashboard-header-content">
                <div class="dashboard-header-text">
                    <h1>INSTITUTIONAL DASHBOARD</h1>
                    <p>Real-time oversight of professional applications and organizational data.</p>
                </div>
                <div class="dashboard-header-meta">
                    <div class="dashboard-header-badge">
                        <span class="dashboard-header-dot"></span>
                        <span>SYSTEM ACTIVE</span>
                    </div>
                    <div class="dashboard-header-date" id="dashboardDate">--</div>
                </div>
            </div>
        </div>
    </section>

    <div class="admin-tabs">
        <div class="tabs-container">
            <button class="tab-btn active" data-tab="applicants">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <span>RECRUITMENT DATA</span>
            </button>
            <button class="tab-btn" data-tab="media">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>MEMBER MANAGEMENT</span>
            </button>
            <button class="tab-btn" data-tab="gallery">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>GALLERY MANAGEMENT</span>
            </button>
            <button class="tab-btn" data-tab="archived">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                <span>ARCHIVED COLLECTIONS</span>
            </button>
            <button class="tab-btn" data-tab="settings">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>SITE SETTINGS</span>
            </button>
        </div>
    </div>

    <div id="applicantsTab" class="tab-content active">
        <section class="stats-section">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-card stat-card--primary">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="totalApplicants">0</h3>
                            <p>TOTAL APPLICANTS</p>
                            <span class="stat-trend">+ Active Pipeline</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--indigo">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="acaraCount">0</h3>
                            <p>EVENTS</p>
                            <span class="stat-trend">Divisi Acara</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--rose">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="humasCount">0</h3>
                            <p>PUBLIC RELATIONS</p>
                            <span class="stat-trend">Divisi Humas</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--amber">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="sponsorCount">0</h3>
                            <p>SPONSORSHIP</p>
                            <span class="stat-trend">Divisi Sponsor</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--teal">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16h2a2 2 0 0 0 2-2v-2.84a2 2 0 0 0-.59-1.41L18 8.34a2 2 0 0 0-1.41-.34H14"/><path d="M8 8h2.59a2 2 0 0 1 1.41.34l1.41 1.41a2 2 0 0 1 .59 1.41V14"/><rect x="3" y="8" width="18" height="13" rx="2"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="logistikCount">0</h3>
                            <p>LOGISTICS</p>
                            <span class="stat-trend">Divisi Logistik</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--violet">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="psdmCount">0</h3>
                            <p>HR DEVELOPMENT</p>
                            <span class="stat-trend">Divisi PSDM</span>
                        </div>
                    </div>
                    <div class="stat-card stat-card--cyan">
                        <div class="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                        </div>
                        <div class="stat-info">
                            <h3 id="medfoCount">0</h3>
                            <p>MEDIA & INFORMATION</p>
                            <span class="stat-trend">Divisi Medfo</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="control-section">
            <div class="container">
                <div class="control-bar">
                    <div class="search-box">
                        <span class="search-box-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </span>
                        <input type="text" id="searchInput" placeholder="Search by name, ID, or professional credentials...">
                    </div>
                    <div class="filter-box">
                        <select id="divisionFilter">
                            <option value="all">ALL DIVISIONS</option>
                            <option value="acara">EVENTS</option>
                            <option value="humas">PUBLIC RELATIONS</option>
                            <option value="sponsor">SPONSORSHIP</option>
                            <option value="logistik">LOGISTICS</option>
                            <option value="psdm">HR DEVELOPMENT</option>
                            <option value="medfo">MEDIA & INFORMATION</option>
                        </select>
                    </div>
                    <button class="export-btn" onclick="exportToExcel()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <span>EXPORT DATA</span>
                    </button>
                </div>
            </div>
        </section>

        <section class="table-section">
            <div class="container">
                <div class="table-container">
                    <table id="applicantsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>STUDENT ID</th>
                                <th>SEMESTER</th>
                                <th>EMAIL</th>
                                <th>PHONE</th>
                                <th>DIVISION 1</th>
                                <th>DIVISION 2</th>
                                <th>SUBMISSION DATE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                        </tbody>
                    </table>
                    <div id="emptyState" class="empty-state" style="padding: 5rem; text-align: center; color: var(--corp-muted);">
                        <div class="empty-icon" style="font-size: 3rem; margin-bottom: 1rem;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                        </div>
                        <h3>NO RECORDS FOUND</h3>
                        <p>Applicant data will appear here once submissions are received.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <div id="mediaTab" class="tab-content">
        <section class="photo-management-section">
            <div class="container">
                <div class="management-grid">
                    <div class="management-card">
                        <h2>ORGANIZATIONAL CORE</h2>
                        <div class="team-member-form">
                            <label>ADD ORGANIZATIONAL CORE MEMBER</label>
                            <div class="team-member-grid">
                                <input type="text" id="newTeamMemberName" placeholder="Full Name">
                                <input type="text" id="newTeamMemberRole" placeholder="Position / Role">
                                <input type="text" id="newTeamMemberNim" placeholder="Student ID (NIM)">
                                <input type="text" id="newTeamMemberMajor" placeholder="Major / Jurusan">
                                <input type="text" id="newTeamMemberInstagram" placeholder="Instagram (without @)">
                                <div class="file-upload-wrapper" style="grid-column: 1 / -1;">
                                    <label class="export-btn" style="width: 100%; justify-content: center; background: #f0f0f0; color: #333; border: 1px dashed #ccc; cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                        UPLOAD PHOTO
                                        <input type="file" id="newTeamMemberPhoto" class="hidden-input" accept="image/*">
                                    </label>
                                </div>
                            </div>
                            <button type="button" id="addTeamMemberBtn" class="export-btn team-member-btn">ADD MEMBER</button>
                        </div>
                        <div class="member-list" id="teamMemberList">
                        </div>
                    </div>
                    <div class="management-card">
                        <h2>DIVISION</h2>
                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label>SELECT DIVISION</label>
                            <select id="divisionPhotoFilter" style="width: 100%; padding: 1rem; margin-top: 0.5rem;">
                                <option value="acara">EVENTS</option>
                                <option value="humas">PUBLIC RELATIONS</option>
                                <option value="sponsor">SPONSORSHIP</option>
                                <option value="logistik">LOGISTICS</option>
                                <option value="psdm">HR DEVELOPMENT</option>
                                <option value="medfo">MEDIA & INFORMATION</option>
                            </select>
                        </div>
                        <div class="division-staff-form">
                            <label>ADD STAFF TO SELECTED DIVISION</label>
                            <div class="division-staff-grid">
                                <input type="text" id="newDivisionStaffName" placeholder="Full Name">
                                <input type="text" id="newDivisionStaffNim" placeholder="Student ID (NIM)">
                                <input type="text" id="newDivisionStaffMajor" placeholder="Major / Jurusan">
                                <input type="text" id="newDivisionStaffInstagram" placeholder="Instagram (without @)">
                                <div class="file-upload-wrapper" style="grid-column: 1 / -1;">
                                    <label class="export-btn" style="width: 100%; justify-content: center; background: #f0f0f0; color: #333; border: 1px dashed #ccc; cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                        UPLOAD PHOTO
                                        <input type="file" id="newDivisionStaffPhoto" class="hidden-input" accept="image/*">
                                    </label>
                                </div>
                            </div>
                            <button type="button" id="addDivisionStaffBtn" class="export-btn division-staff-btn">ADD STAFF</button>
                            <p id="divisionStaffLimitNote" class="division-staff-limit-note">Loading division limit...</p>
                        </div>
                        <div class="member-list" id="divisionMemberList">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <div id="galleryTab" class="tab-content">
        <section class="photo-management-section">
            <div class="container">
                <div class="management-grid">
                    <div class="management-card">
                        <h2>DOCUMENTATION SECTIONS</h2>
                        <div class="category-add-wrap">
                            <div class="form-group">
                                <label>ADD NEW SECTION</label>
                                <div class="category-add-row">
                                    <input type="text" id="newCategoryName" class="category-add-input" placeholder="Section Name (e.g. SEMINAR)">
                                    <button class="export-btn category-add-btn" onclick="window.addGalleryCategory()">ADD</button>
                                </div>
                            </div>
                        </div>
                        <div id="categoryAdminList" class="member-list">
                        </div>
                    </div>

                    <div class="management-card">
                        <div class="gallery-toolbar">
                            <h2>PHOTO MANAGEMENT</h2>
                            <div class="gallery-toolbar-actions">
                                <select id="galleryCategoryFilter" class="gallery-category-select">
                                </select>
                                <label class="export-btn gallery-upload-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    UPLOAD PHOTOS
                                    <input type="file" id="galleryUploadInput" class="hidden-input" accept="image/*" multiple>
                                </label>
                            </div>
                        </div>
                        <div id="galleryAdminList" class="gallery-admin-grid">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <div id="archivedTab" class="tab-content">
        <section class="photo-management-section">
            <div class="container">
                <div class="management-grid">
                    <div class="management-card">
                        <h2>ARCHIVED COLLECTIONS</h2>
                        <div style="margin-bottom: 2rem;">
                            <div class="form-group">
                                <label>ADD NEW RECORD</label>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                                    <input type="text" id="newArchivedTitle" placeholder="Record Title (e.g. SEMINAR X)" style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;">
                                    <input type="text" id="newArchivedTag" placeholder="Tag (e.g. ROADSHOW)" style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;">
                                    <input type="text" id="newArchivedDate" placeholder="Date (e.g. JAN 2026)" style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;">
                                    <textarea id="newArchivedDesc" placeholder="Brief Description..." style="padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                                    <label class="export-btn" style="cursor: pointer; justify-content: center; background: #eee; color: #333; border: 1px dashed #ccc;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                        UPLOAD COVER PHOTO
                                        <input type="file" id="newArchivedPhoto" class="hidden-input" accept="image/*">
                                    </label>
                                    <button type="button" id="addArchivedRecordBtn" class="export-btn" onclick="window.addArchivedRecord()" style="padding: 0.8rem; justify-content: center;">ADD TO ARCHIVE</button>
                                </div>
                            </div>
                        </div>
                        <div id="archivedAdminList" class="member-list">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <div id="settingsTab" class="tab-content">
        <section class="photo-management-section">
            <div class="container">
                <div class="management-card" style="max-width: 920px; margin: 0 auto;">
                    <h2>HOME PAGE SETTINGS</h2>
                    <p style="color: var(--corp-muted); margin-bottom: 2rem;">Manage key visual elements of the landing page.</p>

                    <div class="form-group">
                        <label>IMTEKKU FAMILY IMAGE</label>
                        <div id="homeFamilyPreview" style="width: 100%; aspect-ratio: 16/9; border: 1px solid #ddd; border-radius: 8px; margin: 1rem 0; overflow: hidden; background: #eee;">
                        </div>
                        <label class="export-btn" style="cursor: pointer; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            CHANGE FAMILY IMAGE
                            <input type="file" id="homeFamilyUpload" class="hidden-input" accept="image/*">
                        </label>
                    </div>

                    <div class="form-group" style="margin-top: 2.5rem;">
                        <label>LATEST ACTIVITIES SECTION</label>
                        <p id="homeGalleryVisibilityStatus" style="margin: 0.75rem 0 1rem; color: var(--corp-muted);">
                            Status loading...
                        </p>
                        <button type="button" id="homeGalleryToggleBtn" class="export-btn" style="width: 100%; justify-content: center;">
                            TOGGLE SECTION
                        </button>
                    </div>

                    <div class="form-group" style="margin-top: 2.5rem;">
                        <label>CAREERS ACCESS MODE</label>
                        <p id="careersAccessStatus" style="margin: 0.75rem 0 1rem; color: var(--corp-muted);">
                            Status loading...
                        </p>
                        <button type="button" id="careersAccessToggleBtn" class="export-btn" style="width: 100%; justify-content: center;">
                            TOGGLE CAREERS ACCESS
                        </button>
                    </div>

                    <div class="form-group" style="margin-top: 2.5rem;">
                        <label>RECRUITMENT TIMELINE (CAREERS PAGE)</label>
                        <p style="margin: 0.75rem 0 1rem; color: var(--corp-muted);">
                            Update phase label, activity, and date shown in Recruitment Timeline.
                        </p>
                        <div class="timeline-editor-grid">
                            <div class="timeline-row">
                                <input type="text" id="timelinePhase1" placeholder="PHASE 1">
                                <input type="text" id="timelineTitle1" placeholder="APPLICATION WINDOW">
                                <input type="text" id="timelineDate1" placeholder="JANUARY 2026">
                            </div>
                            <div class="timeline-row">
                                <input type="text" id="timelinePhase2" placeholder="PHASE 2">
                                <input type="text" id="timelineTitle2" placeholder="ADMINISTRATIVE SCREENING">
                                <input type="text" id="timelineDate2" placeholder="FEBRUARY 2026">
                            </div>
                            <div class="timeline-row">
                                <input type="text" id="timelinePhase3" placeholder="PHASE 3">
                                <input type="text" id="timelineTitle3" placeholder="PROFESSIONAL INTERVIEW">
                                <input type="text" id="timelineDate3" placeholder="FEBRUARY 2026">
                            </div>
                            <div class="timeline-row">
                                <input type="text" id="timelinePhase4" placeholder="PHASE 4">
                                <input type="text" id="timelineTitle4" placeholder="OFFICIAL ONBOARDING">
                                <input type="text" id="timelineDate4" placeholder="MARCH 2026">
                            </div>
                        </div>
                        <button type="button" id="saveRecruitmentTimelineBtn" class="export-btn" style="width: 100%; justify-content: center; margin-top: 1rem;">
                            SAVE RECRUITMENT TIMELINE
                        </button>
                    </div>

                    <div class="form-group requirements-editor-section" style="margin-top: 2.5rem;">
                        <label>RECRUITMENT REQUIREMENTS (CAREERS PAGE)</label>
                        <p style="margin: 0.75rem 0 1rem; color: var(--corp-muted);">
                            Add or remove requirement fields shown in application form (example: Upload CV, Upload Portfolio, etc.).
                        </p>
                        <div class="requirements-builder-grid">
                            <input type="text" id="requirementLabelInput" placeholder="Requirement label (example: Upload CV)">
                            <select id="requirementTypeInput">
                                <option value="file">FILE UPLOAD</option>
                                <option value="text">SHORT TEXT</option>
                                <option value="textarea">PARAGRAPH</option>
                            </select>
                            <input type="text" id="requirementAcceptInput" placeholder="Allowed file type: .pdf,.doc,.docx">
                            <label class="requirements-required-toggle">
                                <input type="checkbox" id="requirementRequiredInput" checked>
                                REQUIRED FIELD
                            </label>
                        </div>
                        <button type="button" id="addRecruitmentRequirementBtn" class="export-btn requirements-add-btn">
                            ADD REQUIREMENT
                        </button>
                        <div id="recruitmentRequirementsAdminList" class="requirements-admin-list">
                        </div>
                        <button type="button" id="saveRecruitmentRequirementsBtn" class="export-btn requirements-save-btn">
                            SAVE REQUIREMENTS
                        </button>
                    </div>

                    <div class="form-group" style="margin-top: 5rem; padding-top: 2rem; border-top: 2px dashed #eee;">
                        <label style="color: #ff4444;">SYSTEM MAINTENANCE</label>
                        <p style="margin: 0.75rem 0 1rem; color: var(--corp-muted); font-size: 0.85rem;">
                            Jika memori browser penuh (QuotaExceededError), gunakan tombol di bawah untuk mengosongkan database.
                            <strong>PERINGATAN: Semua data (pendaftar, foto, galeri) akan dihapus secara permanen dari browser dan cloud.</strong>
                        </p>
                        <button type="button" onclick="window.resetDatabase()" class="export-btn" style="width: 100%; justify-content: center; background: #ff4444; border-color: #ff4444;">
                            RESET ALL DATABASE & CLEAR MEMORY
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <div id="editMemberView" class="tab-content" style="background: #fdfdfd; min-height: 100vh;">
        <section class="container edit-member-container">
            <div class="edit-member-topbar">
                <button onclick="window.switchTab('media')" class="logout-btn edit-member-back-btn">BACK TO LIST</button>
                <h1 class="edit-member-title">PROFILE EDITOR</h1>
            </div>

            <div class="management-card edit-member-card">
                <form id="editMemberForm">
                    <input type="hidden" id="editMemberId">
                    <input type="hidden" id="editMemberType">

                    <div class="edit-member-grid">
                        <div class="edit-photo-section">
                            <div class="member-admin-photo" style="width: 200px; height: 200px; border-radius: 8px; margin-bottom: 1rem; position: relative; overflow: hidden; border: 2px solid var(--corp-gold);">
                                <div id="editPhotoPreview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                                </div>
                            </div>
                            <label class="export-btn" style="font-size: 0.8rem; width: 100%; justify-content: center; padding: 0.8rem;">
                                CHANGE PHOTO
                                <input type="file" id="editMemberPhotoInput" class="hidden-input" accept="image/*">
                            </label>
                        </div>

                        <div class="edit-fields-section">
                            <div class="form-group" style="margin-bottom: 1.5rem;">
                                <label style="font-weight: 800; font-size: 0.8rem;">FULL NAME</label>
                                <input type="text" id="editMemberName" style="width: 100%; padding: 1rem; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>

                            <div class="edit-member-two-cols">
                                <div class="form-group">
                                    <label style="font-weight: 800; font-size: 0.8rem;">STUDENT ID (NIM)</label>
                                    <input type="text" id="editMemberNim" style="width: 100%; padding: 1rem; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div class="form-group">
                                    <label style="font-weight: 800; font-size: 0.8rem;">INSTAGRAM (@)</label>
                                    <input type="text" id="editMemberInstagram" style="width: 100%; padding: 1rem; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                            </div>

                            <div class="form-group" style="margin-bottom: 2rem;">
                                <label style="font-weight: 800; font-size: 0.8rem;">MAJOR / JURUSAN</label>
                                <input type="text" id="editMemberMajor" style="width: 100%; padding: 1rem; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                    </div>

                    <div class="zoom-control edit-member-zoom-control">
                        <label style="font-weight: 800; font-size: 0.8rem;">PHOTO ZOOM / CROP ADJUSTMENT</label>
                        <input type="range" id="editMemberZoom" min="100" max="250" step="1" value="100" style="width: 100%; margin: 1.5rem 0;">
                        <div class="edit-member-zoom-labels">
                            <span>100% (Original)</span>
                            <span id="zoomValue" style="color: var(--corp-navy); font-weight: 700;">100%</span>
                            <span>250% (Max Zoom)</span>
                        </div>
                    </div>

                    <div class="edit-member-actions">
                        <button type="submit" class="export-btn edit-member-save-btn">SAVE PROFILE CHANGES</button>
                        <button type="button" onclick="window.switchTab('media')" class="btn-delete edit-member-cancel-btn">CANCEL</button>
                    </div>
                </form>
            </div>
        </section>
    </div>

    <div id="detailModal" class="modal">
        <div class="modal-content admin-detail-modal">
            <span class="close-modal" onclick="closeDetailModal()">&times;</span>
            <div class="admin-detail-content">
                <h2>APPLICANT DETAIL</h2>
                <div class="admin-detail-grid">
                    <div>
                        <span class="detail-label">FULL NAME</span>
                        <span class="detail-value" id="detailName">-</span>
                    </div>
                    <div>
                        <span class="detail-label">STUDENT ID</span>
                        <span class="detail-value" id="detailNim">-</span>
                    </div>
                    <div>
                        <span class="detail-label">SEMESTER</span>
                        <span class="detail-value" id="detailSemester">-</span>
                    </div>
                    <div>
                        <span class="detail-label">EMAIL</span>
                        <span class="detail-value" id="detailEmail">-</span>
                    </div>
                    <div>
                        <span class="detail-label">PHONE</span>
                        <span class="detail-value" id="detailPhone">-</span>
                    </div>
                    <div>
                        <span class="detail-label">DIVISION 1</span>
                        <span class="detail-value" id="detailDivisi">-</span>
                    </div>
                    <div>
                        <span class="detail-label">DIVISION 2</span>
                        <span class="detail-value" id="detailDivisi2">-</span>
                    </div>
                    <div>
                        <span class="detail-label">SUBMISSION DATE</span>
                        <span class="detail-value" id="detailDate">-</span>
                    </div>
                </div>

                <div class="admin-detail-block">
                    <span class="detail-label">PROFESSIONAL STATEMENT</span>
                    <span class="detail-text" id="detailMotivation">-</span>
                </div>

                <div class="admin-detail-block">
                    <span class="detail-label">SKILLS</span>
                    <span class="detail-text" id="detailSkills">-</span>
                </div>

                <div class="admin-detail-block">
                    <span class="detail-label">EXPERIENCE</span>
                    <span class="detail-text" id="detailExperience">-</span>
                </div>

                <div class="admin-detail-block">
                    <span class="detail-label">SUBMITTED REQUIREMENTS</span>
                    <div id="detailRequirements" class="detail-requirements-list"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="deleteModal" class="modal">
        <div class="modal-content small admin-confirm-modal">
            <span class="close-modal" onclick="closeDeleteModal()">&times;</span>
            <div class="admin-confirm-content">
                <h2>DELETE APPLICANT DATA?</h2>
                <p>Data yang dihapus tidak bisa dikembalikan lagi.</p>
                <div class="admin-confirm-actions">
                    <button type="button" class="btn-delete" onclick="confirmDelete()">DELETE</button>
                    <button type="button" class="btn-detail" onclick="closeDeleteModal()">CANCEL</button>
                </div>
            </div>
        </div>
    </div>

    <div id="appAlertModal" class="modal app-alert-modal">
        <div class="modal-content small app-alert-content">
            <button type="button" class="close-modal app-alert-close" onclick="closeAppAlert()" aria-label="Close notification">&times;</button>
            <div class="app-alert-body">
                <span class="app-alert-badge">IMTEKKU NOTICE</span>
                <h3 id="appAlertTitle">NOTIFICATION</h3>
                <p id="appAlertMessage">-</p>
                <button type="button" id="appAlertOkBtn" class="export-btn app-alert-ok-btn">OK</button>
            </div>
        </div>
    </div>

    <div id="appConfirmModal" class="modal app-alert-modal">
        <div class="modal-content small app-alert-content app-confirm-content-shell">
            <button type="button" class="close-modal app-alert-close" onclick="closeAppConfirm()" aria-label="Close confirmation">&times;</button>
            <div class="app-alert-body app-confirm-body">
                <span class="app-alert-badge">IMTEKKU CONFIRMATION</span>
                <h3 id="appConfirmTitle">CONFIRM ACTION</h3>
                <p id="appConfirmMessage">-</p>
                <div class="app-confirm-actions">
                    <button type="button" id="appConfirmCancelBtn" class="app-confirm-btn app-confirm-cancel-btn">CANCEL</button>
                    <button type="button" id="appConfirmOkBtn" class="app-confirm-btn app-confirm-ok-btn">CONFIRM</button>
                </div>
            </div>
        </div>
    </div>
    `;
