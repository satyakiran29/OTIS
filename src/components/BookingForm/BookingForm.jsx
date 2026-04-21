import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import StripePaymentModal from '../StripePaymentModal';
import './BookingForm.css';

const BookingForm = ({ type, item, onClose, onSuccess }) => {
    const { user, token } = useAuth(); // Assuming token is available in context
    const [members, setMembers] = useState(1);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const totalPrice = item.price ? item.price * members : 0;

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

            if (totalPrice > 0) {
                const paymentRes = await axios.post('/payments/create-payment-intent', {
                    amount: totalPrice,
                    description: `${type.toUpperCase()} Booking: ${item.title || item.name}`,
                    metadata: {
                        bookingType: type,
                        itemId: item._id.toString(),
                        itemName: item.title || item.name,
                        members: members,
                        date: bookingDate
                    }
                }, config);
                setClientSecret(paymentRes.data.clientSecret);

                setShowPaymentModal(true);
                setStatus('idle');
            } else {
                await axios.post('/bookings', body, config);
                setStatus('success');
                if (onSuccess) onSuccess();
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (err) {
            console.error("Booking Form Error Object:", err);
            console.error("Booking Form Response Data:", err.response?.data);
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Booking failed');
            setStatus('error');
        }
    };

    const handlePaymentSuccess = async (successfulPaymentIntentId) => {
        setShowPaymentModal(false);
        setStatus('submitting');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            };

            const body = {
                type,
                item: item._id,
                date: bookingDate,
                members: parseInt(members),
                paymentIntentId: successfulPaymentIntentId
            };

            await axios.post('/bookings', body, config);
            setStatus('success');
            if (onSuccess) onSuccess();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Payment succeeded but booking failed to save.');
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
            {showPaymentModal && (
                <StripePaymentModal
                    clientSecret={clientSecret}
                    amount={totalPrice}
                    userEmail={user?.email}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setShowPaymentModal(false)}
                    returnUrl={window.location.href}
                />
            )}
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
                    <p>Total Amount:</p>
                    <p className="total-price" style={{ fontWeight: 'bold', color: '#d35400', fontSize: '1.2rem' }}>
                        {totalPrice > 0 ? `₹${totalPrice}` : 'Free / Donation'}
                    </p>
                </div>

                <button type="submit" className="confirm-btn" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
