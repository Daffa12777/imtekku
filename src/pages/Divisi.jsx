import React, { useEffect, useState } from 'react';
import '../assets/css/pages/divisi-page.css';

const DEFAULT_STAFF_TARGET_PER_DIVISION = 14;
const STAFF_TARGET_BY_DIVISION = {
    acara: 10,
    humas: 10,
    sponsor: 8,
    logistik: 13,
    psdm: 9
};

const DIVISIONS = [
    {
        id: 'acara',
        title: 'EVENTS',
        tagline: 'Menciptakan momen, mengukir cerita, dan merealisasikan gagasan menjadi aksi nyata.',
        desc: 'Divisi Acara merupakan jantung operasional IMTEKKU yang merancang, mengorganisasi, dan mengeksekusi seluruh program kerja dan kegiatan. Kami bertanggung jawab atas konsep acara, rundown, serta memastikan setiap kegiatan berjalan dengan lancar dan berkesan.',
        features: [
            { icon: '🎯', text: 'Konseptor & Eksekutor seluruh agenda IMTEKKU' },
            { icon: '⭐', text: 'Manajemen acara dan stage direction' },
            { icon: '💡', text: 'Inovasi program kerja yang berdampak' }
        ]
    },
    {
        id: 'humas',
        title: 'PUBLIC RELATIONS',
        tagline: 'Menjadi wajah organisasi, membangun koneksi, dan menjaga citra positif.',
        desc: 'Divisi Humas (Hubungan Masyarakat) berperan sebagai jembatan informasi antara IMTEKKU dengan pihak eksternal maupun internal. Kami membangun relasi dengan organisasi lain, alumni, dan menjaga komunikasi yang baik di dalam lingkup Telkom University maupun Kuningan.',
        features: [
            { icon: '🤝', text: 'Manajemen relasi internal dan eksternal' },
            { icon: '📢', text: 'Pusat informasi dan komunikasi organisasi' },
            { icon: '🌟', text: 'Membangun dan menjaga citra IMTEKKU' }
        ]
    },
    {
        id: 'sponsor',
        title: 'SPONSORSHIP',
        tagline: 'Motor penggerak finansial melalui kolaborasi dan kemitraan strategis.',
        desc: 'Divisi Sponsorship bertanggung jawab dalam mencari dan mengelola sumber pendanaan kegiatan IMTEKKU melalui kerjasama dengan berbagai pihak. Kami menyusun proposal, melakukan pitching, dan menjaga hubungan baik dengan para mitra dan donatur.',
        features: [
            { icon: '💰', text: 'Fundraising dan kemitraan finansial' },
            { icon: '📈', text: 'Manajemen proposal dan pitching sponsorship' },
            { icon: '🤝', text: 'Membangun relasi dengan mitra perusahaan' }
        ]
    },
    {
        id: 'logistik',
        title: 'LOGISTICS',
        tagline: 'Pondasi operasional yang memastikan ketersediaan setiap kebutuhan.',
        desc: 'Divisi Logistik memastikan seluruh kebutuhan perlengkapan dan peralatan setiap acara IMTEKKU terpenuhi. Kami bertanggung jawab atas peminjaman, pengelolaan aset, dan tata letak operasional (layout) di lapangan.',
        features: [
            { icon: '📦', text: 'Manajemen aset dan inventaris organisasi' },
            { icon: '🔧', text: 'Persiapan peralatan dan perlengkapan teknis' },
            { icon: '🏗️', text: 'Pengaturan operasional lapangan' }
        ]
    },
    {
        id: 'psdm',
        title: 'HR DEVELOPMENT',
        tagline: 'Membentuk karakter, menggali potensi, dan menjaga solidaritas keluarga.',
        desc: 'Divisi PSDM (Pengembangan Sumber Daya Manusia) fokus pada kaderisasi, pengembangan soft skill, dan evaluasi kinerja anggota. Kami memastikan kesejahteraan internal dan menciptakan iklim organisasi yang sehat dan kekeluargaan.',
        features: [
            { icon: '🌱', text: 'Kaderisasi dan pengembangan karakter' },
            { icon: '📊', text: 'Evaluasi dan monitoring kinerja anggota' },
            { icon: '❤️', text: 'Menjaga solidaritas dan kesejahteraan internal' }
        ]
    },
    {
        id: 'medfo',
        title: 'MEDIA & INFORMATION',
        tagline: 'Menangkap momen, menyampaikan pesan, dan merajut jejak digital.',
        desc: 'Divisi Medfo (Media dan Informasi) adalah ujung tombak kreativitas IMTEKKU di dunia digital. Kami bertanggung jawab atas desain grafis, dokumentasi acara, serta pengelolaan media sosial untuk menyebarkan informasi secara menarik dan informatif.',
        features: [
            { icon: '🎨', text: 'Desain grafis dan konten kreatif' },
            { icon: '📸', text: 'Dokumentasi foto dan video (Cinematography)' },
            { icon: '📱', text: 'Social media management (Instagram/TikTok)' }
        ]
    }
];

const Divisi = () => {
    const [divisionsData, setDivisionsData] = useState({});
    const [photos, setPhotos] = useState({});

    const loadData = () => {
        if (window.AppUtils) {
            setDivisionsData(window.AppUtils.getJson('imtekkuDivisionData', {}));
            setPhotos(window.AppUtils.getJson('imtekkuDivisionMemberPhotos', {}));
        }
    };

    useEffect(() => {
        loadData();

        const handleStorage = (e) => {
            if (e.key === 'imtekkuDivisionData' || e.key === 'imtekkuDivisionMemberPhotos') {
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

    const makeAvatar = (name) => {
        const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0] ? part[0].toUpperCase() : '').join('');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill="#f2c14e"/><text x="50" y="56" font-family="Arial" font-size="30" font-weight="700" text-anchor="middle" fill="#3b2505">${initials}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

    const buildDivisionMembers = (divisionKey) => {
        const storedMembers = divisionsData[divisionKey] || [];
        const fullList = [...storedMembers];
        const staffTarget = STAFF_TARGET_BY_DIVISION[divisionKey] || DEFAULT_STAFF_TARGET_PER_DIVISION;

        while (fullList.length < staffTarget) {
            const index = fullList.length + 1;
            fullList.push({
                id: `${divisionKey}-placeholder-${index}`,
                name: `Data anggota ke-${index} belum diisi`,
                nim: '-',
                major: 'Jurusan belum diisi',
                instagram: '',
                role: 'Anggota Divisi',
                zoom: 100
            });
        }
        return fullList;
    };

    const handlePointerMove = (e, cardRef) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const relativeX = (e.clientX - rect.left) / rect.width;
        const relativeY = (e.clientY - rect.top) / rect.height;
        const CARD_TILT_LIMIT = 6;
        const tiltY = (relativeX - 0.5) * CARD_TILT_LIMIT * 2;
        const tiltX = (0.5 - relativeY) * CARD_TILT_LIMIT * 2;
        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    };

    const handlePointerLeave = (cardRef) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
    };

    const handlePointerEnter = (cardRef) => {
        if (!cardRef.current) return;
        cardRef.current.classList.add('is-tilting');
    };

    const MemberCard = ({ member, photoUrl }) => {
        const cardRef = React.useRef(null);
        const profilePhoto = photoUrl || makeAvatar(member.name);
        const instagramFilled = member.instagram && member.instagram.trim() !== '';
        
        return (
            <article 
                ref={cardRef}
                className="member-card"
                onPointerEnter={() => handlePointerEnter(cardRef)}
                onPointerLeave={() => handlePointerLeave(cardRef)}
                onPointerMove={(e) => handlePointerMove(e, cardRef)}
            >
                <div className="member-photo-frame">
                    <img 
                        src={profilePhoto} 
                        alt={`Foto ${member.name}`} 
                        className="member-photo-image" 
                        style={{ transform: `scale(${member.zoom / 100})`, width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
                <p className="member-role">{member.role}</p>
                <h4>{member.name}</h4>
                <p className="member-major">{member.major}</p>
                <p className="member-nim">NIM: {member.nim}</p>
                {instagramFilled ? (
                    <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noopener noreferrer" className="member-instagram">
                        @{member.instagram}
                    </a>
                ) : (
                    <span className="member-instagram">Instagram belum diisi</span>
                )}
            </article>
        );
    };

    return (
        <>
            <header className="divisi-hero">
                <div className="container">
                    <div className="header-content fade-in">
                        <span className="hero-kicker">GOVERNANCE BODY</span>
                        <h1>DIVISION</h1>
                        <p>Discover the driving forces behind our initiatives. Each division plays a crucial role in realizing IMTEKKU's vision and mission.</p>
                        <div className="hero-quicknav fade-in-delay">
                            {DIVISIONS.map(div => (
                                <a key={`nav-${div.id}`} href={`#${div.id}`}>{div.title}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {DIVISIONS.map((division, index) => {
                const isAlternate = index % 2 !== 0;
                const members = buildDivisionMembers(division.id);
                
                return (
                    <section 
                        key={division.id} 
                        id={division.id} 
                        className={`divisi-section ${isAlternate ? 'alternate' : ''}`}
                    >
                        <div className="container">
                            <div className="divisi-content">
                                <div className="divisi-info fade-in-delay">
                                    <span className="crew-badge">OPERATIONAL FORCE</span>
                                    <div className="badge-icon">{division.features[0].icon}</div>
                                    <h2>{division.title}</h2>
                                    <p className="divisi-tagline">{division.tagline}</p>
                                    <p className="divisi-description">{division.desc}</p>
                                    
                                    <div className="divisi-features">
                                        {division.features.map((feat, idx) => (
                                            <div key={idx} className="feature-item">
                                                <div className="feature-icon">{feat.icon}</div>
                                                <span>{feat.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="divisi-team fade-in-delay-2">
                                    <h3>DIVISION CREW</h3>
                                    <p className="team-note">TOTAL PROFESSIONALS: {members.length}</p>
                                    <div className="member-grid">
                                        {members.map(member => (
                                            <MemberCard 
                                                key={member.id} 
                                                member={member} 
                                                photoUrl={photos[member.id]} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}
        </>
    );
};

export default Divisi;
