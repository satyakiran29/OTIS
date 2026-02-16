import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';

const Temples = () => {
    const [temples, setTemples] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const response = await fetch('/api/temples');
                const data = await response.json();
                setTemples(data);
            } catch (error) {
                console.error('Error fetching temples:', error);
            }
        };
        fetchTemples();
    }, []);

    const filteredTemples = temples.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
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
                        <div key={temple._id} className="glass-card" style={{
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
                                    src={Array.isArray(temple.images) && temple.images.length > 0 ? temple.images[0] : temple.image}
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
                                <Link to={`/temples/${temple._id}`} style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#64748b',
                                    padding: 0,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}>
                                    View
                                </Link>
                            </div>
                            <Link to={`/temples/${temple._id}`} style={{
                                width: '100%',
                                padding: '0.6rem',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'block',
                                textAlign: 'center',
                                textDecoration: 'none'
                            }}
                                onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                                onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                            >
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Temples;
