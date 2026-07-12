const express = require("express");

const router = express.Router();

const authenticate =
require("../middleware/authMiddleware");

const {
  createTripController,
  dispatchTripController,
  completeTripController,
  cancelTripController,
  getTripsController,
  getTripController,
} = require("../controllers/tripController");

router.post(
"/",
authenticate,
createTripController
);

router.patch(
  "/:id/dispatch",
  authenticate,
  dispatchTripController
);

router.patch(
  "/:id/complete",
  authenticate,
  completeTripController
);

router.patch(
  "/:id/cancel",
  authenticate,
  cancelTripController
);

router.get(
  "/",
  authenticate,
  getTripsController
);


router.get(
  "/:id",
  authenticate,
  getTripController
);




module.exports = router;