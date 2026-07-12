import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import "../../styles/globals.css";

const summaryCards = [
  {
    label: "Scheduled",
    value: "12",
    helper: "Upcoming services",
    icon: CalendarDays,
    type: "primary",
  },
  {
    label: "In Service",
    value: "4",
    helper: "Currently being serviced",
    icon: Wrench,
    type: "warning",
  },
  {
    label: "Completed",
    value: "38",
    helper: "This month",
    icon: CheckCircle2,
    type: "success",
  },
  {
    label: "Overdue",
    value: "3",
    helper: "Requires attention",
    icon: AlertTriangle,
    type: "danger",
  },
];

const maintenanceRecords = [
  {
    id: "MNT-1001",
    vehicle: "GJ 01 AB 4582",
    service: "Oil Change",
    scheduledDate: "14 Jul 2026",
    technician: "Rajesh Patel",
    cost: "₹4,500",
    status: "Scheduled",
  },
  {
    id: "MNT-1002",
    vehicle: "GJ 05 KL 2291",
    service: "Brake Inspection",
    scheduledDate: "12 Jul 2026",
    technician: "Amit Shah",
    cost: "₹8,200",
    status: "In Service",
  },
  {
    id: "MNT-1003",
    vehicle: "GJ 18 BX 7310",
    service: "Tyre Replacement",
    scheduledDate: "10 Jul 2026",
    technician: "Vikram Joshi",
    cost: "₹24,000",
    status: "Completed",
  },
  {
    id: "MNT-1004",
    vehicle: "GJ 03 MN 8845",
    service: "Engine Inspection",
    scheduledDate: "08 Jul 2026",
    technician: "Sanjay Mehta",
    cost: "₹12,500",
    status: "Overdue",
  },
  {
    id: "MNT-1005",
    vehicle: "GJ 27 CD 1198",
    service: "General Service",
    scheduledDate: "18 Jul 2026",
    technician: "Karan Desai",
    cost: "₹6,800",
    status: "Scheduled",
  },
];

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function Maintenance() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Maintenance</h1>
          <p>
            Schedule services and monitor vehicle maintenance activity.
          </p>
        </div>

        <button type="button" className="primary-button">
          <Plus size={18} />
          Schedule Maintenance
        </button>
      </div>

      <div className="stats-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="stat-card" key={card.label}>
              <div className={`stat-icon stat-icon--${card.type}`}>
                <Icon size={21} />
              </div>

              <div className="stat-content">
                <span className="stat-label">{card.label}</span>
                <strong className="stat-value">{card.value}</strong>
                <span className="stat-helper">{card.helper}</span>
              </div>
            </article>
          );
        })}
      </div>

      <section className="content-card">
        <div className="content-card__header">
          <div>
            <h2>Maintenance Records</h2>
            <p>Track scheduled and completed vehicle services.</p>
          </div>
        </div>

        <div className="table-toolbar">
          <div className="search-field">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search vehicle or service..."
              aria-label="Search maintenance records"
            />
          </div>

          <button type="button" className="secondary-button">
            <SlidersHorizontal size={17} />
            Filter
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Maintenance ID</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Scheduled Date</th>
                <th>Technician</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {maintenanceRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="table-id">{record.id}</span>
                  </td>

                  <td>
                    <strong>{record.vehicle}</strong>
                  </td>

                  <td>{record.service}</td>

                  <td>
                    <span className="table-date">
                      <Clock3 size={15} />
                      {record.scheduledDate}
                    </span>
                  </td>

                  <td>{record.technician}</td>

                  <td>{record.cost}</td>

                  <td>
                    <span
                      className={`status-badge status-badge--${getStatusClass(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Showing 5 of 57 maintenance records</span>

          <div className="pagination">
            <button type="button" disabled>
              Previous
            </button>

            <button type="button" className="pagination__active">
              1
            </button>

            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Maintenance;