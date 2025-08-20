import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VendorProfile() {
  const vendorId = localStorage.getItem('vendorId'); // ✅ get logged-in vendor id
  const [vendor, setVendor] = useState(null);
  const [editing, setEditing] = useState(false);

  // Fetch vendor details on load
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/vendor/${vendorId}`);
        setVendor(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (vendorId) fetchVendor();
  }, [vendorId]);

  // Handle input changes
  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/vendor/${vendorId}`, vendor);
      alert('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  if (!vendor) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>Vendor Profile</h1>

      {editing ? (
        <div>
          <input name="manager_name" value={vendor.manager_name} onChange={handleChange} /> <br />
          <input name="shop_name" value={vendor.shop_name} onChange={handleChange} /> <br />
          <input name="email" value={vendor.email} onChange={handleChange} /> <br />
          <input name="contact" value={vendor.contact} onChange={handleChange} /> <br />
          <input name="opening_time" value={vendor.opening_time} onChange={handleChange} /> <br />
          <input name="closing_time" value={vendor.closing_time} onChange={handleChange} /> <br />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p><b>Manager:</b> {vendor.manager_name}</p>
          <p><b>Shop:</b> {vendor.shop_name}</p>
          <p><b>Email:</b> {vendor.email}</p>
          <p><b>Contact:</b> {vendor.contact}</p>
          <p><b>Opening:</b> {vendor.opening_time}</p>
          <p><b>Closing:</b> {vendor.closing_time}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default VendorProfile;
