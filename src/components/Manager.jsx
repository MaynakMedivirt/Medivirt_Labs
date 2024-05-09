import React, { useState, useEffect } from "react";
// import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
// import { FaEye, FaRegEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

const Manager = () => {
    
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
                            <h2 className="text-center text-3xl font-bold">Manager List</h2>
                            <Link
                                to="/add-manager"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add manager
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Manager;
