// src/pages/admin/Routes.jsx
import React, { useEffect, useState } from "react";
import { MapPin, Route as RouteIcon, Plus, Pencil } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import axios from "axios";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]); // initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/routes");
      // Ensure the response is an array
      if (Array.isArray(res.data)) {
        setRoutes(res.data);
      } else {
        setRoutes([]);
      }
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setError("Failed to load routes. Please try again.");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Routes & Zones" subtitle="Manage collection routes and coverage zones" />

      {/* Add Zone Button */}
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
          <Plus className="w-5 h-5" /> Add New Zone
        </button>
      </div>

      {/* MAP SECTION */}
      <section className="bg-white shadow-xl rounded-2xl p-6 border mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="text-red-600" /> Zone Visualization Map
        </h2>
        <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
          Map Placeholder (Insert LiveMap / custom map)
        </div>
      </section>

      {/* ROUTES TABLE */}
      <section className="bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <RouteIcon className="text-blue-600" /> Active Routes
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading routes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : routes.length === 0 ? (
          <p className="text-gray-500">No routes available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Route Name</th>
                <th className="p-3 text-left">Zone</th>
                <th className="p-3 text-left">Driver</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{route.name}</td>
                  <td className="p-3">{route.zoneName}</td>
                  <td className="p-3">{route.driverName || "Unassigned"}</td>
                  <td className="p-3">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AdminLayout>
  );
};

export default RoutesPage;
