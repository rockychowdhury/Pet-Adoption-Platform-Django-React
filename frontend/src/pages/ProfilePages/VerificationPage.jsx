import React, { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertCircle, FileText, Camera } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import { toast } from 'react-toastify';

const VerificationPage = () => {
    const [step, setStep] = useState(1);
    const [idFile, setIdFile] = useState(null);
    const [proofFile, setProofFile] = useState(null);

    const handleFileUpload = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            toast.success(`Uploaded ${file.name}`);
        }
    };

    const handleSubmit = () => {
        toast.info("Verification documents submitted for review.");
        // Mock submission logic
        setStep(4); // Go to success/pending state
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-3">Get Verified</h1>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Verification helps build trust in the PetCircle community. Complete the steps below to earn your Verified Badge and access exclusive features.
                </p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center mb-12">
                <div className="flex items-center w-full max-w-2xl">
                    {[1, 2, 3].map((item, index) => (
                        <React.Fragment key={item}>
                            <div className="relative flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= item ? 'bg-brand-primary text-text-inverted' : 'bg-bg-surface border-2 border-border text-text-tertiary'
                                    }`}>
                                    {step > item ? <CheckCircle size={20} /> : item}
                                </div>
                                <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap ${step >= item ? 'text-brand-primary' : 'text-text-tertiary'
                                    }`}>
                                    {item === 1 ? 'Contact Info' : item === 2 ? 'Identity' : 'Proof of Home'}
                                </span>
                            </div>
                            {index < 2 && (
                                <div className={`flex-1 h-1 mx-4 rounded-full ${step > index + 1 ? 'bg-brand-primary' : 'bg-border'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Status Card (Right Side on Tablet+, Top on Mobile) */}
                <div className="md:col-start-3 md:row-start-1">
                    <Card className="p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-brand-primary" size={24} />
                            <h3 className="font-bold text-text-primary">Why verify?</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-text-secondary mb-6">
                            <li className="flex gap-2">
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                <span>Boost your profile visibility</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                <span>Higher acceptance rate for applications</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                <span>Access to emergency vet advice</span>
                            </li>
                        </ul>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800">
                            <p className="font-bold mb-1">Privacy Guarantee</p>
                            Your documents are encrypted and only used for verification. They are never shared publicly.
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    {step === 1 && (
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-text-primary mb-6">Step 1: Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                                    <div>
                                        <p className="font-bold text-text-primary">Email Address</p>
                                        <p className="text-sm text-text-secondary">sarah.jenkins@example.com</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} /> Verified
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                                    <div>
                                        <p className="font-bold text-text-primary">Phone Number</p>
                                        <p className="text-sm text-text-secondary">+1 (555) 123-4567</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} /> Verified
                                    </span>
                                </div>
                                <div className="pt-4">
                                    <Button variant="primary" className="w-full" onClick={() => setStep(2)}>
                                        Continue to Identity Check
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-text-primary mb-6">Step 2: Identity Verification</h2>
                            <p className="text-text-secondary mb-6">
                                Please upload a clear photo of your government-issued ID (Driver's License, Passport, or National ID).
                            </p>

                            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-bg-secondary/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileUpload(e, setIdFile)}
                                />
                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                                        <Camera size={32} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-lg">
                                            {idFile ? idFile.name : 'Click to upload ID photo'}
                                        </p>
                                        <p className="text-sm text-text-tertiary">JPG or PNG, max 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button variant="primary" className="flex-1" onClick={() => setStep(3)} isDisabled={!idFile}>
                                    Continue
                                </Button>
                            </div>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-text-primary mb-6">Step 3: Proof of Home</h2>
                            <p className="text-text-secondary mb-6">
                                To ensure pet safety, we require proof of residence. This can be a utility bill, lease agreement, or property deed (dated within last 3 months).
                            </p>

                            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-bg-secondary/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileUpload(e, setProofFile)}
                                />
                                <div className="flex flex-col items-center gap-3 pointer-events-none">
                                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-lg">
                                            {proofFile ? proofFile.name : 'Upload Document'}
                                        </p>
                                        <p className="text-sm text-text-tertiary">PDF, JPG or PNG</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                                    Back
                                </Button>
                                <Button variant="primary" className="flex-1" onClick={handleSubmit} isDisabled={!proofFile}>
                                    Submit for Review
                                </Button>
                            </div>
                        </Card>
                    )}

                    {step === 4 && (
                        <Card className="p-12 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary mb-3">Submission Received!</h2>
                            <p className="text-text-secondary max-w-md mx-auto mb-8">
                                Thank you for submitting your verification documents. Our team typically reviews these within 24-48 hours. You'll receive an email once approved.
                            </p>
                            <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
                                Return to Dashboard
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;
