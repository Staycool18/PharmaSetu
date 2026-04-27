# PharmaSetu

A full‑stack healthcare & pharmacy management platform that connects users and pharmacies in a single system. PharmaSetu enables medicine browsing, cart management, secure authentication, order placement, and pharmacy-side medicine administration.

Status: Work in progress — prototype for core user & pharmacy flows.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Environment / Configuration](#environment--configuration)
- [Authentication Flow](#authentication-flow)
- [API Highlights](#api-highlights)
- [Development & Testing](#development--testing)
- [Deployment & Future Work](#deployment--future-work)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Key Features

User (customer) capabilities:
- Register / login (JWT-based authentication)
- Browse pharmacies and medicines
- Add medicines to cart and checkout (mock payment)
- Place orders and view order history
- Password reset (token-based)

Pharmacy capabilities:
- Register / login
- Pharmacy dashboard for inventory management
- CRUD operations for medicines
- View and manage incoming orders
- Role-based access control (USER / PHARMACY)

Security:
- JWT authentication
- Role-based authorization
- Protected REST APIs
- Secure password handling

---

## Architecture & Tech Stack

- Frontend: React (Vite), JavaScript (ES6+), CSS, Axios
- Backend: Spring Boot, Spring Security (JWT), Spring Data JPA
- Database: MySQL
- API: RESTful endpoints
- Recommended: Docker + Docker Compose for containerized deployment (future)

---

## Project structure

PharmaSetu/
├── backend/              # Spring Boot application (Java)
│   ├── src/main/java
│   ├── src/main/resources
│   │   └── application.properties
│   ├── src/test/java
│   └── pom.xml
├── frontend/             # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md

(Adjust the tree to match additional folders you may have, e.g., docs/, scripts/, docker/.)

---

## Prerequisites

- Java 17+ (or the Java version specified in backend pom.xml)
- Maven 3.6+
- Node.js 16+ and npm (or yarn)
- MySQL server
- (Optional) Docker & Docker Compose

---

## Quick Start

Start the backend, configure DB, then run the frontend.

### Backend (Spring Boot)

1. Open the `backend/` directory.
2. Configure MySQL connection in `src/main/resources/application.properties` (example below).
3. Build and run:

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Default backend URL (development):
http://localhost:8083

### Frontend (React + Vite)

1. Open the `frontend/` directory.
2. Install dependencies and run dev server:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL (development):
http://localhost:5173

---

## Environment / Configuration

Example Spring Boot properties (backend/src/main/resources/application.properties):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pharmasetu_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

# server port
server.port=8083

# JWT / security settings (example)
app.jwtSecret=ReplaceWithASecretKey
app.jwtExpirationMs=86400000
```

Frontend environment (example .env or Vite config):
```
VITE_API_BASE_URL=http://localhost:8083/api
```

Important: Never commit secrets or production credentials. Use environment variables or a secrets manager.

---

## Authentication Flow

1. User logs in via `/auth/login`.
2. Server issues JWT token on successful authentication.
3. Frontend stores token in secure storage (e.g., localStorage or better: httpOnly cookie if moved to production).
4. Requests to protected endpoints include `Authorization: Bearer <token>`.
5. Logout clears the stored token.

---

## API Highlights

Common endpoints (add or adjust to match your actual controllers):

- POST /auth/register-user
- POST /auth/register-pharmacy
- POST /auth/login
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /pharmacy/**
- POST /medicine/**
- POST /order/**

(Refer to your backend controllers for exact routes, request/response shapes, and required payloads.)

---

## Development & Testing

- Backend:
  - Run unit and integration tests via Maven: `mvn test`
  - Use an in-memory DB profile (H2) for fast tests if implemented.

- Frontend:
  - Linting, formatting, and unit tests (if present) via `npm run lint` / `npm test`.

Consider adding CI (GitHub Actions) to run tests and linters on pull requests.

---

## Deployment & Future Work

Planned improvements:
- Real payment gateway integration (Stripe / Razorpay)
- Admin dashboard & role management
- Docker + Docker Compose for reproducible deployments
- Cloud deployment (Heroku / AWS / GCP / Azure)
- Enhanced security (refresh tokens, httpOnly cookies, rate limiting)
- E2E tests and monitoring

Example Dockerization (suggested): Create `Dockerfile` for backend and frontend, add `docker-compose.yml` to orchestrate app + MySQL.

---

## Contributing

Contributions are welcome. Suggested workflow:
1. Fork the repository.
2. Create a descriptive branch: `feature/<short-desc>` or `fix/<short-desc>`.
3. Make changes, add tests where applicable.
4. Open a pull request with a clear description of changes.

Please follow standard best practices: small PRs, descriptive commits, and include screenshots/records for UI changes.

---

## Author

Vedant Salvi
Full-Stack Developer

Repository maintained by: Staycool18

---

## License

Specify a license for the project (MIT, Apache 2.0, etc.). If you don't have one yet, consider adding an `LICENSE` file (e.g., MIT).

---

If you’d like, I can:
- Create a ready-to-commit README.md update and open a PR (I can draft the file contents and a suggested commit message).
- Add a Docker Compose template for local development (backend + frontend + MySQL).
- Standardize environment files and add example `.env.example`.
Which of these would you like me to do next?
