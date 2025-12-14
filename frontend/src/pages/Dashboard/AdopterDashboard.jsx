import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAPI from '../../hooks/useAPI';
import { Clock, CheckCircle, XCircle, AlertCircle, Search, Plus, MessageSquare, Calendar, Phone, FileText, ChevronRight } from 'lucide-react';

const AdopterDashboard = () => {
    const api = useAPI();
    const [activeTab, setActiveTab] = useState('applications');

    // Fetch My Applications
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['myApplications'],
        queryFn: async () => {
            const res = await api.get('/adoption/');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">My Applications</h1>
                    <p className="text-text-secondary">Keep track of every pet you have applied for in one warm, organized view.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/pets" className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-full text-sm font-bold text-text-primary hover:bg-bg-secondary transition">
                        <Search size={16} /> Browse pets
                    </Link>
                    <Link to="/pets" className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-text-inverted rounded-full text-sm font-bold hover:opacity-90 transition shadow-lg">
                        <Plus size={16} /> Start new application
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-border">
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-3 font-medium transition text-sm ${activeTab === 'applications' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    My Applications
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`pb-3 font-medium transition text-sm ${activeTab === 'saved' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Saved Pets
                </button>
            </div>

            {/* Content */}
            {activeTab === 'applications' && (
                <div className="space-y-6">
                    {applications.map((app) => {
                        // Filter for the latest relevant event (Interview)
                        const interview = app.events?.find(e => e.event_type === 'interview');

                        const createCalendarUrl = () => {
                            if (!interview) return null;
                            const startTime = new Date(interview.date_time).toISOString().replace(/-|:|\.\d\d\d/g, "");
                            const endTime = new Date(new Date(interview.date_time).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // 1 hour duration

                            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Adoption+Interview+for+${encodeURIComponent(app.pet_name)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(interview.notes || "Interview for pet adoption")}&location=${encodeURIComponent(interview.location || "Online")}`;
                        };

                        return (
                            <div key={app.id} className="bg-bg-surface p-6 rounded-[24px] border border-border shadow-sm hover:shadow-md transition card-hover">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Pet Image */}
                                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-bg-secondary flex-shrink-0 relative group">
                                        {app.pet_image ? (
                                            <img src={app.pet_image} alt={app.pet_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-text-secondary bg-bg-secondary">
                                                <span className="text-xs font-bold uppercase tracking-wider">Pet Photo</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-text-primary">Application for {app.pet_name || `Pet #${app.pet}`}</h3>
                                                <p className="text-xs text-text-secondary mt-1 font-medium">
                                                    Submitted {new Date(app.created_at).toLocaleDateString()} • {app.pet_breed || 'Breed Unknown'} • {app.pet_age ? `${app.pet_age} months` : 'Age Unknown'} • {app.owner_name || 'Owner'}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'adopted' ? 'bg-purple-100 text-purple-700' :
                                                        app.status === 'interview_scheduled' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status === 'pending' ? 'Pending Review' :
                                                    app.status === 'rejected' ? 'Not a Match' :
                                                        app.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Message Section */}
                                        <div className="bg-bg-secondary p-4 rounded-xl mb-4">
                                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Your Message</p>
                                            <p className="text-sm text-text-primary leading-relaxed">{app.message}</p>
                                        </div>

                                        {/* Feedback Section (if rejected) */}
                                        {app.status === 'rejected' && app.rejection_reason && (
                                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                                                <div className="flex items-center gap-2 text-red-600 mb-2">
                                                    <AlertCircle size={14} />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">Shelter Feedback</p>
                                                </div>
                                                <p className="text-sm text-red-800 leading-relaxed">{app.rejection_reason}</p>
                                            </div>
                                        )}

                                        {/* Interview Invite Section */}
                                        {app.status === 'interview_scheduled' && interview && (
                                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mb-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2 text-blue-700 mb-3">
                                                        <Calendar size={16} />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest">Interview Invitation</p>
                                                    </div>
                                                    <a
                                                        href={createCalendarUrl()}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
                                                    >
                                                        <Plus size={12} /> Add to Calendar
                                                    </a>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-blue-900 font-bold">
                                                        Date: {new Date(interview.date_time).toLocaleString()}
                                                    </p>
                                                    {interview.location && (
                                                        <p className="text-sm">
                                                            Location/Link: <a href={interview.location.startsWith('http') ? interview.location : '#'} target={interview.location.startsWith('http') ? "_blank" : "_self"} rel="noreferrer" className="text-blue-600 underline font-medium">{interview.location}</a>
                                                        </p>
                                                    )}
                                                    {interview.notes && (
                                                        <p className="text-xs text-blue-800 italic">"{interview.notes}"</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* Footer Actions */}
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
                                            <p className="text-[10px] text-text-secondary font-medium">
                                                Last update from owner • {new Date(app.updated_at || app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <div className="flex gap-3 w-full sm:w-auto">
                                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-full text-xs font-bold text-text-primary hover:bg-bg-secondary transition">
                                                    <MessageSquare size={14} /> Message owner
                                                </button>
                                                {app.status === 'approved' && (
                                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-text-inverted rounded-full text-xs font-bold hover:opacity-90 transition">
                                                        <Calendar size={14} /> Request visit
                                                    </button>
                                                )}
                                                {app.status === 'rejected' && (
                                                    <Link to="/pets" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-bg-surface border border-border rounded-full text-xs font-bold text-text-primary hover:bg-bg-secondary transition">
                                                        <Search size={14} /> Find similar pets
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {applications.length === 0 && (
                        <div className="bg-bg-surface rounded-[32px] p-12 text-center border border-border max-w-2xl mx-auto mt-8 card">
                            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-brand-secondary">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">No applications yet</h3>
                            <p className="text-text-secondary max-w-md mx-auto mb-8">
                                When you apply for a pet, you'll see every step of the journey right here — from review to homecoming.
                            </p>
                            <Link to="/pets" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-text-inverted rounded-full font-bold hover:opacity-90 transition shadow-lg">
                                <Plus size={18} /> Start your first application
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'saved' && (
                <div className="text-center py-20">
                    <p className="text-text-secondary">Saved pets functionality coming soon!</p>
                </div>
            )}
        </div>
    );
};

export default AdopterDashboard;
