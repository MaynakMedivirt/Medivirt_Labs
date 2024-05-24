import React, { useState, useEffect } from 'react';
import MrNavbar from './MrNavbar';
import MrSide from './MrSide';
import { AiFillMessage } from "react-icons/ai";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const MrDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen">
            <MrNavbar />
            <div className="flex flex-1">
                <MrSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-margin duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white border shadow-sm rounded p-5">
                                <div className="flex space-x-4 items-center">
                                    <div>
                                        <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                                            <AiFillMessage className="text-[#7191E6] h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Messages</div>
                                        <div className="text-2xl font-bold text-black">2</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MrDashboard;
