import React, { useState } from 'react';
import { X } from 'lucide-react';
import useAdoption from '../../hooks/useAdoption';
import { toast } from 'react-toastify';

const ApplicationModal = ({ isOpen, onClose, petId, petName }) => {
    const { useSubmitApplication } = useAdoption();
    const submitMutation = useSubmitApplication();
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitMutation.mutateAsync({ pet: petId, message });
            toast.success("Application submitted successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit application. You may have already applied.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-bg-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up border border-border">
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-primary/50">
                    <h2 className="text-2xl font-bold text-text-primary font-logo">Adopt {petName}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-full transition text-text-secondary hover:text-text-primary">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Why do you want to adopt {petName}?</label>
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-text-primary focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition min-h-[150px]"
                            placeholder="Tell us about your home, experience with pets, and why you'd be a great parent..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:bg-bg-primary transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitMutation.isLoading}
                            className="px-8 py-3 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitMutation.isLoading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
