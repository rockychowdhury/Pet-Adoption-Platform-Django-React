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
import PetProfileStrengthCard from '../../components/Pet/PetProfileStrengthCard';

const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
    }
    return true;
};

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

// PERSONALITY_TRAITS removed - fetched from API

const SIZE_OPTIONS = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
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
    const [initialPayload, setInitialPayload] = useState(null);

    const [activeSection, setActiveSection] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);

    const [availableTraits, setAvailableTraits] = useState([]);

    const { register, control, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: {
            pet_name: '',
            species: 'dog',
            breed: '',
            birth_date: '',
            gender: 'unknown',
            size: 'medium',
            weight: '',
            rehoming_story: '',
            personality_traits: [],
            medical_history: {
                spayed_neutered: false,
                microchipped: false,
            },
            photos: []
        }
    });

    const watchedValues = watch();

    const getPayload = useCallback((data) => ({
        name: data.pet_name,
        species: data.species,
        breed: data.breed,
        birth_date: data.birth_date || null,
        gender: data.gender,
        size_category: data.size,
        weight_kg: parseFloat(data.weight) || 0,
        description: data.rehoming_story,
        media_data: data.photos, // Send list of {url, delete_url} objects
        traits: data.personality_traits,
        status: 'active', // Default validation status
        spayed_neutered: data.medical_history?.spayed_neutered,
        microchipped: data.medical_history?.microchipped,
    }), []);

    // Load Existing Pet
    useEffect(() => {
        if (paramId) {
            const fetchPet = async () => {
                try {
                    const res = await api.get(`/pets/profiles/${paramId}/`);
                    const pet = res.data;
                    const formData = {
                        pet_name: pet.name,
                        species: pet.species,
                        breed: pet.breed || '',
                        birth_date: pet.birth_date || '',
                        gender: pet.gender || 'unknown',
                        size: pet.size_category || 'medium',
                        weight: pet.weight_kg || '',
                        rehoming_story: pet.description || '',
                        personality_traits: pet.traits ? pet.traits.map(t => t.name) : [],
                        medical_history: {
                            spayed_neutered: pet.spayed_neutered || false,
                            microchipped: pet.microchipped || false,
                        },
                        photos: pet.media ? pet.media.map(m => ({ url: m.url, delete_url: m.delete_url })) : []
                    };
                    Object.keys(formData).forEach(key => setValue(key, formData[key]));

                    // Set initial payload for comparison
                    const initial = getPayload(formData);
                    setInitialPayload(initial);
                } catch (error) {
                    console.error("Failed to fetch pet", error);
                    toast.error("Could not load pet details.");
                }
            };
            fetchPet();
        }
    }, [paramId, api, setValue, user]);

    // Fetch Traits
    useEffect(() => {
        const fetchTraits = async () => {
            try {
                const res = await api.get('/pets/traits/');
                // API might return list or { results: list } if paginated
                const traitsData = Array.isArray(res.data) ? res.data : (res.data.results || []);
                setAvailableTraits(traitsData);
            } catch (error) {
                console.error("Failed to fetch traits", error);
            }
        };
        fetchTraits();
    }, [api]);

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
                setInitialPayload(payload);
                toast.success("Draft created! You can finish this later.");
            } else {
                // Update existing draft
                const payload = getPayload(watchedValues);

                // Only save if data changed
                if (!initialPayload || !deepEqual(payload, initialPayload)) {
                    await api.patch(`/pets/profiles/${petId}/`, payload);
                    setInitialPayload(payload);
                    toast.success("Progress saved.");
                }
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
                if (!initialPayload || !deepEqual(payload, initialPayload)) {
                    await api.patch(`/pets/profiles/${petId}/`, payload);
                }
                toast.success("Profile updated successfully!");
            } else {
                await api.post('/pets/profiles/', payload);
                toast.success("Profile created successfully!");
            }
            navigate('/dashboard/my-pets');
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
            const validPhotos = results.filter(res => res && res.success).map(res => ({
                url: res.url,
                delete_url: res.delete_url
            }));
            if (validPhotos.length > 0) {
                const current = watch('photos') || [];
                setValue('photos', [...current, ...validPhotos].slice(0, 10));
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
                                            className={`w-full bg-bg-secondary/50 border-2 rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary pr-12 cursor-pointer ${errors.birth_date ? 'border-status-error/20 focus:border-status-error' : 'border-transparent focus:border-brand-primary/30 focus:bg-bg-surface'}`}
                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        />
                                        <Calendar className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${errors.birth_date ? 'text-status-error' : 'text-text-tertiary group-focus-within:text-brand-primary'}`} size={18} />
                                    </div>
                                    {errors.birth_date && <p className="text-status-error text-xs font-bold ml-2">{errors.birth_date.message}</p>}
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
                            {(watch('photos') || []).map((photo, idx) => (
                                <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-lg">
                                    <img src={photo.url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                                            {availableTraits.map(traitObj => {
                                                const traitName = traitObj.name;
                                                return (
                                                    <button
                                                        key={traitObj.id} type="button"
                                                        onClick={() => {
                                                            const current = field.value || [];
                                                            if (current.includes(traitName)) field.onChange(current.filter(t => t !== traitName));
                                                            else field.onChange([...current, traitName]);
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${field.value?.includes(traitName) ? 'bg-brand-primary border-brand-primary text-text-inverted' : 'bg-bg-surface border-border text-text-tertiary'}`}
                                                    >
                                                        {traitName}
                                                    </button>
                                                );
                                            })}
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
                            <label className="text-sm font-bold text-text-secondary ml-1">Medical Status</label>
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
                        </div>

                        <div className="bg-bg-secondary/30 p-6 rounded-2xl border border-border/50 flex gap-4">
                            <Info size={24} className="text-brand-primary flex-shrink-0" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-text-primary">Medical Privacy</h4>
                                <p className="text-xs text-text-tertiary leading-relaxed">
                                    We only display the basics (Spayed/Neutered status) publicly. Detailed medical records will be handled securely during the adoption process if needed.
                                </p>
                            </div>
                        </div>
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

                    {/* Mobile Profile Strength (Visible on small screens) */}
                    <div className="lg:hidden mb-8">
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 p-1 rounded-3xl shadow-sm">
                            <div className="bg-bg-surface rounded-[1.25rem] border border-border/50">
                                <PetProfileStrengthCard values={watchedValues} />
                            </div>
                        </div>
                    </div>

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
                                        <img src={watchedValues.photos[0].url} alt="Preview" className="w-full h-full object-cover" />
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

                            {/* Profile Strength Card */}
                            <PetProfileStrengthCard values={watchedValues} />
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default AddPetPage;
