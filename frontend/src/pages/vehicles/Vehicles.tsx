import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Vehicle, VEHICLE_TYPES, VEHICLE_STATUSES, FUEL_TYPES } from '../../utils/constants';
import { useToast } from '../../components/common/Toast';
import { 
  Plus, Search, Eye, Edit2, Trash2, Truck, AlertCircle, Wrench, Shield, CheckCircle 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DataTable, { Column } from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';

const Vehicles: React.FC = () => {
  const { toast } = useToast();
  
  // Fleet list states
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    registration: '',
    type: 'Truck',
    model: '',
    capacity: 10,
    odometer: 0,
    fuelType: 'Diesel',
    status: 'Available' as Vehicle['status'],
    lastServiceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load vehicles from localStorage database
  const fetchVehicles = async () => {
    try {
      const v = await api.getVehicles();
      setVehicles(v);
    } catch (err: any) {
      toast('Failed to load fleet listings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter computations
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.registration.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const matchesType = typeFilter ? v.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Summary counts
  const totalCount = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
  const inMaintCount = vehicles.filter(v => v.status === 'In Maintenance').length;

  // Form setup
  const openAddModal = () => {
    setCurrentVehicle(null);
    setFormData({
      registration: '',
      type: 'Truck',
      model: '',
      capacity: 10,
      odometer: 0,
      fuelType: 'Diesel',
      status: 'Available',
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setFormData({
      registration: vehicle.registration,
      type: vehicle.type,
      model: vehicle.model,
      capacity: vehicle.capacity,
      odometer: vehicle.odometer,
      fuelType: vehicle.fuelType,
      status: vehicle.status,
      lastServiceDate: vehicle.lastServiceDate,
      nextServiceDate: vehicle.nextServiceDate
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openViewModal = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsViewOpen(true);
  };

  const openDeleteModal = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  // Form Submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    // Client validation
    const errors: Record<string, string> = {};
    if (!formData.registration.trim()) errors.registration = 'Registration number is required';
    if (!formData.model.trim()) errors.model = 'Vehicle model is required';
    if (formData.capacity <= 0) errors.capacity = 'Capacity must be greater than zero';
    if (formData.odometer < 0) errors.odometer = 'Odometer reading cannot be negative';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      toast('Form contains validation errors', 'error');
      return;
    }

    try {
      if (currentVehicle) {
        // Edit flow
        await api.updateVehicle(currentVehicle.id, {
          registration: formData.registration.trim().toUpperCase(),
          type: formData.type,
          model: formData.model.trim(),
          capacity: Number(formData.capacity),
          odometer: Number(formData.odometer),
          fuelType: formData.fuelType,
          status: formData.status,
          lastServiceDate: formData.lastServiceDate,
          nextServiceDate: formData.nextServiceDate
        });
        toast(`Vehicle ${currentVehicle.id} updated successfully`, 'success');
      } else {
        // Create flow
        await api.createVehicle({
          registration: formData.registration.trim().toUpperCase(),
          type: formData.type,
          model: formData.model.trim(),
          capacity: Number(formData.capacity),
          odometer: Number(formData.odometer),
          fuelType: formData.fuelType,
          status: formData.status,
          lastServiceDate: formData.lastServiceDate,
          nextServiceDate: formData.nextServiceDate
        });
        toast('New vehicle added to fleet database', 'success');
      }
      setIsFormOpen(false);
      fetchVehicles();
    } catch (err: any) {
      toast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action Confirm
  const handleDeleteConfirm = async () => {
    if (!currentVehicle) return;
    setIsSubmitting(true);
    try {
      await api.deleteVehicle(currentVehicle.id);
      toast(`Vehicle ${currentVehicle.id} permanently removed`, 'success');
      setIsDeleteOpen(false);
      fetchVehicles();
    } catch (err: any) {
      toast(err.message || 'Deletion failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable columns definition (strictly generic accessors)
  const columns: Column<Vehicle>[] = [
    {
      header: 'Vehicle Model',
      accessor: 'model',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <Truck className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="block font-semibold text-slate-800">{v.model}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{v.type} • {v.fuelType}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Registration',
      accessor: 'registration',
      render: (v) => <span className="font-mono font-bold text-slate-700 select-all">{v.registration}</span>
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      render: (v) => <span className="font-semibold text-slate-600">{v.capacity} Metric Tons</span>
    },
    {
      header: 'Odometer',
      accessor: 'odometer',
      render: (v) => <span className="font-mono text-xs text-slate-600">{v.odometer.toLocaleString()} km</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (v) => <StatusBadge status={v.status} />
    },
    {
      header: 'Next Service',
      accessor: 'nextServiceDate',
      render: (v) => {
        const isOverdue = new Date(v.nextServiceDate) < new Date();
        return (
          <span className={`text-xs font-semibold ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
            {v.nextServiceDate} {isOverdue && '(Overdue)'}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (v) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(v)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="View Vehicle Info"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(v)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"
            title="Edit Vehicle Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(v)}
            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" text="Syncing fleet registry..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            Fleet Management Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Register and monitor active trucks, configure volumetric metric capacities, and coordinate diagnostics.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4.5 h-4.5 stroke-[2.5]" />}
          isMagnetic={true}
          className="self-start sm:self-center font-semibold"
        >
          Add Vehicle
        </Button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <Card noPadding className="border-l-4 border-l-slate-700 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Fleet Size</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{totalCount}</span>
              <span className="text-xs text-slate-400 font-medium">registered assets</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-emerald-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{availableCount}</span>
              <span className="text-xs text-slate-400 font-medium">ready for dispatch</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-blue-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Trips</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{onTripCount}</span>
              <span className="text-xs text-slate-400 font-medium">en-route right now</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-amber-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">In Maintenance</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{inMaintCount}</span>
              <span className="text-xs text-slate-400 font-medium">undergoing service</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card noPadding className="bg-white">
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search by registration number or truck model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-hidden text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="w-1/2 md:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                {VEHICLE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="w-1/2 md:w-44">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
              >
                <option value="">All Types</option>
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Datatable */}
      <DataTable
        columns={columns}
        rows={filteredVehicles}
        emptyTitle="No vehicles found matching filters"
        emptyDescription="Please adjust your searches or click the 'Add Vehicle' button above to register a new transport asset in TransitOps."
      />

      {/* View Details Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={`Vehicle Ledger: ${currentVehicle?.registration}`}
        size="md"
        footer={<Button variant="outline" size="sm" onClick={() => setIsViewOpen(false)}>Close Ledger</Button>}
      >
        {currentVehicle && (
          <div className="space-y-5 animate-fade-in font-sans">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="p-3.5 bg-brand-600 text-white rounded-xl shadow-md"><Truck className="w-6 h-6 stroke-[1.8]" /></div>
              <div>
                <h4 className="text-base font-bold text-slate-800">{currentVehicle.model}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{currentVehicle.type} • {currentVehicle.fuelType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Volumetric Capacity</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentVehicle.capacity} Metric Tons (Max Cargo Weight)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Odometer Reading</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentVehicle.odometer.toLocaleString()} Kilometers</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Last Maintenance Date</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentVehicle.lastServiceDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Next Scheduled Service</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentVehicle.nextServiceDate}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Status Class</span>
                <StatusBadge status={currentVehicle.status} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setIsViewOpen(false); openEditModal(currentVehicle); }}>
                  Edit Ledger
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentVehicle ? `Modify Vehicle Ledger: ${currentVehicle.id}` : 'Register New Fleet Asset'}
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" form="vehicle-form" loading={isSubmitting}>
              Save Ledger Entry
            </Button>
          </>
        }
      >
        <form id="vehicle-form" onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Registration Number"
              value={formData.registration}
              onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
              placeholder="e.g. GJ-01-XX-1234"
              required
              disabled={isSubmitting}
              error={formErrors.registration}
            />

            <Select
              label="Vehicle Model Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={VEHICLE_TYPES.map(t => ({ value: t, label: t }))}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Vehicle Model Name"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. Tata Prima 4930.S"
                required
                disabled={isSubmitting}
                error={formErrors.model}
              />
            </div>
            <Select
              label="Fuel Source Type"
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              options={FUEL_TYPES.map(f => ({ value: f, label: f }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Cargo Capacity (Tons)"
              type="number"
              step="0.1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              required
              disabled={isSubmitting}
              error={formErrors.capacity}
            />

            <Input
              label="Current Odometer Reading (km)"
              type="number"
              value={formData.odometer}
              onChange={(e) => setFormData({ ...formData, odometer: Number(e.target.value) })}
              required
              disabled={isSubmitting}
              error={formErrors.odometer}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Last Diagnostics / Service Date"
              type="date"
              value={formData.lastServiceDate}
              onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Next Scheduled Service Date"
              type="date"
              value={formData.nextServiceDate}
              onChange={(e) => setFormData({ ...formData, nextServiceDate: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <Select
            label="Initial Operation Status Class"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
            options={VEHICLE_STATUSES.map(s => ({ value: s, label: s }))}
            required
          />

        </form>
      </Modal>

      {/* Delete Dialog Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Permanently remove vehicle?"
        description={`This will permanently remove the vehicle record ${currentVehicle?.registration} from TransitOps registers. Any scheduled trips connected to this vehicle will enter an invalid state. Please make sure there are no active dependencies.`}
      />

    </div>
  );
};

export default Vehicles;
