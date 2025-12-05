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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-natural font-logo">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-action transition">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;