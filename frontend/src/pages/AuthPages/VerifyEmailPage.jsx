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
            // Redirect to dashboard after successful verification
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
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2 font-logo">Verify Your Email</h1>
                    <p className="text-text-secondary">
                        We sent a verification code to <br />
                        <span className="font-medium text-text-primary">{email}</span>
                    </p>
                </div>

                {/* Code Input */}
                <div className="mb-8">
                    <CodeInput
                        value={code}
                        onChange={handleCodeChange}
                        onComplete={handleVerify}
                    />
                </div>

                {/* Timer and Error Removed as per redesign request */}

                {/* Verify Button */}
                <DarkButton
                    type="button"
                    onClick={handleVerify}
                    loading={isLoading}
                    disabled={code.length !== 6}
                    className="mb-6"
                >
                    Verify Email
                </DarkButton>

                {/* Resend Link */}
                <div className="text-center text-sm text-text-secondary mb-4">
                    <span>Didn't receive the code? </span>
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-brand-primary font-bold hover:underline bg-transparent border-none cursor-pointer p-0 inline"
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

                {/* Helper Text */}
                <div className="text-center">
                    <p className="text-xs text-text-tertiary">
                        Check your spam folder or{' '}
                        <Link to="/register" className="text-text-primary font-bold hover:underline transition-colors">
                            use a different email
                        </Link>
                    </p>
                </div>
            </div>
        </AuthSplitLayout>
    );
};

export default VerifyEmailPage;
