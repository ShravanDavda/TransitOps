import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Driver, DRIVER_STATUSES, LICENSE_TYPES } from '../../utils/constants';
import { useToast } from '../../components/common/Toast';
import { 
  Plus, Search, Eye, Edit2, Trash2, Users, AlertTriangle, CheckCircle, Mail, Phone, ShieldCheck
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

const Drivers: React.FC = () => {
  const { toast } = useToast();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseType: 'HMV' as Driver['licenseType'],
    licenseExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: 'Available' as Driver['status'],
    assignedVehicle: null as string | null
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch from storage
  const fetchDrivers = async () => {
    try {
      const d = await api.getDrivers();
      setDrivers(d);
    } catch (err) {
      toast('Failed to load driver roster', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter calculations
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Dynamic status check for License expiry (Section 6 & 14)
  const getLicenseStatus = (expiryDateStr: string) => {
    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    if (expiryDate < today) {
      return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-200 font-bold', level: 'expired' };
    }
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 30) {
      return { label: `${diffDays} days left`, color: 'text-amber-600 bg-amber-50 border-amber-200 font-bold', level: 'soon' };
    }
    return { label: 'Valid', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 font-semibold', level: 'valid' };
  };

  // Summaries
  const totalCount = drivers.length;
  const availableCount = drivers.filter((d) => d.status === 'Available' && getLicenseStatus(d.licenseExpiry).level !== 'expired').length;
  const onTripCount = drivers.filter((d) => d.status === 'On Trip').length;
  
  // Licenses expiring soon or already expired
  const expiringLicensesCount = drivers.filter((d) => {
    const lvl = getLicenseStatus(d.licenseExpiry).level;
    return lvl === 'expired' || lvl === 'soon';
  }).length;

  // Form open methods
  const openAddModal = () => {
    setCurrentDriver(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      licenseNumber: '',
      licenseType: 'HMV',
      licenseExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'Available',
      assignedVehicle: null
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setCurrentDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      licenseType: driver.licenseType,
      licenseExpiry: driver.licenseExpiry,
      status: driver.status,
      assignedVehicle: driver.assignedVehicle
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openViewModal = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsViewOpen(true);
  };

  const openDeleteModal = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsDeleteOpen(true);
  };

  // Submit Driver Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      toast('Please fill all required fields correctly', 'error');
      return;
    }

    try {
      if (currentDriver) {
        await api.updateDriver(currentDriver.id, {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          licenseNumber: formData.licenseNumber.trim().toUpperCase(),
          licenseType: formData.licenseType,
          licenseExpiry: formData.licenseExpiry,
          status: formData.status,
          assignedVehicle: formData.assignedVehicle
        });
        toast(`Driver ${currentDriver.name} details updated`, 'success');
      } else {
        await api.createDriver({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          licenseNumber: formData.licenseNumber.trim().toUpperCase(),
          licenseType: formData.licenseType,
          licenseExpiry: formData.licenseExpiry,
          status: formData.status,
          assignedVehicle: formData.assignedVehicle
        });
        toast('New driver registered successfully', 'success');
      }
      setIsFormOpen(false);
      fetchDrivers();
    } catch (err: any) {
      toast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!currentDriver) return;
    setIsSubmitting(true);
    try {
      await api.deleteDriver(currentDriver.id);
      toast(`Driver ${currentDriver.name} removed from system`, 'success');
      setIsDeleteOpen(false);
      fetchDrivers();
    } catch (err: any) {
      toast(err.message || 'Deletion failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable columns definition (strictly generic accessors, Section 21)
  const columns: Column<Driver>[] = [
    {
      header: 'Driver Name',
      accessor: 'name',
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
            {d.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <span className="block font-semibold text-slate-800">{d.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: {d.id}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Details',
      render: (d) => (
        <div className="text-xs space-y-0.5 text-slate-600">
          <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> <span>{d.phone}</span></div>
          {d.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> <span>{d.email}</span></div>}
        </div>
      )
    },
    {
      header: 'License Details',
      render: (d) => (
        <div>
          <span className="block font-mono text-xs font-bold text-slate-700 select-all">{d.licenseNumber}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Type: {d.licenseType}</span>
        </div>
      )
    },
    {
      header: 'License Expiry',
      accessor: 'licenseExpiry',
      render: (d) => {
        const lic = getLicenseStatus(d.licenseExpiry);
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-600">{d.licenseExpiry}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full border ${lic.color}`}>
              {lic.label}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Operation Status',
      accessor: 'status',
      render: (d) => <StatusBadge status={d.status} />
    },
    {
      header: 'Completed Runs',
      accessor: 'completedTrips',
      render: (d) => <span className="font-bold text-slate-700 font-mono text-xs">{d.completedTrips} trips</span>
    },
    {
      header: 'Actions',
      render: (d) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(d)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="View Driver Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(d)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"
            title="Edit Driver profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(d)}
            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Driver"
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
        <Loader size="lg" text="Syncing operator registries..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            Driver Operations Control
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Manage heavy transport driver rosters, audit commercial vehicle licenses, and verify dispatch eligibility.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4.5 h-4.5 stroke-[2.5]" />}
          isMagnetic={true}
          className="self-start sm:self-center font-semibold"
        >
          Add Driver
        </Button>
      </div>

      {/* Summary Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none animate-fade-in">
        <Card noPadding className="border-l-4 border-l-slate-700 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Roster</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{totalCount}</span>
              <span className="text-xs text-slate-400 font-medium">registered operators</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-emerald-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{availableCount}</span>
              <span className="text-xs text-slate-400 font-medium">unassigned & eligible</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-blue-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">On Trip</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{onTripCount}</span>
              <span className="text-xs text-slate-400 font-medium">actively dispatched</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-amber-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">License Action required</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-amber-600 font-display">{expiringLicensesCount}</span>
              <span className="text-xs text-slate-400 font-medium">expired / warning</span>
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
                placeholder="Search driver by name or license registration..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-hidden text-sm text-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="w-full md:w-56">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              {DRIVER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Datatable */}
      <DataTable
        columns={columns}
        rows={filteredDrivers}
        emptyTitle="No operators found matching filters"
        emptyDescription="Please adjust your searches or click the 'Add Driver' button above to register a new operator in the TransitOps database."
      />

      {/* View Driver Profile Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={`Operator Profile Card: ${currentDriver?.name}`}
        size="md"
        footer={<Button variant="outline" size="sm" onClick={() => setIsViewOpen(false)}>Close Card</Button>}
      >
        {currentDriver && (
          <div className="space-y-5 animate-fade-in font-sans">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                {currentDriver.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">{currentDriver.name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Roster Ref: {currentDriver.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Primary Mobile</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentDriver.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Corporate Email</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentDriver.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">License Number</span>
                <span className="font-semibold font-mono text-slate-700 block mt-1 text-sm select-all">{currentDriver.licenseNumber} ({currentDriver.licenseType})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">License Validity Expiry</span>
                <span className="font-semibold text-slate-700 block mt-1 text-sm">{currentDriver.licenseExpiry}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Roster Dispatch Class</span>
                <StatusBadge status={currentDriver.status} />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Operations Mileage</span>
                <span className="font-bold text-slate-700 font-mono text-sm block mt-0.5">{currentDriver.completedTrips} dispatched trips</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentDriver ? `Modify Operator Card: ${currentDriver.id}` : 'Register New Operator Card'}
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" form="driver-form" loading={isSubmitting}>
              Save Profile Entry
            </Button>
          </>
        }
      >
        <form id="driver-form" onSubmit={handleFormSubmit} className="space-y-4">
          
          <Input
            label="Driver Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Sunil Kumar"
            required
            disabled={isSubmitting}
            error={formErrors.name}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              required
              disabled={isSubmitting}
              error={formErrors.phone}
            />

            <Input
              label="Operator Corporate Email (Optional)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. sunil@transitops.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Commercial License Registry Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="e.g. DL-1420180012345"
                required
                disabled={isSubmitting}
                error={formErrors.licenseNumber}
              />
            </div>
            <Select
              label="License Class"
              value={formData.licenseType}
              onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as Driver['licenseType'] })}
              options={LICENSE_TYPES.map(t => ({ value: t, label: t }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="License Validity Expiry Date"
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              required
              disabled={isSubmitting}
            />

            <Select
              label="Initial Roster Status Class"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver['status'] })}
              options={DRIVER_STATUSES.map(s => ({ value: s, label: s }))}
              required
            />
          </div>

        </form>
      </Modal>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Permanently remove driver?"
        description={`This will permanently remove the operator record ${currentDriver?.name} from TransitOps registers. Any scheduled trips connected to this driver will enter an invalid state. Please make sure there are no active dependencies.`}
      />

    </div>
  );
};

export default Drivers;
