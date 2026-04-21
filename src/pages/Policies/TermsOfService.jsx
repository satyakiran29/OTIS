import React from 'react';

const TermsOfService = () => {
    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px',
            paddingBottom: '4rem',
            background: 'var(--bg-primary)'
        }}>
            <div className="section-padding animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>
                    Terms of Service
                </h1>

                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Introduction</h2>
                        <p>Welcome to the Temple Info System. By accessing or using our website, platform, and services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Booking and Donations</h2>
                        <p>All bookings (Darshan, Sevas) and donations made through our system are final. We strive to process all requests accurately, but specific timings and availability are subject to the respective temple's final confirmation.</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem' }}>
                            <li>Cancellations are generally allowed within a designated grace period (e.g., 5 minutes after booking).</li>
                            <li>Refunds for eligible cancellations will be processed to the original payment method.</li>
                            <li>Donations are voluntary and non-refundable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>3. User Conduct</h2>
                        <p>Users must provide accurate information during registration and booking. Any misuse of the platform, including fraudulent payments or spamming, will result in immediate account termination.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Intellectual Property</h2>
                        <p>All content, logs, assets, and software associated with the Temple Info System are the intellectual property of the service providers and participating temples. Unlawful reproduction is strictly prohibited.</p>
                    </section>

                    <section>
                        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>5. Limitation of Liability</h2>
                        <p>The Temple Info System acts as a facilitator. We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or the services of the respective temples.</p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
