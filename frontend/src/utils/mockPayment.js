/**
 * Mock Payment Processing Utility
 * Simulates payment processing without actual charges
 */

export const mockProcessPayment = async (amount, paymentMethod, bookingId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 95% success rate for demo
    const success = Math.random() > 0.05;

    if (success) {
        return {
            success: true,
            transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            amount,
            payment_method: paymentMethod,
            booking_id: bookingId,
            timestamp: new Date().toISOString(),
            status: 'completed'
        };
    } else {
        throw new Error('Payment processing failed. Please try a different payment method.');
    }
};

export const PAYMENT_METHODS = [
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Visa, Mastercard, Amex'
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        description: 'Pay with your PayPal account'
    },
    {
        id: 'google_pay',
        name: 'Google Pay',
        icon: 'G',
        description: 'Fast & secure'
    },
    {
        id: 'apple_pay',
        name: 'Apple Pay',
        icon: '',
        description: 'Pay with Apple devices'
    }
];

export const calculatePricing = (basePrice, duration = 1) => {
    const subtotal = basePrice * duration;
    const tax = subtotal * 0.1; // 10% tax
    const serviceFee = 2.99; // Platform fee
    const total = subtotal + tax + serviceFee;

    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        serviceFee: serviceFee.toFixed(2),
        total: total.toFixed(2)
    };
};
