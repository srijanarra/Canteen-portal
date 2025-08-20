import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const navigate = useNavigate();

    // Buyer Register Form
    const [buyerFormData, setBuyerFormData] = useState({
        name: '',
        email: '',
        contact: '',
        age: '',
        batch: ''
    });

    const handleBuyerFormChange = (e) => {
        setBuyerFormData({ ...buyerFormData, [e.target.name]: e.target.value });
    };

    const handleBuyerFormSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post('http://localhost:3001/buyer/register', buyerFormData);
        alert(res.data.message);
        setBuyerFormData({ name: '', email: '', contact: '', age: '', batch: '' });
        navigate('/');
        } catch (err) {
        console.error(err);
        alert('Error registering buyer');
        }
    };

    // Vendor Register Form
    const [vendorFormData, setVendorFormData] = useState({
        manager_name: '',
        shop_name: '',
        email: '',
        contact: '',
        opening_time: '',
        closing_time: ''
    });

    const handleVendorFormChange = (e) => {
        setVendorFormData({ ...vendorFormData, [e.target.name]: e.target.value });
    };

    const handleVendorFormSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post('http://localhost:3001/vendor/register', vendorFormData);
        alert(res.data.message);
        setVendorFormData({ manager_name: '', shop_name: '', email: '', contact: '', opening_time: '', closing_time: '' });
        navigate('/');
        } catch (err) {
        console.error(err);
        alert('Error registering buyer');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
        <h2>Buyer Registration</h2>
        <form onSubmit={handleBuyerFormSubmit}>
            <input name="name" placeholder="Name" value={buyerFormData.name} onChange={handleBuyerFormChange} required /> <br />
            <input name="email" placeholder="Email" value={buyerFormData.email} onChange={handleBuyerFormChange} required /> <br />
            <input name="contact" placeholder="Contact" value={buyerFormData.contact} onChange={handleBuyerFormChange} required /> <br />
            <input name="age" type="number" placeholder="Age" value={buyerFormData.age} onChange={handleBuyerFormChange} required /> <br />
            <input name="batch" placeholder="Batch" value={buyerFormData.batch} onChange={handleBuyerFormChange} required /> <br />
            <button type="submit">Register</button>
        </form>

        <h2>Vendor Registration</h2>
        <form onSubmit={handleVendorFormSubmit}>
            <input name="manager_name" placeholder="Manager Name" value={vendorFormData.manager_name} onChange={handleVendorFormChange} required /> <br />
            <input name="shop_name" placeholder="Shop Name" value={vendorFormData.shop_name} onChange={handleVendorFormChange} required /> <br />
            <input name="email" placeholder="Email" value={vendorFormData.email} onChange={handleVendorFormChange} required /> <br />
            <input name="contact" placeholder="Contact" value={vendorFormData.contact} onChange={handleVendorFormChange} required /> <br />
            <input name="opening_time" placeholder="Opening Time" value={vendorFormData.opening_time} onChange={handleVendorFormChange} required /> <br />
            <input name="closing_time" placeholder="Closing Time" value={vendorFormData.closing_time} onChange={handleVendorFormChange} required /> <br />
            <button type="submit">Register</button>
        </form>
        </div>
  );

}

export default RegisterPage;
