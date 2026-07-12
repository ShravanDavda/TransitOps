const pool = require("../config/db");

const addFuelLog = async (fuel) => {
  const result = await pool.query(
    `
    INSERT INTO fuel_logs
    (
      vehicle_id,
      trip_id,
      liters,
      cost,
      fuel_date
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *;
    `,
    [
      fuel.vehicle_id,
      fuel.trip_id,
      fuel.liters,
      fuel.cost,
      fuel.fuel_date,
    ]
  );

  return result.rows[0];
};

const getFuelLogs = async () => {
  const result = await pool.query(
    `
    SELECT
      f.*,
      v.vehicle_name,
      v.registration_number
    FROM fuel_logs f
    JOIN vehicles v
      ON f.vehicle_id = v.id
    ORDER BY f.fuel_date DESC;
    `
  );

  return result.rows;
};

const getFuelLogById = async (id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM fuel_logs
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];

};


const deleteFuelLog = async (id) => {

  const result = await pool.query(
    `
    DELETE FROM fuel_logs
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];

};












module.exports = {
  addFuelLog,
  getFuelLogs,
  getFuelLogById,
  deleteFuelLog,
};