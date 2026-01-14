import React from 'react';
import { X, CheckCircle2, AlertOctagon } from 'lucide-react';

const RehomingConfirmationModal = ({ isOpen, onClose, onConfirm, pet, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-bold font-display">Confirm Publication</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-lg text-foreground font-medium">
                            You're about to publish a public listing to rehome <strong>{pet?.name}</strong>.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Are you sure you want to proceed?
                        </p>
                    </div>

                    {/* Checklist */}
                    <div className="bg-secondary/20 rounded-xl p-4 mb-6 space-y-3">
                        {[
                            "I've explored all alternatives",
                            "I understand this listing will be public",
                            "I'm ready to communicate with potential adopters",
                            "I agree to the rehoming terms"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pet Summary */}
                    <div className="flex items-center gap-4 p-3 border border-border rounded-lg mb-6">
                        <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden">
                            {pet?.media && pet.media.length > 0 && (
                                <img src={pet.media[0].url} alt={pet.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div>
                            <div className="font-bold">{pet?.name}</div>
                            <div className="text-xs text-muted-foreground">{pet?.species} • {pet?.age} yrs</div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm flex gap-2 items-start mb-6">
                        <AlertOctagon size={16} className="mt-0.5 shrink-0" />
                        <p>Once published, this will notify potential adopters. You can still pause or cancel your listing later.</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary px-6"
                            disabled={isLoading}
                        >
                            Go Back
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-primary px-6 shadow-lg shadow-brand-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Publishing...' : 'Confirm & Publish'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RehomingConfirmationModal;
