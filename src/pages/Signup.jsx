import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { register, sendOtp } = useAuth();
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        mobile: '',
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
        const result = await sendOtp(formData.email, formData.name);
        setIsLoading(false);

        if (result.success) {
            setTimer(60); // 60 seconds cooldown
        } else {
            setError(result.message || 'Failed to resend OTP');
        }
    };
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
    const metRequirementsCount = Object.values(passwordRequirements).filter(Boolean).length;
    const strengthPercentage = (metRequirementsCount / 5) * 100;
    let strengthColor = '#ef4444';
    if (metRequirementsCount >= 3) strengthColor = '#eab308';
    if (metRequirementsCount === 5) strengthColor = '#22c55e';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!isPasswordValid) {
                setError('Please ensure password meets all requirements.');
                return;
            }

            if (formData.mobile.length !== 10) {
                setError('Mobile number must be exactly 10 digits.');
                return;
            }

            setIsLoading(true);
            const result = await sendOtp(formData.email, formData.name);
            setIsLoading(false);

            if (result.success) {
                setStep(2);
                setTimer(60);
            } else {
                setError(result.message);
            }
        } else if (step === 2) {
            setIsLoading(true);
            const { name, email, mobile, password, otp } = formData;
            const result = await register(name, email, password, mobile, otp);
            setIsLoading(false);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Invalid OTP');
            }
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
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {step === 1 ? 'Create Account' : 'Verify Your Email'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {step === 1 ? 'Join the Temple Info System community' : `Enter the 6-digit OTP sent to ${formData.email}`}
                    </p>
                    {error && <p style={{ color: '#e74c3c', marginTop: '0.5rem' }}>{error}</p>}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {step === 1 && (
                        <>
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
                                        border: '1px solid',
                                        borderColor: formData.password.length > 0 && !isPasswordValid ? '#f97316' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => {
                                        if (formData.password.length === 0 || isPasswordValid) e.target.style.borderColor = 'var(--primary-color)';
                                    }}
                                    onBlur={(e) => {
                                        if (formData.password.length === 0 || isPasswordValid) e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                />

                                {/* Password Strength Bar - Only visible if password has content */}
                                {formData.password.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${strengthPercentage}%`,
                                            background: strengthColor,
                                            transition: 'all 0.3s ease-in-out'
                                        }} />
                                    </div>
                                )}

                                {/* Password Requirements List */}
                                {formData.password.length > 0 && !isPasswordValid && (
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
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                <input type="checkbox" required style={{ accentColor: 'var(--primary-color)', marginTop: '0.2rem' }} />
                                <span>
                                    I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Terms of Service</Link> and <Link to="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Privacy Policy</Link>
                                </span>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Verification Code (OTP)</label>
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
                        disabled={step === 1 ? (!isPasswordValid || isLoading) : isLoading}
                        style={{
                            padding: '1rem',
                            background: isPasswordValid || step === 2 ? 'linear-gradient(to right, #ff9933, #e63946)' : '#666',
                            color: isPasswordValid || step === 2 ? '#fff' : '#ccc',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: isPasswordValid || step === 2 ? 'pointer' : 'not-allowed',
                            marginTop: '0.5rem',
                            transition: 'transform 0.2s',
                            boxShadow: isPasswordValid || step === 2 ? 'var(--shadow-glow)' : 'none',
                            opacity: isPasswordValid || step === 2 ? 1 : 0.7
                        }}
                        onMouseEnter={(e) => { if (isPasswordValid || step === 2) e.target.style.transform = 'scale(1.02)'; }}
                        onMouseLeave={(e) => { if (isPasswordValid || step === 2) e.target.style.transform = 'scale(1)'; }}
                    >
                        {isLoading ? 'Processing...' : (step === 1 ? 'Create Account' : 'Verify & Create Account')}
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
