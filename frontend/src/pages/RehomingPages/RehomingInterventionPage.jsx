import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight, CheckCircle, Info, Lightbulb, Clock, BookOpen, HeartHandshake } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Checkbox from '../../components/common/Form/Checkbox';
import useRehoming from '../../hooks/useRehoming';

const RehomingInterventionPage = () => {
    const navigate = useNavigate();
    const { useSubmitIntervention } = useRehoming();
    const submitIntervention = useSubmitIntervention();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        reason: '',
        explanation: '',
        urgency: '',
        reviewedResources: false,
        acknowledgments: {
            resources: false,
            permanent: false,
            honest: false,
            exclusive: false,
            responsibility: false
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

    const handleSubmit = async () => {
        // Map to Backend
        // Backend Model Fields:
        // owner (from request), reason (choices), explanation (TextField), 
        // urgency (choices), resources_viewed (Boolean), intervention_status (default PENDING)
        // Missing: acknowledgment details (maybe stored in explanation or ignored for now or we update model)
        // I will map reason/explanation/urgency/resources_viewed.

        const payload = {
            reason: formData.reason,
            urgency: formData.urgency.includes('week') ? 'immediate' :
                formData.urgency.includes('1 month') ? 'short_term' :
                    formData.urgency.includes('3 months') ? 'medium_term' : 'flexible',
            resources_viewed: formData.reviewedResources,
            explanation: `${formData.explanation}\n\nCommitment: ${formData.commitment}`
        };

        try {
            await submitIntervention.mutateAsync(payload);
            toast.success("Intervention record created. Proceeding to listing creation.");
            navigate('/rehoming/create');
        } catch (error) {
            console.error("Intervention submission failed", error);
            // Ideally we check if it failed because already exists, then navigate anyway or show error.
            // For MVP, just show error.
            toast.error("Failed to submit intervention. Please try again.");
        }
    };

    // Step 1: Reason Assessment
    const renderStep1 = () => (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-text-primary">Why are you considering rehoming?</h2>
                <p className="text-text-secondary">Understanding your situation helps us provide the best support.</p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-bold text-text-primary">Primary Reason</label>
                <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-surface focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                >
                    <option value="">Select a reason...</option>
                    <option value="housing">Moving / Housing Restrictions</option>
                    <option value="financial">Financial Hardship</option>
                    <option value="behavior">Behavioral Issues</option>
                    <option value="time">Time Constraints</option>
                    <option value="health">Health Issues (Owner)</option>
                    <option value="allergies">Allergies</option>
                    <option value="pets">Too Many Pets</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Detailed Explanation</label>
                <textarea
                    name="explanation"
                    value={formData.explanation}
                    onChange={handleInputChange}
                    placeholder="Take your time to describe what's happening..."
                    className="w-full h-40 px-4 py-3 rounded-xl border border-border bg-bg-surface focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none transition-all"
                ></textarea>
                <div className="flex justify-end text-xs text-text-tertiary">
                    {formData.explanation.length}/500 characters min
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-bold text-text-primary">How soon do you need to rehome?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Immediate (within 1 week)', 'Within 1 month', 'Within 3 months', 'Flexible timeline'].map((option) => (
                        <label key={option} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.urgency === option ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-secondary'}`}>
                            <input
                                type="radio"
                                name="urgency"
                                value={option}
                                checked={formData.urgency === option}
                                onChange={handleInputChange}
                                className="mr-3 text-brand-primary focus:ring-brand-primary"
                            />
                            <span className="text-sm font-medium">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button
                variant="primary"
                onClick={nextStep}
                disabled={!formData.reason || formData.explanation.length < 50 || !formData.urgency}
                className="w-full mt-8"
            >
                Next: View Resources
            </Button>
        </div>
    );

    // Step 2: Resources
    const renderStep2 = () => (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                <div className="p-3 bg-blue-100 rounded-full h-fit text-blue-600">
                    <Lightbulb size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Did you know?</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                        Many rehoming situations can be resolved with the right support. Based on your reason <strong>"{formData.reason}"</strong>, we've curated these resources for you.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Resources Cards logic can be same as before */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="p-2 w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <BookOpen size={24} />
                    </div>
                    <h4 className="font-bold text-text-primary mb-2">Expert Guides</h4>
                    <p className="text-sm text-text-secondary mb-4">Read our comprehensive guides on overcoming challenges.</p>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="p-2 w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <HeartHandshake size={24} />
                    </div>
                    <h4 className="font-bold text-text-primary mb-2">Community Support</h4>
                    <p className="text-sm text-text-secondary mb-4">Connect with local groups and fosters.</p>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="p-2 w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Info size={24} />
                    </div>
                    <h4 className="font-bold text-text-primary mb-2">Professional Help</h4>
                    <p className="text-sm text-text-secondary mb-4">Directory of vet behaviorists and trainers.</p>
                </Card>
            </div>

            <div className="flex items-start gap-3 p-4 bg-bg-surface rounded-xl border border-border">
                <Checkbox
                    checked={formData.reviewedResources}
                    onChange={() => setFormData(prev => ({ ...prev, reviewedResources: !prev.reviewedResources }))}
                />
                <div>
                    <p className="text-sm font-bold text-text-primary">I have reviewed these resources</p>
                    <p className="text-xs text-text-secondary">Please confirm you've attempted alternatives before proceeding.</p>
                </div>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <div className="flex-1"></div>
                <Button variant="primary" onClick={nextStep} disabled={!formData.reviewedResources}>Continue to Acknowledgment</Button>
            </div>
        </div>
    );

    // Step 3: Acknowledgment
    const renderStep3 = () => (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Important Acknowledgments</h2>
                <p className="text-text-secondary">Please confirm you understand the rehoming process.</p>
            </div>

            <Card className="p-6 space-y-4">
                {[
                    { key: 'resources', label: 'I have reviewed available resources and attempted alternatives.' },
                    { key: 'permanent', label: 'I understand that rehoming is a permanent decision.' },
                    { key: 'honest', label: 'I commit to providing honest and complete information about my pet.' },
                    { key: 'exclusive', label: 'I will not list my pet on other platforms while this listing is active.' },
                    { key: 'responsibility', label: "I understand PetCircle's role is to facilitate connections." }
                ].map((item) => (
                    <div key={item.key} className="flex gap-3">
                        <Checkbox
                            checked={formData.acknowledgments[item.key]}
                            onChange={() => handleAcknowledgmentChange(item.key)}
                        />
                        <span className="text-sm text-text-primary leading-tight pt-0.5">{item.label}</span>
                    </div>
                ))}
            </Card>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-text-primary">Commitment Statement (Optional)</label>
                <textarea
                    name="commitment"
                    value={formData.commitment}
                    onChange={handleInputChange}
                    placeholder="Why have you decided to move forward with rehoming?"
                    className="w-full h-32 px-4 py-3 rounded-xl border border-border bg-bg-surface focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none transition-all"
                ></textarea>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button
                    variant="primary"
                    className="flex-1"
                    disabled={!Object.values(formData.acknowledgments).every(Boolean) || submitIntervention.isLoading}
                    onClick={handleSubmit}
                >
                    {submitIntervention.isLoading ? 'Submitting...' : 'Create Rehoming Listing'}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-center text-text-primary mb-2">Before You Rehome...</h1>
                </div>

                {/* Progress */}
                <div className="flex justify-center items-center gap-4 mb-12">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= i ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {step > i ? <CheckCircle size={20} /> : i}
                            </div>
                            {i < 3 && <div className={`w-16 h-1 bg-gray-200 mx-2 ${step > i ? 'bg-brand-primary' : ''}`}></div>}
                        </div>
                    ))}
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default RehomingInterventionPage;
