'use client';

import { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

interface RevenueRecord {
  id: string;
  school: string;
  month: string;
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  studentsEnrolled: number;
  status: 'completed' | 'pending';
}

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<RevenueRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRevenueData() {
      try {
        const schoolsList = await apiClient.get<any[]>('/DrivingInstitutes');

        const recordsPromises = schoolsList.map(async (school) => {
          try {
            const statsData = await apiClient.get<any>(`/DrivingInstitutes/${school.instituteID}/stats`);
            const totalRev = statsData.kpis?.totalEarnings || 0;
            return {
              id: school.instituteID.toString(),
              school: school.instituteName,
              month: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
              totalRevenue: totalRev,
              completedPayments: totalRev,
              pendingPayments: 0,
              studentsEnrolled: statsData.kpis?.totalStudents || 0,
              status: 'completed' as const,
            };
          } catch {
            return {
              id: school.instituteID.toString(),
              school: school.instituteName,
              month: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
              totalRevenue: 0,
              completedPayments: 0,
              pendingPayments: 0,
              studentsEnrolled: 0,
              status: 'completed' as const,
            };
          }
        });

        const resolvedRecords = await Promise.all(recordsPromises);
        setRecords(resolvedRecords);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load revenue report.');
      } finally {
        setLoading(false);
      }
    }
    loadRevenueData();
  }, []);

  const filteredRecords = records.filter((record) => {
    return (
      record.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.month.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalRevenue, 0);

  const handleExport = () => {
    // Simulate CSV export
    const csv = [
      ['School', 'Month', 'Total Revenue', 'Completed Payments', 'Pending Payments', 'Students', 'Status'],
      ...filteredRecords.map((r) => [
        r.school,
        r.month,
        `$${r.totalRevenue}`,
        `$${r.completedPayments}`,
        `$${r.pendingPayments}`,
        r.studentsEnrolled,
        r.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-report.csv';
    a.click();
  };

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
          <h1 className="text-3xl font-bold text-foreground">Revenue Report</h1>
          <p className="mt-1 text-muted-foreground">
            Detailed revenue analysis across all schools
          </p>
        </div>
        <Button
          onClick={handleExport}
          className="gap-2 bg-gradient-to-r from-emerald-400 to-cyan-600 text-white font-semibold hover:from-emerald-500 hover:to-cyan-700"
        >
          <Download size={18} />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">
            ${(totalRevenue / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <p className="text-sm text-muted-foreground">Records</p>
          <p className="mt-2 text-3xl font-bold text-blue-400">
            {filteredRecords.length}
          </p>
        </div>
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <p className="text-sm text-muted-foreground">Avg per School</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            ${(totalRevenue / (filteredRecords.length || 1) / 1000).toFixed(1)}K
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by school or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass border-slate-700/50 bg-slate-900/40 pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800/50 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  School
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Total Revenue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Completed
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Pending
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Students
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {record.school}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {record.month}
                  </td>
                  <td className="px-6 py-4 font-semibold text-cyan-400">
                    ${record.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-emerald-400">
                    ${record.completedPayments.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-amber-400">
                    ${record.pendingPayments.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center h-6 w-20 rounded-full bg-blue-500/20 text-xs font-semibold text-blue-400">
                      {record.studentsEnrolled}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredRecords.length === 0 && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <p className="text-muted-foreground">
            No records found matching your search
          </p>
        </div>
      )}
    </div>
  );
}
