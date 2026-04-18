import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '4rem',
            background: 'var(--bg-primary)'
        }}>
            <div className="section-padding animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>
                    Privacy Policy
                </h1>

                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                        <p>We respect your privacy and are committed to protecting your personal data. When you interact with the Temple Info System, we collect:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem' }}>
                            <li><strong>Personal Details:</strong> Name, Email address, Mobile number, Date of Birth, Gender, and optional cultural details (like Gothram) for sevas and donations.</li>
                            <li><strong>Booking Data:</strong> Information regarding the dates, tickets, and nature of your bookings.</li>
                            <li><strong>Payment Information:</strong> Processed securely via our payment gateway (e.g., Stripe). We do not store raw credit card details on our local servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                        <p>Your information is primarily used to facilitate the services you request, including:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem' }}>
                            <li>Processing temple bookings and issuing tickets/receipts.</li>
                            <li>Authenticating your account via email OTPs.</li>
                            <li>Communicating updates, confirmations, or cancellations regarding your interactions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Data Sharing and Security</h2>
                        <p>We do not sell your personal data to third parties. Data is shared with respective temple administrations strictly for fulfilling your physical bookings and donations. We implement industry-standard encryption and security measures to protect your digital records.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Your Rights</h2>
                        <p>You have the right to access, modify, or request the deletion of your personal data stored on our platform. Contact our support team for any privacy-related inquiries or actions.</p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
