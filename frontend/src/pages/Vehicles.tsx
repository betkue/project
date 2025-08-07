/* eslint-disable @typescript-eslint/no-explicit-any */

import { useVehicles, createVehicle, updateVehicle, deleteVehicle } from '../hooks/useVehicles';
import { useState } from 'react';
import { Vehicle } from '@/type/vehicle';
import { Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Vehicles() {
  const { vehicles, setVehicles, loading: loadingVehicles } = useVehicles();
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<any>('ALL');

  const [batteryCapacity, setBatteryCapacity] = useState(0);
  const [currentChargeLevel, setCurrentChargeLevel] = useState(0);
  const [averageEnergyConsumption, setAverageEnergyConsumption] = useState(0);
  const [emissionGco2Km, setEmissionGco2Km] = useState(0);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<any>('ICE');
  const [status, setStatus] = useState<any>('available');

  const [loadingAction, setLoadingAction] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setBrand('');
    setModel('');
    setBatteryCapacity(0);
    setCurrentChargeLevel(0);
    setAverageEnergyConsumption(0);
    setEmissionGco2Km(0);
    setType('ICE');
    setStatus('available');
  };

  const openModal = (vehicle?: Vehicle) => {
    setEditingVehicle(vehicle ?? null);
    if (vehicle) {
      setBrand(vehicle.brand);
      setModel(vehicle.model);
      setType(vehicle.type);
      setStatus(vehicle.status);
      setBatteryCapacity(vehicle.batteryCapacity);
      setCurrentChargeLevel(vehicle.currentChargeLevel);
      setAverageEnergyConsumption(vehicle.averageEnergyConsumption);
      setEmissionGco2Km(vehicle.emissionGco2Km);
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingVehicle(null);
    resetForm();
  };

  const handleSubmit = async () => {
    setLoadingAction(true);
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, {
          brand, model, type, status, batteryCapacity,
          currentChargeLevel,
          averageEnergyConsumption,
          emissionGco2Km,
          lastUpdated: new Date(),
        });



        setVehicles((prev: Vehicle[]) =>
          prev.map((v: Vehicle) =>
            v.id === editingVehicle.id
              ? {
                ...v, brand, model, type, batteryCapacity,
                currentChargeLevel,
                averageEnergyConsumption,
                emissionGco2Km,
              }
              : v
          )
        );
      } else {
        const newVehicle = await createVehicle({
          brand, model, type, status, batteryCapacity,
          currentChargeLevel,
          averageEnergyConsumption,
          emissionGco2Km,
          lastUpdated: new Date(),
        });
        if (newVehicle) {

          setVehicles((prev: Vehicle[]) => [newVehicle, ...prev]);
        }
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this vehicle?');
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteVehicle(id);
      setVehicles((prev: Vehicle[]) => prev.filter((v: Vehicle) => v.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'ALL' || v.type === filterType;
    return matchSearch && matchType;
  });

  if (loadingVehicles) {
    return <Loader />;
  }

  return (
    <section className="relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Vehicle Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <Input
          placeholder="Search by brand or model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="border px-4 py-2 rounded-md text-sm"
        >
          <option value="ALL">All Types</option>
          <option value="ICE">ICE</option>
          <option value="BEV">BEV</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow rounded-lg text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-6 py-3 text-left">#</th>
              <th className="border px-6 py-3 text-left">Brand</th>
              <th className="border px-6 py-3 text-left">Model</th>
              <th className="border px-6 py-3 text-left">Battery</th>
              <th className="border px-6 py-3 text-left">Charge Level</th>
              <th className="border px-6 py-3 text-left">Energy Use</th>
              <th className="border px-6 py-3 text-left">Emissions</th>
              <th className="border px-6 py-3 text-left">Type</th>
              <th className="border px-6 py-3 text-left">Status</th>
              <th className="border px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v, index) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{v.brand}</td>
                <td className="border px-4 py-2">{v.model}</td>
                <td className="border px-4 py-2">{v.batteryCapacity} kWh</td>
                <td className="border px-4 py-2">{v.currentChargeLevel}%</td>
                <td className="border px-4 py-2">{v.averageEnergyConsumption} kWh/100km</td>
                <td className="border px-4 py-2">{v.emissionGco2Km} gCO₂/km</td>
                <td className="border px-4 py-2 capitalize">{v.type}</td>
                <td className="border px-4 py-2 capitalize">{v.status}</td>
                <td className="border px-4 py-2 space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => openModal(v)}
                    aria-label="Edit"
                    disabled={loadingAction}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(v.id)}
                    aria-label="Delete"
                    disabled={deletingId === v.id}
                  >
                    {deletingId === v.id ? 'Deleting...' : <Trash size={18} />}
                  </button>
                </td>
              </tr>
            ))}
            {!filteredVehicles.length && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-lg "
      >
        <Plus />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? 'Edit Vehicle' : 'Create Vehicle'}
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit().then(closeModal);
            }}
          >
            <label className='text-sm text-gray-500'>Brand</label>
            <Input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />

            <label className='text-sm text-gray-500'>Model</label>
            <Input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />

            <label className='text-sm text-gray-500'>Battery Capacity (kWh)</label>
            <Input
              type="number"
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(Number(e.target.value))}
              required
            />

            <label className='text-sm text-gray-500'>Current Charge Level (%)</label>
            <Input
              type="number"
              value={currentChargeLevel}
              onChange={(e) => setCurrentChargeLevel(Number(e.target.value))}
              required
            />

            <label className='text-sm text-gray-500'>Average Energy Consumption (kWh/100km)</label>
            <Input
              type="number"
              value={averageEnergyConsumption}
              onChange={(e) => setAverageEnergyConsumption(Number(e.target.value))}
              required
            />

            <label className='text-sm text-gray-500'>Emissions (gCO₂/km)</label>
            <Input
              type="number"
              value={emissionGco2Km}
              onChange={(e) => setEmissionGco2Km(Number(e.target.value))}
              required
            />

            <label className='text-sm text-gray-500'>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'ICE' | 'BEV')}
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="ICE">ICE</option>
              <option value="BEV">BEV</option>
            </select>

            <label className='text-sm text-gray-500'>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="available">Available</option>
              <option value="charging">Charging</option>
              <option value="in_use">In Use</option>
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={closeModal} disabled={loadingAction}>
                Cancel
              </Button>
              <Button type="submit" disabled={loadingAction}>
                {loadingAction
                  ? editingVehicle
                    ? 'Updating...'
                    : 'Creating...'
                  : editingVehicle
                    ? 'Update'
                    : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
