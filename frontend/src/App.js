import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProfile from './pages/vendor/VendorProfile';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerProfile from './pages/buyer/BuyerProfile';
// import VendorMenu from './pages/vendor/VendorMenu';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/buyer" element={<BuyerProfile />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/vendor" element={<VendorProfile />} /> 
        {/* <Route path="/vendor" element={<VendorMenu />} />  */}
      </Routes>
    </Router>
  );
}

export default App;