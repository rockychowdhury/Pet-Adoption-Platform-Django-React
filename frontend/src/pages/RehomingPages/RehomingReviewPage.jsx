import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import useRehoming from '../../hooks/useRehoming';

const RehomingReviewPage = () => {
    const { formData, updateFormData, petId } = useOutletContext();
    const navigate = useNavigate();
    const [errors, setErrors] = React.useState({});

    const { useCreateRehomingRequest, useCreateListing } = useRehoming();
    const createRequest = useCreateRehomingRequest();
    const createListing = useCreateListing();
    const isLoading = createRequest.isPending || createListing.isPending;

    const validate = () => {
        const newErrors = {};
        if (!formData.terms_accepted) {
            newErrors.terms_accepted = "You must accept the terms to continue.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (!petId) {
            toast.error("No pet selected. Please start over.");
            navigate('/rehoming/select-pet');
            return;
        }

        createRequest.mutate({ pet: petId, ...formData }, {
            onSuccess: (requestData) => {
                createListing.mutate({ request_id: requestData.id }, {
                    onSuccess: () => {
                        toast.success("Listing created successfully!");
                        navigate('/dashboard/rehoming?tab=listings');
                    },
                    onError: (err) => {
                        console.error("Listing creation failed", err);
                        toast.warn("Request saved, but listing creation failed. Please try again from dashboard.");
                        navigate('/dashboard/rehoming?tab=requests');
                    }
                });
            },
            onError: (error) => {
                console.error("Failed to create request:", error);
                const backendError = error.response?.data?.detail ||
                    error.response?.data?.non_field_errors?.[0] ||
                    "Something went wrong. Please try again.";
                toast.error(backendError);
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto font-jakarta animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-xl font-logo font-bold text-foreground mb-1">Review & Finalize</h1>
            <p className="text-muted-foreground text-xs mb-6">Confirm your choices to publish the listing.</p>

            <div className="bg-white rounded-xl shadow-sm border border-border p-5 md:p-6 mb-6">

                {/* Summary Panel */}
                <div className="bg-bg-secondary/30 rounded-xl p-4 border border-border">
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-text-primary text-xs"> <FileText size={16} /> Listing Summary</h3>
                    <ul className="space-y-2 text-xs text-text-secondary">
                        <li className="flex gap-2">
                            <span className="font-bold min-w-[70px]">Reason:</span>
                            <span className="italic">"{formData.reason ? formData.reason.substring(0, 60) : ''}..."</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold min-w-[70px]">Urgency:</span>
                            <span className="capitalize badge badge-sm badge-neutral">{formData.urgency}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold min-w-[70px]">Location:</span>
                            <span>{formData.location_city}, {formData.location_state}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold min-w-[70px]">Privacy:</span>
                            <span className="capitalize">{formData.privacy_level}</span>
                        </li>
                    </ul>
                </div>

                {/* Terms */}
                <div className="pt-2 mt-4 border-t border-border">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                            <input
                                type="checkbox"
                                name="terms_accepted"
                                checked={formData.terms_accepted || false}
                                onChange={(e) => updateFormData({ terms_accepted: e.target.checked })}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-white transition-all checked:border-brand-primary checked:bg-brand-primary hover:border-brand-primary/50"
                            />
                            <CheckCircle2 size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <div className="text-[11px] text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                            I certify that I am the legal owner of this pet and that the information provided is accurate.
                            I agree to the <a href="/terms" target="_blank" className="font-bold underline text-brand-primary hover:text-brand-secondary">Rehoming Terms of Service</a>.
                        </div>
                    </label>
                    {errors.terms_accepted && <p className="text-red-500 text-[10px] mt-1 font-bold flex items-center gap-1"><AlertTriangle size={10} /> {errors.terms_accepted}</p>}
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={() => navigate('/rehoming/details')}
                    className="btn-ghost flex items-center gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground font-bold text-sm"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm w-full md:w-auto justify-center"
                >
                    {isLoading ? (
                        <>Processing...</>
                    ) : (
                        <>Finalize & Publish <CheckCircle2 size={16} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RehomingReviewPage;
