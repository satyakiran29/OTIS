import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword, verifyOtp, resetPassword } = useAuth();
    const [formData, setFormData] = React.useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [step, setStep] = React.useState(1);
    const [error, setError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    // Password validation logic
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
        setFormData(prev => ({ ...prev, newPassword: pass }));
        validatePassword(pass);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0;
    const metRequirementsCount = Object.values(passwordRequirements).filter(Boolean).length;
    const strengthPercentage = (metRequirementsCount / 5) * 100;
    let strengthColor = '#ef4444';
    if (metRequirementsCount >= 3) strengthColor = '#eab308';
    if (metRequirementsCount === 5) strengthColor = '#22c55e';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (step === 1) {
            setIsLoading(true);
            const result = await forgotPassword(formData.email);
            setIsLoading(false);

            if (result.success) {
                setStep(2);
                setSuccessMessage(result.message);
            } else {
                setError(result.message);
            }
        } else if (step === 2) {
            setIsLoading(true);
            const result = await verifyOtp(formData.email, formData.otp);
            setIsLoading(false);

            if (result.success) {
                setStep(3);
                setSuccessMessage(''); // clear previous success
            } else {
                setError(result.message || 'Invalid OTP');
            }
        } else if (step === 3) {
            if (!isPasswordValid) {
                setError('Please ensure your new password meets all requirements.');
                return;
            }
            if (!passwordsMatch) {
                setError('Passwords do not match.');
                return;
            }

            setIsLoading(true);
            const result = await resetPassword(formData.email, formData.otp, formData.newPassword);
            setIsLoading(false);

            if (result.success) {
                setSuccessMessage(result.message + ' Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(result.message || 'Failed to reset password');
            }
        }
    };

    const getHeadingText = () => {
        if (step === 1) return 'Reset Password';
        if (step === 2) return 'Verify Account';
        return 'Create New Password';
    };

    const getSubheadingText = () => {
        if (step === 1) return 'Enter your email to receive a reset code';
        if (step === 2) return `Enter the 6-digit code sent to ${formData.email}`;
        return 'Secure your account with a strong password';
    };

    const getButtonText = () => {
        if (isLoading) return 'Processing...';
        if (step === 1) return 'Send Reset Code';
        if (step === 2) return 'Confirm OTP';
        return 'Reset Password';
    };

    const isSubmitDisabled = () => {
        if (isLoading) return true;
        if (step === 3 && (!isPasswordValid || !passwordsMatch)) return true;
        return false;
    };

    const getButtonStyle = () => {
        const isValid = !isSubmitDisabled();
        return {
            padding: '1rem',
            background: isValid ? 'linear-gradient(to right, #ff9933, #e63946)' : '#666',
            color: isValid ? '#fff' : '#ccc',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: isValid ? 'pointer' : 'not-allowed',
            marginTop: '0.5rem',
            transition: 'transform 0.2s',
            boxShadow: isValid ? 'var(--shadow-glow)' : 'none',
            opacity: isValid ? 1 : 0.7
        };
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
                        {getHeadingText()}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {getSubheadingText()}
                    </p>
                    {error && <p style={{ color: '#e74c3c', marginTop: '0.5rem' }}>{error}</p>}
                    {successMessage && <p style={{ color: '#4ade80', marginTop: '0.5rem' }}>{successMessage}</p>}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {step === 1 && (
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
                        </div>
                    )}

                    {step === 3 && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Create a strong password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid',
                                        borderColor: formData.newPassword.length > 0 && !isPasswordValid ? '#f97316' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => {
                                        if (formData.newPassword.length === 0 || isPasswordValid) e.target.style.borderColor = 'var(--primary-color)';
                                    }}
                                    onBlur={(e) => {
                                        if (formData.newPassword.length === 0 || isPasswordValid) e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                />

                                {/* Password Strength Bar - Only visible if password has content */}
                                {formData.newPassword.length > 0 && (
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
                                {formData.newPassword.length > 0 && !isPasswordValid && (
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

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid',
                                        borderColor: formData.confirmPassword.length > 0 && !passwordsMatch ? '#f97316' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => {
                                        if (formData.confirmPassword.length === 0 || passwordsMatch) e.target.style.borderColor = 'var(--primary-color)';
                                    }}
                                    onBlur={(e) => {
                                        if (formData.confirmPassword.length === 0 || passwordsMatch) e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                />
                                {formData.confirmPassword.length > 0 && !passwordsMatch && (
                                    <p style={{ color: '#f97316', fontSize: '0.85rem', marginTop: '0.5rem' }}>Passwords do not match</p>
                                )}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitDisabled()}
                        style={getButtonStyle()}
                        onMouseEnter={(e) => { if (!isSubmitDisabled()) e.target.style.transform = 'scale(1.02)'; }}
                        onMouseLeave={(e) => { if (!isSubmitDisabled()) e.target.style.transform = 'scale(1)'; }}
                    >
                        {getButtonText()}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
