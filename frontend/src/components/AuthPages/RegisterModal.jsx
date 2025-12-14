import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Phone, AlertCircle, Loader2, Check, X as XIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal';
import { useNavigate } from 'react-router';
import Logo from '../common/Logo';
import DarkInput from '../Auth/DarkInput';
import DarkButton from '../Auth/DarkButton';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, error, setError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        role: 'adopter',
        termsAccepted: false
    });

    const [localError, setLocalError] = useState('');

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });

    useEffect(() => {
        validatePassword(formData.password);
    }, [formData.password]);

    const validatePassword = (pwd) => {
        const criteria = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[^A-Za-z0-9]/.test(pwd)
        };
        setPasswordCriteria(criteria);

        const metCount = Object.values(criteria).filter(Boolean).length;
        setPasswordStrength(metCount); // 0 to 4
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (localError) setLocalError('');
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setError(null);

        // Custom Validations
        if (!formData.first_name.trim()) return setLocalError("First name is required");
        if (!formData.last_name.trim()) return setLocalError("Last name is required");
        if (!formData.email.trim()) return setLocalError("Email is required");
        if (!formData.phone_number.trim()) return setLocalError("Phone number is required");

        if (formData.password !== formData.confirm_password) {
            return setLocalError("Passwords must match");
        }

        if (passwordStrength < 4) {
            return setLocalError("Please meet all password requirements");
        }

        setIsLoading(true);
        try {
            await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number,
                password: formData.password,
                role: formData.role
            });
            onClose();
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            // Error handled by useAuth but we check here too if needed
        } finally {
            setIsLoading(false);
        }
    };

    const displayedError = localError || error;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col mb-6">
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <Logo />
                        <p className="text-sm font-medium text-brand-secondary mt-1">Find loving homes for pets in need</p>
                    </div>
                    <button onClick={onSwitchToLogin} className="text-sm text-text-secondary hover:text-brand-primary font-medium">
                        Already have an account? <span className="underline">Log in</span>
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Create Your Account</h2>
                    <p className="text-text-secondary text-sm">Join our community of responsible pet lovers</p>
                </div>

                {displayedError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm mb-4 border border-red-100 animate-fade-in">
                        <AlertCircle size={16} />
                        {displayedError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DarkInput
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                        />
                        <DarkInput
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                        />
                    </div>

                    <div className="relative">
                        <DarkInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            icon={Mail}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <DarkInput
                                label="Phone Number"
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                icon={Phone}
                                required
                            />
                        </div>
                        <p className="text-[10px] text-text-secondary">We'll send you a verification code</p>
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <DarkInput
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                icon={Lock}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-text-secondary hover:text-text-primary"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Password Strength Meter */}
                        {formData.password && (
                            <div className="space-y-2 mt-2">
                                <div className="flex gap-1 h-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-full transition-colors duration-300 ${i < passwordStrength
                                                ? passwordStrength <= 2 ? 'bg-orange-400' : 'bg-green-500' // Weak/Medium vs Strong
                                                : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-text-secondary">
                                    <div className={`flex items-center gap-1 ${passwordCriteria.length ? 'text-green-600' : ''}`}>
                                        {passwordCriteria.length ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />} Minimum 8 characters
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordCriteria.uppercase ? 'text-green-600' : ''}`}>
                                        {passwordCriteria.uppercase ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />} At least one uppercase letter
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordCriteria.number ? 'text-green-600' : ''}`}>
                                        {passwordCriteria.number ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />} At least one number
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordCriteria.special ? 'text-green-600' : ''}`}>
                                        {passwordCriteria.special ? <Check size={10} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />} At least one special character
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <DarkInput
                            label="Confirm Password"
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            icon={Lock}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-bg-surface checked:border-brand-primary checked:bg-brand-primary transition-all"
                                />
                                <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-xs text-text-secondary leading-tight pt-0.5 group-hover:text-text-primary transition-colors">
                                I agree to the <a href="#" className="font-bold underline hover:text-brand-secondary">Terms of Service</a> and <a href="#" className="font-bold underline hover:text-brand-secondary">Privacy Policy</a>
                            </span>
                        </label>
                    </div>

                    <DarkButton
                        type="submit"
                        disabled={isLoading || !formData.termsAccepted}
                        loading={isLoading}
                        className="w-full mt-4"
                    >
                        Create Account
                    </DarkButton>
                </form>
            </div>
        </Modal>
    );
};

export default RegisterModal;
