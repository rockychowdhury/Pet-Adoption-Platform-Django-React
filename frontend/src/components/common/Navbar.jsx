import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Fixed import: 'react-router' -> 'react-router-dom'
import logo from '../../assets/logo.jpg';
import { Menu, X, Bell, MessageSquare, User, LogOut, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-brand-primary/10 p-2 rounded-xl group-hover:bg-brand-primary/20 transition-colors">
                            <img src={logo} alt="PetCircle Logo" className="w-20 h-20 object-contain" />
                        </div>
                    </Link>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden md:flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-full border border-gray-100/50">
                        <NavLink to="/" label="Home" active />
                        <NavLink to="/rehoming" label="Find a Pet" />
                        <NavLink to="/services" label="Services" />
                        <NavLink to="/community" label="Community" />
                        <NavLink to="/about" label="About" />
                    </div>

                    {/* Desktop Actions - Right */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard/messages" className="relative p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-all">
                                    <MessageSquare size={20} />
                                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
                                </Link>
                                <button className="relative p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-all">
                                    <Bell size={20} />
                                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-brand-primary/30 hover:bg-gray-50 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                                            {user.first_name ? user.first_name[0] : 'U'}
                                        </div>
                                        <ChevronDown size={14} className={`text-text-secondary transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in origin-top-right">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-bold text-text-primary">{user.first_name} {user.last_name}</p>
                                                <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <DropdownLink to="/dashboard" icon={<User size={16} />} label="Dashboard" />
                                                <DropdownLink to="/dashboard/profile" icon={<User size={16} />} label="My Profile" />
                                                <DropdownLink to="/dashboard/my-pets" icon={<User size={16} />} label="My Pets" />
                                                <Link
                                                    to="/rehoming/create"
                                                    className="flex items-center gap-3 px-4 py-2.5 mx-2 my-1 text-sm text-brand-primary bg-brand-primary/5 rounded-xl hover:bg-brand-primary/10 transition-colors font-medium"
                                                >
                                                    List a Pet
                                                </Link>
                                            </div>
                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-text-primary px-4 py-2 hover:bg-gray-50 rounded-full transition-all">
                                    Log In
                                </Link>
                                <Link to="/register" className="px-6 py-2.5 bg-brand-primary text-text-inverted text-sm font-bold rounded-full hover:opacity-90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-slide-down shadow-xl">
                    <div className="px-4 py-6 space-y-4">
                        <MobileNavLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink to="/rehoming" label="Find a Pet" onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink to="/services" label="Services" onClick={() => setIsMenuOpen(false)} />
                        <MobileNavLink to="/community" label="Community" onClick={() => setIsMenuOpen(false)} />

                        <div className="border-t border-gray-100 my-4 pt-4">
                            {user ? (
                                <>
                                    <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setIsMenuOpen(false)} />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3 text-center font-bold text-text-secondary border border-gray-200 rounded-xl hover:bg-gray-50"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full py-3 text-center font-bold text-white bg-brand-primary rounded-xl"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Helper Components
const NavLink = ({ to, label, active }) => (
    <Link
        to={to}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${active
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
            }`}
    >
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-3 text-lg font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-xl transition-colors"
    >
        {label}
    </Link>
);

const DropdownLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors"
    >
        {icon}
        {label}
    </Link>
);

export default Navbar;
