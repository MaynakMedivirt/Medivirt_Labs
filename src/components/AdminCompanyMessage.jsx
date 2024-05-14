import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";

const AdminCompanyMessage = () => {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAdminLoggedIn } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const db = getFirestore();
                const messageCollection = collection(db, "messages");
                const snapshot = await getDocs(messageCollection);

                const fetchCompanyData = async (companyId) => {
                    const companyDocRef = doc(db, "companies", companyId);
                    const companyDocSnapshot = await getDoc(companyDocRef);
                    return companyDocSnapshot.exists() ? companyDocSnapshot.data() : null;
                };

                const fetchDoctorData = async (doctorId) => {
                    const doctorDocRef = doc(db, "doctors", doctorId);
                    const doctorDocSnapshot = await getDoc(doctorDocRef);
                    return doctorDocSnapshot.exists() ? doctorDocSnapshot.data() : null;
                };

                const promises = snapshot.docs.map(async (doc) => {
                    const messageData = doc.data();

                    if (messageData.sentBy === "doctor") {
                        const companyData = await fetchCompanyData(messageData.companyID);
                        const companyName = companyData ? companyData.companyName : "Unknown Company";
                        const representativeName = companyData ? companyData.name : "Unknown Representative";

                        const doctorData = await fetchDoctorData(messageData.doctorID);
                        const doctorName = doctorData ? doctorData.name : "Unknown Doctor";

                        return {
                            id: doc.id,
                            companyName,
                            representativeName,
                            doctorName,
                            ...messageData,
                        };
                    } else {
                        return null;
                    }
                });

                const resolvedData = await Promise.all(promises);
                setMessage(resolvedData.filter(Boolean)); // Filter out null values
            } catch (error) {
                setError("Error fetching messages: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessage();
    }, []);

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
                            <h2 className="text-center text-3xl font-bold">Company Message</h2>
                        </div>

                        <div className="overflow-auto mt-3">
                            {message.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                        <tr>
                                            <th scope="col" className="px-2 py-2 text-sm tracking-wider">
                                                S.N.
                                            </th>
                                            <th scope="col" className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider">
                                                Company Name
                                            </th>
                                            <th scope="col" className="px-2 py-2 text-sm uppercase tracking-wider">
                                                Representative Name
                                            </th>
                                            <th scope="col" className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider">
                                                Doctor Name
                                            </th>
                                            <th scope="col" className="px-2 py-2 text-sm uppercase tracking-wider">
                                                Message
                                            </th>
                                            <th scope="col" className="px-2 py-2 bg-gray-50 text-sm uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white text-sm divide-y divide-gray-200">
                                        {message.map((message, index) => (
                                            <tr key={message.id} className="border-b border-gray-200">
                                                <td scope="row" className="px-2 py-2">
                                                    {index + 1}
                                                </td>
                                                <td scope="row" className="px-2 py-2 font-bold text-gray-900 bg-gray-50">
                                                    {message.companyName}
                                                </td>
                                                <td className="px-2 py-2">
                                                    {message.representativeName}
                                                </td>
                                                <td className="px-2 py-2 bg-gray-50">
                                                    {message.doctorName}
                                                </td>
                                                <td className="px-2 py-2">
                                                    {message.messages}
                                                </td>
                                                <td className="px-2 py-2 bg-gray-50">
                                                    <button type="button" className="text-white bg-[#7091E6] rounded-lg p-2 text-center me-2 mb-2">
                                                        Reply
                                                    </button>
                                                    <button type="button" className="text-white bg-[#7091E6] rounded-lg p-2 text-center me-2 mb-2">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No messages sent by doctors.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCompanyMessage;
