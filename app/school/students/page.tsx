'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Student } from '@/lib/types';

export default function StudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: '1',
          name: 'Ahmed Hassan',
          email: 'ahmed@email.com',
          phone: '+1 234 567 8900',
          enrollmentDate: '2024-01-15',
          status: 'active',
          progress: 75,
          batchId: 'B001',
          currentLevel: 2,
        },
        {
          id: '2',
          name: 'Sara Johnson',
          email: 'sara@email.com',
          phone: '+1 234 567 8901',
          enrollmentDate: '2024-02-01',
          status: 'active',
          progress: 60,
          batchId: 'B002',
          currentLevel: 2,
        },
        {
          id: '3',
          name: 'Mohamed Ali',
          email: 'mohamed@email.com',
          phone: '+1 234 567 8902',
          enrollmentDate: '2023-12-10',
          status: 'completed',
          progress: 100,
          batchId: 'B001',
          currentLevel: 3,
        },
        {
          id: '4',
          name: 'Fatima Khan',
          email: 'fatima@email.com',
          phone: '+1 234 567 8903',
          enrollmentDate: '2024-03-05',
          status: 'active',
          progress: 45,
          batchId: 'B003',
          currentLevel: 1,
        },
        {
          id: '5',
          name: 'Omar Sheikh',
          email: 'omar@email.com',
          phone: '+1 234 567 8904',
          enrollmentDate: '2024-01-20',
          status: 'suspended',
          progress: 30,
          batchId: 'B002',
          currentLevel: 1,
        },
      ]);
      setLoading(false);
    }, 1000);
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
                    <Link
                      href={`/school/student/${student.id}`}
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View
                      <ArrowRight size={16} />
                    </Link>
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
    </div>
  );
}
