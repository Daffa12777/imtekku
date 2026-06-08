import React, { useEffect, useState } from 'react';
import '../assets/css/pages/galeri-page.css';

const Galeri = () => {
    const [archived, setArchived] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [categories, setCategories] = useState([{ id: 'roadshow', name: 'ANNUAL ROADSHOW' }, { id: 'carrty', name: 'CHARITY PROGRAM' }]);
    const [activeFilter, setActiveFilter] = useState('roadshow');
    const [modalData, setModalData] = useState(null);

    const loadData = () => {
        if (window.AppUtils) {
            setArchived(window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.archivedCollections || 'imtekkuArchivedCollections', []));
            setGallery(window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.gallery || 'imtekkuGalleryData', []));
            const cats = window.AppUtils.getJson(window.AppUtils.DATA_KEYS?.galleryCategories || 'imtekkuGalleryCategories', [
                { id: 'roadshow', name: 'ANNUAL ROADSHOW' },
                { id: 'carrty', name: 'CHARITY PROGRAM' }
            ]);
            setCategories(cats);
            if (cats.length > 0 && !cats.find(c => c.id === activeFilter)) {
                setActiveFilter(cats[0].id);
            }
        }
    };

    useEffect(() => {
        loadData();

        const handleStorage = (e) => {
            const dataKeys = window.AppUtils?.DATA_KEYS || {};
            if (
                e.key === (dataKeys.gallery || 'imtekkuGalleryData') ||
                e.key === (dataKeys.galleryCategories || 'imtekkuGalleryCategories') ||
                e.key === (dataKeys.archivedCollections || 'imtekkuArchivedCollections')
            ) {
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

    const openArchivedModal = (item) => {
        setModalData({
            type: 'archived',
            tag: item.tag,
            title: item.title,
            date: item.date,
            description: item.desc,
            url: item.url,
            id: item.id
        });
    };

    const openDynamicPhotoModal = (url) => {
        setModalData({
            type: 'dynamic',
            tag: 'COMMUNITY',
            title: 'ORGANIZATION ACTIVITY',
            date: 'RECENTLY UPLOADED',
            description: 'Live documentation from recent organizational events and community gatherings.',
            url: url
        });
    };

    const closeModal = () => {
        setModalData(null);
    };

    const filteredGallery = gallery.filter(item => item.category === activeFilter);

    return (
        <>
            <header className="page-header" style={{ backgroundImage: "linear-gradient(rgba(0, 31, 63, 0.8), rgba(0, 31, 63, 0.8)), url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=2070')" }}>
                <div className="container">
                    <div className="header-content fade-in">
                        <p>MEDIA LIBRARY</p>
                        <h1>DOCUMENTS & GALLERY</h1>
                    </div>
                </div>
            </header>

            <section className="filter-section fade-in-delay">
                <div className="container">
                    <div className="filter-buttons">
                        {categories.map((cat, index) => (
                            <button 
                                key={cat.id}
                                className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="gallery-section">
                <div className="container">
                    <div className="section-header fade-in-delay-2">
                        <span className="section-tag">COMMUNITY</span>
                        <h2>ORGANIZATION ACTIVITIES</h2>
                    </div>
                    
                    <div className="gallery-grid" style={{ marginBottom: '6rem' }}>
                        {filteredGallery.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#999' }}>
                                No photos found in this section.
                            </div>
                        ) : (
                            filteredGallery.map((item, index) => (
                                <div key={index} className="gallery-item fade-in-delay-3" style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
                                    <div className="gallery-card">
                                        <div className="gallery-image">
                                            <img src={item.url} alt="Gallery Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <div className="gallery-overlay">
                                                <button className="view-btn" onClick={() => openDynamicPhotoModal(item.url)}>VIEW PHOTO</button>
                                            </div>
                                        </div>
                                        <div className="gallery-info">
                                            <span className="gallery-tag">{(activeFilter || 'Community').toUpperCase()}</span>
                                            <h3>ORGANIZATION ACTIVITY</h3>
                                            <p>{item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently Uploaded'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="section-header fade-in-delay-2">
                        <span className="section-tag">ARCHIVE</span>
                        <h2>DOCUMENTED COLLECTIONS</h2>
                    </div>

                    <div className="gallery-grid">
                        {archived.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#999' }}>
                                No archived collections yet.
                            </div>
                        ) : (
                            archived.map((item) => (
                                <div key={item.id} className="gallery-item fade-in-delay-3" data-category={item.tag.toLowerCase()} style={{ transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
                                    <div className="gallery-card">
                                        <div className="gallery-image">
                                            {item.url ? (
                                                <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <span className="placeholder-icon">
                                                        {item.id < 4 ? `DOC-0${item.id}` : (item.id <= 6 ? `CRP-0${item.id-3}` : `ARC-${item.id}`)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="gallery-overlay">
                                                <button className="view-btn" onClick={() => openArchivedModal(item)}>VIEW DETAILS</button>
                                            </div>
                                        </div>
                                        <div className="gallery-info">
                                            <span className="gallery-tag">{item.tag}</span>
                                            <h3>{item.title}</h3>
                                            <p>{item.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {modalData && (
                <div className="modal" style={{ display: 'block' }} onClick={(e) => { if(e.target.className === 'modal') closeModal(); }}>
                    <div className="modal-content fade-in">
                        <span className="close-modal" onClick={closeModal}>&times;</span>
                        <div className="modal-body">
                            <div className="modal-image" id="modalIcon">
                                {modalData.url ? (
                                    <img src={modalData.url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 0 0 8px' }} alt="Modal Preview" />
                                ) : (
                                    <div className="image-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--corp-navy)', opacity: 0.2 }}>
                                        {modalData.id <= 6 ? (modalData.id < 4 ? `DOC-0${modalData.id}` : `CRP-0${modalData.id-3}`) : `ARC-${modalData.id}`}
                                    </div>
                                )}
                            </div>
                            <div className="modal-info">
                                <span className="gallery-tag" id="modalTag">{modalData.tag}</span>
                                <h2 id="modalTitle">{modalData.title}</h2>
                                <span className="modal-date" id="modalDate">{modalData.date}</span>
                                <p className="modal-description" id="modalDescription">{modalData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Galeri;
