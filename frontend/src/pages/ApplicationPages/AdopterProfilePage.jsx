import React, { useState } from 'react';
import { Edit2, CheckCircle, Home, Users, Info, Activity, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Badge from '../../components/common/Feedback/Badge';

const AdopterProfilePage = () => {
    // Mock Data simulating a completed profile
    const profile = {
        readinessScore: 85,
        housing: {
            type: 'Single-family house',
            ownership: 'Own',
            yard: 'Fully Fenced',
            landlordApproval: true // N/A if own
        },
        household: {
            adults: 2,
            children: 1,
            ages: '7',
            pets: '1 Dog (Golden Retriever)'
        },
        experience: {
            level: 'Experienced',
            history: 'Previous dog owner for 10 years.',
            surrendered: 'No'
        },
        lifestyle: {
            schedule: 'Home most of the day (Remote)',
            activity: 'Active (Daily runs)',
            travel: 'Rarely'
        },
        references: {
            status: 'Provided (2 Personal, 1 Vet)',
            verified: true
        }
    };

    const sections = [
        {
            id: 'housing', title: 'Housing Information', icon: <Home size={20} />, data: [
                { label: 'Type', value: profile.housing.type },
                { label: 'Ownership', value: profile.housing.ownership },
                { label: 'Yard', value: profile.housing.yard }
            ]
        },
        {
            id: 'household', title: 'Household', icon: <Users size={20} />, data: [
                { label: 'Adults', value: profile.household.adults },
                { label: 'Children', value: profile.household.children > 0 ? `${profile.household.children} (Ages: ${profile.household.ages})` : 'None' },
                { label: 'Current Pets', value: profile.household.pets }
            ]
        },
        {
            id: 'experience', title: 'Pet Experience', icon: <Info size={20} />, data: [
                { label: 'Experience Level', value: profile.experience.level },
                { label: 'History', value: profile.experience.history },
                { label: 'Surrendered Pets?', value: profile.experience.surrendered }
            ]
        },
        {
            id: 'lifestyle', title: 'Lifestyle', icon: <Activity size={20} />, data: [
                { label: 'Schedule', value: profile.lifestyle.schedule },
                { label: 'Activity Level', value: profile.lifestyle.activity },
                { label: 'Travel', value: profile.lifestyle.travel }
            ]
        },
        {
            id: 'references', title: 'References', icon: <UserCheck size={20} />, data: [
                { label: 'Status', value: profile.references.status },
                { label: 'Verified', value: profile.references.verified ? 'Yes' : 'Pending' }
            ]
        }
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500 border-green-500';
        if (score >= 60) return 'text-yellow-500 border-yellow-500';
        return 'text-orange-500 border-orange-500';
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">My Adopter Profile</h1>
                        <p className="text-text-secondary mt-1">Manage your information and view your readiness score</p>
                    </div>
                    <Link to="/adopter-profile/edit">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Edit2 size={16} /> Edit Profile
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Readiness Score */}
                    <div className="lg:col-span-1">
                        <Card className="p-8 text-center sticky top-24">
                            <h2 className="text-lg font-bold text-text-primary mb-6">Readiness Score</h2>

                            <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
                                {/* Simple SVG Circle Progress Mock */}
                                <svg className="transform -rotate-90 w-full h-full">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * profile.readinessScore) / 100} className={`${getScoreColor(profile.readinessScore)} transition-all duration-1000`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <span className="text-4xl font-bold text-text-primary">{profile.readinessScore}%</span>
                                </div>
                            </div>

                            <Badge variant={profile.readinessScore >= 80 ? 'success' : 'warning'} className="mb-4 text-sm px-3 py-1">
                                {profile.readinessScore >= 80 ? 'Ready to Adopt' : 'Profile Incomplete'}
                            </Badge>

                            <p className="text-sm text-text-secondary leading-relaxed">
                                This score helps pet owners evaluate your application quickly. Fill out more details to increase your score!
                            </p>

                            <div className="mt-8 text-left space-y-4 pt-6 border-t border-border">
                                <div className="flex justify-between text-sm"><span>Housing</span> <span className="font-bold text-green-600">Excellent</span></div>
                                <div className="flex justify-between text-sm"><span>Experience</span> <span className="font-bold text-green-600">Great</span></div>
                                <div className="flex justify-between text-sm"><span>Lifestyle</span> <span className="font-bold text-yellow-600">Good</span></div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Profile Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        {sections.map((section) => (
                            <Card key={section.id} className="p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
                                            {section.icon}
                                        </div>
                                        <h3 className="font-bold text-lg text-text-primary">{section.title}</h3>
                                    </div>
                                    <button className="text-gray-400 hover:text-brand-primary transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                    {section.data.map((item, idx) => (
                                        <div key={idx}>
                                            <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">{item.label}</p>
                                            <p className="text-text-primary font-medium">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdopterProfilePage;
