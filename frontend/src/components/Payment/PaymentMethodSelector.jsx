import React, { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { PAYMENT_METHODS } from '../../utils/mockPayment';

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Payment Method</h3>

            {PAYMENT_METHODS.map((method) => (
                <button
                    key={method.id}
                    onClick={() => onSelect(method.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all text-left ${selectedMethod === method.id
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                {method.icon}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{method.name}</div>
                                <div className="text-xs text-gray-500">{method.description}</div>
                            </div>
                        </div>
                        {selectedMethod === method.id && (
                            <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                                <Check size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                </button>
            ))}

            {/* Mock Card Input (only shows when card selected) */}
            {selectedMethod === 'card' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            maxLength="19"
                            disabled
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                maxLength="3"
                                disabled
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <CreditCard size={12} />
                        This is a demo - no real card needed
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodSelector;
