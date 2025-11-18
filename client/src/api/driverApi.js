import axios from "./axiosInstance";

// ================================
// GET ALL DRIVERS (ADMIN ONLY)
// ================================
export const getDrivers = async () => {
  try {
  const res = await axios.get("/api/drivers");
    return res.data; // returns array of drivers
  } catch (error) {
    console.error("❌ Failed to fetch drivers:", error);
    throw error.response?.data || { message: "Network error" };
  }
};

// ================================
// GET DRIVER BY ID
// ================================
export const getDriverById = async (driverId) => {
  try {
  const res = await axios.get(`/api/drivers/${driverId}`);
    return res.data; // returns driver object
  } catch (error) {
    console.error("❌ Failed to fetch driver:", error);
    throw error.response?.data || { message: "Network error" };
  }
};

// ================================
// UPDATE DRIVER PROFILE
// ================================
export const updateDriverProfile = async (profileData) => {
  try {
  const res = await axios.put("/api/drivers/profile", profileData);
    return res.data.driver; // backend returns driver object
  } catch (error) {
    console.error("❌ Failed to update driver profile:", error);
    throw error.response?.data || { message: "Network error" };
  }
};

// ================================
// UPDATE DRIVER LIVE LOCATION
// ================================
export const updateDriverLocation = async ({ lat, lng }) => {
  try {
  const res = await axios.put("/api/drivers/location", { lat, lng });
    return res.data.location; // returns updated {lat, lng}
  } catch (error) {
    console.error("❌ Failed to update location:", error);
    throw error.response?.data || { message: "Network error" };
  }
};
