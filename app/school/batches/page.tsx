'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Batch } from '@/lib/types';

export default function BatchesPage() {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBatches([
        {
          id: 'B001',
          name: 'Batch A - Morning',
          startDate: '2024-01-15',
          endDate: '2024-04-15',
          instructorId: 'INS001',
          capacity: 30,
          enrolledCount: 28,
          status: 'ongoing',
        },
        {
          id: 'B002',
          name: 'Batch B - Afternoon',
          startDate: '2024-02-01',
          endDate: '2024-05-01',
          instructorId: 'INS002',
          capacity: 25,
          enrolledCount: 24,
          status: 'ongoing',
        },
        {
          id: 'B003',
          name: 'Batch C - Evening',
          startDate: '2024-03-15',
          endDate: '2024-06-15',
          instructorId: 'INS003',
          capacity: 30,
          enrolledCount: 15,
          status: 'ongoing',
        },
        {
          id: 'B004',
          name: 'Batch D - Weekend',
          startDate: '2024-04-01',
          endDate: '2024-07-01',
          instructorId: 'INS001',
          capacity: 20,
          enrolledCount: 0,
          status: 'upcoming',
        },
        {
          id: 'B005',
          name: 'Batch E - Morning (Past)',
          startDate: '2023-10-01',
          endDate: '2024-01-01',
          instructorId: 'INS002',
          capacity: 30,
          enrolledCount: 29,
          status: 'completed',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
        <Button className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700">
          <Plus size={18} />
          Create Batch
        </Button>
      </div>

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
                <span>{batch.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>{batch.endDate}</span>
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
                    width: `${(batch.enrolledCount / batch.capacity) * 100}%`,
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
              >
                View Details
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
