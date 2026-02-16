import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Events.css'; // We will create this next
import BookingForm from '../components/BookingForm'; // We will create this next

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/events');
                setEvents(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleBookClick = (event) => {
        if (!user) {
            alert('Please login to book tickets');
            return;
        }
        setSelectedEvent(event);
    };

    const handleCloseBooking = () => {
        setSelectedEvent(null);
    };

    if (loading) return <div className="loading">Loading Events...</div>;

    return (
        <div className="events-page page-container">
            <h1 className="page-title">Upcoming Spiritual Events</h1>
            <div className="events-grid">
                {events.map(event => (
                    <div key={event._id} className="event-card">
                        <div className="event-image-container">
                            <img
                                src={event.image || 'https://via.placeholder.com/300x200?text=Event'}
                                alt={event.title}
                                className="event-image"
                            />
                            <div className="event-date">
                                <span>{new Date(event.date).getDate()}</span>
                                <span>{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                        </div>
                        <div className="event-details">
                            <h2>{event.title}</h2>
                            <p className="event-location"><i className="fas fa-map-marker-alt"></i> {event.location}</p>
                            <p className="event-description">{event.description.substring(0, 100)}...</p>
                            <button className="book-btn" onClick={() => handleBookClick(event)}>
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseBooking}>&times;</button>
                        <BookingForm type="event" item={selectedEvent} onClose={handleCloseBooking} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
