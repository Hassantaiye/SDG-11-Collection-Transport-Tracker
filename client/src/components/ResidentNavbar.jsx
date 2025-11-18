import React from "react";
import { NavLink } from "react-router-dom";

const ResidentNavbar = () => {
  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex space-x-6 py-3">
          <li>
            <NavLink
              to="/resident"
              className={({ isActive }) =>
                isActive
                  ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                  : "text-gray-600 hover:text-teal-600 transition"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resident/create-pickup"
              className={({ isActive }) =>
                isActive
                  ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                  : "text-gray-600 hover:text-teal-600 transition"
              }
            >
              Request Pickup
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resident/mypickups"
              className={({ isActive }) =>
                isActive
                  ? "text-teal-600 font-semibold border-b-2 border-teal-600"
                  : "text-gray-600 hover:text-teal-600 transition"
              }
            >
              My Pickups
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ResidentNavbar;
