import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Clock, User, MessageCircle, Phone, Calendar, ChevronLeft, Send } from 'lucide-react';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const ApplicationDetailPage = () => {
    const { id } = useParams();

    // Mock Data
    const application = {
        id: id,
        status: 'Info Requested',
        pet: {
            name: 'Luna',
            image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=400&q=80',
            breed: 'Siamese',
            price: 75
        },
        owner: { name: 'Sarah Jenkins', phone: '(555) 123-4567', email: 'sarah.j@example.com' },
        timeline: [
            { id: 1, title: 'Application Submitted', date: 'Oct 24, 10:30 AM', icon: <Check size={14} />, status: 'completed' },
            { id: 2, title: 'Under Review', date: 'Oct 24, 2:15 PM', icon: <User size={14} />, status: 'completed' },
            { id: 3, title: 'Information Requested', date: 'Oct 25, 9:00 AM', icon: <MessageCircle size={14} />, status: 'current' },
            { id: 4, title: 'Meet & Greet', date: 'Pending', icon: <Calendar size={14} />, status: 'upcoming' },
            { id: 5, title: 'Final Decision', date: 'Pending', icon: <Check size={14} />, status: 'upcoming' }
        ],
        message: "I've had Siamese cats before and I have a large fenced yard...",
        messages: [
            { id: 1, sender: 'Sarah (Owner)', text: "Hi! Thanks for applying. Do you have a vet reference?", time: "Yesterday 9:00 AM" }
        ]
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-brand-primary" onClick={() => window.history.back()}>
                        <ChevronLeft size={16} className="mr-2" /> Back to My Applications
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                                Application for {application.pet.name}
                                <Badge variant="info">Info Requested</Badge>
                            </h1>
                            <p className="text-text-secondary mt-1">Application ID: #{id} • Last updated 2 hours ago</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Timeline */}
                        <Card className="p-8">
                            <h2 className="font-bold text-lg mb-6">Status Timeline</h2>
                            <div className="space-y-6 relative">
                                {/* Line */}
                                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                {application.timeline.map((item) => (
                                    <div key={item.id} className="relative flex gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${item.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' :
                                                item.status === 'current' ? 'bg-blue-100 border-blue-500 text-blue-600' :
                                                    'bg-gray-50 border-gray-200 text-gray-300'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        <div className="pt-1">
                                            <p className={`font-bold text-sm ${item.status === 'upcoming' ? 'text-gray-400' : 'text-text-primary'}`}>{item.title}</p>
                                            <p className="text-xs text-text-tertiary">{item.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Application Content */}
                        <Card className="p-8 space-y-6">
                            <h2 className="font-bold text-lg">Your Application Details</h2>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-text-tertiary uppercase mb-2">Your Initial Message</h3>
                                <p className="text-text-secondary italic">"{application.message}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-border rounded-lg">
                                    <p className="text-xs text-text-tertiary font-bold uppercase">Readiness Score</p>
                                    <p className="font-bold text-green-600">85% (Excellent)</p>
                                </div>
                                <div className="p-3 border border-border rounded-lg">
                                    <p className="text-xs text-text-tertiary font-bold uppercase">Submitted</p>
                                    <p className="font-bold text-text-primary">Oct 24, 2023</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Pet Card */}
                        <Card className="overflow-hidden">
                            <div className="h-40 bg-gray-100 relative">
                                <img src={application.pet.image} alt={application.pet.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <h3 className="text-white font-bold text-xl">{application.pet.name}</h3>
                                    <p className="text-white/80 text-sm">{application.pet.breed}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white">
                                <p className="text-xs text-text-tertiary uppercase font-bold mb-2">Listed By</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold">
                                        {application.owner.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary text-sm">{application.owner.name}</p>
                                        <p className="text-xs text-text-secondary">Owner</p>
                                    </div>
                                </div>

                                {application.status === 'Approved' && (
                                    <div className="space-y-2 mb-4 p-3 bg-green-50 rounded-lg text-sm border border-green-100">
                                        <div className="flex items-center gap-2 text-green-800">
                                            <Phone size={14} /> {application.owner.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-green-800">
                                            <MessageCircle size={14} /> {application.owner.email}
                                        </div>
                                    </div>
                                )}

                                <Button className="w-full justify-center">View Full Listing</Button>
                            </div>
                        </Card>

                        {/* Recent Messages */}
                        <Card className="p-4 flex flex-col h-[400px]">
                            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                                <MessageCircle size={18} /> Messages
                            </h3>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                                {application.messages.map(msg => (
                                    <div key={msg.id} className="bg-gray-100 rounded-xl rounded-tl-none p-3 max-w-[90%]">
                                        <p className="text-xs font-bold text-text-primary mb-1">{msg.sender}</p>
                                        <p className="text-sm text-text-secondary">{msg.text}</p>
                                        <p className="text-[10px] text-text-tertiary mt-1 text-right">{msg.time}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Type a reply..."
                                    className="w-full pl-4 pr-10 py-3 rounded-full border border-border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                />
                                <button className="absolute right-2 top-2 p-1.5 bg-brand-primary text-white rounded-full hover:bg-brand-secondary transition-colors">
                                    <Send size={16} />
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;
