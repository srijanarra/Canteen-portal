import React, { useState } from 'react';
import VendorProfile from './VendorProfile';
import VendorMenu from './VendorMenu';
import VendorOrders from './VendorOrders';
import VendorStats from './VendorStats';

function VendorDashboard() {
  const vendorId = localStorage.getItem("vendorId");
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
        <h3>Vendor Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><button onClick={() => setActiveTab('profile')}>Profile</button></li>
          <li><button onClick={() => setActiveTab('menu')}>Food Menu</button></li>
          <li><button onClick={() => setActiveTab('orders')}>Orders</button></li>
          <li><button onClick={() => setActiveTab('stats')}>Statistics</button></li>
        </ul>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {activeTab === "profile" && <VendorProfile vendorId={vendorId} />}
        {activeTab === "menu" && <VendorMenu vendorId={vendorId} />}
        {activeTab === "orders" && <VendorOrders vendorId={vendorId} />}
        {activeTab === "stats" && <VendorStats vendorId={vendorId} />}
      </div>

    </div>
  );
}

export default VendorDashboard;
