import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Calendar, ChevronRight } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const MyApplicationsPage = () => {
    const [filter, setFilter] = useState('All');

    // Mock Applications
    const applications = [
        {
            id: 1,
            pet: { name: 'Bella', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80' },
            owner: { name: 'Alex Morgan' },
            status: 'Pending Review',
            appliedDate: '2 days ago',
            lastUpdate: '2 days ago',
            unreadMessages: 0
        },
        {
            id: 2,
            pet: { name: 'Luna', breed: 'Siamese Cat', image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=200&q=80' },
            owner: { name: 'Sarah Jenkins' },
            status: 'Info Requested',
            appliedDate: '5 days ago',
            lastUpdate: '1 day ago',
            unreadMessages: 2
        },
        {
            id: 3,
            pet: { name: 'Charlie', breed: 'Beagle', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11e77ee8?auto=format&fit=crop&w=200&q=80' },
            owner: { name: 'Mike Ross' },
            status: 'Approved',
            appliedDate: '1 week ago',
            lastUpdate: 'Yesterday',
            unreadMessages: 0
        }
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Rejected': return 'error';
            case 'Info Requested': return 'info';
            case 'Pending Review': return 'warning';
            default: return 'neutral';
        }
    };

    const filteredApps = filter === 'All' ? applications : applications.filter(app => app.status.includes(filter) || (filter === 'Approved' && app.status.includes('Meet')));

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">My Applications</h1>
                    <p className="text-text-secondary mt-1">Track the status of your adoption requests</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-border scrollbar-hide">
                    {['All', 'Pending Review', 'Info Requested', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === status
                                ? 'bg-brand-primary text-text-inverted shadow-md'
                                : 'bg-bg-surface text-text-secondary hover:bg-bg-secondary border border-border'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Application List */}
                <div className="space-y-4">
                    {filteredApps.map(app => (
                        <Card key={app.id} className="group hover:border-brand-primary/30 transition-all cursor-pointer">
                            <div className="flex flex-col sm:flex-row p-4 gap-6 items-center">
                                {/* Pet Image */}
                                <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                    <img src={app.pet.image} alt={app.pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-text-primary">{app.pet.name} <span className="text-sm font-normal text-text-tertiary">({app.pet.breed})</span></h3>
                                        <span className="text-xs text-text-tertiary flex items-center justify-center sm:justify-start gap-1">
                                            <Calendar size={12} /> Applied {app.appliedDate}
                                        </span>
                                    </div>

                                    <p className="text-sm text-text-secondary mb-3">Listed by <span className="font-bold">{app.owner.name}</span></p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>

                                        {app.unreadMessages > 0 && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-status-info bg-status-info/10 px-2 py-1 rounded-md animate-pulse">
                                                <MessageCircle size={12} /> {app.unreadMessages} new message{app.unreadMessages > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="shrink-0">
                                    <Link to={`/applications/${app.id}`}>
                                        <Button variant="outline" className="rounded-full w-10 h-10 p-0 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary">
                                            <ChevronRight size={20} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredApps.length === 0 && (
                        <div className="text-center py-20 bg-bg-surface rounded-3xl border border-dashed border-border">
                            <h3 className="text-lg font-bold text-text-primary">No applications found</h3>
                            <p className="text-text-secondary mt-1">Try changing your filters or browse more pets.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyApplicationsPage;
