import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, User, LogOut, LayoutDashboard, Sun, Leaf } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import LoginModal from '../AuthPages/LoginModal';
import RegisterModal from '../AuthPages/RegisterModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find a Pet', path: '/pets' },
        { name: 'Community', path: '/community' },
        { name: 'About Us', path: '/about' },
    ];

    if (user) {
        navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    }

    const openLogin = () => { setShowLogin(true); setShowRegister(false); setIsOpen(false); };
    const openRegister = () => { setShowRegister(true); setShowLogin(false); setIsOpen(false); };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg-surface/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold font-logo tracking-tighter text-brand-primary flex items-center gap-2">
                        FurEver<span className="text-brand-secondary">Home</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-brand-secondary ${location.pathname === link.path ? 'text-brand-secondary font-bold' : 'text-text-primary'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth & Theme Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-text-primary hover:bg-bg-secondary transition"
                            title="Toggle Comfort Mode"
                        >
                            {theme === 'light' ? <Leaf size={20} /> : <Sun size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary font-bold">
                                        {user.first_name?.[0]}
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">{user.first_name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-text-secondary hover:text-status-error transition"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button onClick={openLogin} className="text-sm font-bold text-text-primary hover:text-brand-primary transition">
                                    Log In
                                </button>
                                <button onClick={openRegister} className="btn-primary h-10 px-6 text-sm">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-text-primary" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-bg-surface shadow-xl border-t border-border py-6 px-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-border" />
                        <div className="flex justify-between items-center">
                            <span className="text-text-primary">Theme</span>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-text-primary hover:bg-bg-secondary transition"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                        </div>
                        {user ? (
                            <button onClick={() => { logout(); setIsOpen(false) }} className="text-left text-status-error font-medium">Logout</button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <button onClick={openLogin} className="w-full py-3 text-center font-bold text-text-primary border border-border rounded-xl">
                                    Log In
                                </button>
                                <button onClick={openRegister} className="w-full py-3 text-center font-bold bg-brand-primary text-text-inverted rounded-xl">
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToRegister={openRegister} />
            <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onSwitchToLogin={openLogin} />
        </>
    );
};

export default Navbar;
