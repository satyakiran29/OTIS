import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import Bill from '../../components/Bill';
import './Profile.css';

const Profile = () => {
    const { user, toggleTwoStepVerification, updatePassword, updateProfile, deleteAccount } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [bookings, setBookings] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Password Change State
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: user?.name || '', mobile: user?.mobile || '' });
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

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

            const bookingsRes = await axios.get('/bookings/mybookings', config);
            setBookings(bookingsRes.data);

            const donationsRes = await axios.get('/donations/my', config);
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
            await axios.put(`/bookings/${id}/cancel`, {}, config);
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking');
        }
    };

    const handleToggle2SV = async () => {
        if (!window.confirm(`Are you sure you want to ${user.isTwoStepVerificationEnabled ? 'disable' : 'enable'} Two-Step Verification?`)) return;
        const res = await toggleTwoStepVerification();
        if (res.success) {
            alert(res.message);
        } else {
            alert(res.message);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
        }

        if (passwordData.newPassword.length < 6) {
            return setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        }

        const res = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
        if (res.success) {
            setPasswordMessage({ type: 'success', text: res.message });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsChangingPassword(false);
                setPasswordMessage({ type: '', text: '' });
            }, 3000);
        } else {
            setPasswordMessage({ type: 'error', text: res.message });
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: '', text: '' });

        const res = await updateProfile(profileData);
        if (res.success) {
            setProfileMessage({ type: 'success', text: res.message });
            setTimeout(() => {
                setIsEditingProfile(false);
                setProfileMessage({ type: '', text: '' });
            }, 3000);
        } else {
            setProfileMessage({ type: 'error', text: res.message });
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('WARNING: This action cannot be undone. Are you absolutely sure you want to delete your account? All your data will be permanently lost.')) return;

        const res = await deleteAccount();
        if (res.success) {
            alert('Your account has been successfully deleted.');
        } else {
            alert(res.message);
        }
    };

    // --- Compute Statistics ---
    const totalBookings = bookings.length;

    // Total amount donated
    const totalDonations = donations.reduce((sum, donation) => sum + (Number(donation.amount) || 0), 0);

    // Total Special Darshan Tickets (sum of all 'members' from bookings of type 'Seva')
    const totalSevaTickets = bookings
        .filter(b => b.typeModel === 'Seva' || b.typeModel === 'seva')
        .reduce((sum, b) => sum + (Number(b.members) || 1), 0);

    // --- Combine Bookings and Donations into Recent Activity ---
    const recentActivity = [
        ...bookings.map(b => ({
            id: b._id,
            type: 'Booking',
            model: b.typeModel,
            title: b.item?.name || b.item?.title || 'Unknown Item',
            date: new Date(b.date),
            status: b.status || 'confirmed',
            amountOrMembers: `${b.members} ticket${b.members > 1 ? 's' : ''}`
        })),
        ...donations.map(d => ({
            id: d._id,
            type: 'Donation',
            model: 'General',
            title: d.temple?.name || 'General Donation',
            date: new Date(d.createdAt || d.donationDate),
            status: 'completed',
            amountOrMembers: `₹${d.amount}`
        }))
    ].sort((a, b) => b.date - a.date); // Sort newest to oldest

    if (!user) return <div className="profile-page">Please login to view profile.</div>;

    return (
        <div className="profile-page page-container">
            <div className="admin-dashboard-wrapper">
                <div className="admin-layout profile-layout">
                    {/* Sidebar Navigation */}
                    <aside className="admin-sidebar glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="profile-header text-center" style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 0, boxShadow: 'none', background: 'transparent' }}>
                            <div className="profile-avatar" style={{ margin: '0 auto 1rem' }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-info">
                                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-light)' }}>{user.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.email}</p>
                                <span className="role-badge" style={{ marginTop: '0.5rem', display: 'inline-block' }}>{user.role}</span>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            <button
                                className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <span className="nav-icon">📊</span> Overview
                            </button>
                            <button
                                className={`nav-btn ${activeTab === 'activity' ? 'active' : ''}`}
                                onClick={() => setActiveTab('activity')}
                            >
                                <span className="nav-icon">🕒</span> Recent Activity
                            </button>
                            <button
                                className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('bookings')}
                            >
                                <span className="nav-icon">🎟️</span> My Bookings
                            </button>
                            <button
                                className={`nav-btn ${activeTab === 'donations' ? 'active' : ''}`}
                                onClick={() => setActiveTab('donations')}
                            >
                                <span className="nav-icon">🙏</span> My Donations
                            </button>
                            <button
                                className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <span className="nav-icon">⚙️</span> Settings
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="admin-main-content">
                        {loading ? (
                            <div className="temple-loader-container">
                                <span className="temple-icon">🛕</span>
                                <span className="temple-loader-text">Loading Details...</span>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'overview' && (
                                    <div className="profile-stats admin-stats-grid">
                                        <div className="admin-stat-card">
                                            <div className="admin-stat-icon">🎟️</div>
                                            <div className="admin-stat-details">
                                                <span className="admin-stat-value">{totalBookings}</span>
                                                <span className="admin-stat-label">Total Bookings</span>
                                            </div>
                                        </div>
                                        <div className="admin-stat-card">
                                            <div className="admin-stat-icon">🙏</div>
                                            <div className="admin-stat-details">
                                                <span className="admin-stat-value">₹{totalDonations.toLocaleString()}</span>
                                                <span className="admin-stat-label">Total Donated</span>
                                            </div>
                                        </div>
                                        <div className="admin-stat-card">
                                            <div className="admin-stat-icon">✨</div>
                                            <div className="admin-stat-details">
                                                <span className="admin-stat-value">{totalSevaTickets}</span>
                                                <span className="admin-stat-label">Special Darshan Tickets</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="tab-content glass-card">
                                    {activeTab === 'overview' ? (
                                        <div className="overview-summary" style={{ textAlign: 'center', padding: '2rem' }}>
                                            <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Welcome to your Profile!</h2>
                                            <p style={{ color: '#555' }}>Select a tab from the sidebar to manage your account and view your history.</p>
                                        </div>
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
                                                                {['pending', 'confirmed'].includes(booking.status) && (Date.now() - new Date(booking.createdAt).getTime() <= 5 * 60 * 1000) ? (
                                                                    <button
                                                                        onClick={() => handleCancelBooking(booking._id)}
                                                                        className="cancel-btn-sm"
                                                                        style={{ marginTop: 0, backgroundColor: '#e74c3c' }}
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
                                    ) : activeTab === 'donations' ? (
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
                                    ) : activeTab === 'activity' ? (
                                        recentActivity.length > 0 ? (
                                            <div className="activity-timeline">
                                                {recentActivity.map(activity => (
                                                    <div key={`${activity.type}-${activity.id}`} className={`activity-item ${activity.type.toLowerCase()}`}>
                                                        <div className="activity-icon">
                                                            {activity.type === 'Booking' ? '🎟️' : '🙏'}
                                                        </div>
                                                        <div className="activity-details">
                                                            <div className="activity-header">
                                                                <h4>{activity.title}</h4>
                                                                <span className="activity-date">{activity.date.toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="activity-subtitle">
                                                                {activity.type === 'Booking'
                                                                    ? `Booked ${activity.model} • ${activity.amountOrMembers}`
                                                                    : `Donated to Temple • ${activity.amountOrMembers}`
                                                                }
                                                            </p>
                                                            <span className={`status-badge ${activity.status || 'pending'}`}>
                                                                {activity.status || 'pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-data">No recent activity found.</div>
                                        )
                                    ) : activeTab === 'settings' ? (
                                        <div className="settings-section">
                                            <h3>Security Settings</h3>
                                            <div className="setting-item">
                                                <div>
                                                    <h4>Two-Step Verification</h4>
                                                    <p>Add an extra layer of security to your account.</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <span style={{
                                                        color: user.isTwoStepVerificationEnabled ? '#27ae60' : '#e74c3c',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {user.isTwoStepVerificationEnabled ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                    <button
                                                        onClick={handleToggle2SV}
                                                        className={`btn-sm ${user.isTwoStepVerificationEnabled ? 'cancel-btn-sm' : 'bill-btn-sm'}`}
                                                        style={{ margin: 0 }}
                                                    >
                                                        {user.isTwoStepVerificationEnabled ? 'Turn Off' : 'Turn On'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <h4>Change Password</h4>
                                                        <p>Update your account password to keep it secure.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                                                        className="bill-btn-sm"
                                                        style={{ margin: 0 }}
                                                    >
                                                        {isChangingPassword ? 'Cancel' : 'Change Password'}
                                                    </button>
                                                </div>
                                                {isChangingPassword && (
                                                    <form onSubmit={handlePasswordSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                        <input
                                                            type="password"
                                                            name="currentPassword"
                                                            placeholder="Current Password"
                                                            value={passwordData.currentPassword}
                                                            onChange={handlePasswordChange}
                                                            required
                                                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                        />
                                                        <input
                                                            type="password"
                                                            name="newPassword"
                                                            placeholder="New Password"
                                                            value={passwordData.newPassword}
                                                            onChange={handlePasswordChange}
                                                            required
                                                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                        />
                                                        <input
                                                            type="password"
                                                            name="confirmPassword"
                                                            placeholder="Confirm New Password"
                                                            value={passwordData.confirmPassword}
                                                            onChange={handlePasswordChange}
                                                            required
                                                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                        />
                                                        {passwordMessage.text && (
                                                            <div style={{ color: passwordMessage.type === 'error' ? '#e74c3c' : '#27ae60', fontSize: '0.9rem' }}>
                                                                {passwordMessage.text}
                                                            </div>
                                                        )}
                                                        <button type="submit" className="bill-btn-sm" style={{ alignSelf: 'flex-start' }}>
                                                            Update Password
                                                        </button>
                                                    </form>
                                                )}
                                            </div>

                                            <h3 style={{ marginTop: '2rem' }}>Account Management</h3>

                                            <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <h4>Edit Profile</h4>
                                                        <p>Update your personal information like name and phone number.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                                                        className="bill-btn-sm"
                                                        style={{ margin: 0 }}
                                                    >
                                                        {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                                                    </button>
                                                </div>
                                                {isEditingProfile && (
                                                    <form onSubmit={handleProfileSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Full Name"
                                                            value={profileData.name}
                                                            onChange={handleProfileChange}
                                                            required
                                                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                        />
                                                        <input
                                                            type="tel"
                                                            name="mobile"
                                                            placeholder="Mobile Number"
                                                            value={profileData.mobile}
                                                            onChange={handleProfileChange}
                                                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                        />
                                                        {profileMessage.text && (
                                                            <div style={{ color: profileMessage.type === 'error' ? '#e74c3c' : '#27ae60', fontSize: '0.9rem' }}>
                                                                {profileMessage.text}
                                                            </div>
                                                        )}
                                                        <button type="submit" className="bill-btn-sm" style={{ alignSelf: 'flex-start' }}>
                                                            Save Changes
                                                        </button>
                                                    </form>
                                                )}
                                            </div>

                                            <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'stretch', border: '1px solid #ffcccc', background: '#fff5f5' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <h4 style={{ color: '#c0392b' }}>Delete Account</h4>
                                                        <p style={{ color: '#e74c3c' }}>Permanently remove your account and all associated data. This action is irreversible.</p>
                                                    </div>
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        className="cancel-btn-sm"
                                                        style={{ margin: 0, backgroundColor: '#c0392b', color: 'white', borderColor: '#c0392b' }}
                                                    >
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
            {selectedBooking && <Bill booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
    );
};

export default Profile;
