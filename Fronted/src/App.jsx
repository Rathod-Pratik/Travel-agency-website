import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import "./App.css";
import { ToastContainer } from "react-toastify";
import RazorpayPayment from "./Components/PaymentPage";
import CancelBooking from "./Pages/Cancelbooking";

import AdminTours from "./Pages/Admin/AdminTours";
import AdminBooking from "./Pages/Admin/AdminBooking";
import AdminUsers from "./Pages/Admin/AdminUsers";
import Adminblog from "./Pages/Admin/Adminblog";
import AdminReview from "./Pages/Admin/AdminReview";
import AdminContect from "./Pages/Admin/AdminContect";
import AdminNavbar from "./Components/AdminNavbar";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminSetting from "./Pages/Admin/adminSetting";
import BlogDetail from "./Pages/Blog/blogDetail";

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
const App = () => {
  useEffect(()=>{
    AOS.init();
  },[])
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <div className="">
      {" "}
      {!isAdminPage && <Navbar />}
      {isAdminPage && <AdminNavbar />}
      <Routes>
        {/* Pages for user */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogdetails" element={<BlogDetail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/cancelbooking" element={<CancelBooking />} />
        <Route path="/tour" element={<Tours />} />
        <Route path="/tourDetail/:_id" element={<TourDatail />} />
        <Route path="/paymentPage" element={<RazorpayPayment />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />

        {/* Pages for admin */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Admin />} />
          <Route path="tours" element={<AdminTours />} />
          <Route path="bookings" element={<AdminBooking />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="review" element={<AdminReview />} />
          <Route path="blog" element={<Adminblog />} />
          <Route path="contacts" element={<AdminContect />} /> 
          <Route path="setting" element={<AdminSetting />} /> 
        </Route>
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      <ToastContainer position="bottom-right" />
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;
