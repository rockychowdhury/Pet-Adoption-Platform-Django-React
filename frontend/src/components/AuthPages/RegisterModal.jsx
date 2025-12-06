import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, Loader2, Heart, Home, Github, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, error } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'adopter'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            onClose();
        } catch (err) {
            // Error handled by useAuth
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Join FurEver Home">
            <div className="flex flex-col items-center mb-4">
                <p className="text-text-secondary mb-4 text-sm">Create an account to start your journey.</p>

                {/* Toggle */}
                <div className="bg-[#FAF7F5] p-1 rounded-full flex w-full max-w-xs">
                    <button
                        className="flex-1 py-1.5 rounded-full text-xs font-bold bg-[#2D2D2D] text-white shadow-md transition"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={onSwitchToLogin}
                        className="flex-1 py-1.5 rounded-full text-xs font-bold text-text-secondary hover:text-text-primary transition"
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-2 rounded-xl flex items-center gap-2 text-xs mb-3 border border-red-100">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'adopter' })}
                        className={`p-3 rounded-[20px] border-2 transition flex flex-col items-center text-center gap-2 ${formData.role === 'adopter'
                            ? 'border-[#D4C4B5] bg-[#FFF8F3] text-[#2D2D2D]'
                            : 'border-[#FAF7F5] bg-[#FAF7F5] text-text-secondary hover:border-gray-200'
                            }`}
                    >
                        <Heart size={20} className={formData.role === 'adopter' ? "text-[#2D2D2D]" : "text-text-secondary"} />
                        <div>
                            <span className="font-bold block text-sm">Adopter</span>
                            <span className="text-[10px] text-text-secondary font-medium mt-0.5 block leading-tight">Find and follow pets you love</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'shelter' })}
                        className={`p-3 rounded-[20px] border-2 transition flex flex-col items-center text-center gap-2 ${formData.role === 'shelter'
                            ? 'border-[#D4C4B5] bg-[#FFF8F3] text-[#2D2D2D]'
                            : 'border-[#FAF7F5] bg-[#FAF7F5] text-text-secondary hover:border-gray-200'
                            }`}
                    >
                        <Home size={20} className={formData.role === 'shelter' ? "text-[#2D2D2D]" : "text-text-secondary"} />
                        <div>
                            <span className="font-bold block text-sm">Shelter</span>
                            <span className="text-[10px] text-text-secondary font-medium mt-0.5 block leading-tight">List pets & manage requests</span>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">
                            {formData.role === 'shelter' ? 'Shelter Name' : 'First Name'}
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                                <User size={16} />
                            </div>
                            <input
                                type="text"
                                name="first_name"
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F5] rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition placeholder-gray-400"
                                placeholder={formData.role === 'shelter' ? "Happy Paws" : "John"}
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">
                            {formData.role === 'shelter' ? 'Representative' : 'Last Name'}
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                                <User size={16} />
                            </div>
                            <input
                                type="text"
                                name="last_name"
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F5] rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition placeholder-gray-400"
                                placeholder={formData.role === 'shelter' ? "Manager" : "Doe"}
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">Email Address</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Mail size={16} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F5] rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition placeholder-gray-400"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">Password</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Lock size={16} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F5] rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition placeholder-gray-400"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-secondary transition"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-1.5 font-medium">Use at least 8 characters with a mix of letters and numbers.</p>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#2D2D2D] text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg text-sm"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : (formData.role === 'shelter' ? 'Register Shelter' : 'Create Account')}
                </button>
            </form>

            <div className="mt-4 space-y-4">
                <button className="w-full py-2.5 border-2 border-[#E5E0D8] rounded-xl font-bold text-text-primary hover:bg-[#FAF7F5] transition flex items-center justify-center gap-2 text-sm">
                    <Github size={18} /> Continue with GitHub
                </button>

                <div className="text-center pt-1">
                    <p className="text-xs text-text-secondary">
                        Already have an account? <button onClick={onSwitchToLogin} className="text-[#8B7355] font-bold hover:underline">Sign In</button>
                    </p>
                    <p className="text-[10px] text-text-secondary mt-3">
                        By continuing, you agree to our <span className="font-bold">Terms</span> and <span className="font-bold">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default RegisterModal;
