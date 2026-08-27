# Medicore - Project Architecture Principles

## 📁 Project Overview

This document defines the architectural principles and folder structure for the Medicore hospital management application. Following these guidelines ensures consistency, maintainability, and scalability across the codebase.

**Tech Stack**:
- **Frontend**: React + Vite (JavaScript)
- **Backend**: Node.js + Express.js (JavaScript)
- **Database**: PostgreSQL
- **Package Manager**: npm or yarn



## 🏗️ Root Directory Structure


## 🏗️ Root Directory Structure
medicore/
├── client/ # React Frontend
│ ├── public/ # Static assets
│ │ └── index.html
│ ├── src/
│ │ ├── components/ # UI components (dumb/presentational)
│ │ ├── containers/ # Logic & state management (smart components)
│ │ ├── shared/ # Reusable UI elements
│ │ ├── hooks/ # Custom React hooks
│ │ ├── services/ # API service layer
│ │ ├── contexts/ # React Context providers
│ │ ├── utils/ # Utility functions
│ │ ├── constants/ # Application constants
│ │ ├── App.tsx # Main app component
│ │ └── main.tsx # Entry point
│ ├── package.json
│ ├── vite.config.js
│ └── .eslintrc.js
│
├── server/ # Node.js Backend
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ ├── controllers/ # Route controllers (request handlers)
│ │ ├── services/ # Business logic layer
│ │ ├── models/ # Database models (if using ORM)
│ │ ├── repositories/ # Data access layer (raw SQL/queries)
│ │ ├── middlewares/ # Express middlewares
│ │ ├── routes/ # API route definitions
│ │ ├── validators/ # Request validation schemas
│ │ ├── utils/ # Utility functions
│ │ ├── constants/ # Application constants
│ │ ├── types/ # JSDoc types (optional)
│ │ └── app.js # Express app setup
│ ├── package.json
│ └── .env.example # Environment variables template
│