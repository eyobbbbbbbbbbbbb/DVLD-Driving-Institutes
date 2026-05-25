'use client';

import { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, Award, FileCheck, Loader2, Sparkles, Phone, Users, Calendar, Trophy, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

interface StudentEligibility {
  applicantBatchID: number;
  applicationID: number;
  personID: number;
  fullName: string;
  phone: string;
  className: string;
  isEligibleForTest: boolean;
  totalSessions: number;
  presentCount: number;
  attendanceRate: number;
  nextTestTypeID: number;
  nextTestName: string;
  hasPendingTest: boolean;
  hasFailedLast: boolean;
}

export default function EligibilityPage() {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [students, setStudents] = useState<StudentEligibility[]>([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Load Batches
  useEffect(() => {
    async function loadBatches() {
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

        const batchesList = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/batches`);
        setBatches(batchesList);
        if (batchesList.length > 0) {
          setSelectedBatchId(batchesList[0].batchID.toString());
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load batches');
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  // 2. Load Batch Students & Eligibility
  useEffect(() => {
    if (!selectedBatchId) return;
    loadEligibilityData();
  }, [selectedBatchId]);

  async function loadEligibilityData() {
    setLoading(true);
    setError('');
    try {
      const eligibilityList = await apiClient.get<StudentEligibility[]>(
        `/DrivingInstitutes/batches/${selectedBatchId}/eligibility`
      );
      setStudents(eligibilityList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load student eligibility review list');
    } finally {
      setLoading(false);
    }
  }

  // 3. Toggle Student Eligibility
  const handleToggleEligibility = async (applicationId: number, currentStatus: boolean) => {
    setUpdatingId(applicationId);
    setError('');
    setSuccessMsg('');
    const newStatus = !currentStatus;

    try {
      await apiClient.put(
        `/DrivingInstitutes/batches/${selectedBatchId}/eligibility/${applicationId}`,
        { isEligible: newStatus }
      );
      
      setSuccessMsg(
        `Successfully updated student clearance to ${newStatus ? 'ELIGIBLE' : 'NOT CLEARED'}!`
      );
      
      // Update local state directly for responsive feedback
      setStudents((prev) =>
        prev.map((s) =>
          s.applicationID === applicationId
            ? { ...s, isEligibleForTest: newStatus }
            : s
        )
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update student eligibility status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && batches.length === 0) {
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
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Award className="text-cyan-400" size={32} />
            Test Eligibility Clearance
          </h1>
          <p className="mt-1 text-muted-foreground">
            Clear students for DVLD testing based on attendance and course completion rates.
          </p>
        </div>
      </div>

      {/* Select Batch Dropdown */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">Select Training Batch:</label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="glass rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-foreground"
          >
            {batches.map((b) => (
              <option key={b.batchID} value={b.batchID}>
                {b.batchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-lg bg-rose-500/20 p-4 text-rose-400 border border-rose-500/30 flex items-center gap-2">
          <ShieldAlert size={20} />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-lg bg-emerald-500/20 p-4 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
          <Sparkles size={20} />
          {successMsg}
        </div>
      )}

      {/* Students Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={1} />
      ) : (
        <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800/50 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Driving Class
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                    Attendance Rate
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                    DVLD Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {students.map((student) => {
                  const isEligible = student.isEligibleForTest;
                  const rate = student.attendanceRate;
                  const isRecommended = rate >= 80;

                  // Determine display properties based on next test type and status
                  let statusBadgeColor = 'text-muted-foreground border-slate-700 bg-slate-800/20 hover:bg-slate-800/20';
                  let statusText = 'Not Cleared';
                  let statusIcon = <X size={12} />;
                  let actionBtnLabel = 'Clear for Test';
                  let actionBtnIcon = <FileCheck size={14} />;
                  let isBtnDisabled = false;
                  let btnVariant: 'default' | 'destructive' | 'outline' = 'default';
                  let btnClass = 'bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white';

                  if (student.nextTestTypeID === 4) {
                    statusBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20';
                    statusText = 'All Tests Passed';
                    statusIcon = <Trophy size={12} />;
                    actionBtnLabel = 'Completed';
                    actionBtnIcon = <Trophy size={14} />;
                    isBtnDisabled = true;
                    btnVariant = 'outline';
                    btnClass = 'border-slate-800 bg-slate-800/20 text-muted-foreground';
                  } else if (student.hasPendingTest) {
                    statusBadgeColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20';
                    statusText = `Scheduled: ${student.nextTestName}`;
                    statusIcon = <Calendar size={12} />;
                    actionBtnLabel = 'Scheduled';
                    actionBtnIcon = <Calendar size={14} />;
                    isBtnDisabled = true;
                    btnVariant = 'outline';
                    btnClass = 'border-slate-800 bg-slate-800/20 text-muted-foreground';
                  } else if (isEligible) {
                    statusBadgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
                    statusText = `Cleared: ${student.nextTestName}`;
                    statusIcon = <Check size={12} />;
                    actionBtnLabel = 'Revoke Clearance';
                    actionBtnIcon = <X size={14} />;
                    btnVariant = 'destructive';
                    btnClass = '';
                  } else {
                    actionBtnLabel = `Clear for ${student.nextTestName || 'Test'}`;
                    if (student.hasFailedLast) {
                      statusBadgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/20';
                      statusText = `Failed last ${student.nextTestName}`;
                      statusIcon = <AlertCircle size={12} />;
                    } else {
                      statusBadgeColor = 'text-muted-foreground border-slate-700 bg-slate-800/20 hover:bg-slate-800/20';
                      statusText = `Needs ${student.nextTestName || 'Test'}`;
                      statusIcon = <ArrowRight size={12} />;
                    }
                  }

                  return (
                    <tr
                      key={student.applicationID}
                      className="transition-colors hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone size={12} /> {student.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {student.className}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isRecommended
                                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
                              }`}
                              style={{ width: `${Math.min(100, rate)}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-semibold ${isRecommended ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {student.presentCount} / {student.totalSessions} ({rate}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant="outline"
                          className={statusBadgeColor}
                        >
                          <span className="flex items-center gap-1">
                            {statusIcon} {statusText}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          size="sm"
                          variant={btnVariant}
                          disabled={isBtnDisabled || updatingId === student.applicationID}
                          onClick={() => handleToggleEligibility(student.applicationID, isEligible)}
                          className={`w-44 gap-2 font-medium ${btnClass}`}
                        >
                          {updatingId === student.applicationID ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              {actionBtnIcon} {actionBtnLabel}
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Students in Batch */}
      {!loading && students.length === 0 && (
        <div className="glass rounded-lg border border-slate-800/50 p-12 text-center flex flex-col items-center justify-center gap-3">
          <Users size={48} className="text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No students enrolled in this batch.</p>
        </div>
      )}
    </div>
  );
}
