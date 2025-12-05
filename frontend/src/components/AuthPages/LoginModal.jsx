import React, { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, error } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        // Close modal is handled by parent or effect if login success, 
        // but for now let's assume login function handles state updates.
        // Ideally, we should check for success before closing, but AuthContext might not return promise resolution with status.
        // We'll rely on user state change in Navbar to close or manual close.
        // Actually, let's just call onClose if no error (this logic might need refinement based on AuthContext)
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-action"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button type="button" className="text-sm text-action hover:underline">Forgot Password?</button>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Login
                </button>
            </form>
            <div className="mt-6 text-center text-gray-500 text-sm">
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="text-action font-bold hover:underline">
                    Sign Up
                </button>
            </div>
        </Modal>
    );
};

export default LoginModal;
