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
                            ? 'border-brand-secondary bg-brand-secondary/5 text-brand-secondary'
                            : 'border-border text-text-secondary hover:border-gray-300'
                            }`}
                    >
                        <span>🐶</span>
                        Adopter
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'shelter' })}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-bold flex flex-col items-center gap-2 ${formData.role === 'shelter'
                            ? 'border-brand-secondary bg-brand-secondary/5 text-brand-secondary'
                            : 'border-border text-text-secondary hover:border-gray-300'
                            }`}
                    >
                        <span>🏠</span>
                        Shelter
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">
                            {formData.role === 'shelter' ? 'Shelter Name' : 'First Name'}
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            required
                            className="input-field"
                            placeholder={formData.role === 'shelter' ? "Happy Paws" : "John"}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="label">
                            {formData.role === 'shelter' ? 'Representative' : 'Last Name'}
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            required
                            className="input-field"
                            placeholder={formData.role === 'shelter' ? "Manager" : "Doe"}
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label className="label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="input-field"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="label">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="input-field pr-10"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-secondary"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn-primary w-full"
                >
                    {formData.role === 'shelter' ? 'Register Shelter' : 'Create Account'}
                </button>
            </form>
            <div className="mt-6 text-center text-text-secondary text-sm">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="text-brand-secondary font-bold hover:underline">
                    Login
                </button>
            </div>
        </Modal>
    );
};

export default RegisterModal;
