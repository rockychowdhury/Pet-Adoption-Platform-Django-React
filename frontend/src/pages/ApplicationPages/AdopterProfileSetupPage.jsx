import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Info, Activity, UserCheck, CheckCircle, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Form/Input';
import Checkbox from '../../components/common/Form/Checkbox';
import useAdoption from '../../hooks/useAdoption';

const AdopterProfileSetupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { useGetAdopterProfile, useUpdateAdopterProfile } = useAdoption();

    // Fetch existing profile
    const { data: existingProfile, isLoading } = useGetAdopterProfile();
    const updateProfileMutation = useUpdateAdopterProfile();

    // Form State
    const [formData, setFormData] = useState({
        // Housing
        housingType: 'Single-family house', ownership: 'I own my home', hasLandlordApproval: false, yard: 'Yes - Fully fenced',
        // Household
        adults: 1, children: 0, childrenAges: '',
        currentPets: [], hasCurrentPets: 'No',
        // Experience
        isCurrentOwner: 'No', isPreviousOwner: 'No', previousExperience: '', speciesExperience: 3, surrendered: 'No', surrenderContext: '',
        // Lifestyle
        hoursAlone: 4, activityLevel: 3, exerciseHours: 1, exerciseType: 'Walking', travelFreq: 'Rarely',
        // References & Statement (Frontend splits refs, Backend wants list)
        ref1: { name: '', relation: '', email: '', phone: '' },
        ref2: { name: '', relation: '', email: '', phone: '' },
        vetRef: { clinic: '', vet: '', phone: '' },
        whyAdopt: ''
    });

    // Populate form if existing data
    useEffect(() => {
        if (existingProfile) {
            // Map backend fields to frontend state
            // Note: This mapping depends on exact backend names. 
            // Simplified mapping for MVP:
            // TODO: Ensure backend uses snake_case, verify fields.
            /* 
               backend: housing_type, own_or_rent, yard_type, num_adults, num_children
               references: JSON list
               pet_experience: JSON
            */
            setFormData(prev => ({
                ...prev,
                housingType: existingProfile.housing_type === 'house' ? 'Single-family house' : (existingProfile.housing_type || 'Single-family house'),
                ownership: existingProfile.own_or_rent === 'own' ? 'I own my home' : 'I rent',
                whyAdopt: existingProfile.why_adopt || '',
                // ... map other fields as needed for full restore
            }));
        }
    }, [existingProfile]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const addPet = () => {
        setFormData(prev => ({
            ...prev,
            currentPets: [...prev.currentPets, { species: 'Dog', age: '', spayed: false }]
        }));
    };

    const updatePet = (index, field, value) => {
        const newPets = [...formData.currentPets];
        newPets[index][field] = value;
        setFormData(prev => ({ ...prev, currentPets: newPets }));
    };

    const removePet = (index) => {
        setFormData(prev => ({ ...prev, currentPets: prev.currentPets.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async () => {
        const refs = [];
        if (formData.ref1.name) refs.push(formData.ref1);
        if (formData.ref2.name) refs.push(formData.ref2);

        // Map to Backend Model
        const payload = {
            housing_type: formData.housingType.toLowerCase().includes('house') ? 'house' : 'apartment', // Simplified mapping
            own_or_rent: formData.ownership.includes('own') ? 'own' : 'rent',
            landlord_approval: formData.hasLandlordApproval,
            yard_type: formData.yard.includes('Fully fenced') ? 'medium_fenced' : 'none', // Simplified

            num_adults: formData.adults,
            num_children: formData.children,
            children_ages: formData.childrenAges ? formData.childrenAges.split(',').map(s => s.trim()) : [],

            current_pets: formData.currentPets,
            pet_experience: { 'general': formData.previousExperience }, // Simplification

            ever_surrendered_pet: formData.surrendered === 'Yes',
            surrender_explanation: formData.surrenderContext,

            work_schedule: `${formData.hoursAlone} hours alone/day`,
            activity_level: parseInt(formData.activityLevel),
            exercise_commitment_hours: formData.exerciseHours,

            travel_frequency: formData.travelFreq.toLowerCase(),

            references: refs,
            why_adopt: formData.whyAdopt
        };

        try {
            await updateProfileMutation.mutateAsync({
                id: existingProfile?.id,
                data: payload
            });
            toast.success("Adopter Profile Saved!");
            navigate('/dashboard/profile'); // Redirect to profile view
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile. Please try again.");
        }
    };

    const STEPS = [
        { id: 1, title: 'Housing', icon: <Home size={20} /> },
        { id: 2, title: 'Household', icon: <Users size={20} /> },
        { id: 3, title: 'Experience', icon: <Info size={20} /> },
        { id: 4, title: 'Lifestyle', icon: <Activity size={20} /> },
        { id: 5, title: 'References', icon: <UserCheck size={20} /> }
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // --- Step Renderers ---
    // (Renderers mostly unchanged, just using state)
    const renderHousing = () => (
        <Card className="p-8 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Housing Information</h2>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Housing Type</label>
                <select
                    value={formData.housingType}
                    onChange={(e) => handleInputChange('housingType', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none"
                >
                    <option>Single-family house</option>
                    <option>Apartment</option>
                    <option>Condo</option>
                    <option>Townhouse</option>
                    <option>Other</option>
                </select>
            </div>
            {/* ... Only showing top part here to save tokens on full rewrite, but assuming I write full file to replace artifact... */}
            {/* Wait, I should write the FULL file content to be safe. */}
            <div className="space-y-3">
                <label className="block text-sm font-bold text-text-primary">Ownership</label>
                <div className="flex gap-6">
                    {['I own my home', 'I rent'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="ownership"
                                value={opt}
                                checked={formData.ownership === opt}
                                onChange={(e) => handleInputChange('ownership', e.target.value)}
                            />
                            <span className="font-medium">{opt}</span>
                        </label>
                    ))}
                </div>
                {formData.ownership === 'I rent' && (
                    <div className="pl-6 border-l-2 border-brand-primary p-4 bg-brand-primary/5 rounded-r-xl space-y-4">
                        <Checkbox
                            label="I have landlord approval for pets"
                            checked={formData.hasLandlordApproval}
                            onChange={() => handleInputChange('hasLandlordApproval', !formData.hasLandlordApproval)}
                        />
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <label className="block text-sm font-bold text-text-primary">Yard</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Yes - Fully fenced', 'Yes - Partially fenced', 'Yes - Unfenced', 'No yard'].map(opt => (
                        <label key={opt} className={`flex items-center p-3 rounded-xl border cursor-pointer hover:border-brand-primary ${formData.yard === opt ? 'border-brand-primary bg-brand-primary/5' : 'border-border'}`}>
                            <input
                                type="radio"
                                name="yard"
                                value={opt}
                                checked={formData.yard === opt}
                                onChange={(e) => handleInputChange('yard', e.target.value)}
                                className="mr-3"
                            />
                            <span className="text-sm font-medium">{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        </Card>
    );

    const renderHousehold = () => (
        <Card className="p-8 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Household Information</h2>
            <div className="grid grid-cols-2 gap-6">
                <Input
                    type="number"
                    label="Number of Adults"
                    value={formData.adults}
                    onChange={(e) => handleInputChange('adults', e.target.value)}
                    min="1"
                />
                <Input
                    type="number"
                    label="Number of Children"
                    value={formData.children}
                    onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
                    min="0"
                />
            </div>
            {formData.children > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <Input
                        label="Children's Ages"
                        placeholder="e.g. 3, 7, 12"
                        value={formData.childrenAges}
                        onChange={(e) => handleInputChange('childrenAges', e.target.value)}
                    />
                </div>
            )}
            <div className="pt-6 border-t border-border">
                <h3 className="font-bold text-lg mb-3">Current Pets</h3>
                <div className="flex gap-6 mb-4">
                    {['Yes', 'No'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasCurrentPets"
                                value={opt}
                                checked={formData.hasCurrentPets === opt}
                                onChange={(e) => handleInputChange('hasCurrentPets', e.target.value)}
                            />
                            <span className="font-medium">{opt}</span>
                        </label>
                    ))}
                </div>
                {formData.hasCurrentPets === 'Yes' && (
                    <div className="space-y-4">
                        {formData.currentPets.map((pet, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                                <div className="grid grid-cols-3 gap-4">
                                    <select
                                        value={pet.species}
                                        onChange={(e) => updatePet(idx, 'species', e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-border"
                                    >
                                        <option>Dog</option><option>Cat</option><option>Other</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Age"
                                        value={pet.age}
                                        onChange={(e) => updatePet(idx, 'age', e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-border"
                                    />
                                    <div className="flex items-center">
                                        <Checkbox
                                            label="Spayed/Neutered"
                                            checked={pet.spayed}
                                            onChange={() => updatePet(idx, 'spayed', !pet.spayed)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removePet(idx)}
                                    className="text-xs text-red-500 hover:underline mt-2"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addPet}>+ Add Pet</Button>
                    </div>
                )}
            </div>
        </Card>
    );

    const renderExperience = () => (
        <Card className="p-8 max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-text-primary">Pet Experience</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Previous Pet Owner?</label>
                    <div className="flex gap-4">
                        {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="isPreviousOwner" value={opt} checked={formData.isPreviousOwner === opt} onChange={(e) => handleInputChange('isPreviousOwner', e.target.value)} />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
                {formData.isPreviousOwner === 'Yes' && (
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-text-primary">Tell us about your previous pets</label>
                        <textarea
                            value={formData.previousExperience}
                            onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                            placeholder="Map to pet_experience JSON"
                            className="w-full h-24 p-4 rounded-xl border border-border outline-none resize-none"
                        ></textarea>
                    </div>
                )}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <label className="block text-sm font-bold text-orange-900 mb-2">Have you ever surrendered a pet?</label>
                    <div className="flex gap-4 mb-3">
                        {['Yes', 'No'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="surrendered" value={opt} checked={formData.surrendered === opt} onChange={(e) => handleInputChange('surrendered', e.target.value)} />
                                <span className="text-orange-800">{opt}</span>
                            </label>
                        ))}
                    </div>
                    {formData.surrendered === 'Yes' && (
                        <textarea
                            value={formData.surrenderContext}
                            onChange={(e) => handleInputChange('surrenderContext', e.target.value)}
                            className="w-full h-20 p-3 rounded-lg border border-orange-200 outline-none resize-none bg-white"
                        ></textarea>
                    )}
                </div>
            </div>
        </Card>
    );

    const renderLifestyle = () => (
        <Card className="p-8 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">Lifestyle</h2>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">How many hours per day is your home empty?</label>
                <input
                    type="number" min="0" max="24"
                    value={formData.hoursAlone}
                    onChange={(e) => handleInputChange('hoursAlone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Travel Frequency</label>
                <select
                    value={formData.travelFreq}
                    onChange={(e) => handleInputChange('travelFreq', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none"
                >
                    <option>Rarely</option>
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Frequently</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Exercise Commitment (Hours/Day)</label>
                <input
                    type="number" min="0" step="0.5"
                    value={formData.exerciseHours}
                    onChange={(e) => handleInputChange('exerciseHours', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none"
                />
            </div>
        </Card>
    );

    const renderReferences = () => (
        <Card className="p-8 max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-text-primary">References & Statement</h2>
            <div className="space-y-6">
                <h3 className="font-bold border-b border-border pb-2">Personal References</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Reference 1 Name" value={formData.ref1.name} onChange={(e) => handleNestedChange('ref1', 'name', e.target.value)} />
                    <Input label="Relationship" value={formData.ref1.relation} onChange={(e) => handleNestedChange('ref1', 'relation', e.target.value)} />
                    <Input label="Email" value={formData.ref1.email} onChange={(e) => handleNestedChange('ref1', 'email', e.target.value)} />
                    <Input label="Phone" value={formData.ref1.phone} onChange={(e) => handleNestedChange('ref1', 'phone', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Reference 2 Name" value={formData.ref2.name} onChange={(e) => handleNestedChange('ref2', 'name', e.target.value)} />
                    <Input label="Relationship" value={formData.ref2.relation} onChange={(e) => handleNestedChange('ref2', 'relation', e.target.value)} />
                    <Input label="Email" value={formData.ref2.email} onChange={(e) => handleNestedChange('ref2', 'email', e.target.value)} />
                    <Input label="Phone" value={formData.ref2.phone} onChange={(e) => handleNestedChange('ref2', 'phone', e.target.value)} />
                </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-bold">Why Adopt?</h3>
                <textarea
                    value={formData.whyAdopt}
                    onChange={(e) => handleInputChange('whyAdopt', e.target.value)}
                    className="w-full h-32 p-4 rounded-xl border border-border outline-none resize-none"
                    placeholder="Tell us about your motivations..."
                ></textarea>
                <p className="text-right text-xs text-text-tertiary">{formData.whyAdopt.length}/500 required</p>
            </div>
        </Card>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Create Your Adopter Profile</h1>
                <p className="text-text-secondary">Complete your profile to apply for pet adoptions</p>
            </div>

            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto mb-12">
                <div className="flex justify-between relative">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 h-1 bg-brand-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>

                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-[#FDFBF7] px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.id ? 'bg-brand-primary text-white shadow-lg scale-110' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                {step > s.id ? <CheckCircle size={20} /> : s.icon}
                            </div>
                            <span className={`text-xs font-bold transition-colors ${step >= s.id ? 'text-brand-primary' : 'text-gray-400'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Steps */}
            <div className="mb-12">
                {step === 1 && renderHousing()}
                {step === 2 && renderHousehold()}
                {step === 3 && renderExperience()}
                {step === 4 && renderLifestyle()}
                {step === 5 && renderReferences()}
            </div>

            {/* Navigation */}
            <div className="max-w-2xl mx-auto flex justify-between">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={step === 1 ? 'invisible' : ''}
                >
                    <ChevronLeft size={18} className="mr-2" /> Back
                </Button>

                <div className="flex gap-4">
                    {step < STEPS.length ? (
                        <Button variant="primary" onClick={nextStep}>
                            Next: {STEPS[step].title} <ChevronRight size={18} className="ml-2" />
                        </Button>
                    ) : (
                        <Button variant="primary"
                            onClick={handleSubmit}
                            disabled={updateProfileMutation.isLoading}
                        >
                            {updateProfileMutation.isLoading ? 'Saving...' : 'Complete Profile'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdopterProfileSetupPage;
