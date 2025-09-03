import React, { useEffect, useState } from "react";
import axios from "axios";

function BuyerOrders({ buyerId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/order/buyer/${buyerId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    if (buyerId) fetchOrders();
  }, [buyerId]);

  if (!orders || orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Placed Time</th>
            <th>Vendor</th>
            <th>Food Item</th>
            <th>Quantity</th>
            <th>Addons</th>
            <th>Status</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.placedTime).toLocaleString()}</td>
              <td>{order.vendorId?.name || "Unknown Vendor"}</td>
              <td>{order.itemId?.name || "Unknown Item"}</td>
              <td>{order.quantity}</td>
              <td>
                {order.addons && order.addons.length > 0
                  ? order.addons.map((a, i) => (
                      <span key={i}>
                        {a.name} (+₹{a.price})
                        {i < order.addons.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "—"}
              </td>
              <td>{order.status}</td>
              <td>₹{order.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuyerOrders;
