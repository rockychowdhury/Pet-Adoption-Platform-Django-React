
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Menu, X, Bell, LayoutDashboard, User, PawPrint, Settings as SettingsIcon, LogOut, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useServices from '../../hooks/useServices';
import { useTheme } from '../../context/ThemeContext';
import Button from './Buttons/Button';
import IconButton from './Buttons/IconButton';
import Avatar from './Display/Avatar';
import AuthModal from '../Auth/AuthModal';
import NavLink from './Navigation/NavLink';
import MobileNavLink from './Navigation/MobileNavLink';
import DropdownLink from './Navigation/DropdownLink';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Auth Modal State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const { user, logout } = useAuth();
    const { useGetMyProviderProfile } = useServices();
    // Only fetch if user logged in and not already a provider (optimization)
    const { data: providerProfile } = useGetMyProviderProfile();

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
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[100] bg-bg-surface border-b border-border/50 h-24 flex items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-10 w-full">
                    <div className="flex justify-between items-center gap-8">

                        {/* Logo & Links (Left) */}
                        <div className="flex items-center gap-12">
                            <Link to="/" className="shrink-0">
                                <Logo />
                            </Link>
                        </div>

                        {/* Center Container: Nav Links */}
                        <div className="hidden md:flex flex-1 justify-center max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                            <div className="hidden md:flex items-center gap-8">
                                {user?.role !== 'service_provider' && <NavLink to="/pets" label="Find a Pet" active={isActive('/pets')} />}
                                <NavLink to="/services" label="Services" active={isActive('/services')} />
                                <NavLink to="/about" label="About" active={isActive('/about')} />
                            </div>
                        </div>

                        {/* Desktop Actions - Right */}
                        <div className="hidden md:flex items-center gap-4 shrink-0">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-text-secondary hover:bg-bg-secondary transition-all"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {user ? (
                                <div className="flex items-center justify-center gap-4">
                                    <IconButton
                                        icon={<Bell size={20} />}
                                        variant="ghost"
                                        label="Notifications"
                                        className="text-text-secondary hover:text-text-primary"
                                    />

                                    {/* Profile Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center justify-center"
                                        >
                                            <Avatar
                                                initials={user.first_name ? user.first_name[0] : 'U'}
                                                src={user.photoURL || user.profile_image}
                                                size="md"
                                                className="w-full h-full object-cover object-center shadow-sm"
                                            />
                                        </button>

                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-3 w-56 bg-bg-surface rounded-2xl shadow-xl border border-border py-2 origin-top-right z-50">
                                                <div className="px-4 py-3 border-b border-border/50">
                                                    <p className="text-sm font-bold text-text-primary">{user.first_name} {user.last_name}</p>
                                                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    {user.role === 'service_provider' ? (
                                                        <DropdownLink to="/provider/dashboard" icon={<LayoutDashboard size={16} />} label="Provider Dashboard" />
                                                    ) : (
                                                        <DropdownLink to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
                                                    )}

                                                    <DropdownLink to="/dashboard/profile" icon={<User size={16} />} label="My Profile" />
                                                    <DropdownLink to="/dashboard/my-pets" icon={<PawPrint size={16} />} label="My Pets" />

                                                    {/* Role-based links */}
                                                    {user.role === 'admin' && (
                                                        <DropdownLink to="/admin" icon={<SettingsIcon size={16} />} label="Admin Panel" />
                                                    )}

                                                    {user.role !== 'service_provider' && user.role !== 'admin' && (
                                                        <>
                                                            {/* Provider Status Logic */}
                                                            {providerProfile?.application_status === 'draft' ? (
                                                                <DropdownLink to="/become-provider" icon={<User size={16} />} label="Finish Application" />
                                                            ) : providerProfile?.application_status === 'submitted' ? (
                                                                <DropdownLink to="/become-provider" icon={<User size={16} />} label="Application Pending" />
                                                            ) : (
                                                                <DropdownLink to="/become-provider" icon={<User size={16} />} label="Become a Provider" />
                                                            )}

                                                            <Link
                                                                to="/rehoming/create"
                                                                className="flex items-center gap-3 px-4 py-2.5 mx-2 my-1 text-sm text-brand-primary bg-brand-primary/10 rounded-xl hover:bg-brand-primary/20 transition-all font-bold"
                                                            >
                                                                List a Pet
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="border-t border-border/50 mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-status-error hover:bg-bg-secondary transition-colors text-left"
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
                                    <Button
                                        variant="ghost"
                                        onClick={() => openAuth('login')}
                                        className="font-bold text-text-secondary hover:text-text-primary"
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => openAuth('register')}
                                        className="shadow-sm"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-text-secondary"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <IconButton
                                icon={isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                variant="ghost"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                label="Menu"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu (simplified for now) */}
                {isMenuOpen && (
                    <div className="md:hidden bg-bg-surface border-t border-border/50 absolute top-full left-0 w-full shadow-xl p-4 flex flex-col gap-4 animate-fade-in">
                        <MobileNavLink to="/pets" label="Find a Pet" onClick={() => setIsMenuOpen(false)} active={isActive('/pets')} />
                        <MobileNavLink to="/services" label="Services" onClick={() => setIsMenuOpen(false)} active={isActive('/services')} />
                        <MobileNavLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} active={isActive('/about')} />
                        {!user && (
                            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                                <Button onClick={() => openAuth('login')} variant="outline">Log In</Button>
                                <Button onClick={() => openAuth('register')} variant="primary">Sign Up</Button>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Navbar;
