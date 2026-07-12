const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TransitOps Backend Running",
  });
});

module.exports = app;