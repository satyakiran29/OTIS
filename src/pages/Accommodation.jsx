import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import './Accommodation.css';

const Accommodation = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const res = await axios.get('/api/accommodations');
                setAccommodations(res.data);
            } catch (err) {
                console.error('Error fetching accommodations:', err);
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
        <div className="accommodation-page page-container">
            <h1 className="page-title">Stay at Our Temples</h1>
            <p className="page-subtitle">Comfortable and affordable stay for pilgrims.</p>

            <div className="rooms-grid">
                {accommodations.map(room => (
                    <div key={room._id} className="room-card glass-card">
                        <div className="room-image" style={{ backgroundImage: `url(${room.image || 'https://via.placeholder.com/400x250?text=Room'})` }}></div>
                        <div className="room-content">
                            <h3>{room.name}</h3>
                            <p className="room-temple"><i className="fas fa-map-marker-alt"></i> {room.temple?.name}</p>
                            <p className="room-type">{room.type} • Capacity: {room.capacity} Persons</p>
                            <div className="room-amenities">
                                {room.amenities.map((am, index) => (
                                    <span key={index} className="amenity-badge">{am}</span>
                                ))}
                            </div>
                            <div className="room-footer">
                                <span className="room-price">₹{room.price} / day</span>
                                <button onClick={() => handleBookClick(room)} className="book-btn">Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRoom && (
                <BookingForm
                    type="Accommodation"
                    item={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}
        </div>
    );
};

export default Accommodation;
