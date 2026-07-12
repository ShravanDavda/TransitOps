import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Trip, Vehicle, Driver, CARGO_DESCRIPTIONS, TRIP_STATUSES } from '../../utils/constants';
import { useToast } from '../../components/common/Toast';
import { 
  Plus, Search, Eye, ArrowRight, Route, Calendar, ShieldAlert, Award, Clock, Ban, CheckCircle2 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DataTable, { Column } from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

const Trips: React.FC = () => {
  const { toast } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  // Create Form State
  const [formData, setFormData] = useState({
    origin: 'Ahmedabad',
    destination: 'Mumbai',
    vehicleId: '',
    driverId: '',
    cargoDescription: 'Electronic Goods',
    cargoWeight: 10,
    departureTime: new Date().toISOString().slice(0, 16),
    expectedArrival: new Date(Date.now() + 12 * 3600 * 1000).toISOString().slice(0, 16),
    distance: 525,
    status: 'Scheduled' as Trip['status']
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load datasets
  const loadAllData = async () => {
    try {
      const [t, v, d] = await Promise.all([
        api.getTrips(),
        api.getVehicles(),
        api.getDrivers()
      ]);
      setTrips(t);
      setVehicles(v);
      setDrivers(d);
    } catch (err) {
      toast('Failed to load dispatch databases', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sync default options when form opens
  useEffect(() => {
    if (isFormOpen && vehicles.length > 0 && drivers.length > 0) {
      const firstAvailV = vehicles.find(v => v.status === 'Available') || vehicles[0];
      const firstAvailD = drivers.find(d => d.status === 'Available' && new Date(d.licenseExpiry) > new Date()) || drivers[0];
      setFormData(prev => ({
        ...prev,
        vehicleId: firstAvailV?.id || '',
        driverId: firstAvailD?.id || ''
      }));
    }
  }, [isFormOpen, vehicles, drivers]);

  // Filters computations
  const filteredTrips = trips.filter(t => {
    const matchesSearch = 
      t.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    const matchesVehicle = vehicleFilter ? t.vehicleId === vehicleFilter : true;
    const matchesDriver = driverFilter ? t.driverId === driverFilter : true;
    return matchesSearch && matchesStatus && matchesVehicle && matchesDriver;
  });

  // Summary tallies
  const activeCount = trips.filter(t => t.status === 'In Transit' || t.status === 'Dispatched').length;
  const scheduledCount = trips.filter(t => t.status === 'Scheduled').length;
  const completedCount = trips.filter(t => t.status === 'Completed').length;
  const cancelledCount = trips.filter(t => t.status === 'Cancelled').length;

  // Open Form
  const openCreateModal = () => {
    setFormData({
      origin: 'Ahmedabad',
      destination: 'Mumbai',
      vehicleId: '',
      driverId: '',
      cargoDescription: 'Electronic Goods',
      cargoWeight: 10,
      departureTime: new Date().toISOString().slice(0, 16),
      expectedArrival: new Date(Date.now() + 12 * 3600 * 1000).toISOString().slice(0, 16),
      distance: 525,
      status: 'Scheduled'
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openViewModal = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsViewOpen(true);
  };

  // Status transitions
  const handleTransitionStatus = async (tripId: string, nextStatus: Trip['status']) => {
    try {
      await api.updateTripStatus(tripId, nextStatus);
      toast(`Trip ${tripId} status advanced to ${nextStatus}`, 'success');
      loadAllData();
      if (currentTrip && currentTrip.id === tripId) {
        setIsViewOpen(false); // Close details card to sync
      }
    } catch (err: any) {
      toast(err.message || 'Transition failed', 'error');
    }
  };

  // Submit Dispatch form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (selectedVehicle && formData.cargoWeight > selectedVehicle.capacity) {
      setFormErrors({
        cargoWeight: `Cargo weight exceeds truck payload threshold (${selectedVehicle.capacity}T Max).`
      });
      toast('Overload limit exceeded!', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.createTrip({
        origin: formData.origin,
        destination: formData.destination,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        cargoDescription: formData.cargoDescription,
        cargoWeight: Number(formData.cargoWeight),
        departureTime: new Date(formData.departureTime).toISOString(),
        expectedArrival: new Date(formData.expectedArrival).toISOString(),
        distance: Number(formData.distance),
        status: formData.status
      });

      toast('New dispatch authorized and scheduled', 'success');
      setIsFormOpen(false);
      loadAllData();
    } catch (err: any) {
      const msg = err.message || 'Operation failed';
      setFormErrors({ form: msg });
      toast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable columns definition (strictly generic accessors, Section 21)
  const columns: Column<Trip>[] = [
    {
      header: 'Trip ID',
      accessor: 'id',
      render: (t) => <span className="font-mono font-bold text-slate-800">{t.id}</span>
    },
    {
      header: 'Route Path',
      render: (t) => (
        <div className="flex items-center gap-2 font-display text-slate-800 font-semibold">
          <span>{t.origin}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
          <span>{t.destination}</span>
        </div>
      )
    },
    {
      header: 'Payload Details',
      render: (t) => (
        <div>
          <span className="block font-semibold text-slate-700 text-xs">{t.cargoDescription}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t.cargoWeight} Tons • {t.distance} km</span>
        </div>
      )
    },
    {
      header: 'Assigned Assets',
      render: (t) => {
        const v = vehicles.find(item => item.id === t.vehicleId);
        const d = drivers.find(item => item.id === t.driverId);
        return (
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1.5"><span className="text-slate-400 uppercase font-bold text-[8px]">Truck:</span> <span className="font-semibold text-slate-700">{v?.registration}</span></div>
            <div className="flex items-center gap-1.5"><span className="text-slate-400 uppercase font-bold text-[8px]">Driver:</span> <span className="font-semibold text-slate-700">{d?.name}</span></div>
          </div>
        );
      }
    },
    {
      header: 'Departure',
      render: (t) => (
        <div className="text-xs text-slate-500 font-medium">
          <div>{new Date(t.departureTime).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
          <div>{new Date(t.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (t) => <StatusBadge status={t.status} />
    },
    {
      header: 'Actions',
      render: (t) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(t)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="View Dispatch Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {/* Quick status progress actions */}
          {t.status === 'Scheduled' && (
            <button
              onClick={() => handleTransitionStatus(t.id, 'In Transit')}
              className="p-1 px-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md hover:bg-indigo-100 cursor-pointer"
              title="Dispatch Out"
            >
              Dispatch
            </button>
          )}
          {t.status === 'In Transit' && (
            <button
              onClick={() => handleTransitionStatus(t.id, 'Completed')}
              className="p-1 px-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100 cursor-pointer"
              title="Complete Run"
            >
              Complete
            </button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" text="Syncing dispatch control tables..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            Cargo Dispatches & Trips Controller
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Dispatch commercial cargo, oversee route itineraries, and process active trip transitions.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openCreateModal}
          icon={<Plus className="w-4.5 h-4.5 stroke-[2.5]" />}
          isMagnetic={true}
          className="self-start sm:self-center font-semibold"
        >
          Create Trip Dispatch
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        <Card noPadding className="border-l-4 border-l-blue-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active En-Route</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{activeCount}</span>
              <span className="text-xs text-slate-400 font-medium">trips in-transit</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-indigo-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scheduled Queue</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{scheduledCount}</span>
              <span className="text-xs text-slate-400 font-medium">ready for departure</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-emerald-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Runs</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{completedCount}</span>
              <span className="text-xs text-slate-400 font-medium">delivered successfully</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-rose-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cancelled</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{cancelledCount}</span>
              <span className="text-xs text-slate-400 font-medium">dispatches suspended</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Filters Desk */}
      <Card noPadding className="bg-white">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search trip ID or city..."
                value={searchQuery}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg outline-hidden text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              {TRIP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">Filter by Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration} ({v.model.split(' ')[0]})</option>)}
            </select>
          </div>

          <div>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">Filter by Driver</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <DataTable
        columns={columns}
        rows={filteredTrips}
        emptyTitle="No trips logged matching filters"
        emptyDescription="Please adjust your searches or click 'Create Trip Dispatch' to coordinate a new commercial cargo run."
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={`Command Dispatch Ledger: ${currentTrip?.id}`}
        size="md"
        footer={<Button variant="outline" size="sm" onClick={() => setIsViewOpen(false)}>Close Ledger</Button>}
      >
        {currentTrip && (
          <div className="space-y-5 animate-fade-in font-sans">
            
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-600 text-white rounded-xl shadow-md"><Route className="w-5 h-5 stroke-[2]" /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{currentTrip.origin}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                    <span>{currentTrip.destination}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Itinerary: {currentTrip.distance} km</p>
                </div>
              </div>
              <StatusBadge status={currentTrip.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Cargo Type & Load</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentTrip.cargoDescription} ({currentTrip.cargoWeight} Tons)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Authorized Transport</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">
                  Registration: {vehicles.find(v => v.id === currentTrip.vehicleId)?.registration}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Departure Timestamp</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{new Date(currentTrip.departureTime).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">ETA Expected Arrival</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{new Date(currentTrip.expectedArrival).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Assigned Dispatch Driver</span>
                <span className="font-semibold text-slate-700 block text-sm">
                  {drivers.find(d => d.id === currentTrip.driverId)?.name} ({drivers.find(d => d.id === currentTrip.driverId)?.licenseType})
                </span>
              </div>

              {/* Transition actions */}
              <div className="flex gap-2">
                {currentTrip.status === 'Scheduled' && (
                  <Button variant="primary" size="sm" onClick={() => handleTransitionStatus(currentTrip.id, 'In Transit')}>
                    Dispatch Out
                  </Button>
                )}
                {currentTrip.status === 'In Transit' && (
                  <Button variant="primary" size="sm" onClick={() => handleTransitionStatus(currentTrip.id, 'Completed')} className="bg-emerald-600 hover:bg-emerald-700 border-emerald-700">
                    Mark Completed
                  </Button>
                )}
                {['Draft', 'Scheduled', 'In Transit', 'Dispatched'].includes(currentTrip.status) && (
                  <Button variant="danger" size="sm" onClick={() => handleTransitionStatus(currentTrip.id, 'Cancelled')}>
                    Cancel Trip
                  </Button>
                )}
              </div>
            </div>

          </div>
        )}
      </Modal>

      {/* Create Trip Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Coordinate Command Dispatch: Scheduled Cargo Run"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
              Cancel Dispatch
            </Button>
            <Button variant="primary" size="sm" type="submit" form="dispatch-form" loading={isSubmitting}>
              Authorize Dispatch
            </Button>
          </>
        }
      >
        <form id="dispatch-form" onSubmit={handleFormSubmit} className="space-y-4">
          
          {formErrors.form && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-semibold animate-fade-in flex items-start gap-2.5 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{formErrors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Origin City Node"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              options={['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Mumbai', 'Gandhinagar'].map(c => ({ value: c, label: c }))}
              required
            />
            <Select
              label="Destination City Node"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              options={['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Mumbai', 'Gandhinagar'].map(c => ({ value: c, label: c }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Select Available Vehicle Class"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              options={vehicles.map(v => ({ 
                value: v.id, 
                label: `${v.registration} (${v.type} - Max ${v.capacity}T) [${v.status}]` 
              }))}
              required
            />

            <Select
              label="Select Eligible Driver Class"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              options={drivers.map(d => ({ 
                value: d.id, 
                label: `${d.name} (${d.licenseType}) [${d.status}]` 
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Select
                label="Cargo Content Classification"
                value={formData.cargoDescription}
                onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                options={CARGO_DESCRIPTIONS.map(desc => ({ value: desc, label: desc }))}
                required
              />
            </div>
            <Input
              label="Cargo Net Load (Tons)"
              type="number"
              step="0.1"
              value={formData.cargoWeight}
              onChange={(e) => setFormData({ ...formData, cargoWeight: Number(e.target.value) })}
              required
              error={formErrors.cargoWeight}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Departure Scheduled Time"
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                required
              />
            </div>
            <Input
              label="Est Distance (km)"
              type="number"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
              required
            />
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default Trips;
