import React, { useState } from 'react';
import BuyerProfile from './BuyerProfile';
import BuyerOrders from './BuyerOrders';

function BuyerDashboard() {
  const buyerId = localStorage.getItem("buyerId");
  const [activeTab, setActiveTab] = useState('profile'); // default: profile page

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      {/* Sidebar */}
      <div style={{
        width: '200px',
        background: '#f4f4f4',
        padding: '20px',
        borderRight: '1px solid #ccc'
      }}>
        <h3>Buyer Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><button onClick={() => setActiveTab('profile')}>Profile</button></li>
          <li><button onClick={() => setActiveTab('orders')}>Orders</button></li>
          <li><button onClick={() => setActiveTab('wallet')}>Wallet</button></li>
        </ul>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {activeTab === "profile" && <BuyerProfile buyerId={buyerId} />}
        {activeTab === "orders" && <BuyerOrders buyerId={buyerId} />}
      </div>

    </div>
  );
}

export default BuyerDashboard;
