import React from 'react';
import './EventCard.css';

const EventCard = ({ event, onClick }) => {
    return (
        <div className="event-card" onClick={() => onClick && onClick(event)}>
            {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.name} className="event-card-image" />
            ) : (
                <div className="event-card-placeholder">🎉</div>
            )}
            <div className="event-card-content">
                <div className="event-card-header">
                    <span className={`event-badge badge-${event.category?.toLowerCase() || 'daily'}`}>
                        {event.category}
                    </span>
                    <span className="event-date">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <h3 className="event-card-title">{event.name}</h3>
                <p className="event-card-time">⏰ {event.time || 'Time TBD'}</p>
                {event.location && <p className="event-card-location">📍 {event.location}</p>}
                <p className="event-card-desc">
                    {event.description?.length > 80 ? `${event.description.substring(0, 80)}...` : event.description}
                </p>
            </div>
        </div>
    );
};

export default EventCard;
