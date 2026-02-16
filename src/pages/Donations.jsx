import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import './Donations.css';

const Donations = () => {
    const { user } = useAuth();
    const [temples, setTemples] = useState([]);
    const [formData, setFormData] = useState({
        templeId: '',
        amount: '',
        paymentMethod: 'Card'
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const res = await axios.get('/temples');
                setTemples(res.data);
            } catch (err) {
                console.error('Error fetching temples:', err);
            }
        };
        fetchTemples();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setStatus('submitting');

        if (!user) {
            setMessage('Please login to make a donation.');
            setStatus('error');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            };

            await axios.post('/api/donations', formData, config);
            setStatus('success');
            setFormData({ templeId: '', amount: '', paymentMethod: 'Card' });
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Donation failed');
            setStatus('error');
        }
    };

    return (
        <div className="donations-page page-container">
            <div className="donations-container">
                <h1 className="page-title">Make a Donation</h1>
                <p className="page-subtitle">Support your favorite temples and their activities.</p>

                {status === 'success' ? (
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i>
                        <h2>Thank You for Your Donation!</h2>
                        <p>Your contribution has been successfully received.</p>
                        <button onClick={() => setStatus('idle')} className="donate-again-btn">
                            Donate Again
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="donation-form glass-card">
                        {message && <div className={`form-message ${status}`}>{message}</div>}

                        <div className="form-group">
                            <label>Select Temple</label>
                            <select
                                name="templeId"
                                value={formData.templeId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose a Temple --</option>
                                {temples.map(temple => (
                                    <option key={temple._id} value={temple._id}>{temple.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="1"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                            >
                                <option value="Card">Credit/Debit Card</option>
                                <option value="UPI">UPI</option>
                                <option value="NetBanking">Net Banking</option>
                            </select>
                        </div>

                        <button type="submit" className="donate-btn" disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Processing...' : 'Donate Now'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Donations;
