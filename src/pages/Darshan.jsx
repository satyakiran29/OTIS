import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import './Events.css'; // Reusing Events CSS as it's similar grid

const Darshan = () => {
    const [darshans, setDarshans] = useState([]);
    const [selectedDarshan, setSelectedDarshan] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDarshans = async () => {
            try {
                // Fetching all Sevas for now, ideally filter by category if added
                // Or just assume all Sevas displayed here are accessible for booking
                const res = await axios.get('/api/sevas');
                setDarshans(res.data);
            } catch (err) {
                console.error('Error fetching darshan options:', err);
            }
        };
        fetchDarshans();
    }, []);

    const handleBookClick = (darshan) => {
        if (!user) {
            alert('Please login to book darshan');
            return;
        }
        setSelectedDarshan(darshan);
    };

    return (
        <div className="events-page page-container"> {/* Reusing events-page class for styling */}
            <div className="events-header">
                <h1 className="page-title">Darshan Booking</h1>
                <p className="page-subtitle">Book your slot for a divine experience.</p>
            </div>

            <div className="events-grid">
                {darshans.map(darshan => (
                    <div key={darshan._id} className="event-card glass-card">
                        <div className="event-content">
                            <h3>{darshan.name}</h3>
                            <p className="event-temple"><i className="fas fa-gopuram"></i> {darshan.temple?.name}</p>
                            <p className="event-description">{darshan.description}</p>
                            <div className="event-details">
                                <span><i className="fas fa-clock"></i> {darshan.duration}</span>
                                <span className="event-price">₹{darshan.price}</span>
                            </div>
                            {darshan.ticketLimit > 0 && (
                                <p style={{
                                    marginBottom: '1rem',
                                    color: (darshan.availableTickets === 0 ? '#e74c3c' : '#27ae60'),
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {darshan.availableTickets === 0 ? 'Sold Out' : `${darshan.availableTickets} tickets left`}
                                </p>
                            )}
                            <button
                                onClick={() => handleBookClick(darshan)}
                                className="book-btn"
                                disabled={darshan.ticketLimit > 0 && darshan.availableTickets === 0}
                                style={{ opacity: (darshan.ticketLimit > 0 && darshan.availableTickets === 0) ? 0.6 : 1 }}
                            >
                                {darshan.ticketLimit > 0 && darshan.availableTickets === 0 ? 'Sold Out' : 'Book Darshan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedDarshan && (
                <BookingForm
                    type="Seva"
                    item={selectedDarshan}
                    onClose={() => setSelectedDarshan(null)}
                />
            )}
        </div>
    );
};

export default Darshan;
