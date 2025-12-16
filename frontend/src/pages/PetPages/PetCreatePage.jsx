import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, X, UploadCloud, ChevronRight, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI'; // Keep hook usage
import Button from '../../components/common/Buttons/Button';

const PetCreatePage = () => {
    const navigate = useNavigate();
    // const api = useAPI(); // Keep ready for integration
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age_value: '',
        age_unit: 'Years',
        gender: 'Male',
        description: '',
        status: 'Active',
        photos: [] // Store file objects or preview URLs
    });

    // Helper for input changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Helper for photo upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    };

    const removePhoto = (index) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation
        setTimeout(() => {
            toast.success("Pet profile created successfully! 🐾");
            setIsLoading(false);
            navigate('/dashboard/my-pets');
        }, 1500);
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-[#FFF8E7] p-4 md:p-12 font-sans text-[#2D2D2D]">
            <div className="max-w-4xl mx-auto">
                {/* Header & Steps */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl font-bold font-serif mb-2">Add New Pet</h1>
                        <p className="text-[#57534E]">Create a profile for your furry friend</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="bg-white rounded-full px-2 py-2 flex items-center shadow-sm">
                        {[
                            { id: 1, label: 'Basic Info' },
                            { id: 2, label: 'Photos' },
                            { id: 3, label: 'Details' }
                        ].map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <button
                                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${currentStep === step.id
                                            ? 'bg-[#2D2D2D] text-white'
                                            : currentStep > step.id
                                                ? 'bg-[#E8F5E9] text-[#2E7D32]' // Completed
                                                : 'text-[#A68A6D]'
                                        }`}
                                >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep === step.id ? 'bg-white text-[#2D2D2D]' : 'bg-current text-white'
                                        }`}>
                                        {currentStep > step.id ? <Check size={12} /> : step.id}
                                    </span>
                                    {step.label}
                                </button>
                                {index < 2 && <div className="w-8 h-[1px] bg-[#E6D4B9] mx-2"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
                    <form onSubmit={handleSubmit}>

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#A68A6D]">
                                        <div className="w-2 h-2 rounded-full border-2 border-current"></div>
                                    </div>
                                    <h2 className="text-2xl font-bold font-serif">Basic Information</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Pet Name <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Luna"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="w-full bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 py-4 outline-none font-medium transition-colors placeholder-[#A68A6D]/40"
                                        />
                                    </div>

                                    {/* Species & Breed */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Species <span className="text-red-400">*</span></label>
                                            <div className="relative">
                                                <select
                                                    value={formData.species}
                                                    onChange={(e) => handleChange('species', e.target.value)}
                                                    className="w-full bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 py-4 outline-none font-medium appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Select species</option>
                                                    <option>Dog</option>
                                                    <option>Cat</option>
                                                    <option>Rabbit</option>
                                                    <option>Bird</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#A68A6D]">▼</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Breed <span className="text-red-400">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Golden Retriever"
                                                value={formData.breed}
                                                onChange={(e) => handleChange('breed', e.target.value)}
                                                className="w-full bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 py-4 outline-none font-medium transition-colors placeholder-[#A68A6D]/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Age */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Age</label>
                                        <div className="flex gap-4">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={formData.age_value}
                                                onChange={(e) => handleChange('age_value', e.target.value)}
                                                className="w-full bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 py-4 outline-none font-medium placeholder-[#A68A6D]/40"
                                            />
                                            <div className="relative w-1/3">
                                                <select
                                                    value={formData.age_unit}
                                                    onChange={(e) => handleChange('age_unit', e.target.value)}
                                                    className="w-full h-full bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 outline-none font-medium appearance-none cursor-pointer"
                                                >
                                                    <option>Years</option>
                                                    <option>Months</option>
                                                    <option>Weeks</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#A68A6D]">▼</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Gender <span className="text-red-400">*</span></label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['Male', 'Female', 'Unknown'].map(option => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleChange('gender', option)}
                                                    className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${formData.gender === option
                                                            ? 'bg-[#FFF8E7] border-[#A68A6D] text-[#A68A6D]'
                                                            : 'bg-white border-[#E5E7EB] text-[#57534E] hover:border-[#A68A6D]/30'
                                                        }`}
                                                >
                                                    {formData.gender === option && <span className="mr-2 text-lg">✓</span>}
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Photos */}
                        {currentStep === 2 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#A68A6D]">
                                        <Camera size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold font-serif">Photos</h2>
                                </div>

                                <div className="border-2 border-dashed border-[#E6D4B9] rounded-[2rem] p-12 text-center hover:bg-[#FFF8E7]/30 transition-colors cursor-pointer relative"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handleImageUpload({ target: { files: e.dataTransfer.files } });
                                    }}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-20 h-20 bg-[#FFF8E7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#A68A6D]">
                                        <UploadCloud size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Click to upload <span className="font-normal text-[#57534E]">or drag and drop</span></h3>
                                    <p className="text-[#A68A6D] text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>

                                {/* Preview Grid */}
                                {formData.photos.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.photos.map((photo, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                                                <img src={photo.url} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(idx)}
                                                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                {idx === 0 && (
                                                    <span className="absolute bottom-2 left-2 bg-[#A68A6D] text-white text-[10px] font-bold px-2 py-1 rounded-full">Primary</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Details */}
                        {currentStep === 3 && (
                            <div className="animate-fade-in space-y-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#A68A6D]">
                                        <div className="w-4 h-5 border-2 border-current rounded-sm"></div> {/* Fallback icon look */}
                                    </div>
                                    <h2 className="text-2xl font-bold font-serif">Description & Status</h2>
                                </div>

                                <div className="space-y-8">
                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Description</label>
                                        <textarea
                                            placeholder="Tell us about your pet's personality, habits, and what makes them special..."
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            className="w-full h-48 bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 py-4 outline-none font-medium transition-colors placeholder-[#A68A6D]/40 resize-none"
                                            maxLength={500}
                                        ></textarea>
                                        <div className="text-right text-xs text-[#A68A6D] mt-2">
                                            {formData.description.length} / 500
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-bold text-[#2D2D2D] mb-2">Profile Status</label>
                                        <div className="relative">
                                            <select
                                                value={formData.status}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                className="w-full bg-[#FFF8E7]/50 border-2 border-transparent focus:border-[#A68A6D]/30 rounded-2xl px-6 py-4 outline-none font-medium appearance-none cursor-pointer"
                                            >
                                                <option>Active</option>
                                                <option>Draft</option>
                                                <option>Rehoming</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#A68A6D]">▼</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Footer */}
                        <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-[#E6D4B9]/30">
                            {currentStep > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-8 py-4 rounded-full border border-[#E5E7EB] font-bold text-[#57534E] hover:bg-[#FAF8F5] transition-colors"
                                >
                                    Cancel / Back
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/my-pets')}
                                    className="px-8 py-4 rounded-full border border-transparent font-bold text-[#A68A6D] hover:bg-[#FAF8F5] transition-colors"
                                >
                                    Cancel
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-4 rounded-full bg-[#2D2D2D] text-white font-bold hover:bg-black transition-colors flex items-center gap-2"
                                >
                                    Next Step <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-4 rounded-full bg-[#2D2D2D] text-white font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Pet Profile'} <Check size={16} />
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default PetCreatePage;
