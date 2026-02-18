import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import axios from '../utils/axiosConfig';

import './Temples.css';

const Temples = () => {
    const [temples, setTemples] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const response = await axios.get('/temples');
                setTemples(response.data);
            } catch (error) {
                console.error('Error fetching temples:', error);
            }
        };
        fetchTemples();
    }, []);

    const filteredTemples = temples.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="temples-container">
                <SectionTitle title="Explore Temples" subtitle="Sacred Destinations" />

                {/* Search Bar */}
                <div className="search-section">
                    <div className="glass-card search-bar">
                        <input
                            type="text"
                            placeholder="Search Temples..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button className="search-btn">
                            🔍
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="temples-grid">
                    {filteredTemples.map(temple => (
                        <div key={temple._id} className="glass-card temple-card">
                            <div className="temple-image-container">
                                <img
                                    src={Array.isArray(temple.images) && temple.images.length > 0 ? temple.images[0] : temple.image}
                                    alt={temple.name}
                                    className="temple-image"
                                />
                            </div>
                            <h3 className="temple-name">
                                {temple.name}
                            </h3>
                            <div>
                                <Link to={`/temples/${temple._id}`} className="temple-view-link">
                                    View Details
                                </Link>
                            </div>
                            <Link to={`/temples/${temple._id}`} className="temple-view-btn">
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Temples;
