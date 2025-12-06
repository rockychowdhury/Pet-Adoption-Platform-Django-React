import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router';
import useAPI from '../../hooks/useAPI';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle, Share2, HelpCircle, PawPrint, FileText, Heart } from 'lucide-react';
import CreatePetModal from '../../components/Pet/CreatePetModal';
import { toast } from 'react-toastify';

const ShelterDashboard = () => {
    const api = useAPI();
    const queryClient = useQueryClient();
    const location = useLocation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [petToEdit, setPetToEdit] = useState(null);

    // Determine active view based on path
    const isPetsView = location.pathname === '/dashboard/pets';
    const isApplicationsView = location.pathname === '/dashboard/applications';
    const isOverviewView = !isPetsView && !isApplicationsView;

    // Fetch Shelter's Pets
    const { data: pets = [], isLoading: petsLoading } = useQuery({
        queryKey: ['shelterPets'],
        queryFn: async () => {
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

    if (petsLoading || appsLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
    );

    const stats = [
        { label: 'Total Pets', value: pets.length, icon: PawPrint, color: 'bg-[#FAF7F5] text-text-primary' },
        { label: 'Pending Requests', value: applications.filter(a => a.status === 'pending').length, icon: FileText, color: 'bg-[#FAF7F5] text-text-primary' },
        { label: 'Adopted This Month', value: pets.filter(p => p.status === 'adopted').length, icon: Heart, color: 'bg-[#FAF7F5] text-text-primary' },
    ];

    const ApplicationRow = ({ app }) => (
        <tr className="hover:bg-[#FAF7F5] transition border-b border-[#E5E0D8] last:border-none">
            <td className="p-6">
                <p className="font-bold text-text-primary text-sm">{app.applicant_email || `User #${app.applicant}`}</p>
                <p className="text-xs text-text-secondary mt-0.5">Applied today</p>
            </td>
            <td className="p-6">
                <p className="font-bold text-text-primary text-sm">{app.pet_name || `Pet #${app.pet}`}</p>
                <p className="text-xs text-text-secondary mt-0.5">Golden Retriever • 2 years</p>
            </td>
            <td className="p-6 max-w-xs">
                <p className="text-sm text-text-secondary truncate">{app.message}</p>
            </td>
            <td className="p-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        app.status === 'approved' ? 'bg-green-100 text-green-600' :
                            app.status === 'adopted' ? 'bg-purple-100 text-purple-600' :
                                'bg-gray-100 text-gray-600'
                    }`}>
                    {app.status}
                </span>
            </td>
            <td className="p-6">
                <div className="flex gap-2">
                    {app.status === 'pending' && (
                        <>
                            <button onClick={() => handleStatusUpdate(app.id, 'approved')} className="p-2 border border-[#E5E0D8] rounded-lg text-green-600 hover:bg-green-50 transition">
                                <CheckCircle size={16} />
                            </button>
                            <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="p-2 border border-[#E5E0D8] rounded-lg text-red-500 hover:bg-red-50 transition">
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                    {app.status === 'approved' && (
                        <button onClick={() => handleStatusUpdate(app.id, 'adopted')} className="p-2 border border-[#E5E0D8] rounded-lg text-purple-600 hover:bg-purple-50 transition" title="Finalize Adoption">
                            <PawPrint size={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );

    const PetCard = ({ pet }) => (
        <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden group hover:shadow-md transition">
            <div className="h-48 overflow-hidden relative">
                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${pet.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {pet.status}
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg text-text-primary mb-1">{pet.name}</h3>
                <p className="text-text-secondary text-xs font-medium mb-4">{pet.breed} • {pet.age} months • {pet.gender || 'Unknown'}</p>

                <div className="flex gap-2 pt-4 border-t border-[#E5E0D8]">
                    <button onClick={() => handleEditPet(pet)} className="flex-1 py-2 text-xs font-bold text-text-secondary hover:text-text-primary flex items-center justify-center gap-2 transition">
                        <Edit size={14} /> Edit
                    </button>
                    <button className="flex-1 py-2 text-xs font-bold text-text-secondary hover:text-text-primary flex items-center justify-center gap-2 transition">
                        <Share2 size={14} /> Share
                    </button>
                    <button onClick={() => handleDeletePet(pet.id)} className="p-2 text-red-400 hover:text-red-600 transition">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {isOverviewView ? 'Overview' : isPetsView ? 'Your Pets' : 'Adoption Requests'}
                    </h1>
                    <p className="text-text-secondary">
                        {isOverviewView ? 'Track pets, applications, and conversations in one place.' :
                            isPetsView ? 'Manage your pet listings and update their status.' :
                                'Review and manage incoming adoption applications.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E0D8] rounded-full text-sm font-bold text-text-primary hover:bg-[#FAF7F5] transition">
                        <HelpCircle size={16} /> Help
                    </button>
                    <button onClick={handleCreatePet} className="flex items-center gap-2 px-5 py-2 bg-[#2D2D2D] text-white rounded-full text-sm font-bold hover:opacity-90 transition shadow-lg">
                        <Plus size={16} /> Add new pet
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            {isOverviewView && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-8 rounded-[24px] border border-[#E5E0D8] flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                <p className="text-4xl font-bold text-text-primary">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Adoption Requests Section */}
            {(isOverviewView || isApplicationsView) && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-text-primary">
                            {isOverviewView ? 'Recent Applications' : 'All Applications'}
                        </h2>
                        {isOverviewView && (
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-[#FAF7F5] rounded-full text-xs font-bold text-text-secondary">All statuses</span>
                                <span className="px-3 py-1 bg-[#FAF7F5] rounded-full text-xs font-bold text-text-secondary">Needs response</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-[24px] border border-[#E5E0D8] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FAF7F5] text-text-secondary text-[10px] font-bold uppercase tracking-wider border-b border-[#E5E0D8]">
                                    <tr>
                                        <th className="p-6">Applicant</th>
                                        <th className="p-6">Pet</th>
                                        <th className="p-6">Message</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(isOverviewView ? applications.slice(0, 3) : applications).map((app) => (
                                        <ApplicationRow key={app.id} app={app} />
                                    ))}
                                    {applications.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-text-secondary">
                                                No applications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {isOverviewView && applications.length > 0 && (
                            <div className="p-4 border-t border-[#E5E0D8] text-center">
                                <Link to="/dashboard/applications" className="text-sm font-bold text-text-primary hover:text-brand-secondary transition">
                                    View all applications
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pets Section */}
            {(isOverviewView || isPetsView) && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-text-primary">
                            {isOverviewView ? 'Your Pets' : 'All Pets'}
                        </h2>
                        {isPetsView && (
                            <button onClick={handleCreatePet} className="flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] text-white rounded-full text-xs font-bold hover:opacity-90 transition">
                                <Plus size={14} /> Add New Pet
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(isOverviewView ? pets.slice(0, 3) : pets).map((pet) => (
                            <PetCard key={pet.id} pet={pet} />
                        ))}
                    </div>
                    {pets.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-[24px] border border-[#E5E0D8]">
                            <p className="text-text-secondary">No pets listed yet.</p>
                        </div>
                    )}
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

export default ShelterDashboard;
