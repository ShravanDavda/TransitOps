const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
createFuelLog,
getAllFuelLogs,
deleteFuelLogController,
} = require("../controllers/fuelController");

router.post(
"/",
authenticate,
createFuelLog
);

router.get(
"/",
authenticate,
getAllFuelLogs
);

router.delete(
"/:id",
authenticate,
deleteFuelLogController
);




module.exports = router;