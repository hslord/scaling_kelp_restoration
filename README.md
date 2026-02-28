# Kelp Restoration Model

Interactive map for visualizing kelp biomass along the California coast.

## Prerequisites

- Node.js v18+

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Setup Script

Alternatively, run the setup script which checks prerequisites, installs dependencies, and verifies the build:

```bash
./setup.sh
```

## CSV Format

The app loads `public/lat_lon_current_past.csv` by default. You can also drag-and-drop your own CSV with these columns:

| Column | Description |
|---|---|
| `lat` | Latitude |
| `lon` | Longitude |
| `kelp_biomass_kg` | Current kelp biomass (kg) |
| `kelp_biomass_kg_past` | Historical kelp biomass (kg) |
