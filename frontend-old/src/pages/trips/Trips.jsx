
import "../../styles/globals.css";
const trips = [
  {
    id: "TRP-1042",
    route: "Ahmedabad → Surat",
    vehicle: "GJ-01-AB-4821",
    driver: "Arjun Patel",
    cargo: "12,500 kg",
    status: "Dispatched",
  },
  {
    id: "TRP-1041",
    route: "Vadodara → Rajkot",
    vehicle: "GJ-06-KL-2210",
    driver: "Rohan Shah",
    cargo: "8,400 kg",
    status: "Completed",
  },
  {
    id: "TRP-1040",
    route: "Surat → Ahmedabad",
    vehicle: "GJ-05-MN-9012",
    driver: "Vikram Joshi",
    cargo: "6,800 kg",
    status: "Draft",
  },
];

function Trips() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trips</h1>
          <p className="page-description">
            Plan, dispatch, and monitor fleet trips.
          </p>
        </div>

        <button type="button" className="page-primary-action">
          + Create Trip
        </button>
      </div>

      <section className="page-summary-grid">
        <article className="summary-card">
          <span>Total Trips</span>
          <strong>48</strong>
        </article>

        <article className="summary-card">
          <span>Draft</span>
          <strong>5</strong>
        </article>

        <article className="summary-card">
          <span>Dispatched</span>
          <strong>7</strong>
        </article>

        <article className="summary-card">
          <span>Completed</span>
          <strong>36</strong>
        </article>
      </section>

      <section className="page-card">
        <div className="page-toolbar">
          <div className="page-search-placeholder">
            Search trips...
          </div>

          <div className="page-filter-placeholder">All Statuses</div>
        </div>

        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td className="table-primary">{trip.id}</td>
                  <td>{trip.route}</td>
                  <td>{trip.vehicle}</td>
                  <td>{trip.driver}</td>
                  <td>{trip.cargo}</td>
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

export default Trips;