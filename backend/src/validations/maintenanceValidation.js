const validateMaintenance = (data) => {

  if (!data.vehicle_id)
    return "Vehicle is required";

  if (!data.maintenance_type)
    return "Maintenance Type is required";

  if (!data.maintenance_cost)
    return "Maintenance Cost is required";

  if (!data.start_date)
    return "Start Date is required";

  return null;
};

module.exports = {
  validateMaintenance,
};