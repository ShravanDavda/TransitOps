const {
  createMaintenance,
  getAllMaintenance,
  completeMaintenance,
} = require("../models/maintenanceModel");

const {
  updateVehicleStatus,
} = require("../models/tripModel");

const {
  validateMaintenance,
} = require("../validations/maintenanceValidation");



const addMaintenance = async (req, res) => {

  try {

    const error = validateMaintenance(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    await updateVehicleStatus(
      req.body.vehicle_id,
      "In Shop"
    );

    const maintenance =
      await createMaintenance(req.body);

    return res.status(201).json({
      success: true,
      maintenance,
    });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}

};



const getMaintenance = async (req, res) => {

  try {

    const records =
      await getAllMaintenance();

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


const completeMaintenanceController =
async (req, res) => {

  try {

    const record =
      await completeMaintenance(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found",
      });
    }

    await updateVehicleStatus(
      record.vehicle_id,
      "Available"
    );

    return res.status(200).json({
      success: true,
      record,
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
  addMaintenance,
  getMaintenance,
  completeMaintenanceController,
};