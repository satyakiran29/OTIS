import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';

const Temples = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const temples = [
        {
            id: 1,
            name: 'Angkor Wat',
            location: 'Cambodia',
            image: 'https://images.unsplash.com/photo-1563806286-4447434c4424?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: 2,
            name: 'Borobudur',
            location: 'Indonesia',
            image: 'https://images.unsplash.com/photo-1596401057633-565652f50bf8?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: 3,
            name: 'Wat Arun',
            location: 'Thailand',
            image: 'https://images.unsplash.com/photo-1590422915835-2ab63ccdf07f?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: 4,
            name: 'Kinkaku-ji',
            location: 'Japan',
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: 5,
            name: 'Shwedagon Pagoda',
            location: 'Myanmar',
            image: 'https://images.unsplash.com/photo-1579895393392-50d4eb952c21?w=500&auto=format&fit=crop&q=60',
        },
        {
            id: 6,
            name: 'Prambanan',
            location: 'Indonesia',
            image: 'https://images.unsplash.com/photo-1590497576571-001099196b02?w=500&auto=format&fit=crop&q=60',
        },
    ];

    const filteredTemples = temples.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '4rem',
            background: 'var(--bg-dark)'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                <SectionTitle title="Explore Temples" subtitle="Sacred Destinations" />

                {/* Search Bar */}
                <div style={{
                    marginBottom: '3rem',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div className="glass-card" style={{
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '600px',
                        background: '#fff'
                    }}>
                        <input
                            type="text"
                            placeholder="Search / Search template"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                padding: '0.8rem 1rem',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#333',
                                background: 'transparent'
                            }}
                        />
                        <button style={{
                            padding: '0.8rem 1.2rem',
                            border: 'none',
                            background: '#e2e8f0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#64748b'
                        }}>
                            🔍
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem'
                }}>
                    {filteredTemples.map(temple => (
                        <div key={temple.id} className="glass-card" style={{
                            overflow: 'hidden',
                            padding: '1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            background: '#fff',
                            color: '#333'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '200px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                marginBottom: '1rem'
                            }}>
                                <img
                                    src={temple.image}
                                    alt={temple.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            </div>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '700',
                                marginBottom: '0.25rem',
                                color: '#1e293b'
                            }}>
                                {temple.name}
                            </h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <button style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#64748b',
                                    padding: 0,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}>
                                    View
                                </button>
                            </div>
                            <button style={{
                                width: '100%',
                                padding: '0.6rem',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Temples;
