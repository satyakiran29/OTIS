import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
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
                background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>🛕</span>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--text-light)',
                        letterSpacing: '1px'
                    }}>
                        Temple<span style={{ color: 'var(--primary-color)' }}>Info</span>
                    </h1>
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <ul style={{ display: 'flex', gap: '2rem' }}>
                    {['Home', 'About', 'Team', 'Project', 'Events', 'Temples', 'Darshan', 'Accommodation', 'Donations'].map((item) => (
                        <li key={item}>
                            {isHome ? (
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    style={{
                                        color: 'var(--text-light)',
                                        fontWeight: '500',
                                        position: 'relative',
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-light)'}
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
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-light)'}
                                >
                                    {item}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {user ? (
                        <>
                            <Link to="/profile" style={{ color: 'var(--text-light)', alignSelf: 'center', textDecoration: 'none', fontWeight: '600' }}>
                                Hello, {user.name}
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/dashboard" style={{
                                    padding: '0.5rem 1.5rem',
                                    border: '1px solid var(--primary-color)',
                                    borderRadius: '50px',
                                    color: 'var(--primary-color)',
                                    fontWeight: '500',
                                    fontSize: '0.9rem'
                                }}>
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} style={{
                                padding: '0.5rem 1.5rem',
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#fff',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                padding: '0.5rem 1.5rem',
                                border: '1px solid var(--primary-color)',
                                borderRadius: '50px',
                                color: 'var(--primary-color)',
                                fontWeight: '500',
                                fontSize: '0.9rem'
                            }}>
                                Login
                            </Link>
                            <Link to="/signup" style={{
                                padding: '0.5rem 1.5rem',
                                background: 'var(--primary-color)',
                                borderRadius: '50px',
                                color: '#fff',
                                fontWeight: '500',
                                fontSize: '0.9rem'
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
