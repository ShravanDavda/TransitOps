const validateTrip = (trip) => {

  if (!trip.source)
    return "Source is required";

  if (!trip.destination)
    return "Destination is required";

  if (!trip.vehicle_id)
    return "Vehicle is required";

  if (!trip.driver_id)
    return "Driver is required";

  if (!trip.cargo_weight)
    return "Cargo weight is required";

  if (!trip.planned_distance)
    return "Planned distance is required";

  return null;
};

module.exports = {
  validateTrip,
};