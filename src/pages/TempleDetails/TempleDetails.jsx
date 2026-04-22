import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import BookingForm from '../../components/BookingForm';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customGeoapifyIcon = new L.Icon({
    iconUrl: 'https://api.geoapify.com/v2/icon?type=material&color=%23ff9800&size=48&icon=om&iconType=awesome&apiKey=ee84d8f7fac5474cb796b03ed929d94f',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48]
});

const TempleDetails = () => {
    const { id } = useParams();
    const [temple, setTemple] = useState(null);
    const [sevas, setSevas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeva, setSelectedSeva] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            const templeRes = await axios.get(`/temples/${id}`);
            setTemple(templeRes.data);

            const sevasRes = await axios.get(`/sevas/temple/${id}`);
            setSevas(sevasRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleBookClick = (seva) => {
        if (!user) {
            alert('Please login to book special darshan');
            return;
        }
        setSelectedSeva(seva);
    };

    const handleCloseBooking = () => {
        setSelectedSeva(null);
    };

    if (loading) {
        return (
            <div className="temple-details-page">
                <SkeletonLoader type="hero" />
            </div>
        );
    }

    if (!temple) {
        return (
            <div className="error-container">
                <h2>Temple not found</h2>
                <Link to="/temples" className="back-link">Back to Temples</Link>
            </div>
        );
    }

    return (
        <div className="temple-details-page animate-fade-in">
            {/* Hero Section */}
            <div className="temple-hero" style={{ backgroundImage: `url(${temple.images[0] || 'https://via.placeholder.com/1200x600'})` }}>
                <div className="hero-overlay">
                    <div className="hero-content-wrapper">
                        <h1>{temple.name}</h1>
                        <p><i className="fas fa-map-marker-alt"></i> {temple.location}</p>
                    </div>
                </div>
            </div>

            <div className="content-container">
                <section className="info-section animate-fade-in animate-delay-100">
                    <h2>About the Temple</h2>
                    <p>{temple.description}</p>

                    <h3>History</h3>
                    <p>{temple.history}</p>
                </section>

                {temple.coordinates && temple.coordinates.lat && temple.coordinates.lon && (
                    <section className="map-section animate-fade-in animate-delay-200">
                        <h2>Location Map</h2>
                        <div className="map-container-wrapper" style={{ height: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                            <MapContainer
                                center={[temple.coordinates.lat, temple.coordinates.lon]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.geoapify.com/">Geoapify</a> contributors'
                                    url={`https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`}
                                />
                                <Marker position={[temple.coordinates.lat, temple.coordinates.lon]} icon={customGeoapifyIcon}>
                                    <Popup>
                                        <div style={{ textAlign: 'center', minWidth: '180px' }}>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${temple.coordinates.lat},${temple.coordinates.lon}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', display: 'block', marginBottom: '8px' }}
                                                title="Open in Google Maps"
                                            >
                                                <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary-color)', fontSize: '1.1rem', textDecoration: 'underline' }}>
                                                    {temple.name} <i className="fas fa-external-link-alt" style={{ fontSize: '0.8rem', marginLeft: '4px' }}></i>
                                                </h3>
                                                <p style={{ margin: '0', fontSize: '0.85rem', color: '#555' }}>
                                                    <i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-color)', marginRight: '4px' }}></i>
                                                    {temple.location}
                                                </p>
                                            </a>
                                            {sevas && sevas.length > 0 && (
                                                <div style={{ background: '#f0fdf4', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#166534' }}>
                                                        {sevas.length} Special Darshan Available
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </section>
                )}

                <section className="sevas-section animate-fade-in animate-delay-300">
                    <h2>Available Special Darshan</h2>
                    {sevas.length === 0 ? (
                        <p>No special darshan information available yet.</p>
                    ) : (
                        <div className="sevas-grid">
                            {sevas.map(seva => (
                                <div key={seva._id} className="seva-card">
                                    <h3>{seva.name}</h3>
                                    <p>{seva.description}</p>
                                    <div className="seva-footer">
                                        <span className="seva-price">₹{seva.price}</span>
                                        <span className="seva-duration"><i className="far fa-clock"></i> {seva.duration}</span>
                                    </div>
                                    {seva.ticketLimit > 0 && (
                                        <p style={{
                                            marginBottom: '1rem',
                                            color: (seva.availableTickets === 0 ? 'var(--accent-color)' : '#10b981'),
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                                            {seva.availableTickets === 0 ? 'Sold Out' : `${seva.availableTickets} tickets left`}
                                        </p>
                                    )}
                                    <button
                                        className="book-btn"
                                        onClick={() => handleBookClick(seva)}
                                        disabled={seva.ticketLimit > 0 && seva.availableTickets === 0}
                                        style={{ opacity: (seva.ticketLimit > 0 && seva.availableTickets === 0) ? 0.6 : 1 }}
                                    >
                                        {seva.ticketLimit > 0 && seva.availableTickets === 0 ? 'Sold Out' : 'Book Special Darshan'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {temple.images.length > 1 && (
                    <section className="gallery-section animate-fade-in animate-delay-300">
                        <h2>Gallery</h2>
                        <div className="gallery-grid">
                            {temple.images.slice(1).map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt={`${temple.name} ${index + 2}`} 
                                    onClick={() => setLightboxIndex(index + 1)}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {selectedSeva && (
                <div className="modal-overlay">
                    <div className="modal-content booking-modal-content">
                        <button className="close-btn" onClick={handleCloseBooking}>&times;</button>
                        <BookingForm type="seva" item={selectedSeva} onClose={handleCloseBooking} onSuccess={fetchData} />
                    </div>
                </div>
            )}

            {lightboxIndex !== null && createPortal(
                <div className="lightbox-overlay animate-fade-in" onClick={() => setLightboxIndex(null)}>
                    <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>&times;</button>
                    
                    {temple.images.length > 2 && (
                        <button 
                            className="lightbox-nav lightbox-prev" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setLightboxIndex((prev) => prev > 1 ? prev - 1 : temple.images.length - 1); 
                            }}
                        >
                            &#10094;
                        </button>
                    )}

                    <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
                        <img src={temple.images[lightboxIndex]} alt="Temple Gallery" className="lightbox-img" />
                    </div>

                    {temple.images.length > 2 && (
                        <button 
                            className="lightbox-nav lightbox-next" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setLightboxIndex((prev) => prev < temple.images.length - 1 ? prev + 1 : 1); 
                            }}
                        >
                            &#10095;
                        </button>
                    )}
                </div>,
                document.body
            )}

            <style>{`
                .temple-details-page {
                    min-height: 100vh;
                    background-color: var(--bg-dark);
                    padding-bottom: 4rem;
                }
                .temple-hero {
                    height: 60vh;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    display: flex;
                    align-items: flex-end;
                }
                .hero-overlay {
                    background: linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.6) 50%, transparent 100%);
                    width: 100%;
                    padding: 4rem 2rem 6rem 2rem;
                    color: white;
                }
                .hero-content-wrapper {
                    max-width: 1000px;
                    margin: 0 auto;
                    width: 100%;
                    transform: translateY(1.5rem);
                }
                .hero-overlay h1 {
                    font-size: 3.5rem;
                    margin-bottom: 0.5rem;
                    font-family: var(--font-serif);
                    color: var(--primary-color);
                    text-shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
                }
                .hero-overlay p {
                    font-size: 1.1rem;
                    color: var(--text-light);
                    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
                }
                .content-container {
                    max-width: 1000px;
                    margin: -50px auto 0;
                    padding: 0 2rem;
                    position: relative;
                    z-index: 10;
                }
                .info-section, .sevas-section, .gallery-section, .map-section {
                    background: var(--bg-card);
                    padding: 2.5rem;
                    border-radius: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: var(--shadow-lg);
                    margin-bottom: 2rem;
                }
                .info-section h2, .sevas-section h2, .gallery-section h2, .map-section h2 {
                    color: var(--primary-color);
                    font-family: var(--font-serif);
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 0.5rem;
                }
                .info-section p {
                    line-height: 1.8;
                    color: var(--text-light);
                    margin-bottom: 1.5rem;
                }
                .sevas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                .seva-card {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 1.5rem;
                    background: rgba(30, 41, 59, 0.5); /* subtle transparency of bg-card */
                    transition: transform 0.2s;
                }
                .seva-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-glow);
                    border-color: var(--primary-color);
                }
                .seva-card h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--gold, #ffd700);
                }
                .seva-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 1rem 0;
                    font-weight: 600;
                }
                .seva-price {
                    color: var(--primary-color);
                    font-size: 1.2rem;
                }
                .seva-duration {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .loading-container, .error-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: var(--bg-dark);
                    color: var(--text-light);
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .gallery-grid img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .gallery-grid img:hover {
                    transform: scale(1.05);
                }
                .book-btn {
                    width: 100%;
                    padding: 0.8rem;
                    background: var(--gradient-text, linear-gradient(to right, #ff9933, #ffd700));
                    color: #0f172a;
                    border: none;
                    border-radius: 50px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 153, 51, 0.3);
                }
                .book-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 153, 51, 0.5);
                }
                .book-btn:disabled {
                    cursor: not-allowed;
                    background: var(--bg-card);
                    color: var(--text-muted);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: none;
                }
                
                /* Lightbox Styles */
                .lightbox-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                    z-index: 99999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .lightbox-close {
                    position: absolute;
                    top: 20px; right: 30px;
                    color: white;
                    font-size: 3rem;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    z-index: 100000;
                }
                .lightbox-close:hover {
                    color: var(--primary-color);
                }
                .lightbox-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: none;
                    font-size: 2rem;
                    padding: 1rem;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px; height: 60px;
                    z-index: 100000;
                }
                .lightbox-nav:hover {
                    background: var(--primary-color);
                    color: #000;
                }
                .lightbox-prev { left: 40px; }
                .lightbox-next { right: 40px; }
                
                .lightbox-content-wrapper {
                    max-width: 90%;
                    max-height: 90vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .lightbox-img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                
                @media (max-width: 768px) {
                    .lightbox-nav {
                        width: 45px; height: 45px;
                        font-size: 1.2rem;
                    }
                    .lightbox-prev { left: 10px; }
                    .lightbox-next { right: 10px; }
                }
            `}</style>
        </div>
    );
};

export default TempleDetails;
