import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import StripePaymentModal from '../../components/StripePaymentModal';
import './Donations.css';

const Donations = () => {
    const { user } = useAuth();
    const [temples, setTemples] = useState([]);
    const [formData, setFormData] = useState({
        donorName: '',
        gothram: '',
        amount: '',
        occasion: '',
        dob: '',
        gender: '',
        paymentMethod: 'Card',
        address: '',
        address2: '',
        city: '',
        state: '',
        country: 'IN',
        mobile: '',
        donationDate: '',

        
        templeId: ''
    });
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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

    const handleGenderChange = (e) => {
        setFormData({ ...formData, gender: e.target.value });
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

        if (parseInt(formData.amount) < 100) {
            setMessage('Minimum donation amount is Rs. 100');
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

            // Route both Card and UPI through Secure Stripe Checkout
            if (['Card', 'UPI'].includes(formData.paymentMethod)) {
                const res = await axios.post('/payments/create-payment-intent', {
                    amount: formData.amount,
                    paymentMethodType: formData.paymentMethod === 'UPI' ? 'upi' : 'card',
                    description: `Donation from ${formData.donorName}`,
                    metadata: {
                        ...formData,
                        type: 'donation',
                        userId: user._id || user.id,
                        userEmail: user.email,
                        userName: user.name || formData.donorName
                    }
                }, config);
                setClientSecret(res.data.clientSecret);
                setShowPaymentModal(true);
                setStatus('idle');
            } else {
                setMessage('Invalid payment method selected.');
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.error?.message || err.response?.data?.message || 'Payment initiation failed');
            setStatus('error');
        }
    };

    const handlePaymentSuccess = async () => {
        setShowPaymentModal(false);
        // Backend webhook will process the donation and send the email
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="donations-page page-container">
                <div className="donations-container success-view">
                    <div className="success-message">
                        <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#27ae60', marginBottom: '1rem' }}></i>
                        <h2>Thank You for Your Donation!</h2>
                        <p>Your contribution has been successfully received.</p>
                        <button onClick={() => window.location.reload()} className="donate-again-btn">
                            Donate Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="donations-page page-container">
            {showPaymentModal && (
                <StripePaymentModal
                    clientSecret={clientSecret}
                    amount={formData.amount}
                    formData={formData}
                    userEmail={user?.email}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setShowPaymentModal(false)}
                    returnUrl={`${window.location.origin}/donations`}
                />
            )}
            <div className="donations-container">
                <h1 className="page-title">Make a Donation</h1>

                <form onSubmit={handleSubmit} className="donation-form glass-card detailed-form">
                    {message && <div className={`form-message ${status}`}>{message}</div>}

                    {/* Temple Selection (Added per user comment to ensure Temple Name is captured/linked) */}
                    <div className="form-group full-width">
                        <label>Select Temple *</label>
                        <select name="templeId" value={formData.templeId} onChange={handleChange} required>
                            <option value="">-- Choose a Temple --</option>
                            {temples.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Donor / Nominee Name *</label>
                            <input type="text" name="donorName" placeholder="Please enter a donor/nominee name" value={formData.donorName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Gothram</label>
                            <input type="text" name="gothram" placeholder="Please enter your gothram" value={formData.gothram} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount *</label>
                            <input type="number" name="amount" placeholder="Minimum donation amount Rs. 100" min="100" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Occasion / Auspicious Day</label>
                            <input type="text" name="occasion" placeholder="Please enter the occasion. Eg: Birthday" value={formData.occasion} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date of Birth *</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select a gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <hr className="divider" />

                    <div className="form-row">
                        <div className="form-group">
                            <label>Address Lane 1 *</label>
                            <input type="text" name="address" placeholder="House/building number, street number" value={formData.address} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Address Lane 2</label>
                            <input type="text" name="address2" placeholder="building name, street name, etc" value={formData.address2} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input type="text" name="city" placeholder="Please enter your city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Zipcode *</label>
                            <input type="text" name="zipcode" placeholder="Enter your zipcode" value={formData.zipcode} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>State *</label>
                            <input type="text" name="state" placeholder="State/Region" value={formData.state} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Country *</label>
                            <select name="country" value={formData.country} onChange={handleChange} required>
                                <option value="IN">India</option>
                                <option value="US">USA</option>
                                <option value="GB">UK</option>
                                <option value="AU">Australia</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Mobile Number *</label>
                        <div className="mobile-input-container">
                            <span className="mobile-prefix">🇮🇳 +91</span>
                            <input type="tel" name="mobile" className="mobile-input" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                        </div>
                    </div>

                    <hr className="divider" />
                     <div className="form-group full-width">
                        <label>Select Date *</label>
                        <input type="date" name="donationDate" value={formData.donationDate} onChange={handleChange} required />
</div>



                    <div className="form-group full-width">
                        <label>Payment Method</label>
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                            <option value="Card">Credit/Debit Card</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>

                    <button type="submit" className="donate-btn" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Processing...' : 'Donate Now'}
                    </button>

                </form>
            </div>
            <style>{`
                .detailed-form {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .full-width {
                    grid-column: span 2;
                }
                .divider {
                    margin: 2rem 0;
                    border: 0;
                    border-top: 1px solid rgba(0,0,0,0.1);
                }
                .radio-group {
                    display: flex;
                    gap: 2rem;
                    margin-top: 0.5rem;
                }
                .radio-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                }
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }
             `}</style>
        </div>
    );
};

export default Donations;
