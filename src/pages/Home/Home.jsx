import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../../components/Hero';
import SectionTitle from '../../components/SectionTitle';
import GuideCard from '../../components/GuideCard';
import TeamGrid from '../../components/TeamGrid';

const Home = () => {
    return (
        <>
            <Hero />

            <main>
                {/* About Section */}
                <motion.section 
                    id="about" 
                    className="section-padding" 
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.5))' }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionTitle title="About the System" subtitle="System Overview" />
                    <div className="glass-card" style={{ padding: '3.5rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary-color)' }}></div>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', lineHeight: '1.8', opacity: 0.9 }}>
                            The <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Temple Information System</span> is a modern platform designed to help manage traditional temple activities with ease.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '1.5rem', lineHeight: '1.6' }}>
                            We provide easy-to-use tools for coordinating devotees, tracking donations, and scheduling events, so that the spiritual focus remains at the heart of everything we do.
                        </p>
                    </div>
                </motion.section>

                {/* Team Section */}
                <motion.section 
                    id="team" 
                    className="section-padding"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionTitle title="Our Team" subtitle="The Minds Behind The Project" />

                    <div style={{ marginBottom: '5rem' }}>
                        <h3 style={{
                            textAlign: 'center',
                            color: 'var(--primary-color)',
                            marginBottom: '2.5rem',
                            fontSize: '1.6rem',
                            fontFamily: 'var(--font-serif)',
                            fontWeight: '700'
                        }}>
                            Under the Guidance of
                        </h3>
                        <GuideCard />
                    </div>

                    <div>
                        <h3 style={{
                            textAlign: 'center',
                            color: 'var(--primary-color)',
                            marginBottom: '2.5rem',
                            fontSize: '1.6rem',
                            fontFamily: 'var(--font-serif)',
                            fontWeight: '700'
                        }}>
                            Developed By
                        </h3>
                        <TeamGrid />
                    </div>
                </motion.section>

                {/* Project Section */}
                <section id="project" className="section-padding" style={{ background: 'linear-gradient(to top, transparent, rgba(15, 23, 42, 0.5))', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <SectionTitle title="The Project" subtitle="Our Vision & Mission" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
                        
                        <motion.div 
                            className="glass-card" 
                            style={{ padding: '2rem' }}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>Our Vision</h4>
                            <p style={{ color: 'var(--text-muted)' }}>To create a unified digital gateway for temples worldwide, preserving cultural heritage through secure and scalable technology.</p>
                        </motion.div>

                        <motion.div 
                            className="glass-card" 
                            style={{ padding: '2rem' }}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.3rem' }}>Our Mission</h4>
                            <p style={{ color: 'var(--text-muted)' }}>Providing accessible tools for smaller temples to manage their resources while offering devotees a direct line to spiritual services.</p>
                        </motion.div>

                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
