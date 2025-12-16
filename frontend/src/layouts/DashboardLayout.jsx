import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import {
    LayoutDashboard,
    PawPrint,
    FileText,
    Settings as SettingsIcon,
    LogOut,
    User,
    MessageSquare,
    Star,
    FolderOpen,
    Home
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Logo from '../components/common/Logo';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // Sidebar navigation based on UI spec:
    // Dashboard, My Pets, My Listings, Applications, Messages, Reviews, Settings
    const dashboardLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Pets', path: '/dashboard/my-pets', icon: PawPrint },
        // Reuse rehoming manage page as "My Listings"
        { name: 'My Listings', path: '/dashboard/rehoming/manage', icon: FileText },
        // Applications focuses on adopter applications view
        { name: 'Applications', path: '/dashboard/applications', icon: FolderOpen },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
        // Placeholder route for user reviews section
        { name: 'Reviews', path: '/dashboard/reviews', icon: Star },
        // Route closest to account settings / profile
        { name: 'Settings', path: '/dashboard/profile/settings', icon: SettingsIcon },
    ];

    return (
        <div className="min-h-screen bg-bg-primary flex font-inter">
            {/* Sidebar */}
            <aside className="w-72 bg-bg-surface border-r border-border hidden md:flex flex-col fixed h-full z-10">
                {/* User header */}
                <div className="px-6 pt-8 pb-6 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-bg-secondary overflow-hidden border-4 border-bg-primary shadow-md">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt={user.first_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-secondary font-bold text-xl">
                                {user?.first_name?.[0] || '?'}
                            </div>
                        )}
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-semibold text-text-primary">
                            {user?.first_name} {user?.last_name}
                        </p>
                        {/* Simple badge row to mirror UI design (email / phone / id / pet owner) */}
                        <div className="flex items-center justify-center gap-1 text-[10px] text-text-tertiary">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bg-secondary">
                                ✉
                            </span>
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bg-secondary">
                                ☎
                            </span>
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bg-secondary">
                                🛡
                            </span>
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bg-secondary">
                                🐾
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {dashboardLinks.map((link) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                                    ? 'bg-brand-secondary text-text-inverted'
                                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                    }`}
                            >
                                <link.icon size={18} className={active ? 'text-text-inverted' : 'text-text-secondary'} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Home & Logout */}
                <div className="p-6 border-t border-border space-y-4">
                    <Link to="/" className="flex items-center gap-3 text-sm font-medium text-text-secondary hover:text-brand-primary transition">
                        <Home size={18} />
                        Return to Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-bold text-status-error hover:text-red-600 transition w-full"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </aside>

            < div className="md:hidden fixed top-0 w-full bg-bg-surface border-b border-border z-20 px-4 py-3 flex justify-between items-center" >
                <Link to="/">
                    <Logo className="scale-75 origin-left" />
                </Link>
                <div className="flex items-center gap-2">
                    <Link to="/dashboard/profile" className="p-2 text-text-secondary">
                        <User size={20} />
                    </Link>
                </div>
            </div >

            {/* Main Content */}
            < main className="flex-1 md:ml-72 p-4 md:p-12 pt-20 md:pt-12" >
                <Outlet />
            </main >

            {/* Mobile Bottom Nav */}
            < nav className="md:hidden fixed bottom-0 left-0 w-full bg-bg-surface border-t border-border flex justify-around py-3 z-20" >
                {
                    dashboardLinks.slice(0, 5).map((link) => {
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex flex-col items-center gap-1 text-[10px] font-medium ${active ? 'text-text-primary' : 'text-text-secondary'
                                    }`}
                            >
                                <link.icon size={20} />
                                {link.name}
                            </Link>
                        );
                    })
                }
            </nav >
        </div >
    );
};

export default DashboardLayout;
