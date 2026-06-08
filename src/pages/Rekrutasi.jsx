import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/pages/rekrutasi-page.css';

const DEFAULT_RECRUITMENT_TIMELINE = [
    { phase: 'PHASE 1', title: 'APPLICATION WINDOW', date: 'JANUARY 2026' },
    { phase: 'PHASE 2', title: 'ADMINISTRATIVE SCREENING', date: 'FEBRUARY 2026' },
    { phase: 'PHASE 3', title: 'PROFESSIONAL INTERVIEW', date: 'FEBRUARY 2026' },
    { phase: 'PHASE 4', title: 'OFFICIAL ONBOARDING', date: 'MARCH 2026' }
];

const MAX_EMBEDDED_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_EMBEDDED_BYTES = 10 * 1024 * 1024;
const PORTFOLIO_IMAGE_PROFILE = { maxWidth: 900, maxHeight: 900, quality: 0.56, maxBytes: 160 * 1024 };

const Rekrutasi = () => {
    const [isCareersOpen, setIsCareersOpen] = useState(false);
    const [careersLockedForPublic, setCareersLockedForPublic] = useState(true);
    const [timeline, setTimeline] = useState(DEFAULT_RECRUITMENT_TIMELINE);
    const [requirements, setRequirements] = useState([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const formRef = useRef(null);

    const loadSettings = () => {
    if (window.AppUtils) {
        const homeSettings = window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.homeSettings || 'imtekkuHomeSettings', {});
        const openForPublic = homeSettings && homeSettings.careersOpen === true;
        setIsCareersOpen(openForPublic);

        // FIX: kunci murni ngikut setting careersOpen.
        // Sebelumnya di-bypass kalau admin login, makanya selalu keliatan kebuka.
        setCareersLockedForPublic(!openForPublic);

        const rawSettings = window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.recruitmentSettings || 'imtekkuRecruitmentSettings', {});

        if (Array.isArray(rawSettings.timeline) && rawSettings.timeline.length > 0) {
            setTimeline(rawSettings.timeline);
        }

        if (Array.isArray(rawSettings.requirements)) {
            setRequirements(rawSettings.requirements);
        }
    }
};

    useEffect(() => {
        loadSettings();

        const handleStorage = (e) => {
            const dataKeys = window.AppUtils?.DATA_KEYS || {};
            if (e.key === (dataKeys.recruitmentSettings || 'imtekkuRecruitmentSettings') || 
                e.key === (dataKeys.homeSettings || 'imtekkuHomeSettings') || 
                e.key === 'adminLoggedIn') {
                loadSettings();
            }
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('apputils:cloud-sync', loadSettings);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('apputils:cloud-sync', loadSettings);
        };
    }, []);

    const readFileAsDataUrl = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error(`Gagal membaca file: ${file.name}`));
            reader.readAsDataURL(file);
        });
    };

    const collectDynamicRequirementPayload = async (formElements) => {
        if (!requirements.length) return [];

        let totalEmbeddedBytes = 0;
        const payload = [];
        const dynamicOnly = requirements.filter(r => r.id !== 'cv' && r.id !== 'portfolio');

        for (let i = 0; i < dynamicOnly.length; i++) {
            const req = dynamicOnly[i];
            const input = formElements[`dynamicReq_${i}`];
            
            if (!input) {
                payload.push({ ...req, value: '-' });
                continue;
            }

            if (req.type === 'file') {
                const files = input.files ? Array.from(input.files).filter(Boolean) : [];
                if (!files.length) {
                    payload.push({ ...req, value: '-', files: [] });
                    continue;
                }

                const embeddedFiles = [];
                for (const file of files) {
                    if (file.size > MAX_EMBEDDED_FILE_BYTES) throw new Error(`File "${file.name}" terlalu besar.`);
                    totalEmbeddedBytes += file.size;
                    if (totalEmbeddedBytes > MAX_TOTAL_EMBEDDED_BYTES) throw new Error(`Total ukuran seluruh dokumen terlalu besar.`);
                    
                    const dataUrl = await readFileAsDataUrl(file);
                    embeddedFiles.push({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, dataUrl });
                }
                payload.push({ ...req, value: embeddedFiles.map(f => f.name).join(', '), files: embeddedFiles });
            } else {
                payload.push({ ...req, value: String(input.value || '').trim() || '-' });
            }
        }
        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (careersLockedForPublic) {
            alert('Menu CAREERS masih Coming Soon. Akses publik belum dibuka.');
            return;
        }

        const form = e.target;
        if (form.divisi.value && form.divisi2.value && form.divisi.value === form.divisi2.value) {
            alert('Divisi pilihan 2 harus berbeda dengan divisi pilihan 1!');
            return;
        }

        setIsSubmitting(true);

        try {
            const applicants = window.AppUtils.getJson('applicants', []);
            
            const payload = {
                id: Date.now(),
                fullName: form.fullName.value,
                nim: form.nim.value,
                semester: form.semester.value,
                email: form.email.value,
                phone: form.phone.value,
                divisi: form.divisi.value,
                divisi2: form.divisi2.value || '-',
                motivation: form.motivation.value,
                skills: form.skills.value || '-',
                experience: form.experience.value || '-',
                requirementResponses: await collectDynamicRequirementPayload(form.elements),
                registrationDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            };

            const cvSetting = requirements.find(r => r.id === 'cv');
            if (cvSetting && form.cvFile && form.cvFile.files[0]) {
                const file = form.cvFile.files[0];
                if (file.size > MAX_EMBEDDED_FILE_BYTES) throw new Error(`Ukuran CV maksimal 10MB`);
                payload.cvData = { name: file.name, type: file.type, dataUrl: await readFileAsDataUrl(file) };
            }

            const portfolioSetting = requirements.find(r => r.id === 'portfolio');
            if (portfolioSetting && form.portfolioFile && form.portfolioFile.files[0]) {
                const file = form.portfolioFile.files[0];
                if (file.size > MAX_EMBEDDED_FILE_BYTES) throw new Error(`Ukuran Portfolio maksimal 10MB`);
                let dataUrl = await readFileAsDataUrl(file);
                if (file.type.startsWith('image/') && window.AppUtils.resizeImage) {
                    try {
                        dataUrl = await window.AppUtils.resizeImage(dataUrl, PORTFOLIO_IMAGE_PROFILE.maxWidth, PORTFOLIO_IMAGE_PROFILE.maxHeight, PORTFOLIO_IMAGE_PROFILE.quality, PORTFOLIO_IMAGE_PROFILE.maxBytes);
                    } catch (err) { console.warn('Failed to resize', err); }
                }
                payload.portfolioData = { name: file.name, type: file.type, dataUrl };
            }

            applicants.push(payload);
            window.AppUtils.setJson('applicants', applicants);
            
            setShowSuccess(true);
            form.reset();
        } catch (error) {
            alert(error?.message || 'Terjadi kesalahan saat submit.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cvSetting = requirements.find(r => r.id === 'cv');
    const portfolioSetting = requirements.find(r => r.id === 'portfolio');
    const dynamicOnly = requirements.filter(r => r.id !== 'cv' && r.id !== 'portfolio');

    return (
        <>
            <header className="page-header" style={{ backgroundImage: "linear-gradient(rgba(0, 31, 63, 0.8), rgba(0, 31, 63, 0.8)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2084')" }}>
                <div className="container">
                    <div className="header-content fade-in">
                        <p>JOIN IMTEKKU</p>
                        <h1>CAREERS & RECRUITMENT</h1>
                    </div>
                </div>
            </header>

            <section className={`registration-section ${careersLockedForPublic ? 'careers-locked-mode' : ''}`}>
                {careersLockedForPublic && (
                    <div className="careers-coming-soon-overlay">
                        <div className="careers-coming-soon-card">
                            <span className="coming-soon-badge">CAREERS</span>
                            <h2>COMING SOON!!!</h2>
                            <p>Menu rekrutasi sedang dipersiapkan. Akses publik akan dibuka oleh admin.</p>
                        </div>
                    </div>
                )}

                <div className="container">
                    <div className="registration-content">
                        <div className="registration-info fade-in-delay">
                            <h2>BE PART OF THE MOVEMENT</h2>
                            <p className="info-text">
                                We are looking for passionate, driven, and capable individuals to join our governing board and divisions. 
                                By joining IMTEKKU, you become part of an elite professional network dedicated to growth, impact, and solidarity.
                            </p>

                            <div className="benefit-list">
                                <div className="benefit-item">
                                    <div className="benefit-icon">📈</div>
                                    <div>
                                        <h4 style={{ color: 'var(--corp-navy)', marginBottom: '0.3rem' }}>Career Acceleration</h4>
                                        <p style={{ color: 'var(--corp-muted)', fontSize: '0.9rem' }}>Real-world project execution and leadership opportunities.</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <div className="benefit-icon">🤝</div>
                                    <div>
                                        <h4 style={{ color: 'var(--corp-navy)', marginBottom: '0.3rem' }}>Elite Network</h4>
                                        <p style={{ color: 'var(--corp-muted)', fontSize: '0.9rem' }}>Direct connection to seniors, alumni, and campus stakeholders.</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <div className="benefit-icon">🛡️</div>
                                    <div>
                                        <h4 style={{ color: 'var(--corp-navy)', marginBottom: '0.3rem' }}>Solidarity & Support</h4>
                                        <p style={{ color: 'var(--corp-muted)', fontSize: '0.9rem' }}>A true family far from home to support your academic journey.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="timeline-info">
                                <h3>RECRUITMENT TIMELINE</h3>
                                <ul id="recruitmentTimelineList">
                                    {timeline.map((item, i) => (
                                        <li key={i}><span>{item.phase}</span> {item.title}: {item.date}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="registration-form-container fade-in-delay-2">
                            <form id="registrationForm" className="registration-form" onSubmit={handleSubmit} ref={formRef}>
                                <h3>ENLISTMENT FORM</h3>
                                
                                <div className="form-group">
                                    <label htmlFor="fullName">FULL NAME *</label>
                                    <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name" disabled={careersLockedForPublic} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="nim">STUDENT ID (NIM) *</label>
                                        <input type="text" id="nim" name="nim" required placeholder="Ex: 1301234567" disabled={careersLockedForPublic} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="semester">CURRENT SEMESTER *</label>
                                        <select id="semester" name="semester" required disabled={careersLockedForPublic}>
                                            <option value="">Select Semester</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                            <option value="7">Semester 7</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">EMAIL ADDRESS *</label>
                                        <input type="email" id="email" name="email" required placeholder="Enter valid email" disabled={careersLockedForPublic} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">WHATSAPP NUMBER *</label>
                                        <input type="tel" id="phone" name="phone" required placeholder="Ex: 081234567890" disabled={careersLockedForPublic} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="divisi">DIVISION CHOICE 1 *</label>
                                        <select id="divisi" name="divisi" required disabled={careersLockedForPublic}>
                                            <option value="">Select First Choice</option>
                                            <option value="acara">EVENTS</option>
                                            <option value="humas">PUBLIC RELATIONS</option>
                                            <option value="sponsor">SPONSORSHIP</option>
                                            <option value="logistik">LOGISTICS</option>
                                            <option value="psdm">HR DEVELOPMENT</option>
                                            <option value="medfo">MEDIA & INFORMATION</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="divisi2">DIVISION CHOICE 2</label>
                                        <select id="divisi2" name="divisi2" disabled={careersLockedForPublic}>
                                            <option value="">Select Second Choice (Optional)</option>
                                            <option value="acara">EVENTS</option>
                                            <option value="humas">PUBLIC RELATIONS</option>
                                            <option value="sponsor">SPONSORSHIP</option>
                                            <option value="logistik">LOGISTICS</option>
                                            <option value="psdm">HR DEVELOPMENT</option>
                                            <option value="medfo">MEDIA & INFORMATION</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="motivation">PROFESSIONAL STATEMENT / MOTIVATION *</label>
                                    <textarea id="motivation" name="motivation" rows="4" required placeholder="Why do you want to join IMTEKKU and what value can you bring?" disabled={careersLockedForPublic} maxLength={500}></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="skills">KEY SKILLS</label>
                                    <input type="text" id="skills" name="skills" placeholder="Ex: Graphic Design, Public Speaking, Negotiation" disabled={careersLockedForPublic} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="experience">ORGANIZATIONAL EXPERIENCE</label>
                                    <textarea id="experience" name="experience" rows="3" placeholder="List your previous organizational or project experiences (if any)" disabled={careersLockedForPublic} maxLength={500}></textarea>
                                </div>

                                {(cvSetting || portfolioSetting) && (
                                    <div className="form-row" id="fixedRequirementsRow">
                                        {cvSetting && (
                                            <div className="form-group">
                                                <label htmlFor="cvFile">{cvSetting.label.toUpperCase()}{cvSetting.required ? ' *' : ''}</label>
                                                <input type="file" id="cvFile" name="cvFile" required={cvSetting.required} accept={cvSetting.accept} disabled={careersLockedForPublic} />
                                                {cvSetting.accept && <small style={{ display: 'block', marginTop: '0.5rem', color: '#6b7280', fontSize: '0.8rem' }}>Allowed: {cvSetting.accept}</small>}
                                            </div>
                                        )}
                                        {portfolioSetting && (
                                            <div className="form-group">
                                                <label htmlFor="portfolioFile">{portfolioSetting.label.toUpperCase()}{portfolioSetting.required ? ' *' : ''}</label>
                                                <input type="file" id="portfolioFile" name="portfolioFile" required={portfolioSetting.required} accept={portfolioSetting.accept} disabled={careersLockedForPublic} />
                                                {portfolioSetting.accept && <small style={{ display: 'block', marginTop: '0.5rem', color: '#6b7280', fontSize: '0.8rem' }}>Allowed: {portfolioSetting.accept}</small>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {dynamicOnly.length > 0 && (
                                    <div className="dynamic-requirements-list">
                                        {dynamicOnly.map((req, i) => (
                                            <div key={i} className="form-group dynamic-requirement-item">
                                                <div className="requirement-label-row">
                                                    <label>{req.label}{req.required ? ' *' : ''}</label>
                                                    <span className="requirement-badge">{req.type === 'textarea' ? 'PARAGRAPH' : req.type === 'text' ? 'SHORT TEXT' : 'FILE UPLOAD'}</span>
                                                </div>
                                                {req.type === 'textarea' ? (
                                                    <textarea name={`dynamicReq_${i}`} rows="3" required={req.required} placeholder={`Input ${req.label.toLowerCase()}...`} disabled={careersLockedForPublic} maxLength={500}></textarea>
                                                ) : req.type === 'text' ? (
                                                    <input type="text" name={`dynamicReq_${i}`} required={req.required} placeholder={`Input ${req.label.toLowerCase()}...`} disabled={careersLockedForPublic} />
                                                ) : (
                                                    <>
                                                        <input type="file" name={`dynamicReq_${i}`} required={req.required} accept={req.accept} disabled={careersLockedForPublic} />
                                                        <small className="requirement-helper">Ukuran file maksimal 10MB.</small>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="checkbox-group">
                                    <label>
                                        <input type="checkbox" required disabled={careersLockedForPublic} />
                                        <span>I hereby declare that the information provided is accurate and I am committed to dedicating my time to IMTEKKU if accepted.</span>
                                    </label>
                                </div>

                                <button type="submit" className="submit-btn" disabled={careersLockedForPublic || isSubmitting}>
                                    {isSubmitting ? 'PROCESSING...' : 'SUBMIT APPLICATION'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {showSuccess && (
                <div className="modal" style={{ display: 'block' }} onClick={(e) => { if (e.target.className === 'modal') setShowSuccess(false); }}>
                    <div className="modal-content small fade-in">
                        <span className="close-modal" onClick={() => setShowSuccess(false)}>&times;</span>
                        <div className="success-container">
                            <div className="success-icon">✓</div>
                            <h2 style={{ color: 'var(--corp-navy)', marginBottom: '1rem' }}>APPLICATION RECEIVED</h2>
                            <p style={{ color: 'var(--corp-muted)', lineHeight: '1.6' }}>
                                Thank you for your interest in joining IMTEKKU. Your application has been successfully submitted to our database.
                                <br /><br />
                                Please wait for further information regarding the screening process via WhatsApp or Email.
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setShowSuccess(false)}>RETURN TO PAGE</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Rekrutasi;
