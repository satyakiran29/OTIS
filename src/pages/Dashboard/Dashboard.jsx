import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import SectionTitle from '../../components/SectionTitle';
import { useAuth } from '../../context/AuthContext';
import TempleDisplay from '../../components/TempleDisplay';
import Bill from '../../components/Bill';
import './Dashboard.css';
import axios from '../../utils/axiosConfig';
import AdminEvents from '../AdminEvents';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [temples, setTemples] = useState([]);
    const [sevas, setSevas] = useState([]);
    const [donations, setDonations] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [viewingSevaBookings, setViewingSevaBookings] = useState(null);
    const [events, setEvents] = useState([]);
    const [focusedField, setFocusedField] = useState(null);

    // Temple Form Data
    const [templeFormData, setTempleFormData] = useState({
        name: '', location: '', description: '', history: '', images: '', coordinateString: ''
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
        fetchEvents();
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

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleUserDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/users/${id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setMessage('User deleted successfully');
            setStatus('success');
            fetchUsers();
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            setMessage('Error deleting user');
            setStatus('error');
        }
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Promote/Demote this user to ${newRole}?`)) return;

        try {
            await axios.put(`/users/${id}/role`, { role: newRole }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setMessage(`User role updated to ${newRole}`);
            setStatus('success');
            fetchUsers();
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            console.error('Error updating role:', error);
            setMessage(error.response?.data?.message || 'Error updating role');
            setStatus('error');
        }
    };

    // Helper for floating label classes
    const getFormGroupClass = (fieldName, formData) => {
        let classes = 'form-group';
        if (focusedField === fieldName) classes += ' focused';
        if (formData && formData[fieldName] && formData[fieldName].toString().length > 0) classes += ' has-content';
        return classes;
    };

    const handleBookingStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/bookings/${id}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setMessage(`Booking status updated to ${newStatus}`);
            setStatus('success');

            // Optimistically update the bookings state
            setBookings(prevBookings =>
                prevBookings.map(b => b._id === id ? { ...b, status: newStatus } : b)
            );

            fetchBookings(); // Fetch to ensure sync
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            console.error('Error updating booking status:', error);
            const errorMsg = error.response?.data?.message || 'Error updating booking status';
            setMessage(errorMsg);
            setStatus('error');
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

        let parsedLat = null;
        let parsedLon = null;
        if (templeFormData.coordinateString) {
            const parts = templeFormData.coordinateString.split(',');
            if (parts.length >= 2) {
                parsedLat = parseFloat(parts[0].trim());
                parsedLon = parseFloat(parts[1].trim());
            } else if (parts.length === 1 && parts[0].trim() !== '') {
                parsedLat = parseFloat(parts[0].trim());
            }
        }

        const templeData = {
            ...templeFormData,
            images: templeFormData.images.split(',').map(url => url.trim()).filter(url => url !== ''),
            coordinates: {
                lat: !isNaN(parsedLat) ? parsedLat : null,
                lon: !isNaN(parsedLon) ? parsedLon : null
            }
        };

        const url = editingId ? `/temples/${editingId}` : '/temples';
        const method = editingId ? 'put' : 'post';

        try {
            const response = await axios[method](url, templeData, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            setMessage(editingId ? 'Temple updated successfully!' : 'Temple added successfully!');
            setStatus('success');
            setTempleFormData({ name: '', location: '', description: '', history: '', images: '', coordinateString: '' });
            setEditingId(null);
            fetchTemples();
            setTimeout(() => { setMessage(''); setStatus(''); }, 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error saving temple.';
            setMessage(`Error: ${errorMsg}`);
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
                images: Array.isArray(item.images) ? item.images.join(', ') : item.image || '',
                coordinateString: (item.coordinates?.lat && item.coordinates?.lon) ? `${item.coordinates.lat}, ${item.coordinates.lon}` : ''
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
        setTempleFormData({ name: '', location: '', description: '', history: '', images: '', coordinates: { lat: null, lon: null } });
        setSevaFormData({ name: '', description: '', price: '', duration: '', temple: '', ticketLimit: '' });
    };

    // --- Compute Admin Stats ---
    const bookingRevenue = bookings.reduce((sum, b) => {
        const price = b.item && b.item.price ? Number(b.item.price) : 0;
        const members = b.members || 1;
        return sum + (price * members);
    }, 0);
    const totalRevenue = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) + bookingRevenue;
    
    const totalBookingsCount = bookings.length;
    const totalUsersCount = users.length;
    const totalTemplesCount = temples.length;
    const totalEventsCount = events.length;

    // --- Chart Data Aggregation ---
    const revenueData = useMemo(() => {
        const monthly = {};
        
        donations.forEach(d => {
            const date = new Date(d.createdAt || d.donationDate);
            const monthObj = date.toLocaleString('default', { month: 'short' });
            if (!monthly[monthObj]) monthly[monthObj] = { name: monthObj, 'Donation Revenue': 0, 'Seva Revenue': 0, 'Event Revenue': 0 };
            monthly[monthObj]['Donation Revenue'] += Number(d.amount) || 0;
        });

        bookings.forEach(b => {
            const date = new Date(b.createdAt || b.date);
            const monthObj = date.toLocaleString('default', { month: 'short' });
            if (!monthly[monthObj]) monthly[monthObj] = { name: monthObj, 'Donation Revenue': 0, 'Seva Revenue': 0, 'Event Revenue': 0 };
            const price = b.item && b.item.price ? Number(b.item.price) : 0;
            const members = b.members || 1;
            
            if (b.typeModel === 'Seva' || b.typeModel === 'seva' || b.type === 'seva') {
                monthly[monthObj]['Seva Revenue'] += (price * members);
            } else if (b.typeModel === 'Event' || b.typeModel === 'event' || b.type === 'event') {
                monthly[monthObj]['Event Revenue'] += (price * members);
            }
        });

        const sortedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return Object.values(monthly)
            .sort((a, b) => sortedMonths.indexOf(a.name) - sortedMonths.indexOf(b.name));
    }, [donations, bookings]);

    const analyticsData = useMemo(() => {
        const monthly = {};
        
        bookings.forEach(b => {
            const date = new Date(b.createdAt || b.date);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthly[month]) monthly[month] = { name: month, 'Seva Bookings': 0, 'General Bookings': 0, 'Donation Count': 0 };

            if (b.typeModel === 'Seva' || b.typeModel === 'seva' || b.type === 'seva') {
                monthly[month]['Seva Bookings'] += 1;
            } else {
                monthly[month]['General Bookings'] += 1;
            }
        });

        donations.forEach(d => {
            const date = new Date(d.createdAt || d.donationDate);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthly[month]) monthly[month] = { name: month, 'Seva Bookings': 0, 'General Bookings': 0, 'Donation Count': 0 };
            monthly[month]['Donation Count'] += 1;
        });

        const sortedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return Object.values(monthly)
            .sort((a, b) => sortedMonths.indexOf(a.name) - sortedMonths.indexOf(b.name));
    }, [bookings, donations]);


    // Custom Tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-chart-tooltip" style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '10px 15px', border: '1px solid rgba(255,153,51,0.2)', borderRadius: '8px', color: '#fff' }}>
                    <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color, margin: 0, fontSize: '0.9rem' }}>
                            {entry.name}: {String(entry.name).includes('Revenue') ? `₹${entry.value.toLocaleString()}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-page admin-dashboard-wrapper">
            <div className="admin-layout">
                {/* Fixed Sidebar */}
                <aside className="admin-sidebar glass-card">
                    <div className="sidebar-brand" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-color)' }}>Admin Panel</h2>
                    </div>
                    <nav className="sidebar-nav">
                        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <span className="nav-icon">📊</span> Dashboard
                        </button>
                        <button className={`nav-btn ${activeTab === 'temples' ? 'active' : ''}`} onClick={() => setActiveTab('temples')}>
                            <span className="nav-icon">🛕</span> Manage Temples
                        </button>
                        <button className={`nav-btn ${activeTab === 'sevas' ? 'active' : ''}`} onClick={() => setActiveTab('sevas')}>
                            <span className="nav-icon">🙏</span> Manage Sevas
                        </button>
                        <button className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            <span className="nav-icon">👥</span> Manage Users
                        </button>
                        <button className={`nav-btn ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>
                            <span className="nav-icon">💰</span> Donations
                        </button>
                        <button className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
                            <span className="nav-icon">📅</span> Manage Events
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="admin-main-content">
                    <div style={{ marginBottom: '2rem' }}>
                        <SectionTitle title="Admin Dashboard" subtitle="Overview & Management" />
                    </div>

                    {activeTab === 'dashboard' && (
                        <>
                            {/* Admin Overview Stats */}
                            <div className="admin-stats-grid glass-card">
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.2))' }}>💰</div>
                                    <div className="admin-stat-details">
                                        <span className="admin-stat-value">₹{totalRevenue.toLocaleString()}</span>
                                        <span className="admin-stat-label">Total Revenue</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.2))' }}>🎟️</div>
                                    <div className="admin-stat-details">
                                        <span className="admin-stat-value">{totalBookingsCount}</span>
                                        <span className="admin-stat-label">Total Bookings</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(142, 68, 173, 0.2))' }}>👥</div>
                                    <div className="admin-stat-details">
                                        <span className="admin-stat-value">{totalUsersCount}</span>
                                        <span className="admin-stat-label">Registered Users</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.2))' }}>🛕</div>
                                    <div className="admin-stat-details">
                                        <span className="admin-stat-value">{totalTemplesCount}</span>
                                        <span className="admin-stat-label">Active Temples</span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, rgba(243, 156, 18, 0.2), rgba(230, 126, 34, 0.2))' }}>📅</div>
                                    <div className="admin-stat-details">
                                        <span className="admin-stat-value">{totalEventsCount}</span>
                                        <span className="admin-stat-label">Events</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Charts Section */}
                            <div className="admin-charts-section">
                                {/* Sales Revenue Chart */}
                                <div className="chart-card glass-card">
                                    <div className="chart-header">
                                        <h3>Financial Dashboard</h3>
                                    </div>
                                    <div className="chart-wrapper" style={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                                                <YAxis stroke="#888" tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                                
                                                <Bar dataKey="Donation Revenue" stackId="a" fill="url(#colorRevenue)" maxBarSize={40} />
                                                <Bar dataKey="Seva Revenue" stackId="a" fill="#3b82f6" maxBarSize={40} />
                                                <Bar dataKey="Event Revenue" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                                
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.9} />
                                                        <stop offset="95%" stopColor="#ff7e5f" stopOpacity={0.6} />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Analytics Overview Chart */}
                                <div className="chart-card glass-card" style={{ marginTop: '2rem' }}>
                                    <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                                        <h3>Analytics / Visitors Overview</h3>
                                        <div className="chart-legends" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                                            <span style={{ color: '#3b82f6', fontWeight: 600 }}>● Seva Bookings</span>
                                            <span style={{ color: '#10b981', fontWeight: 600 }}>● Room/General</span>
                                            <span style={{ color: '#8b5cf6', fontWeight: 600 }}>● Donations</span>
                                        </div>
                                    </div>
                                    <div className="chart-wrapper" style={{ height: 300 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorSeva" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                                                <YAxis stroke="#888" tickLine={false} axisLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="Seva Bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSeva)" />
                                                <Area type="monotone" dataKey="General Bookings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGen)" />
                                                <Area type="monotone" dataKey="Donation Count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorDon)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'events' && (
                        <div className="admin-events-tab-content">
                            <AdminEvents />
                        </div>
                    )}

                    {message && (
                        <div className={`status-message ${status}`}>
                            {message}
                        </div>
                    )}

                    {['temples', 'sevas', 'users', 'donations', 'bookings'].includes(activeTab) && (
                        <>
                            <div className="glass-card form-container">
                                {activeTab === 'temples' ? (
                                    <form onSubmit={handleTempleSubmit} className="temple-form">
                                        <div className="form-section-title">Temple Identity</div>
                                        <div className={getFormGroupClass('name', templeFormData)}>
                                            <label>Temple Name</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={templeFormData.name} 
                                                onChange={handleTempleChange} 
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                required 
                                            />
                                        </div>
                                        <div className={getFormGroupClass('location', templeFormData)} style={{ position: 'relative', zIndex: 100 }}>
                                            <label>Location</label>
                                            <input 
                                                type="text" 
                                                name="location" 
                                                value={templeFormData.location} 
                                                onChange={handleTempleChange} 
                                                onFocus={() => setFocusedField('location')}
                                                onBlur={() => setFocusedField(null)}
                                                required 
                                                placeholder="Enter city or full address" 
                                            />
                                        </div>

                                        <div className="form-section-title">Logistics & Content</div>
                                        <div className={getFormGroupClass('coordinateString', templeFormData)}>
                                            <label>Map Coordinates (Optional)</label>
                                            <input 
                                                type="text" 
                                                name="coordinateString" 
                                                value={templeFormData.coordinateString} 
                                                onChange={handleTempleChange} 
                                                onFocus={() => setFocusedField('coordinateString')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="e.g. 18.4662, 83.6662" 
                                            />
                                        </div>
                                        <div className={getFormGroupClass('images', templeFormData)}>
                                            <label>Image URLs (Comma separated)</label>
                                            <input 
                                                type="text" 
                                                name="images" 
                                                value={templeFormData.images} 
                                                onChange={handleTempleChange} 
                                                onFocus={() => setFocusedField('images')}
                                                onBlur={() => setFocusedField(null)}
                                            />
                                        </div>

                                        <div className="form-section-title">Sacred Narrative</div>
                                        <div className={getFormGroupClass('description', templeFormData)}>
                                            <label>Description</label>
                                            <textarea 
                                                name="description" 
                                                value={templeFormData.description} 
                                                onChange={handleTempleChange} 
                                                onFocus={() => setFocusedField('description')}
                                                onBlur={() => setFocusedField(null)}
                                                required 
                                            />
                                        </div>
                                        <div className={getFormGroupClass('history', templeFormData)}>
                                            <label>History</label>
                                            <textarea 
                                                name="history" 
                                                value={templeFormData.history} 
                                                onChange={handleTempleChange} 
                                                onFocus={() => setFocusedField('history')}
                                                onBlur={() => setFocusedField(null)}
                                                required 
                                            />
                                        </div>
                                        
                                        <div className="form-buttons">
                                            <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                                                {status === 'loading' ? 'Saving...' : (editingId ? 'Update Temple' : 'Add Temple')}
                                            </button>
                                            {editingId && <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>}
                                        </div>
                                    </form>
                                ) : activeTab === 'sevas' ? (
                                    <form onSubmit={handleSevaSubmit} className="seva-form-premium">
                                        <div className="form-section-title">Seva Identity</div>
                                        <div className={getFormGroupClass('name', sevaFormData)}>
                                            <label>Seva Name</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={sevaFormData.name} 
                                                onChange={handleSevaChange} 
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                required 
                                                placeholder="e.g. Abhishekam"
                                            />
                                        </div>
                                        <div className={getFormGroupClass('description', sevaFormData)}>
                                            <label>Description</label>
                                            <textarea 
                                                name="description" 
                                                value={sevaFormData.description} 
                                                onChange={handleSevaChange} 
                                                onFocus={() => setFocusedField('description')}
                                                onBlur={() => setFocusedField(null)}
                                                required 
                                                placeholder="Describe the sacred service..."
                                            />
                                        </div>

                                        <div className="form-section-title">Booking Details</div>
                                        <div className="form-row">
                                            <div className={getFormGroupClass('price', sevaFormData)}>
                                                <label>Price (₹)</label>
                                                <input 
                                                    type="number" 
                                                    name="price" 
                                                    value={sevaFormData.price} 
                                                    onChange={handleSevaChange} 
                                                    onFocus={() => setFocusedField('price')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required 
                                                />
                                            </div>
                                            <div className={getFormGroupClass('duration', sevaFormData)}>
                                                <label>Duration</label>
                                                <input 
                                                    type="text" 
                                                    name="duration" 
                                                    value={sevaFormData.duration} 
                                                    onChange={handleSevaChange} 
                                                    onFocus={() => setFocusedField('duration')}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="e.g. 30 mins" 
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className={getFormGroupClass('ticketLimit', sevaFormData)}>
                                                <label>Ticket Limit (Required)</label>
                                                <input 
                                                    type="number" 
                                                    name="ticketLimit" 
                                                    value={sevaFormData.ticketLimit} 
                                                    onChange={handleSevaChange} 
                                                    onFocus={() => setFocusedField('ticketLimit')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required 
                                                    min="1" 
                                                />
                                            </div>
                                            <div className={getFormGroupClass('temple', sevaFormData)}>
                                                <label>Select Temple</label>
                                                <select 
                                                    name="temple" 
                                                    value={sevaFormData.temple} 
                                                    onChange={handleSevaChange} 
                                                    onFocus={() => setFocusedField('temple')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                >
                                                    <option value=""></option>
                                                    {temples.map(t => (
                                                        <option key={t._id} value={t._id} style={{background: '#0f172a'}}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-buttons">
                                            <button type="submit" className="submit-btn" style={{background: 'linear-gradient(135deg, #3b82f6, #6366f1)'}} disabled={status === 'loading'}>
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
                                <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
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
                                                            <td className="seva-booked-count">{seva.bookedCount || 0}</td>
                                                            <td className="text-right actions-cell">
                                                                <button
                                                                    onClick={() => setViewingSevaBookings(seva)}
                                                                    className="edit-btn btn-bookings"
                                                                >
                                                                    Bookings
                                                                </button>
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
                                                            <td>{booking.members}</td>
                                                            <td>
                                                                <select
                                                                    value={booking.status}
                                                                    onChange={(e) => handleBookingStatusUpdate(booking._id, e.target.value)}
                                                                    style={{
                                                                        padding: '4px',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                                        background: 'rgba(0,0,0,0.2)',
                                                                        color: 'white'
                                                                    }}
                                                                >
                                                                    <option value="pending" style={{ color: 'black' }}>Pending</option>
                                                                    <option value="confirmed" style={{ color: 'black' }}>Confirmed</option>
                                                                    <option value="completed" style={{ color: 'black' }}>Completed</option>
                                                                    <option value="cancelled" style={{ color: 'black' }}>Cancelled</option>
                                                                </select>
                                                            </td>
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
                                                        <th className="text-right">Actions</th>
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
                                                            <td className="text-right actions-cell">
                                                                {user.role === 'super-admin' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleRoleUpdate(u._id, u.role)}
                                                                            className="edit-btn"
                                                                            style={{ background: u.role === 'admin' ? '#f59e0b' : '#3b82f6' }}
                                                                        >
                                                                            {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                                                                        </button>
                                                                        <button onClick={() => handleUserDelete(u._id)} className="delete-btn">Delete</button>
                                                                    </>
                                                                )}
                                                            </td>
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
                                                        <th>User/Donor</th>
                                                        <th>Temple</th>
                                                        <th>Amount</th>
                                                        <th>Method</th>
                                                        <th>Date</th>
                                                        <th className="text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {donations.map(donation => (
                                                        <tr key={donation._id}>
                                                            <td>{donation.donorName || donation.user?.name || 'Unknown'}</td>
                                                            <td>{donation.temple?.name || 'N/A'}</td>
                                                            <td style={{ color: '#27ae60', fontWeight: 'bold' }}>₹{donation.amount}</td>
                                                            <td>{donation.paymentMethod}</td>
                                                            <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                                            <td className="text-right">
                                                                <button
                                                                    onClick={() => setSelectedDonation(donation)}
                                                                    className="edit-btn"
                                                                    style={{ background: '#8e44ad' }}
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : <div className="no-data">No donations found.</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {selectedBooking && <Bill booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

                    {viewingSevaBookings && (
                        <div className="modal-overlay" onClick={() => setViewingSevaBookings(null)}>
                            <div className="dashboard-modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>{viewingSevaBookings.name} - Bookings</h2>
                                        <p style={{ margin: '0.5rem 0 0', color: '#888', fontSize: '0.9rem' }}>
                                            Total Tickets Sold: {viewingSevaBookings.bookedCount || 0}
                                        </p>
                                    </div>
                                    <button onClick={() => setViewingSevaBookings(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>×</button>
                                </div>

                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Devotee / User</th>
                                                <th>Date</th>
                                                <th>Tickets</th>
                                                <th>Status</th>
                                                <th>Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.filter(b => b.item?._id === viewingSevaBookings._id || b.item === viewingSevaBookings._id).length > 0 ? (
                                                bookings.filter(b => b.item?._id === viewingSevaBookings._id || b.item === viewingSevaBookings._id).map(booking => (
                                                    <tr key={booking._id}>
                                                        <td>
                                                            <div style={{ fontWeight: '500' }}>{booking.user?.name || booking.devotee || 'Guest'}</div>
                                                        </td>
                                                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                                                        <td>{booking.members}</td>
                                                        <td>
                                                            <span className={`status-badge ${booking.status || 'pending'}`} style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.85rem',
                                                                background: booking.status === 'confirmed' ? 'rgba(74, 222, 128, 0.2)' : booking.status === 'completed' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                                                color: booking.status === 'confirmed' ? '#4ade80' : booking.status === 'completed' ? '#60a5fa' : '#fbbf24',
                                                                border: '1px solid currentColor'
                                                            }}>
                                                                {booking.status || 'pending'}
                                                            </span>
                                                        </td>
                                                        <td>{booking.user?.email || booking.mobile || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                                        No bookings found for this Seva.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedDonation && (
                        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
                            <div className="dashboard-modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Donation Details</h2>
                                    <button onClick={() => setSelectedDonation(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>×</button>
                                </div>

                                <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Donor Name</label>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{selectedDonation.donorName}</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Amount</label>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#27ae60' }}>₹{selectedDonation.amount}</div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Temple</label>
                                        <div>{selectedDonation.temple?.name || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Payment Method</label>
                                        <div>{selectedDonation.paymentMethod}</div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Gothram</label>
                                        <div>{selectedDonation.gothram || '-'}</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Occasion</label>
                                        <div>{selectedDonation.occasion || '-'}</div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Mobile</label>
                                        <div>{selectedDonation.mobile}</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Gender</label>
                                        <div>{selectedDonation.gender}</div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>My DOB</label>
                                        <div>{selectedDonation.dob ? new Date(selectedDonation.dob).toLocaleDateString() : '-'}</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Donation Date</label>
                                        <div>{selectedDonation.donationDate ? new Date(selectedDonation.donationDate).toLocaleDateString() : '-'}</div>
                                    </div>

                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Address</label>
                                        <div>
                                            {selectedDonation.address}<br />
                                            {selectedDonation.address2 && <>{selectedDonation.address2}<br /></>}
                                            {selectedDonation.city}, {selectedDonation.state} - {selectedDonation.zipcode}<br />
                                            {selectedDonation.country}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div >
        </div >
    );
};

export default Dashboard;
