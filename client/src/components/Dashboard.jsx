import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with mock data
    const getMockData = async () => {
      try {
        setLoading(true);
        // Mock data structure
        const mockData = {
          invoices: [
            {
              id: 1,
              amount: "1000",
              recipient: "0x123...",
              status: "Pending",
              timestamp: Date.now()
            }
          ]
        };
        setData(mockData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getMockData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render your dashboard UI here using the mock data */}
    </div>
  );
};

export default Dashboard;
