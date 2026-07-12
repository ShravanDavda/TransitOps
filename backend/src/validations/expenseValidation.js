const validateExpense = (data) => {

  if (!data.vehicle_id)
    return "Vehicle is required";

  if (!data.trip_id)
    return "Trip is required";

  if (!data.expense_type)
    return "Expense type is required";

  if (!data.amount)
    return "Amount is required";

  if (!data.expense_date)
    return "Expense date is required";

  return null;
};

module.exports = {
  validateExpense,
};