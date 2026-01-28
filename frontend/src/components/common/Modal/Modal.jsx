import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../Buttons/Button'; // Assuming relative path

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    variant = 'standard', // standard, confirmation, fullscreen
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    isLoading,
    className = '',
}) => {
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

    const baseOverlay = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-overlay backdrop-blur-sm transition-opacity duration-300 animate-fade-in";

    const variants = {
        standard: "bg-bg-surface rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]",
        confirmation: "bg-bg-surface rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden animate-fade-in-up p-6 text-center",
        fullscreen: "bg-bg-surface w-full h-full fixed inset-0 z-50 overflow-y-auto animate-slide-in flex flex-col",
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (variant === 'confirmation') {
        return (
            <div className={baseOverlay}>
                <div className={variants.confirmation}>
                    <div className="mx-auto w-12 h-12 bg-status-warning/20 rounded-full flex items-center justify-center mb-4 text-status-warning">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">{title || 'Are you sure?'}</h3>
                    <div className="text-text-secondary mb-6">{children}</div>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={onClose} isDisabled={isLoading}>
                            {cancelText}
                        </Button>
                        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'fullscreen') {
        return (
            <div className={variants.fullscreen}>
                <div className="container mx-auto px-4 py-6 max-w-5xl">
                    <div className="flex justify-between items-center mb-8">
                        {title && <h2 className="text-3xl font-bold text-text-primary">{title}</h2>}
                        <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                            <X size={24} className="text-text-primary" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div className={baseOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={`${variants.standard} ${className}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-border shrink-0 bg-bg-surface rounded-t-3xl">
                    <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-brand-primary transition p-1 hover:bg-bg-secondary rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer (Optional - can be passed as children but sometimes nice to have sticky) */}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
    variant: PropTypes.oneOf(['standard', 'confirmation', 'fullscreen']),
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
};

export default Modal;
