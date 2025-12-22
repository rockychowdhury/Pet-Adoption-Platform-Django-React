import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../Buttons/Button'; // Adjust path if needed, assuming generic Button exists

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
    variant = "danger" // danger | warning | info
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-overlay/60 backdrop-blur-sm transition-all"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-bg-surface rounded-3xl shadow-2xl p-6 overflow-hidden border border-border"
                    >
                        {/* Blob Background Effect */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-radial from-status-error/5 to-transparent pointer-events-none" />

                        <div className="relative flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${variant === 'danger' ? 'bg-status-error/10 text-status-error' : 'bg-status-warning/10 text-status-warning'}`}>
                                <AlertTriangle size={32} strokeWidth={2} />
                            </div>

                            {/* Text */}
                            <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">
                                {title}
                            </h3>
                            <p className="text-text-secondary font-medium text-sm leading-relaxed mb-8 px-4">
                                {message}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 py-3.5 rounded-xl font-bold text-text-secondary hover:bg-bg-secondary transition-all disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-status-error/20 hover:shadow-status-error/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 ${variant === 'danger' ? 'bg-status-error' : 'bg-brand-primary'}`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        confirmText
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
