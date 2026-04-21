import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePaymentModal.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, formData, userEmail, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/donations`,
                payment_method_data: {
                    billing_details: {
                        name: formData.donorName,
                        email: userEmail || '',
                        phone: formData.mobile,
                        address: {
                            line1: formData.address,
                            line2: formData.address2 || '',
                            city: formData.city,
                            state: formData.state,
                            postal_code: formData.zipcode,
                            country: formData.country
                        }
                    }
                }
            },
            redirect: 'if_required'
        });

        if (paymentError) {
            setError(paymentError.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setIsProcessing(false);
            onSuccess(paymentIntent.id);
        } else {
            setError('Unexpected payment state');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-checkout-form">
            <PaymentElement options={{ fields: { billingDetails: 'never' } }} />
            {error && <div className="payment-error">{error}</div>}
            <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose} disabled={isProcessing}>
                    Cancel
                </button>
                <button type="submit" className="pay-btn" disabled={!stripe || isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
                </button>
            </div>
        </form>
    );
};

const StripePaymentModal = ({ clientSecret, amount, formData, userEmail, onSuccess, onClose }) => {
    if (!clientSecret) return null;

    const options = {
        clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#ff9933',
                colorBackground: '#1e293b',
                colorText: '#f8fafc',
                colorDanger: '#ef4444',
                fontFamily: 'Outfit, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            }
        },
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal-content">
                <h2>Secure Payment</h2>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm amount={amount} formData={formData} userEmail={userEmail} onSuccess={onSuccess} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
};

export default StripePaymentModal;
