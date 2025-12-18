import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, List, Heart, Flag, ArrowUp, ArrowDown, Activity, CheckCircle, Clock } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Badge from '../../components/common/Feedback/Badge';
import { Link } from 'react-router-dom';

const MockLineChart = () => (
    <div className="h-64 flex items-end justify-between px-2 gap-2 mt-4">
        {[40, 65, 50, 80, 75, 95, 120].map((h, i) => (
            <div key={i} className="flex-1 group relative h-full flex items-end">
                <div
                    className="w-full bg-brand-primary/10 hover:bg-brand-primary/20 transition-all rounded-t-lg"
                    style={{ height: `${h}%` }}
                >
                    <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-brand-primary/40 to-brand-primary/10 transition-all duration-700 rounded-t-lg group-hover:from-brand-primary/60"
                        style={{ height: '100%' }}
                    ></div>
                </div>
            </div>
        ))}
    </div>
);

const MockBarChart = () => (
    <div className="h-64 flex items-end justify-between px-4 gap-4 mt-4">
        {[30, 45, 35, 60, 55, 70].map((h, i) => (
            <div key={i} className="w-8 mx-auto bg-brand-secondary/20 rounded-t-xl overflow-hidden relative group">
                <div
                    className="absolute bottom-0 w-full bg-brand-secondary transition-all duration-500 group-hover:opacity-90 shadow-lg"
                    style={{ height: `${h}%` }}
                ></div>
            </div>
        ))}
    </div>
);

const AdminDashboard = () => {
    const api = useAPI();

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['adminAnalytics'],
        queryFn: async () => {
            const response = await api.get('/admin-panel/analytics/');
            return response.data;
        }
    });

    if (isLoading || !analytics) return <div className="p-8 text-text-secondary">Loading dashboard...</div>;

    const stats = [
        { title: 'Total Users', value: analytics.total_users, change: `+${analytics.new_users_today} today`, isPositive: true, icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/10', link: '/admin/users' },
        { title: 'Active Listings', value: analytics.active_listings, change: '0%', isPositive: true, icon: List, color: 'text-brand-secondary', bg: 'bg-brand-secondary/10', link: '/admin/listings' },
        { title: 'Total Applications', value: analytics.total_applications, change: '0%', isPositive: true, icon: Heart, color: 'text-status-info', bg: 'bg-status-info/10', link: '/admin/analytics' },
        { title: 'Pending Listings', value: analytics.pending_listings, change: 'Action Req.', isPositive: false, icon: Flag, color: 'text-status-error', bg: 'bg-status-error/10', link: '/admin/listings' },
    ];

    const pendingActions = [
        { label: 'Listings to Review', count: analytics.pending_listings, link: '/admin/listings', color: 'warning' },
        { label: 'Pending Applications', count: analytics.pending_applications, link: '/admin/applications', color: 'info' },
        { label: 'High Priority Reports', count: 0, link: '/admin/reports', color: 'error' },
    ];

    // Mock activities for MVP until we wire an Activity Log API
    const activities = [
        { id: 1, type: 'user', message: 'New user registration: Sarah Jenkins', time: '5 mins ago', icon: Users },
        { id: 2, type: 'listing', message: 'New listing submitted: "Buddy" (Golden Retriever)', time: '15 mins ago', icon: List },
        { id: 3, type: 'report', message: 'Report filed against Listing #452', time: '1 hour ago', icon: Flag },
    ];

    return (
        <div className="min-h-screen bg-bg-primary relative overflow-hidden -m-8 p-8">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-[120px] -z-10"></div>

            <div className="space-y-10 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-text-primary tracking-tight">Admin <span className="text-brand-primary">Center</span></h1>
                        <p className="text-text-secondary font-medium mt-1">Platform overview and real-time moderation.</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Link key={index} to={stat.link} className="group">
                            <div className="bg-bg-surface/70 backdrop-blur-md border border-border p-6 rounded-[2rem] shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.isPositive ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'}`}>
                                        {stat.isPositive ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-text-tertiary text-xs font-black uppercase tracking-widest">{stat.title}</h3>
                                <p className="text-3xl font-black text-text-primary mt-1">{stat.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Charts Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-bg-surface/70 backdrop-blur-md border border-border p-8 rounded-[2.5rem] shadow-xl">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-text-primary tracking-tight">User Acquisition</h3>
                                    <p className="text-xs text-text-secondary font-medium mt-0.5">Registration trends over time</p>
                                </div>
                                <select className="bg-bg-secondary border-none rounded-xl px-4 py-2 text-xs font-bold text-text-secondary outline-none focus:ring-2 focus:ring-brand-primary/20">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <MockLineChart />
                        </div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-8">
                        {/* Pending Actions */}
                        <div className="bg-bg-surface/70 backdrop-blur-md border border-border p-7 rounded-[2.5rem] shadow-xl">
                            <h3 className="text-lg font-black text-text-primary mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-inner">
                                    <Activity size={20} />
                                </div>
                                Needs Attention
                            </h3>
                            <div className="space-y-4">
                                {pendingActions.map((action, idx) => (
                                    <Link key={idx} to={action.link} className="flex justify-between items-center p-4 rounded-3xl bg-bg-secondary/50 hover:bg-bg-surface hover:shadow-lg transition-all border border-transparent hover:border-border">
                                        <span className="text-sm font-bold text-text-secondary">{action.label}</span>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm text-text-inverted
                                            ${action.color === 'error' ? 'bg-status-error' :
                                                action.color === 'warning' ? 'bg-status-warning' :
                                                    'bg-status-info'}`}>
                                            {action.count}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-bg-surface/70 backdrop-blur-md border border-border p-7 rounded-[2.5rem] shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-text-primary">Recent Stream</h3>
                                <Link to="/admin/activity" className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:opacity-80 transition-colors">View All</Link>
                            </div>
                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex gap-4 items-start group">
                                        <div className="p-3 bg-bg-secondary rounded-2xl text-text-tertiary group-hover:text-brand-primary group-hover:bg-bg-surface group-hover:shadow-md transition-all shadow-inner">
                                            <activity.icon size={16} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-text-secondary font-bold leading-tight group-hover:text-text-primary transition-colors">{activity.message}</p>
                                            <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock size={12} /> {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
