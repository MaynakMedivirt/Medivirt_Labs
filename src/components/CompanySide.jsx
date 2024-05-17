import React, { useState, useEffect } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaHome, FaUser, FaProductHunt } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaChartLine, FaUserDoctor } from "react-icons/fa6";
import { PiChartPieSliceFill } from "react-icons/pi";
import { TiUserAdd } from "react-icons/ti";
import { IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const CompanySide = ({ open, toggleSidebar }) => {

    const [activeMenu, setActiveMenu] = useState("/companyDashboard");
    const [selectedCity, setSelectedCity] = useState("");
    const { id } = useParams();

    const Menus = [
        { title: "Dashboard", path: `/companyDashboard/${id}`, icon: <FaHome className="text-[#7191E6]" /> },
        { title: "Message", path: `/company/message/${id}`, icon: <AiFillMessage className="text-[#7191E6]" /> },
        { title: "Schedule", path: `/company/schedule/${id}`, icon: <RiCalendarScheduleLine className="text-[#7191E6]" /> },
        { title: "Credits", path: `/company/credits/${id}`, icon: <FaChartLine className="text-[#7191E6]" /> },
        { title: "Profile", path: `/company/profile/${id}`, icon: <FaUser className="text-[#7191E6]" /> },
        { title: "Analytics", path: `/company/analytics/${id}`, icon: <PiChartPieSliceFill className="text-[#7191E6]" /> },
        { title: "My Products", path: `/company/products/${id}`, icon: <FaProductHunt className="text-[#7191E6]" /> },
        { title: "My Doctors", path: `/company/doctors/${id}`, icon: <FaUserDoctor className="text-[#7191E6]" /> },
        { title: "Add Users", path: `/company/users/${id}`, icon: <TiUserAdd className="text-[#7191E6]" /> },
        { title: "Setting", path: `/company/setting/${id}`, icon: <IoSettings className="text-[#7191E6]" /> },
    ];

    const cities = ["Bangalore", "Delhi", "Mumbai", "Kolkata", "Hyderabad", "Chennai", "default-All"];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600 && open) {
                toggleSidebar();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [open, toggleSidebar]);

    const handleMenuClick = (path) => {
        setActiveMenu(path);
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    return (
        <div className="flex flex-col h-screen fixed top-[4.2rem]">
            <div className="flex flex-1">
                <div
                    className={`${open ? "w-72" : "w-20"} top-0 left-0 bg-white shadow-2xl p-5 pt-8 relative duration-300 overflow-y-auto`}
                    style={{ maxHeight: 'calc(100vh - 4.2rem)' }}
                >
                    <div
                        className={`absolute cursor-pointer right-0 top-0 mt-2 mr-2 w-8 h-8 border-[#7191E6] border-2 rounded-full flex items-center justify-center ${!open && "rotate-180"}`}
                        onClick={toggleSidebar}
                    >
                        <IoIosArrowDropleftCircle className="h-6 w-6 text-[#7191E6]" />
                    </div>

                    <div className="my-3">
                        <select
                            className="w-full px-4 py-2 border bg-white shadow-lg border rounded-md focus:outline-none"
                            value={selectedCity}
                            onChange={handleCityChange}
                        >
                            <option value="">Select City</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ul>
                        {Menus.map((menu, index) => (
                            <li
                                key={index}
                                className={`flex items-center py-3 mt-2 px-4 cursor-pointer hover:bg-white hover:shadow hover:border text-[#808080] font-bold ${menu.path === activeMenu ? "bg-white-100" : ""} ${menu.path === activeMenu && open ? "shadow-xl border" : ""}`}
                                onClick={() => handleMenuClick(menu.path)}
                            >
                                <Link to={menu.path} className="flex items-center">
                                    <span className="mr-4 text-xl">{menu.icon}</span>
                                    <span className={`transition-transform ${!open && "scale-0"}`}>
                                        {menu.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CompanySide;
