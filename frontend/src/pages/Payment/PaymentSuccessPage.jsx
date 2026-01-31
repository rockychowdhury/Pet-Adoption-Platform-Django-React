import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Buttons/Button';

const PaymentSuccessPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const transaction = location.state?.transaction;

    useEffect(() => {
        // Confetti or success sound could go here
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                    <CheckCircle className="text-green-600" size={48} />
                </motion.div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Your booking has been confirmed and payment processed successfully.
                </p>

                {/* Transaction Details */}
                {transaction && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Transaction Details</div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transaction ID</span>
                                <span className="font-mono font-medium text-gray-900">{transaction.transaction_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-bold text-green-600">${transaction.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium text-gray-900 capitalize">{transaction.payment_method?.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Number */}
                <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 mb-6">
                    <div className="text-xs text-teal-700 uppercase font-bold mb-1">Booking Confirmation</div>
                    <div className="text-2xl font-bold text-teal-900">#{bookingId}</div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        onClick={() => navigate('/dashboard/bookings')}
                        variant="primary"
                        className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold flex items-center justify-center gap-2"
                    >
                        View My Bookings
                        <ArrowRight size={16} />
                    </Button>

                    <button
                        onClick={() => {
                            toast.success('Receipt download started (mock)');
                        }}
                        className="w-full py-2.5 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <Download size={16} />
                        Download Receipt
                    </button>
                </div>

                {/* Next Steps */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">✓</span>
                            <span>You'll receive a confirmation email shortly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">✓</span>
                            <span>The provider will contact you to confirm details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-0.5">✓</span>
                            <span>Check your bookings page for updates</span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccessPage;
