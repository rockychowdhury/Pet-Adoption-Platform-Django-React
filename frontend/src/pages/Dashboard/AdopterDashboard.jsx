import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAPI from '../../hooks/useAPI';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdopterDashboard = () => {
    const api = useAPI();

    // Fetch My Applications
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['myApplications'],
        queryFn: async () => {
            const res = await api.get('/adoption/');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">My Applications</h1>

            <div className="grid gap-6">
                {applications.map((app) => (
                    <div key={app.id} className="bg-bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-bg-primary flex-shrink-0">
                            {/* Ideally we fetch pet details or include pet photo in application serializer */}
                            <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">Pet Photo</div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary">Application for Pet #{app.pet}</h3>
                                    <p className="text-text-secondary mt-1">Submitted on {new Date(app.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase flex items-center gap-2 ${app.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                    app.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                        app.status === 'adopted' ? 'bg-green-100 text-green-600' :
                                            'bg-red-100 text-red-600'
                                    }`}>
                                    {app.status === 'pending' && <Clock size={16} />}
                                    {app.status === 'approved' && <CheckCircle size={16} />}
                                    {app.status === 'adopted' && <CheckCircle size={16} />}
                                    {app.status === 'rejected' && <XCircle size={16} />}
                                    {app.status}
                                </span>
                            </div>

                            <div className="mt-4 bg-bg-primary p-4 rounded-xl">
                                <p className="text-sm text-text-secondary"><span className="font-semibold text-text-primary">Your Message:</span> {app.message}</p>
                            </div>

                            {app.status === 'rejected' && app.rejection_reason && (
                                <div className="mt-4 bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 flex gap-3 items-start">
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-sm">Application Rejected</p>
                                        <p className="text-sm mt-1">{app.rejection_reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-12 bg-bg-surface rounded-2xl border border-border">
                        <p className="text-text-secondary">You haven't submitted any adoption applications yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdopterDashboard;
