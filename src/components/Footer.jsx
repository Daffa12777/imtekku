import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'IMTEKKUKNG' && password === 'imtekku2627') {
            window.ImtekkuStore.setItem('adminLoggedIn', 'true');
            setIsLoginModalOpen(false);
            navigate('/admin');
        } else {
            alert('Username atau password salah!');
        }
    };

    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <div className="footer-logo">IMTEK<span>KU</span></div>
                            <p>IKATAN MAHASISWA TELKOM UNIVERSITY KUNINGAN</p>
                            <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--corp-gold)' }}>FOUNDED 2026</p>
                        </div>
                        <div className="footer-col">
                            <h4>DIRECTORY</h4>
                            <ul>
                                <li><Link to="/">HOME</Link></li>
                                <li><Link to="/tim-inti">ORGANIZATIONAL CORE</Link></li>
                                <li><Link to="/divisi">DIVISION</Link></li>
                                <li><Link to="/galeri">DOCUMENTS</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>DIVISION</h4>
                            <ul>
                                <li><Link to="/divisi#acara">EVENTS</Link></li>
                                <li><Link to="/divisi#humas">PUBLIC RELATIONS</Link></li>
                                <li><Link to="/divisi#sponsor">SPONSORSHIP</Link></li>
                                <li><Link to="/divisi#logistik">LOGISTICS</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>CONTACT</h4>
                            <ul>
                                <li>EMAIL: IMTEKKU25@GMAIL.COM</li>
                                <li>LOCATION: Jl. Telekomunikasi No.1, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>
                            &copy; 2026 IMTEKKU. ALL RIGHTS RESERVED. EXCELLENCE IN GOVERNANCE.
                            <button type="button" className="footer-admin-link" onClick={() => setIsLoginModalOpen(true)}>ADMIN LOGIN</button>
                        </p>
                    </div>
                </div>
            </footer>

            {isLoginModalOpen && (
                <div className="modal" style={{ display: 'block' }} onClick={(e) => {
                    if (e.target.className === 'modal') setIsLoginModalOpen(false);
                }}>
                    <div className="modal-content small">
                        <span className="close-modal" onClick={() => setIsLoginModalOpen(false)}>&times;</span>
                        <div className="admin-login-panel">
                            <h2>ADMIN LOGIN</h2>
                            <p>Masuk untuk mengelola data rekrutasi, anggota, dan galeri IMTEKKU.</p>
                            <form className="admin-login-form" onSubmit={handleLogin}>
                                <label htmlFor="globalAdminUsername">USERNAME</label>
                                <input
                                    type="text"
                                    id="globalAdminUsername"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <label htmlFor="globalAdminPassword">PASSWORD</label>
                                <input
                                    type="password"
                                    id="globalAdminPassword"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button type="submit" className="admin-login-submit">LOGIN SEKARANG</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
