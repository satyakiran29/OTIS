import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from '../utils/axiosConfig';
import EventCard from '../components/EventCard';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [countdownEvent, setCountdownEvent] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (!countdownEvent) return;

        const interval = setInterval(() => {
            const eventDate = new Date(`${countdownEvent.date.split('T')[0]}T${countdownEvent.time || '00:00'}`);
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('Event has started or passed');
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdownEvent]);

    const fetchEvents = async () => {
        try {
            // Note: Uses dummy data as a fallback to demonstrate UI if the backend route is missing.
            const dummyEvents = [
                {
                    _id: '1',
                    name: 'Morning Suprabhatam',
                    description: 'Sacred chanting to awaken the deities. A peaceful start to the day.',
                    category: 'Daily',
                    date: new Date().toISOString(),
                    time: '05:00 AM',
                    location: 'Main Sanctum',
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/The_Konark_Sun_Temple.jpg'
                },
                {
                    _id: '2',
                    name: 'Friday Abhishekam',
                    description: 'Special holy bath and adornment performed for the main deity every Friday.',
                    category: 'Weekly',
                    date: new Date(Date.now() + 86400000 * 3).toISOString(),
                    time: '08:00 AM',
                    location: 'Inner Temple Hall',
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Meenakshi_Amman_Temple_Madurai.jpg'
                },
                {
                    _id: '3',
                    name: 'Maha Brahmotsavam',
                    description: 'The grand annual festival featuring chariot processions and vibrant cultural programs over nine spectacular days.',
                    category: 'Annual',
                    date: new Date(Date.now() + 86400000 * 15).toISOString(),
                    time: '06:00 AM onwards',
                    location: 'Temple Grounds & Streets',
                    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Brihadeeswarar_Temple_at_Thanjavur.jpg'
                }
            ];

            const response = await axios.get('/events').catch(() => ({ data: dummyEvents }));
            const fetchedEvents = response.data && response.data.length > 0 ? response.data : dummyEvents;
            setEvents(fetchedEvents);

            // Find the closest upcoming event for the countdown
            const upcoming = fetchedEvents
                .filter(e => new Date(e.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
            
            if (upcoming) setCountdownEvent(upcoming);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Daily', 'Weekly', 'Monthly', 'Annual'];
    const filteredEvents = filterCategory === 'All' 
        ? events 
        : events.filter(e => e.category === filterCategory);

    return (
        <div className="events-page-wrapper page-container animate-fade-in">
            <div className="events-header-wrapper">
                <h1>Temple Events & Festivals</h1>
                <p>Join us in celebrating our rich traditions and spiritual gatherings.</p>
            </div>

            {countdownEvent && (
                <div className="countdown-section">
                    <h2>Next Major Event: {countdownEvent.name}</h2>
                    <div className="timer-display">{timeLeft}</div>
                </div>
            )}

            <div className="events-controls">
                <div className="category-filters">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                            onClick={() => setFilterCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading events...</div>
            ) : filteredEvents.length > 0 ? (
                <div className="events-grid">
                    {filteredEvents.map(event => (
                        <EventCard key={event._id || event.id} event={event} onClick={setSelectedEvent} />
                    ))}
                </div>
            ) : (
                <div className="no-events-message">
                    <h3>No events found for this category.</h3>
                </div>
            )}

            {selectedEvent && createPortal(
                <div className="event-modal-overlay animate-fade-in" onClick={() => setSelectedEvent(null)}>
                    <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedEvent(null)}>&times;</button>
                        {selectedEvent.imageUrl && (
                            <img src={selectedEvent.imageUrl} alt={selectedEvent.name} className="modal-image" />
                        )}
                        <div className="modal-details">
                            <span className={`event-badge badge-${selectedEvent.category?.toLowerCase() || 'daily'}`}>
                                {selectedEvent.category}
                            </span>
                            <h2>{selectedEvent.name}</h2>
                            <div className="modal-meta">
                                <p><span>📅 Date:</span> {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                <p><span>⏰ Time:</span> {selectedEvent.time || 'TBD'}</p>
                                {selectedEvent.location && <p><span>📍 Location:</span> {selectedEvent.location}</p>}
                            </div>
                            <div className="modal-desc">
                                <h3>About this Event</h3>
                                <p>{selectedEvent.description}</p>
                            </div>
                        </div>
                    </div>
                </div>, 
                document.body
            )}
        </div>
    );
};

export default Events;
