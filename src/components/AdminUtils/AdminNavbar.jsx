import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from '../AuthContext';

const AdminNavbar = () => {
  const [logoutState, setLogoutState] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b w-full sticky top-0 z-40">
      <div className="flex items-center shadow justify-between py-3 px-6 mx-auto">
        <div>
          <NavLink
            to="/"
            className="text-[#a9a9a9] text-2xl hover:text-[#383737] transition-all "
          >
            MEDIVIRT
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <FaUser
            className="text-[#82746b] text-2xl hover:text-[#383737] transition-all cursor-pointer"
            onClick={() => setLogoutState(!logoutState)}
          />
          {logoutState && (
            <ul className="absolute bg-white top-12 right-0 mt-5 space-y-5 border rounded-md text-sm shadow-md">
              <li>
                <button
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
