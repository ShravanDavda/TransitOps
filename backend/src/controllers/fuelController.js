const {
  addFuelLog,
  getFuelLogs,
} = require("../models/fuelModel");

const {
  validateFuel,
} = require("../validations/fuelValidation");

const createFuelLog = async (req, res) => {

  try {

    const error = validateFuel(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const fuel =
      await addFuelLog(req.body);

    return res.status(201).json({
      success: true,
      fuel,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};

const getAllFuelLogs = async (req, res) => {

  try {

    const fuelLogs =
      await getFuelLogs();

    return res.status(200).json({
      success: true,
      count: fuelLogs.length,
      fuelLogs,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};

module.exports = {
  createFuelLog,
  getAllFuelLogs,
};