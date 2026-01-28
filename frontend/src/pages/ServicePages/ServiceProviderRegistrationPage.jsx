import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, Clock, Calendar, Heart, ArrowRight, Loader } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useServices from '../../hooks/useServices';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Buttons/Button';
import Card from '../../components/common/Layout/Card';
import Input from '../../components/common/Form/Input';
import Textarea from '../../components/common/Form/Textarea';
import { toast } from 'react-toastify';

const ServiceProviderRegistrationPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { useGetMyRoleRequests, useCreateRoleRequest, useCreateProviderProfile, useGetCategories } = useServices();

    // Queries
    const { data: roleRequests, isLoading: requestsLoading } = useGetMyRoleRequests();
    const { data: categories, isLoading: categoriesLoading } = useGetCategories();

    // Mutations
    const createRoleRequest = useCreateRoleRequest();
    const createProfile = useCreateProviderProfile();

    // Local State
    const [reason, setReason] = useState('');
    const [roleRequestType, setRoleRequestType] = useState('service_provider');
    const [step, setStep] = useState('loading'); // loading, intro, pending, approved_no_profile, onboarding

    // Determine State
    useEffect(() => {
        if (authLoading || requestsLoading) return;

        if (user?.role === 'service_provider') {
            // User is already a provider. Check if they have a profile? 
            // Ideally we check if `user.service_provider_profile` exists, but that data comes from `user` object usually if deeply nested 
            // or we might need to fetch it. For now, assume if they are service_provider, go to onboarding/dashboard.
            // But wait, the task is to CREATE the profile.
            // Let's assume they need to create it. We can check if `user.is_service_provider` is true.
            setStep('onboarding');
        } else {
            // Check for pending requests
            const pendingRequest = roleRequests?.results?.find(r => r.status === 'pending');
            if (pendingRequest) {
                setStep('pending');
            } else {
                setStep('intro');
            }
        }
    }, [user, roleRequests, authLoading, requestsLoading]);

    // Handlers
    const handleRoleRequest = async (e) => {
        e.preventDefault();
        try {
            await createRoleRequest.mutateAsync({
                requested_role: 'service_provider',
                reason: reason
            });
            setStep('pending');
            toast.success('Application submitted successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit application.');
        }
    };

    const handleProfileSubmit = async (data) => {
        try {
            await createProfile.mutateAsync(data);
            toast.success('Profile created! You can now access your dashboard.');
            navigate('/dashboard'); // or /services/dashboard
        } catch (error) {
            console.error(error);
            toast.error('Failed to create profile.');
        }
    };

    if (authLoading || requestsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Loader className="animate-spin text-brand-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary font-jakarta">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">

                {/* Intro / Application Step */}
                {step === 'intro' && (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold font-merriweather text-text-primary">Become a Pet Circle Service Provider</h1>
                            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                                Join our community of trusted vets, fosters, and trainers. Help pets find better lives while growing your business.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: Heart, title: 'Impact Lives', desc: 'Directly help pets in need of foster care or medical attention.' },
                                { icon: Shield, title: 'Build Trust', desc: 'Get verified and build a reputation with our community review system.' },
                                { icon: Calendar, title: 'Manage Simply', desc: 'Use our tools to manage bookings, availability, and client communications.' }
                            ].map((item, i) => (
                                <Card key={i} className="p-6 text-center hover:-translate-y-1 transition-transform">
                                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-text-secondary text-sm">{item.desc}</p>
                                </Card>
                            ))}
                        </div>

                        <Card className="p-8 border-brand-primary/20 bg-brand-primary/5">
                            <h2 className="text-2xl font-bold mb-6">Apply Now</h2>
                            <form onSubmit={handleRoleRequest} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Why do you want to join?</label>
                                    <Textarea
                                        placeholder="Tell us about your experience and what services you plan to offer..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                        rows={4}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" variant="primary" size="lg" disabled={createRoleRequest.isPending}>
                                        {createRoleRequest.isPending ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}

                {/* Pending State */}
                {step === 'pending' && (
                    <div className="max-w-md mx-auto text-center pt-12">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                            <Clock size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Application Under Review</h2>
                        <p className="text-text-secondary mb-8">
                            Thanks for applying! Our team is reviewing your request to become a service provider.
                            Active role requests usually take 24-48 hours to process.
                        </p>
                        <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
                    </div>
                )}

                {/* Onboarding Wizard (Simplified for MVP) */}
                {step === 'onboarding' && (
                    <OnboardingForm
                        categories={categories?.results || []}
                        onSubmit={handleProfileSubmit}
                        isLoading={createProfile.isPending}
                    />
                )}
            </div>
        </div>
    );
};

// Sub-component for Onboarding
const OnboardingForm = ({ categories, onSubmit, isLoading }) => {
    const [wizardStep, setWizardStep] = useState(1);
    const [formData, setFormData] = useState({
        business_name: '',
        category: '', // ID
        description: '',
        city: '',
        state: '',
        zip_code: '',
        address_line1: '',
        phone: '',
        email: '',
        // Specifics
        daily_rate: '',
        monthly_rate: '',
        capacity: '',
        clinic_type: 'general',
        emergency_services: false,
        pricing_info: '',
    });

    const selectedCategory = categories.find(c => c.id == formData.category);
    const isVet = selectedCategory?.slug === 'veterinary' || selectedCategory?.name?.toLowerCase().includes('vet');
    const isFoster = selectedCategory?.slug === 'foster' || selectedCategory?.name?.toLowerCase().includes('foster');

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        setWizardStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct Payload
        const payload = {
            ...formData,
            category_id: formData.category, // Backend expects category_id for writing
            // Nest details based on type
            ...(isFoster && {
                foster_details: {
                    daily_rate: formData.daily_rate,
                    monthly_rate: formData.monthly_rate || (formData.daily_rate * 30).toFixed(2), // Fallback calculation
                    capacity: formData.capacity,
                    current_availability: 'available',
                    environment_details: { type: 'House' } // Default/Placeholder
                }
            }),
            ...(isVet && {
                vet_details: {
                    clinic_type: formData.clinic_type,
                    emergency_services: formData.emergency_services,
                    pricing_info: formData.pricing_info
                }
            })
        };

        onSubmit(payload);
    };

    return (
        <Card className="p-8">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${wizardStep === 1 ? 'bg-brand-primary text-white border-brand-primary' : 'bg-green-100 text-green-700 border-green-200'}`}>1</span>
                    <span className="font-bold">Basic Info</span>
                    <div className="w-8 h-px bg-gray-200"></div>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${wizardStep === 2 ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-400 border-gray-200'}`}>2</span>
                    <span className={wizardStep === 2 ? "font-bold" : "text-gray-400"}>Service Details</span>
                </div>
                <h2 className="text-2xl font-bold font-merriweather">{wizardStep === 1 ? 'Profile Basics' : 'Service Details'}</h2>
            </div>

            <form onSubmit={wizardStep === 1 ? handleNext : handleSubmit} className="space-y-6">

                {wizardStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Business Name" name="business_name" value={formData.business_name} onChange={handleChange} required />
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe your services..." />

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                            <Input label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="font-bold mb-4">Location</h3>
                            <Input label="Address" name="address_line1" value={formData.address_line1} onChange={handleChange} required className="mb-4" />
                            <div className="grid grid-cols-3 gap-4">
                                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                                <Input label="Zip Code" name="zip_code" value={formData.zip_code} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="flex justify-end pt-6">
                            <Button type="submit" variant="primary">Next Step <ArrowRight size={16} className="ml-2" /></Button>
                        </div>
                    </div>
                )}

                {wizardStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                        {isFoster && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-brand-primary">Foster Specification</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input label="Daily Rate ($)" type="number" name="daily_rate" value={formData.daily_rate} onChange={handleChange} required />
                                    <Input label="Monthly Rate ($)" type="number" name="monthly_rate" value={formData.monthly_rate} onChange={handleChange} placeholder="Optional" />
                                    <Input label="Capacity (Max Animals)" type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                                </div>
                                <p className="text-sm text-text-secondary">More detailed environment and species settings can be configured in your dashboard later.</p>
                            </div>
                        )}

                        {isVet && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg text-brand-primary">Clinic Details</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">Clinic Type</label>
                                        <select name="clinic_type" value={formData.clinic_type} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-200">
                                            <option value="general">General Practice</option>
                                            <option value="specialty">Specialty</option>
                                            <option value="emergency">Emergency</option>
                                            <option value="mobile">Mobile Vet</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-8">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="emergency_services" checked={formData.emergency_services} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                                            <span className="font-medium">Offers 24/7 Emergency Services</span>
                                        </label>
                                    </div>
                                </div>
                                <Textarea label="Pricing & Consultation Info" name="pricing_info" value={formData.pricing_info} onChange={handleChange} required rows={3} placeholder="Briefly describe your consultation fees or pricing structure..." />
                            </div>
                        )}

                        {!isVet && !isFoster && (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                                <p className="text-text-secondary">No specific additional details required for this category at this stage.</p>
                            </div>
                        )}

                        <div className="flex justify-between pt-6 border-t">
                            <Button type="button" variant="ghost" onClick={() => setWizardStep(1)}>Back</Button>
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                {isLoading ? 'Creating Profile...' : 'Complete Setup'}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Card>
    );
};

export default ServiceProviderRegistrationPage;
