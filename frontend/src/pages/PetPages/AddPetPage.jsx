import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Form/Input';
import Radio from '../../components/common/Form/Radio';
import Checkbox from '../../components/common/Form/Checkbox';
import { ChevronLeft, ChevronRight, CheckCircle, Upload, PawPrint, Heart, Activity } from 'lucide-react';

const SECTIONS = [
    { id: 'basic', label: 'Basic Info', icon: PawPrint },
    { id: 'photos', label: 'Photos', icon: Upload },
    { id: 'personality', label: 'Personality', icon: Heart },
    { id: 'medical', label: 'Medical & Attributes', icon: Activity },
];

const SPECIES_OPTIONS = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'other', label: 'Other' },
];

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Unknown' },
];

const SIZE_OPTIONS = [
    { value: 'xs', label: 'Extra Small (0-10 lbs)' },
    { value: 'small', label: 'Small (11-25 lbs)' },
    { value: 'medium', label: 'Medium (26-60 lbs)' },
    { value: 'large', label: 'Large (61-100 lbs)' },
    { value: 'xl', label: 'Extra Large (100+ lbs)' },
];

const PERSONALITY_TRAITS = [
    'Playful', 'Calm', 'Energetic', 'Affectionate', 'Independent', 'Friendly', 'Shy', 'Protective', 'Curious', 'Lazy', 'Good with Kids', 'Good with Dogs', 'Good with Cats'
];

const AddPetPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const api = useAPI();
    const [activeSection, setActiveSection] = useState('basic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            pet_name: '',
            species: 'dog',
            breed: '',
            age_months: '',
            gender: 'unknown',
            size: 'medium',
            weight: '',
            color: '',
            location_city: '',
            location_state: '',
            rehoming_story: '',
            personality_traits: [],
            medical_history: {
                spayed_neutered: 'no',
                vaccinations_up_to_date: 'no',
                microchipped: false,
                medical_conditions: ''
            },
            photos: []
        }
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchPet = async () => {
                try {
                    const res = await api.get(`/pets/${id}/`);
                    const pet = res.data;
                    setValue('pet_name', pet.pet_name);
                    setValue('species', pet.species);
                    setValue('breed', pet.breed);
                    setValue('age_months', pet.age_months);
                    setValue('gender', pet.gender);
                    setValue('size', pet.size);
                    setValue('weight', pet.weight);
                    setValue('color', pet.color);
                    setValue('location_city', pet.location_city);
                    setValue('location_state', pet.location_state);
                    setValue('rehoming_story', pet.rehoming_story);
                    setValue('medical_history', pet.medical_history || {});

                    if (pet.photos && Array.isArray(pet.photos)) {
                        setPreviewImages(pet.photos);
                        setValue('photos', pet.photos);
                    }

                    if (pet.behavioral_profile?.traits) {
                        setValue('personality_traits', pet.behavioral_profile.traits);
                    }

                } catch (error) {
                    console.error("Failed to fetch pet", error);
                    toast.error("Could not load pet details.");
                    navigate('/dashboard/my-pets');
                }
            };
            fetchPet();
        }
    }, [id, isEditMode, api, setValue, navigate]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                age_months: parseInt(data.age_months) || 0,
                weight: parseFloat(data.weight) || 0,
                behavioral_profile: {
                    ...data.behavioral_profile,
                    traits: data.personality_traits
                },
                photos: data.photos || []
            };

            if (isEditMode) {
                await api.patch(`/pets/${id}/`, payload);
                toast.success('Pet profile updated!');
            } else {
                await api.post('/pets/', payload);
                toast.success('Pet profile created!');
            }
            navigate('/dashboard/my-pets');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save pet profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentSectionIndex = SECTIONS.findIndex(s => s.id === activeSection);
    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === SECTIONS.length - 1;

    const handleNext = () => {
        if (!isLastSection) setActiveSection(SECTIONS[currentSectionIndex + 1].id);
    };

    const handlePrev = () => {
        if (!isFirstSection) setActiveSection(SECTIONS[currentSectionIndex - 1].id);
    };

    // --- Helper for Base64 ---
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        try {
            const base64Files = await Promise.all(files.map(file => convertToBase64(file)));
            const currentPhotos = watch('photos') || [];
            const updatedPhotos = [...currentPhotos, ...base64Files].slice(0, 10);
            setPreviewImages(updatedPhotos);
            setValue('photos', updatedPhotos);
        } catch (err) {
            console.error("Photo upload error", err);
            toast.error("Failed to process photos");
        }
    };

    const removePhoto = (index) => {
        const currentPhotos = watch('photos') || [];
        const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
        setPreviewImages(updatedPhotos);
        setValue('photos', updatedPhotos);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'basic':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Pet Name" name="pet_name" register={register} required error={errors.pet_name} placeholder="e.g. Buddy" />
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">Species</label>
                                <select {...register('species')} className="w-full rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all">
                                    {SPECIES_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Breed" name="breed" register={register} placeholder="e.g. Golden Retriever" />
                            <Input label="Color" name="color" register={register} placeholder="e.g. Golden" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Age (Months)" type="number" name="age_months" register={register} placeholder="e.g. 24" />

                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">Gender</label>
                                <div className="flex gap-4 mt-3">
                                    {GENDER_OPTIONS.map(opt => (
                                        <Radio key={opt.value} label={opt.label} value={opt.value} checked={watch('gender') === opt.value} onChange={() => setValue('gender', opt.value)} name="gender_radio" />
                                    ))}
                                </div>
                            </div>

                            <Input label="Weight (lbs)" type="number" name="weight" register={register} placeholder="e.g. 45" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-2">Size Category</label>
                            <select {...register('size')} className="w-full rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all">
                                {SIZE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="City" name="location_city" register={register} placeholder="e.g. New York" />
                            <Input label="State" name="location_state" register={register} placeholder="e.g. NY" />
                        </div>
                    </div>
                );

            case 'photos':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-bg-secondary/30 hover:bg-bg-secondary hover:border-brand-primary transition-all cursor-pointer relative">
                            <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center gap-3 pointer-events-none">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm">
                                    <Upload size={24} />
                                </div>
                                <p className="font-bold text-text-primary">Click or Drag to Upload Photos</p>
                                <p className="text-xs text-text-tertiary">JPG, PNG up to 5MB. Min 1 required.</p>
                            </div>
                        </div>

                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previewImages.map((src, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-gray-100">
                                        <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removePhoto(idx)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                                            <span className="sr-only">Delete</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                        {idx === 0 && <span className="absolute bottom-2 left-2 bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Main</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'personality':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-3">Rehoming Story / Bio</label>
                            <textarea
                                {...register('rehoming_story')}
                                className="w-full min-h-[150px] rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-y"
                                placeholder="Tell us about your pet's personality, history, and why you are looking for a new home..."
                            />
                            <p className="text-xs text-text-tertiary mt-2 text-right">0 / 1000 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-4">Personality Traits</label>
                            <div className="flex flex-wrap gap-3">
                                <Controller
                                    name="personality_traits"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {PERSONALITY_TRAITS.map(trait => {
                                                const isSelected = field.value.includes(trait);
                                                return (
                                                    <button
                                                        key={trait}
                                                        type="button"
                                                        onClick={() => {
                                                            const newValue = isSelected ? field.value.filter(t => t !== trait) : [...field.value, trait];
                                                            field.onChange(newValue);
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${isSelected
                                                            ? 'bg-brand-primary text-white border-brand-primary'
                                                            : 'bg-white text-text-secondary border-border hover:border-brand-primary/50'}`}
                                                    >
                                                        {trait}
                                                    </button>
                                                );
                                            })}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'medical':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-text-primary border-b border-border pb-2">Medical Status</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-bg-secondary/30 transition-colors">
                                        <input type="checkbox" {...register('medical_history.spayed_neutered')} className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary" />
                                        <span className="font-medium text-text-primary">Spayed / Neutered</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-bg-secondary/30 transition-colors">
                                        <input type="checkbox" {...register('medical_history.vaccinations_up_to_date')} className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary" />
                                        <span className="font-medium text-text-primary">Vaccinations Up to Date</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-bg-secondary/30 transition-colors">
                                        <input type="checkbox" {...register('medical_history.microchipped')} className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary" />
                                        <span className="font-medium text-text-primary">Microchipped</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-text-primary border-b border-border pb-2">Additional Notes</h3>
                                <textarea
                                    {...register('medical_history.medical_conditions')}
                                    placeholder="List any known allergies, chronic conditions, or daily medications..."
                                    className="w-full h-32 rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary font-sans pb-20 pt-8">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/dashboard/my-pets')} className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-secondary">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary font-serif">{isEditMode ? 'Edit Pet Profile' : 'Add New Pet'}</h1>
                        <p className="text-text-secondary">Complete your pet's profile to start the rehoming process.</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Steps Sidebar (Desktop) */}
                    <div className="hidden lg:block w-64 space-y-2">
                        {SECTIONS.map((section, idx) => {
                            const isActive = activeSection === section.id;
                            const isCompleted = SECTIONS.findIndex(s => s.id === activeSection) > idx; // Simple sequential logic
                            const Icon = section.icon;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive
                                        ? 'bg-brand-primary text-text-inverted shadow-lg'
                                        : isCompleted ? 'text-brand-primary bg-brand-primary/10' : 'text-text-tertiary hover:bg-bg-secondary hover:text-text-primary'}`}
                                >
                                    <Icon size={18} />
                                    {section.label}
                                    {isCompleted && <CheckCircle size={16} className="ml-auto" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1">
                        <Card className="p-6 md:p-8 min-h-[500px] flex flex-col">
                            {/* Mobile Step Indicator */}
                            <div className="lg:hidden flex items-center gap-2 mb-6 overflow-x-auto pb-4">
                                {SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSection === section.id
                                            ? 'bg-brand-primary text-text-inverted'
                                            : 'bg-bg-secondary text-text-secondary'}`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                                <div className="flex-1">
                                    {renderSectionContent()}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="mt-8 pt-8 border-t border-border flex justify-between">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handlePrev}
                                        disabled={isFirstSection}
                                        className={isFirstSection ? 'opacity-0 pointer-events-none' : ''}
                                    >
                                        Previous
                                    </Button>

                                    {isLastSection ? (
                                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="min-w-[140px]">
                                            {isEditMode ? 'Save Changes' : 'Create Profile'}
                                        </Button>
                                    ) : (
                                        <Button type="button" variant="primary" onClick={handleNext} className="min-w-[120px]">
                                            Next Step <ChevronRight size={16} className="ml-1" />
                                        </Button>
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

export default AddPetPage;
