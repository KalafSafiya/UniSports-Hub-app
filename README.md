
# 🏅 UniSports Hub – University Sports Management System

**UniSports Hub** is a web-based university sports management platform designed to simplify and streamline sports-related activities within a university. It provides a centralized platform for managing sports teams, facilities, bookings, schedules, users, and communication between administrators, coaches, and students.

Developed as part of the **IT 3162 – Group Project**.

---

## 📘 Project Overview

UniSports Hub aims to improve university sports management by replacing manual processes with an organized digital platform.

The system provides role-based access for different users:

- **Administrators:** Manage users, sports, teams, facilities, booking requests, and contact requests.
- **Coaches:** Access and manage team-related information and sports schedules.
- **Students / Guests:** Explore sports information, view teams, check schedules, and access announcements.

The application consists of a React.js frontend, a Node.js and Express.js backend, and database integration using MySQL and MongoDB.

---

## 🚀 Main Features

### 1. User Management
- User account management.
- Role-based access for different user categories.
- Authentication and authorization.
- Secure password handling.

### 2. Sports Management
- Add and manage sports.
- Maintain sports-related information.
- Manage sports categories and details.

### 3. Team Management
- Create and manage sports teams.
- Maintain team information.
- Associate teams with relevant sports.

### 4. Facility and Ground Management
- Manage university sports facilities and grounds.
- Maintain venue-related information.
- Support facility booking operations.

### 5. Booking Management
- Submit facility booking requests.
- Manage booking requests.
- Allow administrators to review and process requests.

### 6. Sports Schedules
- View upcoming sports events and schedules.
- Organize sports-related activities.
- Provide schedule information to users.

### 7. News and Announcements
- Display sports-related news and updates.
- Provide information about university sports activities.

### 8. Contact and Feedback
- Provide a contact interface for users.
- Receive and manage contact requests.
- Support communication between users and administrators.

### 9. Admin Dashboard
- Centralized administrative interface.
- Navigation to different management modules.
- Access to administrative features and requests.

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Lucide React Icons
- JavaScript

### Backend
- Node.js
- Express.js
- REST API architecture

### Databases
- MySQL / MariaDB
- MongoDB

### Authentication and Security
- JSON Web Tokens (JWT)
- bcrypt password hashing

### Development Tools
- Visual Studio Code
- Git and GitHub
- Postman
- XAMPP / MariaDB

---

## 🏗️ System Architecture

The application follows a client-server architecture.

1. **Frontend Layer:** React.js provides the user interface and handles user interactions.
2. **Backend Layer:** Node.js and Express.js handle application logic and API requests.
3. **Database Layer:** MySQL and MongoDB are used for persistent data storage.

The frontend communicates with the backend through API requests, while the backend handles database operations and returns the required responses.

---

## 📂 Project Structure

```text
UniSports-Hub/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── AdminComponents/
│   │   ├── AdminPages/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
└── README.md
```

*Note: Adjust the structure above to match the actual repository.*

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- Node.js and npm
- Git
- MySQL / MariaDB
- MongoDB
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/KalafSafiya/UniSports-Hub.git
```

### 2. Navigate into the Project Directory

```bash
cd UniSports-Hub
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm start
```

Open the application in your browser:

```text
http://localhost:3000
```

### 4. Backend Setup

Open another terminal and navigate to the backend directory:

```bash
cd UniSports-Hub/backend
```

Install backend dependencies:

```bash
npm install
```

Configure the required database connections and environment variables.

Create a `.env` file containing the required configuration values. Refer to the backend configuration for the actual variable names.

Start the backend using the start script defined in its `package.json`:

```bash
npm start
```

### 5. Database Configuration

Make sure the required database services are running.

- Configure the MySQL / MariaDB connection.
- Configure the MongoDB connection.
- Apply the required database setup and configuration.
- Ensure the backend can successfully connect to both databases.

---

## 🔐 Environment Configuration

The backend requires appropriate environment variables for database connections, authentication, and application configuration.

Refer to the backend configuration and environment template for the exact variable names and values.

**Important:** Never commit passwords, database credentials, JWT secrets, or other sensitive configuration details to GitHub.

---

## 👥 Project Contributors

**UniSports Hub** was developed collaboratively as part of the IT 3162 Group Project.

The project involved frontend development, backend development, database integration, and system documentation.

---

## 🎓 Academic Information

| Detail | Information |
|---|---|
| Project | UniSports Hub |
| Module | IT 3162 – Group Project |
| Project Type | Full-Stack Web Application |
| Frontend | React.js |
| Backend | Node.js and Express.js |
| Databases | MySQL and MongoDB |
| Version Control | Git and GitHub |

---

## 🌟 Project Objective

The main objective of UniSports Hub is to provide a centralized and user-friendly platform for managing university sports activities, improving administrative efficiency, simplifying facility booking processes, and making sports-related information easily accessible to the university community.

---

**UniSports Hub – Bringing University Sports Management Together.**
