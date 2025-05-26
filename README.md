
# Travel Agency Website

🌐 **Live Website:** [https://travel-agency-one.vercel.app/](https://travel-agency-one.vercel.app/)

## Overview

A full-stack travel booking platform built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse tours, book trips, read blogs, leave reviews, and manage their bookings. Admins can manage tours, bookings, users, blogs, and view platform statistics.

---

## Features

- User authentication (JWT-based)
- Browse and search tour packages
- Book tours with integrated Razorpay payment gateway
- View and manage personal bookings (including cancellations)
- Leave and read reviews for tours
- Blog section for travel articles
- Contact form for inquiries
- Admin dashboard for managing tours, bookings, users, blogs, reviews, and contacts
- Responsive design for all devices

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Zustand, React Router, AOS, React Toastify, Swiper
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Razorpay, Cloudinary, Multer, CORS, dotenv
- **Payment:** Razorpay API

---

## Project Structure

```
Travel-agency-website/
│
├── Backend/
│   ├── api/                # Express app and API entry
│   ├── Controller/         # Controllers for business logic
│   ├── middlewares/        # Auth, file upload, etc.
│   ├── Model/              # Mongoose models
│   ├── public/             # Public assets (uploads, etc.)
│   ├── Routes/             # Express route definitions
│   ├── utils/              # Utility functions (e.g., cloudinary)
│   ├── EndPoints.txt       # API endpoint documentation
│   ├── package.json        # Backend dependencies
│   └── server.js           # Server entry point
│
├── Fronted/
│   ├── public/             # Static assets (images, videos)
│   ├── src/                # React source code
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── README.md           # Frontend notes
│
└── README.md               # Main project documentation
```

---

## Installation & Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud)
- (Optional) Razorpay account for payment integration

### 1. Clone the Repository

```powershell
git clone https://github.com/Rathod-Pratik/Travel-agency-website.git
cd Travel-agency-website
```

### 2. Backend Setup

```powershell
cd Backend
npm install
# Copy and configure your environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Razorpay keys, etc.
npm start
```

#### Backend Environment Variables (`Backend/.env`)

```
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
```

### 3. Frontend Setup

```powershell
cd ../Fronted
npm install
# Copy and configure your environment variables
cp .env.example .env
# Edit .env with your backend API URL and Razorpay key
npm run dev
```

#### Frontend Environment Variables (`Fronted/.env`)

```
VITE_API_HOST=http://localhost:3000
VITE_RAZORPAY_KEY=your_frontend_key
```

---

## API Endpoints

See `Backend/EndPoints.txt` for full details. Key endpoints include:

### Authentication & User Management

- `POST /register` – Register new users
- `POST /login` – Authenticate users & issue tokens
- `PUT /user/profile` – Update user profile
- `POST /logout` – Log out

### Tours

- `GET /tours` – Fetch all tours
- `GET /tours/{id}` – Fetch tour details
- `POST /tours` – Create tour (admin only)
- `PUT /tours/{id}` – Update tour (admin only)
- `DELETE /tours/{id}` – Delete tour (admin only)

### Bookings

- `POST /booking` – Create booking
- `GET /booking/{id}` – View booking details
- `GET /bookings/user/{userId}` – Get all bookings for a user
- `PUT /booking/{id}` – Update booking
- `DELETE /booking/{id}` – Cancel booking

### Payments

- `POST /payment` – Initiate payment
- `GET /payment/{id}` – Get payment details
- `POST /payment/verify` – Verify payment

### Reviews

- `POST /reviews` – Add review
- `GET /reviews/{tourId}` – Get all reviews for a tour
- `PUT /reviews/{id}` – Edit review (author/admin)
- `DELETE /reviews/{id}` – Delete review (author/admin)

### Admin

- `GET /dashboard/stats` – Get summary stats
- `GET /users` – List all users (admin only)
- `DELETE /users/{id}` – Delete user (admin only)

---

## Usage

- Visit the live site: [https://travel-agency-one.vercel.app/](https://travel-agency-one.vercel.app/)
- Register as a user to book tours, leave reviews, and manage your bookings.
- Admins can log in to `/admin` to manage tours, bookings, users, blogs, reviews, and contacts.

---

## License

MIT © 2025

---
