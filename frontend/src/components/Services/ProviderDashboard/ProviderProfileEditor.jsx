import React, { useState } from 'react';
import { User, ClipboardList, Clock, Image as ImageIcon } from 'lucide-react';
import useServices from '../../../hooks/useServices';
import Button from '../../common/Buttons/Button';
import ServiceSpecificForm from './ServiceSpecificForm';
import BusinessHoursEditor from './BusinessHoursEditor';
import MediaGalleryEditor from './MediaGalleryEditor';
import { toast } from 'react-toastify';

const TABS = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'service', label: 'Service Details', icon: ClipboardList },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'media', label: 'Media Gallery', icon: ImageIcon },
];

const ProviderProfileEditor = ({ provider, onClose }) => {
    const [activeTab, setActiveTab] = useState('basic');
    const { useUpdateProviderProfile, useUpdateProviderHours, useUpdateProviderMedia } = useServices();

    // Mutations
    const updateProfile = useUpdateProviderProfile();
    const updateHours = useUpdateProviderHours();
    const updateMedia = useUpdateProviderMedia();

    // Basic Info State
    const [basicInfo, setBasicInfo] = useState({
        business_name: provider.business_name || '',
        description: provider.description || '',
        phone: provider.phone || '',
        website: provider.website || '',
        city: provider.city || '',
        state: provider.state || '',
        zip_code: provider.zip_code || '',
    });

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveBasic = () => {
        updateProfile.mutate(
            { id: provider.id, data: basicInfo },
            {
                onSuccess: () => toast.success("Basic info updated!"),
                onError: () => toast.error("Failed to update basic info.")
            }
        );
    };

    const handleSaveServiceDetails = (data) => {
        updateProfile.mutate(
            { id: provider.id, data },
            {
                onSuccess: () => toast.success("Service details updated!"),
                onError: () => toast.error("Failed to update service details.")
            }
        );
    };

    const handleSaveHours = (hoursData) => {
        updateHours.mutate(
            { id: provider.id, data: hoursData },
            {
                onSuccess: () => toast.success("Business hours updated!"),
                onError: () => toast.error("Failed to update hours.")
            }
        );
    };

    const handleSaveMedia = (mediaData) => {
        updateMedia.mutate(
            { id: provider.id, data: mediaData },
            {
                onSuccess: () => toast.success("Media gallery updated!"),
                onError: () => toast.error("Failed to update media.")
            }
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-gray-50 border-r border-border flex-shrink-0">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
                    <p className="text-sm text-text-secondary">{provider.business_name}</p>
                </div>
                <nav className="p-4 space-y-2">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-brand-primary text-white shadow-md'
                                        : 'text-text-secondary hover:bg-white hover:text-text-primary'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 mt-auto border-t border-border">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Exit Editor
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                {activeTab === 'basic' && (
                    <div className="max-w-2xl space-y-6 animate-fadeIn">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Business Name</label>
                            <input
                                name="business_name"
                                value={basicInfo.business_name}
                                onChange={handleBasicInfoChange}
                                className="w-full p-2 border border-border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                            <textarea
                                name="description"
                                value={basicInfo.description}
                                onChange={handleBasicInfoChange}
                                className="w-full p-2 border border-border rounded-lg h-32"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                                <input
                                    name="phone"
                                    value={basicInfo.phone}
                                    onChange={handleBasicInfoChange}
                                    className="w-full p-2 border border-border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Website</label>
                                <input
                                    name="website"
                                    value={basicInfo.website}
                                    onChange={handleBasicInfoChange}
                                    className="w-full p-2 border border-border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                                <input
                                    name="city"
                                    value={basicInfo.city}
                                    onChange={handleBasicInfoChange}
                                    className="w-full p-2 border border-border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                                <input
                                    name="state"
                                    value={basicInfo.state}
                                    onChange={handleBasicInfoChange}
                                    className="w-full p-2 border border-border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Zip Code</label>
                                <input
                                    name="zip_code"
                                    value={basicInfo.zip_code}
                                    onChange={handleBasicInfoChange}
                                    className="w-full p-2 border border-border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button variant="primary" onClick={handleSaveBasic} disabled={updateProfile.isPending}>
                                {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 'service' && (
                    <div className="animate-fadeIn">
                        <ServiceSpecificForm
                            provider={provider}
                            onSave={handleSaveServiceDetails}
                            isLoading={updateProfile.isPending}
                        />
                    </div>
                )}

                {activeTab === 'hours' && (
                    <div className="max-w-2xl animate-fadeIn">
                        <BusinessHoursEditor
                            initialHours={provider.hours}
                            onSave={handleSaveHours}
                            isLoading={updateHours.isPending}
                        />
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="animate-fadeIn">
                        <MediaGalleryEditor
                            customMedia={provider.media}
                            onSave={handleSaveMedia}
                            isLoading={updateMedia.isPending}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderProfileEditor;
