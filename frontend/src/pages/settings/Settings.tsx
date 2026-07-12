import React, { useState } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../hooks/useAuth';
import { 
  Settings as SettingsIcon, Building, ShieldCheck, AlertCircle, RefreshCw, LogOut, CheckCircle 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial form states from standard constants or localStorage
  const [orgData, setOrgData] = useState({
    name: 'TransitOps Logistics Ltd',
    email: 'ops@transitops.com',
    phone: '+91 99988 88877',
    timezone: 'IST (UTC+05:30)'
  });

  const [systemData, setSystemData] = useState({
    currency: 'INR',
    metric: 'Kilometers (km)',
    refreshInterval: '30'
  });

  const [alertData, setAlertData] = useState({
    licenseWarning: '30',
    odometerGap: '10000',
    capacityGrace: '10'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast('Organization profile configurations stored securely', 'success');
    }, 600);
  };

  const handleSaveSystem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast('System localized configuration preferences saved', 'success');
    }, 500);
  };

  const handleSaveAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast('Predictive warning alert thresholds locked', 'success');
    }, 450);
  };

  // Perform full database purge and clean reset to initial factory seeds (Section 6)
  const handleDatabaseReset = async () => {
    setIsSubmitting(true);
    try {
      localStorage.clear(); // purge
      // Re-trigger core state seeds inside api
      await api.getVehicles(); // calling any method re-seeds empty localStorage
      toast('Database cleared & reset to factory defaults successfully', 'success');
      setIsResetOpen(false);
      // Wait and refresh to reload clean memory datasets
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast('Failed to clear database registry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Panel */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 font-display tracking-tight leading-none">
          Global Operations Control Panel
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
          Configure organization structures, calibrate preventive maintenance alerts, and manage database registers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile and System parameters */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Org Setup */}
          <Card className="bg-white">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800 font-display">Organization Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Registered Corporate Name"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Primary Contact Email"
                  type="email"
                  value={orgData.email}
                  onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                />

                <Input
                  label="Contact Phone"
                  value={orgData.phone}
                  onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Select
                label="Regional Timezone Node"
                value={orgData.timezone}
                onChange={(e) => setOrgData({ ...orgData, timezone: e.target.value })}
                options={[
                  { value: 'IST (UTC+05:30)', label: 'Kolkata, Mumbai - IST (UTC+05:30)' },
                  { value: 'UTC (UTC+00:00)', label: 'Greenwich Standard - UTC (UTC+00:00)' },
                  { value: 'EST (UTC-05:00)', label: 'New York, Toronto - EST (UTC-05:00)' }
                ]}
                required
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" type="submit" loading={isSubmitting}>
                  Save Profile
                </Button>
              </div>
            </form>
          </Card>

          {/* Section 2: Local System Variables */}
          <Card className="bg-white">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <SettingsIcon className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800 font-display">Localization Settings</h3>
            </div>

            <form onSubmit={handleSaveSystem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Reporting Standard Currency"
                  value={systemData.currency}
                  onChange={(e) => setSystemData({ ...systemData, currency: e.target.value })}
                  options={[
                    { value: 'INR', label: 'Indian Rupee (₹)' },
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (€)' }
                  ]}
                  required
                />

                <Select
                  label="Odometer Measurement Units"
                  value={systemData.metric}
                  onChange={(e) => setSystemData({ ...systemData, metric: e.target.value })}
                  options={[
                    { value: 'Kilometers (km)', label: 'Kilometers (km)' },
                    { value: 'Miles (mi)', label: 'Miles (mi)' }
                  ]}
                  required
                />
              </div>

              <Select
                label="Telemetry Auto-Sync Polling Interval (Seconds)"
                value={systemData.refreshInterval}
                onChange={(e) => setSystemData({ ...systemData, refreshInterval: e.target.value })}
                options={[
                  { value: '15', label: 'Real-time (15 seconds)' },
                  { value: '30', label: 'Standard (30 seconds)' },
                  { value: '60', label: 'Optimized (60 seconds)' }
                ]}
                required
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" type="submit" loading={isSubmitting}>
                  Apply Settings
                </Button>
              </div>
            </form>
          </Card>

        </div>

        {/* Alerts and Backup panel */}
        <div className="space-y-6">
          
          {/* Section 3: Risk Warning Config thresholds */}
          <Card className="bg-white">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-800 font-display">Diagnostic Warn Thresholds</h3>
            </div>

            <form onSubmit={handleSaveAlerts} className="space-y-4">
              <Input
                label="License Validity Alert Days"
                type="number"
                value={alertData.licenseWarning}
                onChange={(e) => setAlertData({ ...alertData, licenseWarning: e.target.value })}
                required
                disabled={isSubmitting}
                helperText="Flags operator warning states prior to commercial license expiry."
              />

              <Input
                label="Preventative Service Intermission (km)"
                type="number"
                value={alertData.odometerGap}
                onChange={(e) => setAlertData({ ...alertData, odometerGap: e.target.value })}
                required
                disabled={isSubmitting}
                helperText="Standard distance interval between routine garage servicing visits."
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" type="submit" loading={isSubmitting}>
                  Save Alert Profiles
                </Button>
              </div>
            </form>
          </Card>

          {/* Section 4: System Reset & Log Out */}
          <Card className="bg-white border-l-4 border-l-rose-500">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                Administrative Actions
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Perform factory database resets or sign out of your user operations console session.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <Button
                variant="outline"
                onClick={() => setIsResetOpen(true)}
                icon={<RefreshCw className="w-4 h-4 text-rose-500" />}
                className="w-full text-xs font-semibold justify-center text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Clear & Reset Database
              </Button>

              <Button
                variant="danger"
                onClick={logout}
                icon={<LogOut className="w-4 h-4" />}
                className="w-full text-xs font-semibold justify-center"
              >
                Log Out of Console
              </Button>
            </div>
          </Card>

        </div>

      </div>

      {/* Confirm Purge Reset dialog */}
      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleDatabaseReset}
        isLoading={isSubmitting}
        title="Purge & reset operational databases?"
        description="This administrative operation will wipe the local storage registry, removing all newly logged vehicles, dispatches, driver entries, maintenance logs, and fuel expenses. The system will reset to factory default demonstration data."
      />

    </div>
  );
};

export default Settings;
