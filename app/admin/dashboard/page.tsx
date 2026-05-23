'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Award } from 'lucide-react';
import KPICard from '@/components/shared/KPICard';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        totalSchools: 12,
        totalStudents: 2840,
        totalRevenue: 425300,
        totalCertificates: 384,
        revenueBySchool: [
          { school: 'DVLD Academy', revenue: 125400 },
          { school: 'Elite Driving', revenue: 98500 },
          { school: 'City Drivers', revenue: 87600 },
          { school: 'Professional Driving', revenue: 76300 },
          { school: 'Safety First', revenue: 37500 },
        ],
        enrollmentGrowth: [
          { month: 'Jan', count: 180 },
          { month: 'Feb', count: 245 },
          { month: 'Mar', count: 320 },
          { month: 'Apr', count: 415 },
          { month: 'May', count: 520 },
          { month: 'Jun', count: 650 },
        ],
        schoolsActiveStatus: [
          { name: 'Active', count: 10 },
          { name: 'Pending', count: 2 },
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

  const COLORS = ['#06b6d4', '#f59e0b'];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Global metrics and insights across all partner schools
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Partner Schools"
          value={metrics.totalSchools}
          icon={<Building2 size={24} />}
          color="cyan"
          trend={{ value: 2, isPositive: true }}
        />
        <KPICard
          title="Total Students"
          value={metrics.totalStudents}
          icon={<Users size={24} />}
          color="blue"
          trend={{ value: 18, isPositive: true }}
        />
        <KPICard
          title="Total Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(1)}K`}
          icon={<TrendingUp size={24} />}
          color="emerald"
          trend={{ value: 22, isPositive: true }}
        />
        <KPICard
          title="Certificates Issued"
          value={metrics.totalCertificates}
          icon={<Award size={24} />}
          color="amber"
          description="This month: 52"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue by School */}
        <div className="lg:col-span-2 glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Revenue by School
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.revenueBySchool}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                textStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Schools Status */}
        <div className="glass rounded-lg border border-slate-800/50 p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Schools Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.schoolsActiveStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {metrics.schoolsActiveStatus.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                textStyle={{ color: '#e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enrollment Growth */}
      <div className="glass rounded-lg border border-slate-800/50 p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          Enrollment Growth
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={metrics.enrollmentGrowth}>
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
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
