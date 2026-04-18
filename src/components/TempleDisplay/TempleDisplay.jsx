import React from 'react';
import { Link } from 'react-router-dom';

const TempleDisplay = ({ temple, previewMode = false }) => {
    if (!temple) return null;

    const labelStyle = {
        fontWeight: '700',
        color: '#475569',
        fontSize: '1rem',
        marginRight: '0.5rem'
    };

    const valueStyle = {
        color: '#64748b',
        fontSize: '1rem'
    };

    // Ensure images is an array
    const images = Array.isArray(temple.images) ? temple.images : (temple.image ? [temple.image] : []);
    const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/800x600?text=No+Image';

    return (
        <div style={{
            background: '#fff',
            color: '#1e293b',
            width: '100%',
            fontFamily: 'var(--font-sans, "Inter", sans-serif)' // Ensure font consistency
        }}>
            <div className="container" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: previewMode ? '2rem' : '0 2rem', // Adjust padding for preview
            }}>
                {/* Back Link - Only show if not in preview mode */}
                {!previewMode && (
                    <div style={{ marginBottom: '2rem' }}>
                        <Link to="/temples" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#64748b',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            ← Back to list
                        </Link>
                    </div>
                )}

                {/* Top Section: Split Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(350px, 1fr) 1.5fr',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {/* Left Column: Details & Map */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Details Card */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '2rem',
                            border: '1px solid #e2e8f0',
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.5rem',
                                color: '#334155',
                                marginBottom: '1.5rem',
                                fontWeight: '700'
                            }}>
                                Details
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ fontSize: '1.1rem' }}>
                                    <span style={{ fontWeight: '700', color: '#334155' }}>Name:</span> <span style={{ color: '#475569' }}>{temple.name || 'Temple Name'}</span>
                                </div>
                                <div>
                                    <span style={labelStyle}>Location;</span> <span style={valueStyle}>{temple.location || 'Location'}</span>
                                </div>
                                <div>
                                    <span style={labelStyle}>History;</span>
                                    <span style={valueStyle}>
                                        {temple.history || 'Historical details currently unavailable.'}
                                    </span>
                                </div>
                                <div>
                                    <span style={labelStyle}>Description;</span>
                                    <span style={valueStyle}>
                                        {temple.description || 'Description'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div style={{
                            background: '#e0f2fe',
                            borderRadius: '12px',
                            height: '200px',
                            border: '1px solid #bae6fd',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <span style={{ color: '#0ea5e9', fontWeight: '500' }}>[Map View Placeholder]</span>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: '500px',
                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={mainImage}
                            alt={temple.name || 'Temple'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Error'; }}
                        />
                    </div>
                </div>

                {/* Bottom Section: Example Images */}
                <div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.5rem',
                        color: '#334155',
                        marginBottom: '1.5rem',
                        fontWeight: '700'
                    }}>
                        Example images
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.5rem'
                    }}>
                        {[1, 2, 3].map((item) => (
                            <div key={item} style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                aspectRatio: '16/9',
                                background: '#cbd5e1'
                            }}>
                                <img
                                    src={`https://source.unsplash.com/random/400x300?temple,monk,sig=${temple._id || 'preview'}${item}`}
                                    alt="Gallery"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TempleDisplay;
