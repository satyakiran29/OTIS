import React from 'react';

const GuideCard = () => {
    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto 4rem',
            padding: '2rem',
            textAlign: 'center'
        }} className="glass-card">
            <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF9933 0%, #FFD700 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                boxShadow: 'var(--shadow-glow)'
            }}>
                GN
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Mrs. G. Nirosha</h3>
            <p style={{ color: 'var(--primary-color)', fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>Assistant Professor</p>
            <p style={{ color: 'var(--text-muted)' }}>GMR Computer Science Engineering</p>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    "Guiding the next generation of developers to build meaningful solutions."
                </p>
            </div>
        </div>
    );
};

export default GuideCard;
