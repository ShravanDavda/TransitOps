const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
createFuelLog,
getAllFuelLogs,
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

module.exports = router;