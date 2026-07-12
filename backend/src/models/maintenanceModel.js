const pool = require("../config/db");

const createMaintenance = async (maintenance) => {
  const result = await pool.query(
    `
    INSERT INTO maintenance_logs
    (
      vehicle_id,
      maintenance_type,
      description,
      maintenance_cost,
      start_date,
      is_active
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
    `,
    [
      maintenance.vehicle_id,
      maintenance.maintenance_type,
      maintenance.description,
      maintenance.maintenance_cost,
      maintenance.start_date,
      true,
    ]
  );

  return result.rows[0];
};


const getAllMaintenance = async () => {
  const result = await pool.query(
    `
    SELECT
      m.*,
      v.vehicle_name,
      v.registration_number
    FROM maintenance_logs m
    JOIN vehicles v
      ON m.vehicle_id = v.id
    ORDER BY m.created_at DESC;
    `
  );

  return result.rows;
};



const completeMaintenance = async (id) => {
  const result = await pool.query(
    `
    UPDATE maintenance_logs
    SET
      end_date = CURRENT_DATE,
      is_active = false,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];
};









module.exports = {
  createMaintenance,
  getAllMaintenance,
  completeMaintenance,
};


