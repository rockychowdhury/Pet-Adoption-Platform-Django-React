import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useServices from '../../hooks/useServices';
import Navbar from '../../components/common/Navbar';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

// Steps
import IntroStep from './Registration/Steps/IntroStep';
import CategorySelectionStep from './Registration/Steps/CategorySelectionStep';
import BasicInfoStep from './Registration/Steps/BasicInfoStep';
import ServiceDetailsStep from './Registration/Steps/ServiceDetailsStep';
import MediaStep from './Registration/Steps/MediaStep';
import BusinessHoursStep from './Registration/Steps/BusinessHoursStep';
import CompletionStep from './Registration/Steps/CompletionStep';

const ServiceProviderRegistrationPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const {
        useGetMyProviderProfile,
        useCreateProviderProfile,
        useUpdateProviderProfile,
        useUpdateProviderMedia,
        useUpdateProviderHours,
        useSubmitProviderApplication,
        useGetCategories,
        useGetSpecies,
        useGetServiceOptions
    } = useServices();

    // Data Hooks
    const { data: providerProfile, isLoading: profileLoading } = useGetMyProviderProfile();
    const { data: categories, isLoading: categoriesLoading } = useGetCategories();
    const { data: speciesList } = useGetSpecies();
    const { data: serviceOptions } = useGetServiceOptions();

    // Mutation Hooks
    const createProfile = useCreateProviderProfile();
    const updateProfile = useUpdateProviderProfile();
    const updateMedia = useUpdateProviderMedia();
    const updateHours = useUpdateProviderHours();
    const submitApplication = useSubmitProviderApplication();

    // Wizard State
    // 0=Category, 1=Basic, 2=Details, 3=Media, 4=Hours, 5=Completion
    const [wizardStep, setWizardStep] = useState(0);

    // Form Data State - Initialize from existing profile if available
    const [formData, setFormData] = useState({
        business_name: '',
        description: '',
        category: '',
        email: '',
        phone: '',
        website: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        // Service Specifics
        clinic_type: 'general',
        emergency_services: false,
        pricing_info: '',
        daily_rate: '',
        monthly_rate: '',
        capacity: '',
        years_experience: '',
        base_price: '',
        // Sitter specific rates
        walking_rate: '',
        house_sitting_rate: '',
        drop_in_rate: '',

        service_radius_km: 10,
        // Arrays
        species_ids: [],
        services_ids: [],
    });

    // Sync Profile Data on Load
    useEffect(() => {
        if (providerProfile) {
            setFormData(prev => ({
                ...prev,
                business_name: providerProfile.business_name || '',
                description: providerProfile.description || '',
                category: providerProfile.category?.id || providerProfile.category || '',
                email: providerProfile.email || '',
                phone: providerProfile.phone || '',
                website: providerProfile.website || '',
                address_line1: providerProfile.address_line1 || '',
                address_line2: providerProfile.address_line2 || '',
                city: providerProfile.city || '',
                state: providerProfile.state || '',
                zip_code: providerProfile.zip_code || '',
                // Flatten details logic similar to before
                ...providerProfile.foster_details,
                ...providerProfile.vet_details,
                ...providerProfile.trainer_details,
                ...providerProfile.groomer_details,
                ...providerProfile.sitter_details,

                // Specific Mappings
                base_price: providerProfile.groomer_details?.base_price || providerProfile.trainer_details?.private_session_rate || '',
                walking_rate: providerProfile.sitter_details?.walking_rate || '',
                house_sitting_rate: providerProfile.sitter_details?.house_sitting_rate || '',
                drop_in_rate: providerProfile.sitter_details?.drop_in_rate || '',

                // ID mapping needs care (e.g. species_accepted -> map to IDs)
                species_ids: providerProfile.foster_details?.species_accepted?.map(s => s.id)
                    || providerProfile.vet_details?.species_treated?.map(s => s.id)
                    || providerProfile.trainer_details?.species_trained?.map(s => s.id)
                    || providerProfile.groomer_details?.species_accepted?.map(s => s.id)
                    || providerProfile.sitter_details?.species_accepted?.map(s => s.id)
                    || [],
                services_ids: providerProfile.vet_details?.services_offered?.map(s => s.id) || []
            }));

            // Determine Step based on status
            if (providerProfile.application_status === 'submitted') {
                setWizardStep(5);
            } else if (providerProfile.application_status === 'draft') {
                // If category is already selected, move to Basic Info (1)
                // Use a check to prevent overwriting user navigation if they went back
                // This logic runs on mount/data load.
                if (wizardStep === 0 && (providerProfile.category || providerProfile.category_id)) {
                    setWizardStep(1);
                }
            }
        }
    }, [providerProfile]); // Dependent only on providerProfile to avoid loops, simplistic

    // --- Handlers ---

    const handleCategorySelect = (categoryId) => {
        setFormData(prev => ({ ...prev, category: categoryId }));
        // Move to Basic Info
        setWizardStep(1);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleMultiSelect = (e, field) => {
        const value = parseInt(e.target.value);
        const checked = e.target.checked;
        setFormData(prev => {
            const current = prev[field] || [];
            if (checked) return { ...prev, [field]: [...current, value] };
            else return { ...prev, [field]: current.filter(id => id !== value) };
        });
    };

    const constructPayload = () => {
        // categories is paginated object { results: [...] }
        const categoryList = categories?.results || [];
        const selectedCat = categoryList.find(c => c.id == formData.category);
        const slug = selectedCat?.slug;

        // Include details if we are on/past the details step (Step 2 now)
        const includeDetails = wizardStep >= 2;

        const isVet = slug === 'veterinary' && includeDetails;
        const isFoster = slug === 'foster' && includeDetails;
        const isTrainer = slug === 'training' && includeDetails;
        const isGroomer = slug === 'grooming' && includeDetails;
        const isSitter = slug === 'pet_sitting' && includeDetails;

        return {
            ...formData,
            category_id: formData.category,
            contact_phone: formData.phone,
            contact_email: formData.email,
            // Nested Payloads
            ...(isFoster && {
                foster_details: {
                    daily_rate: formData.daily_rate,
                    monthly_rate: formData.monthly_rate || (formData.daily_rate * 30).toFixed(0),
                    capacity: formData.capacity,
                    species_accepted_ids: formData.species_ids
                }
            }),
            ...(isVet && {
                vet_details: {
                    clinic_type: formData.clinic_type,
                    emergency_services: formData.emergency_services,
                    pricing_info: formData.pricing_info,
                    services_offered_ids: formData.services_ids,
                    species_treated_ids: formData.species_ids
                }
            }),
            ...(isTrainer && {
                trainer_details: {
                    years_experience: formData.years_experience,
                    species_trained_ids: formData.species_ids,
                    private_session_rate: formData.base_price, // Map base_price to private_session_rate
                }
            }),
            ...(isGroomer && {
                groomer_details: {
                    base_price: formData.base_price,
                    species_accepted_ids: formData.species_ids
                }
            }),
            ...(isSitter && {
                sitter_details: {
                    service_radius_km: formData.service_radius_km,
                    walking_rate: formData.walking_rate,
                    house_sitting_rate: formData.house_sitting_rate,
                    drop_in_rate: formData.drop_in_rate,
                    species_accepted_ids: formData.species_ids
                }
            }),
        };
    };

    // Race condition handling: if we just created a profile, query might still return null (cached 404)
    const [createdProfileId, setCreatedProfileId] = useState(null);

    const saveDraft = async (advance = false) => {
        const payload = constructPayload();
        try {
            const effectiveId = providerProfile?.id || createdProfileId;

            if (effectiveId) {
                await updateProfile.mutateAsync({ id: effectiveId, data: payload });
            } else {
                const response = await createProfile.mutateAsync({ ...payload, application_status: 'draft' });
                if (response?.data?.id) {
                    setCreatedProfileId(response.data.id);
                }
            }
            if (advance) setWizardStep(prev => prev + 1);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save. Please check all fields.");
        }
    };

    // --- Step Specific Handlers ---

    // Step 1: Basic Info
    const handleBasicInfoNext = () => saveDraft(true);

    // Step 2: Details
    const handleDetailsNext = (shouldAdvance) => saveDraft(shouldAdvance);

    // Step 3: Media
    const handleSaveMedia = async (mediaList) => {
        const effectiveId = providerProfile?.id || createdProfileId;
        if (!effectiveId) return;
        try {
            await updateMedia.mutateAsync({ id: effectiveId, data: mediaList });
            toast.success("Media updated!");
        } catch (e) { toast.error("Media update failed"); }
    };
    const handleMediaNext = () => setWizardStep(4);

    // Step 4: Hours
    const handleSaveHours = async (hoursList) => {
        const effectiveId = providerProfile?.id || createdProfileId;
        if (!effectiveId) return;
        try {
            await updateHours.mutateAsync({ id: effectiveId, data: hoursList });
            toast.success("Hours updated!");
        } catch (e) { toast.error("Hours update failed"); }
    };

    const handleSubmit = async () => {
        if (!providerProfile?.id) return;
        try {
            await submitApplication.mutateAsync(providerProfile.id);
            setWizardStep(5);
        } catch (e) { toast.error("Submission failed."); }
    };


    // --- Render ---

    if (authLoading || profileLoading || categoriesLoading) {
        return <div className="h-screen flex items-center justify-center"><Loader className="animate-spin text-brand-primary" /></div>;
    }

    if (user?.role === 'service_provider') {
        return (
            <div className="min-h-screen bg-bg-primary">
                <Navbar />
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">You are already a Service Provider!</h2>
                    <button onClick={() => navigate('/provider/dashboard')} className="text-brand-primary hover:underline">Go to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Progress Bar (Visible wizard steps < 5) */}
                {wizardStep < 5 && (
                    <div className="mb-8">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-primary transition-all duration-500 ease-out"
                                style={{ width: `${(wizardStep / 4) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-text-secondary mt-2">
                            <span>Category</span>
                            <span>Basic Info</span>
                            <span>Details</span>
                            <span>Media</span>
                            <span>Hours</span>
                        </div>
                    </div>
                )}

                {/* Wizard Steps */}

                {wizardStep === 0 && (
                    <CategorySelectionStep
                        categories={categories?.results || []}
                        selectedCategory={formData.category}
                        onSelect={handleCategorySelect}
                        isLoading={categoriesLoading}
                    />
                )}

                {wizardStep === 1 && (
                    <BasicInfoStep
                        formData={formData}
                        handleChange={handleChange}
                        categories={categories?.results || []}
                        onNext={handleBasicInfoNext}
                        onBack={() => setWizardStep(0)}
                        isSaving={updateProfile.isPending || createProfile.isPending}
                    />
                )}

                {wizardStep === 2 && (
                    <ServiceDetailsStep
                        formData={formData}
                        handleChange={handleChange}
                        handleMultiSelect={handleMultiSelect}
                        categories={categories?.results || []}
                        speciesList={speciesList?.results || []}
                        serviceOptions={serviceOptions?.results || []}
                        onNext={handleDetailsNext}
                        onBack={() => setWizardStep(1)}
                        isSaving={updateProfile.isPending || createProfile.isPending}
                    />
                )}

                {wizardStep === 3 && (
                    <MediaStep
                        media={providerProfile?.media || []}
                        onSaveMedia={handleSaveMedia}
                        onNext={handleMediaNext}
                        onBack={() => setWizardStep(2)}
                        isLoading={updateMedia.isPending}
                    />
                )}

                {wizardStep === 4 && (
                    <BusinessHoursStep
                        hours={providerProfile?.hours || []}
                        onSaveHours={handleSaveHours}
                        onSubmit={handleSubmit}
                        isSubmitting={submitApplication.isPending}
                        isLoading={updateHours.isPending}
                        onBack={() => setWizardStep(3)}
                    />
                )}

                {wizardStep === 5 && <CompletionStep />}

            </div>
        </div>
    );
};

export default ServiceProviderRegistrationPage;
