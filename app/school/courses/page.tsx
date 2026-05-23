'use client';

import { useState, useEffect } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { Course } from '@/lib/types';

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setCourses([
        {
          id: 'C001',
          name: 'Basic Driving',
          code: 'BD-01',
          description: 'Introduction to driving fundamentals and road safety',
          duration: 20,
          level: 1,
          instructor: 'Ahmed Hassan',
          status: 'active',
        },
        {
          id: 'C002',
          name: 'City Driving',
          code: 'CD-01',
          description: 'Navigate through city traffic and urban roads',
          duration: 15,
          level: 2,
          instructor: 'Sara Johnson',
          status: 'active',
        },
        {
          id: 'C003',
          name: 'Highway Driving',
          code: 'HD-01',
          description: 'High-speed driving on highways and expressways',
          duration: 12,
          level: 2,
          instructor: 'Mohamed Ali',
          status: 'active',
        },
        {
          id: 'C004',
          name: 'Advanced Techniques',
          code: 'AT-01',
          description: 'Advanced driving techniques and defensive driving',
          duration: 10,
          level: 3,
          instructor: 'Fatima Khan',
          status: 'active',
        },
        {
          id: 'C005',
          name: 'Parking Mastery',
          code: 'PM-01',
          description: 'Master different parking techniques',
          duration: 8,
          level: 1,
          instructor: 'Omar Sheikh',
          status: 'inactive',
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
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">Manage training courses</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700">
          <Plus size={18} />
          Add Course
        </Button>
      </div>

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
                <div>
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
                  {course.duration}h
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level</span>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-xs font-semibold text-blue-400">
                  {course.level}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Instructor</span>
                <span className="text-foreground font-semibold">
                  {course.instructor}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
