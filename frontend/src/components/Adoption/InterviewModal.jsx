import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Link, FileText } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const InterviewModal = ({ isOpen, onClose, applicationId }) => {
    const { register, handleSubmit, reset } = useForm();
    const api = useAPI();
    const queryClient = useQueryClient();

    const scheduleMutation = useMutation({
        mutationFn: async (data) => {
            const payload = {
                ...data,
                event_type: 'interview',
                location: data.location // Mapping form field location to location
            };
            return await api.post(`/adoption/${applicationId}/schedule_event/`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            toast.success("Interview scheduled successfully!");
            reset();
            onClose();
        },
        onError: (err) => {
            toast.error(err.response?.data?.error || "Failed to schedule interview.");
        }
    });

    const onSubmit = (data) => {
        scheduleMutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-bg-surface rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-bg-secondary px-8 py-6 border-b border-border flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Schedule Interview</h2>
                        <p className="text-xs text-text-secondary mt-1">Set up a meeting with the adopter.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Date & Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3 text-text-secondary" size={18} />
                                <input
                                    type="datetime-local"
                                    {...register('date_time', { required: true })}
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Location / Link</label>
                            <div className="relative">
                                <Link className="absolute left-4 top-3 text-text-secondary" size={18} />
                                <input
                                    type="text"
                                    placeholder="Zoom Link or Physical Address"
                                    {...register('location', { required: true })}
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">Notes (Optional)</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3 text-text-secondary" size={18} />
                                <textarea
                                    placeholder="Any specific instructions..."
                                    {...register('notes')}
                                    className="input-field pl-12 min-h-[100px]"
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-outline flex-1 py-3 text-sm rounded-full"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={scheduleMutation.isPending}
                                className="btn-primary flex-1 py-3 text-sm rounded-full"
                            >
                                {scheduleMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InterviewModal;
