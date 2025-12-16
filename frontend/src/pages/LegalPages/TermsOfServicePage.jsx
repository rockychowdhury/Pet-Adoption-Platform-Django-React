import React from 'react';
import { Shield, AlertCircle, FileText } from 'lucide-react';

const TermsOfServicePage = () => {
    return (
        <div className="bg-bg-primary min-h-screen font-inter text-text-primary py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-brand-primary font-bold uppercase tracking-widest mb-2 text-sm">Legal</p>
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-text-secondary">Last Updated: December 16, 2025</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-12 space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-brand-primary" size={24} />
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-text-secondary leading-relaxed">
                            By accessing and using PetCircle ("the Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Platform Purpose</h2>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            PetCircle is a peer-to-peer rehoming platform designed to connect pet owners who can no longer keep their pets with potential adopters. We provide the technical infrastructure to facilitate these connections but are not a shelter or rescue organization.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <p className="text-blue-800 text-sm">
                                <strong>Note:</strong> We do not take custody of animals. All rehoming arrangements are directly between the current owner and the adopter.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
                        <ul className="list-disc pl-6 space-y-3 text-text-secondary leading-relaxed">
                            <li>You must be at least 18 years old to use this Platform.</li>
                            <li>You agree to provide accurate, current, and complete information during registration and in all listings/applications.</li>
                            <li>You represent that you have the legal right to rehome any pet you list on the Platform.</li>
                            <li>You agree not to use the Platform for any illegal or unauthorized purpose, including but not limited to commercial breeding or pet flipping.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Rehoming Guidelines</h2>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            To ensure the safety and well-being of all pets, users must adhere to strict guidelines:
                        </p>
                        <ul className="list-disc pl-6 space-y-3 text-text-secondary leading-relaxed">
                            <li><strong>Honesty:</strong> Accurately disclose the pet's health, behavior, and history.</li>
                            <li><strong>No Commercial Sales:</strong> The Platform is for rehoming, not selling. Rehoming fees should only cover reasonable costs (e.g., veterinary expenses) and must be transparent.</li>
                            <li><strong>Vetting:</strong> Pet owners are responsible for vetting potential adopters. Use our tools (applications, messaging) to ask questions and request home checks if necessary.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Liability & Disclaimers</h2>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="text-red-500 shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold text-red-800 mb-2">Important Disclaimer</h3>
                                    <p className="text-red-700 text-sm leading-relaxed">
                                        PetCircle does not guarantee the health, behavior, or temperament of any pet listed on the Platform. We are not liable for any damages, injuries, or losses resulting from the rehoming process or the actions of any user. Users assume all risks associated with meeting others and adopting/rehoming pets.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Fees & Payments</h2>
                        <p className="text-text-secondary leading-relaxed">
                            Currently, PetCircle is a free platform. We do not process payments directly. Any rehoming fees discussed are handled directly between users. We advise users to avoid cash transfers before meeting in person and to prioritize safety.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
                        <p className="text-text-secondary leading-relaxed">
                            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
                        <p className="text-text-secondary leading-relaxed">
                            PetCircle reserves the right to modify these terms at any time. We will provide notice of significant changes. Your continued use of the Platform constitutes your acceptance of the new Terms of Service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
