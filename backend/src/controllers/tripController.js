const {
  getAvailableVehicle,
  getAvailableDriver,
  createTrip,
  getTripById,
  dispatchTrip,
  updateVehicleStatus,
  updateDriverStatus,
  completeTrip,
  cancelTrip,
  getAllTrips,
  getTripDetails,
} = require("../models/tripModel");

const pool = require("../config/db");

const {
  validateTrip,
} = require("../validations/tripValidation");

const {
  VEHICLE_STATUS,
  DRIVER_STATUS,
} = require("../constants/status");





const createTripController = async (req, res) => {

  try {

    const error = validateTrip(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const vehicle =
      await getAvailableVehicle(req.body.vehicle_id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const driver =
      await getAvailableDriver(req.body.driver_id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
        if (
      vehicle.status !==
      VEHICLE_STATUS.AVAILABLE
    ) {
      return res.status(400).json({
        success: false,
        message: "Vehicle not available",
      });
    }

    if (
      driver.status !==
      DRIVER_STATUS.AVAILABLE
    ) {
      return res.status(400).json({
        success: false,
        message: "Driver not available",
      });
    }
        if (
      req.body.cargo_weight >
      vehicle.max_load_capacity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cargo exceeds vehicle capacity",
      });
    }
        const trip =
      await createTrip(req.body);

    return res.status(201).json({
      success: true,
      message: "Trip created",
      trip,
    });

  } catch {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};


const dispatchTripController = async (req, res) => {
  

try {

    
    const trip = await getTripById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only Draft trips can be dispatched",
      });
    }

    await updateVehicleStatus(
      trip.vehicle_id,
      "On Trip"
    );

    await updateDriverStatus(
      trip.driver_id,
      "On Trip"
    );


        const updatedTrip =
      await dispatchTrip(trip.id);

    return res.status(200).json({
      success: true,
      message: "Trip dispatched successfully",
      trip: updatedTrip,
    });



      } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const completeTripController = async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.status !== "Dispatched") {
      return res.status(400).json({
        success: false,
        message: "Trip is not active",
      });
    }


    await updateVehicleStatus(
      trip.vehicle_id,
      "Available"
    );

    await updateDriverStatus(
      trip.driver_id,
      "Available"
    );


    const updatedTrip =
      await completeTrip(
        trip.id,
        req.body.end_odometer,
        req.body.actual_distance,
        req.body.fuel_consumed
      );



    return res.status(200).json({
      success: true,
      message: "Trip completed",
      trip: updatedTrip,
    });

  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const cancelTripController = async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Only Draft trips can be cancelled",
      });
    }

    const cancelledTrip = await cancelTrip(null, trip.id);

    return res.status(200).json({
      success: true,
      message: "Trip cancelled successfully",
      trip: cancelledTrip,
    });
  } catch (error) {
    console.error(error);   // <-- add this

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTripsController = async (req, res) => {
  try {
    const trips = await getAllTrips();

    return res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


const getTripController = async (req, res) => {

  try {

    const trip = await getTripDetails(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      trip,
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
  createTripController,
  dispatchTripController,
  completeTripController,
  cancelTripController,
  getTripsController,
  getTripController,
};




