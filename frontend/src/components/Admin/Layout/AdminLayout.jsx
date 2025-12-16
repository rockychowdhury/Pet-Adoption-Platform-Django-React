import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, List, Flag, Shield, BarChart2, Settings, LogOut, Bell } from 'lucide-react';
import Button from '../../common/Buttons/Button';
import useAuth from '../../../hooks/useAuth';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/listings/pending', icon: List, label: 'Listings' },
        { path: '/admin/reports', icon: Flag, label: 'Reports' },
        { path: '/admin/verifications', icon: Shield, label: 'Verifications' },
        { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1a1c23] text-white flex-shrink-0 flex flex-col fixed h-full z-30">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">PC</span>
                    </div>
                    <span className="font-bold text-lg font-merriweather">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                ${isActive
                                    ? 'bg-brand-primary text-white font-medium shadow-lg shadow-brand-primary/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-800">
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                ${isActive ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                            `}
                        >
                            <Settings size={20} />
                            Settings
                        </NavLink>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    <div className="mt-4 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                            {/* Placeholder avatar */}
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold">AD</div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.username || 'Admin User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper - Offset for sidebar */}
            <div className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 font-merriweather">
                        Overview
                    </h2>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>
                        <Button variant="outline" size="sm">
                            View Live Site
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
