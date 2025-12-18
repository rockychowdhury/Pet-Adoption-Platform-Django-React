import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Camera,
    Plus,
    X,
    UploadCloud,
    ChevronRight,
    Check,
    Info,
    Dog,
    Cat,
    Bird,
    Rabbit,
    Heart,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import Button from '../../components/common/Buttons/Button';
import { uploadToImgBB } from '../../utils/imgbb';

const PetCreatePage = () => {
    const navigate = useNavigate();
    const api = useAPI();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        species: 'dog',
        breed: '',
        birth_date: '',
        age: '',
        gender: 'male',
        weight: '',
        size: 'm',
        personality_traits: [],
        fun_facts: '',
        gotcha_day: '',
        is_vaccinated: false,
        is_spayed_neutered: false,
        has_aggression_history: false,
        aggression_details: '',
        description: '',
        is_active: true,
        photos: [],
        profile_photo: ''
    });

    const steps = [
        { id: 1, label: 'Identity', icon: <Heart className="w-4 h-4" /> },
        { id: 2, label: 'Visuals', icon: <Camera className="w-4 h-4" /> },
        { id: 3, label: 'About', icon: <Info className="w-4 h-4" /> }
    ];

    const speciesOptions = [
        { id: 'dog', label: 'Dog', icon: <Dog size={24} /> },
        { id: 'cat', label: 'Cat', icon: <Cat size={24} /> },
        { id: 'rabbit', label: 'Rabbit', icon: <Rabbit size={24} /> },
        { id: 'bird', label: 'Bird', icon: <Bird size={24} /> },
        { id: 'other', label: 'Other', icon: <Plus size={24} /> },
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        const uploadPromises = files.map(file => uploadToImgBB(file));

        try {
            const uploadedUrls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...uploadedUrls],
                // Set first photo as profile photo if empty
                profile_photo: prev.profile_photo || uploadedUrls[0]
            }));

            if (errors.photos) {
                setErrors(prev => ({ ...prev, photos: null }));
            }
            toast.success(`${files.length} photo(s) uploaded successfully!`);
        } catch (error) {
            console.error("Upload to ImgBB failed:", error);
            toast.error("Failed to upload some images. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removePhoto = (index) => {
        setFormData(prev => {
            const updatedPhotos = prev.photos.filter((_, i) => i !== index);
            return {
                ...prev,
                photos: updatedPhotos,
                profile_photo: prev.profile_photo === prev.photos[index]
                    ? (updatedPhotos[0] || '')
                    : prev.profile_photo
            };
        });
    };

    const validateStep = (step) => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Name is required';
            if (!formData.species) newErrors.species = 'Species is required';
            if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
        } else if (step === 2) {
            // Photos are optional but recommended
        } else if (step === 3) {
            if (formData.description && formData.description.length > 500) {
                newErrors.description = 'Description must be under 500 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if not on the final step
        if (currentStep < 3) {
            nextStep(); // Allow Enter to move to next step instead of submitting
            return;
        }

        if (!validateStep(3)) return;

        setIsLoading(true);
        try {
            await api.post('/user/pets/', {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                birth_date: formData.birth_date || null,
                gotcha_day: formData.gotcha_day || null
            });
            toast.success(`${formData.name} is now part of PetCircle! 🐾`);
            navigate('/dashboard/my-pets');
        } catch (error) {
            console.error(error);
            let message = "Failed to create pet profile. Please try again.";

            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    message = error.response.data;
                } else if (error.response.data.detail) {
                    message = error.response.data.detail;
                } else {
                    // Handle validation errors (object with field arrays)
                    const firstError = Object.values(error.response.data)[0];
                    if (Array.isArray(firstError)) {
                        message = firstError[0];
                    }
                }
            }
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/my-pets')}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-4 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to My Pets
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-2">
                            Add a New <span className="text-brand-primary">Companion</span>
                        </h1>
                        <p className="text-lg text-text-secondary font-medium">Let's create a beautiful profile for your friend.</p>
                    </div>

                    {/* Stepper UI */}
                    <div className="bg-white/70 backdrop-blur-md border border-white/50 p-1.5 rounded-2xl shadow-xl flex gap-1 items-center">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.id}>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${currentStep === step.id
                                    ? 'bg-brand-primary text-text-inverted shadow-lg shadow-brand-primary/20'
                                    : currentStep > step.id
                                        ? 'text-status-success bg-status-success/10'
                                        : 'text-text-tertiary opacity-60'
                                    }`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === step.id
                                        ? 'bg-text-inverted/20'
                                        : currentStep > step.id ? 'bg-status-success/20' : 'bg-bg-secondary'
                                        }`}>
                                        {currentStep > step.id ? <Check size={14} strokeWidth={3} /> : step.id}
                                    </div>
                                    <span className="text-sm font-bold whitespace-nowrap hidden sm:block">
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="w-4 h-[2px] bg-gray-100 rounded-full"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    {/* Main Form Content */}
                    <div className="bg-bg-surface/80 backdrop-blur-xl border border-border p-8 md:p-12 rounded-[2.5rem] shadow-soft relative animate-in zoom-in-95 duration-500">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-10">

                            {/* STEP 1: IDENTITY */}
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                    <div className="pb-6 border-b border-border">
                                        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                                <Heart size={20} />
                                            </div>
                                            Basic Identity
                                        </h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-secondary ml-1">Pet Name <span className="text-brand-primary">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Luna"
                                                value={formData.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                className={`w-full bg-bg-secondary/50 border-2 rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary ${errors.name ? 'border-status-error/20 focus:border-status-error' : 'border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner'
                                                    }`}
                                            />
                                            {errors.name && <p className="text-status-error text-xs font-bold ml-2">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-secondary ml-1">Breed <span className="text-brand-primary">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Golden Retriever"
                                                value={formData.breed}
                                                onChange={(e) => handleChange('breed', e.target.value)}
                                                className={`w-full bg-bg-secondary/50 border-2 rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary ${errors.breed ? 'border-status-error/20 focus:border-status-error' : 'border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner'
                                                    }`}
                                            />
                                            {errors.breed && <p className="text-status-error text-xs font-bold ml-2">{errors.breed}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-text-secondary ml-1">Species</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            {speciesOptions.map(option => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => handleChange('species', option.id)}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all group ${formData.species === option.id
                                                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                        : 'border-transparent bg-bg-secondary text-text-tertiary hover:bg-bg-secondary/80'
                                                        }`}
                                                >
                                                    <div className={`mb-2 transition-transform duration-300 ${formData.species === option.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                        {option.icon}
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-wider">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-secondary ml-1">Gender</label>
                                            <div className="bg-bg-secondary p-1 rounded-2xl flex gap-1">
                                                {['male', 'female', 'unknown'].map(g => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => handleChange('gender', g)}
                                                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.gender === g
                                                            ? 'bg-bg-surface text-text-primary shadow-soft'
                                                            : 'text-text-tertiary hover:bg-bg-surface/50'
                                                            }`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-secondary ml-1 flex items-center justify-between">
                                                Age
                                                <span className="text-[10px] font-medium text-text-tertiary bg-bg-secondary px-2 py-0.5 rounded-full">In Years</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 2"
                                                min="0"
                                                value={formData.age}
                                                onChange={(e) => handleChange('age', e.target.value)}
                                                className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <label className="text-sm font-bold text-text-secondary ml-1">Size & Weight</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-bg-secondary p-1 rounded-2xl flex gap-1">
                                                {['xs', 's', 'm', 'l', 'xl'].map(s => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => handleChange('size', s)}
                                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.size === s
                                                            ? 'bg-bg-surface text-text-primary shadow-soft'
                                                            : 'text-text-tertiary hover:bg-bg-surface/50'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder="Weight (lbs)"
                                                    value={formData.weight}
                                                    onChange={(e) => handleChange('weight', e.target.value)}
                                                    className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: VISUALS */}
                            {currentStep === 2 && (
                                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                    <div className="pb-6 border-b border-border">
                                        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-status-info/10 text-status-info flex items-center justify-center">
                                                <Camera size={20} />
                                            </div>
                                            Photos & Media
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {/* Upload Trigger */}
                                            <div className="relative aspect-square">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`h-full w-full rounded-[2rem] border-2 border-dashed border-border bg-bg-secondary/50 flex flex-col items-center justify-center gap-3 transition-colors ${isUploading ? 'opacity-50' : 'group-hover:bg-bg-secondary'}`}>
                                                    <div className="w-12 h-12 rounded-2xl bg-bg-surface shadow-soft flex items-center justify-center text-text-tertiary">
                                                        {isUploading ? (
                                                            <div className="w-6 h-6 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Plus size={24} />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-text-secondary">
                                                        {isUploading ? 'Uploading...' : 'Add Photos'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Preview Grid */}
                                            {formData.photos.map((photo, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-lg">
                                                    <img src={photo} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(idx)}
                                                            className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                    {photo === formData.profile_photo && (
                                                        <div className="absolute top-4 left-4 bg-orange-500 font-bold text-[10px] text-white px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
                                                            PRIMARY
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-status-info/5 rounded-3xl p-6 border border-status-info/10 flex gap-4">
                                            <div className="w-10 h-10 shrink-0 rounded-xl bg-status-info/10 text-status-info flex items-center justify-center">
                                                <Info size={18} />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-text-primary">Pro Tip</h4>
                                                <p className="text-xs text-text-secondary leading-relaxed font-medium">Profiles with at least 3 high-quality photos get 80% more engagement. Use natural lighting if possible!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: DETAILS */}
                            {currentStep === 3 && (
                                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                    <div className="pb-6 border-b border-border">
                                        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                                                <Check size={20} />
                                            </div>
                                            Final Touches
                                        </h2>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-secondary ml-1">Gotcha Day (Optional)</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={formData.gotcha_day}
                                                        onChange={(e) => handleChange('gotcha_day', e.target.value)}
                                                        className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary"
                                                    />
                                                    <Heart className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-primary/30 pointer-events-none" size={18} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-text-secondary ml-1">Birth Date (Optional)</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={formData.birth_date}
                                                        onChange={(e) => handleChange('birth_date', e.target.value)}
                                                        className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary"
                                                    />
                                                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-text-secondary ml-1">Health Status</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.is_vaccinated ? 'border-status-success bg-status-success/10 text-status-success' : 'border-border bg-bg-secondary text-text-tertiary'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_vaccinated}
                                                        onChange={(e) => handleChange('is_vaccinated', e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    <Check size={16} className={formData.is_vaccinated ? 'opacity-100' : 'opacity-20'} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Vaccinated</span>
                                                </label>
                                                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.is_spayed_neutered ? 'border-status-success bg-status-success/10 text-status-success' : 'border-border bg-bg-secondary text-text-tertiary'}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_spayed_neutered}
                                                        onChange={(e) => handleChange('is_spayed_neutered', e.target.checked)}
                                                        className="hidden"
                                                    />
                                                    <Check size={16} className={formData.is_spayed_neutered ? 'opacity-100' : 'opacity-20'} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Spayed/Neutered</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-text-secondary ml-1">Personality Traits</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Playful', 'Calm', 'Energetic', 'Friendly', 'Quiet', 'Guard', 'Social', 'Lap-pet', 'Smart', 'Lazy'].map(trait => (
                                                    <button
                                                        key={trait}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = formData.personality_traits;
                                                            if (current.includes(trait)) {
                                                                handleChange('personality_traits', current.filter(t => t !== trait));
                                                            } else if (current.length < 5) {
                                                                handleChange('personality_traits', [...current, trait]);
                                                            } else {
                                                                toast.info("Max 5 traits allowed");
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${formData.personality_traits.includes(trait)
                                                            ? 'bg-brand-primary border-brand-primary text-text-inverted shadow-lg shadow-brand-primary/20'
                                                            : 'bg-bg-surface border-border text-text-tertiary hover:border-brand-primary/40'
                                                            }`}
                                                    >
                                                        {trait}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-text-tertiary font-medium ml-1">Select up to 5 traits that best describe them.</p>
                                        </div>

                                        <div className={`space-y-4 p-6 rounded-3xl border-2 transition-all ${formData.has_aggression_history ? 'border-status-error/30 bg-status-error/5' : 'border-border bg-bg-secondary/30'}`}>
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <div>
                                                    <p className="font-bold text-text-primary">Aggression History Disclosure</p>
                                                    <p className="text-[10px] text-text-tertiary font-medium">Has this pet ever bitten or shown aggression?</p>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.has_aggression_history}
                                                        onChange={(e) => handleChange('has_aggression_history', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-12 h-6 bg-bg-secondary rounded-full peer peer-checked:bg-status-error transition-colors"></div>
                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-bg-surface rounded-full transition-transform peer-checked:translate-x-6"></div>
                                                </div>
                                            </label>
                                            {formData.has_aggression_history && (
                                                <textarea
                                                    placeholder="Please provide details about any incidents. Honesty is mandatory for legal safety."
                                                    value={formData.aggression_details}
                                                    onChange={(e) => handleChange('aggression_details', e.target.value)}
                                                    className="w-full h-24 bg-bg-surface border-2 border-status-error/20 rounded-2xl px-4 py-3 outline-none focus:border-status-error transition-all text-sm font-medium text-text-primary resize-none placeholder:text-text-tertiary"
                                                ></textarea>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-secondary ml-1">Fun Facts & Quirks</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Loves to chase ice cubes, sleeps upside down"
                                                value={formData.fun_facts}
                                                onChange={(e) => handleChange('fun_facts', e.target.value)}
                                                className="w-full bg-bg-secondary/50 border-2 border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner rounded-[1.25rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-text-secondary ml-1 flex items-center justify-between">
                                                Description
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${formData.description.length > 450 ? 'bg-status-error/10 text-status-error' : 'bg-bg-secondary text-text-tertiary'}`}>
                                                    {formData.description.length}/500
                                                </span>
                                            </label>
                                            <textarea
                                                placeholder="Describe your pet's personality, favorite toys, or quirky habits..."
                                                value={formData.description}
                                                onChange={(e) => handleChange('description', e.target.value)}
                                                className={`w-full h-32 bg-bg-secondary/50 border-2 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-200 font-medium text-text-primary placeholder:text-text-tertiary resize-none ${errors.description ? 'border-status-error/20 focus:border-status-error' : 'border-transparent focus:border-brand-primary/30 focus:bg-bg-surface focus:shadow-inner'
                                                    }`}
                                            ></textarea>
                                            {errors.description && <p className="text-status-error text-xs font-bold ml-2">{errors.description}</p>}
                                        </div>

                                        <label className="flex items-center gap-4 bg-bg-secondary/50 p-6 rounded-[1.5rem] cursor-pointer hover:bg-bg-surface hover:shadow-soft transition-all group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={(e) => handleChange('is_active', e.target.checked)}
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
                                    </div>
                                </div>
                            )}

                            {/* Footer Navigation */}
                            <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-12">
                                <button
                                    type="button"
                                    onClick={currentStep > 1 ? prevStep : () => navigate('/dashboard/my-pets')}
                                    className="px-8 py-4 rounded-2xl font-bold text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-all flex items-center gap-2"
                                >
                                    {currentStep > 1 ? <ArrowLeft size={16} /> : null}
                                    {currentStep > 1 ? 'Back' : 'Cancel'}
                                </button>

                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={isUploading}
                                        className="bg-text-primary text-text-inverted px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-soft flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? 'Uploading Photos...' : 'Next Step'}
                                        {!isUploading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-brand-primary text-text-inverted px-12 py-4 rounded-2xl font-black tracking-tight hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? 'Creating Magic...' : 'Publish Profile'}
                                        <Check size={20} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Sidebar / Summary Card */}
                    <div className="hidden lg:block space-y-6">
                        <div className="bg-bg-surface/50 backdrop-blur-md border border-border p-6 rounded-[2rem] shadow-soft space-y-6">
                            <h3 className="font-black text-text-primary uppercase tracking-tighter">Live Preview</h3>

                            <div className="bg-bg-surface rounded-[1.5rem] overflow-hidden shadow-soft border border-border group">
                                <div className="aspect-[4/5] bg-bg-secondary relative overflow-hidden">
                                    {formData.profile_photo || formData.photos[0] ? (
                                        <img src={formData.profile_photo || formData.photos[0]} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-text-tertiary gap-4">
                                            <div className="w-20 h-20 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                                                <Dog size={40} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">No Photo Yet</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary shadow-sm">
                                        {formData.species}
                                    </div>
                                </div>
                                <div className="p-6 space-y-2">
                                    <h4 className="text-xl font-bold text-text-primary truncate">
                                        {formData.name || 'Your Pet Name'}
                                    </h4>
                                    <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest truncate">
                                        {formData.breed || 'Unknown Breed'}
                                    </p>
                                    <div className="flex gap-2 pt-2">
                                        <div className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-lg uppercase">
                                            {formData.gender}
                                        </div>
                                        <div className="px-3 py-1 bg-status-info/10 text-status-info text-[10px] font-black rounded-lg">
                                            {formData.age ? `${formData.age} years` : 'Age unknown'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-primary text-text-inverted p-6 rounded-[1.5rem] shadow-lg shadow-brand-primary/20 space-y-3 relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                                    <Heart size={100} fill="white" />
                                </div>
                                <h4 className="font-bold text-sm">Join the Community</h4>
                                <p className="text-[11px] font-medium leading-relaxed opacity-90">By creating a pet profile, you're joining a network of thousands of pet lovers dedicated to animal welfare.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetCreatePage;
