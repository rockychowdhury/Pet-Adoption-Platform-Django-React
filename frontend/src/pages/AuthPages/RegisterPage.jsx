import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import DarkInput from '../../components/Auth/DarkInput';
import DarkButton from '../../components/Auth/DarkButton';
import SocialAuthButtons from '../../components/Auth/SocialAuthButtons';
import useAuth from '../../hooks/useAuth';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'adopter' // default role
    });

    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }

        // Check password strength
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
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

    const validateForm = () => {
        const newErrors = {};

        if (formData.first_name.length < 2) {
            newErrors.first_name = 'First name must be at least 2 characters';
        }

        if (formData.last_name.length < 2) {
            newErrors.last_name = 'Last name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Include at least one uppercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Include at least one number';
        } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
            newErrors.password = 'Include at least one special character';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await register(formData);
            // Navigate to email verification page
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            console.error('Registration failed:', err);
            setErrors({ submit: err.response?.data?.detail || 'Registration failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength === 'weak') return 'var(--color-status-error)';
        if (passwordStrength === 'medium') return 'var(--color-status-warning)';
        if (passwordStrength === 'strong') return 'var(--color-status-success)';
        return 'var(--color-border)';
    };

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            {/* Registration Form */}
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-3">Create an account</h1>
                    <p className="text-base font-normal text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-secondary font-medium transition-colors hover:text-brand-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Fields - Side by side */}
                    <div className="flex gap-4">
                        <DarkInput
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First name"
                            error={errors.first_name}
                            required
                        />
                        <DarkInput
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last name"
                            error={errors.last_name}
                            required
                        />
                    </div>

                    {/* Email */}
                    <DarkInput
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        error={errors.email}
                        required
                    />

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <DarkInput
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={errors.password}
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

                        {/* Password Strength Indicator */}
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
                                <p className="text-xs text-text-tertiary">
                                    Must have 8+ characters, uppercase, number, and special character
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Terms & Conditions */}
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded bg-bg-secondary border border-border checked:bg-brand-secondary checked:border-border-focus focus:ring-2 focus:ring-border-focus/20 cursor-pointer text-brand-secondary"
                            />
                            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                I agree to the{' '}
                                <Link to="/terms" className="text-brand-secondary font-medium transition-colors hover:text-brand-primary hover:underline" target="_blank">
                                    Terms & Conditions
                                </Link>
                            </span>
                        </label>
                        {errors.terms && <p className="text-status-error text-sm mt-1 font-medium">{errors.terms}</p>}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="alert-error">
                            {errors.submit}
                        </div>
                    )}

                    {/* Submit Button */}
                    <DarkButton
                        type="submit"
                        loading={isLoading}
                        disabled={!agreedToTerms}
                    >
                        Create account
                    </DarkButton>

                    {/* Divider */}
                    <div className="divider">
                        <span className="divider-text">Or register with</span>
                    </div>

                    {/* Social Auth */}
                    <SocialAuthButtons />
                </form>
            </div>
        </AuthSplitLayout>
    );
};

export default RegisterPage;
