import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const RehomingSituationPage = () => {
    const { formData, updateFormData, markStepComplete } = useOutletContext();
    const navigate = useNavigate();

    const [errors, setErrors] = React.useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.reason || formData.reason.length < 50) {
            newErrors.reason = "Please provide more detail (minimum 50 characters).";
        }
        if (!formData.urgency) {
            newErrors.urgency = "Selection required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            markStepComplete('situation');
            navigate('/rehoming/details');
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="max-w-2xl mx-auto font-jakarta animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-xl font-logo font-bold text-foreground mb-1">The Situation</h1>
            <p className="text-muted-foreground text-xs mb-6">Tell us why you're rehoming and how urgent it is.</p>

            <div className="bg-white rounded-xl shadow-sm border border-border p-5 md:p-6 mb-6">
                {/* Reason */}
                <div className="space-y-2 mb-6">
                    <label className="block text-sm font-bold text-foreground">
                        Why are you rehoming?
                    </label>
                    <textarea
                        value={formData.reason || ''}
                        onChange={(e) => updateFormData({ reason: e.target.value })}
                        placeholder="I need to rehome my pet because..."
                        className={`w-full h-24 p-3 text-sm rounded-lg border resize-none focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all ${errors.reason ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-brand-primary'}`}
                    />
                    <div className="flex justify-between items-center text-[10px]">
                        <span className={errors.reason ? "text-red-500 font-bold" : "text-muted-foreground"}>
                            {errors.reason || "Minimum 50 characters required."}
                        </span>
                        <span className={(formData.reason?.length || 0) >= 50 ? "text-green-600 font-bold" : "text-muted-foreground"}>
                            {formData.reason?.length || 0} chars
                        </span>
                    </div>
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground">
                        How urgent is this?
                    </label>
                    <div className="grid gap-2">
                        {[
                            { value: 'immediate', label: 'Immediate (< 3 days)', desc: 'Emergency situations.', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 border-red-200 ring-red-500' },
                            { value: 'soon', label: 'Soon (1-2 weeks)', desc: 'Moving or life changes.', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200 ring-orange-500' },
                            { value: 'flexible', label: 'Flexible (> 2 weeks)', desc: 'Finding the right match.', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200 ring-green-500' }
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${formData.urgency === option.value ? `${option.bg} border-transparent ring-1` : 'border-border hover:border-gray-300'}`}
                            >
                                <input
                                    type="radio"
                                    name="urgency"
                                    value={option.value}
                                    checked={formData.urgency === option.value}
                                    onChange={(e) => updateFormData({ urgency: e.target.value })}
                                    className="sr-only"
                                />
                                <div className={`p-1.5 rounded-full bg-white ${option.color} shadow-sm transition-transform ${formData.urgency === option.value ? 'scale-105' : ''}`}>
                                    <option.icon size={16} />
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${formData.urgency === option.value ? 'text-foreground' : 'text-gray-700'}`}>{option.label}</div>
                                    <div className="text-[10px] text-muted-foreground">{option.desc}</div>
                                </div>
                                {formData.urgency === option.value && (
                                    <div className="ml-auto text-brand-primary">
                                        <div className="w-4 h-4 rounded-full bg-current flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        </div>
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
                {errors.urgency && <p className="text-red-500 text-[10px] mt-2 font-bold">{errors.urgency}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={() => navigate('/rehoming/select-pet')}
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

export default RehomingSituationPage;
