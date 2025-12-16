import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Upload, AlertTriangle, Dog, Cat, Bird, Info, Camera, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Form/Input';
import Checkbox from '../../components/common/Form/Checkbox';

import useRehoming from '../../hooks/useRehoming';
import { useQuery } from '@tanstack/react-query';

const RehomingCreateListingPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const { useGetActiveIntervention } = useRehoming();

    // Fetch Active Intervention
    const { data: intervention, isLoading: isCheckingIntervention } = useGetActiveIntervention();

    React.useEffect(() => {
        if (!isCheckingIntervention) {
            // Logic:
            // 1. If no intervention found -> Redirect to Intervention Start
            // 2. If intervention found but not acknowledged -> Redirect to Intervention (resume)
            // 3. If intervention suggested "keep" -> Maybe warn? (For MVP, just ensure they did it)

            if (!intervention) {
                toast.info("Please complete the rehoming intervention steps first.");
                navigate('/rehoming/intervention');
            } else if (!intervention.acknowledged_at) {
                // If they haven't acknowledged the resources/cooling period
                toast.info("Please acknowledge the resources provided.");
                navigate('/rehoming/intervention');
            }
        }
    }, [intervention, isCheckingIntervention, navigate]);

    if (isCheckingIntervention) {
        return <div className="min-h-screen flex items-center justify-center">Checking eligibility...</div>;
    }

    // Form Data State - simplified for prototype
    const [formData, setFormData] = useState({
        petId: 'new', // 'new' or existing ID
        // Pet Details
        name: '', species: 'Dog', breed: '', age: '', gender: 'Male',
        // Medical
        spayed: 'Yes', microchip: 'Yes', vaccinations: 'Up to date', medications: '', conditions: [],
        // Behavior
        energy: 3, kids: 'Yes', dogs: 'Yes', cats: 'Unknown', houseTrained: 'Yes', aggression: 'No',
        // Story
        story: '',
        // Photos
        photos: [],
        // Terms
        fee: 50, includedItems: [], timeline: '', experience: 'Some pet experience preferred'
    });

    const STEPS = [
        { id: 1, title: 'Pet Details' },
        { id: 2, title: 'Medical' },
        { id: 3, title: 'Behavior' },
        { id: 4, title: 'Story' },
        { id: 5, title: 'Photos' },
        { id: 6, title: 'Terms' },
        { id: 7, title: 'Review' }
    ];

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newHelper = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newHelper] }));
    };

    // --- Steps Rendering ---

    const renderPetDetails = () => (
        <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Pet Information</h2>
            {/* Simplified Pet Selection for Mock */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-text-primary mb-2">Who are you rehoming?</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-brand-primary">
                        <input type="radio" name="petId" value="new" checked={formData.petId === 'new'} onChange={handleInputChange} />
                        <span className="font-bold">Add New Pet Profile</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-brand-primary bg-gray-50 opacity-60">
                        <input type="radio" name="petId" value="1" disabled />
                        <span>Max (Existing - Demo)</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Pet Name" name="name" value={formData.name} onChange={handleInputChange} required />
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary">Species</label>
                    <select name="species" value={formData.species} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none">
                        <option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option>
                    </select>
                </div>
                <Input label="Breed" name="breed" value={formData.breed} onChange={handleInputChange} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Age" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 2 years" />
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-text-primary">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none">
                            <option>Male</option><option>Female</option>
                        </select>
                    </div>
                </div>
            </div>
        </Card>
    );

    const renderMedical = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Medical History</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Spayed / Neutered?</label>
                    <div className="flex gap-4">
                        {['Yes', 'No', 'Scheduled'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="spayed" value={opt} checked={formData.spayed === opt} onChange={handleInputChange} />
                                <span className="text-sm">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Microchipped?</label>
                    <div className="flex gap-4">
                        {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="microchip" value={opt} checked={formData.microchip === opt} onChange={handleInputChange} />
                                <span className="text-sm">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Medical Conditions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['None', 'Allergies', 'Arthritis', 'Diabetes', 'Dietary Needs', 'Other'].map(cond => (
                        <Checkbox key={cond} label={cond} />
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderBehavior = () => (
        <Card className="p-8 space-y-8">
            <h2 className="text-xl font-bold">Behavioral Profile</h2>

            <div className="space-y-4">
                <label className="block text-sm font-bold text-text-primary">Energy Level</label>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-text-tertiary">Lazy</span>
                    <input
                        type="range" min="1" max="5"
                        value={formData.energy}
                        onChange={(e) => setFormData(prev => ({ ...prev, energy: e.target.value }))}
                        className="flex-1 accent-brand-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-bold text-text-tertiary">High Energy</span>
                </div>
                <div className="text-center font-bold text-brand-primary">Level: {formData.energy}/5</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Good with Children', 'Good with Dogs', 'Good with Cats'].map((label, i) => (
                    <div key={i}>
                        <label className="block text-sm font-bold text-text-primary mb-2">{label}</label>
                        <select className="w-full px-4 py-2 rounded-xl border border-border bg-bg-surface outline-none">
                            <option>Yes</option><option>No</option><option>Unknown</option><option>Selective</option>
                        </select>
                    </div>
                ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 font-bold text-yellow-800 mb-2">
                    <AlertTriangle size={18} />
                    Aggression History
                </div>
                <p className="text-xs text-yellow-700 mb-3">Honesty is required by law and for safety. Has this pet ever bitten a person or animal?</p>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                        <input type="radio" name="aggression" value="No" checked={formData.aggression === 'No'} onChange={handleInputChange} />
                        No
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-red-600">
                        <input type="radio" name="aggression" value="Yes" checked={formData.aggression === 'Yes'} onChange={handleInputChange} />
                        Yes
                    </label>
                </div>
            </div>
        </Card>
    );

    const renderStory = () => (
        <Card className="p-8 space-y-4">
            <h2 className="text-xl font-bold">Rehoming Story</h2>
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 flex gap-3">
                <Info className="flex-shrink-0" size={20} />
                <div>
                    <p className="font-bold mb-1">Tips for a great story:</p>
                    <ul className="list-disc list-inside space-y-1 opacity-80">
                        <li>How did you meet?</li>
                        <li>What are their favorite things?</li>
                        <li>Why are you rehoming?</li>
                        <li>What is their ideal home?</li>
                    </ul>
                </div>
            </div>
            <textarea
                className="w-full h-64 p-4 rounded-xl border border-border focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                placeholder="Start writing about your pet..."
                value={formData.story}
                onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
            ></textarea>
            <p className="text-right text-xs text-text-tertiary">Minimum 200 characters</p>
        </Card>
    );

    const renderPhotos = () => (
        <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                        <img src={src} className="w-full h-full object-cover" alt="Upload" />
                        <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={12} />
                        </button>
                    </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer flex flex-col items-center justify-center transition-colors">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    <Camera className="text-text-tertiary mb-2" />
                    <span className="text-xs font-bold text-text-secondary">Add Photo</span>
                </label>
            </div>
        </Card>
    );

    const renderTerms = () => (
        <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold">Adoption Terms</h2>

            <div className="space-y-4">
                <div className="flex justify-between font-bold">
                    <label>Adoption Fee</label>
                    <span className="text-brand-primary">${formData.fee}</span>
                </div>
                <input
                    type="range" min="0" max="300" step="10"
                    value={formData.fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, fee: parseInt(e.target.value) }))}
                    className="w-full accent-brand-primary"
                />
                <p className="text-xs text-text-secondary">Adoption fees help ensure committed adopters.</p>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Included Items</label>
                <div className="grid grid-cols-2 gap-2">
                    {['Crate', 'Leash & Collar', 'Food', 'Toys', 'Bed', 'Medical Records'].map(item => (
                        <Checkbox key={item} label={item} />
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Ideal Adoption Timeline</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none" />
            </div>
        </Card>
    );

    const renderReview = () => (
        <div className="space-y-6">
            <Card className="p-8 text-center bg-green-50 border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">Ready to Submit?</h2>
                <p className="text-green-800">Your listing for <strong>{formData.name || 'your pet'}</strong> is ready for review.</p>
            </Card>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border">
                <Checkbox />
                <span className="text-xs font-bold text-text-primary">I verify that all information is accurate and honest to the best of my knowledge.</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20">
            {/* Sticky Progress Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center h-16 min-w-max">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${currentStep === step.id ? 'bg-brand-primary text-white font-bold' : currentStep > step.id ? 'text-green-600 font-bold' : 'text-text-tertiary'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${currentStep === step.id ? 'border-white' : currentStep > step.id ? 'border-green-600 bg-green-600 text-white' : 'border-current'}`}>
                                        {currentStep > step.id ? <Check size={12} /> : step.id}
                                    </div>
                                    <span>{step.title}</span>
                                </div>
                                {idx < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200 mx-2"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <form onSubmit={e => e.preventDefault()}>
                    <div className="mb-8">
                        {currentStep === 1 && renderPetDetails()}
                        {currentStep === 2 && renderMedical()}
                        {currentStep === 3 && renderBehavior()}
                        {currentStep === 4 && renderStory()}
                        {currentStep === 5 && renderPhotos()}
                        {currentStep === 6 && renderTerms()}
                        {currentStep === 7 && renderReview()}
                    </div>

                    <div className="flex justify-between pt-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={currentStep === 1 ? 'invisible' : ''}
                        >
                            <ChevronLeft size={18} className="mr-2" /> Back
                        </Button>

                        <div className="flex gap-4">
                            <Button variant="ghost">Save Draft</Button>
                            {currentStep < STEPS.length ? (
                                <Button variant="primary" onClick={nextStep}>
                                    Next: {STEPS[currentStep].title} <ChevronRight size={18} className="ml-2" />
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={() => {
                                    toast.success("Listing Submitted Successfully!");
                                    navigate('/rehoming/manage');
                                }}>
                                    Submit Listing
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RehomingCreateListingPage;
