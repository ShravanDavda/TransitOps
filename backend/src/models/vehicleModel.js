const pool = require("../config/db");

const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT * FROM vehicles ORDER BY id ASC`
  );

  return result.rows;
};





const createVehicle = async (vehicle) => {

  const result = await pool.query(

`INSERT INTO vehicles
(
registration_number,
vehicle_name,
model,
type,
region,
max_load_capacity,
odometer,
acquisition_cost,
status
)

VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9)

RETURNING *`,

[
vehicle.registration_number,
vehicle.vehicle_name,
vehicle.model,
vehicle.type,
vehicle.region,
vehicle.max_load_capacity,
vehicle.odometer,
vehicle.acquisition_cost,
vehicle.status
]

);

return result.rows[0];

};

const getVehicleById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

const updateVehicle = async (id, vehicle) => {
  const result = await pool.query(
    `
    UPDATE vehicles
    SET
      registration_number = $1,
      vehicle_name = $2,
      model = $3,
      type = $4,
      region = $5,
      max_load_capacity = $6,
      odometer = $7,
      acquisition_cost = $8,
      status = $9,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $10
    RETURNING *;
    `,
    [
      vehicle.registration_number,
      vehicle.vehicle_name,
      vehicle.model,
      vehicle.type,
      vehicle.region,
      vehicle.max_load_capacity,
      vehicle.odometer,
      vehicle.acquisition_cost,
      vehicle.status,
      id,
    ]
  );

  return result.rows[0];
};

const deleteVehicle = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM vehicles
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};






module.exports = {
  getAllVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};