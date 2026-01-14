import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const RehomingCancellationModal = ({ isOpen, onClose, onConfirm, petName, isLoading }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/20">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                        <AlertTriangle size={20} />
                        Cancel Rehoming Request?
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-foreground font-medium mb-4">
                        Are you sure you want to cancel your rehoming request for <strong>{petName}</strong>?
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        This action cannot be undone, but you can always create a new request later. No public listing will be created.
                    </p>

                    <label className="block text-sm font-bold mb-2">Why are you canceling? (Optional)</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="This helps us improve our service..."
                        className="w-full h-24 p-3 rounded-lg border border-border bg-background mb-4 text-sm resize-none focus:ring-2 focus:ring-primary/20 outline-none"
                    />

                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-6">
                        <strong>Good news!</strong> Your pet's profile will remain active in your account.
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Keep Request
                        </button>
                        <button
                            onClick={() => onConfirm(reason)}
                            className="btn bg-red-600 text-white hover:bg-red-700 border-red-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RehomingCancellationModal;
