# 🏥 PharmaSetu

**PharmaSetu** is a full-stack healthcare & pharmacy management platform that connects **users and pharmacies** on a single system.  
It enables medicine browsing, cart management, secure authentication, order placement, and pharmacy-side medicine management.

---

## 🚀 Features

### 👤 User Features
- User registration & login (JWT based authentication)
- Browse pharmacies and medicines
- Add medicines to cart
- Place orders & view order history
- Password reset using token-based flow
- Secure checkout & mock payment flow

### 🏪 Pharmacy Features
- Pharmacy registration & login
- Pharmacy dashboard
- Add, update, and delete medicines
- View and manage incoming orders
- Role-based access control

### 🔐 Security
- JWT Authentication
- Role-based authorization (USER / PHARMACY)
- Secure password handling
- Protected APIs

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)**
- JavaScript (ES6+)
- CSS (Custom UI & responsive layouts)
- Axios (API communication)

### Backend
- **Spring Boot**
- Spring Security + JWT
- Spring Data JPA
- MySQL Database
- RESTful APIs

---

## 📁 Project Structure

PharmaSetu/
│
├── frontend/ # React (Vite) frontend

│ ├── src/

│ ├── public/

│ └── package.json
│

├── backend/ # Spring Boot backend
│ ├── src/main/java

│ ├── src/test/java

│ └── pom.xml

│
└── README.md

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup
1. Open backend folder
2. Configure MySQL database in `application.properties`
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run

 Backend runs on:
   http://localhost:8083

🔹 Frontend Setup
1. Open frontend folder
2. Install dependencies:
     ```bash
     npm install
     npm run dev
  Frontend runs on:
    http://localhost:5173

### Authentication Flow

1. JWT token is issued on login
2. Token is stored in localStorage
3. Token is sent in Authorization header for secured APIs
4. Logout clears token from storage

### API Highlights

- /auth/register-user
- /auth/register-pharmacy
- /auth/login
- /auth/forgot-password
- /auth/reset-password
- /pharmacy/**
- /medicine/**
- /order/**

### Future Enhancements

- Real payment gateway integration
- Admin dashboard
- Deployment using Docker & Cloud

### Author

Vedant Salvi
Full-Stack Developer
