import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    CalendarDays,
    CalendarOff,
    User,
    Star,
    TrendingUp,
    Settings,
    PawPrint,
    LogOut,
    Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';

const Sidebar = ({ activeView, onViewChange, isMobileOpen, setIsMobileOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
        { id: 'availability', label: 'Availability', icon: CalendarOff },
        { id: 'bookings', label: 'Bookings', icon: Calendar, badge: 3 },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    ];

    const handleNavigation = (viewId) => {
        onViewChange(viewId);
        if (window.innerWidth < 1024) {
            setIsMobileOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col
            `}>
                {/* Logo Area */}
                <div className="px-6 py-6 flex items-center gap-2 border-b border-gray-100 lg:border-none">
                    <div className="bg-teal-600 p-1.5 rounded-lg">
                        <PawPrint className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">PetConnect</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
                    {menuItems.map((item) => {
                        const isActive = activeView === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`
                                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors 
                                    ${isActive
                                        ? 'bg-blue-50 text-brand-primary'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} className={isActive ? 'text-brand-primary' : 'text-gray-400'} />
                                    {item.label}
                                </div>
                                {item.badge && (
                                    <span className="bg-teal-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-4 mt-auto space-y-2 border-t border-gray-100">
                    <button
                        onClick={() => handleNavigation('settings')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <Settings size={20} className="text-gray-400" />
                        Settings
                    </button>

                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-brand-primary transition">
                        <Home size={20} className="text-gray-400" />
                        Return to Home
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
