
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

import SearchBar from './SearchBar';

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

    const queryParams = new URLSearchParams(location.search);
    const currentSearch = queryParams.get('search') || '';
    const currentLocation = queryParams.get('location') || '';

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

    const handleSearch = ({ search, location: searchLocation, radius }) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (searchLocation) params.set('location', searchLocation);
        if (radius) params.set('radius', radius);

        const isPetsPage = location.pathname === '/pets';
        navigate(`/pets?${params.toString()}`, { replace: isPetsPage });
    };

    const showSearchBar = ['/pets', '/services'].includes(location.pathname);
    const showLocation = location.pathname.startsWith('/pets');

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-gray-100/50 h-24 flex items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-10 w-full">
                    <div className="flex justify-between items-center gap-8">

                        {/* Logo & Links (Left) */}
                        <div className="flex items-center gap-12">
                            <Link to="/" className="shrink-0">
                                <Logo />
                            </Link>

                            {/* Show Links on Left ONLY if Search Bar is Visible */}
                            {showSearchBar && (
                                <div className="hidden xl:flex items-center gap-8">
                                    <NavLink to="/pets" label="Find a Pet" active={isActive('/pets')} />
                                    <NavLink to="/services" label="Services" active={isActive('/services')} />
                                    <NavLink to="/about" label="About" active={isActive('/about')} />
                                </div>
                            )}
                        </div>

                        {/* Center Container: Search Bar OR Nav Links */}
                        <div className="hidden md:flex flex-1 justify-center max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                            {showSearchBar ? (
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder={
                                        location.pathname.startsWith('/services') ? "Search services..." :
                                            "Search by breed, name or personality..."
                                    }
                                    showLocation={showLocation}
                                    initialSearch={currentSearch}
                                    initialLocation={currentLocation}
                                />
                            ) : (
                                /* Show Links in Center if Search Bar is Hidden */
                                <div className="hidden md:flex items-center gap-8">
                                    <NavLink to="/pets" label="Find a Pet" active={isActive('/pets')} />
                                    <NavLink to="/services" label="Services" active={isActive('/services')} />
                                    <NavLink to="/about" label="About" active={isActive('/about')} />
                                </div>
                            )}
                        </div>

                        {/* Desktop Actions - Right */}
                        <div className="hidden md:flex items-center gap-4 shrink-0">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-gray-500 hover:bg-gray-50 transition-all"
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
                                        className="text-gray-500 hover:text-gray-800"
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
                                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 origin-top-right z-50">
                                                <div className="px-4 py-3 border-b border-gray-50">
                                                    <p className="text-sm font-bold text-gray-800">{user.first_name} {user.last_name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <DropdownLink to="/dashboard" icon={<User size={16} />} label="Dashboard" />
                                                    <DropdownLink to="/dashboard/profile" icon={<User size={16} />} label="My Profile" />
                                                    <DropdownLink to="/dashboard/my-pets" icon={<User size={16} />} label="My Pets" />

                                                    {/* Role-based links */}
                                                    {user.role === 'admin' && (
                                                        <DropdownLink to="/admin" icon={<User size={16} />} label="Admin Panel" />
                                                    )}
                                                    {user.role === 'service_provider' && (
                                                        <DropdownLink to="/provider/dashboard" icon={<User size={16} />} label="Provider Dashboard" />
                                                    )}
                                                    {user.role !== 'service_provider' && user.role !== 'admin' && (
                                                        <DropdownLink to="/become-provider" icon={<User size={16} />} label="Become a Provider" />
                                                    )}

                                                    <Link
                                                        to="/rehoming/create"
                                                        className="flex items-center gap-3 px-4 py-2.5 mx-2 my-1 text-sm text-[#2D5A41] bg-[#2D5A41]/5 rounded-xl hover:bg-[#2D5A41]/10 transition-all font-bold"
                                                    >
                                                        List a Pet
                                                    </Link>
                                                </div>
                                                <div className="border-t border-gray-50 mt-1 pt-1">
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
                                    <Button
                                        variant="ghost"
                                        onClick={() => openAuth('login')}
                                        className="font-bold text-gray-600 hover:text-gray-900"
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => openAuth('register')}
                                        className="bg-[#2D5A41] hover:bg-[#234532] shadow-sm"
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
                                className="p-2 text-gray-500"
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
                    <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 w-full shadow-xl p-4 flex flex-col gap-4 animate-fade-in">
                        <MobileNavLink to="/pets" label="Find a Pet" onClick={() => setIsMenuOpen(false)} active={isActive('/pets')} />
                        <MobileNavLink to="/services" label="Services" onClick={() => setIsMenuOpen(false)} active={isActive('/services')} />
                        <MobileNavLink to="/about" label="About" onClick={() => setIsMenuOpen(false)} active={isActive('/about')} />
                        {!user && (
                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                                <Button onClick={() => openAuth('login')} variant="outline">Log In</Button>
                                <Button onClick={() => openAuth('register')} variant="primary" className="bg-[#2D5A41]">Sign Up</Button>
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
