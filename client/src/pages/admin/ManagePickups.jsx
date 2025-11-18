import React, { useEffect, useState } from "react";
import { getAllPickups, updatePickupStatus } from "../../api/pickupApi";
import { getDrivers } from "../../api/driverApi";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";
import AdminHeader from "../../components/AdminHeader";
import Footer from "../../components/Footer";

const ManagePickups = () => {
  const [pickups, setPickups] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pickupsData = await getAllPickups();
        const driversData = await getDrivers();
        setPickups(pickupsData);
        setDrivers(driversData);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignDriver = async (pickupId, driverId) => {
    try {
      await updatePickupStatus(pickupId, { driverId, status: "assigned" });
      toast.success("Driver assigned!");
      const updatedPickups = pickups.map((p) =>
        p._id === pickupId
          ? { ...p, driver: drivers.find((d) => d._id === driverId), status: "assigned" }
          : p
      );
      setPickups(updatedPickups);
    } catch (err) {
      toast.error("Failed to assign driver");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPickups = pickups.filter(
    (p) =>
      (statusFilter === "" || p.status === statusFilter) &&
      (driverFilter === "" || p.driver?._id === driverFilter)
  );

  return (
  <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-50">
      <AdminNavbar />

      <div className="p-6">
        <AdminHeader title="Manage Pickups" subtitle="Assign drivers and track pickup status in real-time" />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 bg-white rounded-xl p-4 shadow-md">
            <label className="block text-gray-700 font-semibold mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-md border focus:ring-blue-500 focus:border-blue-500 bg-linear-to-r from-yellow-50 to-yellow-100"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex-1 bg-white rounded-xl p-4 shadow-md">
            <label className="block text-gray-700 font-semibold mb-2">
              Filter by Driver
            </label>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-md border focus:ring-blue-500 focus:border-blue-500 bg-linear-to-r from-blue-50 to-blue-100"
            >
              <option value="">All</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pickups Table */}
        {loading ? (
          <p className="text-gray-500">Loading pickups...</p>
        ) : filteredPickups.length === 0 ? (
          <p className="text-gray-500 text-lg">No pickups found</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-green-400 to-blue-400 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Waste Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Assign
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPickups.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {p.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {p.wasteType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {p.driver?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={p.driver?._id || ""}
                        onChange={(e) => handleAssignDriver(p._id, e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-linear-to-r from-purple-50 to-purple-100 sm:text-sm"
                      >
                        <option value="">Assign Driver</option>
                        {drivers.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ManagePickups;
