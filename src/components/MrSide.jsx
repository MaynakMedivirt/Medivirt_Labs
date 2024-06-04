import React, { useState, useEffect } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaHome, FaProductHunt } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { PiChartPieSliceFill } from "react-icons/pi";
import { IoSettings } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const MrSide = ({ open, toggleSidebar }) => {
    const [activeMenu, setActiveMenu] = useState("");
    const { id } = useParams();
    const { pathname } = useLocation();

    useEffect(() => {
        setActiveMenu(pathname);
    }, [pathname]);

    const Menus = [
        { title: "Dashboard", path: `/mrDashboard/${id}`, icon: <FaHome className="text-[#7191E6]" /> },
        { title: "Message", path: `/mr/message/${id}`, icon: <AiFillMessage className="text-[#7191E6]" /> },
        { title: "Schedule", path: `/mr/schedule/${id}`, icon: <RiCalendarScheduleLine className="text-[#7191E6]" /> },
        { title: "My Doctors", path: `/mr/doctors/${id}`, icon: <FaUserDoctor className="text-[#7191E6]" /> },
        { title: "Analytics", path: `/mr/analytics/${id}`, icon: <PiChartPieSliceFill className="text-[#7191E6]" /> },
        { title: "My Products", path: `/mr/products/${id}`, icon: <FaProductHunt className="text-[#7191E6]" /> },
        { title: "Setting", path: `/mr/setting/${id}`, icon: <IoSettings className="text-[#7191E6]" /> },
    ];

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

    return (
        <div className="flex flex-col h-screen fixed top-[4.2rem]">
            <div className="flex flex-1">
                <div
                    className={`${open ? "w-72" : "w-20"} top-0 left-0 bg-white shadow-2xl p-5 pt-8 relative duration-300 overflow-y-auto`}
                    style={{ maxHeight: 'calc(100vh - 4.2rem)' }}
                >
                    <h2 className="text-center text-xl mt-2 font-semibold">
                        {open ? "Medical Representative" : "MR"}
                    </h2>
                    <div
                        className={`absolute cursor-pointer right-0 top-0 mt-2 mr-2 w-8 h-8 border-[#7191E6] border-2 rounded-full flex items-center justify-center ${!open && "rotate-180"} ${activeMenu === `/mrDashboard/${id}` && "shadow"}`}
                        onClick={toggleSidebar}
                    >
                        <IoIosArrowDropleftCircle className="h-6 w-6 text-[#7191E6]" />
                    </div>
                    <ul>
                        {Menus.map((menu, index) => (
                            <li
                                key={index}
                                className={`flex items-center py-3 mt-2 px-4 cursor-pointer hover:bg-white hover:shadow hover:border text-[#808080] font-bold ${menu.path === activeMenu ? "bg-white shadow-xl border" : ""}`}
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

export default MrSide;
