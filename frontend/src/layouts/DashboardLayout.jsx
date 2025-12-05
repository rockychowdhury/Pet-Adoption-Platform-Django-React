import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, PawPrint, FileText, Settings, LogOut, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const shelterLinks = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Pets', path: '/dashboard/pets', icon: PawPrint },
        { name: 'Adoption Requests', path: '/dashboard/applications', icon: FileText },
    ];

    const adopterLinks = [
        { name: 'My Applications', path: '/dashboard', icon: FileText },
        { name: 'Saved Pets', path: '/dashboard/saved', icon: PawPrint },
    ];

    const links = user?.role === 'shelter' ? shelterLinks : adopterLinks;

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl font-bold font-logo text-gray-800">
                        FurEver<span className="text-action">Home</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive(link.path)
                                    ? 'bg-action/10 text-action'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <link.icon size={20} />
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link
                        to="/user/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-medium"
                    >
                        <User size={20} />
                        My Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold font-logo text-gray-800">
                    FurEver<span className="text-action">Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link to="/user/profile" className="p-2 text-gray-600"><User size={20} /></Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-20">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex flex-col items-center gap-1 text-xs font-medium ${isActive(link.path) ? 'text-action' : 'text-gray-500'
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
