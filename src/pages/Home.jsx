import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [familyImage, setFamilyImage] = useState('/img/imtekku-family.jpg');
    const [showGallery, setShowGallery] = useState(false);
    const [galleryItems, setGalleryItems] = useState([]);

    useEffect(() => {
        // Handle stat number animation
        const statNumbers = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateNumber = () => {
                        current += increment;
                        if (current < target) {
                            entry.target.textContent = Math.ceil(current);
                            requestAnimationFrame(updateNumber);
                        } else {
                            entry.target.textContent = target;
                        }
                    };
                    
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => observer.observe(stat));

        // Load dynamic settings from localStorage/AppUtils
        if (window.AppUtils) {
            const homeSettings = window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.homeSettings || 'imtekkuHomeSettings', {});
            if (homeSettings.familyImage) {
                setFamilyImage(homeSettings.familyImage);
            }
            if (homeSettings.galleryVisible) {
                setShowGallery(true);
                const galleryData = window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.gallery || 'imtekkuGalleryData', []);
                // Take latest 3 photos
                setGalleryItems(galleryData.slice(-3).reverse());
            }
        }

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section className="hero">
                <div className="hero-ambient hero-ambient-left" aria-hidden="true"></div>
                <div className="hero-ambient hero-ambient-right" aria-hidden="true"></div>
                <div className="hero-layout">
                    <div className="hero-content">
                        <span className="hero-subtitle fade-in">Leading Through Excellence</span>
                        <h1 className="hero-title fade-in-delay">IMTEKKU</h1>
                        <p className="hero-description fade-in-delay-2">IMTEKKU exists as a familial community for students from Kuningan studying at Telkom University. It's a place to share stories, move together, and grow together.</p>
                        <div className="hero-buttons fade-in-delay-3">
                            <Link to="/rekrutasi" className="btn btn-primary">JOIN THE BOARD</Link>
                            <a href="#about" className="btn btn-secondary">ORGANIZATION PROFILE</a>
                        </div>
                    </div>

                    <aside className="hero-panel fade-in-delay-3">
                        <p className="hero-panel-kicker">INSTITUTIONAL SNAPSHOT</p>
                        <h3>Built for Growth and Collaboration</h3>
                        <div className="hero-panel-highlight">
                            <span>ACTIVE COMMUNITY</span>
                            <strong>Connected Across Batches</strong>
                        </div>
                        <div className="hero-panel-grid">
                            <article className="hero-panel-card">
                                <span className="hero-panel-value">01</span>
                                <p>Leadership & Character Development</p>
                            </article>
                            <article className="hero-panel-card">
                                <span className="hero-panel-value">02</span>
                                <p>Regional Connectivity and Impact</p>
                            </article>
                            <article className="hero-panel-card">
                                <span className="hero-panel-value">03</span>
                                <p>Creative and Academic Ecosystem</p>
                            </article>
                        </div>
                        <p className="hero-panel-note">A professional student network grounded in solidarity and measurable contribution.</p>
                    </aside>
                </div>
            </section>

            <section id="about" className="about-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">OVERVIEW</span>
                        <h2>OUR ORGANIZATION PROFILE</h2>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <p>IMTEKKU is a home for students to learn, grow, and innovate within a strong spirit of kinship, with the aim of shaping professional and competitive generations at Telkom University.</p>
                            <p>Through this family-oriented environment, IMTEKKU empowers students to develop their potential and build readiness for real-world challenges.</p>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <h3 className="stat-number" data-target="69">0</h3>
                                    <p>COMMITTEE</p>
                                </div>
                                <div className="stat-item">
                                    <h3 className="stat-number" data-target="6">0</h3>
                                    <p>DIVISION</p>
                                </div>
                                <div className="stat-item">
                                    <h3 className="stat-number" data-target="8">0</h3>
                                    <p>WORK PROGRAMS</p>
                                </div>
                            </div>
                        </div>
                        <div className="about-image">
                            <div className="image-placeholder" style={{ padding: 0, overflow: 'hidden', background: '#eee' }}>
                                <img src={familyImage} alt="IMTEKKU Family" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => { e.target.src = '/img/LogoImtekku.png'; e.target.style.objectFit = 'contain'; }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="vision-mission">
                <div className="container">
                    <div className="vm-grid">
                        <div className="vm-card">
                            <h3>OUR VISION</h3>
                            <p>To become a solid, progressive, and effective student association, capable of becoming a second home for students from Kuningan and ready to make a real contribution to the nation and society.</p>
                        </div>
                        <div className="vm-card">
                            <h3>OUR MISSION</h3>
                            <ul>
                                <li>Building Unity and Family</li>
                                <li>Cultivating Leadership and Integrity</li>
                                <li>Developing Student Potential and Creativity</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="programs-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">SERVICES</span>
                        <h2>CORE INITIATIVES</h2>
                    </div>
                    <div className="programs-grid">
                        <div className="program-card">
                            <div className="program-icon">🎓</div>
                            <h3>ACADEMIC SUPPORT</h3>
                            <p>Providing resources and mentoring to help students excel in their Telkom University journey.</p>
                        </div>
                        <div className="program-card">
                            <div className="program-icon">🤝</div>
                            <h3>REGIONAL CONNECT</h3>
                            <p>Strengthening ties with Kuningan through cultural events and community service.</p>
                        </div>
                        <div className="program-card">
                            <div className="program-icon">🌟</div>
                            <h3>FAMILY GATHERING</h3>
                            <p>Regular meetups to foster solidarity and provide a support system for students away from home.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-crew-section" id="crew">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">LEADERSHIP</span>
                        <h2>ORGANIZATIONAL CORE</h2>
                    </div>
                    <div className="programs-grid">
                        <article className="program-card">
                            <h3>CHAIRMAN</h3>
                            <p>Directing organization strategy and governance with a focus on long-term sustainability.</p>
                        </article>
                        <article className="program-card">
                            <h3>GOVERNANCE</h3>
                            <p>Managing operational protocols and organizational transparency across all levels.</p>
                        </article>
                        <article className="program-card">
                            <h3>CAPITAL</h3>
                            <p>Overseeing financial resources and strategic asset management for project viability.</p>
                        </article>
                        <article className="program-card">
                            <h3>EXTERNAL</h3>
                            <p>Managing corporate relations and institutional partnerships to expand our reach.</p>
                        </article>
                    </div>
                </div>
            </section>

            {showGallery && (
                <section className="programs-section" id="homeGallery" style={{ background: '#fdfdfd' }}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">ARCHIVE</span>
                            <h2>LATEST ACTIVITIES</h2>
                        </div>
                        <div className="programs-grid">
                            {galleryItems.map((item, index) => (
                                <div key={index} className="program-card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src={item.url} alt="Activity" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>COMMUNITY ACTIVITY</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--corp-muted)' }}>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            ))}
                            {galleryItems.length === 0 && (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '2rem' }}>
                                    No activities recorded yet.
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <Link to="/galeri" className="btn btn-secondary">VIEW ALL DOCUMENTS</Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="cta-section">
                <div className="cta-orb cta-orb-left" aria-hidden="true"></div>
                <div className="cta-orb cta-orb-right" aria-hidden="true"></div>
                <div className="cta-ring cta-ring-left" aria-hidden="true"></div>
                <div className="cta-ring cta-ring-right" aria-hidden="true"></div>
                <div className="container">
                    <div className="cta-shell" id="ctaShell">
                        <span className="cta-kicker">Career Acceleration Program</span>
                        <h2>READY TO ADVANCE YOUR CAREER?</h2>
                        <p>Join the most prestigious professional collective on campus and build your network, execution skills, and leadership track.</p>
                        <Link to="/rekrutasi" className="btn btn-primary cta-action">APPLY FOR ENLISTMENT</Link>
                        <div className="cta-footnote">Next intake opens this quarter | Limited seats</div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
