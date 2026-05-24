'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Pencil, X, Loader2, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Batch } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface BatchFormState {
  batchName: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
}

export default function BatchesPage() {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [error, setError] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<BatchFormState>({
    batchName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maxCapacity: 20,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSchoolId(parseInt(user.schoolId));
    }
  }, []);

  useEffect(() => {
    if (schoolId) loadBatches();
  }, [schoolId]);

  async function loadBatches() {
    try {
      setLoading(true);
      if (!schoolId) {
        setError('No school association found for user');
        return;
      }
      const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/batches`);
      const now = new Date();
      const mapped = data.map((b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        let status: 'upcoming' | 'ongoing' | 'completed' = 'ongoing';
        if (now > end) {
          status = 'completed';
        } else if (now < start) {
          status = 'upcoming';
        }
        return {
          id: b.batchID.toString(),
          name: b.batchName,
          startDate: b.startDate.split('T')[0],
          endDate: b.endDate.split('T')[0],
          instructorId: '',
          capacity: b.maxCapacity,
          enrolledCount: b.currentStudents,
          status,
        };
      });
      setBatches(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingBatch(null);
    setForm({
      batchName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxCapacity: 20,
    });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (batch: Batch) => {
    setEditingBatch(batch);
    setForm({
      batchName: batch.name,
      startDate: batch.startDate,
      endDate: batch.endDate,
      maxCapacity: batch.capacity,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBatch(null);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchName.trim()) {
      setFormError('Batch name is required.');
      return;
    }
    if (!schoolId) return;

    setSubmitting(true);
    setFormError('');
    try {
      if (editingBatch) {
        await apiClient.put(`/DrivingInstitutes/batches/${editingBatch.id}`, {
          instituteID: schoolId,
          batchName: form.batchName,
          startDate: form.startDate,
          endDate: form.endDate,
          maxCapacity: form.maxCapacity,
        });
      } else {
        await apiClient.post('/DrivingInstitutes/batches', {
          instituteID: schoolId,
          batchName: form.batchName,
          startDate: form.startDate,
          endDate: form.endDate,
          maxCapacity: form.maxCapacity,
        });
      }
      closeModal();
      await loadBatches();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save batch.');
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

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training Batches</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all training batches and enrollment
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700"
        >
          <Plus size={18} />
          Create Batch
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/20 p-4 text-rose-400 border border-rose-500/30">
          {error}
        </div>
      )}

      {/* Batches Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="glass card-hover rounded-lg border border-slate-800/50 p-6"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {batch.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  ID: {batch.id}
                </p>
              </div>
              <StatusBadge status={batch.status} />
            </div>

            {/* Dates */}
            <div className="mb-6 space-y-2 border-b border-slate-800/50 pb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>Start: {batch.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>End: {batch.endDate}</span>
              </div>
            </div>

            {/* Enrollment Progress */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Enrollment</span>
                <span className="font-semibold text-foreground">
                  {batch.enrolledCount}/{batch.capacity}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                  style={{
                    width: `${Math.min(100, (batch.enrolledCount / batch.capacity) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round((batch.enrolledCount / batch.capacity) * 100)}% full
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                onClick={() => setSelectedBatch(batch)}
              >
                <Eye size={14} className="mr-1" />
                View Details
              </Button>
              <Button
                variant="ghost"
                onClick={() => openEditModal(batch)}
                className="flex-1 gap-1 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
              >
                <Pencil size={14} />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {batches.length === 0 && !loading && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <p className="text-muted-foreground">No batches found. Create your first batch!</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-xl border border-slate-700/50 p-8 shadow-2xl mx-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <div className="rounded-lg bg-rose-500/20 p-3 text-sm text-rose-400 border border-rose-500/30">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Batch Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={form.batchName}
                  onChange={(e) => setForm({ ...form, batchName: e.target.value })}
                  placeholder="e.g. Batch A - June 2025"
                  className="glass border-slate-700/50 bg-slate-900/40 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full rounded-lg glass border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full rounded-lg glass border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max Capacity
                </label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxCapacity}
                  onChange={(e) =>
                    setForm({ ...form, maxCapacity: parseInt(e.target.value) || 1 })
                  }
                  className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingBatch ? (
                    'Update Batch'
                  ) : (
                    'Create Batch'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={closeModal}
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
      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in p-4">
          <div className="glass w-full max-w-lg rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{selectedBatch.name}</h2>
                <div className="mt-2">
                  <StatusBadge status={selectedBatch.status} />
                </div>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="rounded-full p-2 hover:bg-slate-800/50 transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-800/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                    <Calendar size={12} /> Start Date
                  </p>
                  <p className="text-sm font-medium">{selectedBatch.startDate}</p>
                </div>
                <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-800/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                    <Calendar size={12} /> End Date
                  </p>
                  <p className="text-sm font-medium">{selectedBatch.endDate}</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-800/50">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Users size={12} /> Enrollment Capacity
                  </p>
                  <span className="text-sm font-bold text-cyan-400">
                    {selectedBatch.enrolledCount} / {selectedBatch.capacity}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (selectedBatch.enrolledCount / selectedBatch.capacity) * 100)}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {Math.round((selectedBatch.enrolledCount / selectedBatch.capacity) * 100)}% full
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedBatch(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
