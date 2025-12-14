import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LoginModal from '../components/AuthPages/LoginModal';
import RegisterModal from '../components/AuthPages/RegisterModal';
// Optional: Import a background image if available, else use CSS

const AuthPageLayout = ({ mode }) => {
    const navigate = useNavigate();
    const [loginOpen, setLoginOpen] = useState(mode === 'login');
    const [registerOpen, setRegisterOpen] = useState(mode === 'register');

    useEffect(() => {
        setLoginOpen(mode === 'login');
        setRegisterOpen(mode === 'register');
    }, [mode]);

    const handleClose = () => {
        setLoginOpen(false);
        setRegisterOpen(false);
        navigate('/'); // Redirect to home on close
    };

    const handleSwitchToRegister = () => {
        setLoginOpen(false);
        navigate('/register');
    };

    const handleSwitchToLogin = () => {
        setRegisterOpen(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen w-full bg-bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements to make it look nice */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"></div>

            {/* Modals are forced open based on route */}
            {mode === 'login' && (
                <LoginModal
                    isOpen={true}
                    onClose={handleClose}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            )}

            {mode === 'register' && (
                <RegisterModal
                    isOpen={true}
                    onClose={handleClose}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </div>
    );
};

export default AuthPageLayout;
