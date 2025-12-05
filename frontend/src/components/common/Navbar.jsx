import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Heart, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

import LoginModal from '../AuthPages/LoginModal';
import RegisterModal from '../AuthPages/RegisterModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find a Pet', path: '/pets' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const openLogin = () => { setShowLogin(true); setShowRegister(false); setIsOpen(false); };
    const openRegister = () => { setShowRegister(true); setShowLogin(false); setIsOpen(false); };

    return (
        <>
            <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled || location.pathname !== '/' ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold font-logo text-natural flex items-center">
                        FurEver<span className="text-action">Home</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`font-medium hover:text-action transition ${scrolled || location.pathname !== '/' ? 'text-gray-600' : 'text-gray-800'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/user/profile" className="p-2 rounded-full hover:bg-gray-100 transition">
                                    <User size={20} className="text-gray-600" />
                                </Link>
                                <button onClick={logout} className="px-5 py-2 rounded-full bg-action text-white font-semibold hover:bg-action_dark transition">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={openLogin} className={`font-medium hover:text-action transition ${scrolled || location.pathname !== '/' ? 'text-gray-600' : 'text-gray-800'}`}>
                                    Login
                                </button>
                                <button onClick={openRegister} className="px-5 py-2 rounded-full bg-action text-white font-semibold hover:bg-action_dark transition shadow-md hover:shadow-lg">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg py-4 px-6 flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-600 font-medium hover:text-action"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr />
                        {user ? (
                            <>
                                <Link to="/user/profile" className="text-gray-600 font-medium hover:text-action" onClick={() => setIsOpen(false)}>
                                    Profile
                                </Link>
                                <button onClick={() => { logout(); setIsOpen(false) }} className="text-left text-action font-semibold">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={openLogin} className="text-left text-gray-600 font-medium hover:text-action">
                                    Login
                                </button>
                                <button onClick={openRegister} className="text-left text-action font-semibold">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={openRegister}
            />
            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={openLogin}
            />
        </>
    );
};

export default Navbar;
