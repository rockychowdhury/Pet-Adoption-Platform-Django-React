import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useAPI from '../../hooks/useAPI';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Layout/Card';
import Input from '../../components/common/Form/Input';
import Radio from '../../components/common/Form/Radio';
import Switch from '../../components/common/Form/Switch';
import Checkbox from '../../components/common/Form/Checkbox';
import Button from '../../components/common/Buttons/Button';

const PROFILE_SECTIONS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'security', label: 'Security' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'verification', label: 'Verification' },
  { id: 'delete', label: 'Delete Account' },
];

const ProfileSettingsPage = () => {
  const api = useAPI();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');

  // Basic user profile fetch (can be expanded later)
  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/users/me/');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Simple patch mutation for personal info
  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.patch('/users/me/', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      username: formData.get('username'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location_city: formData.get('city'),
      location_state: formData.get('state'),
      location_country: formData.get('country'),
      bio: formData.get('bio'),
    };
    updateProfileMutation.mutate(payload);
  };

  const renderPersonalInfo = () => (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Personal Information</h2>

      {/* Profile photo upload row */}
      <div className="mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-bg-secondary overflow-hidden border border-border">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.first_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary font-semibold">
              {user?.first_name?.[0] || '?'}
            </div>
          )}
        </div>
        <div>
          <Button variant="outline" size="sm" type="button">
            Upload New Photo
          </Button>
          <p className="text-xs text-text-tertiary mt-1">Max 5MB, JPEG or PNG</p>
        </div>
      </div>

      <form onSubmit={handlePersonalSubmit} className="space-y-8">
        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="first_name"
            defaultValue={profile?.first_name || user?.first_name || ''}
          />
          <Input
            label="Last Name"
            name="last_name"
            defaultValue={profile?.last_name || user?.last_name || ''}
          />
        </div>

        {/* Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Username"
            name="username"
            defaultValue={profile?.username || ''}
          />
        </div>

        {/* Email / Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            defaultValue={profile?.email || user?.email || ''}
            helperText="Used for login and important notifications"
          />
          <Input
            label="Phone Number"
            name="phone"
            defaultValue={profile?.phone || ''}
            helperText="For verification and adoption updates"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="City"
            name="city"
            defaultValue={profile?.location_city || ''}
          />
          <Input
            label="State / Region"
            name="state"
            defaultValue={profile?.location_state || ''}
          />
          <Input
            label="Country"
            name="country"
            defaultValue={profile?.location_country || ''}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            defaultValue={profile?.profile?.bio || ''}
            maxLength={500}
            className="w-full min-h-[120px] rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 resize-y"
            placeholder="Tell the community about you and your pets (max 500 characters)"
          />
          <p className="mt-1 text-xs text-text-tertiary">
            Up to 500 characters.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={updateProfileMutation.isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderSecurity = () => (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Account Security</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.info('Password change flow will be implemented with backend API.');
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Current Password" name="currentPassword" type="password" />
          <Input label="New Password" name="newPassword" type="password" />
          <Input label="Confirm New Password" name="confirmPassword" type="password" />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">Two-Factor Authentication</p>
            <p className="text-xs text-text-tertiary">
              Add an extra layer of security to your account (coming soon).
            </p>
          </div>
          <Switch
            label=""
            checked={false}
            onChange={() => { }}
            isDisabled
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderPrivacy = () => (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Privacy Settings</h2>

      <div className="space-y-8">
        {/* Profile visibility */}
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">Profile Visibility</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Radio
              name="profileVisibility"
              value="public"
              label="Public"
              checked
              onChange={() => { }}
            />
            <Radio
              name="profileVisibility"
              value="friends"
              label="Friends Only (Coming soon)"
              checked={false}
              onChange={() => { }}
              isDisabled
            />
            <Radio
              name="profileVisibility"
              value="private"
              label="Private"
              checked={false}
              onChange={() => { }}
            />
          </div>
        </div>

        {/* Contact info visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-text-primary mb-2">Email Visibility</p>
            <Radio
              name="emailVisibility"
              value="public"
              label="Public"
              checked
              onChange={() => { }}
            />
            <Radio
              name="emailVisibility"
              value="private"
              label="Private"
              checked={false}
              onChange={() => { }}
              className="mt-2"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary mb-2">Phone Visibility</p>
            <Radio
              name="phoneVisibility"
              value="public"
              label="Public"
              checked={false}
              onChange={() => { }}
            />
            <Radio
              name="phoneVisibility"
              value="private"
              label="Private"
              checked
              onChange={() => { }}
              className="mt-2"
            />
          </div>
        </div>

        {/* Activity status */}
        <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">Show Activity Status</p>
            <p className="text-xs text-text-tertiary">
              Let others see when you&apos;re online and active on PetCircle.
            </p>
          </div>
          <Switch
            label=""
            checked
            onChange={() => { }}
          />
        </div>
      </div>
    </Card>
  );

  const renderNotifications = () => (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Notification Preferences</h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">Email Notifications</p>
          <div className="space-y-3">
            <Checkbox
              label="New message received"
              checked
              onChange={() => { }}
            />
            <Checkbox
              label="Application submitted"
              checked
              onChange={() => { }}
            />
            <Checkbox
              label="Application status update"
              checked
              onChange={() => { }}
            />
            <Checkbox
              label="New review posted"
              checked
              onChange={() => { }}
            />
            <Checkbox
              label="Weekly digest"
              checked={false}
              onChange={() => { }}
            />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderVerification = () => (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Account Verification</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-text-primary">Email Verification</p>
            <p className="text-xs text-text-tertiary">
              {user?.email ? `Verified for ${user.email}` : 'Verify your email to secure your account.'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            isDisabled
          >
            Verified
          </Button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-text-primary">Phone Verification</p>
            <p className="text-xs text-text-tertiary">
              Add and verify your phone number to enable SMS updates.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
          >
            Verify Phone
          </Button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-text-primary">Identity Verification</p>
            <p className="text-xs text-text-tertiary">
              Upload a government-issued ID to earn a verified badge on your profile.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
          >
            Upload ID
          </Button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Pet Owner Verification</p>
            <p className="text-xs text-text-tertiary">
              Share vet records or adoption papers to confirm you are a responsible pet owner.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
          >
            Upload Documents
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderDeleteAccount = () => (
    <Card className="border-status-error/40 bg-status-error/5">
      <h2 className="text-xl font-semibold text-status-error mb-4">Delete Account</h2>
      <p className="text-sm text-text-secondary mb-4">
        This action cannot be undone. All your data, listings, applications, and messages will be permanently removed.
      </p>
      <Button
        type="button"
        variant="danger"
        size="md"
        onClick={() => toast.info('Account deletion flow will be implemented with backend API.')}
      >
        Delete My Account
      </Button>
    </Card>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <>
            {renderPersonalInfo()}
            {renderSecurity()}
            {renderPrivacy()}
            {renderNotifications()}
            {renderVerification()}
            {renderDeleteAccount()}
          </>
        );
      case 'security':
        return (
          <>
            {renderSecurity()}
            {renderDeleteAccount()}
          </>
        );
      case 'privacy':
        return (
          <>
            {renderPrivacy()}
            {renderNotifications()}
          </>
        );
      case 'notifications':
        return renderNotifications();
      case 'verification':
        return renderVerification();
      case 'delete':
        return renderDeleteAccount();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar for profile settings sections */}
        <aside className="w-full md:w-56 bg-bg-surface border border-border rounded-2xl p-4 h-fit">
          <nav className="space-y-1">
            {PROFILE_SECTIONS.map((section) => {
              const active = activeSection === section.id;
              const isDanger = section.id === 'delete';
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                    ? isDanger
                      ? 'bg-status-error text-white'
                      : 'bg-brand-secondary text-text-inverted'
                    : isDanger
                      ? 'text-status-error hover:bg-status-error/5'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                    }`}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main settings content */}
        <section className="flex-1 space-y-8">
          {renderActiveSection()}
        </section>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
