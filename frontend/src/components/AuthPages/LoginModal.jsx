import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2, Mail } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';
import Logo from '../common/Logo';
import DarkInput from '../Auth/DarkInput';
import DarkButton from '../Auth/DarkButton';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, error, setError } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(formData);
            onClose();
        } catch (err) {
            // Error is handled by useAuth
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center mb-6 pt-4">
                <div className="mb-4">
                    <Logo />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
                <p className="text-text-secondary">Log in to continue helping pets find homes</p>
            </div>

            {error && (
                <div className="alert-error mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <DarkInput
                        label="Email Address"
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        icon={Mail}
                    />
                </div>

                <div className="relative">
                    <DarkInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={Lock}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-primary transition p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border bg-bg-surface checked:bg-brand-secondary checked:border-border-focus focus:ring-2 focus:ring-border-focus/20 cursor-pointer text-brand-secondary"
                        />
                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-semibold text-brand-secondary hover:text-brand-primary hover:underline transition-colors">
                        Forgot password?
                    </button>
                </div>

                <DarkButton
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                    className="w-full mt-2"
                >
                    Log In
                </DarkButton>
            </form>

            <div className="divider">
                <span className="divider-text">Or</span>
            </div>

            <div className="text-center text-text-secondary text-sm">
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="text-brand-secondary font-bold hover:underline">
                    Sign up
                </button>
            </div>
        </Modal>
    );
};

export default LoginModal;
