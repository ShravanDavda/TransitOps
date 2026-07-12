const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
  addMaintenance,
  getMaintenance,
  completeMaintenanceController,
} = require("../controllers/maintenanceController");

router.post(
  "/",
  authenticate,
  addMaintenance
);

router.get(
  "/",
  authenticate,
  getMaintenance
);

router.patch(
  "/:id/complete",
  authenticate,
  completeMaintenanceController
);

module.exports = router;