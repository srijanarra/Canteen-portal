import React, { useEffect, useState } from "react";
import axios from "axios";

function VendorOrders({ vendorId }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch all orders for this vendor
  useEffect(() => {
    axios
      .get(`http://localhost:3001/order/vendor/${vendorId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, [vendorId]);

  // Handle status update
  const handleUpdateStatus = async (orderId, currentStatus) => {
    try {
      let nextStatus = "";

      if (currentStatus === "PLACED") nextStatus = "ACCEPTED";
      else if (currentStatus === "ACCEPTED") nextStatus = "COOKING";
      else if (currentStatus === "COOKING") nextStatus = "READY FOR PICKUP";
      else if (currentStatus === "READY FOR PICKUP") nextStatus = "COMPLETED";

      if (!nextStatus) return; // nothing to do

      const res = await axios.put(`http://localhost:3001/order/${orderId}/status`, {
        status: nextStatus
      });

      // update frontend list
      setOrders(orders.map(o => (o._id === orderId ? res.data : o)));
      setError("");
    } catch (err) {
      alert(err.response?.data?.error || "Error updating status");
    }
  };

  // Handle rejection
  const handleReject = async (orderId) => {
    try {
      const res = await axios.put(`http://localhost:3001/order/${orderId}/status`, {
        status: "REJECTED"
      });
      setOrders(orders.map(o => (o._id === orderId ? res.data : o)));
      setError("");
    } catch (err) {
      alert(err.response?.data?.error || "Error rejecting order");
    }
  };

  return (
    <div>
      <h2>Vendor Orders</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Addons</th>
            <th>Status</th>
            <th>Placed Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.itemId?.name}</td>
              <td>{order.quantity}</td>
              <td>{order.addons.map(a => `${a.name} (₹${a.price})`).join(", ")}</td>
              <td>{order.status}</td>
              <td>{new Date(order.placedTime).toLocaleString()}</td>
              <td>
                {order.status !== "REJECTED" && order.status !== "COMPLETED" && (
                  <>
                    <button onClick={() => handleUpdateStatus(order._id, order.status)}>
                      Move to Next Stage
                    </button>
                    {order.status === "PLACED" && (
                      <button onClick={() => handleReject(order._id)}>
                        Reject
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorOrders;
