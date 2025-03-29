import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./Pages/About";
import Booking from "./Pages/Booking";
import Tours from "./Pages/Tours";
import Home from "./Pages/home";
import Admin from "./Pages/Admin";
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import Navbar from "./Components/Navbar";
import Blog from "./Pages/Blog";
import Footer from "./Components/Footer";
import Account from "./Pages/Account";
import TourDatail from "./Pages/Tours/TourDatail";
import './App.css'
import { ToastContainer } from 'react-toastify';
import RazorpayPayment from "./Components/PaymentPage";
import CancelBooking from "./Pages/Cancelbooking";

const App = () => {

  return (
    <div>
      <Router>
        {" "}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login  />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/signup" element={<SignUp  />} />
          <Route path="/booking" element={<Booking  />} />
          <Route path="/cancelbooking" element={<CancelBooking  />} />
          <Route path="/tour" element={<Tours />} />
          <Route path="/tourDetail/:_id" element={<TourDatail  />} />
          <Route path="/paymentPage" element={<RazorpayPayment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account/>}/>
        </Routes>
        <ToastContainer position="bottom-right" />
        <Footer />
      </Router>
    </div>
  );
};

export default App;
