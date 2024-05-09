import React, { useState, useEffect } from "react";
// import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
// import { FaEye, FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

const ScheduleList = () => {
    
    // const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // const { currentUser } = useAuth();

    // if (loading) {
    //     return <div>Loading...</div>;
    // }



    return (
        <div className="flex">
            <AdminSide />
            <div className="flex-1 overflow-hidden">
                <AdminNavbar />
                <div className="container mx-auto px-5 md:px-3 h-full overflow-y-scroll overflow-x-scroll">
                    <div className="border mt-4 p-2">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-center text-3xl font-bold">Schedule List</h2>
                        </div>

                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
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
    );
};

export default ScheduleList;
