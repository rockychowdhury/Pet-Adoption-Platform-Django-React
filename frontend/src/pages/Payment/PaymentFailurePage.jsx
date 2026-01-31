import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Buttons/Button';

const PaymentFailurePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { bookingId, error } = location.state || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                >
                    <XCircle className="text-red-600" size={48} />
                </motion.div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-600 mb-6">
                    {error || 'We were unable to process your payment. Please try again.'}
                </p>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                    <div className="text-xs text-red-700 uppercase font-bold mb-2">Common Issues</div>
                    <ul className="space-y-1 text-sm text-red-800">
                        <li>• Insufficient funds</li>
                        <li>• Incorrect card information</li>
                        <li>• Card declined by bank</li>
                        <li>• Network connection error</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    {bookingId && (
                        <Button
                            onClick={() => navigate(`/checkout/${bookingId}`)}
                            variant="primary"
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </Button>
                    )}

                    <button
                        onClick={() => navigate('/dashboard/bookings')}
                        className="w-full py-2.5 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Bookings
                    </button>
                </div>

                {/* Contact Support */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Need help?</p>
                    <button
                        onClick={() => {
                            window.location.href = 'mailto:support@petconnect.com';
                        }}
                        className="text-brand-primary font-medium text-sm flex items-center justify-center gap-2 mx-auto hover:underline"
                    >
                        <Mail size={16} />
                        Contact Support
                    </button>
                </div>

                {/* Reassurance */}
                <div className="mt-6 text-xs text-gray-500">
                    <p>💡 Don't worry - your booking is still pending and no charges were made.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentFailurePage;
