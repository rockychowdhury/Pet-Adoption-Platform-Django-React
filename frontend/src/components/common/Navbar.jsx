
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X, Bell, MessageSquare, User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import Button from './Buttons/Button';
import IconButton from './Buttons/IconButton';
import Avatar from './Display/Avatar';
import AuthModal from '../Auth/AuthModal';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Auth Modal State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const openAuth = (mode = 'login') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
        setIsMenuOpen(false); // Close mobile menu if open
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className="bg-bg-surface/95 backdrop-blur-3xl fixed top-0 left-0 w-full z-50 border-b border-border/40 border-black/10 transition-all duration-500 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        {/* Logo */}
                        <Link to="/">
                            <Logo />
                        </Link>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden md:flex items-center gap-1 bg-bg-secondary/40 p-1.5 rounded-full transition-all duration-300">
                            <NavLink to="/" label="Home" active={isActive('/')} />
                            <NavLink to="/adopt" label="Find a Pet" active={isActive('/adopt')} />
                            <NavLink to="/services" label="Services" active={isActive('/services')} />
                            <NavLink to="/community" label="Community" active={isActive('/community')} />
                            <NavLink to="/about" label="About" active={isActive('/about')} />
                        </div>

                        {/* Desktop Actions - Right */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full bg-bg-secondary hover:bg-bg-secondary/80 text-text-secondary hover:text-text-primary transition-all duration-300"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            {user ? (
                                <>
                                    <div className="flex items-center gap-1.5 p-1 bg-bg-secondary/40 rounded-full border border-border/30 border-black/10">
                                        <IconButton
                                            icon={<MessageSquare size={19} />}
                                            variant="ghost"
                                            label="Messages"
                                            onClick={() => navigate('/messages')}
                                            className="text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-all duration-300 w-9 h-9"
                                        />
                                        <IconButton
                                            icon={<Bell size={19} />}
                                            variant="ghost"
                                            label="Notifications"
                                            className="text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-all duration-300 w-9 h-9"
                                        />
                                    </div>

                                    {/* Profile Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-bg-secondary transition-all duration-300 group hover:ring-2 hover:ring-brand-primary/20"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <Avatar
                                                    initials={user.first_name ? user.first_name[0] : 'U'}
                                                    photoURL={user.photoURL}
                                                    size="sm"
                                                    className="w-8 h-8 text-sm border border-border/10 group-hover:border-brand-primary/30 transition-all duration-300 shadow-sm"
                                                />
                                            </div>
                                            <ChevronDown size={14} className={`text-text-secondary transition-transform duration-300 mr-1.5 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-3 w-56 bg-bg-surface rounded-2xl shadow-xl border border-border py-2 animate-fade-in origin-top-right z-50">
                                                <div className="px-4 py-3 border-b border-border">
                                                    <p className="text-sm font-bold text-text-primary">{user.first_name} {user.last_name}</p>
                                                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <DropdownLink to="/dashboard" icon={<User size={16} />} label="Dashboard" />
                                                    <DropdownLink to="/dashboard/profile" icon={<User size={16} />} label="My Profile" />
                                                    <DropdownLink to="/dashboard/my-pets" icon={<User size={16} />} label="My Pets" />
                                                    <Link
                                                        to="/rehoming/create"
                                                        className="flex items-center gap-3 px-4 py-2.5 mx-2 my-1 text-sm text-brand-primary bg-brand-primary/10 rounded-xl hover:bg-brand-primary/20 transition-all duration-300 font-bold"
                                                    >
                                                        List a Pet
                                                    </Link>
                                                </div>
                                                <div className="border-t border-border mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-status-error hover:bg-status-error/10 transition-colors duration-300 text-left"
                                                    >
                                                        <LogOut size={16} />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => openAuth('login')}
                                        className="font-bold text-text-secondary hover:text-text-primary transition-colors duration-300"
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => openAuth('register')}
                                        className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            {/* Mobile Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full bg-bg-secondary text-text-secondary"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <IconButton
                                icon={isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                variant="ghost"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                label="Menu"
                                className="text-text-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-bg-surface border-t border-border absolute w-full left-0 animate-slide-down shadow-xl h-screen">
                        <div className="px-4 py-6 space-y-4">
                            <MobileNavLink to="/" label="Home" onClick={() => setIsMenuOpen(false)} active={isActive('/')} />
                            <MobileNavLink to="/adopt" label="Find a Pet" onClick={() => setIsMenuOpen(false)} active={isActive('/adopt')} />
                            <MobileNavLink to="/services" label="Services" onClick={() => setIsMenuOpen(false)} active={isActive('/services')} />
                            <MobileNavLink to="/community" label="Community" onClick={() => setIsMenuOpen(false)} active={isActive('/community')} />
                            <MobileNavLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} active={isActive('/about')} />

                            <div className="border-t border-border my-4 pt-4">
                                {user ? (
                                    <>
                                        <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setIsMenuOpen(false)} active={isActive('/dashboard')} />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-status-error font-bold hover:bg-status-error/10 rounded-xl transition-all duration-300"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => openAuth('login')}
                                            className="w-full justify-center"
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => openAuth('register')}
                                            className="w-full justify-center"
                                        >
                                            Sign Up
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav >

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

// Helper Components
const NavLink = ({ to, label, active }) => (
    <Link
        to={to}
        className={`relative px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ease-out font-jakarta ${active
            ? 'bg-brand-primary/10 text-brand-primary'
            : 'text-text-secondary/70 hover:text-text-primary hover:bg-bg-secondary'
            }`}
    >
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, onClick, active }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`block px-4 py-3 text-lg font-black rounded-xl transition-all duration-300 ${active
            ? 'bg-bg-secondary text-text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
            }`}
    >
        {label}
    </Link>
);

const DropdownLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors duration-200"
    >
        {icon}
        {label}
    </Link>
);

export default Navbar;
