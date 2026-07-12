const validateFuel = (data) => {

  if (!data.vehicle_id)
    return "Vehicle is required";

  if (!data.trip_id)
    return "Trip is required";

  if (!data.liters)
    return "Liters is required";

  if (!data.cost)
    return "Fuel cost is required";

  if (!data.fuel_date)
    return "Fuel date is required";

  return null;
};

module.exports = {
  validateFuel,
};