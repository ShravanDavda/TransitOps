// TransitOps Centralized API Simulation with LocalStorage Persistence
import {
  Vehicle,
  Driver,
  Trip,
  Maintenance,
  Expense,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_MAINTENANCE,
  INITIAL_EXPENSES
} from '../utils/constants';

import axios from "./axios";
// Key names for LocalStorage
const KEYS = {
  VEHICLES: 'transitops_vehicles',
  DRIVERS: 'transitops_drivers',
  TRIPS: 'transitops_trips',
  MAINTENANCE: 'transitops_maintenance',
  EXPENSES: 'transitops_expenses',
  AUTH_USER: 'transitops_auth_user'
};

// Initialize localStorage with seed data if not present
const initStorage = () => {
  if (!localStorage.getItem(KEYS.VEHICLES)) {
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
  }
  if (!localStorage.getItem(KEYS.DRIVERS)) {
    localStorage.setItem(KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
  }
  if (!localStorage.getItem(KEYS.TRIPS)) {
    localStorage.setItem(KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem(KEYS.MAINTENANCE)) {
    localStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
  }
  if (!localStorage.getItem(KEYS.EXPENSES)) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
  }
};

initStorage();

// Helper to simulate API delay
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper getters/setters
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const api = {
  // --- VEHICLES API ---
 getVehicles: async () => {
  const response = await axios.get("/vehicles");

  return response.data.vehicles.map((vehicle: any) => ({
    id: vehicle.id,
    registration: vehicle.registration_number,
    model: vehicle.vehicle_name,
    type: vehicle.type,
    fuelType: "Diesel",
    capacity: vehicle.max_load_capacity,
    odometer: vehicle.odometer,
    status: vehicle.status,
  }));
},

createVehicle: async (vehicle: any) => {
  const response = await axios.post("/vehicles", {
    registration_number: vehicle.registration,
    vehicle_name: vehicle.model,
    model: vehicle.model,
    type: vehicle.type,
    region: vehicle.region || "Gujarat",
    max_load_capacity: vehicle.capacity,
    odometer: vehicle.odometer,
    acquisition_cost: vehicle.acquisitionCost || 0,
    status: vehicle.status,
  });

  return response.data.vehicle;
},

updateVehicle: async (id: number, vehicle: any) => {
  const response = await axios.put(`/vehicles/${id}`, {
    registration_number: vehicle.registration,
    vehicle_name: vehicle.model,
    model: vehicle.model,
    type: vehicle.type,
    region: vehicle.region || "Gujarat",
    max_load_capacity: vehicle.capacity,
    odometer: vehicle.odometer,
    acquisition_cost: vehicle.acquisitionCost || 0,
    status: vehicle.status,
  });

  return response.data.vehicle;
},

deleteVehicle: async (id: number) => {
  await axios.delete(`/vehicles/${id}`);
  return true;
},

  // --- DRIVERS API ---
  getDrivers: async () => {
  const response = await axios.get("/drivers");

  return response.data.drivers.map((driver: any) => ({
    id: driver.id,
    name: driver.full_name,
    phone: driver.phone_number,
    licenseNumber: driver.license_number,
    licenseExpiry: driver.license_expiry,
    status: driver.status,
    completedTrips: driver.completed_trips || 0,
  }));
},

  createDriver: async (driver: any) => {
  const response = await axios.post("/drivers", {
    full_name: driver.name,
    phone_number: driver.phone,
    license_number: driver.licenseNumber,
    license_expiry: driver.licenseExpiry,
    status: driver.status,
  });

  return response.data.driver;
},

  updateDriver: async (id: number, driver: any) => {
  const response = await axios.put(`/drivers/${id}`, {
    full_name: driver.name,
    phone_number: driver.phone,
    license_number: driver.licenseNumber,
    license_expiry: driver.licenseExpiry,
    status: driver.status,
  });

  return response.data.driver;
},

  deleteDriver: async (id: number) => {
  await axios.delete(`/drivers/${id}`);
  return true;
},


  // --- TRIPS API ---
 getTrips: async () => {
  const response = await axios.get("/trips");

  return response.data.trips;
},

  createTrip: async (trip: any) => {
  const response = await axios.post("/trips", {
    source: trip.origin,
    destination: trip.destination,
    vehicle_id: trip.vehicleId,
    driver_id: trip.driverId,
    cargo_weight: trip.cargoWeight,
    planned_distance: trip.distance,
    revenue: trip.revenue,
  });

  return response.data.trip;
},

  updateTripStatus: async (id: string, newStatus: Trip['status']): Promise<Trip> => {
    await delay(300);
    const trips = getFromStorage<Trip>(KEYS.TRIPS);
    const tripIndex = trips.findIndex((t) => t.id === id);
    if (tripIndex === -1) {
      throw new Error('404: Trip not found');
    }

    const trip = trips[tripIndex];
    const prevStatus = trip.status;
    trip.status = newStatus;

    if (newStatus === 'Completed') {
      trip.actualArrival = new Date().toISOString();
    }

    // Save trip
    saveToStorage(KEYS.TRIPS, trips);

    // Sync vehicle and driver statuses dynamically based on the trip transition
    const vehicles = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const drivers = getFromStorage<Driver>(KEYS.DRIVERS);

    const vehicleIndex = vehicles.findIndex((v) => v.id === trip.vehicleId);
    const driverIndex = drivers.findIndex((d) => d.id === trip.driverId);

    if (vehicleIndex !== -1 && driverIndex !== -1) {
      const vehicle = vehicles[vehicleIndex];
      const driver = drivers[driverIndex];

      if (newStatus === 'Completed' || newStatus === 'Cancelled') {
        vehicle.status = 'Available';
        driver.status = 'Available';
        if (newStatus === 'Completed') {
          driver.completedTrips += 1;
          // increment odometer by trip distance
          vehicle.odometer += trip.distance;
        }
      } else if (newStatus === 'In Transit' || newStatus === 'Dispatched') {
        vehicle.status = 'On Trip';
        driver.status = 'On Trip';
      } else {
        // Scheduled/Draft
        vehicle.status = 'Available';
        driver.status = 'Available';
      }

      saveToStorage(KEYS.VEHICLES, vehicles);
      saveToStorage(KEYS.DRIVERS, drivers);
    }

    return trip;
  },


  // --- MAINTENANCE API ---
  getMaintenance: async () => {
  const response = await axios.get("/maintenance");

  return response.data.records;
},

  createMaintenance: async (maintenance: any) => {
  const response = await axios.post("/maintenance", {
    vehicle_id: maintenance.vehicleId,
    maintenance_type: maintenance.type,
    description: maintenance.description,
    maintenance_cost: maintenance.cost,
    start_date: maintenance.scheduledDate,
  });

  return response.data.maintenance;
},

  updateMaintenanceStatus: async (id: number) => {
  const response = await axios.patch(`/maintenance/${id}/complete`);

  return response.data.record;
},

  deleteMaintenance: async (id: string): Promise<boolean> => {
    await delay(200);
    const list = getFromStorage<Maintenance>(KEYS.MAINTENANCE);
    const filtered = list.filter((m) => m.id !== id);
    if (filtered.length === list.length) {
      throw new Error('404: Maintenance record not found');
    }
    saveToStorage(KEYS.MAINTENANCE, filtered);
    return true;
  },


  // --- EXPENSES API ---
  getExpenses: async () => {
  const response = await axios.get("/expenses");

  return response.data.expenses;
},

  createExpense: async (expense: any) => {
  const response = await axios.post("/expenses", {
    vehicle_id: expense.vehicleId,
    driver_id: expense.driverId,
    category: expense.category,
    amount: expense.amount,
    description: expense.description,
    expense_date: expense.expenseDate,
  });

  return response.data.expense;
},

  deleteExpense: async (id: number) => {
  await axios.delete(`/expenses/${id}`);
  return true;
},
};
