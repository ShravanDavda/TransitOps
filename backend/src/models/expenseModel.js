const pool = require("../config/db");

const addExpense = async (expense) => {
  const result = await pool.query(
    `
    INSERT INTO expenses
    (
      vehicle_id,
      trip_id,
      expense_type,
      amount,
      description,
      expense_date
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
    `,
    [
      expense.vehicle_id,
      expense.trip_id,
      expense.expense_type,
      expense.amount,
      expense.description,
      expense.expense_date,
    ]
  );

  return result.rows[0];
};


const getExpenses = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM expenses
    ORDER BY expense_date DESC;
    `
  );

  return result.rows;
};



const getExpenseById = async (id) => {

  const result = await pool.query(
    `
    SELECT *
    FROM expenses
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];

};


const deleteExpense = async (id) => {

  const result = await pool.query(
    `
    DELETE FROM expenses
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );

  return result.rows[0];

};











module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
};