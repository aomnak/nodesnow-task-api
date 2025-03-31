<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://github.com/aomnak/nodesnow-task-api" target="_blank">
    <img src="https://img.shields.io/github/license/aomnak/nodesnow-task-api.svg" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/@nestjs/common" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
</p>

---

## 📌 Description

**nodesnow-task-api** is a Task Management API built with [NestJS](https://nestjs.com), PostgreSQL, Sequelize ORM, and JWT authentication. The app supports Docker, Swagger docs, and includes unit tests for authentication and task management functionality.

---

## 🚀 Features

- ✅ User registration and login
- 🔒 JWT Authentication & Guards for protected routes
- 📄 CRUD operations for tasks (Create, Read, Update, Delete)
- 🐳 Docker & docker-compose setup
- 🧪 Unit tests with Jest & coverage
- 🧾 Swagger docs available at [`/api/docs`](http://localhost:3000/api/docs)

---

## 📦 Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (via Sequelize)
- **Authentication:** Passport JWT + bcrypt
- **API Docs:** Swagger (`@nestjs/swagger`)
- **Testing:** Jest
- **Containerization:** Docker & Docker Compose

---

## 🛠️ Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aomnak/nodesnow-task-api.git
cd nodesnow-task-api
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=tasks_db
JWT_SECRET=your_jwt_secret_here
```

### 3. Choose Your Setup Method

#### Option A: Using Docker Compose (Recommended)

```bash
docker compose up --build
```

This will launch the NestJS API server and PostgreSQL database.

#### Option B: Manual Setup

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run start:dev
```

Note: This requires PostgreSQL to be installed and running locally.

### 4. Access the Application

- API is available at: http://localhost:3000
- Swagger documentation: http://localhost:3000/api/docs

### 5.🧪 Testing

Unit tests are written for:

- **Authentication Logic**:
  - Authentication service (`auth.service.spec.ts`)
  - Authentication controller (`auth.controller.spec.ts`)
  - JWT strategy (`jwt.strategy.spec.ts`)

- **Task Management Logic**:
  - Tasks service (`tasks.service.spec.ts`)
  - Tasks controller (`tasks.controller.spec.ts`)

Run tests with:

```bash
npm run test        # Run unit tests
npm run test:cov    # Show test coverage
```
---

## 🧠 Key Architectural Decisions

### Modular Structure
The application is organized into modules, each with specific responsibilities:
- **Auth Module**: Handles user authentication, JWT strategies, and guards
- **Users Module**: Manages user data and operations
- **Tasks Module**: Handles CRUD operations for tasks
- **Common Module**: Contains shared guards and utilities

### Database & ORM
- **Sequelize ORM** is used to interact with PostgreSQL 
- Models use decorators for schema definition
- Relationships are defined between User and Task models

### Authentication Strategy
- **JWT-based authentication** with Passport.js
- Password hashing with bcrypt for secure storage
- Protected routes using JwtAuthGuard
- 🛡️ JWT tokens are generated using `jsonwebtoken` with a secret loaded from environment variables (`JWT_SECRET`).  
  Tokens expire in 1 hour. All protected routes require a valid token sent via `Authorization: Bearer <token>`.

### API Documentation
- **Swagger UI** auto-generated API documentation
- Decorator-based documentation for endpoints and DTOs

### Testing Approach
- **Jest** for testing framework
- Unit tests for controllers and services
- Mocking of database models for isolation

### DevOps Considerations
- **Docker & Docker Compose** for containerization
- Environment variables for configuration
- Production-ready Dockerfile with multi-stage builds

---

## 📬 Example API Requests

> 🛡 All `tasks` routes require Bearer Token authentication.

### Authentication

#### Register a New User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "securepassword"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "securepassword"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Tasks

#### Create a New Task

```http
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "New Task",
  "description": "This task must be done ASAP"
}
```

#### Get All Tasks

```http
GET /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Get Task by ID

```http
GET /tasks/task-uuid
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Update Task

```http
PATCH /tasks/task-uuid
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in_progress"
}
```

#### Delete Task

```http
DELETE /tasks/task-uuid
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---
