import { useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaChartPie, FaInbox, FaCalendarAlt, FaSearch, FaCog, FaUser} from "react-icons/fa";

const Side = () => {
  const [open, setOpen] = useState(true);

  const Menus = [
    { title: "Dashboard", icon: <FaChartPie className="text-[#82746b]"/> },
    { title: "Inbox", icon: <FaInbox className="text-[#82746b]"/> },
    { title: "Schedule", icon: <FaCalendarAlt className="text-[#82746b]"/> },
    { title: "Profile", icon: <FaUser className="text-[#82746b]"/> },
    { title: "Analytics", icon: <FaChartPie className="text-[#82746b]"/> },
    { title: "Setting", icon: <FaCog className="text-[#82746b]"/> },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } bg-white shadow-2xl h-screen p-5 pt-8 relative duration-300`}
      >
        {/* Toggle Button */}
        <div
          className={`absolute cursor-pointer right-0 top-0 mt-2 mr-2 w-8 h-8 border-dark-purple border-2 rounded-full flex items-center justify-center ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        >
          <IoIosArrowDropleftCircle className="h-6 w-6 text-[#82746b]" />
        </div>

        {/* Title */}
        <div className="flex items-center mb-6">
          <h1 className={`text-[#82746b] font-medium text-2xl leading-none transition-transform ${!open && "scale-0"}`}>
            Doctor Dashboard
          </h1>
        </div>

        {/* Menu Items */}
        <ul>
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`flex items-center py-3 px-4 cursor-pointer hover:bg-gray-100 rounded-md ${
                index === 0 && "bg-gray-100"
              }`}
            >
              <span className="mr-3 text-lg">{menu.icon}</span>
              <span className={`transition-transform ${!open && "scale-0"}`}>
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Side;