import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, MapPin, Calendar, Shield, AlertTriangle, User, List, FileText, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';
import { toast } from 'react-toastify';

const UserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Mock User Data
    const user = {
        id,
        name: 'Sarah Jenkins',
        username: 'sarahj_dogs',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Brooklyn, NY 11201',
        joinDate: 'Dec 10, 2023',
        status: 'Active',
        role: 'Adopter',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=200&h=200&q=80',
        verifications: {
            email: true,
            phone: true,
            identity: 'Pending',
            background: 'Unverified'
        },
        stats: {
            applications: 3,
            adoptions: 0,
            reviews: 0,
            reports: 0
        },
        reports: [], // No reports against her
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'listings', label: 'Listings', icon: List },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'verification', label: 'Verification', icon: Shield },
        { id: 'activity', label: 'Activity Log', icon: Calendar },
    ];

    const handleAction = (action) => {
        toast.info(`${action} action triggered for user ${user.name}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" onClick={() => navigate('/admin/users')} className="pl-0 mb-4 text-gray-500 hover:bg-transparent hover:text-brand-primary">
                    <ChevronLeft size={20} className="mr-1" /> Back to Users
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-bg-secondary overflow-hidden border-4 border-bg-surface shadow-sm">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold text-text-primary font-merriweather">{user.name}</h1>
                                <Badge variant="success">{user.status}</Badge>
                            </div>
                            <p className="text-text-secondary flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => handleAction('Suspend')}>
                            <AlertTriangle size={16} className="mr-2" /> Suspend
                        </Button>
                        <Button variant="primary" onClick={() => handleAction('Edit')}>Edit User</Button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-2 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Info */}
                <div className="lg:col-span-2">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-bold mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-text-tertiary uppercase mb-1">Full Name</label>
                                        <p className="font-medium">{user.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-tertiary uppercase mb-1">Username</label>
                                        <p className="font-medium">@{user.username}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-tertiary uppercase mb-1">Email Address</label>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{user.email}</p>
                                            {user.verifications.email && <CheckCircle size={14} className="text-status-success" />}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-tertiary uppercase mb-1">Phone Number</label>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{user.phone}</p>
                                            {user.verifications.phone && <CheckCircle size={14} className="text-status-success" />}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-tertiary uppercase mb-1">Role</label>
                                        <p className="font-medium">{user.role}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-tertiary uppercase mb-1">Joined Date</label>
                                        <p className="font-medium">{user.joinDate}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-bold mb-4">Account Notes</h3>
                                <textarea className="w-full p-3 border border-border rounded-lg text-sm bg-bg-surface text-text-primary" rows="3" placeholder="Add administrative notes about this user..."></textarea>
                                <div className="mt-3 text-right">
                                    <Button size="sm" variant="primary">Save Note</Button>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'verification' && (
                        <Card className="p-6">
                            <h3 className="text-lg font-bold mb-6">Verification Request Queue</h3>
                            {user.verifications.identity === 'Pending' ? (
                                <div className="border border-status-warning/20 bg-status-warning/10 rounded-xl p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-bg-surface rounded-lg border border-status-warning/20 shadow-sm">
                                            <Shield className="text-status-warning" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-text-primary">Identity Verification</h4>
                                            <p className="text-sm text-text-secondary mb-2">Submitted ID Document on Dec 12, 2023</p>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm" variant="primary">Review Document</Button>
                                                <Button size="sm" variant="outline">Reject</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-text-tertiary">No pending verification requests.</p>
                            )}
                        </Card>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-sm font-bold text-text-tertiary uppercase mb-4">User Statistics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-text-secondary">Applications</span>
                                <span className="font-bold">{user.stats.applications}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-text-secondary">Adoptions</span>
                                <span className="font-bold">{user.stats.adoptions}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border">
                                <span className="text-text-secondary">Reviews</span>
                                <span className="font-bold">{user.stats.reviews}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-text-secondary">Reports</span>
                                <span className="font-bold">{user.stats.reports}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
