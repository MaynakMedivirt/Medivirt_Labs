import React, { useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaChartPie, FaCompactDisc , FaCog, FaUser } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";

const AdminSide = () => {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: "Dashboard", path: "admin/dash", icon: <FaChartPie className="text-[#82746b]" /> },
    { title: "Doctors", path: "/admin/doctors", icon: <FaUserDoctor className="text-[#82746b]" /> }, // Corrected path for Doctors
    { title: "Companies", path: "/admin/companies", icon: <FaCompactDisc  className="text-[#82746b]" /> }, // Corrected path for Companies
    { title: "Manager", path: "/admin/manager", icon: <FaCompactDisc  className="text-[#82746b]" /> }, // Corrected path for Companies
    { title: "Doctor Schedule", path: "/admin/doctorSchedule", icon: <MdManageAccounts className="text-[#82746b]" /> },
    { title: "Doctor Messages",  icon: <MdManageAccounts className="text-[#82746b]" /> },
    { title: "Company Messages",  icon: <MdManageAccounts className="text-[#82746b]" /> },
    { title: "Setting", path: "setting", icon: <FaCog className="text-[#82746b]" /> },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } top-0 left-0 bg-white shadow-2xl h-screen p-5 pt-8 relative duration-300`}
      >
        {/* Toggle Button */}
        <div
          className={`absolute cursor-pointer right-0 top-0 mt-2 mr-2 w-8 h-8 border-dark-purple border-2 rounded-full flex items-center justify-center ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        >
          <IoIosArrowDropleftCircle className="h-6 w-6 text-[#82746b]" />
        </div>

        {/* Title */}
        <div className="flex items-center mb-6">
          <h1 className={`text-[#82746b] font-medium text-2xl leading-none transition-transform ${!open && "scale-0"}`}>
            Admin Dashboard
          </h1>
        </div>

        {/* Menu Items */}
        <ul>
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`flex items-center py-3 px-4 cursor-pointer text-black hover:bg-gray-100 rounded-md ${
                index === 0 && "bg-gray-100"
              }`}
            >
              <Link to={menu.path} className="flex items-center">
                <span className="mr-3 text-lg">{menu.icon}</span>
                <span className={`transition-transform ${!open && "scale-0"}`}>
                  {menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSide;
