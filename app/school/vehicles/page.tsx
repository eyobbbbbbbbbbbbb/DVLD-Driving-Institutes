'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Wrench, X, Search, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/shared/StatusBadge';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { apiClient } from '@/lib/api';

export default function VehiclesPage() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogResults, setCatalogResults] = useState<any[]>([]);
  const [searchingCatalog, setSearchingCatalog] = useState(false);
  
  const [newVehicle, setNewVehicle] = useState({
    vehicleID: 0,
    vehicleName: '',
    plateNumber: '',
    vin: '',
    color: 'White',
    purchasePrice: 15000,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (catalogQuery.length < 2) {
      setCatalogResults([]);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(async () => {
      setSearchingCatalog(true);
      try {
        const res = await apiClient.get<any[]>(`/DrivingInstitutes/vehicles/catalog?search=${encodeURIComponent(catalogQuery)}`);
        setCatalogResults(res);
      } catch (err) {
        console.error('Failed to search catalog', err);
      } finally {
        setSearchingCatalog(false);
      }
    }, 500);
  }, [catalogQuery]);

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
        const sId = parseInt(user.schoolId);
        if (!sId) {
          setError('No school association found for user');
          setLoading(false);
          return;
        }
        setSchoolId(sId);

        const data = await apiClient.get<any[]>(`/DrivingInstitutes/${sId}/vehicles`);
        let mapped = data.map((v) => ({
          id: v.ownershipID.toString(),
          registrationNumber: v.plateNumber || 'N/A',
          make: v.make || 'Toyota',
          model: v.modelName || 'Corolla',
          year: v.year || 2023,
          type: v.color || 'Sedan',
          status: v.saleDate ? 'maintenance' : 'available',
          lastMaintenanceDate: (v.purchaseDate || new Date().toISOString()).split('T')[0],
        }));

        if (mapped.length === 0) {
          mapped = [
            {
              id: 'mock-1',
              registrationNumber: 'XYZ 123',
              make: 'Toyota',
              model: 'Corolla',
              year: 2023,
              type: 'Sedan',
              status: 'available',
              lastMaintenanceDate: '2025-01-15'
            },
            {
              id: 'mock-2',
              registrationNumber: 'ABC 987',
              make: 'Hyundai',
              model: 'Elantra',
              year: 2022,
              type: 'Sedan',
              status: 'available',
              lastMaintenanceDate: '2024-11-20'
            }
          ];
        }

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
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-700">
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

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass w-full max-w-2xl rounded-2xl border border-slate-700/50 p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-2 hover:bg-slate-800/50 transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Catalog Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search Vehicle Catalog</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search by make or model..."
                    value={catalogQuery}
                    onChange={(e) => setCatalogQuery(e.target.value)}
                    className="glass border-slate-700/50 bg-slate-900/40 pl-10 text-foreground"
                  />
                  {searchingCatalog && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-cyan-500" size={18} />
                  )}
                </div>
                
                {catalogResults.length > 0 && newVehicle.vehicleID === 0 && (
                  <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-900/80 p-2">
                    {catalogResults.map(res => (
                      <button
                        key={res.id}
                        onClick={() => {
                          setNewVehicle({ ...newVehicle, vehicleID: res.id, vehicleName: res.vehicleDisplayName });
                          setCatalogQuery('');
                          setCatalogResults([]);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-cyan-500/20 rounded-md transition-colors"
                      >
                        {res.vehicleDisplayName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Vehicle */}
              {newVehicle.vehicleID > 0 && (
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-cyan-400 font-semibold mb-1">Selected Model</p>
                    <p className="text-sm font-medium text-foreground">{newVehicle.vehicleName}</p>
                  </div>
                  <button
                    onClick={() => setNewVehicle({ ...newVehicle, vehicleID: 0, vehicleName: '' })}
                    className="text-xs text-muted-foreground hover:text-rose-400 transition-colors"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Details Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Plate Number</label>
                  <Input 
                    value={newVehicle.plateNumber}
                    onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                    className="glass border-slate-700/50 bg-slate-900/40 text-foreground" 
                    placeholder="XYZ-1234" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Color</label>
                  <Input 
                    value={newVehicle.color}
                    onChange={e => setNewVehicle({...newVehicle, color: e.target.value})}
                    className="glass border-slate-700/50 bg-slate-900/40 text-foreground" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Purchase Date</label>
                  <input 
                    type="date"
                    value={newVehicle.purchaseDate}
                    onChange={e => setNewVehicle({...newVehicle, purchaseDate: e.target.value})}
                    className="w-full rounded-lg glass border border-slate-700/50 bg-slate-900/40 px-4 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Purchase Price</label>
                  <Input 
                    type="number"
                    value={newVehicle.purchasePrice}
                    onChange={e => setNewVehicle({...newVehicle, purchasePrice: parseFloat(e.target.value) || 0})}
                    className="glass border-slate-700/50 bg-slate-900/40 text-foreground" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-slate-800/50 pt-6">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button 
                disabled={newVehicle.vehicleID === 0 || !newVehicle.plateNumber || submitting}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50"
                onClick={async () => {
                  if (!schoolId) return;
                  setSubmitting(true);
                  try {
                    const storedUser = localStorage.getItem('user');
                    const userId = storedUser ? JSON.parse(storedUser).id : 1;
                    await apiClient.post(`/DrivingInstitutes/${schoolId}/vehicles`, {
                      vehicleID: newVehicle.vehicleID,
                      plateNumber: newVehicle.plateNumber,
                      vin: 'V-' + Math.floor(Math.random() * 1000000),
                      color: newVehicle.color,
                      purchaseDate: newVehicle.purchaseDate,
                      purchasePrice: newVehicle.purchasePrice,
                      createdByUserID: parseInt(userId)
                    });
                    
                    setVehicles(prev => [...prev, {
                      id: `temp-${Date.now()}`,
                      registrationNumber: newVehicle.plateNumber,
                      make: newVehicle.vehicleName.split(' ')[0],
                      model: newVehicle.vehicleName.split(' ').slice(1).join(' '),
                      year: new Date().getFullYear(),
                      type: newVehicle.color,
                      status: 'available',
                      lastMaintenanceDate: newVehicle.purchaseDate
                    }]);
                    setShowAddModal(false);
                  } catch (err) {
                    console.error('Failed to save vehicle', err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {submitting ? 'Saving...' : 'Save Vehicle'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
