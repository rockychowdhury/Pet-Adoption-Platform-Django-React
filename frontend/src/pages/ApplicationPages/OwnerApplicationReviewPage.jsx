import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import usePets from '../../hooks/usePets';
import useAdoption from '../../hooks/useAdoption';

const OwnerApplicationReviewPage = () => {
    const { id } = useParams();
    const [filter, setFilter] = useState('All');

    // Fetch Pet Details
    const { useGetPet } = usePets();
    const { data: pet, isLoading: isPetLoading } = useGetPet(id);

    // Fetch My Applications (Received)
    const { useGetMyApplications } = useAdoption();
    const { data: allApplications, isLoading: isAppsLoading } = useGetMyApplications();

    // Filter applications for THIS pet
    const applications = useMemo(() => {
        if (!allApplications || !id) return [];
        // Ensure we match pet ID (string vs int check)
        return allApplications.filter(app => String(app.pet) === String(id) || String(app.pet.id) === String(id));
    }, [allApplications, id]);

    // Mock Scoring Logic (Backend doesn't send score yet? Or check model)
    // Model has 'score' method but maybe not in serializer.
    // We'll trust serializer has 'applicant' nested object.

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-status-success bg-status-success/10 border-status-success/20';
        if (score >= 60) return 'text-status-warning bg-status-warning/10 border-status-warning/20';
        return 'text-status-error bg-status-error/10 border-status-error/20';
    };

    const handleReject = (appId) => {
        // TODO: Implement rejection mutation
        toast.info("Application rejection not yet wired to API.");
    };

    const filteredApps = useMemo(() => {
        if (!applications) return [];
        if (filter === 'All') return applications;
        return applications.filter(app => app.status.toLowerCase() === filter.toLowerCase());
    }, [applications, filter]);

    // Application count for the header
    const appCount = applications.length;

    if (isPetLoading || isAppsLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!pet) {
        return <div className="min-h-screen flex items-center justify-center">Pet not found.</div>;
    }

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to={`/pets/${id}`} className="text-sm font-bold text-text-tertiary hover:text-brand-primary flex items-center gap-1 mb-4">
                        <ChevronLeft size={16} /> Back to Listing
                    </Link>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Applications for {pet.pet_name || pet.name}</h1>
                            <p className="text-text-secondary mt-1">{appCount} total applications received.</p>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full sm:w-auto">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
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
                </div>

                {/* Application List */}
                <div className="space-y-4">
                    {filteredApps.map(app => {
                        // Safe access to nested applicant data
                        const applicantName = app.applicant_name || (app.applicant ? `${app.applicant.first_name} ${app.applicant.last_name}` : 'Unknown');
                        const applicantImage = app.applicant?.photo_url || app.applicant?.profile_image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                        const housingInfo = app.applicant_details?.housing_type || 'N/A'; // Need to check serializer structure for details
                        // For MVP, if details aren't fully serialized, we might show less info.

                        return (
                            <Card key={app.id} className="p-6 transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-brand-primary">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Applicant Info */}
                                    <div className="flex items-start gap-4 flex-shrink-0 w-full md:w-64">
                                        <img src={applicantImage} alt={applicantName} className="w-14 h-14 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg text-text-primary">{applicantName}</h3>
                                            {/* Score logic placeholder */}
                                            {/* 
                                            <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${getScoreColor(85)} mt-1`}>
                                                Score: 85%
                                            </div>
                                            */}
                                            <p className="text-xs text-text-tertiary mt-2">{new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-text-tertiary uppercase font-bold">Status</p>
                                                <p className="text-sm font-medium text-text-primary">{app.status}</p>
                                            </div>
                                            {/* Add more details if available in serializer */}
                                        </div>

                                        <div className="bg-bg-secondary p-3 rounded-xl border border-border mb-4">
                                            <p className="text-sm text-text-secondary italic line-clamp-2">
                                                "{app.message}"
                                                <Link to={`/applications/${app.id}/review`} className="text-brand-primary font-bold ml-1 hover:underline not-italic">
                                                    Read more
                                                </Link>
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <Link to={`/applications/${app.id}/review`}>
                                                <Button size="sm" variant="primary">View Application</Button>
                                            </Link>
                                            <Button size="sm" variant="ghost" className="text-text-secondary hover:text-text-primary">
                                                <MessageSquare size={16} className="mr-2" /> Message
                                            </Button>
                                            {app.status !== 'rejected' && (
                                                <Button size="sm" variant="ghost" className="text-status-error hover:bg-status-error/10 hover:text-status-error ml-auto" onClick={() => handleReject(app.id)}>
                                                    <X size={16} className="mr-1" /> Quick Reject
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {filteredApps.length === 0 && (
                        <div className="text-center py-20 bg-bg-surface rounded-3xl border border-dashed border-border">
                            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">No applications found</h3>
                            <p className="text-text-secondary mt-1">
                                {filter === 'All' ? "We'll notify you when someone applies." : `No ${filter} applications.`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerApplicationReviewPage;
