# 🚛 TransitOps

TransitOps is a full-stack Fleet & Transportation Management System built to simplify vehicle operations, driver management, trip planning, maintenance tracking, fuel logging, and expense management.

The project provides a centralized dashboard for logistics companies to efficiently manage their fleet operations.

---

# Features

- Secure JWT Authentication
- Vehicle Management
- Driver Management
- Trip Management
- Vehicle Dispatch System
- Maintenance Tracking
- Fuel Log Management
- Expense Management
- Fleet Dashboard
- Analytics & Reports
- Responsive UI

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide Icons

## Backend

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- pg

---

# Project Structure

```
TransitOps
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── validations
│   │   └── utils
│   └── package.json
│
└── README.md
```

---

# Backend Modules

- Authentication
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel Logs
- Expenses
- Dashboard

---

# API Routes

## Authentication

```
POST /api/auth/login
GET  /api/auth/me
```

## Vehicles

```
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
GET    /api/vehicles/:id
```

## Drivers

```
GET    /api/drivers
POST   /api/drivers
PUT    /api/drivers/:id
DELETE /api/drivers/:id
GET    /api/drivers/:id
```

## Trips

```
GET    /api/trips
POST   /api/trips
PATCH  /api/trips/:id/dispatch
PATCH  /api/trips/:id/complete
PATCH  /api/trips/:id/cancel
```

## Maintenance

```
GET    /api/maintenance
POST   /api/maintenance
PATCH  /api/maintenance/:id/complete
```

## Fuel

```
GET    /api/fuel
POST   /api/fuel
DELETE /api/fuel/:id
```

## Expenses

```
GET    /api/expenses
POST   /api/expenses
DELETE /api/expenses/:id
```

## Dashboard

```
GET /api/dashboard
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend

```bash
cd backend
npm install
```

Create a `.env`

```
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/transitops

JWT_SECRET=your_secret_key
```

Run backend

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Database

PostgreSQL

Tables

- users
- vehicles
- drivers
- trips
- maintenance_logs
- fuel_logs
- expenses

---

# Authentication

JWT based authentication.

Include token in every protected request.

```
Authorization: Bearer <token>
```

---

# Dashboard

Dashboard provides

- Fleet Overview
- Active Trips
- Vehicle Status
- Driver Availability
- Maintenance Summary
- Fuel Efficiency
- Monthly Revenue
- Operational Cost
- Vehicle ROI

---

# Future Improvements

- GPS Tracking
- Live Vehicle Location
- Email Notifications
- Predictive Maintenance
- Role Based Access Control
- File Uploads
- Reports Export (PDF/Excel)

---

# Developed By

TransitOps Team

Built for Fleet & Transportation Management.