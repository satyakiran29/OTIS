import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'grid', count = 3 }) => {
    
    // Renders the Hero layout for detailing pages like /temples/:id
    if (type === 'hero') {
        return (
            <div className="skeleton-wrapper">
                <div className="skeleton-hero skeleton-shimmer">
                    <div className="skeleton-hero-overlay">
                        <div className="skeleton-hero-title skeleton-shimmer" style={{background: 'rgba(255,255,255,0.1)'}}></div>
                        <div className="skeleton-hero-subtitle skeleton-shimmer" style={{background: 'rgba(255,255,255,0.1)'}}></div>
                    </div>
                </div>

                <div className="skeleton-content-block">
                    <div className="skeleton-text-heading skeleton-shimmer"></div>
                    <div className="skeleton-text-line skeleton-shimmer"></div>
                    <div className="skeleton-text-line short skeleton-shimmer"></div>
                    <div className="skeleton-text-line shorter skeleton-shimmer"></div>
                    <br/>
                    <div className="skeleton-text-heading skeleton-shimmer" style={{width: '150px'}}></div>
                    <div className="skeleton-text-line skeleton-shimmer"></div>
                    <div className="skeleton-text-line short skeleton-shimmer"></div>
                </div>
            </div>
        );
    }

    // Renders the Grid layout for Events or Temples pages
    if (type === 'grid') {
        return (
            <div className="skeleton-grid">
                {Array.from({ length: count }).map((_, idx) => (
                    <div key={idx} className="skeleton-card">
                        <div className="skeleton-card-img skeleton-shimmer"></div>
                        <div className="skeleton-card-title skeleton-shimmer"></div>
                        <div className="skeleton-card-text skeleton-shimmer"></div>
                        <div className="skeleton-card-btn skeleton-shimmer"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Small standalone block
    return (
        <div className="skeleton-content-block" style={{marginTop: '2rem'}}>
            <div className="skeleton-text-line skeleton-shimmer"></div>
            <div className="skeleton-text-line short skeleton-shimmer"></div>
        </div>
    );
};

export default SkeletonLoader;
