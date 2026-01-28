
import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Send, ArrowLeft, Paperclip, Image as ImageIcon, Info, ShieldCheck } from 'lucide-react';
import useAPI from '../../hooks/useAPI';
import useRehoming from '../../hooks/useRehoming';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Buttons/Button';

const ApplicationMailboxPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const api = useAPI();
    const { user } = useAuth();
    const { useGetListingDetail } = useRehoming();
    const { data: listing, isLoading, isError } = useGetListingDetail(id);
    const [message, setMessage] = useState(location.state?.initialMessage || '');
    const [accepted, setAccepted] = useState(false);

    const submitMutation = useMutation({
        mutationFn: async (payload) => {
            return await api.post('/rehoming/inquiries/', payload);
        },
        onSuccess: () => {
            toast.success("Application sent successfully!");
            navigate('/dashboard/applications');
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.detail || "Failed to send application.");
        }
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="animate-pulse text-brand-primary font-bold tracking-widest uppercase text-xs">Loading Mailbox...</div>
        </div>
    );

    if (isError || !listing) return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="text-center space-y-4">
                <p className="text-text-secondary">Listing not found.</p>
                <Button variant="outline" onClick={() => navigate('/pets')}>Back to Pets</Button>
            </div>
        </div>
    );

    const { pet, owner } = listing;

    const handleSubmit = () => {
        if (message.length < 20) {
            toast.error("Please write a bit more about yourself (min 20 chars).");
            return;
        }
        submitMutation.mutate({
            listing_id: listing.id,
            message: message
        });
    };

    return (
        <div className="min-h-screen bg-bg-secondary py-8 px-4 ">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header / Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-secondary text-sm font-bold hover:text-text-primary transition-colors"
                >
                    <ArrowLeft size={16} /> Cancel Application
                </button>

                {/* Mailbox Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-200">

                    {/* Left Panel: Context (Like an email sidebar info) */}
                    <div className="w-full md:w-80 bg-bg-secondary border-r border-border p-6 flex flex-col gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-3">Re: Adoption Inquiry</p>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                                    <img src={pet.main_photo} alt={pet.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{pet.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{pet.breed} • {pet.age_display}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                    {owner.first_name[0]}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">To Owner</p>
                                    <p className="text-sm font-bold text-gray-900">{owner.first_name} {owner.last_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                    {user?.first_name?.[0] || 'Me'}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">From Applicant</p>
                                    <p className="text-sm font-bold text-gray-900">{user?.first_name} {user?.last_name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <div className="flex gap-2">
                                <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                                    This conversation is secure. Avoid sharing financial info or deposit requests until you verify the owner in person.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Composition */}
                    <div className="flex-1 flex flex-col bg-white relative">
                        {/* Toolbar */}
                        <div className="h-14 border-b border-gray-100 flex items-center px-6 gap-4 text-gray-400">
                            <p className="text-xs font-bold text-gray-300 mr-auto uppercase tracking-widest">New Message</p>
                            {/* Mock tools */}
                            <button className="hover:text-gray-600 transition-colors"><Paperclip size={18} /></button>
                            <button className="hover:text-gray-600 transition-colors"><ImageIcon size={18} /></button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 p-6">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Why do you want to adopt this pet?

What attracted you to this specific pet?
Living Situation(home type, ownership, members etc)
Pet Experience & History
Daily Care Plan
etc"
                                className="w-full h-full resize-none outline-none text-gray-700 placeholder:text-gray-300 leading-relaxed font-medium text-base"
                                autoFocus
                            />
                        </div>

                        {/* Footer / Send Action */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                            {/* Declaration */}
                            <div className="mb-4 flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="declaration"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <label htmlFor="declaration" className="text-xs text-text-secondary leading-relaxed">
                                    I confirm that all the information provided above is true and accurate to the best of my knowledge.
                                    I also agree to the <a href="/terms" target="_blank" className="text-brand-primary font-bold hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-brand-primary font-bold hover:underline">Privacy Policy</a>.
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 font-medium">
                                    {message.length} chars
                                </p>
                                <Button
                                    onClick={handleSubmit}
                                    isLoading={submitMutation.isPending}
                                    isDisabled={message.length < 20 || !accepted}
                                    className="bg-brand-primary text-white rounded-xl px-8 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30"
                                    rightIcon={<Send size={16} />}
                                >
                                    Send Application
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ApplicationMailboxPage;
