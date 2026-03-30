# CRM App — MERN Stack

A full-stack CRM application built with MongoDB, Express, React, and Node.js.

## Project Structure

```
crm-app/
├── client/          # React + Vite + Tailwind CSS frontend
└── server/          # Node.js + Express + MongoDB backend
```

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

## Setup

### 1. Backend

```bash
cd server
npm install
```

Copy the example env file and fill in your MongoDB URI:

```bash
cp .env.example .env
```

`.env` defaults:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm
NODE_ENV=development
```

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so no extra CORS config is needed during development.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients` | List clients (supports `?search=`, `?status=`, `?page=`, `?limit=`) |
| GET | `/api/clients/stats` | Dashboard stats (total, active, inactive, leads) |
| GET | `/api/clients/:id` | Get single client |
| POST | `/api/clients` | Create client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |
| GET | `/api/health` | Health check |

## Client Schema

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Required, unique |
| phone | String | Optional |
| company | String | Optional |
| status | String | `active` / `inactive` / `lead` (default: `lead`) |
| notes | String | Up to 2000 chars |
| createdAt | Date | Auto-set |
| updatedAt | Date | Auto-set |

## Features

- **Dashboard** — total, active, leads, and inactive counts + recent clients list
- **Client list** — live search (name/email/company), filter by status, inline delete
- **Client detail** — full info + notes view
- **Add/Edit form** — validation with error messages
- **Responsive** — works on mobile and desktop
