import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './Pages/About';
import Booking from './Pages/Booking';
import Tours from './Pages/Tours';
import Home from './Pages/home';
import Admin from './Pages/Admin';
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import Navbar from './Components/Navbar';
import Blog from './Pages/Blog';

const App = () => {
  return (
    <div>
      <Router> {/* Use Router consistently */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/blog' element={<Blog/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/tour" element={<Tours />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
