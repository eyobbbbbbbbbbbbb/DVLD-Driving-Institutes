'use client';

import { useState, useEffect } from 'react';
import { Users, Boxes, TrendingUp, BarChart3, Award, Zap } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function SchoolDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        totalStudents: 245,
        activeBatches: 8,
        instructors: 12,
        vehicles: 24,
        totalRevenue: 125400,
        attendanceRate: 94.5,
        certificatesIssued: 52,
        passRate: 87.3,
        enrollmentTrend: [
          { month: 'Jan', count: 120 },
          { month: 'Feb', count: 145 },
          { month: 'Mar', count: 180 },
          { month: 'Apr', count: 215 },
          { month: 'May', count: 245 },
        ],
        revenueByMonth: [
          { month: 'Jan', amount: 18000 },
          { month: 'Feb', amount: 22000 },
          { month: 'Mar', amount: 28000 },
          { month: 'Apr', amount: 30000 },
          { month: 'May', amount: 27400 },
        ],
        passRateByMonth: [
          { month: 'Jan', rate: 82 },
          { month: 'Feb', rate: 84 },
          { month: 'Mar', rate: 85 },
          { month: 'Apr', rate: 86 },
          { month: 'May', rate: 87.3 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back! Here&apos;s your school overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Students"
          value={metrics.totalStudents}
          icon={<Users size={24} />}
          color="cyan"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Batches"
          value={metrics.activeBatches}
          icon={<Boxes size={24} />}
          color="blue"
          trend={{ value: 3, isPositive: true }}
        />
        <KPICard
          title="Attendance Rate"
          value={`${metrics.attendanceRate}%`}
          icon={<TrendingUp size={24} />}
          color="emerald"
          trend={{ value: 2.1, isPositive: true }}
        />
        <KPICard
          title="Total Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(1)}K`}
          icon={<BarChart3 size={24} />}
          color="amber"
          trend={{ value: 8.5, isPositive: true }}
        />
        <KPICard
          title="Certificates Issued"
          value={metrics.certificatesIssued}
          icon={<Award size={24} />}
          color="rose"
          description="This month"
        />
        <KPICard
          title="Pass Rate"
          value={`${metrics.passRate}%`}
          icon={<Zap size={24} />}
          color="cyan"
          trend={{ value: 1.3, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrollment Trend */}
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Enrollment Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                textStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Month */}
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Revenue by Month
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                textStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Bar
                dataKey="amount"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pass Rate Trend */}
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Pass Rate Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.passRateByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                textStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Quick Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Instructors</span>
              <span className="text-2xl font-bold text-cyan-400">
                {metrics.instructors}
              </span>
            </div>
            <div className="border-t border-slate-800/50"></div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Training Vehicles</span>
              <span className="text-2xl font-bold text-blue-400">
                {metrics.vehicles}
              </span>
            </div>
            <div className="border-t border-slate-800/50"></div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Students</span>
              <span className="text-2xl font-bold text-emerald-400">
                {Math.round(metrics.totalStudents * 0.85)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
