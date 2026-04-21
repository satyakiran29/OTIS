import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = ['Home', 'About', 'Team', 'Project', 'Events', 'Accommodation', 'Donations'];

    return (
        <nav className={`navbar ${scrolled || mobileMenuOpen ? 'scrolled' : ''}`}>
            <div className="navbar-inner">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <span style={{ fontSize: '1.5rem' }}>🛕</span>
                        <h1 className="logo-text">
                            Temple<span>Info</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    <ul className="nav-links-list">
                        {navLinks.map((item) => {
                            const anchorId = item.toLowerCase();
                            const isPageRoute = ['Events', 'Accommodation', 'Donations'].includes(item);

                            if (isPageRoute) {
                                return (
                                    <li key={item}>
                                        <Link to={`/${anchorId}`} className="nav-link">
                                            {item}
                                        </Link>
                                    </li>
                                );
                            }

                            return (
                                <li key={item}>
                                    {isHome ? (
                                        <a href={`#${anchorId}`} className="nav-link">
                                            {item}
                                        </a>
                                    ) : (
                                        <Link to={`/#${anchorId}`} className="nav-link">
                                            {item}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    <div className="user-actions">
                        {user ? (
                            <>
                                <Link to="/profile" className="user-greeting">
                                    Hello, {user.name}
                                </Link>
                                {(user.role === 'admin' || user.role === 'super-admin') && (
                                    <Link to="/dashboard" className="btn-dashboard">
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="btn-logout">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-signup">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-light)',
                        cursor: 'pointer',
                        zIndex: 1001,
                        display: 'none', // Hidden on desktop via CSS in Navbar.css
                        padding: '0.5rem'
                    }}
                >
                    {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" /></svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: 'rgba(15, 23, 42, 0.98)',
                backdropFilter: 'blur(15px)',
                padding: '5rem 2rem 2rem',
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflowY: 'auto',
                zIndex: 999,
                display: mobileMenuOpen ? 'block' : 'none'
            }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '2rem', listStyle: 'none', padding: 0, marginBottom: '3rem', textAlign: 'center' }}>
                    {navLinks.map((item) => {
                        const anchorId = item.toLowerCase();
                        const isPageRoute = ['Events', 'Accommodation', 'Donations'].includes(item);

                        if (isPageRoute) {
                            return (
                                <li key={item} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
                                    <Link
                                        to={`/${anchorId}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ color: 'var(--text-light)', fontSize: '1.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}
                                    >
                                        {item}
                                    </Link>
                                </li>
                            );
                        }

                        return (
                            <li key={item} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
                                {isHome ? (
                                    <a
                                        href={`#${anchorId}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ color: 'var(--text-light)', fontSize: '1.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}
                                    >
                                        {item}
                                    </a>
                                ) : (
                                    <Link
                                        to={`/#${anchorId}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ color: 'var(--text-light)', fontSize: '1.5rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}
                                    >
                                        {item}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>Signed in as {user.name}</div>
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                color: 'var(--text-light)',
                                textAlign: 'center',
                                textDecoration: 'none',
                                fontSize: '1.1rem'
                            }}>
                                My Profile
                            </Link>
                            {(user.role === 'admin' || user.role === 'super-admin') && (
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{
                                    padding: '1rem',
                                    border: '1px solid var(--primary-color)',
                                    borderRadius: '12px',
                                    color: 'var(--primary-color)',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontSize: '1.1rem'
                                }}>
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} style={{
                                padding: '1rem',
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '1.1rem'
                            }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                                padding: '1rem',
                                border: '1px solid var(--primary-color)',
                                borderRadius: '12px',
                                color: 'var(--primary-color)',
                                textAlign: 'center',
                                fontWeight: '600',
                                textDecoration: 'none',
                                fontSize: '1.1rem'
                            }}>
                                Login
                            </Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{
                                padding: '1rem',
                                background: 'var(--primary-color)',
                                borderRadius: '12px',
                                color: '#fff',
                                textAlign: 'center',
                                fontWeight: '600',
                                textDecoration: 'none',
                                fontSize: '1.1rem'
                            }}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
