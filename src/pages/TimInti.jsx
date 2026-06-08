import React, { useEffect, useState } from 'react';
import '../assets/css/pages/tim-inti-page.css';

const TimInti = () => {
    const [team, setTeam] = useState([]);
    const [photos, setPhotos] = useState({});

    const loadData = () => {
        if (window.AppUtils) {
            const DATA_KEY = window.AppUtils.DATA_KEYS?.team || 'imtekkuTeamData';
            const PHOTO_KEY = window.AppUtils.DATA_KEYS?.teamPhotos || 'imtekkuTeamPhotos';
            
            setTeam(window.AppUtils.getJson(DATA_KEY, []));
            setPhotos(window.AppUtils.getJson(PHOTO_KEY, {}));
        }
    };

    useEffect(() => {
        loadData();
        
        const handleStorage = (e) => {
            if (window.AppUtils && 
                (e.key === (window.AppUtils.DATA_KEYS?.team || 'imtekkuTeamData') || 
                 e.key === (window.AppUtils.DATA_KEYS?.teamPhotos || 'imtekkuTeamPhotos'))) {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('apputils:cloud-sync', loadData);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('apputils:cloud-sync', loadData);
        };
    }, []);

    const normalizeInstagramUsername = (rawValue) => {
        const value = String(rawValue || '').trim();
        if (!value) return '';

        const urlMatch = value.match(/instagram\.com\/@?([A-Za-z0-9._]+)/i);
        if (urlMatch && urlMatch[1]) return urlMatch[1];

        const cleaned = value
            .replace(/^https?:\/\//i, '')
            .replace(/^www\./i, '')
            .replace(/^instagram\.com\//i, '')
            .replace(/^@+/, '')
            .split(/[/?#]/)[0]
            .trim();

        return /^[A-Za-z0-9._]+$/.test(cleaned) ? cleaned : '';
    };

    const renderTeamCards = (roleFilter) => {
        // Find member in state or create a placeholder if not set yet.
        // For static matching (like in original HTML), we assume IDs are like 'ketua', 'sekjen', etc.
        // Wait, original HTML had hardcoded containers with id="ketua", "sekjen", "bendahara", "koor-internal", etc.
        // Instead of fully dynamic rendering by state, we can map over predefined IDs and fill with state if found.
        const defaultMembers = [
            { id: 'ketua', role: 'CHAIRMAN', fallbackName: 'Data Ketua' },
            { id: 'sekjen', role: 'SECRETARY GENERAL', fallbackName: 'Data Sekjen' },
            { id: 'bendahara', role: 'TREASURER', fallbackName: 'Data Bendahara' },
            { id: 'koor-internal', role: 'INTERNAL AFFAIRS', fallbackName: 'Koor Internal' },
            { id: 'koor-eksternal', role: 'EXTERNAL AFFAIRS', fallbackName: 'Koor Eksternal' }
        ];

        const filtered = defaultMembers.filter(m => {
            if (roleFilter === 'leadership') return m.id === 'ketua';
            if (roleFilter === 'core') return m.id === 'sekjen' || m.id === 'bendahara';
            if (roleFilter === 'coordinator') return m.id === 'koor-internal' || m.id === 'koor-eksternal';
            return true;
        });

        return filtered.map(defMember => {
            const memberData = team.find(m => m.id === defMember.id) || {
                id: defMember.id,
                name: defMember.fallbackName,
                role: defMember.role,
                nim: '',
                major: '',
                instagram: '',
                zoom: 100
            };

            const photoUrl = photos[memberData.id];
            const igUsername = normalizeInstagramUsername(memberData.instagram);

            return (
                <article key={defMember.id} className={`team-card fade-in-delay-2 ${defMember.id === 'ketua' ? 'leader' : ''}`}>
                    <div className="card-inner">
                        <div className="member-photo" id={memberData.id}>
                            {photoUrl ? (
                                <img 
                                    src={photoUrl} 
                                    alt={memberData.name} 
                                    style={{ transform: `scale(${memberData.zoom / 100})`, width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                <span>{memberData.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <span className="position">{memberData.role}</span>
                        <h3>{memberData.name}</h3>
                        <p className="description">
                            {memberData.nim ? (
                                <>
                                    NIM: {memberData.nim}<br />
                                    Major: {memberData.major || '-'}
                                </>
                            ) : (
                                <>NIM/Jurusan belum diisi</>
                            )}
                        </p>
                        <div className="social-links">
                            {igUsername ? (
                                <a href={`https://instagram.com/${igUsername}`} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={`Instagram ${memberData.name}`}>IG</a>
                            ) : (
                                <a href="#" className="social-icon is-disabled" aria-disabled="true" onClick={(e) => e.preventDefault()}>IG</a>
                            )}
                        </div>
                    </div>
                </article>
            );
        });
    };

    return (
        <>
            <header className="page-header" style={{ backgroundImage: "linear-gradient(rgba(0, 31, 63, 0.8), rgba(0, 31, 63, 0.8)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')" }}>
                <div className="container">
                    <div className="header-content fade-in">
                        <p>GOVERNANCE</p>
                        <h1>ORGANIZATIONAL CORE</h1>
                    </div>
                </div>
            </header>

            <section className="team-section">
                <div className="container">
                    
                    <div className="leadership-section">
                        <div className="leadership-grid">
                            {renderTeamCards('leadership')}
                        </div>
                    </div>

                    <div className="core-section">
                        <div className="core-grid">
                            {renderTeamCards('core')}
                        </div>
                    </div>

                    <div className="coordinator-section">
                        <div className="coordinator-grid">
                            {renderTeamCards('coordinator')}
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    );
};

export default TimInti;
