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
  getVehicles: async (): Promise<Vehicle[]> => {
    await delay(200);
    return getFromStorage<Vehicle>(KEYS.VEHICLES);
  },

  createVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    await delay(300);
    const list = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const newId = `VEH-0${list.length + 1}`;
    
    // Validation
    if (!vehicle.registration || !vehicle.model || !vehicle.type) {
      throw new Error('400: Required fields are missing');
    }
    if (vehicle.capacity <= 0 || vehicle.odometer < 0) {
      throw new Error('400: Capacity and odometer must be positive values');
    }

    const newVehicle: Vehicle = {
      ...vehicle,
      id: newId
    };
    
    list.push(newVehicle);
    saveToStorage(KEYS.VEHICLES, list);
    return newVehicle;
  },

  updateVehicle: async (id: string, updated: Partial<Vehicle>): Promise<Vehicle> => {
    await delay(250);
    const list = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const index = list.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error('404: Vehicle not found');
    }

    list[index] = { ...list[index], ...updated };
    saveToStorage(KEYS.VEHICLES, list);
    return list[index];
  },

  deleteVehicle: async (id: string): Promise<boolean> => {
    await delay(200);
    const list = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const filtered = list.filter((v) => v.id !== id);
    if (filtered.length === list.length) {
      throw new Error('404: Vehicle not found');
    }
    saveToStorage(KEYS.VEHICLES, filtered);
    return true;
  },


  // --- DRIVERS API ---
  getDrivers: async (): Promise<Driver[]> => {
    await delay(200);
    return getFromStorage<Driver>(KEYS.DRIVERS);
  },

  createDriver: async (driver: Omit<Driver, 'id' | 'completedTrips'>): Promise<Driver> => {
    await delay(300);
    const list = getFromStorage<Driver>(KEYS.DRIVERS);
    const newId = `DRV-0${list.length + 1}`;

    if (!driver.name || !driver.phone || !driver.licenseNumber) {
      throw new Error('400: Required fields are missing');
    }

    const newDriver: Driver = {
      ...driver,
      id: newId,
      completedTrips: 0
    };

    list.push(newDriver);
    saveToStorage(KEYS.DRIVERS, list);
    return newDriver;
  },

  updateDriver: async (id: string, updated: Partial<Driver>): Promise<Driver> => {
    await delay(250);
    const list = getFromStorage<Driver>(KEYS.DRIVERS);
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error('404: Driver not found');
    }

    list[index] = { ...list[index], ...updated };
    saveToStorage(KEYS.DRIVERS, list);
    return list[index];
  },

  deleteDriver: async (id: string): Promise<boolean> => {
    await delay(200);
    const list = getFromStorage<Driver>(KEYS.DRIVERS);
    const filtered = list.filter((d) => d.id !== id);
    if (filtered.length === list.length) {
      throw new Error('404: Driver not found');
    }
    saveToStorage(KEYS.DRIVERS, filtered);
    return true;
  },


  // --- TRIPS API ---
  getTrips: async (): Promise<Trip[]> => {
    await delay(300);
    return getFromStorage<Trip>(KEYS.TRIPS);
  },

  createTrip: async (trip: Omit<Trip, 'id' | 'actualArrival'>): Promise<Trip> => {
    await delay(400);
    const tripsList = getFromStorage<Trip>(KEYS.TRIPS);
    const vehicles = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const drivers = getFromStorage<Driver>(KEYS.DRIVERS);

    const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
    const driver = drivers.find((d) => d.id === trip.driverId);

    // Business Validation Rules (PDF Section 15 & 7)
    if (!trip.origin || !trip.destination || !trip.vehicleId || !trip.driverId || !trip.cargoDescription) {
      throw new Error('400: Required fields are missing');
    }
    if (!vehicle) {
      throw new Error('404: Assigned vehicle not found');
    }
    if (!driver) {
      throw new Error('404: Assigned driver not found');
    }

    // 1. Vehicle in maintenance cannot be assigned
    if (vehicle.status === 'In Maintenance') {
      throw new Error('400: Selected vehicle is In Maintenance and cannot be assigned to a trip');
    }
    // 2. Out of service vehicle cannot be assigned
    if (vehicle.status === 'Out of Service') {
      throw new Error('400: Selected vehicle is Out of Service');
    }
    // 3. Vehicle already on active trip
    if (vehicle.status === 'On Trip') {
      throw new Error('400: Selected vehicle is already on another active trip');
    }
    // 4. Driver with expired license cannot be assigned
    const today = new Date();
    if (new Date(driver.licenseExpiry) < today) {
      throw new Error('400: Selected driver has an expired license and is ineligible for dispatch');
    }
    // 5. Unavailable driver (Off Duty, Suspended)
    if (driver.status === 'Suspended') {
      throw new Error('400: Selected driver is Suspended');
    }
    if (driver.status === 'Off Duty') {
      throw new Error('400: Selected driver is Off Duty');
    }
    // 6. Driver already on active trip
    if (driver.status === 'On Trip') {
      throw new Error('400: Selected driver is already assigned to another active trip');
    }
    // 7. Cargo weight cannot exceed vehicle capacity
    if (trip.cargoWeight > vehicle.capacity) {
      throw new Error(`400: Cargo weight (${trip.cargoWeight}T) exceeds the vehicle's max capacity (${vehicle.capacity}T)`);
    }

    const newId = `TRP-0${tripsList.length + 1}`;
    const newTrip: Trip = {
      ...trip,
      id: newId,
      actualArrival: null
    };

    // Update statuses dynamically to maintain logical consistency (Section 24)
    if (trip.status === 'In Transit' || trip.status === 'Dispatched') {
      vehicle.status = 'On Trip';
      driver.status = 'On Trip';
    } else if (trip.status === 'Scheduled') {
      // Just keep them, but link them
    }

    // Save
    tripsList.push(newTrip);
    saveToStorage(KEYS.TRIPS, tripsList);

    // Update associated vehicles & drivers list
    const updatedVehicles = vehicles.map((v) => (v.id === vehicle.id ? vehicle : v));
    const updatedDrivers = drivers.map((d) => (d.id === driver.id ? driver : d));
    saveToStorage(KEYS.VEHICLES, updatedVehicles);
    saveToStorage(KEYS.DRIVERS, updatedDrivers);

    return newTrip;
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
  getMaintenance: async (): Promise<Maintenance[]> => {
    await delay(250);
    return getFromStorage<Maintenance>(KEYS.MAINTENANCE);
  },

  createMaintenance: async (maint: Omit<Maintenance, 'id'>): Promise<Maintenance> => {
    await delay(300);
    const list = getFromStorage<Maintenance>(KEYS.MAINTENANCE);
    const vehicles = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const vehicle = vehicles.find((v) => v.id === maint.vehicleId);

    if (!maint.vehicleId || !maint.type || !maint.scheduledDate) {
      throw new Error('400: Required fields are missing');
    }
    if (!vehicle) {
      throw new Error('404: Vehicle not found');
    }

    // A vehicle assigned to an active trip should not go in maintenance
    if (vehicle.status === 'On Trip') {
      throw new Error('400: Selected vehicle is currently on a trip and cannot enter maintenance yet');
    }

    const newId = `MNT-0${list.length + 1}`;
    const newMaint: Maintenance = {
      ...maint,
      id: newId
    };

    list.push(newMaint);
    saveToStorage(KEYS.MAINTENANCE, list);

    // Dynamic sync: if maintenance status is In Progress, mark vehicle as "In Maintenance" (Section 5 & 8)
    if (maint.status === 'In Progress') {
      vehicle.status = 'In Maintenance';
      const updatedVehicles = vehicles.map((v) => (v.id === vehicle.id ? vehicle : v));
      saveToStorage(KEYS.VEHICLES, updatedVehicles);
    }

    return newMaint;
  },

  updateMaintenanceStatus: async (id: string, status: Maintenance['status']): Promise<Maintenance> => {
    await delay(250);
    const list = getFromStorage<Maintenance>(KEYS.MAINTENANCE);
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error('404: Maintenance record not found');
    }

    const maint = list[index];
    maint.status = status;
    if (status === 'Completed') {
      maint.completionDate = new Date().toISOString().split('T')[0];
    }

    saveToStorage(KEYS.MAINTENANCE, list);

    // Sync vehicle status
    const vehicles = getFromStorage<Vehicle>(KEYS.VEHICLES);
    const vIndex = vehicles.findIndex((v) => v.id === maint.vehicleId);
    if (vIndex !== -1) {
      const vehicle = vehicles[vIndex];
      if (status === 'In Progress') {
        vehicle.status = 'In Maintenance';
        vehicle.lastServiceDate = new Date().toISOString().split('T')[0];
      } else if (status === 'Completed') {
        vehicle.status = 'Available';
        vehicle.lastServiceDate = new Date().toISOString().split('T')[0];
        // Schedule next service in 180 days
        const nextSec = new Date();
        nextSec.setDate(nextSec.getDate() + 180);
        vehicle.nextServiceDate = nextSec.toISOString().split('T')[0];
      } else {
        // Scheduled/Overdue but not active yet
        if (vehicle.status === 'In Maintenance') {
          vehicle.status = 'Available';
        }
      }
      saveToStorage(KEYS.VEHICLES, vehicles);
    }

    return maint;
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
  getExpenses: async (): Promise<Expense[]> => {
    await delay(250);
    return getFromStorage<Expense>(KEYS.EXPENSES);
  },

  createExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    await delay(300);
    const list = getFromStorage<Expense>(KEYS.EXPENSES);

    if (!expense.vehicleId || !expense.driverId || !expense.category || expense.amount <= 0) {
      throw new Error('400: Invalid or missing fields for expense creation');
    }

    const newId = `EXP-0${list.length + 1}`;
    const newExpense: Expense = {
      ...expense,
      id: newId
    };

    list.push(newExpense);
    saveToStorage(KEYS.EXPENSES, list);
    return newExpense;
  },

  deleteExpense: async (id: string): Promise<boolean> => {
    await delay(200);
    const list = getFromStorage<Expense>(KEYS.EXPENSES);
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length === list.length) {
      throw new Error('404: Expense record not found');
    }
    saveToStorage(KEYS.EXPENSES, filtered);
    return true;
  }
};
