import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Mail, Shield, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const UserManagementPage = () => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const users = [
        { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Adopter', status: 'Active', joinDate: 'Dec 10, 2023', verified: { email: true, id: true, owner: false }, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
        { id: 2, name: 'Michael Chen', email: 'm.chen@vetclinic.com', role: 'Vet Provider', status: 'Active', joinDate: 'Nov 22, 2023', verified: { email: true, id: true, owner: true }, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
        { id: 3, name: 'Jessica Smith', email: 'jess.smith@example.com', role: 'Pet Owner', status: 'Suspended', joinDate: 'Oct 05, 2023', verified: { email: true, id: false, owner: true }, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
        { id: 4, name: 'David Wilson', email: 'david.w@example.com', role: 'Adopter', status: 'Active', joinDate: 'Dec 15, 2023', verified: { email: false, id: false, owner: false }, avatar: null },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Suspended': return 'warning';
            case 'Banned': return 'error';
            default: return 'neutral';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary font-merriweather">User Management</h1>
                    <p className="text-text-secondary text-sm">Manage user accounts, roles, and permissions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Mail size={16} className="mr-2" /> Email All</Button>
                    <Button variant="primary">Export CSV</Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or username..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-brand-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-brand-primary outline-none">
                            <option>All Roles</option>
                            <option>Pet Owner</option>
                            <option>Adopter</option>
                            <option>Service Provider</option>
                            <option>Admin</option>
                        </select>
                        <select
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-brand-primary outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Suspended</option>
                            <option>Banned</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="p-4 w-10">
                                    <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary" />
                                </th>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Verified</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary text-sm">{user.name}</p>
                                                <p className="text-xs text-text-secondary">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {user.verified.email && <div className="p-1 text-green-600 bg-green-50 rounded" title="Email Verified"><Mail size={12} /></div>}
                                            {user.verified.id && <div className="p-1 text-blue-600 bg-blue-50 rounded" title="ID Verified"><Shield size={12} /></div>}
                                            {user.verified.owner && <div className="p-1 text-purple-600 bg-purple-50 rounded" title="Owner Verified"><Check size={12} /></div>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-text-secondary">
                                        {user.joinDate}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/users/${user.id}`}>
                                                <button className="p-2 text-gray-400 hover:text-brand-primary rounded-lg hover:bg-brand-primary/10 transition">
                                                    <Eye size={16} />
                                                </button>
                                            </Link>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-text-secondary">
                    <span>Showing 1 to 4 of 1248 results</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded bg-brand-primary text-white border-brand-primary">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">...</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserManagementPage;
