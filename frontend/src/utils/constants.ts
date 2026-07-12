// TransitOps Constants & Realistic Mock Data

export const VEHICLE_TYPES = ['Truck', 'Container', 'Trailer', 'Van', 'Lorry'] as const;
export const FUEL_TYPES = ['Diesel', 'CNG', 'Electric'] as const;
export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Maintenance', 'Out of Service'] as const;

export const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'] as const;
export const LICENSE_TYPES = ['HGV', 'HMV', 'MCWG', 'LMV'] as const;

export const TRIP_STATUSES = ['Draft', 'Scheduled', 'Dispatched', 'In Transit', 'Completed', 'Cancelled'] as const;
export const CARGO_DESCRIPTIONS = [
  'Electronic Goods',
  'Industrial Spare Parts',
  'Pharmaceutical Supplies',
  'Textiles & Apparels',
  'Agricultural Produce',
  'Automobile Components',
  'FMCG Packaged Goods'
] as const;

export const MAINTENANCE_TYPES = ['Routine Service', 'Engine Repair', 'Brake Replacement', 'Tire Rotation', 'Electrical Repair'] as const;
export const MAINTENANCE_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Overdue'] as const;

export const EXPENSE_CATEGORIES = ['Fuel', 'Toll', 'Repair', 'Parking', 'Other'] as const;

export const INDIAN_CITIES = ['Ahmedabad', 'Vadodara', 'Surat', 'Rajkot', 'Gandhinagar', 'Mumbai'] as const;

// Helper to get date relative to today
const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const getDateDaysHence = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export interface Vehicle {
  id: string;
  registration: string;
  type: string;
  model: string;
  capacity: number; // in metric tons
  odometer: number; // in km
  fuelType: string;
  status: typeof VEHICLE_STATUSES[number];
  lastServiceDate: string;
  nextServiceDate: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseType: typeof LICENSE_TYPES[number];
  licenseExpiry: string; // YYYY-MM-DD
  status: typeof DRIVER_STATUSES[number];
  assignedVehicle: string | null;
  completedTrips: number;
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoDescription: string;
  cargoWeight: number; // in tons
  departureTime: string; // ISO datetime string
  expectedArrival: string; // ISO datetime string
  actualArrival: string | null; // ISO datetime string or null
  distance: number; // in km
  status: typeof TRIP_STATUSES[number];
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: typeof MAINTENANCE_TYPES[number];
  description: string;
  scheduledDate: string; // YYYY-MM-DD
  completionDate: string | null; // YYYY-MM-DD
  serviceProvider: string;
  cost: number;
  status: typeof MAINTENANCE_STATUSES[number];
}

export interface Expense {
  id: string;
  vehicleId: string;
  driverId: string;
  tripId: string | null;
  category: typeof EXPENSE_CATEGORIES[number];
  fuelQuantity: number | null; // Liters
  fuelPrice: number | null; // Price per Liter
  amount: number; // Total amount in INR
  date: string; // YYYY-MM-DD;
  notes: string;
}

// Logical Seed Data
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'VEH-001',
    registration: 'GJ-01-XX-4930',
    type: 'Truck',
    model: 'Tata Prima 4930.S',
    capacity: 25,
    odometer: 112450,
    fuelType: 'Diesel',
    status: 'On Trip',
    lastServiceDate: getDateDaysAgo(35),
    nextServiceDate: getDateDaysHence(55)
  },
  {
    id: 'VEH-002',
    registration: 'MH-02-AB-5525',
    type: 'Container',
    model: 'Ashok Leyland 5525',
    capacity: 30,
    odometer: 85600,
    fuelType: 'Diesel',
    status: 'On Trip',
    lastServiceDate: getDateDaysAgo(45),
    nextServiceDate: getDateDaysHence(45)
  },
  {
    id: 'VEH-003',
    registration: 'GJ-03-YZ-8840',
    type: 'Trailer',
    model: 'BharatBenz 3523R',
    capacity: 20,
    odometer: 142100,
    fuelType: 'Diesel',
    status: 'Available',
    lastServiceDate: getDateDaysAgo(90),
    nextServiceDate: getDateDaysHence(10)
  },
  {
    id: 'VEH-004',
    registration: 'DL-01-CD-9012',
    type: 'Van',
    model: 'Mahindra Blazo X',
    capacity: 7.5,
    odometer: 34150,
    fuelType: 'CNG',
    status: 'In Maintenance',
    lastServiceDate: getDateDaysAgo(2),
    nextServiceDate: getDateDaysHence(180)
  },
  {
    id: 'VEH-005',
    registration: 'MH-43-EF-1234',
    type: 'Lorry',
    model: 'Eicher Pro 6049',
    capacity: 15,
    odometer: 98400,
    fuelType: 'Electric',
    status: 'Available',
    lastServiceDate: getDateDaysAgo(15),
    nextServiceDate: getDateDaysHence(75)
  },
  {
    id: 'VEH-006',
    registration: 'GJ-05-PQ-7788',
    type: 'Truck',
    model: 'Tata Signa 2821.T',
    capacity: 18,
    odometer: 125800,
    fuelType: 'Diesel',
    status: 'Out of Service',
    lastServiceDate: getDateDaysAgo(120),
    nextServiceDate: getDateDaysAgo(5) // Overdue service
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@transitops.com',
    licenseNumber: 'DL-1420180012345',
    licenseType: 'HMV',
    licenseExpiry: getDateDaysHence(450),
    status: 'On Trip',
    assignedVehicle: 'VEH-001',
    completedTrips: 42
  },
  {
    id: 'DRV-002',
    name: 'Sandeep Singh',
    phone: '+91 91234 56789',
    email: 'sandeep.singh@transitops.com',
    licenseNumber: 'PB-0220159988771',
    licenseType: 'HGV',
    licenseExpiry: getDateDaysHence(12), // Expiring soon (amber)
    status: 'On Trip',
    assignedVehicle: 'VEH-002',
    completedTrips: 38
  },
  {
    id: 'DRV-003',
    name: 'Amit Sharma',
    phone: '+91 88776 55443',
    email: 'amit.sharma@transitops.com',
    licenseNumber: 'MH-0120120045612',
    licenseType: 'HMV',
    licenseExpiry: getDateDaysAgo(15), // Expired (red)
    status: 'Suspended',
    assignedVehicle: null,
    completedTrips: 29
  },
  {
    id: 'DRV-004',
    name: 'Sunil Verma',
    phone: '+91 76543 21098',
    email: 'sunil.verma@transitops.com',
    licenseNumber: 'GJ-0120200055443',
    licenseType: 'LMV',
    licenseExpiry: getDateDaysHence(720),
    status: 'Available',
    assignedVehicle: null,
    completedTrips: 15
  },
  {
    id: 'DRV-005',
    name: 'Vikram Patel',
    phone: '+91 99887 76655',
    email: 'vikram.patel@transitops.com',
    licenseNumber: 'GJ-0320110034567',
    licenseType: 'HGV',
    licenseExpiry: getDateDaysHence(180),
    status: 'Available',
    assignedVehicle: 'VEH-003',
    completedTrips: 51
  },
  {
    id: 'DRV-006',
    name: 'Karan Johar',
    phone: '+91 88554 43322',
    email: 'karan.johar@transitops.com',
    licenseNumber: 'MH-1220190011223',
    licenseType: 'HMV',
    licenseExpiry: getDateDaysHence(35), // Expiring soon (amber)
    status: 'Off Duty',
    assignedVehicle: null,
    completedTrips: 22
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'TRP-001',
    origin: 'Ahmedabad',
    destination: 'Mumbai',
    vehicleId: 'VEH-001',
    driverId: 'DRV-001',
    cargoDescription: 'Electronic Goods',
    cargoWeight: 12,
    departureTime: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hrs ago
    expectedArrival: new Date(Date.now() + 6 * 3600000).toISOString(), // in 6 hrs
    actualArrival: null,
    distance: 525,
    status: 'In Transit'
  },
  {
    id: 'TRP-002',
    origin: 'Surat',
    destination: 'Ahmedabad',
    vehicleId: 'VEH-002',
    driverId: 'DRV-002',
    cargoDescription: 'Industrial Spare Parts',
    cargoWeight: 28, // high weight load
    departureTime: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hr ago
    expectedArrival: new Date(Date.now() + 3 * 3600000).toISOString(), // in 3 hrs
    actualArrival: null,
    distance: 265,
    status: 'In Transit'
  },
  {
    id: 'TRP-003',
    origin: 'Vadodara',
    destination: 'Mumbai',
    vehicleId: 'VEH-003',
    driverId: 'DRV-005',
    cargoDescription: 'Textiles & Apparels',
    cargoWeight: 15,
    departureTime: new Date(Date.now() + 24 * 3600000).toISOString(), // Tomorrow
    expectedArrival: new Date(Date.now() + 32 * 3600000).toISOString(),
    actualArrival: null,
    distance: 410,
    status: 'Scheduled'
  },
  {
    id: 'TRP-004',
    origin: 'Rajkot',
    destination: 'Gandhinagar',
    vehicleId: 'VEH-005',
    driverId: 'DRV-004',
    cargoDescription: 'Pharmaceutical Supplies',
    cargoWeight: 5,
    departureTime: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
    expectedArrival: new Date(Date.now() - 42 * 3600000).toISOString(),
    actualArrival: new Date(Date.now() - 42 * 3600000).toISOString(),
    distance: 220,
    status: 'Completed'
  }
];

export const INITIAL_MAINTENANCE: Maintenance[] = [
  {
    id: 'MNT-001',
    vehicleId: 'VEH-004',
    type: 'Engine Repair',
    description: 'Engine cylinder head gasket replacement and coolant flushing.',
    scheduledDate: getDateDaysAgo(1),
    completionDate: null,
    serviceProvider: 'Tata Authorized Workshop',
    cost: 32500,
    status: 'In Progress'
  },
  {
    id: 'MNT-002',
    vehicleId: 'VEH-006',
    type: 'Brake Replacement',
    description: 'Overdue brake pad replacement and drum lining inspection.',
    scheduledDate: getDateDaysAgo(10), // Overdue
    completionDate: null,
    serviceProvider: 'Speedy Garage',
    cost: 14500,
    status: 'Overdue'
  },
  {
    id: 'MNT-003',
    vehicleId: 'VEH-003',
    type: 'Routine Service',
    description: 'Scheduled lube change, air filter swap, and safety diagnostics.',
    scheduledDate: getDateDaysHence(8),
    completionDate: null,
    serviceProvider: 'Bosch Service Centre',
    cost: 8500,
    status: 'Scheduled'
  },
  {
    id: 'MNT-004',
    vehicleId: 'VEH-001',
    type: 'Tire Rotation',
    description: 'Full 10-wheel alignment, rotation, and balance diagnostics.',
    scheduledDate: getDateDaysAgo(25),
    completionDate: getDateDaysAgo(25),
    serviceProvider: 'Tata Authorized Workshop',
    cost: 12000,
    status: 'Completed'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'EXP-001',
    vehicleId: 'VEH-001',
    driverId: 'DRV-001',
    tripId: 'TRP-001',
    category: 'Fuel',
    fuelQuantity: 180,
    fuelPrice: 96.50,
    amount: 17370,
    date: getDateDaysAgo(1),
    notes: 'Bulk refuel at HP Petrol Pump, NH8 highway.'
  },
  {
    id: 'EXP-002',
    vehicleId: 'VEH-001',
    driverId: 'DRV-001',
    tripId: 'TRP-001',
    category: 'Toll',
    fuelQuantity: null,
    fuelPrice: null,
    amount: 1850,
    date: getDateDaysAgo(1),
    notes: 'NH8 FASTag tolls from Ahmedabad to Mumbai border.'
  },
  {
    id: 'EXP-003',
    vehicleId: 'VEH-004',
    driverId: 'DRV-003',
    tripId: null,
    category: 'Repair',
    fuelQuantity: null,
    fuelPrice: null,
    amount: 32500,
    date: getDateDaysAgo(2),
    notes: 'Breakdown repair cost for engine gasket leakage.'
  },
  {
    id: 'EXP-004',
    vehicleId: 'VEH-002',
    driverId: 'DRV-002',
    tripId: 'TRP-002',
    category: 'Parking',
    fuelQuantity: null,
    fuelPrice: null,
    amount: 450,
    date: getDateDaysAgo(3),
    notes: 'Warehouse terminal overnight parking fees.'
  }
];
