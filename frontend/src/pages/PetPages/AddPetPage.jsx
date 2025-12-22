import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import useImgBB from '../../hooks/useImgBB';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Form/Input';
import Radio from '../../components/common/Form/Radio';
import {
    ChevronRight, ArrowLeft, CheckCircle, Upload, PawPrint, Heart, Activity, X, Loader2,
    Camera, Info, Dog, Cat, Rabbit, Bird, Plus, Check, Calendar, Sparkles
} from 'lucide-react';

const SECTIONS = [
    { id: 'basic', label: 'Identity', icon: PawPrint },
    { id: 'photos', label: 'Visuals', icon: Camera },
    { id: 'personality', label: 'Personality', icon: Heart },
    { id: 'medical', label: 'Health', icon: Activity },
];

const SPECIES_OPTIONS = [
    { value: 'dog', label: 'Dog', icon: <Dog size={24} /> },
    { value: 'cat', label: 'Cat', icon: <Cat size={24} /> },
    { value: 'rabbit', label: 'Rabbit', icon: <Rabbit size={24} /> },
    { value: 'bird', label: 'Bird', icon: <Bird size={24} /> },
    { value: 'other', label: 'Other', icon: <Plus size={24} /> },
];

const PERSONALITY_TRAITS = [
    'Playful', 'Calm', 'Energetic', 'Affectionate', 'Independent', 'Friendly', 'Shy', 'Protective', 'Curious', 'Lazy', 'Good with Kids', 'Good with Dogs', 'Good with Cats'
];

const SIZE_OPTIONS = [
    { value: 'xs', label: 'XS (0-10 lbs)' },
    { value: 'small', label: 'Small (11-25 lbs)' },
    { value: 'medium', label: 'Medium (26-60 lbs)' },
    { value: 'large', label: 'Large (61-100 lbs)' },
    { value: 'xl', label: 'XL (100+ lbs)' },
];

const AddPetPage = () => {
    const { id: paramId } = useParams();
    const navigate = useNavigate();
    const api = useAPI();
    const { user } = useAuth();
    const { uploadImage, uploading } = useImgBB();

    // Draft State
    const [petId, setPetId] = useState(paramId || null);
    const [isDraftCreated, setIsDraftCreated] = useState(!!paramId);

    const [activeSection, setActiveSection] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);

    const { register, control, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: {
            pet_name: '',
            species: 'dog',
            breed: '',
            age: '',
            birth_date: '',
            gender: 'unknown',
            size: 'medium',
            weight: '',
            color: '',
            rehoming_story: '',
            personality_traits: [],
            is_active: true,
            medical_history: {
                spayed_neutered: false,
                vaccinations_up_to_date: false,
                microchipped: false,
                microchip_number: '',
                medical_conditions: ''
            },
            photos: []
        }
    });

    const watchedValues = watch();

    const getPayload = useCallback((data) => ({
        name: data.pet_name,
        species: data.species,
        breed: data.breed,
        age: parseInt(data.age || 0),
        birth_date: data.birth_date || null,
        gender: data.gender,
        size_category: data.size,
        weight: parseFloat(data.weight) || 0,
        description: data.rehoming_story,
        photos: data.photos,
        personality_traits: data.personality_traits,
        is_active: data.is_active,
        is_spayed_neutered: data.medical_history?.spayed_neutered,
        is_microchipped: data.medical_history?.microchipped,
        microchip_number: data.medical_history?.microchip_number,
        health_status: data.medical_history?.medical_conditions,
    }), []);

    // Load Existing Pet
    useEffect(() => {
        if (paramId) {
            const fetchPet = async () => {
                try {
                    const res = await api.get(`/pets/profiles/${paramId}/`);
                    const pet = res.data;
                    const formData = {
                        pet_name: pet.pet_name || pet.name,
                        species: pet.species,
                        breed: pet.breed || '',
                        age: pet.age || '',
                        birth_date: pet.birth_date || '',
                        gender: pet.gender || 'unknown',
                        size: pet.size_category || 'medium',
                        weight: pet.weight || '',
                        rehoming_story: pet.description || pet.rehoming_story || '',
                        personality_traits: pet.personality_traits || [],
                        is_active: pet.is_active ?? true,
                        medical_history: {
                            spayed_neutered: pet.is_spayed_neutered || false,
                            vaccinations_up_to_date: false,
                            microchipped: pet.is_microchipped || false,
                            microchip_number: pet.microchip_number || '',
                            medical_conditions: pet.health_status || ''
                        },
                        photos: pet.photos || []
                    };
                    Object.keys(formData).forEach(key => setValue(key, formData[key]));
                } catch (error) {
                    console.error("Failed to fetch pet", error);
                    toast.error("Could not load pet details.");
                }
            };
            fetchPet();
        }
    }, [paramId, api, setValue, user]);

    // Step Navigation Handlers
    const currentSectionIndex = SECTIONS.findIndex(s => s.id === activeSection);
    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === SECTIONS.length - 1;

    const handleNext = async () => {
        const isValid = await trigger();
        if (!isValid) return;

        setIsSaving(true);
        try {
            if (!isDraftCreated) {
                const payload = getPayload(watchedValues);
                const res = await api.post('/pets/profiles/', payload);
                const newPetId = res.data.id;
                setPetId(newPetId);
                setIsDraftCreated(true);
                // Update URL without reload
                window.history.replaceState(null, '', `/dashboard/pets/${newPetId}/edit`);
                toast.success("Draft created! You can finish this later.");
            } else {
                // Update existing draft
                const payload = getPayload(watchedValues);
                await api.patch(`/pets/profiles/${petId}/`, payload);
            }
            if (!isLastSection) setActiveSection(SECTIONS[currentSectionIndex + 1].id);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save progress.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrev = () => {
        if (!isFirstSection) setActiveSection(SECTIONS[currentSectionIndex - 1].id);
    };

    const handleFinalSubmit = async () => {
        const isValid = await trigger();
        if (!isValid) return;

        setIsSaving(true);
        try {
            const payload = getPayload(watchedValues);
            if (isDraftCreated) {
                await api.patch(`/pets/profiles/${petId}/`, payload);
            } else {
                await api.post('/pets/profiles/', payload);
            }
            navigate('/dashboard/my-pets');
            toast.success("Profile saved successfully!");
        } catch (error) {
            console.error("Final submit failed", error);
            toast.error("Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);
            const validUrls = results.filter(res => res && res.success).map(res => res.url);
            if (validUrls.length > 0) {
                const current = watch('photos') || [];
                setValue('photos', [...current, ...validUrls].slice(0, 10));
            }
        } catch (err) {
            toast.error("Upload failed");
        }
    };

    const removePhoto = (index) => {
        const currentPhotos = watch('photos') || [];
        setValue('photos', currentPhotos.filter((_, i) => i !== index));
    };

    // --- Render Sections ---
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'basic':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary ml-1">Pet Name <span className="text-brand-primary">*</span></label>
                                <input
                                    {...register('pet_name', { required: "Name is required" })}
                                    className={`w-full bg-bg-secondary/50 border-2 rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary ${errors.pet_name ? 'border-status-error/20 focus:border-status-error' : 'border-transparent focus:border-brand-primary/30 focus:bg-bg-surface'}`}
                                    placeholder="e.g. Luna"
                                />
                                {errors.pet_name && <p className="text-status-error text-xs font-bold ml-2">{errors.pet_name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary ml-1">Breed</label>
                                <input
                                    {...register('breed')}
                                    className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary"
                                    placeholder="e.g. Golden Retriever"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-text-secondary ml-1">Species</label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {SPECIES_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setValue('species', option.value)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all group ${watch('species') === option.value ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-transparent bg-bg-secondary text-text-tertiary hover:bg-bg-secondary/80'}`}
                                    >
                                        <div className={`mb-2 transition-transform duration-300 ${watch('species') === option.value ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {option.icon}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary ml-1">Birth Date</label>
                                    <div className="relative group">
                                        <style>
                                            {`
                                                input[type="date"]::-webkit-calendar-picker-indicator {
                                                    display: none;
                                                    -webkit-appearance: none;
                                                }
                                            `}
                                        </style>
                                        <input
                                            type="date"
                                            {...register('birth_date', {
                                                required: "Birth date is required to calculate age",
                                                onChange: (e) => {
                                                    const birthDate = new Date(e.target.value);
                                                    const today = new Date();
                                                    let age = today.getFullYear() - birthDate.getFullYear();
                                                    const m = today.getMonth() - birthDate.getMonth();
                                                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                        age--;
                                                    }
                                                    setValue('age', Math.max(0, age));
                                                }
                                            })}
                                            className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary pr-12 cursor-pointer"
                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        />
                                        <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-brand-primary transition-colors" size={18} />
                                    </div>
                                    {watch('birth_date') && (
                                        <div className="px-4 py-2 bg-brand-primary/10 rounded-xl text-brand-primary text-xs font-bold inline-flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                            <Sparkles size={14} />
                                            {watch('age') === 0 ? "Less than a year old" : `${watch('age')} Years Old`}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <input type="hidden" {...register('age')} />

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary ml-1">Gender</label>
                                <div className="bg-bg-secondary p-1 rounded-2xl flex gap-1">
                                    {['male', 'female', 'unknown'].map(g => (
                                        <button
                                            key={g} type="button"
                                            onClick={() => setValue('gender', g)}
                                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${watch('gender') === g ? 'bg-bg-surface text-text-primary shadow-soft' : 'text-text-tertiary hover:bg-bg-surface/50'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-text-secondary ml-1">Physical Details</label>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-tertiary ml-1 uppercase tracking-wide">Size Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {SIZE_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value} type="button"
                                                onClick={() => setValue('size', opt.value)}
                                                className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${watch('size') === opt.value ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-transparent bg-bg-secondary text-text-tertiary'}`}
                                                title={opt.label}
                                            >
                                                {opt.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-tertiary ml-1 uppercase tracking-wide">Weight (lbs)</label>
                                    <input
                                        type="number" step="0.1"
                                        {...register('weight')}
                                        className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary"
                                        placeholder="e.g. 15.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'photos':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="relative aspect-square">
                                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <div className={`h-full w-full rounded-[2rem] border-2 border-dashed border-border bg-bg-secondary/50 flex flex-col items-center justify-center gap-3 transition-colors ${uploading ? 'opacity-50' : 'group-hover:bg-bg-secondary'}`}>
                                    <div className="w-12 h-12 rounded-2xl bg-bg-surface shadow-soft flex items-center justify-center text-text-tertiary">
                                        {uploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                                    </div>
                                    <span className="text-xs font-bold text-text-secondary">{uploading ? 'Uploading...' : 'Add Photos'}</span>
                                </div>
                            </div>
                            {(watch('photos') || []).map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-lg">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'personality':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary ml-1">Personality Traits</label>
                            <div className="flex flex-wrap gap-2">
                                <Controller
                                    name="personality_traits" control={control}
                                    render={({ field }) => (
                                        <>
                                            {PERSONALITY_TRAITS.map(trait => (
                                                <button
                                                    key={trait} type="button"
                                                    onClick={() => {
                                                        const current = field.value || [];
                                                        if (current.includes(trait)) field.onChange(current.filter(t => t !== trait));
                                                        else field.onChange([...current, trait]);
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${field.value?.includes(trait) ? 'bg-brand-primary border-brand-primary text-text-inverted' : 'bg-bg-surface border-border text-text-tertiary'}`}
                                                >
                                                    {trait}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary ml-1">Bio / Story</label>
                            <textarea
                                {...register('rehoming_story')}
                                className="w-full h-32 bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary resize-none"
                                placeholder="Tell us about them..."
                            />
                        </div>
                    </div>
                );
            case 'medical':
                return (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${watch('medical_history.spayed_neutered') ? 'border-status-success bg-status-success/10 text-status-success' : 'border-border bg-bg-secondary text-text-tertiary'}`}>
                                    <input type="checkbox" {...register('medical_history.spayed_neutered')} className="hidden" />
                                    <Check size={16} className={watch('medical_history.spayed_neutered') ? 'opacity-100' : 'opacity-20'} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Spayed/Neutered</span>
                                </label>
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${watch('medical_history.microchipped') ? 'border-status-success bg-status-success/10 text-status-success' : 'border-border bg-bg-secondary text-text-tertiary'}`}>
                                    <input type="checkbox" {...register('medical_history.microchipped')} className="hidden" />
                                    <Check size={16} className={watch('medical_history.microchipped') ? 'opacity-100' : 'opacity-20'} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Microchipped</span>
                                </label>
                            </div>
                            {watch('medical_history.microchipped') && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-sm font-bold text-text-secondary ml-1">Microchip Number</label>
                                    <input
                                        {...register('medical_history.microchip_number')}
                                        className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary mt-2"
                                        placeholder="e.g. 981020000123456"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-secondary ml-1">Health Notes</label>
                            <textarea
                                {...register('medical_history.medical_conditions')}
                                className="w-full h-32 bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary resize-none"
                                placeholder="Any allergies or conditions?"
                            />
                        </div>

                        <label className="flex items-center gap-4 bg-bg-secondary/50 p-6 rounded-[1.5rem] cursor-pointer hover:bg-bg-surface hover:shadow-soft transition-all group border-2 border-transparent hover:border-brand-primary/20">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    {...register('is_active')}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-bg-secondary rounded-full peer peer-checked:bg-status-success transition-colors"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-bg-surface rounded-full transition-transform peer-checked:translate-x-6"></div>
                            </div>
                            <div>
                                <p className="font-bold text-text-primary group-hover:text-status-success transition-colors">Visible to Public</p>
                                <p className="text-xs text-text-tertiary font-medium">Determines if other users can discover this profile.</p>
                            </div>
                        </label>
                    </div >
                );
            default: return null;
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary relative overflow-hidden font-sans pb-20 pt-4">
            {/* Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 py-6 md:py-10 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <button onClick={() => navigate('/dashboard/my-pets')} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-4 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to My Pets
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-2">
                            Add a New <span className="text-brand-primary">Companion</span>
                        </h1>
                        <p className="text-lg text-text-secondary font-medium">Create a beautiful profile for your friend.</p>
                    </div>

                    {/* Horizontal Stepper (Visual) */}
                    <div className="bg-white/70 backdrop-blur-md border border-white/50 p-1.5 rounded-2xl shadow-xl flex gap-1 items-center">
                        {SECTIONS.map((section, idx) => {
                            const isActive = activeSection === section.id;
                            const isCompleted = SECTIONS.findIndex(s => s.id === activeSection) > idx;
                            const Icon = section.icon;
                            return (
                                <div key={section.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-primary text-text-inverted shadow-lg' : isCompleted ? 'text-status-success bg-status-success/10' : 'text-text-tertiary opacity-60'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-white/20' : isCompleted ? 'bg-status-success/20' : 'bg-bg-secondary'}`}>
                                        {isCompleted ? <Check size={14} /> : idx + 1}
                                    </div>
                                    <Icon size={16} className={`${isActive ? 'text-white' : ''}`} />
                                    <span className="text-sm font-bold whitespace-nowrap hidden sm:block">{section.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                    {/* Form Card */}
                    <div className="bg-bg-surface/80 backdrop-blur-xl border border-border p-8 md:p-12 rounded-[2.5rem] shadow-soft relative">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
                            {renderSectionContent()}

                            <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12">
                                <button type="button" onClick={handlePrev} disabled={isFirstSection} className={`px-8 py-4 rounded-2xl font-bold text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-all flex items-center gap-2 ${isFirstSection ? 'opacity-0 pointer-events-none' : ''}`}>
                                    <ArrowLeft size={16} /> Previous
                                </button>
                                <div className="flex items-center gap-4">
                                    {isSaving && <Loader2 className="animate-spin text-brand-primary" />}
                                    {isLastSection ? (
                                        <button type="button" onClick={handleFinalSubmit} className="bg-brand-primary text-text-inverted px-12 py-4 rounded-2xl font-black tracking-tight hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-3">
                                            Finish Profile <Check size={20} />
                                        </button>
                                    ) : (
                                        <button type="button" onClick={handleNext} className="bg-text-primary text-text-inverted px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-soft flex items-center gap-2">
                                            Next Step <ChevronRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Live Preview (Custom Inline) */}
                    <div className="hidden lg:block space-y-6">
                        <div className="bg-bg-surface/50 backdrop-blur-md border border-border p-6 rounded-[2rem] shadow-soft space-y-6 sticky top-24">
                            <h3 className="font-black text-text-primary uppercase tracking-tighter">Live Preview</h3>
                            <div className="bg-bg-surface rounded-[1.5rem] overflow-hidden shadow-soft border border-border group">
                                <div className="aspect-[4/5] bg-bg-secondary relative overflow-hidden">
                                    {(watchedValues.photos && watchedValues.photos.length > 0) ? (
                                        <img src={watchedValues.photos[0]} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary gap-4">
                                            <div className="w-20 h-20 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                                                <Dog size={40} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">No Photo Yet</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary shadow-sm">
                                        {watchedValues.species || 'Pet'}
                                    </div>
                                </div>
                                <div className="p-6 space-y-2">
                                    <h4 className="text-xl font-bold text-text-primary truncate">{watchedValues.pet_name || 'Your Pet Name'}</h4>
                                    <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest truncate">{watchedValues.breed || 'Breed Unknown'}</p>
                                    <div className="flex gap-2 pt-2">
                                        <div className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-lg uppercase">{watchedValues.gender}</div>
                                        <div className="px-3 py-1 bg-status-info/10 text-status-info text-[10px] font-black rounded-lg">{watchedValues.age ? `${watchedValues.age} yrs` : 'Age unknown'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-brand-primary text-text-inverted p-6 rounded-[1.5rem] shadow-lg shadow-brand-primary/20 space-y-3 relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12"><Heart size={100} fill="white" /></div>
                                <h4 className="font-bold text-sm">Join the Community</h4>
                                <p className="text-[11px] font-medium leading-relaxed opacity-90">By creating a pet profile, you're joining a network of thousands of pet lovers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPetPage;
