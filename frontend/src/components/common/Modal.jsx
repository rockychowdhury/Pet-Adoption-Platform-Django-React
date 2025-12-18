import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-overlay backdrop-blur-sm transition-opacity duration-300">
            <div className={`bg-bg-surface rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]`}>
                {title && (
                    <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
                        <h3 className="text-2xl font-bold text-text-primary font-logo">{title}</h3>
                        <button onClick={onClose} className="text-text-secondary hover:text-brand-secondary transition">
                            <X size={24} />
                        </button>
                    </div>
                )}
                {!title && (
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 text-text-secondary hover:text-brand-secondary transition">
                        <X size={24} />
                    </button>
                )}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;