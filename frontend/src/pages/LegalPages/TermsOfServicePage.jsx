import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
    Shield,
    FileText,
    AlertCircle,
    CheckCircle,
    Users,
    PawPrint,
    CreditCard,
    Scale,
    AlertTriangle,
    Mail,
    Download
} from 'lucide-react';
import DarkButton from '../../components/Auth/DarkButton';

const TermsOfServicePage = () => {
    const [activeSection, setActiveSection] = useState('acceptance');
    const contentRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const sections = [
        { id: 'acceptance', title: '1. Acceptance of Terms' },
        { id: 'accounts', title: '2. User Accounts & Registration' },
        { id: 'responsibilities', title: '3. User Responsibilities' },
        { id: 'rehoming', title: '4. Rehoming Guidelines' },
        { id: 'prohibited', title: '5. Prohibited Activities' },
        { id: 'content', title: '6. Content Ownership' },
        { id: 'adoption', title: '7. Pet Adoption Process' },
        { id: 'payments', title: '8. Payment Terms' },
        { id: 'liability', title: '9. Liability & Disclaimers' },
        { id: 'termination', title: '10. Termination Policy' },
        { id: 'changes', title: '11. Changes to Terms' },
        { id: 'contact', title: '12. Contact Information' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    const handleDownloadPDF = () => {
        setIsDownloading(true);
        const element = contentRef.current;
        const opt = {
            margin: [10, 10, 15, 10],
            filename: 'PetCircle_Terms_of_Service.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setIsDownloading(false);
        });
    };

    // Optional: Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            // Offset must exceed scroll-margin-top (scroll-mt-32 = 128px)
            const scrollPosition = window.scrollY + 160;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-[#FFFBF5] min-h-screen font-inter text-gray-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-brand-primary font-bold uppercase tracking-widest mb-3 text-sm flex items-center gap-2">
                                <Shield size={16} /> Legal Documentation
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 font-logo tracking-tight">
                                Terms of Service
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Last Updated: December 16, 2025
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={18} />
                                {isDownloading ? 'Generating...' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar (Sticky) */}
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 px-4">
                                Table of Contents
                            </h3>
                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-2 ${activeSection === section.id
                                            ? 'bg-orange-50 text-orange-700 border-orange-500'
                                            : 'text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-900'
                                            }`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-16" ref={contentRef}>

                        {/* 1. Acceptance */}
                        <section id="acceptance" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                                    <FileText size={24} />
                                </div>
                                1. Acceptance of Terms
                            </h2>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100prose max-w-none text-gray-600 leading-relaxed">
                                <p className="mb-4">
                                    Welcome to PetCircle ("the Platform"), a community-driven application designed to connect pet lovers, facilitate responsible rehoming, and provide access to verified service providers.
                                </p>
                                <p>
                                    By accessing, registering for, or using our services, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Platform. These Terms constitute a legally binding agreement between you and PetCircle Inc.
                                </p>
                            </div>
                        </section>

                        {/* 2. User Accounts */}
                        <section id="accounts" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">2. User Accounts & Registration</h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
                                <p>
                                    To access certain features of the Service (such as posting listings or messaging), you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to keep such information updated.
                                </p>
                                <p>
                                    You are responsible for safeguarding your password and for all activities that occur under your account. You agree to immediately notify PetCircle of any unauthorized use of your account.
                                </p>
                            </div>
                        </section>

                        {/* 3. User Responsibilities */}
                        <section id="responsibilities" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">3. User Responsibilities</h2>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <p className="text-gray-600">
                                    You warrant that use of the Platform is for lawful, personal purposes. Specifically, you agree that:
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                                        <span className="text-gray-700">You are at least 18 years of age.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                                        <span className="text-gray-700">You have the legal right to rehome any pet you list on the Platform.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                                        <span className="text-gray-700">You will treat all other users and staff with respect, free from harassment or abuse.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Rehoming Guidelines */}
                        <section id="rehoming" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 text-brand-primary">4. Rehoming Guidelines</h2>
                            <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100 space-y-6">
                                <p className="text-gray-700 font-medium">
                                    PetCircle is a rehoming platform, NOT a marketplace. To ensure the welfare of animals, users must adhere to strict ethical guidelines:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle size={18} className="text-orange-500" /> Honesty
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            You must accurately disclose the pet's health, behavioral history (including any aggression), and reason for rehoming.
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle size={18} className="text-orange-500" /> No Commercial Sales
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Breeding operations and "flipping" are strictly prohibited. Rehoming fees must reflect reasonable costs (e.g., vet care), not profit.
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle size={18} className="text-orange-500" /> Vetting
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Pet owners are responsible for vetting potential adopters. We provide tools (applications, messaging), but the final decision lies with you.
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle size={18} className="text-orange-500" /> Safety
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Meet in safe, public locations for initial greetings. Do not hand over a pet until you are entirely comfortable with the match.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Prohibited Activities */}
                        <section id="prohibited" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 text-red-600">5. Prohibited Activities</h2>
                            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                                <p className="text-gray-800 mb-4 font-medium">You may not use the Service to:</p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                    <li>List pets from commercial breeding operations (puppy/kitten mills).</li>
                                    <li>Sell animals for profit or engage in "pet flipping".</li>
                                    <li>Post false, misleading, or deceptive content.</li>
                                    <li>Harass, stalk, or threaten other users.</li>
                                    <li>Attempt to circumvent rehoming fees or safety protocols.</li>
                                    <li>Promote illegal acts or violate any local animal welfare laws.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 6. Content Ownership */}
                        <section id="content" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">6. Content Ownership & License</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                You retain ownership of the content (photos, text) you post to the Service. However, by posting content, you grant PetCircle a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content for the purpose of operating and promoting the Service (e.g., featuring a success story).
                            </p>
                        </section>

                        {/* 7. Adoption Process */}
                        <section id="adoption" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">7. Pet Adoption Process</h2>
                            <div className="border border-gray-200 rounded-2xl p-8 space-y-6">
                                <p className="text-gray-600">
                                    Our platform facilitates connections but does not serve as the legal guardian of any animal.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center">1</span>
                                        <p className="text-gray-600 text-sm mt-1.5">Users submit applications directly to pet owners through our secure system.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center">2</span>
                                        <p className="text-gray-600 text-sm mt-1.5">Pet owners review applications and choose suitable candidates for meet-and-greets.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center">3</span>
                                        <p className="text-gray-600 text-sm mt-1.5">All adoption agreements are entered into directly between the pet owner and the adopter. PetCircle is not a party to these agreements.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 8. Payments */}
                        <section id="payments" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">8. Payment Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                PetCircle is currently a free platform. Any rehoming fees discussed are handled directly between users. We strongly advise users to avoid cash transfers before meeting in person. Platform fees (if introduced in the future) will be clearly communicated.
                            </p>
                        </section>

                        {/* 9. Liability - IMPORTANT */}
                        <section id="liability" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">9. Liability & Disclaimers</h2>
                            <div className="bg-gray-50 border-l-4 border-gray-800 p-6">
                                <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">Disclaimer of Warranties</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    THE SERVICE IS PROVIDED "AS IS". PETCIRCLE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    WE DO NOT GUARANTEE THE HEALTH, BEHAVIOR, TEMPERAMENT, OR HISTORY OF ANY ANIMAL LISTED ON THE SERVICE. USERS ASSUME ALL RISKS ASSOCIATED WITH INTERACTING WITH OTHER USERS AND ADOPTING ANIMALS.
                                </p>
                            </div>
                        </section>

                        {/* 10. Termination */}
                        <section id="termination" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">10. Termination Policy</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may suspend or terminate your account immediately, without prior notice, if you breach these Terms of Service (e.g., misrepresenting a pet, abusive behavior) or for any other reason at our sole discretion. Upon termination, your right to use the Service will immediately cease.
                            </p>
                        </section>

                        {/* 11. Changes */}
                        <section id="changes" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">11. Changes to Terms</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will provide notice of significant changes updates on this page. Your continued use of the Platform after any changes constitutes your acceptance of the new Terms.
                            </p>
                        </section>

                        {/* 12. Contact */}
                        <section id="contact" className="scroll-mt-32 mb-20">
                            <h2 className="text-2xl font-bold mb-6">12. Contact Information</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                If you have any questions about these Terms, please contact us.
                            </p>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Mail className="text-brand-primary" size={20} />
                                    <span>legal@petcircle.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <AlertTriangle className="text-brand-primary" size={20} />
                                    <span>Report a Violation</span>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
