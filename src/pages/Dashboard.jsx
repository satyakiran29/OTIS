import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const cards = [
        { title: 'Total Devotees', value: '1,234', icon: '👤', change: '+12% this month' },
        { title: 'Donations', value: '₹ 45,600', icon: '🕉️', change: '+5% this week' },
        { title: 'Upcoming Events', value: '8', icon: '📅', change: 'Next: Maha Shivaratri' },
        { title: 'Active Staff', value: '42', icon: '👔', change: 'All active' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '80px', // Navbar space
            display: 'flex',
        }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: 'var(--bg-card)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: '80px',
                bottom: 0,
                left: 0
            }}>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Dashboard', 'Devotees', 'Donations', 'Sevas', 'Events', 'Inventory', 'Staff', 'Settings'].map((item, index) => (
                        <div
                            key={item}
                            style={{
                                padding: '0.8rem 1rem',
                                borderRadius: '8px',
                                background: index === 0 ? 'rgba(255, 153, 51, 0.1)' : 'transparent',
                                color: index === 0 ? 'var(--primary-color)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: index === 0 ? '600' : '400'
                            }}
                            onMouseEnter={(e) => {
                                if (index !== 0) {
                                    e.target.style.background = 'rgba(255,255,255,0.05)';
                                    e.target.style.color = 'var(--text-light)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (index !== 0) {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--text-muted)';
                                }
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '250px',
                padding: '2rem',
                background: 'var(--bg-dark)'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Dashboard Overview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Admin</p>
                    </div>
                    <button style={{
                        padding: '0.8rem 1.5rem',
                        background: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        + New Donation
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    {cards.map((card, index) => (
                        <div key={index} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{card.title}</span>
                                <span style={{ fontSize: '1.2rem' }}>{card.icon}</span>
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{card.value}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#10b981' }}>{card.change}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Section */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Recent Activity</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Description</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>#TRX-{1000 + item}</td>
                                    <td style={{ padding: '1rem' }}>Donation for Annadhanam</td>
                                    <td style={{ padding: '1rem' }}>Feb 0{item}, 2026</td>
                                    <td style={{ padding: '1rem' }}>₹ 50{item}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            color: '#10b981',
                                            fontSize: '0.85rem'
                                        }}>
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
