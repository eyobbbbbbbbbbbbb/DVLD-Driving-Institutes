'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, ShieldCheck, GraduationCap, Briefcase, Award, Plus, Trash2, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

interface Instructor {
  instructorID: number;
  userID: number;
  userName: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  isManager: boolean;
  hireDate: string;
}

export default function InstructorsPage() {
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [error, setError] = useState('');

  // Modals & Forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.schoolId) {
        setSchoolId(parseInt(user.schoolId));
      } else {
        setError('No school association found for user');
        setLoading(false);
      }
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (schoolId) {
      loadInstructors();
    }
  }, [schoolId]);

  async function loadInstructors() {
    try {
      setLoading(true);
      const data = await apiClient.get<Instructor[]>(`/DrivingInstitutes/${schoolId}/instructors`);
      setInstructors(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddInstructor(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim() || !schoolId) return;

    try {
      setSubmitting(true);
      setModalError('');
      await apiClient.post(`/DrivingInstitutes/${schoolId}/instructors`, {
        username: newUsername.trim()
      });
      setShowAddModal(false);
      setNewUsername('');
      await loadInstructors();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Failed to add instructor. Verify username.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveInstructor(userId: number) {
    if (!schoolId) return;
    if (!confirm('Are you sure you want to remove this instructor?')) return;

    try {
      await apiClient.delete(`/DrivingInstitutes/${schoolId}/instructors/${userId}`);
      await loadInstructors();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to remove instructor.');
    }
  }

  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch =
      inst.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'manager' && inst.isManager) ||
      (roleFilter === 'instructor' && !inst.isManager);

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="table" count={1} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Instructors & Managers</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage teaching staff and administration for your driving academy
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700"
        >
          <Plus size={18} />
          Add Instructor
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/20 p-4 text-sm text-rose-400 border border-rose-500/30">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name, username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="glass rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
        >
          <option value="all">All Roles</option>
          <option value="manager">Managers Only</option>
          <option value="instructor">Instructors Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800/50 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Username / Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Hire Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInstructors.map((inst) => (
                <tr
                  key={inst.instructorID}
                  className="transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{inst.fullName}</p>
                      {inst.isManager ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 border border-cyan-500/20">
                          <Briefcase size={10} />
                          Academy Manager
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                          <GraduationCap size={10} />
                          Instructor
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {inst.phone || 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{inst.userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail size={10} /> {inst.email || 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      {inst.isManager ? (
                        <span className="text-foreground font-medium flex items-center gap-1.5">
                          <Award size={16} className="text-amber-500" />
                          Manager
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <GraduationCap size={16} className="text-cyan-400" />
                          Instructor
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inst.isActive ? 'active' : 'inactive'} label={inst.isActive ? 'Active' : 'Suspended'} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(inst.hireDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!inst.isManager && (
                      <button
                        onClick={() => handleRemoveInstructor(inst.userID)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        title="Remove Instructor"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredInstructors.length === 0 && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <p className="text-muted-foreground">
            No instructors or managers found matching your filters
          </p>
        </div>
      )}

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-xl border border-slate-700/50 p-8 shadow-2xl mx-4 animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Add Staff Instructor
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setModalError(''); setNewUsername(''); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddInstructor} className="space-y-5">
              {modalError && (
                <div className="rounded-lg bg-rose-500/20 p-3 text-sm text-rose-400 border border-rose-500/30">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  User Username <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. john_doe"
                  disabled={submitting}
                  required
                  className="glass border-slate-700/50 bg-slate-900/40 text-foreground placeholder:text-muted-foreground"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  The user must already have a DVLD account.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting || !newUsername.trim()}
                  className="flex-1 gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Instructor'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => { setShowAddModal(false); setModalError(''); setNewUsername(''); }}
                  variant="ghost"
                  className="flex-1 text-muted-foreground hover:bg-slate-800/50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
