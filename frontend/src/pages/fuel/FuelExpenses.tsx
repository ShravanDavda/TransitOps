import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Expense, Vehicle, Driver, Trip, EXPENSE_CATEGORIES } from '../../utils/constants';
import { useToast } from '../../components/common/Toast';
import { 
  Plus, Search, IndianRupee, Trash2, Fuel, Wrench, Navigation, CheckSquare, CreditCard, Calendar, Filter 
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

const FuelExpenses: React.FC = () => {
  const { toast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    tripId: '',
    category: 'Fuel' as Expense['category'],
    fuelQuantity: '', // litters
    fuelPrice: '', // per liter
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Data
  const loadData = async () => {
    try {
      const [e, v, d, t] = await Promise.all([
        api.getExpenses(),
        api.getVehicles(),
        api.getDrivers(),
        api.getTrips()
      ]);
      setExpenses(e);
      setVehicles(v);
      setDrivers(d);
      setTrips(t);
    } catch (err) {
      toast('Failed to load financial ledgers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Autofill defaults when form opens
  useEffect(() => {
    if (isFormOpen && vehicles.length > 0 && drivers.length > 0) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: vehicles[0]?.id || '',
        driverId: drivers[0]?.id || '',
        tripId: trips[0]?.id || ''
      }));
    }
  }, [isFormOpen, vehicles, drivers, trips]);

  // AUTO-CALCULATION FOR FUEL (Section 17 & 9)
  // When quantity or price per liter changes, calculate the total amount automatically!
  useEffect(() => {
    if (formData.category === 'Fuel') {
      const qty = Number(formData.fuelQuantity);
      const prc = Number(formData.fuelPrice);
      if (qty > 0 && prc > 0) {
        setFormData((prev) => ({
          ...prev,
          amount: String(Math.round(qty * prc * 100) / 100)
        }));
      }
    }
  }, [formData.fuelQuantity, formData.fuelPrice, formData.category]);

  // Filters calculations
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = categoryFilter ? exp.category === categoryFilter : true;
    const matchesVehicle = vehicleFilter ? exp.vehicleId === vehicleFilter : true;
    
    // Date range filter
    const expDate = new Date(exp.date);
    const matchesStart = startDate ? expDate >= new Date(startDate) : true;
    const matchesEnd = endDate ? expDate <= new Date(endDate) : true;

    return matchesCategory && matchesVehicle && matchesStart && matchesEnd;
  });

  // Tallies
  const totalExpenseSum = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const fuelExpenseSum = expenses.filter(e => e.category === 'Fuel').reduce((sum, e) => sum + e.amount, 0);
  const repairExpenseSum = expenses.filter(e => e.category === 'Repair').reduce((sum, e) => sum + e.amount, 0);
  const otherExpenseSum = expenses.filter(e => e.category !== 'Fuel' && e.category !== 'Repair').reduce((sum, e) => sum + e.amount, 0);

  const openAddModal = () => {
    setCurrentExpense(null);
    setFormData({
      vehicleId: vehicles[0]?.id || '',
      driverId: drivers[0]?.id || '',
      tripId: '',
      category: 'Fuel',
      fuelQuantity: '',
      fuelPrice: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openDeleteModal = (exp: Expense) => {
    setCurrentExpense(exp);
    setIsDeleteOpen(true);
  };

  // Submit Expense Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!formData.vehicleId) errors.vehicleId = 'Vehicle mapping is required';
    if (!formData.driverId) errors.driverId = 'Driver mapping is required';
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = 'Amount must be greater than zero';
    if (formData.category === 'Fuel') {
      if (!formData.fuelQuantity || Number(formData.fuelQuantity) <= 0) errors.fuelQuantity = 'Fuel Quantity is required';
      if (!formData.fuelPrice || Number(formData.fuelPrice) <= 0) errors.fuelPrice = 'Price per liter is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      toast('Form contains validation errors', 'error');
      return;
    }

    try {
      await api.createExpense({
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        tripId: formData.tripId || null,
        category: formData.category,
        fuelQuantity: formData.category === 'Fuel' ? Number(formData.fuelQuantity) : null,
        fuelPrice: formData.category === 'Fuel' ? Number(formData.fuelPrice) : null,
        amount: Number(formData.amount),
        date: formData.date,
        notes: formData.notes.trim()
      });

      toast('Operational expense logged in general ledger', 'success');
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

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!currentExpense) return;
    setIsSubmitting(true);
    try {
      await api.deleteExpense(currentExpense.id);
      toast(`Expense entry ${currentExpense.id} deleted`, 'success');
      setIsDeleteOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Deletion failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: Expense['category']) => {
    switch (category) {
      case 'Fuel': return <Fuel className="w-4 h-4 text-blue-600" />;
      case 'Repair': return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'Toll': return <Navigation className="w-4 h-4 text-emerald-600" />;
      case 'Parking': return <CheckSquare className="w-4 h-4 text-purple-600" />;
      default: return <CreditCard className="w-4 h-4 text-slate-600" />;
    }
  };

  // Columns definition (generic accessors, Section 21)
  const columns: Column<Expense>[] = [
    {
      header: 'Expense ID',
      accessor: 'id',
      render: (e) => <span className="font-mono font-bold text-slate-800">{e.id}</span>
    },
    {
      header: 'Logging Date',
      accessor: 'date',
      render: (e) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{e.date}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (e) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg">
            {getCategoryIcon(e.category)}
          </div>
          <span className="font-semibold text-slate-800 text-xs">{e.category}</span>
        </div>
      )
    },
    {
      header: 'Vehicle Assigned',
      render: (e) => {
        const v = vehicles.find(item => item.id === e.vehicleId);
        return (
          <div className="text-xs">
            <span className="font-semibold text-slate-700 block">{v?.registration}</span>
            <span className="text-[10px] text-slate-400 font-mono">({v?.model.split(' ')[0]})</span>
          </div>
        );
      }
    },
    {
      header: 'Operator & Trip',
      render: (e) => {
        const d = drivers.find(item => item.id === e.driverId);
        return (
          <div className="text-xs">
            <span className="font-semibold text-slate-700 block">{d?.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">{e.tripId ? `Trip: ${e.tripId}` : 'Routine Fleet cost'}</span>
          </div>
        );
      }
    },
    {
      header: 'Description / Ledger notes',
      accessor: 'notes',
      render: (e) => (
        <div className="max-w-[220px] truncate text-slate-500 text-xs font-medium" title={e.notes}>
          {e.notes || 'No description notes entered'}
        </div>
      )
    },
    {
      header: 'Total Cost',
      accessor: 'amount',
      render: (e) => (
        <div className="font-mono text-slate-800 font-bold text-xs">
          ₹{e.amount.toLocaleString('en-IN')}
          {e.category === 'Fuel' && e.fuelQuantity && (
            <span className="block text-[9px] text-slate-400 font-sans font-medium">({e.fuelQuantity} L @ ₹{e.fuelPrice}/L)</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      render: (e) => (
        <button
          onClick={() => openDeleteModal(e)}
          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          title="Delete Ledger entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" text="Syncing accounts ledgers..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            Operating Costs Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Record fuel replenishment receipts, process highway toll payments, and register vehicle workshop invoices.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4.5 h-4.5 stroke-[2.5]" />}
          isMagnetic={true}
          className="self-start sm:self-center font-semibold"
        >
          Log Cost Entry
        </Button>
      </div>

      {/* Summaries Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none animate-fade-in">
        <Card noPadding className="border-l-4 border-l-slate-700 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Logged Expense</span>
            <div className="flex items-baseline gap-2 mt-1.5 truncate">
              <span className="text-xl font-bold text-slate-800 font-display">₹{totalExpenseSum.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-medium">this period</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-blue-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Fuel Repositories</span>
            <div className="flex items-baseline gap-2 mt-1.5 truncate">
              <span className="text-xl font-bold text-slate-800 font-display">₹{fuelExpenseSum.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-medium">diesel & cng</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-amber-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Repairs Invoices</span>
            <div className="flex items-baseline gap-2 mt-1.5 truncate">
              <span className="text-xl font-bold text-slate-800 font-display">₹{repairExpenseSum.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-medium">workshop billing</span>
            </div>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-purple-500 bg-white">
          <div className="p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tolls & Terminal Fees</span>
            <div className="flex items-baseline gap-2 mt-1.5 truncate">
              <span className="text-xl font-bold text-slate-800 font-display">₹{otherExpenseSum.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-medium">fastag & parking</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Advanced Filters desk */}
      <Card noPadding className="bg-white">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-50 hover:border-slate-400 transition-all cursor-pointer"
            >
              <option value="">Filter by Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration} ({v.model.split(' ')[0]})</option>)}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-3 w-full">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 outline-hidden focus:border-brand-500 focus:ring-2"
              placeholder="Start Date"
            />
            <span className="text-slate-400 text-xs font-bold uppercase">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-1/2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 outline-hidden focus:border-brand-500 focus:ring-2"
              placeholder="End Date"
            />
          </div>
        </div>
      </Card>

      {/* Datatable */}
      <DataTable
        columns={columns}
        rows={filteredExpenses}
        emptyTitle="No expense items found matching filters"
        emptyDescription="Please adjust your searches or click 'Log Cost Entry' above to add a new fleet expense receipt."
      />

      {/* Add Expense Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Log operational cost receipt"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
              Cancel Entry
            </Button>
            <Button variant="primary" size="sm" type="submit" form="expense-form" loading={isSubmitting}>
              Save Ledger Entry
            </Button>
          </>
        }
      >
        <form id="expense-form" onSubmit={handleFormSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Select Expense Classification"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
              options={EXPENSE_CATEGORIES.map(c => ({ value: c, label: c }))}
              required
            />

            <Select
              label="Associated Vehicle"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              options={vehicles.map(v => ({ 
                value: v.id, 
                label: `${v.registration} (${v.model})` 
              }))}
              required
              error={formErrors.vehicleId}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Incurred By Operator"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              options={drivers.map(d => ({ value: d.id, label: d.name }))}
              required
              error={formErrors.driverId}
            />

            <Select
              label="Associated Cargo Trip Run (Optional)"
              value={formData.tripId}
              onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
              options={[
                { value: '', label: 'General / Routine Fleet cost' },
                ...trips.map(t => ({ value: t.id, label: `${t.id} (${t.origin} → ${t.destination})` }))
              ]}
            />
          </div>

          {/* FUEL-SPECIFIC CONDITIONAL FIELD LAYOUTS (Section 17 & 9) */}
          {formData.category === 'Fuel' && (
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-2 gap-4 animate-fade-in">
              <Input
                label="Fuel Replenished (Liters)"
                type="number"
                step="0.1"
                value={formData.fuelQuantity}
                onChange={(e) => setFormData({ ...formData, fuelQuantity: e.target.value })}
                required
                disabled={isSubmitting}
                error={formErrors.fuelQuantity}
              />

              <Input
                label="Fuel Unit Price (INR / Liter)"
                type="number"
                step="0.01"
                value={formData.fuelPrice}
                onChange={(e) => setFormData({ ...formData, fuelPrice: e.target.value })}
                required
                disabled={isSubmitting}
                error={formErrors.fuelPrice}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Receipt Cost (INR)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              disabled={isSubmitting || formData.category === 'Fuel'} // Disabled autofilled fuel equations (Section 17)
              error={formErrors.amount}
              helperText={formData.category === 'Fuel' ? 'Auto-calculated from Quantity * Price per Liter' : ''}
            />

            <Input
              label="Billing Receipt Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 tracking-wide">
              Ledger Accounting Notes / Comments
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Shell Petrol Pump highway fuel bill, fastener toll fastag slip..."
              className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 border border-slate-300 rounded-lg outline-hidden focus:border-brand-500 focus:ring-2"
              disabled={isSubmitting}
            />
          </div>

        </form>
      </Modal>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isSubmitting}
        title="Permanently remove expense receipt?"
        description={`This will permanently remove expense item ledger record ${currentExpense?.id} representing ₹${currentExpense?.amount.toLocaleString('en-IN')}. This cannot be undone and will alter general ledger balance metrics.`}
      />

    </div>
  );
};

export default FuelExpenses;
