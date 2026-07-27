# PetroDash

**PetroDash** is an open platform for exploring, analyzing and visualizing Argentina's public oil production data.

The platform was developed as the final undergraduate project for the **Computer Engineering** degree at the **University of Buenos Aires (UBA)**.

PetroDash aims to reduce the manual work required to analyze public oil & gas datasets by providing an interactive web interface, fast analytics and intuitive visualizations.

> **Note**
> This repository contains only the frontend application. The backend remains private as it contains ongoing research and implementation details.

---

## 🌐 Link 

**Public Deploy:** [petrodash.com](https://frontend-tau-jet-67.vercel.app/pozos)

---

## The Problem

Every month, Argentina's Secretariat of Energy publishes updated oil production data.

Although the information is publicly available, analysts usually need to perform several repetitive tasks before they can actually begin analyzing it:

- Download updated CSV files
- Clean and normalize inconsistent names
- Merge historical datasets
- Generate reports manually using Excel, Power BI or proprietary software

As a result, a significant amount of time is spent preparing data instead of analyzing it.

PetroDash streamlines this process by providing an interactive platform that enables users to explore production data immediately.

---

## Features

- 🗺️ Interactive visualization of oil fields and wells
- 📈 Production analysis over time
- 🏭 Company comparison
- 🏆 Production rankings
- 🚨 Anomaly detection
- 📊 Interactive dashboards
- 🔍 Historical data exploration
- 📂 Integration with Argentina's public energy datasets

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind
- Mapbox

### Backend *(private repository)*

- FastAPI
- Python
- DuckDB
- Pandas

### Infrastructure

- Cloudflare R2
- Render
- Vercel
- GitHub Actions

---

## Architecture

```
                 Public datasets
      (CSV Capítulo IV - Secretaría de Energía)
                     │
                     ▼
        Data cleaning & normalization
                     │
                     ▼
            Parquet + DuckDB
                     │
                     ▼
              FastAPI Backend
                     │
                 REST API
                     │
                     ▼
        Next.js + React Frontend
```

---

## Performance

The backend architecture was redesigned to use **DuckDB + Parquet**, eliminating the need for a traditional database server.

This approach achieved:

- 🚀 Up to **215× faster** analytical queries
- 💾 Storage reduced from **25 GB** of CSV files to approximately **1.9 GB**
- ☁️ Zero database server costs
- ⚡ Direct querying of partitioned Parquet files stored in Cloudflare R2

---

## Project Validation

PetroDash was not built from assumptions alone.

During development, the project was continuously refined through:

- Interviews with professionals from the oil & gas industry
- Feedback from professors and students
- Meetings with project advisors
- Iterative development across 10 agile sprints

The resulting platform addresses a real workflow observed during the analysis of Argentina's public energy datasets.

---

## Future Work

Possible future extensions include:

- Decline Curve Analysis (Arps)
- Reservoir simulation models
- Machine Learning predictions
- 3D geological visualization
- AI-assisted history matching
- Natural language querying (RAG)
- Automatic anomalies detection

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/petrodash-frontend.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Screenshots

### Data Exploration

### Individual Analysis

### Anomaly Detection

### Companies Comparison

### Production Ranking

---

## About

PetroDash was created with the goal of making Argentina's public oil production data easier to explore, understand and analyze through modern web technologies.

Although initially developed as an academic project, the platform was designed with scalability, usability and real-world workflows in mind.

---

## Contact

If you work in the energy sector or would like to discuss the project, feel free to connect via email:

| Name | Email |
| :--- | :--- |
| Davila, Rebeca | rdavila@fi.uba.ar |
| Ojeda, Daniela | dojeda@fi.uba.ar |
| Stiefkens, Julián Melmer | jstiefkens@fi.uba.ar |
| Suppes, Maximiliano | msuppes@fi.uba.ar |
