import "../../styles/globals.css";
const drivers = [
  {
    name: "Arjun Patel",
    phone: "+91 98765 43210",
    license: "GJ0120210012345",
    expiry: "18 Dec 2027",
    status: "Available",
  },
  {
    name: "Rohan Shah",
    phone: "+91 98250 11223",
    license: "GJ0520200098123",
    expiry: "04 Aug 2027",
    status: "On Trip",
  },
  {
    name: "Vikram Joshi",
    phone: "+91 98980 33445",
    license: "GJ0620190045621",
    expiry: "12 Sep 2026",
    status: "Off Duty",
  },
];

function Drivers() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Drivers</h1>
          <p className="page-description">
            Manage drivers, availability, and license information.
          </p>
        </div>

        <button type="button" className="page-primary-action">
          + Add Driver
        </button>
      </div>

      <section className="page-summary-grid">
        <article className="summary-card">
          <span>Total Drivers</span>
          <strong>22</strong>
        </article>

        <article className="summary-card">
          <span>Available</span>
          <strong>16</strong>
        </article>

        <article className="summary-card">
          <span>On Trip</span>
          <strong>4</strong>
        </article>

        <article className="summary-card">
          <span>Off Duty</span>
          <strong>2</strong>
        </article>
      </section>

      <section className="page-card">
        <div className="page-toolbar">
          <div className="page-search-placeholder">
            Search drivers...
          </div>

          <div className="page-filter-placeholder">All Statuses</div>
        </div>

        <div className="page-table-wrapper">
          <table className="page-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Phone</th>
                <th>License Number</th>
                <th>License Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.license}>
                  <td className="table-primary">{driver.name}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.license}</td>
                  <td>{driver.expiry}</td>
                  <td>
                    <span
                      className={`page-status page-status--${driver.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {driver.status}
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

export default Drivers;