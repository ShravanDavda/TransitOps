import "../../styles/globals.css";
const kpis = [
  {
    label: "Total Vehicles",
    value: "24",
    detail: "18 currently available",
    tone: "blue",
  },
  {
    label: "Active Trips",
    value: "7",
    detail: "3 arriving today",
    tone: "green",
  },
  {
    label: "In Maintenance",
    value: "3",
    detail: "1 service due today",
    tone: "amber",
  },
  {
    label: "Available Drivers",
    value: "16",
    detail: "4 currently on trip",
    tone: "slate",
  },
];

const recentTrips = [
  {
    id: "TRP-1042",
    route: "Ahmedabad → Surat",
    vehicle: "GJ-01-AB-4821",
    driver: "Arjun Patel",
    status: "Dispatched",
  },
  {
    id: "TRP-1041",
    route: "Vadodara → Rajkot",
    vehicle: "GJ-06-KL-2210",
    driver: "Rohan Shah",
    status: "Completed",
  },
  {
    id: "TRP-1040",
    route: "Surat → Ahmedabad",
    vehicle: "GJ-05-MN-9012",
    driver: "Vikram Joshi",
    status: "Draft",
  },
];

function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            Monitor your fleet operations and recent activity.
          </p>
        </div>
      </div>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <article className="kpi-card" key={kpi.label}>
            <div className={`kpi-card__accent kpi-card__accent--${kpi.tone}`} />
            <p className="kpi-card__label">{kpi.label}</p>
            <strong className="kpi-card__value">{kpi.value}</strong>
            <span className="kpi-card__detail">{kpi.detail}</span>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="page-card">
          <div className="page-card__header">
            <div>
              <h2>Fleet Utilization</h2>
              <p>Current operational fleet overview</p>
            </div>
          </div>

          <div className="chart-placeholder">
            <div className="chart-placeholder__bars">
              <span style={{ height: "48%" }} />
              <span style={{ height: "72%" }} />
              <span style={{ height: "58%" }} />
              <span style={{ height: "86%" }} />
              <span style={{ height: "66%" }} />
              <span style={{ height: "78%" }} />
              <span style={{ height: "62%" }} />
            </div>
            <p>Fleet utilization overview</p>
          </div>
        </article>

        <article className="page-card">
          <div className="page-card__header">
            <div>
              <h2>Vehicle Status</h2>
              <p>Live fleet availability snapshot</p>
            </div>
          </div>

          <div className="status-overview">
            <div>
              <span className="status-overview__dot status-overview__dot--green" />
              <p>Available</p>
              <strong>18</strong>
            </div>

            <div>
              <span className="status-overview__dot status-overview__dot--blue" />
              <p>On Trip</p>
              <strong>3</strong>
            </div>

            <div>
              <span className="status-overview__dot status-overview__dot--amber" />
              <p>In Shop</p>
              <strong>3</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="page-card">
        <div className="page-card__header">
          <div>
            <h2>Recent Trips</h2>
            <p>Latest fleet movement across your operations</p>
          </div>
        </div>

        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="table-primary">{trip.id}</td>
                  <td>{trip.route}</td>
                  <td>{trip.vehicle}</td>
                  <td>{trip.driver}</td>
                  <td>
                    <span
                      className={`page-status page-status--${trip.status.toLowerCase()}`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;