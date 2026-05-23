'use client';

import { useState, useEffect } from 'react';
import { Check, X, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';

interface AttendanceEntry {
  studentId: string;
  studentName: string;
  present: boolean;
  late: boolean;
}

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAttendance([
        { studentId: '1', studentName: 'Ahmed Hassan', present: true, late: false },
        { studentId: '2', studentName: 'Sara Johnson', present: true, late: false },
        { studentId: '3', studentName: 'Mohamed Ali', present: false, late: false },
        { studentId: '4', studentName: 'Fatima Khan', present: true, late: true },
        { studentId: '5', studentName: 'Omar Sheikh', present: true, late: false },
        { studentId: '6', studentName: 'Leila Hassan', present: false, late: false },
        { studentId: '7', studentName: 'Karim Ahmed', present: true, late: false },
        { studentId: '8', studentName: 'Amira Mohammed', present: true, late: false },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleToggle = (studentId: string, type: 'present' | 'late') => {
    setAttendance((prev) =>
      prev.map((entry) => {
        if (entry.studentId === studentId) {
          if (type === 'present') {
            return { ...entry, present: !entry.present, late: false };
          } else {
            return { ...entry, late: !entry.late, present: true };
          }
        }
        return entry;
      })
    );
  };

  const handleMarkAllPresent = () => {
    setAttendance((prev) =>
      prev.map((entry) => ({
        ...entry,
        present: true,
        late: false,
      }))
    );
  };

  const stats = {
    present: attendance.filter((a) => a.present && !a.late).length,
    late: attendance.filter((a) => a.late).length,
    absent: attendance.filter((a) => !a.present).length,
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
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="mt-1 text-muted-foreground">
            Mark attendance for today&apos;s class
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleMarkAllPresent}
            className="gap-2 bg-gradient-to-r from-blue-400 to-cyan-600 text-white font-semibold hover:from-blue-500 hover:to-cyan-700"
          >
            <Check size={18} />
            Mark All Present
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-400 to-cyan-600 text-white font-semibold hover:from-emerald-500 hover:to-cyan-700">
            <Download size={18} />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="glass rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass rounded-lg border border-emerald-500/30 p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-400/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {stats.present}
              </p>
            </div>
            <Check size={32} className="text-emerald-400 opacity-80" />
          </div>
        </div>

        <div className="glass rounded-lg border border-amber-500/30 p-6 bg-gradient-to-br from-amber-500/20 to-amber-400/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Late</p>
              <p className="mt-2 text-3xl font-bold text-amber-400">
                {stats.late}
              </p>
            </div>
            <Clock size={32} className="text-amber-400 opacity-80" />
          </div>
        </div>

        <div className="glass rounded-lg border border-rose-500/30 p-6 bg-gradient-to-br from-rose-500/20 to-rose-400/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="mt-2 text-3xl font-bold text-rose-400">
                {stats.absent}
              </p>
            </div>
            <X size={32} className="text-rose-400 opacity-80" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800/50 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Student Name
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                  Present
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                  Late
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {attendance.map((entry) => {
                let status = 'Absent';
                if (entry.present && entry.late) {
                  status = 'Late';
                } else if (entry.present) {
                  status = 'Present';
                }

                return (
                  <tr
                    key={entry.studentId}
                    className="transition-colors hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {entry.studentName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(entry.studentId, 'present')}
                        className={`inline-flex items-center justify-center h-10 w-10 rounded-lg transition-all ${
                          entry.present && !entry.late
                            ? 'bg-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800/50 text-muted-foreground hover:bg-slate-800'
                        }`}
                      >
                        <Check size={20} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(entry.studentId, 'late')}
                        className={`inline-flex items-center justify-center h-10 w-10 rounded-lg transition-all ${
                          entry.late
                            ? 'bg-amber-500/30 text-amber-400'
                            : 'bg-slate-800/50 text-muted-foreground hover:bg-slate-800'
                        }`}
                      >
                        <Clock size={20} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          status === 'Present'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : status === 'Late'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700">
          Save Attendance
        </Button>
      </div>
    </div>
  );
}
