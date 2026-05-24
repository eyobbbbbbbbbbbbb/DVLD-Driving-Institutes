'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowRight, X, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Student } from '@/lib/types';
import { apiClient } from '@/lib/api';

export default function StudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    async function loadStudents() {
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

        const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/students`);
        const mapped = data.map((std) => {
          const progress = std.isActive ? Math.floor(Math.random() * 40) + 40 : 100;
          return {
            id: std.enrollmentID.toString(),
            name: std.fullName || 'Unknown Student',
            email: std.email || `${(std.fullName || 'student').replace(/\s+/g, '').toLowerCase()}@email.com`,
            phone: std.phone || 'N/A',
            enrollmentDate: std.enrollmentDate,
            status: std.isActive ? ('active' as const) : ('completed' as const),
            progress: progress,
            batchId: 'N/A',
            currentLevel: 1,
          };
        });
        setStudents(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all enrolled students and track their progress
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700">
          <Plus size={18} />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800/50 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {student.email}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-400">
                      {student.currentLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredStudents.length === 0 && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <p className="text-muted-foreground">
            No students found matching your filters
          </p>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass w-full max-w-lg rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{selectedStudent.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-400" />
                  ID: {selectedStudent.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-full p-2 hover:bg-slate-800/50 transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-800/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                    <Mail size={12} /> Email
                  </p>
                  <p className="text-sm font-medium">{selectedStudent.email}</p>
                </div>
                <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-800/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                    <Phone size={12} /> Phone
                  </p>
                  <p className="text-sm font-medium">{selectedStudent.phone}</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-slate-900/50 p-4 border border-slate-800/50">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar size={12} /> Enrollment Progress
                  </p>
                  <span className="text-sm font-bold text-cyan-400">{selectedStudent.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-1000"
                    style={{ width: `${selectedStudent.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
