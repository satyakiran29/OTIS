import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            padding: '3rem 2rem',
            background: '#0f172a',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: 'auto',
            textAlign: 'center'
        }}>
            <div className="section-padding" style={{ padding: '0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Temple Management Info System Project
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <Link to="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>Terms of Service</Link>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                    <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>Privacy Policy</Link>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
                    © {new Date().getFullYear()} Team 10. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
