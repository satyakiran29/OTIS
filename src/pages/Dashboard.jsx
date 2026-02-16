import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { useAuth } from '../context/AuthContext';
import TempleDisplay from '../components/TempleDisplay';
import Bill from '../components/Bill';
import './Dashboard.css';
import axios from '../utils/axiosConfig';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('temples');
    const [temples, setTemples] = useState([]);
    const [sevas, setSevas] = useState([]);
    const [donations, setDonations] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Temple Form Data
    const [templeFormData, setTempleFormData] = useState({
        name: '', location: '', description: '', history: '', images: ''
    });

    // Seva Form Data
    const [sevaFormData, setSevaFormData] = useState({
        name: '', description: '', price: '', duration: '', temple: '', ticketLimit: ''
    });

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTemples();
        fetchSevas();
        fetchDonations();
        fetchBookings();
        fetchUsers();
    }, []);

    // ...

    const fetchTemples = async () => {
        try {
            const response = await axios.get('/temples'); // BaseURL includes /api
            setTemples(response.data);
        } catch (error) {
            console.error('Error fetching temples:', error);
        }
    };

    const fetchSevas = async () => {
        try {
            const response = await axios.get('/sevas');
            setSevas(response.data);
        } catch (error) {
            console.error('Error fetching sevas:', error);
        }
    };

    const fetchDonations = async () => {
        try {
            const response = await axios.get('/donations', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/bookings', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleTempleChange = (e) => {
        setTempleFormData({ ...templeFormData, [e.target.name]: e.target.value });
    };

    const handleSevaChange = (e) => {
        setSevaFormData({ ...sevaFormData, [e.target.name]: e.target.value });
    };

    const handleTempleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting...');
        setStatus('loading');

        const templeData = {
            ...templeFormData,
            images: templeFormData.images.split(',').map(url => url.trim()).filter(url => url !== '')
        };

        const url = editingId ? `/temples/${editingId}` : '/temples';
        const method = editingId ? 'put' : 'post';

        try {
            const response = await axios[method](url, templeData, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            setMessage(editingId ? 'Temple updated successfully!' : 'Temple added successfully!');
            setStatus('success');
            setTempleFormData({ name: '', location: '', description: '', history: '', images: '' });
            setEditingId(null);
            fetchTemples();
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            setMessage('Error saving temple.');
            setStatus('error');
        }
    };

    const handleSevaSubmit = async (e) => {
        e.preventDefault();
        setMessage('Submitting...');
        setStatus('loading');

        const url = editingId ? `/sevas/${editingId}` : '/sevas';
        const method = editingId ? 'put' : 'post';

        try {
            const response = await axios[method](url, sevaFormData, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            setMessage(editingId ? 'Seva updated successfully!' : 'Seva added successfully!');
            setStatus('success');
            setSevaFormData({ name: '', description: '', price: '', duration: '', temple: '', ticketLimit: '' });
            setEditingId(null);
            fetchSevas();
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            setMessage('Error saving seva.');
            setStatus('error');
        }
    };

    const handleEdit = (item, type) => {
        setEditingId(item._id);
        if (type === 'temple') {
            setTempleFormData({
                name: item.name,
                location: item.location,
                description: item.description,
                history: item.history,
                images: Array.isArray(item.images) ? item.images.join(', ') : item.image || ''
            });
            setActiveTab('temples');
        } else {
            setSevaFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                duration: item.duration,
                ticketLimit: item.ticketLimit || '',
                temple: item.temple?._id || item.temple || ''
            });
            setActiveTab('sevas');
        }
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

        const endpoint = type === 'temple' ? `/temples/${id}` : `/sevas/${id}`;

        try {
            await axios.delete(endpoint, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
            setStatus('success');
            if (type === 'temple') fetchTemples(); else fetchSevas();
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            setMessage(`Error deleting ${type}.`);
            setStatus('error');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTempleFormData({ name: '', location: '', description: '', history: '', images: '' });
        setSevaFormData({ name: '', description: '', price: '', duration: '', temple: '', ticketLimit: '' });
    };

    return (
        <div className="dashboard-page page-container">
            <div className="dashboard-container">
                <SectionTitle title="Admin Dashboard" subtitle="Manage Content" />

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'temples' ? 'active' : ''}`}
                        onClick={() => setActiveTab('temples')}
                    >
                        Manage Temples
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'sevas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sevas')}
                    >
                        Manage Sevas
                    </button>
                </div>

                {message && (
                    <div className={`status-message ${status}`}>
                        {message}
                    </div>
                )}

                <div className="glass-card form-container">
                    <h3 className="form-title">
                        {activeTab === 'donations' ? 'Donation History' : activeTab === 'bookings' ? 'All Bookings' : activeTab === 'users' ? 'User Management' : (editingId ? `Edit ${activeTab === 'temples' ? 'Temple' : 'Seva'}` : `Add New ${activeTab === 'temples' ? 'Temple' : 'Seva'}`)}
                    </h3>

                    {activeTab === 'temples' ? (
                        <form onSubmit={handleTempleSubmit} className="temple-form">
                            {/* ... temple form inputs ... */}
                            <div className="form-group">
                                <label>Temple Name</label>
                                <input type="text" name="name" value={templeFormData.name} onChange={handleTempleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" name="location" value={templeFormData.location} onChange={handleTempleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={templeFormData.description} onChange={handleTempleChange} required />
                            </div>
                            <div className="form-group">
                                <label>History</label>
                                <textarea name="history" value={templeFormData.history} onChange={handleTempleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Images (Comma separated URLs)</label>
                                <input type="text" name="images" value={templeFormData.images} onChange={handleTempleChange} />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Saving...' : (editingId ? 'Update Temple' : 'Add Temple')}
                                </button>
                                {editingId && <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
                            </div>
                        </form>
                    ) : activeTab === 'sevas' ? (
                        <form onSubmit={handleSevaSubmit} className="seva-form">
                            {/* ... seva form inputs ... */}
                            <div className="form-group">
                                <label>Seva Name</label>
                                <input type="text" name="name" value={sevaFormData.name} onChange={handleSevaChange} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={sevaFormData.description} onChange={handleSevaChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={sevaFormData.price} onChange={handleSevaChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input type="text" name="duration" value={sevaFormData.duration} onChange={handleSevaChange} placeholder="e.g. 30 mins" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Ticket Limit (Required)</label>
                                    <input type="number" name="ticketLimit" value={sevaFormData.ticketLimit} onChange={handleSevaChange} required min="1" />
                                </div>
                                <div className="form-group"></div> {/* Spacer */}
                            </div>
                            <div className="form-group">
                                <label>Select Temple</label>
                                <select name="temple" value={sevaFormData.temple} onChange={handleSevaChange} required>
                                    <option value="">-- Select Temple --</option>
                                    {temples.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Saving...' : (editingId ? 'Update Seva' : 'Add Seva')}
                                </button>
                                {editingId && <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                            <p>View all {activeTab === 'bookings' ? 'bookings' : (activeTab === 'users' ? 'registered users' : 'donations')} made by users below.</p>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '4rem' }}>
                    <h3 className="form-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                        {activeTab === 'temples' ? 'Existing Temples' : (activeTab === 'sevas' ? 'Existing Sevas' : (activeTab === 'bookings' ? 'All Bookings' : (activeTab === 'users' ? 'Registered Users' : 'All Donations')))}
                    </h3>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {activeTab === 'temples' ? (
                            temples.length > 0 ? (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Location</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {temples.map(temple => (
                                            <tr key={temple._id}>
                                                <td>{temple.name}</td>
                                                <td>{temple.location}</td>
                                                <td className="text-right actions-cell">
                                                    <button onClick={() => handleEdit(temple, 'temple')} className="edit-btn">Edit</button>
                                                    <button onClick={() => handleDelete(temple._id, 'temple')} className="delete-btn">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div className="no-data">No temples found.</div>
                        ) : activeTab === 'sevas' ? (
                            sevas.length > 0 ? (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Temple</th>
                                            <th>Price</th>
                                            <th>Limit</th>
                                            <th>Tickets Sold</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sevas.map(seva => (
                                            <tr key={seva._id}>
                                                <td>{seva.name}</td>
                                                <td>{seva.temple?.name || 'N/A'}</td>
                                                <td>₹{seva.price}</td>
                                                <td>{seva.ticketLimit}</td>
                                                <td style={{ fontWeight: 'bold', color: '#2c3e50' }}>{seva.bookedCount || 0}</td>
                                                <td className="text-right actions-cell">
                                                    <button onClick={() => handleEdit(seva, 'seva')} className="edit-btn">Edit</button>
                                                    <button onClick={() => handleDelete(seva._id, 'seva')} className="delete-btn">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div className="no-data">No sevas found.</div>
                        ) : activeTab === 'bookings' ? (
                            bookings.length > 0 ? (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Item</th>
                                            <th>User</th>
                                            <th>Date</th>
                                            <th>Tickets</th>
                                            <th>Status</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(booking => (
                                            <tr key={booking._id}>
                                                <td>{booking.typeModel}</td>
                                                <td>{booking.item?.title || booking.item?.name || 'N/A'}</td>
                                                <td>
                                                    <div>{booking.user?.name || booking.devotee || 'N/A'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{booking.user?.email || ''}</div>
                                                </td>
                                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                                <td>{booking.members}</td>
                                                <td>{booking.status}</td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="edit-btn"
                                                        style={{ background: '#3498db' }}
                                                    >
                                                        Bill
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div className="no-data">No bookings found.</div>
                        ) : activeTab === 'users' ? (
                            users.length > 0 ? (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        background: u.role === 'admin' ? '#dcfce7' : '#e0f2fe',
                                                        color: u.role === 'admin' ? '#166534' : '#0284c7',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div className="no-data">No users found.</div>
                        ) : (
                            donations.length > 0 ? (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Temple</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map(donation => (
                                            <tr key={donation._id}>
                                                <td>{donation.user?.name || 'Unknown'}</td>
                                                <td>{donation.temple?.name || 'N/A'}</td>
                                                <td style={{ color: '#27ae60', fontWeight: 'bold' }}>₹{donation.amount}</td>
                                                <td>{donation.paymentMethod}</td>
                                                <td>{new Date(donation.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div className="no-data">No donations found.</div>
                        )}
                    </div>
                </div>
            </div>
            {selectedBooking && <Bill booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

            <style>{`
                .dashboard-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    justify-content: center;
                }
                .tab-btn {
                    padding: 0.8rem 2rem;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }
                .tab-btn.active, .tab-btn:hover {
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .form-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .cancel-btn {
                    padding: 0.8rem 2rem;
                    background: #64748b;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: var(--text-light);
                }
                .admin-table th {
                    padding: 1rem;
                    text-align: left;
                    background: rgba(255, 255, 255, 0.05);
                }
                .admin-table td {
                    padding: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .text-right { text-align: right; }
                .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
                .edit-btn {
                    padding: 0.5rem 1rem;
                    background: var(--primary-color);
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                }
                .delete-btn {
                    padding: 0.5rem 1rem;
                    background: #ef4444;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                }
                .no-data {
                    padding: 2rem;
                    text-align: center;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
