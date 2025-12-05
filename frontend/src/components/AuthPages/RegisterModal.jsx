import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, error } = useAuth();
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
        await register(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Role Selection */}
                <div className="flex gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'adopter' })}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-bold flex flex-col items-center gap-2 ${formData.role === 'adopter'
                            ? 'border-action bg-action/5 text-action'
                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                            }`}
                    >
                        <span>🐶</span>
                        Adopter
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'shelter' })}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-bold flex flex-col items-center gap-2 ${formData.role === 'shelter'
                            ? 'border-action bg-action/5 text-action'
                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                            }`}
                    >
                        <span>🏠</span>
                        Shelter
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {formData.role === 'shelter' ? 'Shelter Name' : 'First Name'}
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder={formData.role === 'shelter' ? "Happy Paws" : "John"}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {formData.role === 'shelter' ? 'Representative' : 'Last Name'}
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-action focus:ring-2 focus:ring-action/20 outline-none transition"
                            placeholder={formData.role === 'shelter' ? "Manager" : "Doe"}
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
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
                <button
                    type="submit"
                    className="w-full py-3 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {formData.role === 'shelter' ? 'Register Shelter' : 'Create Account'}
                </button>
            </form>
            <div className="mt-6 text-center text-gray-500 text-sm">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="text-action font-bold hover:underline">
                    Login
                </button>
            </div>
        </Modal>
    );
};

export default RegisterModal;
