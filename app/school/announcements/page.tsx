'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Announcement } from '@/lib/types';

import { apiClient } from '@/lib/api';

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError('User not logged in');
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);
        const schoolId = user.schoolId;
        if (!schoolId) {
          setError('No school association found for user');
          setLoading(false);
          return;
        }

        const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/announcements`);
        const mapped = data.map((a) => ({
          id: a.announcementID.toString(),
          title: a.title,
          content: a.content,
          createdBy: 'School Admin',
          createdAt: a.dateCreated.split('T')[0],
          priority: 'medium',
          targetAudience: ['students', 'instructors'],
        }));
        setAnnouncements(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSubmitting(true);
    setError('');
    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const schoolId = user ? parseInt(user.schoolId) : 1;
      const userId = user ? parseInt(user.id) : 1;

      await apiClient.post('/DrivingInstitutes/announcements', {
        instituteID: schoolId,
        batchID: null,
        title,
        content,
        createdByUserID: userId,
      });

      // Reload
      const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/announcements`);
      const mapped = data.map((a) => ({
        id: a.announcementID.toString(),
        title: a.title,
        content: a.content,
        createdBy: 'School Admin',
        createdAt: a.dateCreated.split('T')[0],
        priority: 'medium',
        targetAudience: ['students', 'instructors'],
      }));
      setAnnouncements(mapped);

      setTitle('');
      setContent('');
      setPriority('medium');
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to publish announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  const priorityColor = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="mt-1 text-muted-foreground">
            Manage school announcements and updates
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700"
        >
          <Plus size={18} />
          New Announcement
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/20 p-4 text-rose-400 border border-rose-500/30">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Create New Announcement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                className="glass border-slate-700/50 bg-slate-900/40 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Announcement content"
                rows={4}
                className="w-full rounded-lg glass border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="glass rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700"
              >
                Publish
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="ghost"
                className="flex-1 text-muted-foreground hover:bg-slate-800/50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="glass card-hover rounded-lg border border-slate-800/50 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {announcement.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                      priorityColor[announcement.priority]
                    }`}
                  >
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2">
                  {announcement.content}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>By {announcement.createdBy}</span>
                  <span>{announcement.createdAt}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
