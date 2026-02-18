import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [error, setError] = React.useState('');
    const [passwordRequirements, setPasswordRequirements] = React.useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false
    });

    const validatePassword = (pass) => {
        setPasswordRequirements({
            length: pass.length >= 8,
            upper: /[A-Z]/.test(pass),
            lower: /[a-z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[@#$%&*!?_-]/.test(pass)
        });
    };

    const handlePasswordChange = (e) => {
        const pass = e.target.value;
        setFormData(prev => ({ ...prev, password: pass }));
        validatePassword(pass);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!isPasswordValid) {
            setError('Please ensure password meets all requirements.');
            return;
        }

        const { name, email, mobile, password } = formData; // Mobile unused in backend for now

        if (mobile.length !== 10) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        const result = await register(name, email, password, mobile);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
        }}>
            <div className="glass-card animate-fade-in" style={{
                width: '100%',
                maxWidth: '500px',
                padding: '3rem',
                margin: '2rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join the Temple Info System community</p>
                    {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            placeholder="Create a strong password"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />

                        {/* Password Requirements List */}
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <p style={{ marginBottom: '0.25rem' }}>Password must contain:</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ color: passwordRequirements.length ? '#4ade80' : 'inherit' }}>
                                    {passwordRequirements.length ? '✓' : '○'} At least 8 characters
                                </li>
                                <li style={{ color: passwordRequirements.upper ? '#4ade80' : 'inherit' }}>
                                    {passwordRequirements.upper ? '✓' : '○'} At least 1 uppercase letter
                                </li>
                                <li style={{ color: passwordRequirements.lower ? '#4ade80' : 'inherit' }}>
                                    {passwordRequirements.lower ? '✓' : '○'} At least 1 lowercase letter
                                </li>
                                <li style={{ color: passwordRequirements.number ? '#4ade80' : 'inherit' }}>
                                    {passwordRequirements.number ? '✓' : '○'} At least 1 number
                                </li>
                                <li style={{ color: passwordRequirements.special ? '#4ade80' : 'inherit' }}>
                                    {passwordRequirements.special ? '✓' : '○'} At least 1 special char (@ # $ % & * ! ? _ -)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <input type="checkbox" required style={{ accentColor: 'var(--primary-color)', marginTop: '0.2rem' }} />
                        <span>I agree to the <a href="#" style={{ color: 'var(--primary-color)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary-color)' }}>Privacy Policy</a></span>
                    </div>



                    <button
                        type="submit"
                        disabled={!isPasswordValid}
                        style={{
                            padding: '1rem',
                            background: isPasswordValid ? 'linear-gradient(to right, #ff9933, #e63946)' : '#666',
                            color: isPasswordValid ? '#fff' : '#ccc',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: isPasswordValid ? 'pointer' : 'not-allowed',
                            marginTop: '0.5rem',
                            transition: 'transform 0.2s',
                            boxShadow: isPasswordValid ? 'var(--shadow-glow)' : 'none',
                            opacity: isPasswordValid ? 1 : 0.7
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
