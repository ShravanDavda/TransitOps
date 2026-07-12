const pool = require("../config/db");


const getDashboardCounts = async () => {

  const result = await pool.query(`
    SELECT

      (SELECT COUNT(*) FROM vehicles) AS active_vehicles,

      (SELECT COUNT(*) FROM vehicles
       WHERE status='Available') AS available_vehicles,

      (SELECT COUNT(*) FROM vehicles
       WHERE status='In Shop') AS maintenance_vehicles,

      (SELECT COUNT(*) FROM trips
       WHERE status='Dispatched') AS active_trips,

      (SELECT COUNT(*) FROM trips
       WHERE status='Draft') AS pending_trips,

      (SELECT COUNT(*) FROM drivers
       WHERE status='Available') AS drivers_on_duty

  `);

  return result.rows[0];

};


const getFleetUtilization = async () => {

  const result = await pool.query(`

    SELECT
      ROUND(
      (
        COUNT(*) FILTER (WHERE status='On Trip')::numeric
        /
        NULLIF(COUNT(*),0)
      )*100,
      2
      ) AS utilization

    FROM vehicles;

  `);

  return result.rows[0];

};


const getRecentTrips = async () => {

  const result = await pool.query(`

    SELECT

      t.id,

      t.source,

      t.destination,

      t.status,

      v.vehicle_name,

      d.full_name

    FROM trips t

    JOIN vehicles v
    ON t.vehicle_id=v.id

    JOIN drivers d
    ON t.driver_id=d.id

    ORDER BY t.created_at DESC

    LIMIT 5;

  `);

  return result.rows;

};

const getVehicleStatusSummary = async () => {

  const result = await pool.query(`

    SELECT

      status,

      COUNT(*) total

    FROM vehicles

    GROUP BY status;

  `);

  return result.rows;

};


const getFuelEfficiency = async () => {

  const result = await pool.query(`
    SELECT
      ROUND(
        SUM(actual_distance) /
        NULLIF(SUM(fuel_consumed),0),
        2
      ) AS fuel_efficiency
    FROM trips
    WHERE status='Completed';
  `);

  return result.rows[0];

};



const getOperationalCost = async () => {

  const result = await pool.query(`
    SELECT

      (
        COALESCE(
          (SELECT SUM(cost) FROM fuel_logs),0
        )

        +

        COALESCE(
          (SELECT SUM(amount) FROM expenses),0
        )

        +

        COALESCE(
          (SELECT SUM(maintenance_cost)
          FROM maintenance_logs),0
        )

      ) AS operational_cost;
  `);

  return result.rows[0];

};



const getVehicleROI = async () => {

  const result = await pool.query(`
    SELECT

      ROUND(

      (

      SUM(t.revenue)

      -

      (
        COALESCE(
          (SELECT SUM(cost)
          FROM fuel_logs),0)

        +

        COALESCE(
          (SELECT SUM(amount)
          FROM expenses),0)

        +

        COALESCE(
          (SELECT SUM(maintenance_cost)
          FROM maintenance_logs),0)

      )

      )

      /

      NULLIF(
      SUM(v.acquisition_cost),0
      )

      *100,

      2

      ) AS roi

    FROM vehicles v

    LEFT JOIN trips t

    ON v.id=t.vehicle_id;

  `);

  return result.rows[0];

};



const getMonthlyRevenue = async () => {

  const result = await pool.query(`
    SELECT

      DATE_TRUNC('month',completion_date)
      AS month,

      SUM(revenue)
      AS revenue

    FROM trips

    WHERE status='Completed'

    GROUP BY month

    ORDER BY month;

  `);

  return result.rows;

};


const getCostliestVehicles = async () => {

  const result = await pool.query(`
    SELECT

      v.vehicle_name,

      COALESCE(SUM(f.cost),0)
      +

      COALESCE(SUM(m.maintenance_cost),0)
      AS total_cost

    FROM vehicles v

    LEFT JOIN fuel_logs f
    ON v.id=f.vehicle_id

    LEFT JOIN maintenance_logs m
    ON v.id=m.vehicle_id

    GROUP BY v.vehicle_name

    ORDER BY total_cost DESC

    LIMIT 5;

  `);

  return result.rows;

};















module.exports = {

getDashboardCounts,

getFleetUtilization,

getRecentTrips,

getVehicleStatusSummary,

getFuelEfficiency,

getOperationalCost,

getVehicleROI,

getMonthlyRevenue,

getCostliestVehicles,

};