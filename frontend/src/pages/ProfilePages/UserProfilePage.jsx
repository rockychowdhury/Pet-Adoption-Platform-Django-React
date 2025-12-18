import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Avatar from '../../components/common/Display/Avatar';
import {
  MapPin, Calendar, CheckCircle, Phone, Mail, Edit2,
  Star, Shield, MessageSquare, ChevronRight, Share2, MoreHorizontal
} from 'lucide-react';

const UserProfilePage = () => {
  const { user } = useAuth();
  const api = useAPI();
  const [activeTab, setActiveTab] = useState('about');

  // Fetch user pets (summary)
  const { data: pets = [] } = useQuery({
    queryKey: ['myPets'],
    queryFn: async () => {
      const res = await api.get('/pets/my-pets/');
      return res.data;
    }
  });

  // Fetch listings (summary) - Mock for now or real endpoint if available
  const listings = [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Header Section */}
      <div className="relative mb-20">
        {/* Banner/Cover - Using a gradient placeholder or user cover if available */}
        <div className="h-64 rounded-3xl bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=2000"
            alt="Cover"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>

        {/* Profile Card Overlay */}
        <div className="absolute top-40 left-0 right-0 px-8">
          <div className="bg-bg-surface rounded-[2rem] p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-end relative">

            {/* Avatar */}
            <div className="relative -mt-20 md:-mt-24 ml-4">
              <div className="p-2 bg-bg-surface rounded-full">
                <Avatar
                  size="xl"
                  initials={user?.first_name?.[0]}
                  photoURL={user?.photoURL}
                  className="w-40 h-40 border-4 border-bg-surface shadow-md text-4xl"
                />
              </div>
              <Link to="/dashboard/profile/edit" className="absolute bottom-4 right-4 bg-text-primary text-bg-primary p-2 rounded-full hover:bg-black transition-colors shadow-lg">
                <Edit2 size={16} />
              </Link>
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary font-serif mb-1">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-text-tertiary text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {user?.location_city && user?.location_state
                        ? `${user.location_city}, ${user.location_state}`
                        : 'Location not set'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      Member since {new Date(user?.date_joined || Date.now()).getFullYear()}
                    </div>
                    {/* Badges */}
                    <div className="flex items-center gap-2 ml-2">
                      <span className="p-1 bg-status-success/10 text-status-success rounded-full" title="Verified Identity"><Shield size={14} /></span>
                      <span className="p-1 bg-brand-secondary/10 text-brand-secondary rounded-full" title="Phone Verified"><Phone size={14} /></span>
                      {/* <span className="p-1 bg-yellow-100 text-yellow-600 rounded-full" title="Top Adopter"><Star size={14} /></span> */}
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full py-2 px-4 h-auto text-xs gap-2">
                    <Share2 size={16} /> Share
                  </Button>
                  <Button variant="primary" className="bg-text-primary text-bg-primary rounded-full py-2 px-6 h-auto text-xs shadow-lg hover:bg-black">
                    Public View
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-8 mt-6 border-t border-border pt-6">
                <div>
                  <span className="block text-xl font-bold text-text-primary">{pets.length}</span>
                  <span className="text-xs text-text-tertiary font-bold tracking-wider uppercase">Pets</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-text-primary">0</span>
                  <span className="text-xs text-text-tertiary font-bold tracking-wider uppercase">Adoptions</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-text-primary">4.9</span>
                    <Star size={14} fill="currentColor" className="text-status-warning" />
                  </div>
                  <span className="text-xs text-text-tertiary font-bold tracking-wider uppercase">32 Reviews</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-8 mt-6">
                {['About', 'Pets', 'Listings', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-3 text-sm font-bold tracking-wide uppercase transition-all ${activeTab === tab.toLowerCase()
                      ? 'text-brand-primary border-b-2 border-brand-primary'
                      : 'text-text-tertiary hover:text-text-primary'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">

        {/* Left Column (Main) */}
        <div className="lg:col-span-2 space-y-8">

          {/* About Me Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-primary font-serif">About Me</h2>
              <Link to="/dashboard/profile/edit" className="text-xs font-bold text-brand-primary uppercase tracking-wider hover:underline">Edit</Link>
            </div>
            <div className="bg-bg-surface p-8 rounded-[2rem] shadow-sm border border-transparent hover:border-brand-primary/20 transition-colors">
              <p className="text-text-secondary leading-relaxed">
                {user?.profile?.bio || (
                  <span className="italic text-text-tertiary">
                    Hi! I'm {user?.first_name}, a lifelong animal lover. I haven't written my bio yet, but I'm excited to be part of the PetCircle community!
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* My Pets Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-primary font-serif">My Pets</h2>
              <Link to="/dashboard/my-pets" className="text-xs font-bold text-brand-primary uppercase tracking-wider hover:underline">View All</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.slice(0, 2).map(pet => (
                <Link key={pet.id} to={`/pets/${pet.id}`} className="group">
                  <div className="bg-bg-surface p-3 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-brand-primary/20">
                    <div className="h-48 rounded-[1rem] overflow-hidden mb-3 relative">
                      <img src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-status-success/10 text-status-success text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                        {pet.status || 'Active'}
                      </span>
                    </div>
                    <div className="px-1">
                      <h3 className="text-lg font-bold text-text-primary font-serif">{pet.pet_name}</h3>
                      <p className="text-xs text-text-tertiary font-medium">{pet.breed} • {pet.age_display || 'Age Unknown'}</p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Add Pet Card (Mini) */}
              <Link to="/dashboard/pets/create" className="bg-bg-secondary rounded-[1.5rem] p-3 border-2 border-dashed border-brand-primary/20 hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex flex-col items-center justify-center min-h-[200px] gap-2 group">
                <div className="w-10 h-10 bg-bg-surface rounded-full flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-110 transition-transform">
                  <CheckCircle size={20} />
                </div>
                <span className="text-sm font-bold text-brand-primary">Add Another Pet</span>
              </Link>
            </div>
          </div>

          {/* Recent Listings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-primary font-serif">Recent Listings</h2>
              {/* <Link to="/dashboard/listings" className="text-xs font-bold text-[#A68A6D] uppercase tracking-wider hover:underline">View All</Link> */}
            </div>
            {listings.length > 0 ? (
              <div>{/* Listings List */}</div>
            ) : (
              <div className="bg-bg-surface p-6 rounded-[2rem] border border-dashed border-border text-center">
                <p className="text-text-tertiary mb-4">No active listings.</p>
                <Link to="/rehoming/create">
                  <Button size="sm" variant="outline">Create Listing</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">

          {/* Contact Info Card */}
          <div className="bg-bg-surface p-6 rounded-[2rem] shadow-sm border border-border">
            <h3 className="text-lg font-bold text-text-primary font-serif mb-6">Contact Info</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">Email</p>
                    <p className="text-sm text-text-primary font-medium">{user?.email}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-bg-secondary px-2 py-1 rounded text-text-tertiary font-bold uppercase">Private</span>
              </div>

              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">Phone</p>
                    <p className="text-sm text-text-primary font-medium">{user?.phone || 'Not set'}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-status-success/10 text-status-success px-2 py-1 rounded font-bold uppercase">Friends</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Link to="/dashboard/profile/settings">
                <Button className="w-full rounded-xl py-3 font-bold" variant="outline">
                  Manage Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Reviews Snapshot */}
          <div className="bg-bg-surface p-6 rounded-[2rem] shadow-sm border border-border">
            <h3 className="text-lg font-bold text-text-primary font-serif mb-4">Reviews Snapshot</h3>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-bold text-text-primary font-serif">4.9</span>
              <span className="text-sm text-text-tertiary mb-2 font-medium">out of 5</span>
            </div>

            <div className="space-y-3 mb-6">
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="font-bold w-3 text-text-secondary">{stars}</span>
                  <Star size={10} className="text-gray-300" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full"
                      style={{ width: stars === 5 ? '80%' : stars === 4 ? '15%' : '5%' }}
                    ></div>
                  </div>
                  <span className="text-gray-400 tabular-nums">
                    {stars === 5 ? 28 : stars === 4 ? 4 : 0}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full text-text-primary font-bold text-sm">
              Read All Reviews
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
