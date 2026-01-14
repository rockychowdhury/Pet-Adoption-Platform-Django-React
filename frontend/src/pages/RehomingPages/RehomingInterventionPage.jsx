import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight, CheckCircle, Info, Lightbulb, Clock, BookOpen, HeartHandshake, Home, DollarSign, Activity, AlertTriangle, UserX, HelpCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Checkbox from '../../components/common/Form/Checkbox';
import useRehoming from '../../hooks/useRehoming';

const RehomingInterventionPage = () => {
    const navigate = useNavigate();
    const { useSubmitIntervention, useGetActiveIntervention, useUpdateIntervention } = useRehoming();
    const submitIntervention = useSubmitIntervention();
    const updateIntervention = useUpdateIntervention();
    const { data: activeIntervention, isLoading } = useGetActiveIntervention();

    // -- State --
    const [showEntryModal, setShowEntryModal] = useState(true);
    const [showCoolingOffModal, setShowCoolingOffModal] = useState(false);
    const [step, setStep] = useState(1);
    const [coolingData, setCoolingData] = useState(null);

    // Initial Check
    useEffect(() => {
        if (activeIntervention) {
            if (activeIntervention.status === 'cooling') {
                setCoolingData(activeIntervention);
                setShowEntryModal(false);
            } else if (activeIntervention.status === 'proceeded') {
                navigate('/rehoming/create');
            }
        }
    }, [activeIntervention, navigate]);

    // Form Data
    const [formData, setFormData] = useState({
        // Step 1: Assessment
        reason: '',
        explanation: '',
        urgency: '',

        // Step 2: Resources
        reviewedResources: {}, // { resourceId: boolean }

        // Step 3: Reflection
        attemptedSolutions: '',
        isPermanent: null, // boolean
        certaintyScale: 5,

        // Step 4: Acknowledgments
        acknowledgments: {
            resources: false,
            permanent: false,
            honest: false,
            exclusive: false,
            responsibility: false,
            fee_policy: false,
            tos: false
        },

        commitment: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAcknowledgmentChange = (key) => {
        setFormData(prev => ({
            ...prev,
            acknowledgments: {
                ...prev.acknowledgments,
                [key]: !prev.acknowledgments[key]
            }
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // -- Submit Handler --
    const handleSubmit = async () => {
        // Construct Payload mapping to existing backend fields
        // We append reflection data to reason_text

        const reflectionSummary = `
--- REFLECTION ---
Attempted Solutions: ${formData.attemptedSolutions}
Permanent Decision: ${formData.isPermanent ? 'Yes' : 'No'}
Certainty Level: ${formData.certaintyScale}/10
Commitment: ${formData.commitment}
        `.trim();

        const mapReasonToBackend = (frontendReason) => {
            const map = {
                'housing': 'moving',
                'financial': 'financial',
                'behavior': 'behavioral',
                'time': 'no_time',
                'health': 'allergies', // Closest match for "Owner health or allergies"
                'pets': 'other', // "Too many pets" -> Other
                'other': 'other'
            };
            return map[frontendReason] || 'other';
        };

        const payload = {
            reason_category: mapReasonToBackend(formData.reason),
            urgency_level: formData.urgency.includes('week') ? 'immediate' :
                formData.urgency.includes('1 month') ? 'one_month' :
                    formData.urgency.includes('3 months') ? 'three_months' : 'flexible',

            // Correctly map resources to backend fields
            resources_viewed: Object.keys(formData.reviewedResources).filter(k => formData.reviewedResources[k]),
            resources_acknowledged: Object.values(formData.reviewedResources).every(Boolean),

            // Set acknowledged_at timestamp to pass pre-flight check in next step
            acknowledged_at: new Date().toISOString(),

            reason_text: `${formData.explanation}\n\n${reflectionSummary}`
        };

        try {
            // 1. Create Intervention
            const result = await submitIntervention.mutateAsync(payload);

            // 2. Check Status
            if (result.status === 'cooling') {
                setCoolingData(result);
                toast.info("Cooling period started.");
                return;
            }

            // 3. If started (immediate), Proceed automatically
            // We need to mark it as proceeded contextually
            if (result.status === 'started' || result.status === 'acknowledged') {
                await updateIntervention.mutateAsync({
                    id: result.id,
                    data: { status: 'proceeded' }
                });
                toast.success("Proceeding to listing creation.");
                navigate('/rehoming/create');
            }

        } catch (error) {
            console.error("Intervention submission failed", error);
            toast.error("Failed to submit intervention. Please try again.");
        }
    };

    // -- Definitions --

    const REASONS = [
        { id: 'housing', label: 'Moving / Housing', icon: Home, desc: 'Landlord issues, no pets allowed' },
        { id: 'financial', label: 'Financial Hardship', icon: DollarSign, desc: 'Can\'t afford food/vet bills' },
        { id: 'behavior', label: 'Behavioral Issues', icon: Activity, desc: 'Aggression, destruction, anxiety' },
        { id: 'time', label: 'Time Constraints', icon: Clock, desc: 'New job, schedule changes' },
        { id: 'health', label: 'Health Issues', icon: AlertTriangle, desc: 'Owner health or allergies' },
        { id: 'pets', label: 'Too Many Pets', icon: UserX, desc: 'Overwhelmed, accidental litter' },
        { id: 'other', label: 'Other', icon: HelpCircle, desc: 'Any other reason' }
    ];

    const getResources = () => {
        const common = [
            { id: 'guide', title: 'Expert Guides', desc: 'Read our comprehensive guides on overcoming challenges.', icon: BookOpen },
            { id: 'community', title: 'Community Support', desc: 'Connect with local groups and fosters.', icon: HeartHandshake },
        ];

        if (formData.reason === 'behavior') {
            return [
                { id: 'training', title: 'Certified Trainers', desc: 'Find positive reinforcement trainers near you.', icon: Activity },
                ...common
            ];
        } else if (formData.reason === 'financial') {
            return [
                { id: 'aid', title: 'Pet Food Banks & Aid', desc: 'Apply for temporary financial assistance.', icon: DollarSign },
                ...common
            ];
        } else if (formData.reason === 'housing') {
            return [
                { id: 'housing', title: 'Pet-Friendly Housing', desc: 'Search our verified pet-friendly rental database.', icon: Home },
                { id: 'esa', title: 'Tenant Rights & ESA', desc: 'Understand your legal rights as a pet owner.', icon: Info },
                ...common
            ];
        }
        return common;
    };

    const currentResources = getResources();

    // -- Render Steps --

    // Step 1: Reason Assessment
    const renderStep1 = () => (
        <div className="space-y-8 max-w-4xl mx-auto animation-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary">Why are you considering rehoming?</h2>
                <p className="text-text-secondary">Select the primary reason to help us understand your situation.</p>
            </div>

            {/* Reason Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {REASONS.map(({ id, label, icon: Icon, desc }) => (
                    <div
                        key={id}
                        onClick={() => setFormData(prev => ({ ...prev, reason: id }))}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-md flex flex-col items-center text-center gap-3
                            ${formData.reason === id ? 'border-brand-primary bg-brand-primary/5' : 'border-border bg-bg-surface hover:border-brand-secondary'}
                        `}
                    >
                        <div className={`p-3 rounded-full ${formData.reason === id ? 'bg-brand-primary text-text-inverted' : 'bg-bg-secondary text-text-secondary'}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-sm">{label}</div>
                            <div className="text-xs text-text-tertiary mt-1">{desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Explanation */}
            <div className={`transition-all duration-300 ${formData.reason ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="block text-sm font-bold text-text-primary mb-2">Detailed Explanation (Required)</label>
                <textarea
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleInputChange}
                    placeholder="Please describe your situation in detail. What has led to this decision? (Min 50 characters)"
                    className="w-full h-40 px-4 py-3 rounded-xl border border-border bg-bg-surface focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
                ></textarea>
                <div className={`flex justify-end text-xs font-bold mt-1 ${formData.explanation.length < 50 ? 'text-status-error' : 'text-status-success'}`}>
                    {formData.explanation.length}/50 characters
                </div>
            </div>

            {/* Urgency */}
            <div className="transition-all duration-300">
                <label className="block text-sm font-bold text-text-primary mb-3">How soon do you need to rehome?</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {['Immediate (< 1 week)', 'Within 1 month', 'Within 3 months', 'Flexible'].map((option) => (
                        <label key={option} className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer text-center transition-all ${formData.urgency === option ? 'border-brand-primary bg-brand-primary/5 font-bold' : 'border-border hover:border-brand-secondary'}`}>
                            <input type="radio" name="urgency" value={option} checked={formData.urgency === option} onChange={handleInputChange} className="hidden" />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button
                variant="primary"
                onClick={nextStep}
                disabled={!formData.reason || formData.explanation.length < 50 || !formData.urgency}
                className="w-full mt-4"
            >
                Next: View Resources
            </Button>
        </div>
    );

    // Step 2: Resources
    const renderStep2 = () => (
        <div className="space-y-8 max-w-3xl mx-auto animation-fade-in">
            <div className="bg-status-info/10 border border-status-info/20 rounded-2xl p-6 flex gap-4">
                <div className="mt-1 text-status-info"><Lightbulb size={24} /></div>
                <div>
                    <h3 className="text-lg font-bold text-status-info mb-1">Before you proceed...</h3>
                    <p className="text-status-info text-sm leading-relaxed">
                        Based on your reason <strong>"{REASONS.find(r => r.id === formData.reason)?.label}"</strong>, we strongly recommend checking these resources.
                        Many owners find they can keep their pets with just a little help.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {currentResources.map(res => (
                    <Card key={res.id} className="p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-bg-secondary rounded-xl text-brand-primary">
                            <res.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-text-primary">{res.title}</h4>
                            <p className="text-sm text-text-secondary mb-3">{res.desc}</p>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={!!formData.reviewedResources[res.id]}
                                    onChange={() => setFormData(prev => ({
                                        ...prev,
                                        reviewedResources: { ...prev.reviewedResources, [res.id]: !prev.reviewedResources[res.id] }
                                    }))}
                                    className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                                />
                                <span className={`text-sm ${formData.reviewedResources[res.id] ? 'text-brand-primary font-bold' : 'text-text-tertiary'}`}>
                                    I have reviewed this resource
                                </span>
                            </label>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <div className="flex-1"></div>
                <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={currentResources.some(r => !formData.reviewedResources[r.id])} // Must review all
                >
                    I've Checked All Resources
                </Button>
            </div>
        </div>
    );

    // Step 3: Reflection
    const renderStep3 = () => (
        <div className="space-y-8 max-w-2xl mx-auto animation-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Crucial Reflection</h2>
                <p className="text-text-secondary">Let's pause and reflect on the decision.</p>
            </div>

            <Card className="p-8 space-y-6">
                {/* Attempted Solutions */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-text-primary">Have you attempted any solutions listed in the previous step?</label>
                    <select name="attemptedSolutions" value={formData.attemptedSolutions} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface outline-none">
                        <option value="">Select an option...</option>
                        <option value="yes_failed">Yes, but they didn't work</option>
                        <option value="yes_partial">Yes, somewhat (need more help)</option>
                        <option value="no_impossible">No, my situation makes it impossible</option>
                        <option value="no_didnt_know">No, I didn't know about them</option>
                    </select>
                </div>

                {/* Permanent vs Temporary */}
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-text-primary">Is your situation permanent or temporary?</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center transition-all ${formData.isPermanent === true ? 'border-brand-primary bg-brand-primary/5 font-bold' : 'border-border hover:border-brand-secondary'}`}>
                            <input type="radio" name="isPermanent" checked={formData.isPermanent === true} onChange={() => setFormData(p => ({ ...p, isPermanent: true }))} className="hidden" />
                            Permanent
                        </label>
                        <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center transition-all ${formData.isPermanent === false ? 'border-brand-primary bg-brand-primary/5 font-bold' : 'border-border hover:border-brand-secondary'}`}>
                            <input type="radio" name="isPermanent" checked={formData.isPermanent === false} onChange={() => setFormData(p => ({ ...p, isPermanent: false }))} className="hidden" />
                            Temporary
                        </label>
                    </div>
                    {formData.isPermanent === false && (
                        <div className="text-sm text-status-info bg-status-info/10 p-3 rounded-lg flex gap-2">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            Considering Foster Care might be a better option than permanent rehoming.
                        </div>
                    )}
                </div>

                {/* Certainty Scale */}
                <div className="space-y-4">
                    <label className="flex justify-between text-sm font-bold text-text-primary">
                        <span>How certain are you about rehoming? (1-10)</span>
                        <span className="text-brand-primary text-lg">{formData.certaintyScale}</span>
                    </label>
                    <input
                        type="range" min="1" max="10"
                        value={formData.certaintyScale}
                        onChange={(e) => setFormData(p => ({ ...p, certaintyScale: parseInt(e.target.value) }))}
                        className="w-full accent-brand-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-text-tertiary">
                        <span>Unsure</span>
                        <span>Absolutely Certain</span>
                    </div>
                    {formData.certaintyScale < 7 && (
                        <div className="text-sm text-text-primary font-medium text-center">
                            It seems you're having doubts. It's okay to take more time.
                        </div>
                    )}
                </div>
            </Card>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <div className="flex-1"></div>
                <Button variant="primary" onClick={nextStep} disabled={!formData.attemptedSolutions || formData.isPermanent === null}>Continue</Button>
            </div>
        </div>
    );

    // Step 4: Acknowledgments
    const renderStep4 = () => (
        <div className="space-y-8 max-w-2xl mx-auto animation-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Final Acknowledgments</h2>
                <p className="text-text-secondary">Please confirm you understand the responsibilities.</p>
            </div>

            <Card className="p-6 space-y-4">
                {[
                    { key: 'resources', label: 'I have reviewed the resources and attempted alternatives where possible.' },
                    { key: 'permanent', label: 'I understand that rehoming is a permanent decision.' },
                    { key: 'honest', label: 'I commit to providing honest, complete info about my pet (health/behavior).' },
                    { key: 'exclusive', label: 'I will not list my pet on other platforms while this listing is active.' },
                    { key: 'responsibility', label: "I understand PetCircle's role is to facilitate connections, not guarantee adoption." },
                    { key: 'fee_policy', label: 'I agree to the platform fee policy (if applicable).' },
                    { key: 'tos', label: 'I agree to the Terms of Service & Privacy Policy.' },
                ].map((item) => (
                    <div key={item.key} className="flex gap-3 items-start">
                        <Checkbox
                            checked={formData.acknowledgments[item.key]}
                            onChange={() => handleAcknowledgmentChange(item.key)}
                            className="mt-1"
                        />
                        <span className="text-sm text-text-primary">{item.label}</span>
                    </div>
                ))}
            </Card>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <div className="flex-1"></div>
                <Button
                    variant="primary"
                    onClick={handleSubmit} // Trigger Cooling Off Modal
                    disabled={!Object.values(formData.acknowledgments).every(Boolean)}
                >
                    Proceed to Listing
                </Button>
            </div>
        </div>
    );

    // -- Modals --

    // Entry Modal
    const renderEntryModal = () => {
        if (!showEntryModal) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-bg-primary rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                        <HeartHandshake size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Before we start...</h2>
                    <p className="text-text-secondary leading-relaxed">
                        Rehoming is a big decision. We can help you explore alternatives to keep your pet, or guide you through finding them a great new home.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button variant="outline" className="w-full py-4 border-2" onClick={() => setShowEntryModal(false)}>
                            Explore Alternatives First
                        </Button>
                        <Button variant="ghost" className="text-text-tertiary text-sm hover:underline" onClick={() => setShowEntryModal(false)}>
                            I've already decided to rehome
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // -- Render Cooling Screen --
    if (coolingData) {
        // Calculate remaining time
        const now = new Date();
        const coolingUntil = new Date(coolingData.cooling_until);
        const diffMs = coolingUntil - now;
        const diffHrs = Math.ceil(diffMs / (1000 * 60 * 60));

        const isCoolingOver = diffMs <= 0;

        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">
                        {isCoolingOver ? "Cooling Period Complete" : "Cooling Period Active"}
                    </h2>

                    {!isCoolingOver ? (
                        <div className="space-y-4">
                            <p className="text-text-secondary leading-relaxed">
                                We ask all owners to wait 48 hours before listing. This ensures the decision is made with a clear mind.
                            </p>
                            <div className="bg-bg-secondary p-4 rounded-xl text-brand-primary font-bold text-xl">
                                {diffHrs} Hours Remaining
                            </div>
                            <Button variant="outline" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-text-secondary">
                                Thank you for waiting. If you still wish to proceed, you can now create your listing.
                            </p>
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={async () => {
                                    try {
                                        // Update to proceeded
                                        await updateIntervention.mutateAsync({
                                            id: coolingData.id,
                                            data: { status: 'proceeded' }
                                        });
                                        navigate('/rehoming/create');
                                    } catch (e) {
                                        toast.error("Failed to proceed.");
                                    }
                                }}
                            >
                                Proceed to Listing
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            {/* Modals */}
            {renderEntryModal()}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Responsible Rehoming</h1>
                    <div className="flex justify-center items-center gap-2 text-sm text-text-tertiary">
                        <span>Step {step} of 4</span>
                        <div className="w-20 h-1 bg-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
            </div>
        </div>
    );
};

export default RehomingInterventionPage;
