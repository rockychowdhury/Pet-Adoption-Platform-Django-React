import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowLeft, ArrowRight, Home,
    Dog, Clock, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Buttons/Button';
import useAPI from '../../hooks/useAPI';
import { toast } from 'react-toastify';

const STEPS = [
    { id: 1, title: 'Living Situation', icon: <Home size={18} /> },
    { id: 2, title: 'Pet History', icon: <Dog size={18} /> },
    { id: 3, title: 'Daily Care', icon: <Clock size={18} /> },
    { id: 4, title: 'Review', icon: <checkCircle2 size={18} /> }
];

const AIApplicationPage = () => {
    const navigate = useNavigate();
    const { id: listingId } = useParams();
    const api = useAPI();

    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');

    const [formData, setFormData] = useState({
        living_situation: {
            home_type: '',
            ownership: '',
            landlord_permission: '',
            outdoor_space: '',
            household_members: ''
        },
        pet_history: {
            previous_ownership: '',
            types_owned: '',
            outcome: ''
        },
        daily_care: {
            primary_caregiver: '',
            routine: '',
            time_alone: ''
        }
    });

    const updateFormData = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleNext = async () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Generate
            setIsGenerating(true);
            try {
                const res = await api.post('/rehoming/generate-application/', {
                    listing_id: listingId,
                    form_data: formData
                });
                setGeneratedText(res.data.content);
                setCurrentStep(4);
            } catch (error) {
                console.error(error);
                toast.error("Failed to generate application. Please try again.");
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else navigate(-1);
    };

    const handleSubmit = () => {
        // Navigate to final submission page with generated text
        const state = { initialMessage: generatedText };
        // If route is /rehoming/listings/:id/inquiry, we pass state there
        navigate(`/rehoming/listings/${listingId}/inquiry`, { state });
    };

    const isStepValid = () => {
        const { living_situation, pet_history, daily_care } = formData;
        if (currentStep === 1) {
            return living_situation.home_type && living_situation.ownership && living_situation.outdoor_space;
        }
        if (currentStep === 2) {
            return pet_history.previous_ownership;
        }
        if (currentStep === 3) {
            return daily_care.routine && daily_care.time_alone;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <button onClick={handleBack} className="text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-2 text-sm font-bold">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="flex items-center gap-2 text-purple-600 font-black uppercase tracking-widest text-xs">
                        <Sparkles size={14} /> AI Assistant
                    </div>
                </div>

                {/* Wizard Container */}
                <div className="bg-white rounded-3xl shadow-xl shadow-purple-900/5 border border-purple-50 overflow-hidden relative">

                    {/* Progress Bar */}
                    <div className="bg-purple-50/50 p-6 border-b border-purple-100">
                        <div className="flex justify-between relative">
                            {/* Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-100 -z-10 -translate-y-1/2" />

                            {STEPS.map((step) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-purple-600 bg-purple-600 text-white' :
                                                isCompleted ? 'border-purple-600 bg-purple-50 text-purple-600' :
                                                    'border-gray-200 bg-white text-gray-300'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">{step.id}</span>}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-purple-700' : 'text-gray-400'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 min-h-[400px]">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: Living Situation */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-black text-gray-900">Tell us about your home</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="space-y-2">
                                            <span className="text-xs font-bold uppercase text-gray-500">Home Type</span>
                                            <select
                                                className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                                value={formData.living_situation.home_type}
                                                onChange={e => updateFormData('living_situation', 'home_type', e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="House">House</option>
                                                <option value="Apartment">Apartment</option>
                                                <option value="Condo">Condo</option>
                                                <option value="Townhouse">Townhouse</option>
                                            </select>
                                        </label>
                                        <label className="space-y-2">
                                            <span className="text-xs font-bold uppercase text-gray-500">Ownership</span>
                                            <select
                                                className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                                value={formData.living_situation.ownership}
                                                onChange={e => updateFormData('living_situation', 'ownership', e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="Owned">Owned</option>
                                                <option value="Rented">Rented</option>
                                            </select>
                                        </label>
                                    </div>

                                    {formData.living_situation.ownership === 'Rented' && (
                                        <label className="block space-y-2">
                                            <span className="text-xs font-bold uppercase text-gray-500">Landlord Permission?</span>
                                            <div className="flex gap-4">
                                                {['Yes', 'No', 'Not Checked'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => updateFormData('living_situation', 'landlord_permission', opt)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${formData.living_situation.landlord_permission === opt
                                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </label>
                                    )}

                                    <label className="block space-y-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">Outdoor Space</span>
                                        <select
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                            value={formData.living_situation.outdoor_space}
                                            onChange={e => updateFormData('living_situation', 'outdoor_space', e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Fenced Yard">Fenced Yard</option>
                                            <option value="Unfenced Yard">Unfenced Yard</option>
                                            <option value="Patio/Balcony">Patio / Balcony</option>
                                            <option value="No Outdoor Space">No Private Outdoor Space</option>
                                        </select>
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">Household Members</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. 2 adults, 1 child (age 5)"
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                            value={formData.living_situation.household_members}
                                            onChange={e => updateFormData('living_situation', 'household_members', e.target.value)}
                                        />
                                    </label>
                                </motion.div>
                            )}

                            {/* STEP 2: Pet History */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-black text-gray-900">Pet Experience</h2>

                                    <label className="block space-y-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">Have you owned pets before?</span>
                                        <div className="flex gap-4">
                                            {['Yes', 'No'].map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateFormData('pet_history', 'previous_ownership', opt.toLowerCase())}
                                                    className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all ${formData.pet_history.previous_ownership === opt.toLowerCase()
                                                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </label>

                                    {formData.pet_history.previous_ownership === 'yes' && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <label className="block space-y-2">
                                                <span className="text-xs font-bold uppercase text-gray-500">Types of pets owned</span>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 2 Golden Retrievers, 1 Siamese Cat"
                                                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                                    value={formData.pet_history.types_owned}
                                                    onChange={e => updateFormData('pet_history', 'types_owned', e.target.value)}
                                                />
                                            </label>
                                            <label className="block space-y-2">
                                                <span className="text-xs font-bold uppercase text-gray-500">Outcome (Briefly)</span>
                                                <textarea
                                                    placeholder="e.g. They are still with us / Passed away due to old age..."
                                                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium h-24 resize-none"
                                                    value={formData.pet_history.outcome}
                                                    onChange={e => updateFormData('pet_history', 'outcome', e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* STEP 3: Daily Care */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-black text-gray-900">Daily Care Plan</h2>

                                    <label className="block space-y-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">Primary Caregiver</span>
                                        <select
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                            value={formData.daily_care.primary_caregiver}
                                            onChange={e => updateFormData('daily_care', 'primary_caregiver', e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Self">Myself</option>
                                            <option value="Partner">Partner/Spouse</option>
                                            <option value="Whole Family">Whole Family</option>
                                        </select>
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">Planned Daily Routine</span>
                                        <textarea
                                            placeholder="Briefly describe feeding, walking, and play schedule..."
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium h-32 resize-none"
                                            value={formData.daily_care.routine}
                                            onChange={e => updateFormData('daily_care', 'routine', e.target.value)}
                                        />
                                    </label>

                                    <label className="block space-y-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">Time Alone (Average per day)</span>
                                        <select
                                            className="w-full p-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                                            value={formData.daily_care.time_alone}
                                            onChange={e => updateFormData('daily_care', 'time_alone', e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Less than 2 hours">Less than 2 hours</option>
                                            <option value="2-4 hours">2-4 hours</option>
                                            <option value="4-8 hours">4-8 hours</option>
                                            <option value="8+ hours">8+ hours</option>
                                        </select>
                                    </label>
                                </motion.div>
                            )}

                            {/* STEP 4: Review Generation */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600 mb-2">
                                            <Sparkles size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900">Application Ready!</h2>
                                        <p className="text-gray-500">We've drafted this based on your inputs. Feel free to edit.</p>
                                    </div>

                                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                                        <textarea
                                            className="w-full h-64 bg-transparent border-none outline-none resize-none text-gray-800 leading-relaxed font-medium"
                                            value={generatedText}
                                            onChange={e => setGeneratedText(e.target.value)}
                                        />
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        {isGenerating ? (
                            <Button disabled className="w-full md:w-auto bg-purple-600">
                                <Loader2 className="animate-spin mr-2" size={18} /> Generating Magic...
                            </Button>
                        ) : currentStep === 4 ? (
                            <Button
                                onClick={handleSubmit}
                                className="w-full md:w-auto bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700"
                            >
                                Continue to Submission <ArrowRight size={18} className="ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                disabled={!isStepValid()}
                                className={`w-full md:w-auto transition-all ${isStepValid()
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {currentStep === 3 ? 'Generate Application' : 'Next Step'} <ArrowRight size={18} className="ml-2" />
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AIApplicationPage;
