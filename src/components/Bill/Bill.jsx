import React from 'react';
import './Bill.css';

const Bill = ({ booking, onClose }) => {
    if (!booking) return null;

    const handlePrint = () => {
        window.print();
    };

    const totalAmount = booking.item?.price ? booking.item.price * booking.members : 0;
    const date = new Date(booking.date).toLocaleDateString();

    return (
        <div className="bill-overlay" onClick={onClose}>
            <div className="bill-container" onClick={e => e.stopPropagation()}>
                <button className="bill-close-btn" onClick={onClose}>&times;</button>

                <div className="bill-header">
                    <h2>OTIS</h2>
                    <p className="sub-header">Online Temple Information Management System</p>
                    <div className="receipt-badge">Official Receipt</div>
                </div>

                <div className="bill-details-grid">
                    <div className="detail-item">
                        <label>Transaction ID</label>
                        <span>{booking._id}</span>
                    </div>
                    <div className="detail-item text-right">
                        <label>Date</label>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                        <label>Devotee</label>
                        <span>{booking.user?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item text-right">
                        <label>Temple</label>
                        <span>
                            {booking.typeModel === 'Temple'
                                ? (booking.item?.name || 'N/A')
                                : (booking.item?.temple?.name || booking.item?.temple?.title || 'N/A')}
                        </span>
                    </div>
                </div>

                <div className="table-container">
                    <table className="bill-table">
                        <thead>
                            <tr>
                                <th>Service / Event</th>
                                <th className="text-center">Tickets</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="item-name">{booking.item?.name || booking.item?.title || booking.typeModel}</div>
                                    <div className="item-date">{date}</div>
                                </td>
                                <td className="text-center">{booking.members}</td>
                                <td className="text-right">₹{booking.item?.price || 0}</td>
                                <td className="text-right font-bold">₹{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bill-summary">
                    <div className="total-row">
                        <span>Grand Total</span>
                        <span className="amount">₹{totalAmount}</span>
                    </div>
                </div>

                <div className="bill-footer">
                    <p>Thank you for your booking! May you be blessed.</p>
                    <p className="small-text">This is a computer-generated receipt.</p>
                </div>

                <div className="bill-actions">
                    <button onClick={handlePrint} className="print-btn">
                        <i className="fas fa-print"></i> Print / Download
                    </button>
                    {/* Secondary close button for mobile/accessibility */}
                    <button onClick={onClose} className="close-action-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Bill;
