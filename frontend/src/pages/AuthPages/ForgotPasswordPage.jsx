import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
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
            <div className="text-center">
                {!success ? (
                    <>
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center">
                                <Lock size={32} className="text-brand-secondary" />
                            </div>
                        </div>

                        {/* Header */}
                        <h1 className="text-3xl font-bold text-text-primary mb-3">Reset your password</h1>
                        <p className="text-base font-normal text-text-secondary mb-8">
                            Enter your email and we'll send you a reset link
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <DarkInput
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                error={error}
                                required
                            />

                            <DarkButton type="submit" loading={isLoading}>
                                Send reset link
                            </DarkButton>
                        </form>

                        {/* Back to Login */}
                        <p className="mt-6 text-sm text-text-secondary">
                            Remember your password?{' '}
                            <Link to="/login" className="text-brand-secondary font-medium transition-colors hover:text-brand-primary hover:underline">
                                Back to login
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-status-success/10 border border-status-success/20 flex items-center justify-center">
                                <CheckCircle size={32} className="text-status-success" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-text-primary mb-3">Check your email!</h1>
                        <p className="text-base font-normal text-text-secondary mb-8">
                            We sent password reset instructions to<br />
                            <span className="text-text-primary font-medium">{email}</span>
                        </p>

                        <p className="text-sm text-text-tertiary mb-6">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>

                        <Link to="/login">
                            <DarkButton type="button">
                                Back to login
                            </DarkButton>
                        </Link>
                    </>
                )}
            </div>
        </AuthSplitLayout>
    );
};

export default ForgotPasswordPage;
