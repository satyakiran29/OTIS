import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

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

    // Hide specific links if not on home page, or just link back to home sections
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

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = ['Home', 'About', 'Team', 'Project', 'Events', 'Temples', 'Darshan', 'Accommodation', 'Donations'];

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
                background: scrolled || mobileMenuOpen ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
                backdropFilter: scrolled || mobileMenuOpen ? 'blur(10px)' : 'none',
                boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1001 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <span style={{ fontSize: '1.5rem' }}>🛕</span>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--text-light)',
                            letterSpacing: '1px',
                            margin: 0
                        }}>
                            Temple<span style={{ color: 'var(--primary-color)' }}>Info</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
                        {navLinks.map((item) => (
                            <li key={item}>
                                {isHome ? (
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        style={{
                                            color: 'var(--text-light)',
                                            fontWeight: '500',
                                            position: 'relative',
                                            textDecoration: 'none',
                                            fontSize: '0.95rem'
                                        }}
                                        className="nav-link"
                                    >
                                        {item}
                                    </a>
                                ) : (
                                    <Link
                                        to={`/#${item.toLowerCase()}`}
                                        style={{
                                            color: 'var(--text-light)',
                                            fontWeight: '500',
                                            position: 'relative',
                                            textDecoration: 'none',
                                            fontSize: '0.95rem'
                                        }}
                                        className="nav-link"
                                    >
                                        {item}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <Link to="/profile" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                                    Hello, {user.name}
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/dashboard" style={{
                                        padding: '0.5rem 1.2rem',
                                        border: '1px solid var(--primary-color)',
                                        borderRadius: '50px',
                                        color: 'var(--primary-color)',
                                        fontWeight: '500',
                                        fontSize: '0.85rem',
                                        textDecoration: 'none'
                                    }}>
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} style={{
                                    padding: '0.5rem 1.2rem',
                                    background: 'var(--primary-color)',
                                    border: 'none',
                                    borderRadius: '50px',
                                    color: '#fff',
                                    fontWeight: '500',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{
                                    padding: '0.5rem 1.2rem',
                                    border: '1px solid var(--primary-color)',
                                    borderRadius: '50px',
                                    color: 'var(--primary-color)',
                                    fontWeight: '500',
                                    fontSize: '0.85rem',
                                    textDecoration: 'none'
                                }}>
                                    Login
                                </Link>
                                <Link to="/signup" style={{
                                    padding: '0.5rem 1.2rem',
                                    background: 'var(--primary-color)',
                                    borderRadius: '50px',
                                    color: '#fff',
                                    fontWeight: '500',
                                    fontSize: '0.85rem',
                                    textDecoration: 'none'
                                }}>
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
                        display: 'none', // Hidden by default, shown via CSS
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
                background: '#0f172a',
                padding: '5rem 2rem 2rem',
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                overflowY: 'auto'
            }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                    {navLinks.map((item) => (
                        <li key={item} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                            {isHome ? (
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}
                                >
                                    {item}
                                </a>
                            ) : (
                                <Link
                                    to={`/#${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ color: 'var(--text-light)', fontSize: '1.2rem', fontWeight: '500', textDecoration: 'none', display: 'block' }}
                                >
                                    {item}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {user ? (
                        <>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Signed in as {user.name}</div>
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{
                                padding: '0.8rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                color: 'var(--text-light)',
                                textAlign: 'center',
                                textDecoration: 'none'
                            }}>
                                My Profile
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{
                                    padding: '0.8rem',
                                    border: '1px solid var(--primary-color)',
                                    borderRadius: '8px',
                                    color: 'var(--primary-color)',
                                    textAlign: 'center',
                                    textDecoration: 'none'
                                }}>
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} style={{
                                padding: '0.8rem',
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                                padding: '0.8rem',
                                border: '1px solid var(--primary-color)',
                                borderRadius: '8px',
                                color: 'var(--primary-color)',
                                textAlign: 'center',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}>
                                Login
                            </Link>
                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{
                                padding: '0.8rem',
                                background: 'var(--primary-color)',
                                borderRadius: '8px',
                                color: '#fff',
                                textAlign: 'center',
                                fontWeight: '600',
                                textDecoration: 'none'
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
