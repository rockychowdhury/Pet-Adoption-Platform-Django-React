import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, MapPin, Clock, AlertTriangle, Home, Shield, CheckCircle2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import useRehoming from '../../hooks/useRehoming';
import useAuth from '../../hooks/useAuth';

const RehomingFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { petId } = location.state || {}; // Expect petId from previous step

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    // Form State
    const [formData, setFormData] = useState({
        reason: '',
        urgency: 'flexible',
        ideal_home_notes: '',
        privacy_level: 'public',
        terms_accepted: false,
        location_city: '',
        location_state: '',
        location_zip: '',
        enable_location_edit: false // Local UI state for toggle
    });

    const [errors, setErrors] = useState({});

    // Populate user location on load
    useEffect(() => {
        if (user && !formData.location_city) {
            setFormData(prev => ({
                ...prev,
                location_city: user.location_city || '',
                location_state: user.location_state || '',
            }));
        }
    }, [user]);

    // Guard
    useEffect(() => {
        if (!petId) {
            navigate('/rehoming/select-pet');
        }
    }, [petId, navigate]);

    const { useCreateRehomingRequest } = useRehoming();
    const { mutate: createRequest, isLoading } = useCreateRehomingRequest();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.reason || formData.reason.length < 50) {
                newErrors.reason = "Please provide more detail (minimum 50 characters).";
                isValid = false;
            }
        }

        if (step === 3) {
            if (!formData.location_city || !formData.location_state) {
                newErrors.location = "Location is required.";
                isValid = false;
            }
        }

        if (step === 5) {
            if (!formData.privacy_level) {
                newErrors.privacy_level = "Please select a privacy level.";
                isValid = false;
            }
            if (!formData.terms_accepted) {
                newErrors.terms_accepted = "You must accept the terms to continue.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const handleSubmit = () => {
        if (!validateStep(currentStep)) return;

        if (!petId) return;

        createRequest({ pet: petId, ...formData }, {
            onSuccess: () => {
                navigate('/rehoming/status');
            },
            onError: (error) => {
                console.error("Failed to create request:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    };

    const handleSaveExit = () => {
        // Conceptually save draft
        navigate('/dashboard');
    };

    if (!petId) return null;

    // --- Steps Rendering ---

    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-bold text-muted-foreground mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-brand-primary transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto pb-20 pt-10 px-6">
            <div className="flex items-center justify-between mb-6">
                <button onClick={handleSaveExit} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <Save size={16} /> Save & Exit
                </button>
            </div>

            {renderStepIndicator()}

            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {currentStep === 1 && "Why are you rehoming?"}
                {currentStep === 2 && "How urgent is this?"}
                {currentStep === 3 && "Confirm Location"}
                {currentStep === 4 && "Ideal Home (Optional)"}
                {currentStep === 5 && "Privacy & Terms"}
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
                {currentStep === 1 && "This helps us understand your situation."}
                {currentStep === 2 && "This sets the timeline for matching."}
                {currentStep === 3 && "Where is the pet currently located?"}
                {currentStep === 4 && "What kind of family would be best?"}
                {currentStep === 5 && "Review and confirm your request."}
            </p>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-8">

                {/* Step 1: Reason */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Please explain in detail (at least 50 characters)..."
                            className={`w-full h-64 p-4 rounded-xl border-2 bg-background resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.reason ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-primary'}`}
                        />
                        <div className="flex justify-between items-center text-sm">
                            <span className={errors.reason ? "text-red-500 font-medium" : "text-muted-foreground"}>
                                {errors.reason || "Minimum 50 characters required."}
                            </span>
                            <span className={formData.reason.length >= 50 ? "text-green-600" : "text-muted-foreground"}>
                                {formData.reason.length} chars
                            </span>
                        </div>
                    </div>
                )}

                {/* Step 2: Urgency */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        {[
                            { value: 'immediate', label: 'Immediate (< 3 days)', desc: 'Emergency situations only.', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                            { value: 'soon', label: 'Soon (1-2 weeks)', desc: 'Moving or life changes.', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
                            { value: 'flexible', label: 'Flexible (> 2 weeks)', desc: 'Finding the perfect match.', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${formData.urgency === option.value ? `border-${option.color.split('-')[1]}-500 ${option.bg}` : 'border-border hover:border-gray-300'}`}
                            >
                                <input
                                    type="radio"
                                    name="urgency"
                                    value={option.value}
                                    checked={formData.urgency === option.value}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary"
                                />
                                <div className={`p-2 rounded-full bg-white ${option.color}`}>
                                    <option.icon size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{option.label}</div>
                                    <div className="text-sm text-gray-600">{option.desc}</div>
                                </div>
                            </label>
                        ))}

                        {formData.urgency === 'immediate' && (
                            <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm border border-red-100 flex gap-2 items-start mt-4">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <p>Note: Immediate requests are flagged for shelter partners if no adopter is found within 48 hours.</p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100 mt-4">
                            All requests have a mandatory <b>24-hour cooling-off period</b> before going live.
                        </div>
                    </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-xl mb-6">
                            <MapPin className="text-primary" size={24} />
                            <div>
                                <h3 className="font-bold">Current Location</h3>
                                <p className="text-sm text-muted-foreground">
                                    {formData.location_city && formData.location_state
                                        ? `${formData.location_city}, ${formData.location_state}`
                                        : "No location set"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="enable_location_edit"
                                name="enable_location_edit"
                                checked={formData.enable_location_edit}
                                onChange={handleChange}
                                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                            />
                            <label htmlFor="enable_location_edit" className="font-medium text-foreground cursor-pointer">
                                This pet is in a different location
                            </label>
                        </div>

                        {formData.enable_location_edit && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">City</label>
                                    <input
                                        type="text"
                                        name="location_city"
                                        value={formData.location_city}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-border rounded-lg"
                                        placeholder="City"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">State</label>
                                    <input
                                        type="text"
                                        name="location_state"
                                        value={formData.location_state}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-border rounded-lg"
                                        placeholder="State"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-bold">Zip Code (Optional)</label>
                                    <input
                                        type="text"
                                        name="location_zip"
                                        value={formData.location_zip}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-border rounded-lg"
                                        placeholder="Zip Code"
                                    />
                                </div>
                            </div>
                        )}
                        {errors.location && <p className="text-red-500 text-sm font-medium">{errors.location}</p>}
                    </div>
                )}

                {/* Step 4: Ideal Home */}
                {currentStep === 4 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-2">
                            Describe the perfect environment (e.g., "Quiet home, no small children, fenced yard"). This is optional but helpful.
                        </p>
                        <textarea
                            name="ideal_home_notes"
                            value={formData.ideal_home_notes}
                            onChange={handleChange}
                            placeholder="e.g. Needs a fenced yard, good with other dogs..."
                            className="w-full h-48 p-4 rounded-xl border-2 border-border bg-background resize-none focus:ring-2 focus:ring-primary/20 outline-none transition-all focus:border-primary"
                        />
                    </div>
                )}

                {/* Step 5: Privacy & Terms */}
                {currentStep === 5 && (
                    <div className="space-y-8">
                        {/* Summary Panel */}
                        <div className="bg-secondary/10 rounded-xl p-4 border border-border">
                            <h3 className="font-bold mb-2 flex items-center gap-2"> <FileText size={18} /> Review Summary</h3>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li><b>Reason:</b> {formData.reason.substring(0, 50)}...</li>
                                <li><b>Urgency:</b> {formData.urgency}</li>
                                <li><b>Location:</b> {formData.location_city}, {formData.location_state}</li>
                            </ul>
                        </div>

                        {/* Privacy */}
                        <div className="space-y-4">
                            <label className="text-lg font-bold block">Who can see this listing?</label>
                            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${formData.privacy_level === 'public' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <input type="radio" name="privacy_level" value="public" checked={formData.privacy_level === 'public'} onChange={handleChange} className="mt-1" />
                                <div>
                                    <div className="font-bold">Public (Recommended)</div>
                                    <div className="text-sm text-muted-foreground">Visible to everyone. maximizing chances.</div>
                                </div>
                            </label>
                            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${formData.privacy_level === 'verified' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <input type="radio" name="privacy_level" value="verified" checked={formData.privacy_level === 'verified'} onChange={handleChange} className="mt-1" />
                                <div>
                                    <div className="font-bold flex items-center gap-1">Verified Users Only <Shield size={14} /></div>
                                    <div className="text-sm text-muted-foreground">Only logged-in, verified users can view.</div>
                                </div>
                            </label>
                            {errors.privacy_level && <p className="text-red-500 text-sm">{errors.privacy_level}</p>}
                        </div>

                        {/* Terms */}
                        <div className="pt-4 border-t border-border">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="terms_accepted"
                                    checked={formData.terms_accepted}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 text-primary rounded"
                                />
                                <span className="text-sm text-muted-foreground">
                                    I certify that I am the legal owner of this pet and that the information provided is accurate.
                                    I agree to the <a href="#" className="underline text-primary">Rehoming Terms of Service</a>.
                                </span>
                            </label>
                            {errors.terms_accepted && <p className="text-red-500 text-sm mt-1">{errors.terms_accepted}</p>}
                        </div>
                    </div>
                )}

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                {currentStep > 1 ? (
                    <button
                        onClick={handleBack}
                        className="btn btn-ghost flex items-center gap-2 pl-0 hover:pl-2 transition-all"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                ) : (
                    <div></div> // Spacer
                )}

                {currentStep < totalSteps ? (
                    <button
                        onClick={handleNext}
                        className="btn btn-primary btn-lg flex items-center gap-2 px-8"
                    >
                        Next Step <ArrowRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="btn btn-primary btn-lg flex items-center gap-2 px-8 shadow-xl shadow-brand-primary/20"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Request'} <CheckCircle2 size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default RehomingFormPage;
