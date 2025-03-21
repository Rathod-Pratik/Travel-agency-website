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

const App = () => {
  const [color, SetColor] = useState();
  const [message, SetMessage] = useState();
  const [alert,SetAlert]=useState(false);
  const Showalert = (color, message) => {
    SetColor(color);
    SetMessage(message);
    SetAlert(true);
    setTimeout(() => {
      SetAlert(false);
    }, 3500);

  };

  return (
    <div>
      <Router>
        {" "}
        {/* Use Router consistently */}
        <Navbar />
        {alert && <div
          id="alert-border-3"
          class={`flex items-center p-4 mb-4 text-${color}-800 bg-${color}-50 mt-2`}
          role="alert"
        >
          <svg
            class="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div class="ms-3 text-sm font-medium">
           {message}
          </div>
          <button
            type="button"
            class={`ms-auto -mx-1.5 -my-1.5 bg-${color}-50 text-${color}-500 rounded-lg focus:ring-2 focus:ring-${color}-400 p-1.5 hover:bg-${color}-200 inline-flex items-center justify-center h-8 w-8`}
            data-dismiss-target="#alert-border-3"
            aria-label="Close"
          >
            <span class="sr-only">Dismiss</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login Showalert={Showalert} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/signup" element={<SignUp Showalert={Showalert} />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/tour" element={<Tours />} />
          <Route path="/tourDetail/:_id" element={<TourDatail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
