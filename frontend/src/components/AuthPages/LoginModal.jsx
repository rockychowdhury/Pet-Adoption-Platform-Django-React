import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../common/Modal/Modal';
import Logo from '../common/Logo';
import Input from '../common/Form/Input';
import Button from '../common/Buttons/Button';
import Checkbox from '../common/Form/Checkbox';
import Alert from '../common/Feedback/Alert';

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
                <Alert variant="error" className="mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    className="w-full"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="w-full"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        endIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-text-tertiary hover:text-text-primary transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        }
                    />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Checkbox label="Remember me" />
                    <button type="button" className="text-sm font-semibold text-brand-secondary hover:text-brand-primary hover:underline transition-colors">
                        Forgot password?
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    isLoading={isLoading}
                >
                    Log In
                </Button>
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
