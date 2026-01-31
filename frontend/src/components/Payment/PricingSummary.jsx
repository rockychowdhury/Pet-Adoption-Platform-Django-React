import React from 'react';

const PricingSummary = ({ pricing, service, duration = 1 }) => {
    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Price Summary</h3>

            <div className="space-y-3">
                {/* Line Items */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        {service?.name || 'Service Fee'} {duration > 1 && `(×${duration})`}
                    </span>
                    <span className="font-medium text-gray-900">${pricing.subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Service Fee</span>
                    <span className="font-medium text-gray-900">${pricing.serviceFee}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium text-gray-900">${pricing.tax}</span>
                </div>

                <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-brand-primary">${pricing.total}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-800">
                    💡 <strong>Demo Mode:</strong> This is a mock payment. No actual charges will be made.
                </p>
            </div>
        </div>
    );
};

export default PricingSummary;
