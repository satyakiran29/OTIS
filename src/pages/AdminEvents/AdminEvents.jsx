import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import './AdminEvents.css';

const AdminEvents = () => {
    const { user: userInfo } = useAuth();
    const [events, setEvents] = useState([]);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', category: 'Daily', date: '', time: '', location: '', imageUrl: '', temple: ''
    });

    useEffect(() => {
        fetchEvents();
        fetchTemples();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('/events').catch(() => ({ data: [] }));
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTemples = async () => {
        try {
            const { data } = await axios.get('/temples');
            setTemples(data);
        } catch (error) {
            console.error('Error fetching temples:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            if (editingEvent) {
                await axios.put(`/events/${editingEvent._id || editingEvent.id}`, formData, config);
            } else {
                await axios.post('/events', formData, config);
            }
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error.response?.data?.message || error.message);
            alert('Failed to save event. Ensure you are an Admin.');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            ...event,
            temple: event.temple?._id || event.temple || '',
            date: event.date ? event.date.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/events/${id}`, config);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event. Ensure you are an Admin.');
            }
        }
    };

    const openNewModal = () => {
        setEditingEvent(null);
        setFormData({ name: '', description: '', category: 'Daily', date: '', time: '', location: '', imageUrl: '', temple: '' });
        setIsModalOpen(true);
    };

    // Helper for floating label classes
    const getFormGroupClass = (fieldName) => {
        let classes = 'form-group';
        if (focusedField === fieldName) classes += ' focused';
        if (formData[fieldName] && formData[fieldName].toString().length > 0) classes += ' has-content';
        return classes;
    };

    if (!userInfo || userInfo.role !== 'admin') {
        return <div className="admin-denied">Access Denied. Admins Only.</div>;
    }

    return (
        <div className="admin-events-container">
            <div className="admin-events-header">
                <h2>✨ Manage Temple Events</h2>
                <button className="add-event-btn" onClick={openNewModal}>
                    <span style={{fontSize: '1.4rem'}}>+</span> Create New Event
                </button>
            </div>

            {loading ? (
                <div style={{textAlign: 'center', padding: '6rem', color: '#64748b'}}>
                    <div className="divine-spinner"></div>
                    <p style={{marginTop: '2rem', fontWeight: '500', letterSpacing: '0.05em'}}>REVEALING SACRED EVENTS...</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Event & Location</th>
                                <th>Temple</th>
                                <th>Category</th>
                                <th>Schedule</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id || event.id}>
                                    <td>
                                        <div style={{fontWeight: '800', color: 'white', fontSize: '1.1rem', marginBottom: '6px'}}>{event.name}</div>
                                        <div style={{fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                            <span>📍</span> {event.location || '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{color: '#94a3b8', fontWeight: '600'}}>{event.temple?.name || 'N/A'}</div>
                                    </td>
                                    <td><span className={`cat-label ${event.category.toLowerCase()}`}>{event.category}</span></td>
                                    <td>
                                        <div style={{color: 'white', fontWeight: '600', marginBottom: '4px'}}>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>🕒 {event.time || '-'}</div>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="edit-btn" onClick={() => handleEdit(event)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(event._id || event.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '8rem', color: '#475569'}}>
                                        <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>📅</div>
                                        <div style={{fontSize: '1.2rem', fontWeight: '700', color: '#94a3b8'}}>No events found.</div>
                                        <div style={{marginTop: '0.5rem'}}>Wait for the divine timing or create a new one.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setIsModalOpen(false)}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingEvent ? '📝 Edit Sacred Event' : '✨ Create Divine Event'}</h3>
                        </div>
                        
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="event-form">
                                <div className="form-section-title">Basic Information</div>
                                <div className={getFormGroupClass('name')}>
                                    <label>Event Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        required 
                                    />
                                </div>

                                <div className={getFormGroupClass('temple')}>
                                    <label>Temple Association</label>
                                    <select 
                                        name="temple" 
                                        value={formData.temple} 
                                        onChange={handleInputChange} 
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

                                <div className="form-section-title">Schedule & Type</div>
                                <div className="form-row">
                                    <div className={getFormGroupClass('category')}>
                                        <label>Category</label>
                                        <select 
                                            name="category" 
                                            value={formData.category} 
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('category')}
                                            onBlur={() => setFocusedField(null)}
                                        >
                                            <option value="Daily" style={{background: '#0f172a'}}>Daily</option>
                                            <option value="Weekly" style={{background: '#0f172a'}}>Weekly</option>
                                            <option value="Monthly" style={{background: '#0f172a'}}>Monthly</option>
                                            <option value="Annual" style={{background: '#0f172a'}}>Annual</option>
                                        </select>
                                    </div>
                                    <div className={getFormGroupClass('date')}>
                                        <label>Date</label>
                                        <input 
                                            type="date" 
                                            name="date" 
                                            value={formData.date} 
                                            onChange={handleInputChange} 
                                            onFocus={() => setFocusedField('date')}
                                            onBlur={() => setFocusedField(null)}
                                            required 
                                        />
                                    </div>
                                    <div className={getFormGroupClass('time')}>
                                        <label>Time (Optional)</label>
                                        <input 
                                            type="time" 
                                            name="time" 
                                            value={formData.time} 
                                            onChange={handleInputChange} 
                                            onFocus={() => setFocusedField('time')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-section-title">Additional Details</div>
                                <div className="form-row">
                                    <div className={getFormGroupClass('location')}>
                                        <label>Specific Location</label>
                                        <input 
                                            type="text" 
                                            name="location" 
                                            placeholder="e.g. Sanctum Sanctorum" 
                                            value={formData.location} 
                                            onChange={handleInputChange} 
                                            onFocus={() => setFocusedField('location')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>
                                    <div className={getFormGroupClass('imageUrl')}>
                                        <label>Image URL</label>
                                        <input 
                                            type="url" 
                                            name="imageUrl" 
                                            placeholder="https://..." 
                                            value={formData.imageUrl} 
                                            onChange={handleInputChange} 
                                            onFocus={() => setFocusedField('imageUrl')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>
                                </div>

                                <div className={getFormGroupClass('description')}>
                                    <label>Sacred Description</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                        onFocus={() => setFocusedField('description')}
                                        onBlur={() => setFocusedField(null)}
                                        required 
                                        rows="4"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        
                        <div className="modal-footer">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Dismiss</button>
                            <button type="button" className="save-btn" onClick={handleSubmit}>{editingEvent ? 'Update Event' : 'Commit Event'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;
