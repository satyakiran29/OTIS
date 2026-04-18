import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SectionTitle from '../../components/SectionTitle';

const Login = () => {
    const navigate = useNavigate();
    const { login, sendOtp } = useAuth();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        otp: ''
    });
    const [step, setStep] = React.useState(1);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [timer, setTimer] = React.useState(0);

    React.useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        setError('');
        const result = await sendOtp(formData.email, "User");
        setIsLoading(false);

        if (result.success) {
            setTimer(60); // 60 seconds cooldown
        } else {
            setError(result.message || 'Failed to resend OTP');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (step === 1) {
                const { email, password } = formData;
                const result = await login(email, password);

                if (result.success) {
                    if (result.requiresOtp) {
                        setStep(2);
                        setTimer(60);
                    } else {
                        navigate('/');
                    }
                } else {
                    setError(result.message);
                }
            } else if (step === 2) {
                const { email, password, otp } = formData;
                const result = await login(email, password, otp);

                if (result.success && !result.requiresOtp) {
                    navigate('/');
                } else {
                    setError(result.message || 'Invalid OTP');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
        }}>
            <div className="glass-card animate-fade-in" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '3rem',
                margin: '2rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {step === 1 ? 'Welcome Back' : 'Verify Your Identity'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {step === 1 ? 'Sign in to continue to Temple Info System' : `Enter the 6-digit OTP sent to ${formData.email}`}
                    </p>
                    {error && <p style={{ color: '#e74c3c', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {step === 1 && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@temple.com"
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
                                    onChange={handleChange}
                                    placeholder="••••••••"
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

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    <input type="checkbox" style={{ accentColor: 'var(--primary-color)' }} /> Remember me
                                </label>
                                <Link to="/forgot-password" style={{ color: 'var(--primary-color)' }}>Forgot password?</Link>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Security Code (OTP)</label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    textAlign: 'center',
                                    letterSpacing: '5px',
                                    fontSize: '1.2rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={timer > 0 || isLoading}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: timer > 0 ? 'var(--text-muted)' : 'var(--primary-color)',
                                        cursor: (timer > 0 || isLoading) ? 'not-allowed' : 'pointer',
                                        textDecoration: timer > 0 ? 'none' : 'underline',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(to right, #ff9933, #e63946)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (step === 1 ? 'Sign In' : 'Verify & Sign In')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
