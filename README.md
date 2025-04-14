# Travel Booking Platform - MERN Stack

![MERN Logo](https://miro.medium.com/v2/resize:fit:1400/1*J3G3akaMpUOLegw0p0qthA.png)

## Features
- **User Authentication** (JWT)
- **Razorpay Payment Integration**
- **Tour & Blog Management**
- **Admin Dashboard** (CRUD for Tours/Blogs)
- **Responsive Design**

## Tech Stack
**Frontend**: React, Redux, Tailwind CSS  
**Backend**: Node.js, Express, MongoDB  
**Payment**: Razorpay API  

## Installation
1. Clone repo:
```bash
git clone https://github.com/Rathod-Pratik/Travel-agency-website.git
cd project
Set up backend:

bash
Copy
cd backend
npm install
cp .env.example .env
npm start
Set up frontend:

bash
Copy
cd ../frontend
npm install
cp .env.example .env
npm start
Environment Variables
Backend (.env):

Copy
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
Frontend (.env):

Copy
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=your_frontend_key
Project Structure
Copy
backend/
  ├── controllers/
  ├── models/
  ├── routes/
frontend/
  ├── public/
  ├── src/
     ├── components/
     ├── pages/
API Endpoints
Endpoint	Method	Description
/api/tours	GET	Get all tours
/api/payment/create-order	POST	Create payment order
Admin Access
Manage tours/blogs at /admin

Requires admin privileges

License
MIT © YourName 2023