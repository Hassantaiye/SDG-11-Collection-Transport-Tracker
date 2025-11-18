import React, { useEffect, useState } from "react";
import { getDrivers } from "../../api/driverApi";
import toast from "react-hot-toast";
import AdminLayout from "../../layout/AdminLayout";
import AdminHeader from "../../components/AdminHeader";
import { Search, Phone, Mail, Truck, User } from "lucide-react";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        toast.error("Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700";
      case "on-route":
        return "bg-blue-100 text-blue-700";
      case "maintenance":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <AdminHeader title="Manage Drivers" subtitle="View and manage driver accounts and vehicles" />

        <div className="relative mb-6 w-full sm:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full pl-10 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading drivers...</p>
        ) : filteredDrivers.length === 0 ? (
          <p className="text-gray-500">No drivers found</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr
                    key={driver._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {driver.name}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <User size={14} /> Driver
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      <p className="flex items-center gap-1">
                        <Mail size={15} /> {driver.email}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone size={15} /> {driver.phone || "N/A"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-900 font-medium flex items-center gap-2">
                      <Truck className="text-gray-600" size={18} />
                      {driver.vehicle?.plateNumber || "No vehicle"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          driver.vehicle?.status
                        )}`}
                      >
                        {driver.vehicle?.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageDrivers;
