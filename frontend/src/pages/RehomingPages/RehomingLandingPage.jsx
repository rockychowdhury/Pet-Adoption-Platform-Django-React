import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle2, User, Phone, MapPin, XCircle, ChevronRight, Info, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';

const RehomingLandingPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // Helper: Determine status of specific fields
    const checklist = [
        {
            label: "First Name",
            isComplete: !!user?.first_name,
            icon: User
        },
        {
            label: "Last Name",
            isComplete: !!user?.last_name,
            icon: User
        },
        {
            label: "Phone Number",
            isComplete: !!user?.phone_number,
            icon: Phone
        },
        {
            label: "Location (City & State)",
            isComplete: !!(user?.location_city && user?.location_state),
            icon: MapPin
        },
        {
            label: "Email Verification Status",
            isComplete: !!user?.email_verified,
            icon: Shield
        }
    ];

    const isProfileComplete = user?.profile_is_complete;

    const handleContinue = () => {
        if (isProfileComplete) {
            navigate('/rehoming/select-pet');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) return null;

    return (
        <div className="min-h-screen bg-bg-secondary/30 py-12 md:py-20">
            <div className="max-w-2xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
                        Before We Begin
                    </h1>
                    <p className="text-text-secondary text-lg">
                        We need a complete profile to ensure the best outcome for your pet.
                    </p>
                </div>

                {/* User Status Card */}
                <Card className="p-8 mb-8 border-t-4 border-t-brand-primary shadow-lg">
                    {/* Checklist */}
                    <div className="space-y-4 mb-8">
                        {checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${item.isComplete ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {item.isComplete ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    </div>
                                    <span className={`font-medium ${item.isComplete ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {item.isComplete && <span className="text-green-600 font-bold text-sm">Completed</span>}
                            </div>
                        ))}
                    </div>

                    {/* Action Area */}
                    <div className="flex flex-col gap-4">
                        {isProfileComplete ? (
                            <button
                                onClick={handleContinue}
                                className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
                            >
                                Continue to Rehoming <ArrowRight size={20} />
                            </button>
                        ) : (
                            <Link to="/dashboard/settings">
                                <button className="w-full px-8 py-4 bg-brand-secondary text-white rounded-full font-bold text-lg hover:bg-brand-secondary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                                    Complete My Profile <ChevronRight />
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="grid gap-4 md:grid-cols-2 text-sm text-text-secondary">
                        <div className="flex gap-3 items-start">
                            <Info className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                            <p>Rehoming listings are reviewed by our team to ensure pet safety and prevent scams.</p>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Info className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                            <p>You can cancel your request at any time before it is published.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div >
    );
};

export default RehomingLandingPage;
