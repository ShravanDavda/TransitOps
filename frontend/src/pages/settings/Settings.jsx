import {
  Bell,
  Building2,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  Save,
  Settings2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import "../../styles/globals.css";

function Settings() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>
            Manage company information, fleet preferences, and notifications.
          </p>
        </div>

        <button type="button" className="primary-button">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="settings-grid">
        {/* Company Profile */}
        <section className="content-card">
          <div className="content-card__header">
            <div>
              <h2>Company Profile</h2>
              <p>Update your organization details.</p>
            </div>

            <Building2 size={20} />
          </div>

          <div className="settings-form-grid">
            <div className="settings-field settings-field--full">
              <label htmlFor="company-name">Company Name</label>

              <div className="settings-input">
                <Building2 size={17} />

                <input
                  id="company-name"
                  type="text"
                  defaultValue="TransitOps Logistics Pvt. Ltd."
                />
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="company-email">Business Email</label>

              <div className="settings-input">
                <Mail size={17} />

                <input
                  id="company-email"
                  type="email"
                  defaultValue="operations@transitops.in"
                />
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="timezone">Timezone</label>

              <div className="settings-input">
                <Globe2 size={17} />

                <select id="timezone" defaultValue="IST">
                  <option value="IST">India Standard Time (IST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>

            <div className="settings-field settings-field--full">
              <label htmlFor="company-address">Office Address</label>

              <div className="settings-input">
                <MapPin size={17} />

                <input
                  id="company-address"
                  type="text"
                  defaultValue="Ahmedabad, Gujarat, India"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Preferences */}
        <section className="content-card">
          <div className="content-card__header">
            <div>
              <h2>Fleet Preferences</h2>
              <p>Configure default fleet operating preferences.</p>
            </div>

            <Truck size={20} />
          </div>

          <div className="settings-form-grid">
            <div className="settings-field">
              <label htmlFor="distance-unit">Distance Unit</label>

              <div className="settings-input">
                <Settings2 size={17} />

                <select id="distance-unit" defaultValue="km">
                  <option value="km">Kilometres (km)</option>
                  <option value="mi">Miles (mi)</option>
                </select>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="fuel-unit">Fuel Unit</label>

              <div className="settings-input">
                <Settings2 size={17} />

                <select id="fuel-unit" defaultValue="litres">
                  <option value="litres">Litres</option>
                  <option value="gallons">Gallons</option>
                </select>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="currency">Currency</label>

              <div className="settings-input">
                <Settings2 size={17} />

                <select id="currency" defaultValue="INR">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="maintenance-reminder">
                Maintenance Reminder
              </label>

              <div className="settings-input">
                <Settings2 size={17} />

                <select
                  id="maintenance-reminder"
                  defaultValue="7-days"
                >
                  <option value="3-days">3 days before</option>
                  <option value="7-days">7 days before</option>
                  <option value="14-days">14 days before</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Notifications */}
      <section className="content-card">
        <div className="content-card__header">
          <div>
            <h2>Notification Preferences</h2>
            <p>Choose which operational alerts you want to receive.</p>
          </div>

          <Bell size={20} />
        </div>

        <div className="settings-preferences">
          <label className="settings-preference">
            <div className="settings-preference__icon">
              <Truck size={19} />
            </div>

            <div className="settings-preference__content">
              <strong>Vehicle Alerts</strong>
              <span>
                Receive alerts for vehicle status and operational issues.
              </span>
            </div>

            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-preference">
            <div className="settings-preference__icon">
              <CheckCircle2 size={19} />
            </div>

            <div className="settings-preference__content">
              <strong>Trip Updates</strong>
              <span>
                Receive notifications when trips start, complete, or are
                delayed.
              </span>
            </div>

            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-preference">
            <div className="settings-preference__icon">
              <Settings2 size={19} />
            </div>

            <div className="settings-preference__content">
              <strong>Maintenance Reminders</strong>
              <span>
                Receive reminders for upcoming and overdue maintenance.
              </span>
            </div>

            <input type="checkbox" defaultChecked />
          </label>

          <label className="settings-preference">
            <div className="settings-preference__icon">
              <ShieldCheck size={19} />
            </div>

            <div className="settings-preference__content">
              <strong>Security Notifications</strong>
              <span>
                Receive important account and security activity alerts.
              </span>
            </div>

            <input type="checkbox" defaultChecked />
          </label>
        </div>
      </section>
    </div>
  );
}

export default Settings;