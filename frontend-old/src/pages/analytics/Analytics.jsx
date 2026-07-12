import {
  Activity,
  BarChart3,
  CalendarDays,
  Clock3,
  Fuel,
  Gauge,
  IndianRupee,
  Route,
  TrendingUp,
  Truck,
} from "lucide-react";
import "../../styles/globals.css";

const summaryCards = [
  {
    label: "Fleet Utilization",
    value: "84%",
    helper: "+6.2% from last month",
    icon: Truck,
    type: "primary",
  },
  {
    label: "Total Distance",
    value: "48,260 km",
    helper: "Across all completed trips",
    icon: Route,
    type: "success",
  },
  {
    label: "Avg. Fuel Efficiency",
    value: "8.4 km/L",
    helper: "+0.6 km/L improvement",
    icon: Fuel,
    type: "warning",
  },
  {
    label: "Operating Cost",
    value: "₹6.82L",
    helper: "This month",
    icon: IndianRupee,
    type: "danger",
  },
];

const utilizationData = [
  { label: "Trucks", value: 88 },
  { label: "Buses", value: 76 },
  { label: "Vans", value: 82 },
  { label: "Utility Vehicles", value: 68 },
];

const tripMetrics = [
  {
    label: "Completed Trips",
    value: "1,248",
    helper: "+12.4% from last month",
    icon: Route,
  },
  {
    label: "On-Time Delivery",
    value: "94.2%",
    helper: "+3.1% improvement",
    icon: Clock3,
  },
  {
    label: "Average Trip Time",
    value: "4h 28m",
    helper: "18 min faster",
    icon: Gauge,
  },
];

const expenseBreakdown = [
  {
    category: "Fuel",
    amount: "₹2,84,500",
    percentage: 42,
  },
  {
    category: "Maintenance",
    amount: "₹1,86,200",
    percentage: 27,
  },
  {
    category: "Tolls & Parking",
    amount: "₹92,400",
    percentage: 14,
  },
  {
    category: "Other Expenses",
    amount: "₹1,18,900",
    percentage: 17,
  },
];

function Analytics() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>
            Monitor fleet performance, utilization, costs, and operational
            trends.
          </p>
        </div>

        <button type="button" className="secondary-button">
          <CalendarDays size={18} />
          Last 30 Days
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

      <div className="analytics-grid">
        <section className="content-card">
          <div className="content-card__header">
            <div>
              <h2>Fleet Utilization</h2>
              <p>Vehicle utilization by fleet category.</p>
            </div>

            <Activity size={20} />
          </div>

          <div className="analytics-list">
            {utilizationData.map((item) => (
              <div className="analytics-progress-item" key={item.label}>
                <div className="analytics-progress-header">
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>

                <div className="analytics-progress-track">
                  <div
                    className="analytics-progress-fill"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-card__header">
            <div>
              <h2>Trip Performance</h2>
              <p>Key delivery and trip performance indicators.</p>
            </div>

            <TrendingUp size={20} />
          </div>

          <div className="analytics-metrics">
            {tripMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div className="analytics-metric" key={metric.label}>
                  <div className="analytics-metric__icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <small>{metric.helper}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="content-card">
        <div className="content-card__header">
          <div>
            <h2>Expense Breakdown</h2>
            <p>Distribution of fleet operating expenses this month.</p>
          </div>

          <BarChart3 size={20} />
        </div>

        <div className="expense-breakdown">
          {expenseBreakdown.map((expense) => (
            <div className="expense-breakdown__item" key={expense.category}>
              <div className="expense-breakdown__header">
                <div>
                  <strong>{expense.category}</strong>
                  <span>{expense.percentage}% of total expenses</span>
                </div>

                <strong>{expense.amount}</strong>
              </div>

              <div className="analytics-progress-track">
                <div
                  className="analytics-progress-fill"
                  style={{ width: `${expense.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Analytics;