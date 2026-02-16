import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../context/AuthContext';

const TempleDetails = () => {
    const { id } = useParams();
    const [temple, setTemple] = useState(null);
    const [sevas, setSevas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeva, setSelectedSeva] = useState(null);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            const templeRes = await axios.get(`/api/temples/${id}`);
            setTemple(templeRes.data);

            const sevasRes = await axios.get(`/api/sevas/temple/${id}`);
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
            alert('Please login to book sevas');
            return;
        }
        setSelectedSeva(seva);
    };

    const handleCloseBooking = () => {
        setSelectedSeva(null);
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
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
        <div className="temple-details-page">
            {/* Hero Section */}
            <div className="temple-hero" style={{ backgroundImage: `url(${temple.images[0] || 'https://via.placeholder.com/1200x600'})` }}>
                <div className="hero-overlay">
                    <h1>{temple.name}</h1>
                    <p><i className="fas fa-map-marker-alt"></i> {temple.location}</p>
                </div>
            </div>

            <div className="content-container">
                <section className="info-section">
                    <h2>About the Temple</h2>
                    <p>{temple.description}</p>

                    <h3>History</h3>
                    <p>{temple.history}</p>
                </section>

                <section className="sevas-section">
                    <h2>Available Sevas</h2>
                    {sevas.length === 0 ? (
                        <p>No sevas information available yet.</p>
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
                                            color: (seva.availableTickets === 0 ? '#e74c3c' : '#27ae60'),
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
                                        {seva.ticketLimit > 0 && seva.availableTickets === 0 ? 'Sold Out' : 'Book Seva'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Additional Gallery Section if needed */}
                {temple.images.length > 1 && (
                    <section className="gallery-section">
                        <h2>Gallery</h2>
                        <div className="gallery-grid">
                            {temple.images.slice(1).map((img, index) => (
                                <img key={index} src={img} alt={`${temple.name} ${index + 2}`} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {selectedSeva && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseBooking}>&times;</button>
                        <BookingForm type="seva" item={selectedSeva} onClose={handleCloseBooking} onSuccess={fetchData} />
                    </div>
                </div>
            )}

            <style>{`
                .temple-details-page {
                    min-height: 100vh;
                    background-color: #f8f9fa;
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
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    width: 100%;
                    padding: 3rem 2rem;
                    color: white;
                }
                .hero-overlay h1 {
                    font-size: 3rem;
                    margin-bottom: 0.5rem;
                    font-family: 'Playfair Display', serif;
                }
                .content-container {
                    max-width: 1000px;
                    margin: -50px auto 0;
                    padding: 0 2rem;
                    position: relative;
                    z-index: 10;
                }
                .info-section, .sevas-section, .gallery-section {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    margin-bottom: 2rem;
                }
                .info-section h2, .sevas-section h2, .gallery-section h2 {
                    color: #d35400;
                    font-family: 'Playfair Display', serif;
                    margin-bottom: 1.5rem;
                    border-bottom: 2px solid #fdf2e9;
                    padding-bottom: 0.5rem;
                }
                .info-section p {
                    line-height: 1.8;
                    color: #4a5568;
                    margin-bottom: 1.5rem;
                }
                .sevas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                .seva-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 1.5rem;
                    transition: transform 0.2s;
                }
                .seva-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border-color: #d35400;
                }
                .seva-card h3 {
                    margin: 0 0 0.5rem 0;
                    color: #2d3748;
                }
                .seva-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 1rem 0;
                    font-weight: 600;
                }
                .seva-price {
                    color: #d35400;
                    font-size: 1.2rem;
                }
                .seva-duration {
                    color: #718096;
                    font-size: 0.9rem;
                }
                .loading-container, .error-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: #1a202c;
                    color: white;
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
                    transition: transform 0.2s;
                }
                .gallery-grid img:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default TempleDetails;
