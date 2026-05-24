'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import KPICard from '@/components/shared/KPICard';
import { Payment } from '@/lib/types';
import { apiClient } from '@/lib/api';

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPayments() {
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

        const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/payments`);
        const mapped = data.map((p) => ({
          id: p.paymentID.toString(),
          studentId: p.enrollmentID.toString(),
          studentName: p.studentName || 'Unknown Student',
          amount: p.amountPaid,
          date: p.paymentDate.split('T')[0],
          status: 'completed' as const,
          description: p.courseName ? `School course fee: ${p.courseName}` : 'Driving School Fee',
          paymentMethod: p.chapaTransactionRef ? 'Chapa' : 'Other',
        }));
        setPayments(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = {
    completed: filteredPayments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    pending: filteredPayments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    total: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
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
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="mt-1 text-muted-foreground">
            Manage student payments and revenue
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-emerald-400 to-cyan-600 text-white font-semibold hover:from-emerald-500 hover:to-cyan-700">
          <Download size={18} />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard
          title="Total Revenue"
          value={`$${totals.total.toLocaleString()}`}
          description={`School (85%): $${(totals.total * 0.85).toLocaleString(undefined, { maximumFractionDigits: 2 })} / DVLD (15%): $${(totals.total * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          icon={<DollarSign size={24} />}
          color="emerald"
        />
        <KPICard
          title="Completed"
          value={`$${totals.completed.toLocaleString()}`}
          description={`School (85%): $${(totals.completed * 0.85).toLocaleString(undefined, { maximumFractionDigits: 2 })} / DVLD (15%): $${(totals.completed * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          icon={<DollarSign size={24} />}
          color="cyan"
        />
        <KPICard
          title="Pending"
          value={`$${totals.pending.toLocaleString()}`}
          description={`School (85%): $${(totals.pending * 0.85).toLocaleString(undefined, { maximumFractionDigits: 2 })} / DVLD (15%): $${(totals.pending * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          icon={<DollarSign size={24} />}
          color="amber"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by student name or description..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800/50 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Total Paid
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  School Share (85%)
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  DVLD Share (15%)
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredPayments.map((payment) => {
                const schoolShare = payment.amount * 0.85;
                const dvldShare = payment.amount * 0.15;
                return (
                  <tr
                    key={payment.id}
                    className="transition-colors hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {payment.studentName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      ${schoolShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-cyan-400">
                      ${dvldShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredPayments.length === 0 && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center">
          <p className="text-muted-foreground">
            No payments found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}
