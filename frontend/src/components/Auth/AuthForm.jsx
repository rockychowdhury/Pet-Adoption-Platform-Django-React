import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import DarkInput from './DarkInput';
import DarkButton from './DarkButton';
import SocialAuthButtons from './SocialAuthButtons';
import AuthToggle from './AuthToggle';
import { Link } from 'react-router-dom';
import { extractFieldErrors, validateRegistration } from '../../utils/validationUtils';
import { toast } from 'react-toastify';

const AuthForm = ({ initialMode = 'login', onSuccess }) => {
    const [mode, setMode] = useState(initialMode);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        termsAccepted: false
    });

    // Default showPassword to true for Registration as requested
    const [showPassword, setShowPassword] = useState(false);

    // Updates showPassword default when mode changes
    useEffect(() => {
        if (mode === 'register') {
            setShowPassword(true);
        } else {
            setShowPassword(false);
        }
    }, [mode]);

    const [isLoading, setIsLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({});


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear global error


        // Clear specific field error as user corrects it
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }


    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        setFieldErrors({});

        // Client-side Validation
        if (mode === 'register') {
            const clientErrors = validateRegistration(formData);
            if (Object.keys(clientErrors).length > 0) {
                setFieldErrors(clientErrors);
                // Show first error or all errors
                const errorMsg = Object.values(clientErrors).join(", ");
                toast.error(errorMsg);
                return;
            }
            if (!formData.termsAccepted) {
                toast.error("You must accept the terms.");
                return;
            }
        }

        setIsLoading(true);

        try {
            if (mode === 'login') {
                await login({ email: formData.email, password: formData.password });
                if (onSuccess) onSuccess();
                else navigate('/dashboard');
            } else {
                // Register
                await register({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    phone_number: ''
                });
                navigate('/verify-email', { state: { email: formData.email } });
                if (onSuccess) onSuccess({ preventRedirect: true });
            }
        } catch (err) {
            console.error(err);
            // Parse Backend Errors
            const backendFieldErrors = extractFieldErrors(err);
            if (Object.keys(backendFieldErrors).length > 0) {
                setFieldErrors(backendFieldErrors);
            }


        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Toggle */}
            <AuthToggle mode={mode} onToggle={setMode} />

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2 font-logo">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-text-secondary">
                    {mode === 'login'
                        ? 'Enter your details to access your account'
                        : 'Join our community of pet lovers today'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                    <div className="flex gap-4">
                        <DarkInput
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            error={fieldErrors.first_name}
                            required
                        />
                        <DarkInput
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            error={fieldErrors.last_name}
                            required
                        />
                    </div>
                )}

                <DarkInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    startIcon={<Mail size={20} className="text-text-tertiary" />}
                    error={fieldErrors.email}
                    required
                />

                <div className="relative">
                    <DarkInput
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={mode === 'register' ? "Create Password" : "Password"}
                        startIcon={<Lock size={20} className="text-text-tertiary" />}

                        error={fieldErrors.password}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Password Strength Text Removed - Handled by Input Border */}

                {mode === 'login' && (
                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">
                            Forgot Password?
                        </Link>
                    </div>
                )}

                {mode === 'register' && (
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                        />
                        <span className="text-sm text-text-secondary">
                            I agree to the <Link to="/terms" className="text-text-primary font-bold hover:underline">Terms</Link> and <Link to="/privacy" className="text-text-primary font-bold hover:underline">Privacy Policy</Link>
                        </span>
                    </label>
                )}



                <DarkButton type="submit" loading={isLoading}>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                </DarkButton>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-bg-surface text-text-secondary">Or continue with</span>
                    </div>
                </div>

                <SocialAuthButtons />
            </form>
        </div>
    );
};

export default AuthForm;
