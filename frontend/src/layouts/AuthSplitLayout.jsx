import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight } from 'lucide-react';

/**
 * AuthSplitLayout - Split-screen authentication layout
 * Left: Feature carousel
 * Right: Form content
 * Refactored to use Tailwind CSS utility classes
 */
const AuthSplitLayout = ({ carousel, children }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-bg-primary font-inter text-text-primary">
            {/* Left Panel - Carousel */}
            <div className="w-full md:w-[40%] lg:w-1/2 h-[40vh] md:h-screen md:sticky md:top-0 relative overflow-hidden bg-gray-900">
                {/* Logo - Top Left */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30">
                    <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                        <PawPrint size={24} className="text-brand-secondary" />
                        <span className="text-xl font-bold tracking-tight">PetCircle</span>
                    </Link>
                </div>

                {/* Back to Website Button - Top Right */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-black/20 backdrop-blur-md text-white text-xs md:text-sm font-medium hover:bg-black/40 transition-all border border-white/10"
                    >
                        Back to website
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Carousel Content */}
                {carousel}
            </div>

            {/* Right Panel - Forms */}
            <div className="w-full md:w-[60%] lg:w-1/2 min-h-[60vh] md:min-h-screen bg-bg-primary flex items-center justify-center p-4 md:p-12 lg:p-16 overflow-y-auto">
                <div className="w-full max-w-[480px] bg-bg-surface p-6 md:p-12 shadow-xl rounded-2xl border border-border">
                    {children}
                </div>
            </div>
        </div>
    );
};

AuthSplitLayout.propTypes = {
    carousel: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
};

export default AuthSplitLayout;
