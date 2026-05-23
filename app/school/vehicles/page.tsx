'use client';

import { useState, useEffect } from 'react';
import { Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

export default function VehiclesPage() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadVehicles() {
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

        const data = await apiClient.get<any[]>(`/DrivingInstitutes/${schoolId}/vehicles`);
        const mapped = data.map((v) => ({
          id: v.ownershipID.toString(),
          registrationNumber: v.plateNumber || 'N/A',
          make: v.make || 'Toyota',
          model: v.modelName || 'Corolla',
          year: v.year || 2023,
          type: v.color || 'Sedan',
          status: v.saleDate ? 'maintenance' : 'available',
          lastMaintenanceDate: (v.purchaseDate || new Date().toISOString()).split('T')[0],
        }));
        setVehicles(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

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
          <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
          <p className="mt-1 text-muted-foreground">
            Manage training vehicles and maintenance
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700">
          <Plus size={18} />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicles Table */}
      <div className="glass rounded-lg border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800/50 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Registration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Make &amp; Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Year
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Last Maintenance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-400">
                      {vehicle.registrationNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {vehicle.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {vehicle.type}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={vehicle.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(vehicle.lastMaintenanceDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                    >
                      <Wrench size={16} />
                      Schedule
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
