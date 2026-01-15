import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAPI from '../../hooks/useAPI';
import Card from '../../components/common/Layout/Card';
import Button from '../../components/common/Buttons/Button';
import Avatar from '../../components/common/Display/Avatar';
import PetCard from '../../components/Pet/PetCard';
import {
  MapPin, Calendar, CheckCircle, Phone, Mail, Edit2,
  Star, Shield, Share2, Plus, Heart, User as UserIcon
} from 'lucide-react';

const UserProfilePage = () => {
  const { user } = useAuth();
  const api = useAPI();
  const [activeTab, setActiveTab] = useState('about');

  // Fetch user pets 
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['myPets'],
    queryFn: async () => {
      // Correct endpoint for 'My Pets' based on standard routes. 
      // If /user/pets/ (UserPetViewSet) is correct, use that.
      // Assuming UserPetViewSet is mapped to router.register('pets', ...) in users/urls.py inside 'user/' path?
      // Wait, urls.py showed router.register(r'pets', UserPetViewSet, basename='user-pets')
      // So the path is /user/pets/
      try {
        const res = await api.get('/user/pets/');
        return res.data.results || res.data;
      } catch (e) {
        console.error("Failed to fetch pets", e);
        return [];
      }
    }
  });

  // Fetch listings
  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ['myListings'],
    queryFn: async () => {
      // Rehoming listings are standard pets with owner=me
      const res = await api.get('/pets/?owner=me&status=active');
      return res.data.results || res.data;
    }
  });

  if (!user) return <div className="min-h-screen pt-20 text-center font-jakarta">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">

      {/* 1. Header Section */}
      <div className="relative mb-24">
        {/* Cover Image */}
        <div className="h-64 md:h-80 rounded-[48px] bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/5" />
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>

        {/* Profile Card Overlay */}
        <div className="absolute top-48 left-0 right-0 px-4 md:px-12">
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-border flex flex-col md:flex-row gap-8 items-start relative backdrop-blur-sm bg-white/95">

            {/* Avatar Section */}
            <div className="relative -mt-20 md:-mt-24 shrink-0">
              <div className="p-2 bg-white rounded-full inline-block shadow-sm">
                <Avatar
                  size="xl"
                  initials={user?.first_name?.[0]}
                  photoURL={user?.photoURL}
                  className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-md text-4xl font-logo"
                />
              </div>
              {/* Verified Badge if applicable */}
              {user?.is_verified && (
                <div className="absolute bottom-4 right-4 bg-blue-500 text-white p-1.5 rounded-full shadow-md border-2 border-white" title="Verified User">
                  <CheckCircle size={16} strokeWidth={3} />
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="flex-1 w-full pt-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-logo font-bold text-text-primary mb-2">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm font-jakarta">
                    <div className="flex items-center gap-1.5 bg-bg-secondary/50 px-3 py-1 rounded-full">
                      <MapPin size={14} className="text-brand-primary" />
                      {user?.location_city && user?.location_state
                        ? `${user.location_city}, ${user.location_state}`
                        : 'Location not set'}
                    </div>
                    <div className="flex items-center gap-1.5 bg-bg-secondary/50 px-3 py-1 rounded-full">
                      <Calendar size={14} className="text-brand-primary" />
                      Member since {new Date(user?.date_joined || Date.now()).getFullYear()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link to="/dashboard/profile/edit">
                    <Button variant="outline" className="rounded-full gap-2 border-border hover:bg-bg-secondary">
                      <Edit2 size={16} /> Edit Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-text-tertiary hover:bg-bg-secondary hover:text-text-primary">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>

              {/* Stats & Bio Snippet */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-center border-t border-border pt-6 mt-2">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xl font-bold font-logo text-text-primary">{pets.length}</p>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Pets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold font-logo text-text-primary">{listings.length}</p>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Listings</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xl font-bold font-logo text-text-primary">5.0</span>
                      <Star size={14} className="fill-orange-400 text-orange-400" />
                    </div>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Rating</p>
                  </div>
                </div>

                {/* Bio Preview */}
                {user?.bio && (
                  <div className="flex-1 md:pl-6 md:border-l md:border-border">
                    <p className="text-sm text-text-secondary line-clamp-2 font-jakarta">"{user.bio}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">

        {/* Left Sidebar (Contact & Badges) */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-6 border border-border shadow-soft">
            <h3 className="font-logo font-bold text-xl text-text-primary mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary/30 transition-colors hover:bg-bg-secondary/50">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Mail size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-text-primary truncate">{user.email}</p>
                </div>
              </div>
              {user.phone_number ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-secondary/30 transition-colors hover:bg-bg-secondary/50">
                  <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-text-primary">{user.phone_number}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-bg-secondary/20 rounded-2xl">
                  <p className="text-xs text-text-tertiary mb-2">Phone number not set</p>
                  <Link to="/dashboard/profile/settings" className="text-xs font-bold text-brand-primary hover:underline">Add Phone</Link>
                </div>
              )}
            </div>
          </div>

          {/* Verifications Card */}
          <div className="bg-white rounded-[32px] p-6 border border-border shadow-soft">
            <h3 className="font-logo font-bold text-xl text-text-primary mb-6">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user.email_verified && (
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full flex items-center gap-1.5 border border-green-100">
                  <Shield size={14} /> Email Verified
                </span>
              )}
              {user.phone_verified && (
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-full flex items-center gap-1.5 border border-blue-100">
                  <Phone size={14} /> Phone Verified
                </span>
              )}
              {!user.email_verified && !user.phone_verified && (
                <span className="text-sm text-text-tertiary italic">No active badges</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content (Tabs) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-border/50">
            {['About', 'My Pets', 'My Listings'].map((tab) => {
              const isActive = activeTab === tab.toLowerCase().replace(' ', '');
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                  className={`
                                px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap
                                ${isActive
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                      : 'bg-transparent text-text-tertiary hover:bg-bg-secondary hover:text-text-primary'}
                            `}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[400px]">
            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[32px] p-8 border border-border shadow-soft">
                  <h2 className="font-logo font-bold text-2xl text-text-primary mb-4">About Me</h2>
                  <p className="text-text-secondary leading-relaxed font-jakarta">
                    {user.bio || (
                      <span className="italic text-text-tertiary">
                        This user hasn't written a bio yet.
                      </span>
                    )}
                  </p>
                  {!user.bio && (
                    <div className="mt-6">
                      <Link to="/dashboard/profile/settings">
                        <Button size="sm" variant="outline">Write Bio</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PETS TAB */}
            {activeTab === 'mypets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.length > 0 ? (
                  pets.map(pet => (
                    <Link key={pet.id} to={`/pets/${pet.id}`} className="group block">
                      <div className="bg-white rounded-[24px] overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all hover:border-brand-primary/30">
                        <div className="aspect-[1.1] relative">
                          <img
                            src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"}
                            alt={pet.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-xl font-bold font-logo">{pet.pet_name}</h3>
                            <p className="text-sm font-medium opacity-90">{pet.breed}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white rounded-[32px] border border-dashed border-border flex flex-col items-center">
                    <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary mb-4">
                      <Heart size={24} />
                    </div>
                    <h3 className="font-bold text-text-primary mb-2">No Pets Yet</h3>
                    <p className="text-text-secondary text-sm mb-6">Add your beloved pets to your profile.</p>
                    <Link to="/dashboard/pets/create">
                      <Button variant="primary" className="rounded-full">
                        <Plus size={18} className="mr-2" /> Add a Pet
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Always show "Add Pet" card if there are pets */}
                {pets.length > 0 && (
                  <Link to="/dashboard/pets/create" className="flex flex-col items-center justify-center aspect-[1.1] rounded-[24px] border-2 border-dashed border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3">
                      <Plus size={24} />
                    </div>
                    <span className="font-bold text-brand-primary">Add Another Pet</span>
                  </Link>
                )}
              </div>
            )}

            {/* LISTINGS TAB */}
            {activeTab === 'mylistings' && (
              <div className="space-y-6">
                {listings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listings.map(pet => (
                      <div key={pet.id} className="h-[420px]">
                        <PetCard pet={pet} viewMode="grid" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-border flex flex-col items-center">
                    <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-tertiary mb-4">
                      <Share2 size={24} />
                    </div>
                    <h3 className="font-bold text-text-primary mb-2">No Active Listings</h3>
                    <p className="text-text-secondary text-sm mb-6">Ready to rehome a pet? Create a listing.</p>
                    <Link to="/rehoming">
                      <Button variant="outline" className="rounded-full">
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
