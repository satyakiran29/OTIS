import React from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import GuideCard from '../components/GuideCard';
import TeamGrid from '../components/TeamGrid';

const Home = () => {
    return (
        <>
            <Hero />

            <main>
                {/* Project Section */}
                <section id="project" className="section-padding">
                    <SectionTitle title="Project Overview" subtitle="About the System" />
                    <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            The Temple Info System is designed to modernize temple administration, offering features for devotee management, donation tracking, and event scheduling. Our goal is to preserve the sanctity of tradition while embracing the efficiency of technology.
                        </p>
                    </div>
                </section>

                {/* Team Section */}
                <section id="team" className="section-padding" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2))' }}>
                    <SectionTitle title="Our Team" subtitle="The Minds Behind The Project" />

                    <div style={{ marginBottom: '4rem' }}>
                        <h3 style={{
                            textAlign: 'center',
                            color: 'var(--primary-color)',
                            marginBottom: '2rem',
                            fontSize: '1.5rem',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            Under the Guidance of
                        </h3>
                        <GuideCard />
                    </div>

                    <div>
                        <h3 style={{
                            textAlign: 'center',
                            color: 'var(--primary-color)',
                            marginBottom: '2rem',
                            fontSize: '1.5rem',
                            fontFamily: 'var(--font-serif)'
                        }}>
                            Developed By
                        </h3>
                        <TeamGrid />
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
