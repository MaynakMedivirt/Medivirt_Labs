import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate , Link, Navigate} from "react-router-dom";
import { useAuth } from "../AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Manager = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const { isAdminLoggedIn } = useAuth();

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const db = getFirestore();
                const managersCollection = collection(db, "managers");
                const snapshot = await getDocs(managersCollection);
                const managersData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setManagers(managersData);
            } catch (error) {
                setError("Error fetching managers: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchManagers();
    }, []);

    const handleEditProfile = (managerId) => {
        navigate(`/edit-manager/${managerId}`);
    };

    // const handleGoTo = (managerId) => {
    //     navigate(`/manager/dash/${managerId}`);
    // }

    const handleDeleteProfile = async (managerId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this profile?"
        );

        // If the user confirms the action
        if (confirmed) {
            try {
                const db = getFirestore();
                await deleteDoc(doc(db, "managers", managerId));
                setManagers((prevManagers) =>
                    prevManagers.filter((manager) => manager.id !== managerId)
                );
            } catch (error) {
                console.error("Error deleting manager profile:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAdminLoggedIn) {
        return <Navigate to="/admin" />;
      }

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
                                Add Manager
                            </Link>
                        </div>

                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 bg-gray-50 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Manager Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 bg-gray-50 text-sm uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th scope="col" className="px-6 py-3 bg-gray-50text-sm uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {managers.map((manager, index) => (
                                        <tr key={manager.id} className="border-b border-gray-200">
                                            <td scope="row" className="px-6 py-4 bg-gray-50">
                                                {index + 1}
                                            </td>
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900">
                                                {manager.name}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                {manager.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {manager.location}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                <button type="button" onClick={() => handleEditProfile(manager.id)} className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                    <FaRegEdit />
                                                </button>
                                                <button type="button" onClick={() => handleDeleteProfile(manager.id)} className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                    <MdDelete />
                                                </button>
                                                {/* <button type="button" onClick={() => handleGoTo(manager.id)} className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                    Enter
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Manager;
