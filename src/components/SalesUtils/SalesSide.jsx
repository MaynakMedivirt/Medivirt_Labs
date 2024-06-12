import React, { useEffect } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { FaHome, FaProductHunt } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { PiChartPieSliceFill } from "react-icons/pi";
import { TiUserAdd } from "react-icons/ti";
import { IoSettings } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const SalesSide = ({ open, toggleSidebar }) => {
    const { pathname } = useLocation();
    const { id } = useParams();

    const Menus = [
        {title: "Dashboard",path: `/salesDashboard/${id}`,icon: <FaHome className="text-[#7191E6]" />,},
        {title: "Message",path: `/sales/message/${id}`,icon: <AiFillMessage className="text-[#7191E6]" />,},
        {title: "Schedule",path: `/sales/schedule/${id}`,icon: <RiCalendarScheduleLine className="text-[#7191E6]" />,},
        {title: "My Doctors",path: `/sales/doctors/${id}`,icon: <FaUserDoctor className="text-[#7191E6]" />,},
        {title: "Analytics",path: `/sales/analytics/${id}`,icon: <PiChartPieSliceFill className="text-[#7191E6]" />,},
        {title: "My Products",path: `/sales/products/${id}`,icon: <FaProductHunt className="text-[#7191E6]" />,},
        {title: "Add Users",path: `/sales/users/${id}`,icon: <TiUserAdd className="text-[#7191E6]" />,},
        {title: "Setting",path: `/sales/setting/${id}`,icon: <IoSettings className="text-[#7191E6]" />,},
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && open) {
                toggleSidebar();
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [open, toggleSidebar]);

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <div className="flex flex-col h-screen fixed top-[4.2rem] z-50">
            <div className="flex flex-1">
                <div
                    className={`${open ? "w-60" : "w-20"} top-0 left-0 bg-white shadow-2xl p-5 pt-8 relative ${window.innerWidth < 768 ? "" : "overflow-y-auto"}`}
                    style={{
                        maxHeight: "calc(100vh - 4.2rem)",
                        overflowX: open ? "auto" : "hidden",
                        scrollbarWidth: "thin",
                    }}
                >
                    <div
                        className={`absolute cursor-pointer right-0 top-0 mt-2 mr-2 w-8 h-8 border-[#7191E6] border-2 rounded-full flex items-center justify-center 
                        ${window.innerWidth >= 768 && open? "transition-all duration-300": "mr-4"}`}
                        onClick={toggleSidebar}
                    >
                        <IoIosArrowDropleftCircle className={`h-6 w-6 text-[#7191E6] 
                                ${window.innerWidth >= 768 && open ? "" : "transform rotate-180"}`}
                        />
                    </div>

                    <div className={`text-md font-bold text-center text-[#7191E6] ${open ? "" : "mt-2"}`}>
                        {open ? "Role : Sales Head" : "SH"}
                    </div>

                    <ul>
                        {Menus.map((menu, index) => (
                            <li
                                key={index}
                                className={`flex items-center py-3 mt-2 px-2 cursor-pointer hover:bg-white hover:shadow hover:border ${open ? "" : "hover:pr-7"
                                    } text-[#808080] font-bold ${pathname === menu.path && !open ? "pr-7" : ""
                                    } ${pathname === menu.path ? "bg-white shadow-xl border" : ""}`}
                            >
                                <Link
                                    to={menu.path}
                                    className="flex items-center"
                                    onClick={handleLinkClick}
                                >
                                    <span className="mr-4 text-xl">{menu.icon}</span>
                                    {open && window.innerWidth >= 768 && (
                                        <span
                                            className={`transition-transform ${!open && "scale-0"}`}
                                        >
                                            {menu.title}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SalesSide;
