# 🌍 TravelWorld - Full-Stack Travel Agency Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-E34F26?logo=redis&logoColor=white)](https://bullmq.io/)

A modern, production-ready, distributed Travel Agency & Tour Booking application. Built with **TypeScript**, **Express**, **MongoDB**, and **Redis + BullMQ** for background job processing, automated email notifications, PDF invoice generation, AWS S3 image management, and Razorpay payment integration.

---

## 📌 Features

### 👤 User & Authentication
- **Secure Authentication:** JWT-based authentication with HTTP-only cookies and bcrypt password hashing.
- **OTP Verification & Password Recovery:** Secure OTP handling and password reset workflows via email.
- **Role-Based Access Control (RBAC):** Distinct permissions for standard Users and Admins.

### 🎒 Tours & Hotels Management
- **Tour Packages:** Explore categorized tour packages with dates, pricing, capacity, and itinerary details.
- **Hotels:** Search and explore hotels associated with travel destinations.
- **Wishlist:** Save and manage favorite tours and travel experiences.
- **Reviews & Ratings:** Authenticated users can write, edit, and rate tours.

### 💳 Bookings & Payments
- **Seamless Booking Flow:** Multi-seat reservation with seat availability validation.
- **Payment Gateway:** Secure payment checkout and signature verification powered by **Razorpay**.
- **Automated Invoicing:** Background generation of PDF invoices using **Puppeteer**.
- **Cancellations & Refunds:** User and Admin booking cancellation with automated refund tracking.

### ⚡ Background Workers & Distributed Queues (BullMQ + Redis)
- **Email Worker:** Asynchronous transactional emails (Welcome, OTP, Booking Confirmation, Reminders, Invoices, Refunds).
- **Booking & Invoice Worker:** Asynchronous booking finalization and PDF invoice creation.
- **Notification Worker:** In-app notifications with read/unread tracking.
- **Media Cleanup Worker:** Asynchronous deletion of outdated media files from AWS S3.
- **Cache Invalidation:** Versioned Redis caching for high-performance read queries.

### 🛡️ Security & Performance
- **Validation:** Type-safe request payload validation using **Zod**.
- **Rate Limiting:** IP-based request rate limiting with `express-rate-limit`.
- **Structured Logging:** Centralized logging with **Winston** (including MongoDB transport for request and error logs).

---

## 🛠️ Tech Stack

### Backend
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Queue / Cache:** Redis & BullMQ, ioredis
- **Cloud Storage:** AWS S3 (`@aws-sdk/client-s3`)
- **Payments:** Razorpay API
- **PDF Generation:** Puppeteer
- **Email Service:** Nodemailer
- **Validation & Security:** Zod, JWT, bcryptjs, cookie-parser, cors, express-rate-limit
- **Logging:** Winston, winston-transport

---

## 📂 Project Structure

```
TravelWorld/
├── Server/
│   ├── src/
│   │   ├── api/                    # Express application setup & route mounting
│   │   ├── config/                 # Redis and database configuration
│   │   ├── Middleware/             # Auth, validation, rate limiting, multer
│   │   ├── module/                 # Domain-driven feature modules
│   │   │   ├── Auth/               # Authentication, login, register, JWT
│   │   │   ├── Blog/               # Blogs, worker, queue, controllers
│   │   │   ├── Booking/            # Booking engine & cancellation queue
│   │   │   ├── Category/           # Tour categories
│   │   │   ├── Contact/            # Inquiries & messages
│   │   │   ├── Content/            # CMS content & pages
│   │   │   ├── Coupan/             # Coupon & discount system
│   │   │   ├── Email/              # Email templates & BullMQ worker
│   │   │   ├── Hotel/              # Hotel management & queues
│   │   │   ├── Invoice/            # PDF generation & invoice templates
│   │   │   ├── log/                # Winston logger & MongoDB transport
│   │   │   ├── Notification/       # Real-time notifications
│   │   │   ├── Otp/                # OTP generation & validation
│   │   │   ├── Payment/            # Razorpay integration & verification
│   │   │   ├── Review/             # Tour reviews & ratings
│   │   │   ├── Tour/               # Tours management, queue & worker
│   │   │   └── Wishlist/           # User wishlist
│   │   └── utils/                  # Helper functions, S3 upload, cache helpers
│   ├── server.ts                   # Application entry point
│   ├── tsconfig.json               # TypeScript compiler configuration
│   └── package.json                # Dependencies and scripts
├── LICENSE                         # MIT License
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js:** `v18+` or higher
- **npm** / **yarn** / **pnpm**
- **MongoDB:** Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Redis:** Local instance or cloud Redis (required for BullMQ)
- **AWS S3 Bucket:** (Optional for image uploads)
- **Razorpay Account:** (Optional for live payment testing)

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rathod-Pratik/Travel-agency-website.git
   cd Travel-agency-website
   ```

2. **Navigate to the Server directory:**
   ```bash
   cd Server
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure Environment Variables:**
   Create a `.env` file inside the `Server/` directory:

   ```env
   PORT=3000
   origin=http://localhost:5173

   # Database & Redis
   Database=mongodb://localhost:27017/travelworld
   REDIS_URL=redis://localhost:6379

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d

   # Email (Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_app_password

   # AWS S3 (Media Storage)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your_s3_bucket_name

   # Razorpay (Payment Gateway)
   RAZORPAY_KEY_ID=rzp_test_xxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

---

## 🛠️ Available Scripts

Inside the `Server/` directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts development server with hot-reload via `tsx watch` |
| `npm run build` | Compiles TypeScript into JavaScript (`tsc && tsc-alias`) |
| `npm start` | Runs the compiled production build (`node dist/server.js`) |

---

## 📡 API Overview

| Route Prefix | Module | Description |
| :--- | :--- | :--- |
| `/auth` | **Authentication** | Registration, Login, Logout, Profile updates |
| `/otp` | **OTP** | Generate and verify one-time passwords |
| `/tour` | **Tours** | Search, create, update, and manage tours |
| `/hotel` | **Hotels** | Hotel management and listings |
| `/booking` | **Bookings** | Create, view, update, and cancel bookings |
| `/payment` | **Payments** | Payment initialization and signature verification |
| `/category` | **Categories** | Tour categorization |
| `/review` | **Reviews** | Read, submit, update, and delete reviews |
| `/blog` | **Blogs** | Travel blogs, tips, and articles |
| `/contact` | **Contact** | Contact inquiries and feedback |
| `/logs` | **Logs** | System and request logs (Admin only) |
| `/health` | **Health Check** | Server health probe (`/health`) |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2025 Rathod Pratik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author

**Rathod Pratik**
- GitHub: [@Rathod-Pratik](https://github.com/Rathod-Pratik)
