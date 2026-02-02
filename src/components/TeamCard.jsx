import React from 'react';

const TeamCard = ({ name, initials, role, delay }) => {
    return (
        <div
            className="glass-card animate-fade-in"
            style={{
                padding: '2rem',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                cursor: 'default',
                animationDelay: delay
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
            }}>
                {initials}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>{name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{role}</p>
        </div>
    );
};

export default TeamCard;
