import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../../components/BookingForm';
import SkeletonLoader from '../../components/SkeletonLoader';
import './Accommodation.css';
import axios from '../../utils/axiosConfig';

const Accommodation = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const res = await axios.get('/accommodations');
                setAccommodations(res.data);
            } catch (err) {
                console.error('Error fetching accommodations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccommodations();
    }, []);

    const handleBookClick = (room) => {
        if (!user) {
            alert('Please login to book accommodation');
            return;
        }
        setSelectedRoom(room);
    };

    return (
        <div className="accommodations-page-wrapper page-container animate-fade-in">
            <div className="accommodations-header-wrapper">
                <h1>Divine Stays</h1>
                <p>Experience peace and spiritual tranquility with our comfortable and affordable accommodations for pilgrims.</p>
            </div>

            {loading ? (
                <div className="rooms-grid">
                    {[1, 2, 3, 4].map(n => (
                        <SkeletonLoader key={n} type="card" />
                    ))}
                </div>
            ) : accommodations.length === 0 ? (
                <div className="no-accommodations-message">
                    <p>No accommodations available at the moment.</p>
                </div>
            ) : (
                <div className="rooms-grid">
                    {accommodations.map(room => (
                        <div key={room._id} className="room-card">
                            <div className="room-image-container">
                                <div className="room-image" style={{ backgroundImage: `url(${room.image || 'https://via.placeholder.com/600x400?text=Sacred+Room'})` }}></div>
                                <div className="room-image-overlay"></div>
                                <div className="room-capacity-badge">
                                    <i className="fas fa-user-friends"></i> Max {room.capacity}
                                </div>
                            </div>
                            
                            <div className="room-content">
                                <div className="room-header-row">
                                    <h3>{room.name}</h3>
                                    <p className="room-temple">
                                        <i className="fas fa-map-marker-alt"></i> {room.temple?.name || 'Unknown Temple'}
                                    </p>
                                </div>
                                
                                <span className="room-type">{room.type}</span>
                                
                                <div className="room-amenities">
                                    {room.amenities.map((am, index) => (
                                        <span key={index} className="amenity-badge">
                                            {/* Minimal icon matching based on string matching could go here, but a bullet/check works too */}
                                            <i className="fas fa-check-circle" style={{fontSize: '0.7rem', opacity: 0.8}}></i> {am}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="room-footer">
                                    <div className="room-price-container">
                                        <span className="room-price">₹{room.price}</span>
                                        <span className="room-price-label">Per Night</span>
                                    </div>
                                    <button onClick={() => handleBookClick(room)} className="book-btn">
                                        Book Stay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedRoom && (
                <div className="modal-overlay">
                    <div className="modal-content booking-modal-content">
                        <button className="close-btn" onClick={() => setSelectedRoom(null)}>&times;</button>
                        <BookingForm
                            type="Accommodation"
                            item={selectedRoom}
                            onClose={() => setSelectedRoom(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accommodation;
