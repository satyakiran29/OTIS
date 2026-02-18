import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './BookingForm.css'; // We will create this

const BookingForm = ({ type, item, onClose, onSuccess }) => {
    const { user, token } = useAuth(); // Assuming token is available in context
    const [members, setMembers] = useState(1);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Adjust according to how token is stored
                }
            };

            const body = {
                type,
                item: item._id,
                date: bookingDate,
                members: parseInt(members)
            };

            await axios.post('/bookings', body, config);
            setStatus('success');
            if (onSuccess) onSuccess();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Booking failed');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="booking-success">
                <i className="fas fa-check-circle"></i>
                <h3>Booking Confirmed!</h3>
                <p>We look forward to seeing you.</p>
            </div>
        );
    }

    return (
        <div className="booking-form-container">
            <h2>Book {type === 'event' ? 'Event Ticket' : 'Seva'}</h2>
            <p className="item-name">{item.title || item.name}</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label>Number of Tickets</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={members}
                        onChange={(e) => setMembers(e.target.value)}
                        required
                    />
                </div>

                <div className="booking-summary">
                    <p>Total: TBD (Free/Donation)</p>
                    {/* Add price calculation if Seva has price */}
                    {item.price && <p>Price: ₹{item.price * members}</p>}
                </div>

                <button type="submit" className="confirm-btn" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
