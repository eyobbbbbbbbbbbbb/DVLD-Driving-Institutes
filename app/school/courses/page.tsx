'use client';

import { useState, useEffect } from 'react';
import { Plus, Clock, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

interface Course {
  id: string;
  courseId: number;
  name: string;
  code: string;
  description: string;
  duration: number;
  level: number;
  fee: number;
  status: string;
}

interface CourseFormState {
  courseName: string;
  durationInDays: number;
  courseFee: number;
}

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number>(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<CourseFormState>({
    courseName: '',
    durationInDays: 30,
    courseFee: 0,
  });

  // Delete confirm
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSchoolId(parseInt(user.schoolId));
      setUserId(parseInt(user.id) || 1);
    }
  }, []);

  useEffect(() => {
    if (schoolId) loadCourses();
  }, [schoolId]);

  async function loadCourses() {
    try {
      setLoading(true);
      if (!schoolId) {
        setError('No school association found for user');
        return;
      }
      const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/courses`);
      const mapped = data.map((c) => ({
        id: c.courseID.toString(),
        courseId: c.courseID,
        name: c.courseName,
        code: `C-${c.courseID}`,
        description: `Comprehensive training for ${c.courseName}`,
        duration: c.durationInDays,
        level: 1,
        fee: c.courseFee,
        status: 'active',
      }));
      setCourses(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingCourse(null);
    setForm({ courseName: '', durationInDays: 30, courseFee: 0 });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setForm({
      courseName: course.name,
      durationInDays: course.duration,
      courseFee: course.fee,
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseName.trim()) {
      setFormError('Course name is required.');
      return;
    }
    if (!schoolId) return;

    setSubmitting(true);
    setFormError('');
    try {
      if (editingCourse) {
        // Update existing
        await apiClient.put(`/DrivingInstitutes/courses/${editingCourse.courseId}`, {
          instituteID: schoolId,
          courseName: form.courseName,
          durationInDays: form.durationInDays,
          courseFee: form.courseFee,
        });
      } else {
        // Create new
        await apiClient.post('/DrivingInstitutes/courses', {
          instituteID: schoolId,
          courseName: form.courseName,
          durationInDays: form.durationInDays,
          courseFee: form.courseFee,
          createdByUserID: userId,
        });
      }
      closeModal();
      await loadCourses();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to save course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!schoolId) return;
    setDeletingCourseId(course.id);
    try {
      await apiClient.delete(`/DrivingInstitutes/${schoolId}/courses/${course.courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete course. It may be referenced by existing enrollments.');
    } finally {
      setDeletingCourseId(null);
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
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">Manage training courses offered by your institute</p>
        </div>
        <Button
          onClick={openAddModal}
          className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700"
        >
          <Plus size={18} />
          Add Course
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-500/20 p-4 text-rose-400 border border-rose-500/30">
          {error}
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="glass card-hover rounded-lg border border-slate-800/50 p-6"
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {course.name}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-cyan-400">
                    {course.code}
                  </p>
                </div>
                <StatusBadge status={course.status} />
              </div>
            </div>

            {/* Description */}
            <p className="mb-6 text-sm text-muted-foreground">
              {course.description}
            </p>

            {/* Details */}
            <div className="mb-6 space-y-3 border-t border-slate-800/50 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <div className="flex items-center gap-1 text-foreground font-semibold">
                  <Clock size={16} />
                  {course.duration} Days
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Course Fee</span>
                <span className="text-emerald-400 font-semibold">
                  ${course.fee.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => openEditModal(course)}
                className="flex-1 gap-2 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
              >
                <Pencil size={14} />
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleDelete(course)}
                disabled={deletingCourseId === course.id}
                className="flex-1 gap-2 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 disabled:opacity-50"
              >
                {deletingCourseId === course.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <p className="text-muted-foreground">No courses found. Add your first course!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-xl border border-slate-700/50 p-8 shadow-2xl mx-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                  Course Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={form.courseName}
                  onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                  placeholder="e.g. Basic Driving Theory"
                  className="glass border-slate-700/50 bg-slate-900/40 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Duration (Days)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={form.durationInDays}
                  onChange={(e) =>
                    setForm({ ...form, durationInDays: parseInt(e.target.value) || 1 })
                  }
                  className="glass border-slate-700/50 bg-slate-900/40 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Fee ($)
                </label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.courseFee}
                  onChange={(e) =>
                    setForm({ ...form, courseFee: parseFloat(e.target.value) || 0 })
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
                  ) : editingCourse ? (
                    'Update Course'
                  ) : (
                    'Create Course'
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
    </div>
  );
}
