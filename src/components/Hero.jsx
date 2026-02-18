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
                backgroundImage: 'url("https://media.istockphoto.com/id/941308078/photo/worship-of-indian-god-godess-idol-arati-with-pancha-pradip.jpg?s=612x612&w=0&k=20&c=e2BTs5qN6fP4gCZjKyjkBqrtoxeoBirlesWYjoDy4ZE=")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Dark Overlay for readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.6)',
                zIndex: 0
            }}></div>
            {/* Decorative Circles */}


            <div style={{ zIndex: 2, maxWidth: '800px', position: 'relative' }} className="animate-fade-in">


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
                        View Temples
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
