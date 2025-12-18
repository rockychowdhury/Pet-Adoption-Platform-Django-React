import React, { useState, useEffect } from 'react';
import useAPI from '../../hooks/useAPI';
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Mail, Shield, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const UserManagementPage = () => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const [roleRequests, setRoleRequests] = useState([]);
    const api = useAPI();

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchRequests();
        }
    }, [activeTab]);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/users/role-requests/');
            setRoleRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const handleRequestAction = async (id, status) => {
        try {
            await api.patch(`/users/role-requests/${id}/`, { status });
            fetchRequests();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

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

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 font-medium ${activeTab === 'users' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary'}`}
                >
                    All Users
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`pb-2 font-medium ${activeTab === 'requests' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary'}`}
                >
                    Role Requests
                </button>
            </div>

            {activeTab === 'users' ? (
                <Card className="overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-secondary/50">
                        <div className="relative w-full md:w-96">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or username..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:ring-1 focus:ring-brand-primary outline-none bg-bg-surface text-text-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select className="px-3 py-2 rounded-lg border border-border text-sm focus:ring-brand-primary outline-none bg-bg-surface text-text-primary">
                                <option>All Roles</option>
                                <option>Pet Owner</option>
                                <option>Adopter</option>
                                <option>Service Provider</option>
                                <option>Admin</option>
                            </select>
                            <select
                                className="px-3 py-2 rounded-lg border border-border text-sm focus:ring-brand-primary outline-none bg-bg-surface text-text-primary"
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
                                <tr className="bg-bg-secondary border-b border-border text-xs font-bold text-text-tertiary uppercase tracking-wider">
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
                            <tbody className="divide-y divide-border">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-bg-secondary/50 transition">
                                        <td className="p-4">
                                            <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary" />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-bg-secondary overflow-hidden flex-shrink-0">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-text-tertiary font-bold">
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
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-secondary text-text-secondary">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1">
                                                {user.verified.email && <div className="p-1 text-status-success bg-status-success/10 rounded" title="Email Verified"><Mail size={12} /></div>}
                                                {user.verified.id && <div className="p-1 text-status-info bg-status-info/10 rounded" title="ID Verified"><Shield size={12} /></div>}
                                                {user.verified.owner && <div className="p-1 text-brand-secondary bg-brand-secondary/10 rounded" title="Owner Verified"><Check size={12} /></div>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-text-secondary">
                                            {user.joinDate}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/users/${user.id}`}>
                                                    <button className="p-2 text-text-tertiary hover:text-brand-primary rounded-lg hover:bg-brand-primary/10 transition">
                                                        <Eye size={16} />
                                                    </button>
                                                </Link>
                                                <button className="p-2 text-text-tertiary hover:text-status-info rounded-lg hover:bg-status-info/10 transition">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 text-text-tertiary hover:text-status-error rounded-lg hover:bg-status-error/10 transition">
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
                    <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
                        <span>Showing 1 to 4 of 1248 results</span>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 border border-border rounded hover:bg-bg-secondary">Previous</button>
                            <button className="px-3 py-1 border border-border rounded bg-brand-primary text-text-inverted border-brand-primary">1</button>
                            <button className="px-3 py-1 border border-border rounded hover:bg-bg-secondary">2</button>
                            <button className="px-3 py-1 border border-border rounded hover:bg-bg-secondary">3</button>
                            <button className="px-3 py-1 border border-border rounded hover:bg-bg-secondary">...</button>
                            <button className="px-3 py-1 border border-border rounded hover:bg-bg-secondary">Next</button>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="p-4 border-b border-border bg-bg-secondary/50">
                        <h3 className="font-bold text-text-primary">Pending Role Requests</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-secondary border-b border-border text-xs font-bold text-text-tertiary uppercase tracking-wider">
                                    <th className="p-4">User</th>
                                    <th className="p-4">Requested Role</th>
                                    <th className="p-4">Reason</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {roleRequests.length > 0 ? roleRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-bg-secondary/50 transition">
                                        <td className="p-4 font-medium">{req.user_email}</td>
                                        <td className="p-4 capitalize">{req.requested_role?.replace('_', ' ')}</td>
                                        <td className="p-4 text-sm text-text-secondary max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                        <td className="p-4">
                                            <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}>
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-text-tertiary">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, 'approved')}
                                                        className="text-status-success hover:bg-status-success/10 p-1 rounded" title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req.id, 'rejected')}
                                                        className="text-status-error hover:bg-status-error/10 p-1 rounded" title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-text-tertiary">No requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default UserManagementPage;
