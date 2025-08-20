import React, { useEffect, useState } from "react";
import axios from "axios";

function VendorStats({ vendorId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/order/vendor/${vendorId}/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [vendorId]);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2>Vendor Statistics</h2>

      <h3>Orders Count</h3>
      <ul>
        <li>Placed: {stats.placed}</li>
        <li>Pending: {stats.pending}</li>
        <li>Completed: {stats.completed}</li>
      </ul>

      <h3>Top 5 Sold Items</h3>
      <ol>
        {stats.topItems.map((item, idx) => (
          <li key={idx}>{item.name} - {item.count} sold</li>
        ))}
      </ol>
    </div>
  );
}

export default VendorStats;
