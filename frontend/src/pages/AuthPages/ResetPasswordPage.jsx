import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Lock } from 'lucide-react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '../../utils/errorUtils';
import DarkInput from '../../components/Auth/DarkInput';
import DarkButton from '../../components/Auth/DarkButton';
import useAuth from '../../hooks/useAuth';

const ResetPasswordPage = () => {
    const { uid: uidb64, token } = useParams();
    const navigate = useNavigate();
    const { confirmPasswordReset } = useAuth();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [passwordsMatch, setPasswordsMatch] = useState(null);

    useEffect(() => {
        if (!uidb64 || !token) {
            navigate('/forgot-password');
        }
    }, [uidb64, token, navigate]);

    useEffect(() => {
        // Check if passwords match
        if (formData.password && formData.confirmPassword) {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        } else {
            setPasswordsMatch(null);
        }
    }, [formData.password, formData.confirmPassword]);

    useEffect(() => {
        // Redirect after success
        if (success) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });



        if (error) setError('');
    };



    const validateForm = () => {
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await confirmPasswordReset(uidb64, token, formData.password);
            setSuccess(true);
            toast.success("Password reset successfully!");
        } catch (err) {
            console.error('Password reset failed:', err);
            const msg = extractErrorMessage(err);
            toast.error(msg);
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
                            <h1 className="text-3xl font-bold text-text-primary mb-2 font-logo">New Password</h1>
                            <p className="text-text-secondary">
                                Your new password must be different from previous passwords
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password */}
                            <div>
                                <div className="relative">
                                    <DarkInput
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="New Password"
                                        startIcon={<Lock size={20} className="text-text-tertiary" />}

                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>


                            </div>

                            {/* Confirm Password */}
                            <div>
                                <div className="relative">
                                    <DarkInput
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        startIcon={<Lock size={20} className="text-text-tertiary" />}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {passwordsMatch !== null && (
                                    <p className={`mt-2 text-sm font-medium ${passwordsMatch ? 'text-status-success' : 'text-status-error'}`}>
                                        {passwordsMatch ? '✓ Passwords match' : "✗ Passwords don't match"}
                                    </p>
                                )}
                            </div>



                            {/* Submit */}
                            <DarkButton
                                type="submit"
                                loading={isLoading}
                                disabled={!passwordsMatch}
                            >
                                Reset Password
                            </DarkButton>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center">
                                    <CheckCircle size={32} className="text-status-success" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-text-primary mb-2 font-logo">Success!</h1>
                            <p className="text-text-secondary mb-6">
                                Your password has been reset successfully
                            </p>

                            <p className="text-sm text-text-tertiary mb-6">
                                Redirecting to login in 3 seconds...
                            </p>

                            <Link to="/login">
                                <DarkButton type="button">
                                    Go to Login
                                </DarkButton>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </AuthSplitLayout>
    );
};

export default ResetPasswordPage;
