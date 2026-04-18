import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';
import SkeletonLoader from '../../components/SkeletonLoader';
import axios from '../../utils/axiosConfig';
import './Temples.css';

const Temples = () => {
    const [temples, setTemples] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const response = await axios.get('/temples');
                setTemples(response.data);
            } catch (error) {
                console.error('Error fetching temples:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    const filteredTemples = temples.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTemples = filteredTemples.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTemples.length / itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                {loading ? (
                    <div style={{marginTop: '2rem'}}>
                        <SkeletonLoader type="grid" count={6} />
                    </div>
                ) : (
                    <>
                        <div className="temples-grid">
                    {currentTemples.map((temple, index) => {
                        const delayClass = `animate-delay-${((index % 3) + 1) * 100}`;
                        return (
                        <div key={temple._id} className={`glass-card temple-card animate-fade-in ${delayClass}`}>
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
                            <div className="temple-location">
                                <i className="fas fa-map-marker-alt"></i> {temple.location || "Location unavailable"}
                            </div>
                            <Link to={`/temples/${temple._id}`} className="temple-view-btn">
                                View Details <span>&rarr;</span>
                            </Link>
                        </div>
                    )})}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-container animate-fade-in">
                        <button 
                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &laquo; Prev
                        </button>
                        
                        <div className="pagination-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button 
                                    key={number} 
                                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => changePage(number)}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>

                        <button 
                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next &raquo;
                        </button>
                    </div>
                )}
                </>
                )}
            </div>
        </div>
    );
};

export default Temples;
