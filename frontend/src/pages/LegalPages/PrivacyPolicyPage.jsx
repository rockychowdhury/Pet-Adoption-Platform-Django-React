import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
    Shield,
    Lock,
    Eye,
    Database,
    Globe,
    Server,
    FileKey,
    AlertCircle,
    UserCheck,
    Cookie,
    Mail,
    Download,
    CreditCard
} from 'lucide-react';

const PrivacyPolicyPage = () => {
    const [activeSection, setActiveSection] = useState('collection');
    const contentRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const hasTriggeredDownload = useRef(false);

    const sections = [
        { id: 'collection', title: '1. Information We Collect' },
        { id: 'usage', title: '2. How We Use Your Data' },
        { id: 'sharing', title: '3. Data Sharing & Disclosure' },
        { id: 'security', title: '4. Data Security' },
        { id: 'rights', title: '5. Your Rights (GDPR/CCPA)' },
        { id: 'retention', title: '6. Data Retention' },
        { id: 'cookies', title: '7. Cookies & Tracking' },
        { id: 'children', title: '8. Children\'s Privacy' },
        { id: 'international', title: '9. International Transfers' },
        { id: 'changes', title: '10. Changes to Policy' },
        { id: 'contact', title: '11. Contact Us' },
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
        // Refresh with a download flag to ensure fresh server-side data
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('download', 'true');
        window.location.href = currentUrl.toString();
    };

    const triggerDownload = () => {
        if (hasTriggeredDownload.current) return;
        hasTriggeredDownload.current = true;

        setIsDownloading(true);

        // Clean up URL immediately to prevent multiple triggers
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

        const element = contentRef.current;
        const opt = {
            margin: [10, 10, 15, 10],
            filename: 'PetCircle_Privacy_Policy.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            setIsDownloading(false);
        });
    };

    // Update active section on scroll
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('download') === 'true') {
            triggerDownload();
        }

        const handleScroll = () => {
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
                                <Lock size={16} /> Data Protection
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 font-logo tracking-tight">
                                Privacy Policy
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

                        {/* 1. Collection */}
                        <section id="collection" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                                    <Database size={24} />
                                </div>
                                1. Information We Collect
                            </h2>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                <p className="text-gray-600">
                                    We collect information necessary to facilitate responsible rehoming and ensure platform safety. This includes:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Personal Identity</h4>
                                        <p className="text-sm text-gray-600">Name, email address, phone number, and government ID (for identity verification).</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Pet Data</h4>
                                        <p className="text-sm text-gray-600">Photos, medical records (vaccinations, vet history), and behavioral profiles.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Adopter Profile</h4>
                                        <p className="text-sm text-gray-600">Housing details, family composition, lifestyle information, and references.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Communications</h4>
                                        <p className="text-sm text-gray-600">Messages sent between users are encrypted and stored for safety monitoring.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Usage */}
                        <section id="usage" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">2. How We Use Your Data</h2>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex items-start gap-3">
                                    <UserCheck className="text-brand-primary mt-1 shrink-0" size={18} />
                                    <span>To facilitate adoption connections and verify user identities.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <UserCheck className="text-brand-primary mt-1 shrink-0" size={18} />
                                    <span>To process rehoming applications and generate adoption agreements.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <UserCheck className="text-brand-primary mt-1 shrink-0" size={18} />
                                    <span>To detect and prevent fraud, scams, and animal welfare violations.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <UserCheck className="text-brand-primary mt-1 shrink-0" size={18} />
                                    <span>To send critical notifications (e.g., application updates, safety alerts).</span>
                                </li>
                            </ul>
                        </section>

                        {/* 3. Sharing */}
                        <section id="sharing" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">3. Data Sharing & Disclosure</h2>
                            <div className="prose max-w-none text-gray-600 leading-relaxed">
                                <p className="mb-4">
                                    <strong>We do NOT sell your personal data.</strong> Your information is shared only in specific contexts:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>With Other Users:</strong> Only when you actively engage in a rehoming process (e.g., submitting an application shares your profile with the pet owner). Exact addresses are hidden until later stages.</li>
                                    <li><strong>Service Providers:</strong> Trusted vendors who assist with hosting, email delivery, and ID verification (bound by strict confidentiality).</li>
                                    <li><strong>Legal Compliance:</strong> If required by law (e.g., subpoena) or to protect animal welfare (e.g., reporting abuse to authorities).</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Security */}
                        <section id="security" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Shield className="text-green-600" size={24} />
                                4. Data Security
                            </h2>
                            <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100">
                                <p className="text-gray-700 mb-6">
                                    We employ industry-standard security measures to protect your sensitive information:
                                </p>
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-green-100">
                                        <Lock className="text-green-500" size={20} />
                                        <span className="text-gray-700 text-sm"><strong>Encryption:</strong> Data is encrypted in transit (TLS) and at rest (AES-256).</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-green-100">
                                        <FileKey className="text-green-500" size={20} />
                                        <span className="text-gray-700 text-sm"><strong>Sensitive Data:</strong> Vet records and IDs are stored in secure, restricted buckets.</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-green-100">
                                        <CreditCard className="text-green-500" size={20} />
                                        <span className="text-gray-700 text-sm"><strong>Payments:</strong> Payment info is tokenized via Stripe; we never store card numbers.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Rights */}
                        <section id="rights" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">5. Your Rights (GDPR/CCPA)</h2>
                            <div className="space-y-6 text-gray-600">
                                <p>Whether you are in the EU, California, or elsewhere, we respect your data rights:</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Access & Portability</h4>
                                        <p className="text-sm">Request a copy of your personal data in a portable (JSON) format.</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Right to Erasure</h4>
                                        <p className="text-sm">Request deletion of your account. Note: Some legal records (adoption contracts) must be retained for 7 years.</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">Correction</h4>
                                        <p className="text-sm">Update or correct inaccurate information directly from your profile settings.</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-2">CCPA Notice</h4>
                                        <p className="text-sm">We do not sell personal information. You have the right to non-discrimination for exercising your privacy rights.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6. Retention */}
                        <section id="retention" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">6. Data Retention</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We retain personal data only as long as an account is active or as needed to provide services. Upon account deletion, identifiers are pseudonymized immediately. However, financial records and signed adoption agreements are retained for 7 years as required by law.
                            </p>
                        </section>

                        {/* 7. Cookies */}
                        <section id="cookies" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Cookie size={24} /> 7. Cookies & Tracking
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                We use essential cookies to maintain your session and security. We may use analytics cookies (with your consent) to understand platform usage. You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        {/* 8. Children */}
                        <section id="children" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">8. Children's Privacy</h2>
                            <p className="text-gray-600 leading-relaxed">
                                PetCircle is not intended for users under 18. We do not knowingly collect data from children. If we discover a user is underage, their account and data will be deleted immediately.
                            </p>
                        </section>

                        {/* 9. International */}
                        <section id="international" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">9. International Transfers</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Your information may be transferred to and maintained on computers located outside of your state or country where data protection laws may differ. By using PetCircle, you consent to this transfer.
                            </p>
                        </section>

                        {/* 10. Changes */}
                        <section id="changes" className="scroll-mt-32">
                            <h2 className="text-2xl font-bold mb-6">10. Changes to Policy</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or a prominent notice on our Platform.
                            </p>
                        </section>

                        {/* 11. Contact */}
                        <section id="contact" className="scroll-mt-32 mb-20">
                            <h2 className="text-2xl font-bold mb-6">11. Contact Us</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                If you have questions about your data privacy or wish to exercise your rights, please contact our Data Protection Officer (DPO).
                            </p>
                            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-6 py-4 rounded-xl border border-gray-200 inline-flex">
                                <Mail className="text-brand-primary" size={20} />
                                <span className="font-medium">privacy@petcircle.com</span>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
