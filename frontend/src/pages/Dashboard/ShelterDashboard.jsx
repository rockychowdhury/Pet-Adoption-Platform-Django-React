import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAPI from '../../hooks/useAPI';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import { toast } from 'react-toastify';

const ShelterDashboard = () => {
    const api = useAPI();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('overview');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [petToEdit, setPetToEdit] = useState(null);

    // Fetch Shelter's Pets
    const { data: pets = [], isLoading: petsLoading } = useQuery({
        queryKey: ['shelterPets'],
        queryFn: async () => {
            // Fetch pets for this shelter using the new filter
            const res = await api.get('/pets/?shelter=me');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    // Fetch Adoption Applications
    const { data: applications = [], isLoading: appsLoading } = useQuery({
        queryKey: ['shelterApplications'],
        queryFn: async () => {
            const res = await api.get('/adoption/');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    // Update Application Status Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, reason }) => {
            return await api.post(`/adoption/${id}/update_status/`, { status, rejection_reason: reason });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['shelterApplications']);
            toast.success("Application status updated!");
        },
        onError: () => toast.error("Failed to update status.")
    });

    const handleStatusUpdate = (id, status) => {
        if (status === 'rejected') {
            const reason = prompt("Please enter a reason for rejection:");
            if (reason) updateStatusMutation.mutate({ id, status, reason });
        } else if (status === 'adopted') {
            if (window.confirm("Are you sure? This will mark the pet as adopted and reject other applications.")) {
                updateStatusMutation.mutate({ id, status });
            }
        } else {
            updateStatusMutation.mutate({ id, status });
        }
    };

    const deletePetMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/pets/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['shelterPets']);
            toast.success("Pet removed successfully.");
        },
        onError: () => toast.error("Failed to remove pet.")
    });

    const handleDeletePet = (id) => {
        if (window.confirm("Are you sure you want to remove this pet listing?")) {
            deletePetMutation.mutate(id);
        }
    };

    const handleEditPet = (pet) => {
        setPetToEdit(pet);
        setIsCreateModalOpen(true);
    };

    const handleCreatePet = () => {
        setPetToEdit(null);
        setIsCreateModalOpen(true);
    };

    if (petsLoading || appsLoading) return <div>Loading dashboard...</div>;

    // Filter pets for this shelter (assuming backend returns all for now, ideally backend should filter)
    // For this demo, let's assume the list is correct or we filter by checking if we can edit it? 
    // Actually, let's just display what we have.

    const stats = [
        { label: 'Total Pets', value: pets.length, color: 'bg-blue-100 text-blue-600' },
        { label: 'Pending Requests', value: applications.filter(a => a.status === 'pending').length, color: 'bg-orange-100 text-orange-600' },
        { label: 'Adopted Pets', value: pets.filter(p => p.status === 'adopted').length, color: 'bg-green-100 text-green-600' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-text-primary">Shelter Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-bg-surface p-6 rounded-2xl shadow-sm border border-border flex items-center justify-between">
                        <div>
                            <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <LayoutDashboard size={24} /> {/* Placeholder icon */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 font-medium transition ${activeTab === 'overview' ? 'text-action border-b-2 border-action' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Adoption Requests
                </button>
                <button
                    onClick={() => setActiveTab('pets')}
                    className={`pb-3 font-medium transition ${activeTab === 'pets' ? 'text-action border-b-2 border-action' : 'text-text-secondary hover:text-text-primary'}`}
                >
                    Manage Pets
                </button>
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
                <div className="bg-bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-bold text-text-primary">Recent Applications</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-primary text-text-secondary text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-semibold">Applicant</th>
                                    <th className="p-4 font-semibold">Pet</th>
                                    <th className="p-4 font-semibold">Message</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-bg-primary/50 transition">
                                        <td className="p-4 font-medium text-text-primary">{app.applicant_email || `User #${app.applicant}`}</td>
                                        <td className="p-4 text-text-secondary">{app.pet_name || `Pet #${app.pet}`}</td>
                                        <td className="p-4 text-text-secondary truncate max-w-xs" title={app.message}>{app.message}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${app.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                app.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                                    app.status === 'adopted' ? 'bg-green-100 text-green-600' :
                                                        'bg-red-100 text-red-600'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            {app.status !== 'adopted' && app.status !== 'rejected' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(app.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                                                        <XCircle size={18} />
                                                    </button>
                                                    {app.status === 'approved' && (
                                                        <button onClick={() => handleStatusUpdate(app.id, 'adopted')} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Finalize Adoption">
                                                            <CheckCircle size={18} /> Adopt
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {applications.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-text-secondary">No applications found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'pets' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleCreatePet}
                            className="flex items-center gap-2 px-6 py-3 bg-action text-white rounded-xl font-bold hover:bg-action_dark transition shadow-lg"
                        >
                            <Plus size={20} /> Add New Pet
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <div key={pet.id} className="bg-bg-surface rounded-2xl shadow-sm border border-border overflow-hidden group">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-bg-surface/90 px-2 py-1 rounded-md text-xs font-bold uppercase text-text-primary">
                                        {pet.status}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-text-primary">{pet.name}</h3>
                                    <p className="text-text-secondary text-sm">{pet.breed} • {pet.age} months</p>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleEditPet(pet)}
                                            className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-bg-primary text-text-secondary flex items-center justify-center gap-2"
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePet(pet.id)}
                                            className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <CreatePetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                petToEdit={petToEdit}
                onSuccess={() => {
                    queryClient.invalidateQueries(['shelterPets']);
                    setIsCreateModalOpen(false);
                }}
            />
        </div>
    );
};

import { LayoutDashboard } from 'lucide-react'; // Import for the icon used in stats

export default ShelterDashboard;
