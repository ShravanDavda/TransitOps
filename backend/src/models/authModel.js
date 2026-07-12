const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      email,
      role,
      is_active
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
};