const pool = require("../config/db");

const getAllDrivers = async () => {
  const result = await pool.query(
    `SELECT * FROM drivers ORDER BY id ASC`
  );

  return result.rows;
};

const createDriver = async (driver) => {
  const result = await pool.query(
    `
    INSERT INTO drivers
    (
      full_name,
      license_number,
      license_category,
      license_expiry_date,
      contact_number,
      safety_score,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
    `,
    [
      driver.full_name,
      driver.license_number,
      driver.license_category,
      driver.license_expiry_date,
      driver.contact_number,
      driver.safety_score,
      driver.status,
    ]
  );

  return result.rows[0];
};

module.exports = {
  getAllDrivers,
  createDriver,
};