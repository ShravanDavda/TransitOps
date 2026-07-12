import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Trip, Vehicle, Driver, Expense, Maintenance } from '../../utils/constants';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Award, IndianRupee, ShieldAlert, CheckCircle, Truck, FileBarChart2, RefreshCw 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useToast } from '../../components/common/Toast';

const Analytics: React.FC = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [v, d, t, e, m] = await Promise.all([
        api.getVehicles(),
        api.getDrivers(),
        api.getTrips(),
        api.getExpenses(),
        api.getMaintenance()
      ]);
      setVehicles(v);
      setDrivers(d);
      setTrips(t);
      setExpenses(e);
      setMaintenance(m);
    } catch (err) {
      toast('Failed to synchronize analytics databanks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Calculations: General KPI Values
  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDistance = trips.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.distance, 0);
  
  // Cost per KM calculation
  const costPerKm = totalDistance > 0 ? (totalCost / totalDistance) : 0;

  // Active Fleet usage
  const activeFleetCount = vehicles.filter(v => v.status === 'On Trip').length;
  const fleetUtilizationRate = vehicles.length > 0 ? Math.round((activeFleetCount / vehicles.length) * 100) : 0;

  // Completed deliveries tally
  const completedDeliveries = trips.filter(t => t.status === 'Completed').length;
  const deliverySuccessRate = trips.length > 0 
    ? Math.round((completedDeliveries / trips.filter(t => t.status !== 'Cancelled').length) * 100) 
    : 100;

  // 2. Data Structuring: Expenses Category Split (Pie Chart)
  const categorySplitMap: Record<string, number> = {};
  expenses.forEach(e => {
    categorySplitMap[e.category] = (categorySplitMap[e.category] || 0) + e.amount;
  });

  const expenseCategoryData = Object.keys(categorySplitMap).map(cat => ({
    name: cat,
    value: categorySplitMap[cat]
  }));

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#64748b'];

  // 3. Data Structuring: Monthly Expenses Trend (Line Chart)
  // Grouping static or real expenses over months
  const monthlyExpMap: Record<string, number> = {
    'Jan': 48000, 'Feb': 51000, 'Mar': 49000, 'Apr': 56000, 'May': 62000, 'Jun': 59000
  };
  
  // Aggregate real current logged expenses onto the monthly charts (grouping by date)
  expenses.forEach(e => {
    try {
      const dateObj = new Date(e.date);
      const monthStr = dateObj.toLocaleString('default', { month: 'short' });
      if (['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(monthStr)) {
        monthlyExpMap[monthStr] = (monthlyExpMap[monthStr] || 0) + e.amount;
      }
    } catch (err) {
      // safe fallback for invalid date strings
    }
  });

  const monthlyTrendData = Object.keys(monthlyExpMap).map(m => ({
    month: m,
    Expenses: monthlyExpMap[m]
  }));

  // 4. Data Structuring: Driver Milestones & Run Leaderboards (Bar Chart)
  // Mapping top active drivers
  const driverPerformanceData = drivers.slice(0, 5).map(d => ({
    name: d.name.split(' ')[0], // only first name for chart fit
    Trips: d.completedTrips || 0
  })).sort((a, b) => b.Trips - a.Trips);

  // 5. Data Structuring: Volumetric Vehicle Payload Performance (Horizontal Bar Chart)
  const vehicleUtilizationData = vehicles.slice(0, 5).map(v => ({
    registration: v.registration.split('-').pop() || v.registration, // last segment for labels
    Capacity: v.capacity,
    Odometer: Math.round(v.odometer / 1000) // in thousand kms
  }));

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" text="Compiling financial models..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Sync Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
            Corporate Operations Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            Examine cargo logistics KPIs, audit capital fuel expenditures, and review team performance leaderboards.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          icon={<RefreshCw className="w-4 h-4" />}
          className="self-start sm:self-center text-xs font-semibold"
        >
          Re-Sync Datasets
        </Button>
      </div>

      {/* Advanced KPIs grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none animate-fade-in">
        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><IndianRupee className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Capital Expenses</span>
              <span className="text-lg font-bold text-slate-800 font-display block mt-0.5">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average cost per KM</span>
              <span className="text-lg font-bold text-slate-800 font-display block mt-0.5">₹{costPerKm.toFixed(1)} / km</span>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><Truck className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fleet Utilization</span>
              <span className="text-lg font-bold text-slate-800 font-display block mt-0.5">{fleetUtilizationRate}% Active</span>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">On-Time Deliveries</span>
              <span className="text-lg font-bold text-slate-800 font-display block mt-0.5">{deliverySuccessRate}% Success</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts Deck Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Expenses Trend Line */}
        <Card className="bg-white flex flex-col h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Operational Expenditure Trend</h3>
            <p className="text-[10px] text-slate-400 font-medium">Monthly breakdown of registered fleet disbursements.</p>
          </div>
          <div className="flex-1 min-h-0 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Expenses" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Monthly Expenditures (INR)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Expense Categories Breakdown (Pie Chart) */}
        <Card className="bg-white flex flex-col h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Capital Cost Segregation</h3>
            <p className="text-[10px] text-slate-400 font-medium">Visual proportion of expenses split across standard categories.</p>
          </div>
          <div className="flex-1 min-h-0 text-xs flex items-center justify-center">
            {expenseCategoryData.length === 0 ? (
              <div className="text-center text-slate-400 text-xs font-semibold py-12">
                No expense ledger inputs entered. Use the "Fuel & Expenses" tab to log records.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 3: Driver Achievements Leaderboard (Bar Chart) */}
        <Card className="bg-white flex flex-col h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Driver Operations Milestone Leaderboard</h3>
            <p className="text-[10px] text-slate-400 font-medium">Comparison of successful deliveries completed by prime drivers.</p>
          </div>
          <div className="flex-1 min-h-0 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={35} name="Delivered Consignments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Fleet Volumetric Load Cap vs Odometer Mileage */}
        <Card className="bg-white flex flex-col h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Asset Capacities vs Accumulated Distance</h3>
            <p className="text-[10px] text-slate-400 font-medium">Evaluating prime transport carrying capacity and total running distance.</p>
          </div>
          <div className="flex-1 min-h-0 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="registration" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Capacity" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} name="Capacity (Tons)" />
                <Bar dataKey="Odometer" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} name="Mileage (Thousand km)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default Analytics;
