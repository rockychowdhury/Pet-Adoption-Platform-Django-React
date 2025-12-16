import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, List, Heart, Flag, ArrowUp, ArrowDown, Activity, CheckCircle, Clock } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Badge from '../../components/common/Feedback/Badge';
import { Link } from 'react-router-dom';

// Simple mock chart components since we don't have a chart lib installed yet
const MockLineChart = () => (
    <div className="h-64 flex items-end justify-between px-2 gap-2 mt-4 border-b border-l border-gray-200">
        {[40, 65, 50, 80, 75, 95, 120].map((h, i) => (
            <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                <div className="absolute bottom-0 w-full bg-brand-primary/80 transition-all duration-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
            </div>
        ))}
    </div>
);

const MockBarChart = () => (
    <div className="h-64 flex items-end justify-between px-4 gap-4 mt-4 border-b border-l border-gray-200">
        {[30, 45, 35, 60, 55, 70].map((h, i) => (
            <div key={i} className="w-8 mx-auto bg-green-500/80 rounded-t-md transition-all hover:bg-green-600" style={{ height: `${h}%` }}></div>
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

    if (isLoading || !analytics) return <div className="p-8">Loading dashboard...</div>;

    const stats = [
        { title: 'Total Users', value: analytics.total_users, change: `+${analytics.new_users_today} today`, isPositive: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/users' },
        { title: 'Active Listings', value: analytics.active_listings, change: '0%', isPositive: true, icon: List, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/listings' },
        { title: 'Total Applications', value: analytics.total_applications, change: '0%', isPositive: true, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', link: '/admin/analytics' },
        { title: 'Pending Listings', value: analytics.pending_listings, change: 'Action Req.', isPositive: false, icon: Flag, color: 'text-red-600', bg: 'bg-red-50', link: '/admin/listings' },
    ];

    const pendingActions = [
        { label: 'Listings to Review', count: analytics.pending_listings, link: '/admin/listings', color: 'orange' },
        { label: 'Pending Applications', count: analytics.pending_applications, link: '/admin/applications', color: 'blue' },
        { label: 'High Priority Reports', count: 0, link: '/admin/reports', color: 'red' }, // Reports endpoint needs count
    ];

    // Mock activities for MVP until we wire an Activity Log API
    const activities = [
        { id: 1, type: 'user', message: 'New user registration: Sarah Jenkins', time: '5 mins ago', icon: Users },
        { id: 2, type: 'listing', message: 'New listing submitted: "Buddy" (Golden Retriever)', time: '15 mins ago', icon: List },
        { id: 3, type: 'report', message: 'Report filed against Listing #452', time: '1 hour ago', icon: Flag },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Link key={index} to={stat.link}>
                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-text-secondary text-sm font-medium">{stat.title}</h3>
                            <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Charts Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-text-primary">User Growth</h3>
                            <select className="text-sm border-gray-300 rounded-lg focus:ring-brand-primary">
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <MockLineChart />
                    </Card>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Pending Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-brand-primary" />
                            Requires Attention
                        </h3>
                        <div className="space-y-3">
                            {pendingActions.map((action, idx) => (
                                <Link key={idx} to={action.link} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                                    <Badge variant={action.color === 'red' ? 'error' : action.color === 'orange' ? 'warning' : 'info'}>
                                        {action.count}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
                            <Link to="/admin/activity" className="text-xs text-brand-primary hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3 items-start">
                                    <div className="p-2 bg-gray-100 rounded-full shrink-0 text-gray-500 mt-1">
                                        <activity.icon size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-primary leading-tight mb-1">{activity.message}</p>
                                        <p className="text-xs text-text-tertiary flex items-center gap-1">
                                            <Clock size={10} /> {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
