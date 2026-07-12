const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
  getDrivers,
  addDriver,
} = require("../controllers/driverController");

router.get("/", authenticate, getDrivers);

router.post("/", authenticate, addDriver);

module.exports = router;