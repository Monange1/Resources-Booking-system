﻿# Resources-Booking-system

markdown
# 📚 University Centralized Room & Equipment Booking System

A full-stack web application for managing and booking university rooms and equipment. It provides separate interfaces for students and administrators, enabling efficient resource allocation, scheduling, and management.

---

## 🚀 Features

### 🔒 Authentication
- Secure login and signup via **Firebase Authentication**
- Redirects users to respective dashboards based on **admin roles**

### 👩‍🎓 Student Dashboard
- View and book available rooms and equipment
- See upcoming bookings in a calendar interface powered by **FullCalendar**
- Responsive and user-friendly interface

### 🛠️ Admin Dashboard
- Manage rooms and equipment (add, edit, delete)
- View all bookings in real-time
- Assign roles (e.g., admin user)
- Prevent duplicate bookings and time conflicts

### 📬 Notifications
- Booking confirmations via **Nodemailer** (email)

---

## 🧰 Tech Stack

- **Frontend**: React.js, React Router, FullCalendar
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: Firebase Auth + Custom Claims
- **Deployment**: Vercel (Frontend), Render or Railway (Backend)
- **Other**: Dotenv, CORS, Axios, Nodemailer

---

## 📦 Folder Structure

```

booking-system/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/        # SignIn, SignUp, Calendar, etc.
│   │   ├── admin/        # Admin dashboard and management
│   │   └── firebase/     # Firebase config & role check
│
├── server/               # Express backend
│   ├── routes/           # API routes for bookings & resources
│   ├── models/           # Mongoose models
│   ├── controllers/      # Logic for resources/bookings
│   └── setAdmin.js       # Script to assign Firebase admin role
│
└── README.md

````

---

## 🔧 Setup & Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/Resources-Booking-system.git
cd Resources-Booking-system
````

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Firebase Setup

* Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
* Enable **Authentication (Email/Password)**
* Download your **Admin SDK JSON** and place it in `server/`

  * Rename it: `serviceAccountKey.json`
* Add this to `.gitignore`:

  ```
  server/serviceAccountKey.json
  ```

### 4. Create `.env` Files

#### `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

#### `client/src/firebase/firebaseConfig.js`

```js
// Replace with your actual Firebase config
export const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```

---

## 📡 Running the App

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm start
```

---

## 🚀 Deployment

* Frontend: [Vercel](https://vercel.com/)
* Backend: [Render](https://render.com/) or [Railway](https://railway.app/)
* Environment variables should be configured in their respective dashboards.

---



## 👨‍💻 Author

* M (Mikiyas Anmaw)
* [GitHub Profile](https://github.com/Monange1)


