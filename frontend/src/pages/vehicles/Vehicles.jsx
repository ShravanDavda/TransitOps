import "../../styles/globals.css";
const vehicles = [
  {
    registration: "GJ-01-AB-4821",
    model: "Tata Prima 5530.S",
    type: "Truck",
    capacity: "35,000 kg",
    status: "Available",
  },
  {
    registration: "GJ-05-MN-9012",
    model: "Ashok Leyland 1920",
    type: "Truck",
    capacity: "18,500 kg",
    status: "On Trip",
  },
  {
    registration: "GJ-06-KL-2210",
    model: "Tata Ultra T.16",
    type: "Truck",
    capacity: "16,000 kg",
    status: "In Shop",
  },
];

function Vehicles() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicles</h1>
          <p className="page-description">
            Manage and monitor your fleet vehicles.
          </p>
        </div>

        <button type="button" className="page-primary-action">
          + Add Vehicle
        </button>
      </div>

      <section className="page-summary-grid">
        <article className="summary-card">
          <span>Total Vehicles</span>
          <strong>24</strong>
        </article>

        <article className="summary-card">
          <span>Available</span>
          <strong>18</strong>
        </article>

        <article className="summary-card">
          <span>On Trip</span>
          <strong>3</strong>
        </article>

        <article className="summary-card">
          <span>In Shop</span>
          <strong>3</strong>
        </article>
      </section>

      <section className="page-card">
        <div className="page-toolbar">
          <div className="page-search-placeholder">
            Search vehicles...
          </div>

          <div className="page-filter-placeholder">All Statuses</div>
        </div>

        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Model</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.registration}>
                  <td className="table-primary">{vehicle.registration}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.capacity}</td>
                  <td>
                    <span
                      className={`page-status page-status--${vehicle.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="table-action">
                      •••
                    </button>
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

export default Vehicles;