


const {
  getAllVehicles,
  createVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../models/vehicleModel");





const { validateVehicle } = require("../validations/vehicleValidation");

const getVehicles = async (req, res) => {
  try {
    const vehicles = await getAllVehicles();

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addVehicle = async (req,res)=>{

try{

const error=validateVehicle(req.body);

if(error){

return res.status(400).json({
success:false,
message:error
});

}

const vehicle=await createVehicle(req.body);

return res.status(201).json({

success:true,

message:"Vehicle Added Successfully",

vehicle

});

}catch(error){

return res.status(500).json({

success:false,

message:"Internal Server Error"

});

}

};



const getVehicle = async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      vehicle,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const editVehicle = async (req, res) => {
  try {
    const error = validateVehicle(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const vehicle = await updateVehicle(req.params.id, req.body);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



const removeVehicle = async (req, res) => {
  try {
    const vehicle = await deleteVehicle(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};






module.exports = {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  removeVehicle,
};