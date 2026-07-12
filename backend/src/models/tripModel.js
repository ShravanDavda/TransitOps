const pool = require("../config/db");

const getAvailableVehicle = async (vehicleId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM vehicles
    WHERE id = $1
    `,
    [vehicleId]
  );

  return result.rows[0];
};

const getAvailableDriver = async (driverId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM drivers
    WHERE id = $1
    `,
    [driverId]
  );

  return result.rows[0];
};

const createTrip = async (trip) => {
  const result = await pool.query(
    `
    INSERT INTO trips
    (
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight,
      planned_distance,
      revenue,
      status
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
    [
      trip.source,
      trip.destination,
      trip.vehicle_id,
      trip.driver_id,
      trip.cargo_weight,
      trip.planned_distance,
      trip.revenue,
      "Draft",
    ]
  );

  return result.rows[0];
};

const getTripById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM trips WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};


const dispatchTrip = async (id) => {
  const result = await pool.query(
    `
    UPDATE trips
    SET
      status='Dispatched',
      dispatch_date=CURRENT_TIMESTAMP,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};


const updateVehicleStatus = async (
  vehicleId,
  status
) => {
  await pool.query(
    `
    UPDATE vehicles
    SET
      status=$1,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=$2
    `,
    [status, vehicleId]
  );
};



const updateDriverStatus = async (
  driverId,
  status
) => {
  await pool.query(
    `
    UPDATE drivers
    SET
      status=$1,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=$2
    `,
    [status, driverId]
  );
};


const completeTrip = async (
  id,
  endOdometer,
  actualDistance,
  fuelConsumed
) => {
  const result = await pool.query(
    `
    UPDATE trips
    SET
      status='Completed',
      completion_date=CURRENT_TIMESTAMP,
      end_odometer=$1,
      actual_distance=$2,
      fuel_consumed=$3,
      updated_at=CURRENT_TIMESTAMP
    WHERE id=$4
    RETURNING *;
    `,
    [
      endOdometer,
      actualDistance,
      fuelConsumed,
      id,
    ]
  );

  return result.rows[0];
};

const cancelTrip = async (_, id) => {
  const result = await pool.query(
        `
    UPDATE trips
    SET
      status='Cancelled',
      updated_at=CURRENT_TIMESTAMP
    WHERE id=$1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};


const getAllTrips = async () => {
  const result = await pool.query(
    `
    SELECT
      t.id,
      t.source,
      t.destination,
      t.status,
      t.cargo_weight,
      t.planned_distance,
      t.actual_distance,
      t.revenue,
      t.created_at,

      v.vehicle_name,
      v.registration_number,

      d.full_name AS driver_name

    FROM trips t

    JOIN vehicles v
      ON t.vehicle_id = v.id

    JOIN drivers d
      ON t.driver_id = d.id

    ORDER BY t.created_at DESC
    `
  );

  return result.rows;
};



const getTripDetails = async (id) => {
  const result = await pool.query(
    `
    SELECT
      t.*,

      v.vehicle_name,
      v.registration_number,
      v.type,

      d.full_name,
      d.license_number

    FROM trips t

    JOIN vehicles v
      ON t.vehicle_id = v.id

    JOIN drivers d
      ON t.driver_id = d.id

    WHERE t.id = $1
    `,
    [id]
  );

  return result.rows[0];
};











module.exports = {
  getAvailableVehicle,
  getAvailableDriver,
  createTrip,
  getTripById,
  dispatchTrip,
  updateVehicleStatus,
  updateDriverStatus,
  completeTrip,
  cancelTrip,
  getAllTrips,
  getTripDetails,
};