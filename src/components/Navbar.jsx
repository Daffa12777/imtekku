import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="nav-container">
                <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img src="/img/LogoImtekku.png" alt="Logo IMTEKKU" className="logo-image" />
                    <span>IMTEKKU</span>
                </Link>
                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
                    <li><Link to="/" className={isActive('/')}>HOME</Link></li>
                    <li><Link to="/tim-inti" className={isActive('/tim-inti')}>ORGANIZATIONAL CORE</Link></li>
                    <li className={`dropdown ${isDropdownOpen ? 'active' : ''}`}>
                        <a href="#" className={`dropbtn ${location.pathname === '/divisi' ? 'active' : ''}`} onClick={toggleDropdown}>DIVISION</a>
                        <div className="dropdown-content">
                            <Link to="/divisi#acara">EVENTS</Link>
                            <Link to="/divisi#humas">PUBLIC RELATIONS</Link>
                            <Link to="/divisi#sponsor">SPONSORSHIP</Link>
                            <Link to="/divisi#logistik">LOGISTICS</Link>
                            <Link to="/divisi#psdm">HR DEVELOPMENT</Link>
                            <Link to="/divisi#medfo">MEDIA & INFORMATION</Link>
                        </div>
                    </li>
                    <li><Link to="/galeri" className={isActive('/galeri')}>DOCUMENTS</Link></li>
                    <li><Link to="/rekrutasi" className={`btn-rekrutasi ${isActive('/rekrutasi')}`}>CAREERS</Link></li>
                </ul>
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} id="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
