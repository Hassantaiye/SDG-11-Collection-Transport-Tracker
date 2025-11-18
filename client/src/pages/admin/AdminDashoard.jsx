import React, { useEffect, useState } from "react";
import {
  Package,
  Users,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Truck,
} from "lucide-react";

import AdminLayout from "../../layout/AdminLayout";
import AdminHeader from "../../components/AdminHeader";
import LiveMap from "../../components/LiveMap";
import axios from "../../api/axiosInstance"; 
import { io } from "socket.io-client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPickups: 0,
    totalDrivers: 0,
    completedToday: 0,
    pendingRequests: 0,
    pickupsTrend: "",
    driversTrend: "",
    completedTrend: "",
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [driverLocations, setDriverLocations] = useState([]);
  const [adminName, setAdminName] = useState(""); // NEW: store admin name

  useEffect(() => {
    fetchAdminInfo();   // NEW: fetch admin info
    fetchStats();
    fetchRecentActivity();

    const socket = io("http://localhost:5000");

    socket.on("newPickup", (pickup) => {
      setRecentActivity((prev) => [
        { action: "New pickup request", location: pickup.address, time: "Just now" },
        ...prev,
      ]);
      fetchStats();
    });

    socket.on("pickupCompleted", (pickup) => {
      setRecentActivity((prev) => [
        { action: "Pickup completed", location: pickup.address, time: "Just now" },
        ...prev,
      ]);
      fetchStats();
    });

    socket.on("driverAssigned", (assignment) => {
      setRecentActivity((prev) => [
        { action: "Driver assigned", location: assignment.address, time: "Just now" },
        ...prev,
      ]);
    });

    socket.on("routeOptimized", (route) => {
      setRecentActivity((prev) => [
        { action: "Route optimized", location: route.zone, time: "Just now" },
        ...prev,
      ]);
    });

    socket.on("driverLocationUpdate", (driver) => {
      setDriverLocations((prev) => [...prev.filter(d => d.id !== driver.id), driver]);
    });

    return () => socket.disconnect();
  }, []);

  // NEW FUNCTION: fetch admin info
  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get("/api/admin/me");
      setAdminName(res.data.data?.name || "");
    } catch (err) {
      console.error("Failed to fetch admin info:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/admin/analytics/overview");
      const data = res.data;
      setStats({
        totalPickups: data.totalPickups || 0,
        totalDrivers: data.totalDrivers || 0,
        completedToday: data.completedToday || 0,
        pendingRequests: data.pendingPickups || 0,
        pickupsTrend: data.pickupsTrend || "+0%",
        driversTrend: data.driversTrend || "+0",
        completedTrend: data.completedTrend || "+0%",
      });
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await axios.get("/api/admin/activity/recent");
      setRecentActivity(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch recent activity:", err);
    }
  };

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <AdminHeader title={`Welcome, ${adminName} 👋`} subtitle="Overview • Insights • Real-time activity" />

      {/* STATS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Pickups"
          value={stats.totalPickups}
          icon={Package}
          trend={stats.pickupsTrend + " this month"}
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Active Drivers"
          value={stats.totalDrivers}
          icon={Users}
          trend={stats.driversTrend + " this week"}
          color="from-green-500 to-green-700"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle}
          trend={stats.completedTrend + " since yesterday"}
          color="from-purple-500 to-purple-700"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={AlertCircle}
          trend="Pending"
          color="from-orange-500 to-orange-700"
        />
      </section>

      {/* MAP + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <MapPin className="text-blue-600" />
            Live Driver Tracking
          </h2>
          <div className="overflow-hidden rounded-xl">
            <LiveMap driverLocations={driverLocations} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <Clock className="text-indigo-600" />
            Recent Activity
          </h2>

          {recentActivity.length > 0 ? (
            recentActivity.map((item, index) => (
              <RecentActivityItem
                key={index}
                action={item.action}
                location={item.location}
                time={item.time}
              />
            ))
          ) : (
            <p className="text-gray-400">No recent activity</p>
          )}

          <button className="mt-4 w-full text-blue-600 font-medium hover:underline">
            View all →
          </button>
        </div>
      </div>

      {/* MANAGEMENT TOOLS */}
      <section>
        <h2 className="text-xl font-semibold mb-5">Management Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            label="Manage Pickups"
            link="/admin/manage-pickups"
            icon={Package}
            color="from-blue-500 to-blue-700"
          />
          <ActionCard
            label="Manage Drivers"
            link="/admin/manage-drivers"
            icon={Truck}
            color="from-green-500 to-green-700"
          />
          <ActionCard
            label="Analytics"
            link="/admin/analytics"
            icon={BarChart3}
            color="from-purple-500 to-purple-700"
          />
          <ActionCard
            label="Routes & Zones"
            link="/admin/routes"
            icon={MapPin}
            color="from-orange-500 to-orange-700"
          />
        </div>
      </section>
    </AdminLayout>
  );
};

/* ------------------------- REUSABLE COMPONENTS ------------------------- */
const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <p className="text-green-600 text-sm mt-1">{trend}</p>
      </div>
      <div className={`p-3 rounded-xl bg-linear-to-br ${color} text-white shadow`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const RecentActivityItem = ({ action, location, time }) => (
  <div className="border-b py-3 last:border-none">
    <p className="font-medium">{action}</p>
    <p className="text-gray-500 text-sm">{location}</p>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

const ActionCard = ({ label, link, icon: Icon, color }) => (
  <a
    href={link}
    className={`bg-linear-to-br ${color} text-white p-6 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all flex items-center justify-between`}
  >
    <span className="font-medium text-lg">{label}</span>
    <Icon className="w-7 h-7" />
  </a>
);

export default AdminDashboard;
