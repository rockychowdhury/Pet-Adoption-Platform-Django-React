import React from 'react';
import { Shield, FileText, MapPin } from 'lucide-react';
import Card from '../../../common/Layout/Card';

const AboutTab = ({ provider, onContact }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-8">
                <section>
                    <h3 className="text-xl font-bold font-merriweather text-text-primary mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-brand-primary" /> About {provider.business_name}
                    </h3>
                    <div className="prose prose-stone max-w-none text-text-secondary">
                        <p className="whitespace-pre-line leading-relaxed">{provider.description}</p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold font-merriweather text-text-primary mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-brand-primary" /> Location
                    </h3>
                    {/* Map Container */}
                    <div className="h-80 w-full bg-gray-100 rounded-2xl overflow-hidden border border-border relative">
                        {/* Placeholder for map iframe or component */}
                        <div className="absolute inset-0 flex items-center justify-center text-text-tertiary">
                            <div className="text-center">
                                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Map View</p>
                                <p className="text-sm max-w-xs mx-auto mt-2">{provider.full_address || provider.address_line1}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6 border-l-4 border-l-brand-primary">
                    <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                        <Shield className="text-brand-primary" size={20} /> Verification
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
                            <span className="text-text-secondary text-sm">Identity Verified</span>
                            <span className="text-green-600 font-bold text-sm">Yes</span>
                        </div>
                        {provider.license_number && (
                            <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                <span className="text-text-secondary text-sm">Unverified License</span>
                                <span className="text-text-primary font-mono text-xs bg-gray-100 px-2 py-1 rounded">{provider.license_number}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
                            <span className="text-text-secondary text-sm">Background Check</span>
                            <span className="text-green-600 font-bold text-sm">Passed</span>
                        </div>
                        {provider.is_insurance_verified && (
                            <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                <span className="text-text-secondary text-sm">Insurance</span>
                                <span className="text-green-600 font-bold text-sm">Verified</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Contact Card (Redundant with Hero but good for bottom scroll) */}
                <div className="bg-brand-secondary/5 rounded-xl p-6 border border-brand-secondary/20 text-center">
                    <h4 className="font-bold text-brand-secondary-dark mb-2">Have questions?</h4>
                    <p className="text-sm text-text-secondary mb-4">Contact {provider.business_name} directly to discuss your specific needs.</p>
                    <button
                        onClick={onContact}
                        className="w-full py-2 bg-white border border-brand-secondary text-brand-secondary font-bold rounded-lg hover:bg-brand-secondary hover:text-white transition-colors"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutTab;
