import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Bill from '../components/Bill';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${user.token}` }
            };

            const bookingsRes = await axios.get('/api/bookings/mybookings', config);
            setBookings(bookingsRes.data);

            const donationsRes = await axios.get('/api/donations/my', config);
            setDonations(donationsRes.data);
        } catch (err) {
            console.error('Error fetching profile data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${user.token}` }
            };
            await axios.put(`/api/bookings/${id}/cancel`, {}, config);
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking');
        }
    };

    if (!user) return <div className="profile-page">Please login to view profile.</div>;

    return (
        <div className="profile-page page-container">
            <div className="profile-header glass-card">
                <div className="profile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                    <span className="role-badge">{user.role}</span>
                </div>
            </div>

            <div className="profile-content">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        My Bookings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('donations')}
                    >
                        My Donations
                    </button>
                </div>

                <div className="tab-content glass-card">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : activeTab === 'bookings' ? (
                        bookings.length > 0 ? (
                            <div className="bookings-list">
                                {bookings.map(booking => (
                                    <div key={booking._id} className="booking-card">
                                        <div className="booking-header">
                                            <h3>{booking.typeModel}: {booking.item?.title || booking.item?.name || 'Details Unavailable'}</h3>
                                            <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                        </div>
                                        <div className="booking-details">
                                            <p><i className="far fa-calendar-alt"></i> {new Date(booking.date).toLocaleDateString()}</p>
                                            <p><i className="fas fa-ticket-alt"></i> {booking.members} Tickets</p>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="cancel-btn-sm"
                                                        style={{ marginTop: 0 }}
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                ) : null}
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="bill-btn-sm"
                                                    style={{ marginTop: 0 }}
                                                >
                                                    View Bill
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">You haven't made any bookings yet.</div>
                        )
                    ) : (
                        donations.length > 0 ? (
                            <table className="donations-table">
                                <thead>
                                    <tr>
                                        <th>Temple</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map(donation => (
                                        <tr key={donation._id}>
                                            <td>{donation.temple?.name || 'Unknown Temple'}</td>
                                            <td>{new Date(donation.date).toLocaleDateString()}</td>
                                            <td className="amount">₹{donation.amount}</td>
                                            <td>{donation.paymentMethod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-data">You haven't made any donations yet.</div>
                        )
                    )}
                </div>
            </div>
            {selectedBooking && <Bill booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
    );
};

export default Profile;
