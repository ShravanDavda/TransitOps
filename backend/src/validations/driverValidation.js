const validateDriver = (driver) => {
  if (!driver.full_name)
    return "Driver name is required";

  if (!driver.license_number)
    return "License number is required";

  if (!driver.license_category)
    return "License category is required";

  if (!driver.license_expiry_date)
    return "License expiry date is required";

  return null;
};

module.exports = {
  validateDriver,
};