import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, PawPrint, FileText, Settings, LogOut, User, MessageSquare, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth';

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

    const shelterLinks = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Pets', path: '/dashboard/pets', icon: PawPrint },
        { name: 'Adoption Requests', path: '/dashboard/applications', icon: FileText },
        { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
        { name: 'Community Posts', path: '/community', icon: Users },
    ];

    const adopterLinks = [
        { name: 'My Applications', path: '/dashboard', icon: FileText },
        { name: 'Saved Pets', path: '/dashboard/saved', icon: PawPrint },
        { name: 'Community', path: '/community', icon: Users },
    ];

    const links = user?.role === 'shelter' ? shelterLinks : adopterLinks;

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex font-inter">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-[#E5E0D8] hidden md:flex flex-col fixed h-full z-10">
                <div className="p-8 pb-6">
                    <Link to="/" className="block">
                        <h1 className="text-xl font-bold font-logo text-text-primary">FurEver Home</h1>
                        {user?.role === 'shelter' && (
                            <p className="text-xs text-text-secondary mt-1">Shelter dashboard</p>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${isActive(link.path)
                                ? 'bg-[#F5F1EB] text-text-primary'
                                : 'text-text-secondary hover:bg-[#FDFBF7] hover:text-text-primary'
                                }`}
                        >
                            <link.icon size={18} className={isActive(link.path) ? 'text-text-primary' : 'text-text-secondary'} />
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-[#E5E0D8]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-bg-secondary overflow-hidden border border-white/20">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt={user.first_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-secondary font-bold text-sm">
                                    {user?.first_name?.[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate">
                                {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                                {user?.role === 'shelter' ? 'Shelter Admin' : 'Adopter'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-[#E5E0D8] z-20 px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold font-logo text-text-primary">
                    FurEver<span className="text-brand-primary">Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link to="/user/profile" className="p-2 text-text-secondary"><User size={20} /></Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-12 pt-20 md:pt-12">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#E5E0D8] flex justify-around py-3 z-20">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex flex-col items-center gap-1 text-[10px] font-medium ${isActive(link.path) ? 'text-text-primary' : 'text-text-secondary'
                            }`}
                    >
                        <link.icon size={20} />
                        {link.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default DashboardLayout;
