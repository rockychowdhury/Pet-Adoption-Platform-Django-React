import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthSplitLayout from '../../layouts/AuthSplitLayout';
import FeatureCarousel from '../../components/Auth/FeatureCarousel';
import DarkInput from '../../components/Auth/DarkInput';
import DarkButton from '../../components/Auth/DarkButton';
import SocialAuthButtons from '../../components/Auth/SocialAuthButtons';
import useAuth from '../../hooks/useAuth';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthSplitLayout carousel={<FeatureCarousel />}>
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-3">Welcome back</h1>
                    <p className="text-base font-normal text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-secondary font-medium transition-colors hover:text-brand-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <DarkInput
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
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
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors p-1"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded bg-bg-secondary border border-border checked:bg-brand-secondary checked:border-border-focus focus:ring-2 focus:ring-border-focus/20 cursor-pointer text-brand-secondary"
                            />
                            <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                                Remember me for 30 days
                            </span>
                        </label>
                        <Link to="/forgot-password" className="text-brand-secondary font-medium transition-colors hover:text-brand-primary hover:underline text-sm">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert-error">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <DarkButton type="submit" loading={isLoading}>
                        Log in
                    </DarkButton>

                    {/* Divider */}
                    <div className="divider">
                        <span className="divider-text">Or login with</span>
                    </div>

                    {/* Social Auth */}
                    <SocialAuthButtons />
                </form>
            </div>
        </AuthSplitLayout>
    );
};

export default LoginPage;
