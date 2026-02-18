import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero-section">
            {/* Dark Overlay for readability */}
            <div className="hero-overlay"></div>

            <div className="hero-content animate-fade-in">
                <h1 className="hero-title">
                    Temple Management <br />
                    <span className="text-gradient">Information System</span>
                </h1>

                <p className="hero-description">
                    Bridging tradition and technology. A comprehensive project developed to streamline temple administration and devotee services.
                </p>

                <div className="hero-buttons">
                    <a href="#team" className="btn-primary">
                        View Our Team
                    </a>
                    <Link to="/temples" className="btn-outline">
                        View Temples
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
