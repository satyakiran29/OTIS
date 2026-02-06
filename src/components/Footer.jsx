import React from 'react';

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
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
                    © {new Date().getFullYear()} Team 10. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
