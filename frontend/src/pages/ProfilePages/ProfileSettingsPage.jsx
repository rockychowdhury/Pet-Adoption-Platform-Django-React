import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import useImgBB from '../../hooks/useImgBB';
import axios from 'axios';
import Card from '../../components/common/Layout/Card';
import Input from '../../components/common/Form/Input';
import Switch from '../../components/common/Form/Switch';
import Button from '../../components/common/Buttons/Button';
import { User, Lock, Eye, Bell, Shield, Trash2, Camera, Upload, MapPin, Loader2, Navigation } from 'lucide-react';

const PROFILE_SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'verification', label: 'Verification', icon: Shield },
  { id: 'delete', label: 'Delete Account', icon: Trash2 },
];

const ProfileSettingsPage = () => {
  const api = useAPI();
  const { user, getUser } = useAuth(); // getUser to refresh context
  const { uploadImage, uploading: imageUploading } = useImgBB();
  const [activeSection, setActiveSection] = useState('personal');
  const [locationLoading, setLocationLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Basic user profile fetch
  const { data: profile, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/user/');
      return res.data;
    },
    // If context user is available, use it as placeholder data to avoid flicker
    placeholderData: user,
  });

  // Local state for form fields to handle auto-fill easily
  // We initialize normally, but we might need keys or controlled inputs to force updates from geolocation
  // Using key prop on the form is a simple way to reset/reload with new defaults if profile changes,
  // but for geolocation we want to fill existing inputs.
  // Best approach: Use defaultValue (uncontrolled) and direct DOM manipulation or key-based reset for simplicity 
  // OR fully controlled components. Given the codebase uses Input usually uncontrolled or simple, 
  // I will use refs or state for location fields to allow programmatic updates.
  const [locationData, setLocationData] = useState({
    city: '',
    state: '',
    zip_code: '',
    country: ''
  });

  // Sync location data when profile loads
  React.useEffect(() => {
    if (profile) {
      setLocationData({
        city: profile.location_city || '',
        state: profile.location_state || '',
        zip_code: profile.zip_code || '',
        country: profile.location_country || ''
      });
      if (profile.photoURL) {
        setPreviewImage(profile.photoURL);
      }
    }
  }, [profile]);


  // Mutation: Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.patch('/user/', payload);
      return res.data;
    },
    onSuccess: async () => {
      toast.success('Profile updated successfully!');
      await queryClient.invalidateQueries(['me']);
      await getUser(); // Refresh auth context
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    },
  });

  // Mutation: Change Password
  const changePasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/user/change-password/', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
      document.getElementById('password-form')?.reset();
    },
    onError: (err) => {
      const errorData = err.response?.data;
      let msg = "Failed to change password.";
      if (errorData?.new_password) msg = errorData.new_password[0];
      else if (errorData?.old_password) msg = errorData.old_password[0];
      else if (errorData?.detail) msg = errorData.detail;
      toast.error(msg);
    }
  });

  /* ================= HANDLERS ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optimistic preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    const result = await uploadImage(file);
    if (result && result.success) {
      // If successful, we just hold the URL in state or immediately save?
      // usually better to save on "Save Changes", but ImgBB gives a public URL.
      // Let's store just the URL to submit later, OR we could auto-save.
      // For a settings form, standard UX is "Save Changes" commits everything.
      // But here, I'll update the preview image state to be the remote URL content
      // so when they hit save, it sends the new URL.
      // Actually, we need to store the remote URL to send in payload. 
      // Let's assume 'previewImage' is just for display, 
      // we need a separate ref or state for the 'newPhotoUrl' 
      setPreviewImage(result.url); // Show the remote URL (or keep local preview, matter less)
      // We'll trust the previewImage state contains the new URL if it starts with http
      // Wait, local preview is data:image... remote is http...
    } else {
      // Revert if failed
      if (profile?.photoURL) setPreviewImage(profile.photoURL);
      else setPreviewImage(null);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (res.data && res.data.address) {
          const addr = res.data.address;
          setLocationData({
            city: addr.city || addr.town || addr.village || '',
            state: addr.state || '',
            zip_code: addr.postcode || '',
            country: addr.country || ''
          });
          toast.success("Location updated!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch address details.");
      } finally {
        setLocationLoading(false);
      }
    }, (err) => {
      console.error(err);
      toast.error("Failed to get location. Please allow permissions.");
      setLocationLoading(false);
    });
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Construct payload
    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone_number: formData.get('phone'),
      location_city: locationData.city, // Use controlled state
      location_state: locationData.state,
      location_country: locationData.country,
      zip_code: locationData.zip_code,
      bio: formData.get('bio'),
    };

    // If we have a new image URL (that isn't the old one), add it.
    // Simple check: if previewImage is a URL and different from profile.photoURL
    if (previewImage && previewImage !== profile?.photoURL && previewImage.startsWith('http')) {
      payload.photoURL = previewImage;
    }

    updateProfileMutation.mutate(payload);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    changePasswordMutation.mutate({
      old_password: currentPassword,
      new_password: newPassword
    });
  };

  /* ================= RENDERERS ================= */

  const renderPersonalInfo = () => (
    <Card className="rounded-[32px] border-border shadow-soft">
      <h2 className="text-xl font-bold font-logo text-text-primary mb-6">Personal Information</h2>

      {/* Profile photo upload row */}
      <div className="mb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-bg-secondary overflow-hidden border-2 border-white shadow-md shrink-0 relative group">
          {imageUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg-secondary text-text-secondary font-bold text-2xl font-logo">
              {profile?.first_name?.[0] || 'U'}
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="rounded-full gap-2 border-border hover:bg-bg-secondary"
            onClick={() => fileInputRef.current?.click()}
            isDisabled={imageUploading}
          >
            <Upload size={16} /> {imageUploading ? 'Uploading...' : 'Upload New Photo'}
          </Button>
          <p className="text-xs text-text-tertiary mt-2 font-medium">Max 5MB, JPEG or PNG</p>
        </div>
      </div>

      <form onSubmit={handlePersonalSubmit} className="space-y-6">
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="first_name"
            defaultValue={profile?.first_name || ''}
            className="rounded-xl"
            placeholder="e.g. John"
          />
          <Input
            label="Last Name"
            name="last_name"
            defaultValue={profile?.last_name || ''}
            className="rounded-xl"
            placeholder="e.g. Doe"
          />
        </div>

        {/* Email / Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            defaultValue={profile?.email || ''}
            isDisabled // Read-only
            helperText="Contact support to change email"
            className="rounded-xl bg-bg-secondary/50 cursor-not-allowed opacity-70"
          />
          <Input
            label="Phone Number"
            name="phone"
            defaultValue={profile?.phone_number || ''}
            className="rounded-xl"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-text-primary">Location</label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline disabled:opacity-50"
            >
              {locationLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
              {locationLoading ? 'Locating...' : 'Get Current Location'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              name="city"
              value={locationData.city}
              onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
              className="rounded-xl"
              placeholder="City"
            />
            <Input
              name="state"
              value={locationData.state}
              onChange={(e) => setLocationData({ ...locationData, state: e.target.value })}
              className="rounded-xl"
              placeholder="State"
            />
            <Input
              name="zip_code"
              value={locationData.zip_code}
              onChange={(e) => setLocationData({ ...locationData, zip_code: e.target.value })}
              className="rounded-xl"
              placeholder="Zip Code"
            />
            <Input
              name="country"
              value={locationData.country}
              onChange={(e) => setLocationData({ ...locationData, country: e.target.value })}
              className="rounded-xl"
              placeholder="Country"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2 font-jakarta">
            Bio
          </label>
          <textarea
            name="bio"
            defaultValue={profile?.bio || ''}
            maxLength={500}
            className="w-full min-h-[120px] rounded-2xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 resize-y transition-shadow font-jakarta"
            placeholder="Tell the community a bit about yourself..."
          />
          <p className="mt-1 text-xs text-text-tertiary text-right font-medium">
            Max 500 chars
          </p>
        </div>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="rounded-full shadow-lg px-8"
            isLoading={updateProfileMutation.isLoading || imageUploading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderSecurity = () => (
    <Card className="rounded-[32px] border-border shadow-soft">
      <h2 className="text-xl font-bold font-logo text-text-primary mb-6">Account Security</h2>

      <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-5 max-w-md">
            <Input label="Current Password" name="currentPassword" type="password" className="rounded-xl" required placeholder="••••••••" />
            <Input label="New Password" name="newPassword" type="password" className="rounded-xl" required placeholder="••••••••" />
            <Input label="Confirm New Password" name="confirmPassword" type="password" className="rounded-xl" required placeholder="••••••••" />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-8 mt-4">
          <div>
            <p className="text-sm font-bold text-text-primary">Two-Factor Authentication</p>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              Add an extra layer of security (Coming Soon).
            </p>
          </div>
          <Switch
            label=""
            checked={false}
            onChange={() => { }}
            isDisabled
          />
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" variant="primary" className="rounded-full px-6" isLoading={changePasswordMutation.isLoading}>
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderPrivacy = () => (
    <Card className="rounded-[32px] border-border shadow-soft">
      <h2 className="text-xl font-bold font-logo text-text-primary mb-6">Privacy Settings</h2>
      <div className="text-center py-12 text-text-secondary bg-bg-secondary/20 rounded-2xl border border-dashed border-border mx-auto max-w-2xl">
        <Eye size={32} className="mx-auto text-text-tertiary mb-3 opacity-50" />
        <p className="font-semibold text-lg text-text-primary mb-1">Privacy Controls Coming Soon</p>
        <p className="text-sm text-text-tertiary">Detailed visibility settings for your profile and contact info will be available here.</p>
      </div>
    </Card>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'security': return renderSecurity();
      case 'privacy': return renderPrivacy();
      // Default fallback for others for now
      default: return (
        <Card className="rounded-[32px] border-border shadow-soft py-16 text-center">
          <div className="w-16 h-16 bg-bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 text-text-tertiary">
            {PROFILE_SECTIONS.find(s => s.id === activeSection)?.icon && React.createElement(PROFILE_SECTIONS.find(s => s.id === activeSection).icon, { size: 28 })}
          </div>
          <h2 className="text-xl font-bold font-logo text-text-primary mb-2">{PROFILE_SECTIONS.find(s => s.id === activeSection)?.label}</h2>
          <p className="text-text-secondary max-w-md mx-auto">This section is currently under development. Check back later for updates!</p>
        </Card>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-logo text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary font-jakarta">Manage your account preferences and profile details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-[24px] border border-border p-3 sticky top-24 shadow-sm">
            <nav className="space-y-1">
              {PROFILE_SECTIONS.map((section) => {
                const active = activeSection === section.id;
                const Icon = section.icon;
                const isDanger = section.id === 'delete';

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative overflow-hidden group
                            ${active
                        ? isDanger
                          ? 'bg-status-error text-white shadow-lg shadow-status-error/20'
                          : 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                        : isDanger
                          ? 'text-status-error hover:bg-status-error/10'
                          : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                      }
                          `}
                  >
                    <Icon size={18} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
