'use client';

import { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { SchoolSettings } from '@/lib/types';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSettings({
        schoolName: 'DVLD Training Academy',
        address: '123 Main Street, City, Country',
        phone: '+1 234 567 8900',
        email: 'contact@dvld-academy.com',
        licenseNumber: 'DL-2024-001',
        operatingHours: 'Mon-Sun: 8:00 AM - 6:00 PM',
        maxStudentsPerBatch: 30,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (field: keyof SchoolSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
      setChanged(true);
    }
  };

  const handleSave = async () => {
    // Simulate API call
    console.log('Saving settings:', settings);
    setChanged(false);
    // Show success toast (would integrate with toast system)
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">School Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your school information and configuration
        </p>
      </div>

      {/* School Information */}
      <div className="glass rounded-lg border border-slate-800/50 p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Basic Information
          </h2>

          {/* School Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              School Name
            </label>
            <Input
              value={settings.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
            />
          </div>

          {/* License Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              License Number
            </label>
            <Input
              value={settings.licenseNumber}
              onChange={(e) => handleChange('licenseNumber', e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Address
            </label>
            <textarea
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full rounded-lg glass border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Phone size={16} />
              Phone
            </label>
            <Input
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
            <Input
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              type="email"
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
            />
          </div>

          {/* Operating Hours */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Operating Hours
            </label>
            <Input
              value={settings.operatingHours}
              onChange={(e) => handleChange('operatingHours', e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="glass rounded-lg border border-slate-800/50 p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Configuration
          </h2>

          {/* Max Students Per Batch */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Maximum Students per Batch
            </label>
            <Input
              type="number"
              value={settings.maxStudentsPerBatch}
              onChange={(e) =>
                handleChange('maxStudentsPerBatch', parseInt(e.target.value))
              }
              className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Set the maximum number of students allowed per training batch
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-lg border border-rose-500/30 p-8 space-y-6 bg-gradient-to-br from-rose-500/10 to-rose-400/5">
        <div>
          <h2 className="text-xl font-semibold text-rose-400 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            These actions cannot be undone. Please proceed with caution.
          </p>

          <Button className="gap-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30">
            Delete School Profile
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!changed}
          className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {changed ? 'Save Changes' : 'Saved'}
        </Button>
      </div>
    </div>
  );
}
