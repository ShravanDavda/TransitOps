const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");



const {
  getVehicles,
  getVehicle,
  addVehicle,
  editVehicle,
  removeVehicle,
} = require("../controllers/vehicleController");



router.get("/", authenticate, getVehicles);
router.post("/",authenticate,addVehicle);
router.get("/:id", authenticate, getVehicle);

router.put("/:id", authenticate, editVehicle);

router.delete("/:id", authenticate, removeVehicle);

module.exports = router;