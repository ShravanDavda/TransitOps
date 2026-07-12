CREATE DATABASE transitops;
CREATE TYPE user_role AS ENUM (
'fleet_manager',
'dispatcher',
'safety_officer',
'financial_analyst'
);

CREATE TYPE vehicle_status AS ENUM (
'Available',
'On Trip',
'In Shop',
'Retired'
);

CREATE TYPE driver_status AS ENUM (
'Available',
'On Trip',
'Off Duty',
'Suspended'
);

CREATE TYPE trip_status AS ENUM (
'Draft',
'Dispatched',
'Completed',
'Cancelled'
);

CREATE TYPE expense_type AS ENUM (
'Fuel',
'Maintenance',
'Toll',
'Other'
);



CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role user_role NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,

    registration_number VARCHAR(50) UNIQUE NOT NULL,

    vehicle_name VARCHAR(100) NOT NULL,

    model VARCHAR(100),

    type VARCHAR(50) NOT NULL,

    region VARCHAR(100),

    max_load_capacity DECIMAL(10,2) NOT NULL,

    odometer DECIMAL(10,2) DEFAULT 0,

    acquisition_cost DECIMAL(12,2) NOT NULL,

    status vehicle_status DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    license_number VARCHAR(100) UNIQUE NOT NULL,

    license_category VARCHAR(20) NOT NULL,

    license_expiry_date DATE NOT NULL,

    contact_number VARCHAR(20),

    safety_score DECIMAL(5,2) DEFAULT 100,

    status driver_status DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE trips (
    id SERIAL PRIMARY KEY,

    source VARCHAR(150) NOT NULL,

    destination VARCHAR(150) NOT NULL,

    vehicle_id INT NOT NULL,

    driver_id INT NOT NULL,

    cargo_weight DECIMAL(10,2) NOT NULL,

    planned_distance DECIMAL(10,2) NOT NULL,

    actual_distance DECIMAL(10,2),

    revenue DECIMAL(12,2) DEFAULT 0,

    start_odometer DECIMAL(10,2),

    end_odometer DECIMAL(10,2),

    fuel_consumed DECIMAL(10,2),

    status trip_status DEFAULT 'Draft',

    dispatch_date TIMESTAMP,

    completion_date TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trip_vehicle
        FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_trip_driver
        FOREIGN KEY(driver_id)
        REFERENCES drivers(id)
        ON DELETE RESTRICT
);


CREATE TABLE maintenance_logs (

    id SERIAL PRIMARY KEY,

    vehicle_id INT NOT NULL,

    maintenance_type VARCHAR(100) NOT NULL,

    description TEXT,

    maintenance_cost DECIMAL(12,2) DEFAULT 0,

    start_date DATE NOT NULL,

    end_date DATE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_maintenance_vehicle
        FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT
);



CREATE TABLE fuel_logs (

    id SERIAL PRIMARY KEY,

    vehicle_id INT NOT NULL,

    trip_id INT,

    liters DECIMAL(10,2) NOT NULL,

    cost DECIMAL(12,2) NOT NULL,

    fuel_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fuel_vehicle
        FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_fuel_trip
        FOREIGN KEY(trip_id)
        REFERENCES trips(id)
        ON DELETE SET NULL
);


CREATE TABLE expenses (

    id SERIAL PRIMARY KEY,

    vehicle_id INT NOT NULL,

    trip_id INT,

    expense_type expense_type NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    description TEXT,

    expense_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_expense_vehicle
        FOREIGN KEY(vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_expense_trip
        FOREIGN KEY(trip_id)
        REFERENCES trips(id)
        ON DELETE SET NULL
);