import React, { useState } from "react";
import { registerUser } from "../../api/authApi";
import toast from "react-hot-toast";
import { User, Mail, Lock, Phone, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "resident",
    plateNumber: "",
    type: "", // Changed from vehicleType to type
    vehicleStatus: "",
  });
  const [loading, setLoading] = useState(false);

  // Define allowed vehicle types based on backend enum
  const vehicleTypes = [
    "Truck",
    "Van", 
    "Pickup",
    "Mini-Truck",
    "Three-Wheeler",
    "Compact-Van",
    "Lorry",
    "Trailer"
  ];

  const vehicleStatuses = [
    "available",
    "on-route", 
    "maintenance"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clean up the data before sending - use correct field names
    const payload = { ...formData };

    // Remove vehicle fields for non-driver roles
    if (payload.role !== "driver") {
      delete payload.plateNumber;
      delete payload.type; // Changed from vehicleType to type
      delete payload.vehicleStatus;
    }

    // Validate required fields
    if (!payload.name || !payload.email || !payload.password) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Driver-specific validation
    if (payload.role === "driver") {
      if (!payload.plateNumber || !payload.type || !payload.vehicleStatus) {
        toast.error("Please fill all vehicle details");
        setLoading(false);
        return;
      }
    }

    console.log("📤 Sending payload:", payload);

    try {
      const res = await registerUser(payload);
      toast.success("Registration successful!");
      console.log("✅ REGISTER RESPONSE:", res);
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("❌ REGISTRATION ERROR:", error);
      
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      
      toast.error(errorMessage);
      
      if (error.response) {
        console.error("🔍 Server response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Create an Account
        </h2>
        <p className="text-gray-500 text-center">
          Fill in your details to register
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
            />
          </div>

          {/* ROLE */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
          >
            <option value="resident">Resident</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>

          {/* VEHICLE FIELDS (DRIVER ONLY) */}
          {formData.role === "driver" && (
            <div className="space-y-3 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Vehicle Information</p>
              
              <div className="relative">
                <Truck className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="plateNumber"
                  placeholder="Vehicle Plate Number *"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
                />
              </div>

              {/* VEHICLE TYPE DROPDOWN - field name changed to "type" */}
              <select
                name="type" // Changed from vehicleType to type
                value={formData.type} // Changed from vehicleType to type
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
              >
                <option value="">Select Vehicle Type *</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* VEHICLE STATUS DROPDOWN */}
              <select
                name="vehicleStatus"
                value={formData.vehicleStatus}
                onChange={handleChange}
                required
                className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition"
              >
                <option value="">Select Vehicle Status *</option>
                {vehicleStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;