const {
  getAllDrivers,
  createDriver,
} = require("../models/driverModel");

const {
  validateDriver,
} = require("../validations/driverValidation");

const getDrivers = async (req, res) => {
  try {
    const drivers = await getAllDrivers();

    return res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addDriver = async (req, res) => {
  try {
    const error = validateDriver(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const driver = await createDriver(req.body);

    return res.status(201).json({
      success: true,
      message: "Driver added successfully",
      driver,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getDrivers,
  addDriver,
};