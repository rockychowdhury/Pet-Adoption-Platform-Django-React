import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthCard = ({ icon, title, subtitle, children, backToLogin, onClose, headerContent }) => {
    return (
        <div className="auth-container">
            <div className="auth-card animate-fade-in-up">

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-bg-secondary"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                )}

                {/* Custom Header Content (e.g. Logo + Text) */}
                {headerContent && (
                    <div className="mb-6">
                        {headerContent}
                    </div>
                )}

                {/* Standard Icon Bubble */}
                {icon && !headerContent && (
                    <div className="w-20 h-20 bg-brand-secondary/10 rounded-3xl flex items-center justify-center mb-6 text-brand-secondary shadow-sm">
                        {icon}
                    </div>
                )}

                <h1 className="text-2xl font-bold text-text-primary mb-2 text-center">{title}</h1>
                {subtitle && (
                    <p className="text-text-secondary text-center text-sm mb-8 leading-relaxed px-4">
                        {subtitle}
                    </p>
                )}

                <div className="w-full">
                    {children}
                </div>

                {backToLogin && (
                    <div className="mt-6 text-center">
                        <Link 
                            to="/login" 
                            className="text-sm font-medium text-brand-secondary hover:text-brand-primary flex items-center justify-center gap-2 group transition-colors"
                        >
                            <span>←</span> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthCard;
