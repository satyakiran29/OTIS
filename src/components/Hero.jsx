import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section
            id="home"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                position: 'relative',
                background: 'radial-gradient(circle at top, #2e1065 0%, #0f172a 60%)',
                overflow: 'hidden'
            }}
        >
            {/* Decorative Circles */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '300px',
                height: '300px',
                background: 'var(--primary-color)',
                filter: 'blur(150px)',
                opacity: 0.2,
                borderRadius: '50%',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '20%',
                width: '400px',
                height: '400px',
                background: 'var(--accent-color)',
                filter: 'blur(150px)',
                opacity: 0.1,
                borderRadius: '50%',
                zIndex: 0
            }}></div>

            <div style={{ zIndex: 1, maxWidth: '800px' }} className="animate-fade-in">
                <span style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    background: 'rgba(255, 153, 51, 0.1)',
                    border: '1px solid rgba(255, 153, 51, 0.3)',
                    color: 'var(--primary-color)',
                    fontSize: '0.9rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '1.5rem'
                }}>
                    Sacred Heritage • Digital Future
                </span>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                    fontFamily: 'var(--font-serif)',
                    background: 'linear-gradient(to right, #fff, #cbd5e1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Temple Management <br />
                    <span className="text-gradient">Information System</span>
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-muted)',
                    marginBottom: '2.5rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Bridging tradition and technology. A comprehensive project developed to streamline temple administration and devotee services.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <a href="#team" style={{
                        padding: '0.8rem 2rem',
                        background: 'var(--primary-color)',
                        color: '#fff',
                        borderRadius: '50px',
                        fontWeight: '600',
                        boxShadow: 'var(--shadow-glow)',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        View Our Team
                    </a>
                    <Link to="/temples" style={{
                        padding: '0.8rem 2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-light)',
                        borderRadius: '50px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>
                        Get Started
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
