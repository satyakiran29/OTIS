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
        <div className="bill-overlay">
            <div className="bill-container">
                <div className="bill-header">
                    <h2>OTIS - Temple Management System</h2>
                    <p>Official Receipt</p>
                </div>

                <div className="bill-details">
                    <div className="detail-row">
                        <strong>Transaction ID:</strong>
                        <span>{booking._id}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Date:</strong>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Devotee Name:</strong>
                        <span>{booking.user?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Temple:</strong>
                        <span>
                            {booking.typeModel === 'Temple'
                                ? (booking.item?.name || 'N/A')
                                : (booking.item?.temple?.name || booking.item?.temple?.title || 'N/A')}
                        </span>
                    </div>
                </div>

                <table className="bill-table">
                    <thead>
                        <tr>
                            <th>Service / Event</th>
                            <th>Date</th>
                            <th>Tickets</th>
                            <th>Price/Head</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{booking.item?.name || booking.item?.title || booking.typeModel}</td>
                            <td>{date}</td>
                            <td>{booking.members}</td>
                            <td>₹{booking.item?.price || 0}</td>
                            <td>₹{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="bill-total">
                    <h3>Grand Total: ₹{totalAmount}</h3>
                </div>

                <div className="bill-footer">
                    <p>Thank you for your booking! May you be blessed.</p>
                    <p>This is a computer-generated receipt.</p>
                </div>

                <div className="bill-actions">
                    <button onClick={handlePrint} className="print-btn">Print / Download PDF</button>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Bill;
