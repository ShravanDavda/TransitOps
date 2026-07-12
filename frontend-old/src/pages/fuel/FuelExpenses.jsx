import {
  CircleDollarSign,
  Droplets,
  Fuel,
  Gauge,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import "../../styles/globals.css";

const summaryCards = [
  {
    label: "Total Fuel Cost",
    value: "₹2,84,500",
    helper: "This month",
    icon: CircleDollarSign,
    type: "primary",
  },
  {
    label: "Fuel Consumed",
    value: "3,842 L",
    helper: "This month",
    icon: Fuel,
    type: "warning",
  },
  {
    label: "Avg. Fuel Efficiency",
    value: "8.4 km/L",
    helper: "Across active fleet",
    icon: Gauge,
    type: "success",
  },
  {
    label: "Other Expenses",
    value: "₹68,200",
    helper: "Tolls, parking & misc.",
    icon: Droplets,
    type: "danger",
  },
];

const expenseRecords = [
  {
    id: "EXP-1001",
    vehicle: "GJ 01 AB 4582",
    category: "Fuel",
    quantity: "82 L",
    amount: "₹7,790",
    date: "12 Jul 2026",
    payment: "Fleet Card",
    status: "Paid",
  },
  {
    id: "EXP-1002",
    vehicle: "GJ 05 KL 2291",
    category: "Toll",
    quantity: "—",
    amount: "₹1,240",
    date: "12 Jul 2026",
    payment: "FASTag",
    status: "Paid",
  },
  {
    id: "EXP-1003",
    vehicle: "GJ 18 BX 7310",
    category: "Fuel",
    quantity: "96 L",
    amount: "₹9,120",
    date: "11 Jul 2026",
    payment: "Fleet Card",
    status: "Paid",
  },
  {
    id: "EXP-1004",
    vehicle: "GJ 03 MN 8845",
    category: "Parking",
    quantity: "—",
    amount: "₹850",
    date: "10 Jul 2026",
    payment: "Cash",
    status: "Pending",
  },
  {
    id: "EXP-1005",
    vehicle: "GJ 27 CD 1198",
    category: "Fuel",
    quantity: "74 L",
    amount: "₹7,030",
    date: "09 Jul 2026",
    payment: "UPI",
    status: "Paid",
  },
];

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function FuelExpenses() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Fuel & Expenses</h1>
          <p>
            Monitor fuel consumption and track fleet operating expenses.
          </p>
        </div>

        <button type="button" className="primary-button">
          <Plus size={18} />
          Add Expense
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
            <h2>Expense Records</h2>
            <p>Review fuel purchases and other fleet expenses.</p>
          </div>
        </div>

        <div className="table-toolbar">
          <div className="search-field">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search vehicle or expense..."
              aria-label="Search expense records"
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
                <th>Expense ID</th>
                <th>Vehicle</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {expenseRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="table-id">{record.id}</span>
                  </td>

                  <td>
                    <strong>{record.vehicle}</strong>
                  </td>

                  <td>{record.category}</td>
                  <td>{record.quantity}</td>
                  <td>{record.amount}</td>
                  <td>{record.date}</td>
                  <td>{record.payment}</td>

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
          <span>Showing 5 of 124 expense records</span>

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

export default FuelExpenses;