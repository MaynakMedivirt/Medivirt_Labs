import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorNavbar from './DoctorNavbar';
import DoctorSide from './DoctorSide';

const DoctorSchedule = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen">
            <DoctorNavbar />
            <div className="flex flex-1">
                <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
                            Schedule Meetings
                        </h2>
                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col"className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Representative Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="border-b border-gray-200">
                                        <td scope="row" className="px-6 py-4">
                                            1
                                        </td>
                                        <td scope="row" className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                            Pharma
                                        </td>
                                        <td className="px-6 py-4">
                                            Milan
                                        </td>
                                        <td className="px-6 py-4 bg-gray-50">
                                            10-05-2024
                                        </td>
                                        <td className="px-6 py-4">
                                            11:30 AM
                                        </td>
                                        <td className="px-6 py-4 bg-gray-50">
                                            <button type="button" className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                Modify
                                            </button>
                                            <button type="button" className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                Accept
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorSchedule