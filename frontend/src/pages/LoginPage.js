import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();

  // Buyer login
  const [loginData, setLoginData] = useState({ email: '', contact: '' });
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/buyer_auth/login', loginData);
      alert(res.data.message);
      navigate('/buyer');
    } catch (err) {
      console.error(err);
      alert('Invalid login');
    }
  };

  // Vendor login
  const [vendorLoginData, setVendorLoginData] = useState({ email: '', contact: '' });
  const handleVendorLoginChange = (e) => {
    setVendorLoginData({ ...vendorLoginData, [e.target.name]: e.target.value });
  };
  const handleVendorLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/vendor_auth/login', vendorLoginData);
      alert(res.data.message);
      localStorage.setItem('vendorId', res.data.vendorId);
      navigate('/vendor');
    } catch (err) {
      console.error(err);
      alert('Invalid vendor login');
    }
  };

  return (
    <div>
      <h2>Buyer Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required /> <br />
        <input name="contact" placeholder="Contact" value={loginData.contact} onChange={handleLoginChange} required /> <br />
        <button type="submit">Login as Buyer</button>
      </form>

      <h2>Vendor Login</h2>
      <form onSubmit={handleVendorLoginSubmit}>
        <input name="email" placeholder="Email" value={vendorLoginData.email} onChange={handleVendorLoginChange} required /> <br />
        <input name="contact" placeholder="Contact" value={vendorLoginData.contact} onChange={handleVendorLoginChange} required /> <br />
        <button type="submit">Login as Vendor</button>
      </form>

      <p>Don’t have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default LoginPage;
