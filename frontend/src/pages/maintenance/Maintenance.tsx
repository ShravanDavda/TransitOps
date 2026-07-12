import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Maintenance, Vehicle, MAINTENANCE_STATUSES, MAINTENANCE_TYPES } from '../../utils/constants';
import { useToast } from '../../components/common/Toast';
import { 
  Plus, Search, Eye, Wrench, Calendar, IndianRupee, AlertTriangle, Play, Check, Trash2, Clock 
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

const MaintenancePage: React.FC = () => {
  const { toast } = useToast();

  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentMaint, setCurrentMaint] = useState<Maintenance | null>(null);

  // Form
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'Routine Service' as Maintenance['type'],
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    serviceProvider: 'Tata Authorized Workshop',
    cost: 5000,
    status: 'Scheduled' as Maintenance['status']
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data
  const loadData = async () => {
    try {
      const [m, v] = await Promise.all([
        api.getMaintenance(),
        api.getVehicles()
      ]);
      setMaintenance(m);
      setVehicles(v);
    } catch (err) {
      toast('Failed to load workshop databanks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync vehicleId default
  useEffect(() => {
    if (isFormOpen && vehicles.length > 0) {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicles[0]?.id || ''
      }));
    }
  }, [isFormOpen, vehicles]);

  // Filters
  const filteredMaint = maintenance.filter(m => {
    const matchesStatus = statusFilter ? m.status === statusFilter : true;
    const matchesType = typeFilter ? m.type === typeFilter : true;
    const matchesVehicle = vehicleFilter ? m.vehicleId === vehicleFilter : true;
    return matchesStatus && matchesType && matchesVehicle;
  });

  // Tallies
  const scheduledCount = maintenance.filter(m => m.status === 'Scheduled').length;
  const inProgressCount = maintenance.filter(m => m.status === 'In Progress').length;
  const completedCount = maintenance.filter(m => m.status === 'Completed').length;
  const overdueCount = maintenance.filter(m => m.status === 'Overdue').length;

  const openAddModal = () => {
    setCurrentMaint(null);
    setFormData({
      vehicleId: vehicles[0]?.id || '',
      type: 'Routine Service',
      description: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      serviceProvider: 'Tata Authorized Workshop',
      cost: 5000,
      status: 'Scheduled'
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openViewModal = (m: Maintenance) => {
    setCurrentMaint(m);
    setIsViewOpen(true);
  };

  const openDeleteModal = (m: Maintenance) => {
    setCurrentMaint(m);
    setIsDeleteOpen(true);
  };

  // Trigger status updates
  const handleTransitionStatus = async (id: string, nextStatus: Maintenance['status']) => {
    try {
      await api.updateMaintenanceStatus(id, nextStatus);
      toast(`Job ${id} advanced to: ${nextStatus}`, 'success');
      loadData();
      setIsViewOpen(false);
    } catch (err: any) {
      toast(err.message || 'Update failed', 'error');
    }
  };

  // Submit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!formData.vehicleId) errors.vehicleId = 'Vehicle assignment is required';
    if (!formData.description.trim()) errors.description = 'Task description is required';
    if (!formData.serviceProvider.trim()) errors.serviceProvider = 'Service provider is required';
    if (formData.cost < 0) errors.cost = 'Estimated cost must be positive';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      toast('Form contains validation errors', 'error');
      return;
    }

    try {
      await api.createMaintenance({
        vehicleId: formData.vehicleId,
        type: formData.type,
        description: formData.description.trim(),
        scheduledDate: formData.scheduledDate,
        completionDate: null,
        serviceProvider: formData.serviceProvider.trim(),
        cost: Number(formData.cost),
        status: formData.status
      });

      toast('New maintenance task registered and logged', 'success');
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      const msg = err.message || 'Operation failed';
      setFormErrors({ form: msg });
      toast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!currentMaint) return;
    setIsSubmitting(true);
    try {
      await api.deleteMaintenance(currentMaint.id);
      toast(`Workshop record ${currentMaint.id} removed`, 'success');
      setIsDeleteOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Deletion failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Datatable Columns (Strictly generic accessors, Section 21)
  const columns: Column<Maintenance>[] = [
    {
      header: 'ID',
      accessor: 'id',
      render: (m) => <span className="font-mono font-bold text-slate-800">{m.id}</span>
    },
    {
      header: 'Vehicle Assigned',
      render: (m) => {
        const v = vehicles.find(item => item.id === m.vehicleId);
        return (
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">{v?.registration}</span>
            <span className="text-[10px] text-slate-400 font-mono">({v?.model.split(' ')[0]})</span>
          </div>
        );
      }
    },
    {
      header: 'Service Type',
      accessor: 'type',
      render: (m) => <span className="font-semibold text-slate-800 text-xs">{m.type}</span>
    },
    {
      header: 'Scheduled Date',
      accessor: 'scheduledDate',
      render: (m) => {
        const isOverdue = m.status === 'Overdue';
        return (
          <div className="flex items-center gap-1.5 font-medium text-xs">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
              {m.scheduledDate} {isOverdue && '(Overdue)'}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Provider',
      accessor: 'serviceProvider',
      render: (m) => <span className="text-xs text-slate-600 font-medium">{m.serviceProvider}</span>
    },
    {
      header: 'Cost (INR)',
      accessor: 'cost',
      render: (m) => <span className="font-mono font-semibold text-slate-700 text-xs">₹{m.cost.toLocaleString('en-IN')}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (m) => <StatusBadge status={m.status} />
    },
    {
      header: 'Actions',
      render: (m) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openViewModal(m)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {m.status === 'Scheduled' && (
            <button
              onClick={() => handleTransitionStatus(m.id, 'In Progress')}
              className="p-1.5 rounded-md hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
              title="Start Work"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {m.status === 'In Progress' && (
            <button
              onClick={() => handleTransitionStatus(m.id, 'Completed')}
              className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
              title="Mark Completed"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => openDeleteModal(m)}
            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Record"
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
        <Loader size="lg" text="Syncing workshop databases..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            Diagnostics & Workshop Operations
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Configure vehicle preventative services, schedule critical mechanical repairs, and log service cost accounts.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4.5 h-4.5 stroke-[2.5]" />}
          isMagnetic={true}
          className="self-start sm:self-center font-semibold"
        >
          Schedule Maintenance
        </Button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none animate-fade-in">
        <Card noPadding className="border-l-4 border-l-slate-700 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scheduled Services</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{scheduledCount}</span>
              <span className="text-xs text-slate-400 font-medium">pending queues</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-amber-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Repairs</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{inProgressCount}</span>
              <span className="text-xs text-slate-400 font-medium">jobs in workshop</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-emerald-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Jobs</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-slate-800 font-display">{completedCount}</span>
              <span className="text-xs text-slate-400 font-medium">released vehicles</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-rose-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display flex items-center gap-1.5">
              Overdue Risks
              {overdueCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            </span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-rose-600 font-display">{overdueCount}</span>
              <span className="text-xs text-slate-400 font-medium">critical warnings</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Filters Grid */}
      <Card noPadding className="bg-white">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              {MAINTENANCE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">Filter by Service Type</option>
              {MAINTENANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">Filter by Vehicle Registration</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration} ({v.model.split(' ')[0]})</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Datatable */}
      <DataTable
        columns={columns}
        rows={filteredMaint}
        emptyTitle="No workshop tasks match filter criteria"
        emptyDescription="Please adjust your searches or click 'Schedule Maintenance' above to register a new vehicle diagnostic job."
      />

      {/* View Task Card Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={`Workshop Ledger: Task #${currentMaint?.id}`}
        size="md"
        footer={<Button variant="outline" size="sm" onClick={() => setIsViewOpen(false)}>Close Ledger</Button>}
      >
        {currentMaint && (
          <div className="space-y-5 animate-fade-in font-sans">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-600 text-white rounded-xl shadow-md"><Wrench className="w-5 h-5 stroke-[2]" /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{currentMaint.type}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Assigned Asset: {vehicles.find(v=>v.id===currentMaint.vehicleId)?.registration}</p>
                </div>
              </div>
              <StatusBadge status={currentMaint.status} />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Mechanic Diagnostic Report</span>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-150 font-medium text-slate-700">
                {currentMaint.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Service Provider</span>
                <span className="text-slate-800 block mt-1 font-semibold">{currentMaint.serviceProvider}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Audit Invoice Amount</span>
                <span className="text-slate-800 block mt-1 font-bold text-sm">₹{currentMaint.cost.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Scheduled Date</span>
                <span className="text-slate-800 block mt-1 font-semibold">{currentMaint.scheduledDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Completion Sign-off</span>
                <span className="text-slate-800 block mt-1 font-semibold">{currentMaint.completionDate || 'N/A (Pending)'}</span>
              </div>
            </div>

            {/* Actions in details */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono font-medium">ID Reference: {currentMaint.id}</span>
              <div className="flex gap-2">
                {currentMaint.status === 'Scheduled' && (
                  <Button variant="primary" size="sm" onClick={() => handleTransitionStatus(currentMaint.id, 'In Progress')}>
                    Start Work
                  </Button>
                )}
                {currentMaint.status === 'In Progress' && (
                  <Button variant="primary" size="sm" onClick={() => handleTransitionStatus(currentMaint.id, 'Completed')} className="bg-emerald-600 hover:bg-emerald-700 border-emerald-700">
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Task Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Schedule preventative vehicle service"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
              Cancel Job
            </Button>
            <Button variant="primary" size="sm" type="submit" form="maint-form" loading={isSubmitting}>
              Confirm Job Schedule
            </Button>
          </>
        }
      >
        <form id="maint-form" onSubmit={handleFormSubmit} className="space-y-4">
          
          {formErrors.form && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-semibold animate-fade-in flex items-start gap-2.5 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{formErrors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Assign Vehicle"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              options={vehicles.map(v => ({ 
                value: v.id, 
                label: `${v.registration} [${v.status}]` 
              }))}
              required
              error={formErrors.vehicleId}
            />

            <Select
              label="Preventative Service Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Maintenance['type'] })}
              options={MAINTENANCE_TYPES.map(t => ({ value: t, label: t }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Service Provider / Garage"
              value={formData.serviceProvider}
              onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
              placeholder="e.g. Tata Authorized Workshop"
              required
              disabled={isSubmitting}
              error={formErrors.serviceProvider}
            />

            <Input
              label="Scheduled Service Date"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Cost (INR)"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
              required
              disabled={isSubmitting}
              error={formErrors.cost}
            />

            <Select
              label="Initial Job Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Maintenance['status'] })}
              options={MAINTENANCE_STATUSES.map(s => ({ value: s, label: s }))}
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 tracking-wide">
              Task Work Description & Action Items
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Specify replacement parts, diagnostics symptoms, and mechanics assignments details..."
              className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 border border-slate-300 rounded-lg outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all placeholder:text-slate-400"
              required
              disabled={isSubmitting}
            />
            {formErrors.description && (
              <span className="text-xs text-red-600 font-medium tracking-wide">{formErrors.description}</span>
            )}
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Permanently remove service record?"
        description={`This will permanently remove the workshop task record #${currentMaint?.id} from TransitOps registers. Any cost entries linked to this maintenance ledger item will remain detached.`}
      />

    </div>
  );
};

export default MaintenancePage;
