import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BuyerProfile() {
  const buyerId = localStorage.getItem('buyerId'); // ✅ get logged-in buyer id
  const [buyer, setBuyer] = useState(null);
  const [editing, setEditing] = useState(false);

  // Fetch buyer details on load
  useEffect(() => {
    const fetchBuyer = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/buyer/${buyerId}`);
        setBuyer(res.data);
        console.log(res);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (buyerId) fetchBuyer();
  }, [buyerId]);

  // Handle input changes
  const handleChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/buyer/${buyerId}`, buyer);
      alert('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  if (!buyer) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>Buyer Profile</h1>

      {editing ? (
        <div>
          <input name="name" value={buyer.name} onChange={handleChange} /> <br />
          <input name="email" value={buyer.email} onChange={handleChange} /> <br />
          <input name="contact" value={buyer.contact} onChange={handleChange} /> <br />
          <input name="age" value={buyer.age} onChange={handleChange} /> <br />
          <input name="batch" value={buyer.batch} onChange={handleChange} /> <br />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p><b>Name:</b> {buyer.name}</p>
          <p><b>Email:</b> {buyer.email}</p>
          <p><b>Contact:</b> {buyer.contact}</p>
          <p><b>Age:</b> {buyer.age}</p>
          <p><b>Batch:</b> {buyer.batch}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default BuyerProfile;
