# ParcInfo — IT Asset Management System

A web application for managing a company's IT assets: hardware, licenses, and employee assignments.

## Live Demo

- **Application**: https://parcinfo-six.vercel.app
- **API**: https://parc-informatique-production.up.railway.app

The application offers two access modes:
- **Guest** — read-only access (lists, search, filters, history)
- **Admin** — full access (create, update, delete, assign)

> Public demo for portfolio purposes — full backend authentication (JWT) planned for a future iteration.

## Features

- Employee management (profiles, history of assigned equipment)
- Equipment management (hardware, serial number, status, condition)
- Assign / unassign equipment to employees
- Search and filters (type, status, condition)
- Assignment history per piece of equipment
- Guest mode (read-only) and admin mode (full access)

## Tech Stack

**Frontend**
- React
- React Router
- Tailwind CSS
- Axios
- lucide-react (icons)

**Backend**
- Java / Spring Boot
- Spring Data JPA / Hibernate
- MySQL

**Deployment**
- Frontend: Vercel
- Backend + database: Railway

## Running Locally

### Prerequisites
- Node.js 18+
- Java 21+
- MySQL

### Backend

```bash
cd parc-informatique
```

Configure `src/main/resources/application.properties` with your local MySQL credentials, then:

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`.

### Frontend

```bash
cd parc-informatique-frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and points to the local API by default.

## Repo Structure

parcinfo/

├── parc-informatique/ # Spring Boot backend

└── parc-informatique-frontend/ # React frontend


## Author

Shams Doha Kamal — [GitHub](https://github.com/shamsk0) · [LinkedIn](https://linkedin.com/in/shams-doha-kamal-0513a22a0)
