import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-[#FAF7F5] rounded-full flex items-center justify-center mb-4 text-brand-secondary">
                    <Lock size={24} />
                </div>
                <p className="text-text-secondary mb-6">Enter your details to access your account</p>

                {/* Toggle */}
                <div className="bg-[#FAF7F5] p-1 rounded-full flex w-full max-w-xs">
                    <button
                        onClick={onSwitchToRegister}
                        className="flex-1 py-2 rounded-full text-sm font-bold text-text-secondary hover:text-text-primary transition"
                    >
                        Sign Up
                    </button>
                    <button
                        className="flex-1 py-2 rounded-full text-sm font-bold bg-[#2D2D2D] text-white shadow-md transition"
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm mb-4 border border-red-100">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Email Address</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full pl-12 pr-4 py-3 bg-[#FAF7F5] rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition placeholder-gray-400"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Password</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full pl-12 pr-12 py-3 bg-[#FAF7F5] rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition placeholder-gray-400"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-secondary transition"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="flex justify-end mt-2">
                        <button type="button" className="text-xs font-bold text-text-secondary hover:text-brand-primary transition">
                            Forgot Password?
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#2D2D2D] text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg"
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 text-center text-text-secondary text-sm">
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="text-brand-secondary font-bold hover:underline">
                    Create Account
                </button>
            </div>
        </Modal>
    );
};

export default LoginModal;
