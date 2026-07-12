const {
  addFuelLog,
  getFuelLogs,
  getFuelLogById,
  deleteFuelLog,
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


const deleteFuelLogController = async (req, res) => {

  try {

    const fuel =
      await getFuelLogById(req.params.id);

    if (!fuel) {

      return res.status(404).json({
        success:false,
        message:"Fuel log not found",
      });

    }

    await deleteFuelLog(req.params.id);

    return res.status(200).json({
      success:true,
      message:"Fuel log deleted",
    });

  } catch(error) {

    console.error(error);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
    });

  }

};













module.exports = {
  createFuelLog,
  getAllFuelLogs,
  deleteFuelLogController,
};