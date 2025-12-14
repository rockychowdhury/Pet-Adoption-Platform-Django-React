import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, Clock } from 'lucide-react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import CodeInput from '../../components/Auth/CodeInput';
import DarkButton from '../../components/Auth/DarkButton';
import useAuth from '../../hooks/useAuth';

const VerifyEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyEmail, resendEmailVerification } = useAuth();

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [canResend, setCanResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);

    // Get email from navigation state or localStorage
    const email = location.state?.email || localStorage.getItem('verificationEmail');

    useEffect(() => {
        if (!email) {
            navigate('/register');
            return;
        }

        // Store email in localStorage
        localStorage.setItem('verificationEmail', email);

        // Start resend timer  
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [email, navigate]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (error) setError('');
    };

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError('Please enter a complete 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await verifyEmail(email, code);
            localStorage.removeItem('verificationEmail');
            navigate('/dashboard');
        } catch (err) {
            console.error('Verification failed:', err);
            setError(err.response?.data?.error || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            await resendEmailVerification(email);
            setCanResend(false);
            setResendTimer(60);
            setError('');
        } catch (err) {
            console.error('Resend failed:', err);
        }
    };

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            <div className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center">
                        <Mail size={32} className="text-brand-secondary" />
                    </div>
                </div>

                {/* Header */}
                <h1 className="text-3xl font-bold text-text-primary mb-3">Verify your email</h1>
                <p className="text-base font-normal text-text-secondary mb-8">
                    We sent a verification code to <br />
                    <span className="text-text-primary font-medium">{email}</span>
                </p>

                {/* Code Input */}
                <div className="mb-6">
                    <CodeInput
                        value={code}
                        onChange={handleCodeChange}
                        onComplete={handleVerify}
                    />
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-4">
                    <Clock size={16} />
                    <span>Code expires in {Math.floor(resendTimer / 60)}:{String(resendTimer % 60).padStart(2, '0')}</span>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert-error mb-4">
                        {error}
                    </div>
                )}

                {/* Resend Link */}
                <div className="text-sm text-text-secondary mb-6">
                    <span>Didn't receive the code? </span>
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-brand-secondary font-semibold bg-transparent border-none cursor-pointer p-0 inline hover:text-brand-primary transition-colors"
                            type="button"
                        >
                            Resend
                        </button>
                    ) : (
                        <span className="text-text-tertiary">
                            Resend in {resendTimer}s
                        </span>
                    )}
                </div>

                {/* Verify Button */}
                <DarkButton
                    type="button"
                    onClick={handleVerify}
                    loading={isLoading}
                    disabled={code.length !== 6}
                    className="mb-4"
                >
                    Verify email
                </DarkButton>

                {/* Helper Text */}
                <p className="text-xs text-text-tertiary">
                    Check your spam folder or{' '}
                    <Link to="/register" className="text-brand-secondary font-medium transition-colors hover:text-brand-primary hover:underline">
                        use a different email
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
};

export default VerifyEmailPage;
