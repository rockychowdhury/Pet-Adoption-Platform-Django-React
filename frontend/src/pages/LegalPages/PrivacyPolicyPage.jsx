import React from 'react';
import { Lock, Eye, Shield, Database } from 'lucide-react';

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-bg-primary min-h-screen font-inter text-text-primary py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-brand-primary font-bold uppercase tracking-widest mb-2 text-sm">Safety</p>
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-text-secondary">Last Updated: December 16, 2025</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12 space-y-10">
                    <p className="text-text-secondary text-lg leading-relaxed">
                        At PetCircle, we take your privacy seriously. This policy describes how we collect, use, and handle your data when you use our Platform.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Database className="text-brand-primary" size={24} />
                            1. Information We Collect
                        </h2>
                        <div className="space-y-4 text-text-secondary leading-relaxed">
                            <p>We collect information you provide directly to us:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Account Info:</strong> Name, email address, phone number.</li>
                                <li><strong>Profile Info:</strong> Location, bio, housing details (for adopters).</li>
                                <li><strong>Pet Info:</strong> Photos, descriptions, health records.</li>
                                <li><strong>Communications:</strong> Messages sent through our platform.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Eye className="text-brand-primary" size={24} />
                            2. How We Use Your Data
                        </h2>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            We use your information to operate and improve our services, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-text-secondary leading-relaxed">
                            <li>Facilitating pet adoption and rehoming connections.</li>
                            <li>Verifying user identities to ensure platform safety.</li>
                            <li>Sending notifications about applications, messages, or platform updates.</li>
                            <li>Preventing fraud and ensuring compliance with our Terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Data Sharing</h2>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            We do not sell your personal data. We share information only in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-text-secondary leading-relaxed">
                            <li><strong>With Other Users:</strong> When you submit an application or list a pet, relevant details are shared with the counterparty to facilitate the process.</li>
                            <li><strong>Service Providers:</strong> Vendors who help us operate (e.g., hosting, email delivery), bound by confidentiality agreements.</li>
                            <li><strong>Legal Obligations:</strong> If required by law or to protect the rights and safety of PetCircle and its users.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="text-brand-primary" size={24} />
                            4. Data Security
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            We implement robust security measures to protect your data, including encryption in transit and at rest. However, no internet transmission is 100% secure, so we urge you to use strong passwords and protect your account credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-text-secondary leading-relaxed">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request deletion of your account and data (subject to retention for legal/safety reasons).</li>
                            <li>Opt-out of marketing communications.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                        <p className="text-text-secondary leading-relaxed">
                            If you have questions about this Privacy Policy or your data, please contact our Data Protection Officer at <a href="mailto:privacy@petcircle.com" className="text-brand-primary hover:underline">privacy@petcircle.com</a> or use our Contact form.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
