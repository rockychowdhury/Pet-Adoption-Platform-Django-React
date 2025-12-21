import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Home, Users, Briefcase, ChevronRight, CheckCircle, Activity, Heart, ChevronLeft } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Form/Input';
import Radio from '../../components/common/Form/Radio';

const SECTIONS = [
    { id: 'housing', label: 'Housing', icon: Home },
    { id: 'household', label: 'Household', icon: Users },
    { id: 'lifestyle', label: 'Lifestyle', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Heart },
];

const AdoptionProfileSetupPage = () => {
    const navigate = useNavigate();
    const api = useAPI();
    const [activeSection, setActiveSection] = useState('housing');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            housing_type: 'house',
            own_or_rent: 'own',
            yard_type: 'medium_fenced',
            num_adults: 1,
            num_children: 0,
            work_schedule: '',
            activity_level: 3,
            why_adopt: '',
            pet_experience: { dogs: 0, cats: 0 }
        }
    });

    // Check for existing profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/adoption/adopter-profile/me/');
                const data = res.data;
                // Pre-fill form
                if (data.id) {
                    Object.keys(data).forEach(key => {
                        setValue(key, data[key]);
                    });
                }
            } catch (err) {
                // No profile yet, continue
            }
        };
        fetchProfile();
    }, [api, setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Check if exists logic handled by backend usually, or we use specific update endpoint
            // Assuming the ViewSet handles get_or_create logic or we post to a generic endpoint

            // To be safe, we might try POST first, if fails 400 (exists) then PATCH? 
            // Or use the /me/ endpoint if available for updates. 
            // Since `AdopterProfileViewSet` has `me` action but typically ModelViewSet uses ID.
            // Let's assume we can POST to /adoption/adopter-profile/ if not exists, or PATCH if we had ID.
            // For simplicity, let's try to grab ID from prev fetch or assume strict flow.
            // If we are strictly "Setup", maybe just POST.

            // Actually, backend viewset `AdopterProfileViewSet` `me` action returns serializer data.
            // Let's rely on standard ModelViewSet: create logic should auto-attach user.

            // Since we need to update if exists:
            const res = await api.get('/adoption/adopter-profile/me/');
            if (res.data.id) {
                await api.patch(`/adoption/adopter-profile/${res.data.id}/`, data);
                toast.success('Profile updated successfully');
            } else {
                await api.post('/adoption/adopter-profile/', data);
                toast.success('Profile created successfully');
            }

            navigate('/dashboard/applications/profile');
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        const idx = SECTIONS.findIndex(s => s.id === activeSection);
        if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].id);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'housing':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4">Tell us about your home</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Housing Type</label>
                                <select {...register('housing_type')} className="w-full p-3 border border-border rounded-xl">
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="condo">Condo</option>
                                    <option value="townhouse">Townhouse</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Own or Rent?</label>
                                <div className="flex gap-4 mt-2">
                                    <Radio label="Own" value="own" checked={watch('own_or_rent') === 'own'} onChange={() => setValue('own_or_rent', 'own')} />
                                    <Radio label="Rent" value="rent" checked={watch('own_or_rent') === 'rent'} onChange={() => setValue('own_or_rent', 'rent')} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Yard Description</label>
                                <select {...register('yard_type')} className="w-full p-3 border border-border rounded-xl">
                                    <option value="none">No Yard</option>
                                    <option value="small_unfenced">Small Unfenced</option>
                                    <option value="small_fenced">Small Fenced</option>
                                    <option value="medium_fenced">Medium Fenced</option>
                                    <option value="large_fenced">Large Fenced</option>
                                    <option value="acreage">Acreage</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'household':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4">Who lives here?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Number of Adults" type="number" name="num_adults" register={register} />
                            <Input label="Number of Children" type="number" name="num_children" register={register} />
                        </div>
                    </div>
                );
            case 'lifestyle':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4">Your Routine</h2>
                        <Input label="Work Schedule (e.g. 9-5, WFH)" name="work_schedule" register={register} placeholder="e.g. Work from home Mon-Fri" />
                        <div>
                            <label className="block text-sm font-semibold mb-2">Activity Level (1-5)</label>
                            <input type="range" min="1" max="5" step="1" {...register('activity_level')} className="w-full" />
                            <div className="flex justify-between text-xs text-text-tertiary mt-1">
                                <span>Sedentary</span>
                                <span>Very Active</span>
                            </div>
                        </div>
                    </div>
                );
            case 'experience':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4">Pet Experience</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Years owning dogs" type="number" {...register('pet_experience.dogs')} />
                            <Input label="Years owning cats" type="number" {...register('pet_experience.cats')} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Why do you want to adopt?</label>
                            <textarea {...register('why_adopt')} className="w-full p-3 border border-border rounded-xl h-32" placeholder="Tell us a bit about why you're looking for a new family member..." />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6 pl-0">
                    <ChevronLeft size={20} /> Back
                </Button>

                <h1 className="text-3xl font-black font-logo mb-2">Adopter Profile</h1>
                <p className="text-text-secondary mb-8">This info helps owners know if you're a good match.</p>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Steps */}
                    <div className="w-full md:w-64 space-y-2">
                        {SECTIONS.map((section, idx) => {
                            const isActive = activeSection === section.id;
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive
                                        ? 'bg-brand-primary text-text-inverted'
                                        : 'bg-white text-text-secondary border border-transparent hover:border-gray-200'}`}
                                >
                                    <Icon size={18} />
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Form */}
                    <div className="flex-1">
                        <Card className="p-8 min-h-[400px] flex flex-col">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                                <div className="flex-1">
                                    {renderSection()}
                                </div>
                                <div className="mt-8 pt-8 border-t border-border flex justify-end gap-3">
                                    {activeSection !== SECTIONS[SECTIONS.length - 1].id ? (
                                        <Button type="button" onClick={handleNext} variant="primary">Next</Button>
                                    ) : (
                                        <Button type="submit" variant="primary" isLoading={isSubmitting}>Save Profile</Button>
                                    )}
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdoptionProfileSetupPage;
