import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle, Mail } from 'lucide-react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import DarkInput from '../../components/Auth/DarkInput';
import DarkButton from '../../components/Auth/DarkButton';
import useAuth from '../../hooks/useAuth';

const ForgotPasswordPage = () => {
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await requestPasswordReset(email);
            setSuccess(true);
        } catch (err) {
            console.error('Password reset request failed:', err);
            // Don't show specific errors to prevent email enumeration
            setSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            <div className="w-full max-w-md mx-auto">
                {!success ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-logo">Reset Password</h1>
                            <p className="text-gray-500">
                                Enter your email and we'll send you a reset link
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <DarkInput
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                startIcon={<Mail size={20} className="text-gray-400" />}
                                error={error}
                                required
                            />

                            <DarkButton type="submit" loading={isLoading}>
                                Send Reset Link
                            </DarkButton>

                            <div className="flex justify-center mt-6">
                                <Link to="/login" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                                    <CheckCircle size={32} className="text-status-success" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-logo">Check your email!</h1>
                            <p className="text-gray-500 mb-8">
                                We sent password reset instructions to<br />
                                <span className="font-medium text-gray-900">{email}</span>
                            </p>

                            <Link to="/login">
                                <DarkButton type="button">
                                    Back to Login
                                </DarkButton>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AuthSplitLayout>
    );
};

export default ForgotPasswordPage;
