import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import AdminLayout from "../../layout/AdminLayout";
import AdminHeader from "../../components/AdminHeader";

// Charts
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// Leaflet map
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const socket = io("http://localhost:5000"); // your backend

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [driverLocations, setDriverLocations] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    setupSocketListeners();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, weeklyRes, monthlyRes, driversRes] = await Promise.all([
        axios.get("/api/admin/analytics/overview"),
        axios.get("/api/admin/analytics/weekly"),
        axios.get("/api/admin/analytics/monthly"),
        axios.get("/api/admin/analytics/driver-locations"),
      ]);

      setStats(overviewRes.data || {});
      setWeeklyStats(Array.isArray(weeklyRes.data) ? weeklyRes.data : []);
      setMonthlyStats(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
      setDriverLocations(Array.isArray(driversRes.data) ? driversRes.data : []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const setupSocketListeners = () => {
    socket.on("driverLocationUpdate", (location) => {
      setDriverLocations((prev) => [...prev, location]);
    });

    socket.on("newPickupUpdate", () => fetchAnalytics());
  };

  if (!stats)
    return (
      <AdminLayout>
        <p className="text-center text-gray-500 mt-20 text-lg">
          Loading analytics...
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      {/* HEADER */}
      <AdminHeader title="Analytics Dashboard" subtitle="Real-time waste management statistics" />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card color="bg-blue-600" title="Total Drivers" value={stats.totalDrivers} />
        <Card color="bg-green-600" title="Total Residents" value={stats.totalResidents} />
        <Card color="bg-purple-600" title="Total Pickups" value={stats.totalPickups} />
        <Card color="bg-indigo-600" title="Completed Pickups" value={stats.completedPickups} />
        <Card color="bg-orange-600" title="Pending Pickups" value={stats.pendingPickups} />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Weekly Pickup Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Weekly Pickup Stats</h2>
          <Line
            data={{
              labels: Array.isArray(weeklyStats) ? weeklyStats.map((d) => d.day) : [],
              datasets: [
                {
                  label: "Pickups",
                  data: Array.isArray(weeklyStats) ? weeklyStats.map((d) => d.count) : [],
                  borderWidth: 3,
                },
              ],
            }}
          />
        </div>

        {/* Monthly Pickup Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Monthly Pickup Stats</h2>
          <Bar
            data={{
              labels: Array.isArray(monthlyStats) ? monthlyStats.map((d) => d.month) : [],
              datasets: [
                {
                  label: "Pickups",
                  data: Array.isArray(monthlyStats) ? monthlyStats.map((d) => d.count) : [],
                  borderWidth: 3,
                },
              ],
            }}
          />
        </div>

        {/* Pie Chart: Pickup Completion */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Pickup Completion Rate</h2>
          <Pie
            data={{
              labels: ["Completed", "Pending"],
              datasets: [
                {
                  data: [stats.completedPickups || 0, stats.pendingPickups || 0],
                },
              ],
            }}
          />
        </div>

        {/* DRIVER HEATMAP */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Driver Location Heatmap</h2>
          <Heatmap driverLocations={driverLocations} />
        </div>

      </div>
    </AdminLayout>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`${color} text-white p-6 rounded-xl shadow`}>
    <p className="text-lg font-semibold">{title}</p>
    <h2 className="text-4xl font-bold mt-2">{value}</h2>
  </div>
);

/* ---------------- HEATMAP COMPONENT ------------------ */
const Heatmap = ({ driverLocations }) => {
  useEffect(() => {
    const map = L.map("heatmap", {
      center: [6.5244, 3.3792], // Lagos default
      zoom: 11,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const heatData = Array.isArray(driverLocations)
      ? driverLocations.map((loc) => [loc.lat, loc.lng, 0.6])
      : [];

    L.heatLayer(heatData, { radius: 25 }).addTo(map);

    return () => map.remove();
  }, [driverLocations]);

  return <div id="heatmap" className="h-72 w-full rounded-xl" />;
};

export default Analytics;
