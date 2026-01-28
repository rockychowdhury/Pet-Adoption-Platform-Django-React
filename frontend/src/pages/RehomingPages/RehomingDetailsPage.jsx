import React, { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Heart, Shield, ArrowLeft, ArrowRight, Edit2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const RehomingDetailsPage = () => {
    const { formData, updateFormData, markStepComplete } = useOutletContext();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = React.useState({});

    // Initialize location from user profile if not set
    useEffect(() => {
        if (!formData.location_city && user?.location_city) {
            updateFormData({
                location_city: user.location_city,
                location_state: user.location_state,
                enable_location_edit: false
            });
        }
    }, [user, formData.location_city, updateFormData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.location_city || !formData.location_state) {
            newErrors.location = "Location is required.";
        }
        if (!formData.privacy_level) {
            newErrors.privacy_level = "Please select a privacy level.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            markStepComplete('details');
            navigate('/rehoming/review');
            window.scrollTo(0, 0);
        }
    };

    const toggleLocationEdit = () => {
        const newEditState = !formData.enable_location_edit;
        updateFormData({ enable_location_edit: newEditState });

        // If canceling edit, revert to user location (optional, but good UX)
        if (!newEditState && user?.location_city) {
            updateFormData({
                location_city: user.location_city,
                location_state: user.location_state
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto font-jakarta animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-xl font-logo font-bold text-foreground mb-1">Pet Details</h1>
            <p className="text-muted-foreground text-xs mb-6">Help adopters understand your pet's needs.</p>

            <div className="bg-white rounded-xl shadow-sm border border-border p-5 md:p-6 mb-6">

                {/* Location */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-brand-primary/10 rounded-full text-brand-primary">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-foreground block">Location</label>
                                <p className="text-[10px] text-muted-foreground">Where is the pet currently located?</p>
                            </div>
                        </div>
                        {(user?.location_city) && (
                            <button
                                onClick={toggleLocationEdit}
                                className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                            >
                                {formData.enable_location_edit ? 'Cancel' : <><Edit2 size={10} /> Change</>}
                            </button>
                        )}
                    </div>

                    {!formData.enable_location_edit && user?.location_city ? (
                        <div className="p-3 bg-bg-secondary/30 rounded-lg border border-border flex items-center gap-3">
                            <span className="text-sm font-bold text-text-primary">
                                {formData.location_city}, {formData.location_state}
                            </span>
                            <span className="text-[10px] bg-white border border-border px-2 py-0.5 rounded-full text-text-secondary">
                                Default
                            </span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-700">City</label>
                                <input
                                    type="text"
                                    value={formData.location_city || ''}
                                    onChange={(e) => updateFormData({ location_city: e.target.value })}
                                    className="w-full p-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                    placeholder="City"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-700">State</label>
                                <input
                                    type="text"
                                    value={formData.location_state || ''}
                                    onChange={(e) => updateFormData({ location_state: e.target.value })}
                                    className="w-full p-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                                    placeholder="State"
                                />
                            </div>
                        </div>
                    )}
                    {errors.location && <p className="text-red-500 text-[10px] font-bold flex items-center gap-1"><AlertTriangle size={10} /> {errors.location}</p>}
                </div>

                <hr className="border-border mb-6" />

                {/* Ideal Home */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Heart className="text-brand-primary" size={16} />
                        <label className="text-sm font-bold text-foreground">Ideal Home Description</label>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        Constraints/Requirements (e.g., "No cats", "Fenced yard needed").
                    </p>
                    <textarea
                        value={formData.ideal_home_notes || ''}
                        onChange={(e) => updateFormData({ ideal_home_notes: e.target.value })}
                        placeholder="Describe the perfect home..."
                        className="w-full h-24 p-3 text-sm rounded-lg border border-border resize-none focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all focus:border-brand-primary"
                    />
                </div>

                <hr className="border-border mb-6" />

                {/* Privacy */}
                <div className="space-y-2">
                    <label className="text-sm font-bold block">Who can see this listing?</label>
                    <div className="grid md:grid-cols-2 gap-3">
                        <label className={`flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-bg-secondary/20 ${formData.privacy_level === 'public' ? 'border-brand-primary bg-brand-primary/5' : 'border-border'}`}>
                            <div className="flex justify-between items-start">
                                <div className="p-1 rounded-full bg-brand-primary/10 text-brand-primary w-fit"><Shield size={14} /></div>
                                <input
                                    type="radio"
                                    name="privacy_level"
                                    value="public"
                                    checked={formData.privacy_level === 'public'}
                                    onChange={(e) => updateFormData({ privacy_level: e.target.value })}
                                    className="w-4 h-4 text-brand-primary"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-xs mb-0.5">Public (Recommended)</div>
                                <div className="text-[10px] text-muted-foreground leading-relaxed">Visible to everyone.</div>
                            </div>
                        </label>
                        <label className={`flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-all hover:bg-bg-secondary/20 ${formData.privacy_level === 'verified' ? 'border-brand-primary bg-brand-primary/5' : 'border-border'}`}>
                            <div className="flex justify-between items-start">
                                <div className="p-1 rounded-full bg-gray-100 text-gray-600 w-fit"><Shield size={14} /></div>
                                <input
                                    type="radio"
                                    name="privacy_level"
                                    value="verified"
                                    checked={formData.privacy_level === 'verified'}
                                    onChange={(e) => updateFormData({ privacy_level: e.target.value })}
                                    className="w-4 h-4 text-brand-primary"
                                />
                            </div>
                            <div>
                                <div className="font-bold text-xs mb-0.5">Verified Users Only</div>
                                <div className="text-[10px] text-muted-foreground leading-relaxed">Only logged-in verified users.</div>
                            </div>
                        </label>
                    </div>
                    {errors.privacy_level && <p className="text-red-500 text-[10px]">{errors.privacy_level}</p>}
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={() => navigate('/rehoming/situation')}
                    className="btn-ghost flex items-center gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground font-bold text-sm"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                >
                    Next Step <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default RehomingDetailsPage;
