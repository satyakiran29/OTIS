import React from 'react';

const SectionTitle = ({ title, subtitle }) => {
    return (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{
                color: 'var(--primary-color)',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
            }}>
                {subtitle}
            </p>
            <h2 style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-light)',
            }}>
                {title}
            </h2>
            <div style={{
                width: '60px',
                height: '3px',
                background: 'var(--primary-color)',
                margin: '1rem auto 0',
                borderRadius: '2px'
            }}></div>
        </div>
    );
};

export default SectionTitle;
