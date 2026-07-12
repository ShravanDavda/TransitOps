import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Vehicle, Driver, Trip, Maintenance, Expense } from '../../utils/constants';
import { useToast } from '../../components/common/Toast';
import { 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  IndianRupee,
  DollarSign,
  Compass,
  Calendar,
  ChevronRight,
  Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Loader from '../../components/common/Loader';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  
  // App States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time state
  const [currentTime, setCurrentTime] = useState('');

  // Trip Modal States
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [tripForm, setTripForm] = useState({
    origin: 'Ahmedabad',
    destination: 'Vadodara',
    vehicleId: '',
    driverId: '',
    cargoDescription: 'Electronic Goods',
    cargoWeight: 10,
    departureTime: new Date().toISOString().slice(0, 16),
    expectedArrival: new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 16),
    distance: 120,
    status: 'Scheduled' as Trip['status']
  });
  const [tripErrors, setTripErrors] = useState<Record<string, string>>({});
  const [isSubmittingTrip, setIsSubmittingTrip] = useState(false);

  // Load dashboard data
  const loadData = async () => {
    try {
      const [v, d, t, m, e] = await Promise.all([
        api.getVehicles(),
        api.getDrivers(),
        api.getTrips(),
        api.getMaintenance(),
        api.getExpenses()
      ]);
      setVehicles(v);
      setDrivers(d);
      setTrips(t);
      setMaintenance(m);
      setExpenses(e);
    } catch (err: any) {
      toast('Failed to load operational database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live date string
    const formatTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    };
    formatTime();
    const interval = setInterval(formatTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync default options when modal opens
  useEffect(() => {
    if (isTripModalOpen && vehicles.length > 0 && drivers.length > 0) {
      // Find first available vehicle & driver
      const availVeh = vehicles.find(v => v.status === 'Available');
      const availDrv = drivers.find(d => d.status === 'Available' && new Date(d.licenseExpiry) > new Date());
      setTripForm(prev => ({
        ...prev,
        vehicleId: availVeh?.id || vehicles[0]?.id || '',
        driverId: availDrv?.id || drivers[0]?.id || ''
      }));
    }
  }, [isTripModalOpen, vehicles, drivers]);

  // Handle Trip Status Transition Quick Trigger
  const handleTripStatusUpdate = async (id: string, newStatus: Trip['status']) => {
    try {
      await api.updateTripStatus(id, newStatus);
      toast(`Trip ${id} state advanced to: ${newStatus}`, 'success');
      loadData();
    } catch (err: any) {
      toast(err.message || 'Failed to update status', 'error');
    }
  };

  // Submit new trip dispatch
  const handleCreateTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTrip(true);
    setTripErrors({});

    try {
      const selectedVehicle = vehicles.find(v => v.id === tripForm.vehicleId);
      
      // Inline check for weight limit
      if (selectedVehicle && tripForm.cargoWeight > selectedVehicle.capacity) {
        setTripErrors({
          cargoWeight: `Cargo weight (${tripForm.cargoWeight}T) exceeds vehicle capacity limit (${selectedVehicle.capacity}T).`
        });
        toast('Vehicle capacity limit exceeded', 'error');
        setIsSubmittingTrip(false);
        return;
      }

      await api.createTrip({
        origin: tripForm.origin,
        destination: tripForm.destination,
        vehicleId: tripForm.vehicleId,
        driverId: tripForm.driverId,
        cargoDescription: tripForm.cargoDescription,
        cargoWeight: Number(tripForm.cargoWeight),
        departureTime: new Date(tripForm.departureTime).toISOString(),
        expectedArrival: new Date(tripForm.expectedArrival).toISOString(),
        distance: Number(tripForm.distance),
        status: tripForm.status
      });

      toast(`Dispatch scheduled successfully!`, 'success');
      setIsTripModalOpen(false);
      loadData(); // reload charts, tables, summaries
    } catch (err: any) {
      // Catch backend-ready API validations (unauthorized driver, expired license, maintenance, etc.)
      const msg = err.message || 'Validation error';
      setTripErrors({ form: msg });
      toast(msg, 'error');
    } finally {
      setIsSubmittingTrip(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" text="Syncing fleet databases..." />
      </div>
    );
  }

  // Live dynamic calculations
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const activeTripsCount = trips.filter(t => t.status === 'In Transit' || t.status === 'Dispatched').length;
  const vehiclesInMaintCount = vehicles.filter(v => v.status === 'In Maintenance').length;
  const availableDriversCount = drivers.filter(d => d.status === 'Available' && new Date(d.licenseExpiry) > new Date()).length;
  
  // Sum monthly operational costs (expenses)
  const currentMonthExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Maintenance Alerts & Driver Expire notifications (For Warning Desk)
  const activeAlerts = maintenance.filter(m => m.status === 'Overdue' || m.status === 'In Progress');
  const driverExpiries = drivers.filter(d => {
    const daysLeft = Math.ceil((new Date(d.licenseExpiry).getTime() - Date.now()) / (1000 * 3600 * 24));
    return daysLeft <= 30; // Expired or expiring soon (within 30 days)
  });

  // Recharts Seed structures (highly readable)
  const fleetUtilizationData = [
    { name: 'Available', value: availableVehicles, color: '#10b981' },
    { name: 'On Active Trip', value: vehicles.filter(v => v.status === 'On Trip').length, color: '#4f46e5' },
    { name: 'Maintenance', value: vehiclesInMaintCount, color: '#f59e0b' },
    { name: 'Out of Service', value: vehicles.filter(v => v.status === 'Out of Service').length, color: '#64748b' }
  ];

  const tripActivityData = [
    { day: 'Mon', completed: 4, active: 2 },
    { day: 'Tue', completed: 6, active: 3 },
    { day: 'Wed', completed: 5, active: 4 },
    { day: 'Thu', completed: 8, active: 2 },
    { day: 'Fri', completed: 7, active: 5 },
    { day: 'Sat', completed: 9, active: 3 },
    { day: 'Sun', completed: 11, active: 2 }
  ];

  const monthlyCostsData = [
    { month: 'Jan', Fuel: 35000, Repairs: 12000, Tolls: 4000 },
    { month: 'Feb', Fuel: 42000, Repairs: 8000, Tolls: 5500 },
    { month: 'Mar', Fuel: 48000, Repairs: 15000, Tolls: 6000 },
    { month: 'Apr', Fuel: 41000, Repairs: 25000, Tolls: 5000 },
    { month: 'May', Fuel: 51000, Repairs: 18000, Tolls: 7200 },
    { month: 'Jun', Fuel: 56000, Repairs: 32500, Tolls: 8500 }
  ];

  // Expense breakdown details
  const expenseCategoriesCount = expenses.reduce((acc: Record<string, number>, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  const expenseBreakdownData = Object.entries(expenseCategoriesCount).map(([key, val]) => ({
    name: key,
    value: val
  }));

  const expenseColors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* Top Header Row with live time & Quick Dispatch trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            HQ Command Terminal
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium select-none">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Operational Feed Live • {currentTime}</span>
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setIsTripModalOpen(true)}
          icon={<Plus className="w-4.5 h-4.5 stroke-[2.5]" />}
          isMagnetic={true}
          className="self-start sm:self-center font-semibold"
        >
          Dispatch Cargo Trip
        </Button>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 md:gap-4 select-none">
        
        {/* Card 1: Total Vehicles */}
        <Card noPadding className="border-l-4 border-l-slate-700 bg-white">
          <div className="p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Fleet</span>
              <div className="p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg"><Truck className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-2 font-display">{totalVehicles}</h3>
            <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-semibold flex items-center"><TrendingUp className="w-2.5 h-2.5 mr-0.5" />+8%</span>
              <span>vs prev month</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Available Vehicles */}
        <Card noPadding className="border-l-4 border-l-emerald-500 bg-white">
          <div className="p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100"><Truck className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-2 font-display">{availableVehicles}</h3>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              <span>{Math.round((availableVehicles/totalVehicles)*100)}% of total fleet ready</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Active Trips */}
        <Card noPadding className="border-l-4 border-l-blue-500 bg-white">
          <div className="p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Trips</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><Route className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-2 font-display">{activeTripsCount}</h3>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              <span className="font-semibold text-blue-600">{trips.filter(t => t.status === 'In Transit').length} actively in-transit</span>
            </div>
          </div>
        </Card>

        {/* Card 4: In Maintenance */}
        <Card noPadding className="border-l-4 border-l-amber-500 bg-white">
          <div className="p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maintenance</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100"><Wrench className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-2 font-display">{vehiclesInMaintCount}</h3>
            <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
              <span className={`${activeAlerts.filter(m=>m.status==='Overdue').length > 0 ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
                {activeAlerts.filter(m=>m.status==='Overdue').length} overdue alerts
              </span>
            </div>
          </div>
        </Card>

        {/* Card 5: Available Drivers */}
        <Card noPadding className="border-l-4 border-l-indigo-500 bg-white">
          <div className="p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drivers Avail</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100"><Users className="w-4 h-4" /></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-2 font-display">{availableDriversCount}</h3>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              <span className="text-rose-500 font-semibold">{drivers.filter(d=>new Date(d.licenseExpiry) < new Date()).length} expired licenses</span>
            </div>
          </div>
        </Card>

        {/* Card 6: Operating Expense */}
        <Card noPadding className="border-l-4 border-l-brand-600 bg-white">
          <div className="p-4.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Op Costs (INR)</span>
              <div className="p-2 bg-brand-50 text-brand-600 rounded-lg border border-brand-100"><IndianRupee className="w-4 h-4" /></div>
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mt-2.5 truncate font-display">
              ₹{currentMonthExpenses.toLocaleString('en-IN')}
            </h3>
            <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
              <span className="text-rose-500 font-semibold flex items-center"><TrendingUp className="w-2.5 h-2.5 mr-0.5" />+14%</span>
              <span>vs Jun</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* Chart 1: Fleet Utilization */}
        <Card title="Fleet Status Allocation" subtitle="Real-time vehicle status distribution">
          <div className="h-64 flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-3/5 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetUtilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {fleetUtilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Vehicles`, 'Status']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom legends on right */}
            <div className="w-full md:w-2/5 flex flex-col gap-2 pt-2 md:pt-0 pl-0 md:pl-2">
              {fleetUtilizationData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-semibold text-slate-600 truncate">{item.name}</span>
                  <span className="text-[11px] font-bold text-slate-400 ml-auto font-mono">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Chart 2: Daily Dispatch Flow */}
        <Card title="Trip Despatches Activity" subtitle="Completed and Scheduled runs this week">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="completed" name="Completed runs" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" name="Scheduled runs" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Expense Category Breakdown */}
        <Card title="Category Costs Breakdown" subtitle="Distribution of monthly operating expenses">
          <div className="h-64 w-full">
            {expenseBreakdownData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No expense records logged</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={45}
                    dataKey="value"
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={expenseColors[index % expenseColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString('en-IN')}`, 'Cost']} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

      </div>

      {/* Command desk - Split layout: Left (Active Trips control), Right (Warning alert desk) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Trips Control Board (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 font-display uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              Live Trips Dispatch Control Board
            </h3>
            <span className="text-[10px] text-slate-400 font-bold font-mono">
              REAL-TIME MONITORING
            </span>
          </div>

          {trips.filter(t => t.status === 'In Transit' || t.status === 'Scheduled' || t.status === 'Dispatched').length === 0 ? (
            <Card className="py-8 flex flex-col items-center justify-center text-center">
              <Route className="w-10 h-10 text-slate-300 stroke-[1.5] mb-2" />
              <p className="text-xs text-slate-500 font-semibold">No active despatches right now</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">Use the dispatch button at the top to coordinate a cargo trip.</p>
            </Card>
          ) : (
            <div className="space-y-3.5">
              {trips
                .filter(t => t.status === 'In Transit' || t.status === 'Scheduled' || t.status === 'Dispatched')
                .map((trip) => {
                  const vehicleObj = vehicles.find(v => v.id === trip.vehicleId);
                  const driverObj = drivers.find(d => d.id === trip.driverId);

                  return (
                    <Card key={trip.id} noPadding className="border border-slate-150 hover:shadow-xs hover:border-brand-300 transition-all duration-200">
                      <div className="p-4">
                        {/* Trip Top Detail row */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 font-mono">{trip.id}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{trip.cargoDescription} ({trip.cargoWeight}T)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mt-1">
                              <span className="font-display text-slate-900">{trip.origin}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                              <span className="font-display text-slate-900">{trip.destination}</span>
                            </div>
                          </div>

                          <StatusBadge status={trip.status} />
                        </div>

                        {/* Middle: Linked Truck & Driver references */}
                        <div className="grid grid-cols-2 gap-4 py-3 text-xs">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Assigned Truck</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Truck className="w-3.5 h-3.5 text-slate-500" />
                              <span className="font-semibold text-slate-700">{vehicleObj?.registration}</span>
                              <span className="text-slate-400 text-[10px] font-mono">({vehicleObj?.model?.split(' ')[0]})</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Assigned Driver</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span className="font-semibold text-slate-700">{driverObj?.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({driverObj?.licenseType})</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Trip advancement Quick buttons */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            Distance: {trip.distance} km • Departure: {new Date(trip.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div className="flex gap-2">
                            {trip.status === 'Scheduled' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleTripStatusUpdate(trip.id, 'In Transit')}
                                className="py-1 px-3 text-xs"
                              >
                                Dispatch Out
                              </Button>
                            )}
                            {trip.status === 'In Transit' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleTripStatusUpdate(trip.id, 'Completed')}
                                className="py-1 px-3 text-xs border-emerald-300 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800"
                              >
                                Mark Completed
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleTripStatusUpdate(trip.id, 'Cancelled')}
                              className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 py-1 px-2.5 text-xs font-semibold"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>

                      </div>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        {/* Right Column: Warning Alert Desk (Attention required) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 font-display uppercase tracking-wider flex items-center gap-1.5">
              <span className="p-1 bg-rose-50 border border-rose-200 text-rose-600 rounded-md"><AlertTriangle className="w-4 h-4 stroke-[2]" /></span>
              Terminal Risk Desk
            </h3>
            <span className="text-[10px] text-slate-400 font-bold font-mono">ATTENTION REQ.</span>
          </div>

          <Card noPadding className="p-4 space-y-4">
            {/* Subsection 1: Maintenance Warnings */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display border-b border-slate-100 pb-1.5 mb-2.5 flex items-center justify-between">
                <span>Active Service Alerts</span>
                <span className="text-slate-400 font-mono">({activeAlerts.length})</span>
              </h4>
              
              {activeAlerts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">All workshop tasks normalized.</p>
              ) : (
                <div className="space-y-2.5">
                  {activeAlerts.map(alert => {
                    const alertVeh = vehicles.find(v => v.id === alert.vehicleId);
                    return (
                      <div key={alert.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-slate-700">{alert.type}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Vehicle: {alertVeh?.registration}</p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border 
                          ${alert.status === 'Overdue' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                          }
                        `}>
                          {alert.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subsection 2: License Expirations */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-display border-b border-slate-100 pb-1.5 mb-2.5 flex items-center justify-between">
                <span>Driver License Audits</span>
                <span className="text-slate-400 font-mono">({driverExpiries.length})</span>
              </h4>

              {driverExpiries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">All licenses currently verified.</p>
              ) : (
                <div className="space-y-2.5">
                  {driverExpiries.map(drv => {
                    const isExpired = new Date(drv.licenseExpiry) < new Date();
                    return (
                      <div key={drv.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-slate-700">{drv.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Exp: {drv.licenseExpiry}</p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border 
                          ${isExpired 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                          }
                        `}>
                          {isExpired ? 'Expired' : 'Expiring soon'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Dispatch cargo trip modal */}
      <Modal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        title="Command Dispatch: Coordinate Cargo Trip"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsTripModalOpen(false)} disabled={isSubmittingTrip}>
              Cancel Dispatch
            </Button>
            <Button variant="primary" size="sm" type="submit" form="create-trip-form" loading={isSubmittingTrip}>
              Authorize Dispatch
            </Button>
          </>
        }
      >
        <form id="create-trip-form" onSubmit={handleCreateTripSubmit} className="space-y-4">
          
          {tripErrors.form && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs font-semibold animate-fade-in flex items-start gap-2.5 leading-relaxed">
              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{tripErrors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Origin City"
              value={tripForm.origin}
              onChange={(e) => setTripForm({ ...tripForm, origin: e.target.value })}
              options={['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Mumbai', 'Gandhinagar'].map(c => ({ value: c, label: c }))}
              required
            />
            <Select
              label="Destination City"
              value={tripForm.destination}
              onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
              options={['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Mumbai', 'Gandhinagar'].map(c => ({ value: c, label: c }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Select Available Vehicle"
              value={tripForm.vehicleId}
              onChange={(e) => setTripForm({ ...tripForm, vehicleId: e.target.value })}
              options={vehicles.map(v => ({ 
                value: v.id, 
                label: `${v.registration} (${v.type} - Max ${v.capacity}T) [${v.status}]` 
              }))}
              required
              error={tripErrors.vehicleId}
            />

            <Select
              label="Select Eligible Driver"
              value={tripForm.driverId}
              onChange={(e) => setTripForm({ ...tripForm, driverId: e.target.value })}
              options={drivers.map(d => ({ 
                value: d.id, 
                label: `${d.name} (${d.licenseType}) [${d.status}]` 
              }))}
              required
              error={tripErrors.driverId}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Cargo Description"
                value={tripForm.cargoDescription}
                onChange={(e) => setTripForm({ ...tripForm, cargoDescription: e.target.value })}
                placeholder="e.g. Pharmaceutical supplies, Electronics"
                required
              />
            </div>
            <Input
              label="Weight (Tons)"
              type="number"
              step="0.1"
              value={tripForm.cargoWeight}
              onChange={(e) => setTripForm({ ...tripForm, cargoWeight: Number(e.target.value) })}
              required
              error={tripErrors.cargoWeight}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Departure Scheduled Date/Time"
                type="datetime-local"
                value={tripForm.departureTime}
                onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })}
                required
              />
            </div>
            <Input
              label="Distance (km)"
              type="number"
              value={tripForm.distance}
              onChange={(e) => setTripForm({ ...tripForm, distance: Number(e.target.value) })}
              required
            />
          </div>

          {/* Hidden helper to notify user that vehicle rules apply */}
          <div className="text-[10px] font-medium text-slate-400 italic bg-slate-50 p-2.5 rounded border border-slate-150 leading-relaxed">
            Note: The system validates vehicle capacity, driver license status, and active routing schedules before authorization. Vehicles in maintenance or drivers with expired licenses cannot be dispatched.
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default Dashboard;
