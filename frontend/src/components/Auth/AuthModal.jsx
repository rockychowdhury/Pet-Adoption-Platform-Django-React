import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import FeatureCarousel from './FeatureCarousel';
import AuthForm from './AuthForm';
import useAuth from '../../hooks/useAuth';
import { getRoleBasedRedirect } from '../../utils/roleRedirect';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleSuccess = () => {
        onClose();
        // Navigate based on role after successful login
        const redirectPath = getRoleBasedRedirect(user);
        navigate(redirectPath, { replace: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            {/* Modal Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex min-h-[600px] animate-scale-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-black/5 rounded-full backdrop-blur-sm transition-colors text-gray-500 hover:text-gray-900"
                >
                    <X size={24} />
                </button>

                {/* Left Side - Carousel (Hidden on Mobile) */}
                <div className="hidden lg:block w-1/2 relative bg-gray-900">
                    <FeatureCarousel />
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <AuthForm initialMode={initialMode} onSuccess={handleSuccess} />
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
