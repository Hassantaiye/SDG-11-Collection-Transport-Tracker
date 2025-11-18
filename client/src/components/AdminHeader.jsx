import React from "react";

const AdminHeader = ({ title = "Admin", subtitle = "Manage the application" }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
      <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
};

export default AdminHeader;
