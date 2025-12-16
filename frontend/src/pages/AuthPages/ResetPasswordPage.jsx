import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
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
    const [passwordStrength, setPasswordStrength] = useState('');
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

        if (name === 'password') {
            calculatePasswordStrength(value);
        }

        if (error) setError('');
    };

    const calculatePasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength('');
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) setPasswordStrength('weak');
        else if (strength <= 3) setPasswordStrength('medium');
        else setPasswordStrength('strong');
    };

    const getStrengthColor = () => {
        if (passwordStrength === 'weak') return 'var(--color-status-error)';
        if (passwordStrength === 'medium') return 'var(--color-status-warning)';
        if (passwordStrength === 'strong') return 'var(--color-status-success)';
        return 'var(--color-border)';
    };

    const validateForm = () => {
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError('Include at least one uppercase letter');
            return false;
        }
        if (!/[0-9]/.test(formData.password)) {
            setError('Include at least one number');
            return false;
        }
        if (!/[^a-zA-Z0-9]/.test(formData.password)) {
            setError('Include at least one special character');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            await confirmPasswordReset(uidb64, token, formData.password);
            setSuccess(true);
        } catch (err) {
            console.error('Password reset failed:', err);
            setError(err.response?.data?.error || 'Invalid or expired reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            <div className="text-center">
                {!success ? (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-text-primary mb-3">Create new password</h1>
                            <p className="text-base font-normal text-text-secondary">
                                Your new password must be different from previous passwords
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            {/* New Password */}
                            <div>
                                <div className="relative">
                                    <DarkInput
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="New password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors p-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-300"
                                                    style={{
                                                        width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                                                        backgroundColor: getStrengthColor()
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium capitalize" style={{ color: getStrengthColor() }}>
                                                {passwordStrength}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <div className="relative">
                                    <DarkInput
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors p-1"
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

                            {/* Error */}
                            {error && (
                                <div className="alert-error">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <DarkButton
                                type="submit"
                                loading={isLoading}
                                disabled={!passwordsMatch}
                            >
                                Reset password
                            </DarkButton>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-status-success/10 border border-status-success/20 flex items-center justify-center">
                                <CheckCircle size={32} className="text-status-success" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-text-primary mb-3">Password reset successful</h1>
                        <p className="text-base font-normal text-text-secondary mb-6">
                            Your password has been reset successfully
                        </p>

                        <p className="text-sm text-text-tertiary mb-6">
                            Redirecting to login in 3 seconds...
                        </p>

                        <Link to="/login">
                            <DarkButton type="button">
                                Go to login
                            </DarkButton>
                        </Link>
                    </>
                )}
            </div>
        </AuthSplitLayout>
    );
};

export default ResetPasswordPage;
